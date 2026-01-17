# urBackend Development Log

**urBackend**: [https://urbackend.bitbros.in](https://urbackend.bitbros.in)  
**Github**: [https://github.com/yash-pouranik/urbackend](https://github.com/yash-pouranik/urbackend)

---

## 16-01-2026 - Optimization: User Dashboard Projects Query

### Context
On the user dashboard, I display a list of all projects owned by the logged-in user. The UI only requires the project name and description, but the backend query was returning the full Project document.

### Original Issue
* Query fetched **all fields** from the Project model (≈15 fields)
* Unnecessary data transfer and Mongoose document hydration
* Not optimal for a frequently hit dashboard endpoint

### Changes Implemented
```javascript
const projects = await Project.find({ owner: req.user._id })
    .select('name description')
    .lean();
```

Additionally, I created an index:
```javascript
projectSchema.index({ owner: 1 });
```

### Why This Improves Performance
* **`select('name description')`**: Reduces payload size and serialization cost
* **`.lean()`**: Skips Mongoose document hydration (plain JS objects)
* **Index on owner**: Avoids collection scans and significantly improves query speed

### Key Learning
* `select()` optimizes data transfer, not query execution
* **Indexes** drive real query speed
* `.lean()` is critical for read-heavy, display-only endpoints

### Result
* Faster dashboard load time
* Lower memory and CPU usage on the backend
* Cleaner and safer API response

---

## 16-01-2026 - API Key Middleware Redis Caching

### Context
The API-key authentication middleware runs on every incoming request. Originally, each request queried MongoDB to validate the API key and check the project owner’s verification status, making this a hot path and a potential performance bottleneck.

### Problem
* Repeated MongoDB queries for the same API key
* Increased latency under high request volume
* Unnecessary load on the database for read-heavy authentication checks

### Optimization Implemented
I introduced Redis caching for API-key validation.

#### Cache Strategy
* **Redis String**: JSON-serialized object
* **Cache key**: `project:apikey:{hashedApiKey}`
* **Cached data**:
    * `projectId`
    * `owner.isVerified`
    * Minimal project metadata required by middleware
* **TTL**: 2 hours

#### Updated Flow
1. Hash incoming API key
2. Check Redis for cached project
3. On cache hit > skip MongoDB
4. On cache miss > query MongoDB, cache result, continue
5. Verify owner status before allowing request

### Why Redis String
* Entire project object is read at once
* No partial updates required
* Simple GET / SET pattern
* Easy invalidation

### Cache Invalidation Strategy
Cache is explicitly invalidated when:
* API key is rotated
* Project is deleted
* Project ownership or verification status changes

### Key Learnings
* Middleware is a high-impact caching target
* `select()` optimizes payload size, not query execution
* Redis significantly reduces DB load for auth-heavy systems
* Correct invalidation is critical for security

### Result
* Reduced authentication latency
* Lower MongoDB query volume
* More scalable API-key validation path

---

## 17-01-2026 - Handling Write Operations with RContext

### Context
After introducing Redis caching for API-key middleware, `req.project` started coming from Redis instead of MongoDB. Redis returns plain JavaScript objects, not hydrated Mongoose documents.

### Problem
Some controllers (e.g., `insertData`) perform write operations on the Project model, such as updating `databaseUsed`.
When the project object came from Redis:
> `project.save is not a function`

This happened because cached objects do not have Mongoose instance methods.

### Initial Considerations
I evaluated multiple approaches:
* Skipping `.save()` (unsafe, loses consistency)
* Rehydrating cached objects into Mongoose documents (error-prone)
* Moving writes to background jobs (correct but premature)
* Refetching the document on every write (works but adds overhead)

### Final Solution
I replaced the read-modify-write pattern with **atomic MongoDB updates**.

```javascript
await Project.updateOne(
    { _id: project._id },
    { $inc: { databaseUsed: docSize } }
);
```

### Why This Works
* Avoids document hydration
* Single database call
* Atomic and concurrency-safe
* Keeps MongoDB as the source of truth
* Cache remains strictly read-only

### Key Learning
* Redis caching must be treated as a **read optimization**.
* All mutations should go through the database using atomic operations.

### Result
* No runtime crashes
* Lower database overhead
* Clear separation between read and write paths
* More scalable quota enforcement logic