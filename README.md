![Build Status](https://img.shields.io/github/actions/workflow/status/yash-pouranik/urbackend/ci.yml?branch=main)
![License](https://img.shields.io/github/license/yash-pouranik/urbackend)
![Issues](https://img.shields.io/github/issues/yash-pouranik/urbackend)
![Stars](https://img.shields.io/github/stars/yash-pouranik/urbackend)
[DISCORD](https://discord.gg/CXJjvJkNWn)

# urBackend 🚀

urBackend is an instant **"Backend-as-a-Service" (BaaS)** platform designed for frontend developers. It empowers you to create projects, define database schemas, manage authentication, and handle file storage without writing a single line of backend code.

Stop writing boilerplate. Get an instant Database, Authentication, and Storage API for your next big idea.

## ✨ Features

- **⚡ Instant NoSQL Database**: Create collections and push JSON data instantly. No server setup required.
- **🛡️ Authentication**: Built-in User Management (Sign Up, Login, Profile) secured with JWT.
- **📂 Cloud Storage**: Upload, manage, and delete files/images with public CDN links.
- **📊 Real-time Analytics**: Monitor API usage, traffic, and storage limits via the dashboard.
- **🛠️ Visual Schema Builder**: Define table columns (String, Number, Boolean, Date) through an intuitive UI.
- **🔒 Security**: API Key-based access control and Row Level Security.

> [!IMPORTANT]
> **Security Warning**: Your `x-api-key` grants **Admin Access** (Read/Write/Delete).
>
> - ❌ **NEVER** use this key in client-side code (frontend).
> - ✅ **ONLY** use this key in secure server-side environments.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**
- React Router DOM
- Axios
- Lucide React (Icons)
- Recharts (Analytics)

### Backend
- **Node.js & Express**
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Multer (File Handling)
- Supabase (Cloud Storage)

## 📖 API Usage Guide

Once your project is created in the dashboard, use your **Public API Key** to make requests.

### Base URL

```
https://api.urbackend.bitbros.in
```

### 1. Authentication

**Sign Up User:**

```javascript
await fetch('https://api.urbackend.bitbros.in/api/userAuth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securePassword123",
    name: "John Doe" // Optional
  })
});
```

**Login User:**

```javascript
const res = await fetch('https://api.urbackend.bitbros.in/api/userAuth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securePassword123"
  })
});
const data = await res.json(); // Returns { token: "JWT_TOKEN", user: {...} }
```

**Get Profile (Me):**

```javascript
await fetch('https://api.urbackend.bitbros.in/api/userAuth/me', {
  method: 'GET',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Authorization': 'Bearer <USER_TOKEN>' // From login response
  }
});
```

### 2. Database API

**Get All Items:**

```javascript
// Replace :collectionName with your actual collection name (e.g., 'products')
const res = await fetch('https://api.urbackend.bitbros.in/api/data/products', {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});
const data = await res.json();
```

**Insert Data:**

```javascript
await fetch('https://api.urbackend.bitbros.in/api/data/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    name: "MacBook Pro",
    price: 1299,
    inStock: true
  })
});
```

**Get / Update / Delete by ID:**

```javascript
const id = "DOCUMENT_ID"; // The '_id' from the document

// Get One
await fetch(`https://api.urbackend.bitbros.in/api/data/products/${id}`, {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});

// Update
await fetch(`https://api.urbackend.bitbros.in/api/data/products/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({ price: 1199 })
});

// Delete
await fetch(`https://api.urbackend.bitbros.in/api/data/products/${id}`, {
  method: 'DELETE',
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});
```

### 3. Storage API

**Upload File:**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const res = await fetch('https://api.urbackend.bitbros.in/api/storage/upload', {
  method: 'POST',
  headers: { 'x-api-key': 'YOUR_API_KEY' },
  body: formData
});
const data = await res.json();
// Returns { url: "...", path: "project_id/filename.jpg" }
```

**Delete File:**

```javascript
await fetch('https://api.urbackend.bitbros.in/api/storage/file', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    path: "PROJECT_ID/filename.jpg" // The 'path' from upload response
  })
});
```

## ⚠️ Limits & Quotas

- **Rate Limit**: 100 requests / 15 mins per IP.
- **Database Size**: Max 50 MB per project.
- **File Storage**: Max 100 MB per project.
- **File Upload Size**: Max 5 MB per file.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started, development workflow, and our code of conduct.

---

## 🗺️ Roadmap & Upcoming Features

UrBackend is just getting started. Here’s what’s on the horizon:
- [ ] **MongoDB**: Apis for more complex queries on dashboard + for urbackend.
- [ ] **Webhooks**: Notify your frontend on database changes.
- [ ] **PostgreSQL Support**: Expand beyond MongoDB (Very tough but we will build together with the community ❤️).
- [ ] **Plug-and-Play UI Components**: React components for login/signup.
- [ ] **Advanced Logs**: Detailed API request tracing.
- [ ] **Role-Based Access Control (RBAC)**: Fine-grained permissions.

Want to see a feature? [Open an issue!](https://github.com/yash-pouranik/urbackend/issues)

<a href="https://github.com/yash-pouranik/urbackend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yash-pouranik/urbackend" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

Built with ❤️ for **urbackend**
