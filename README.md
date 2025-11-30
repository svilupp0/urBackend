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

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Connection URL
- Supabase Account (for Storage)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=1234
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

Start the server:

```bash
npm start
# Server will run on http://localhost:1234
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Update `frontend/src/config.js` (if necessary):

```javascript
export const API_URL = 'http://localhost:1234';
```

Start the client:

```bash
npm run dev
# App will run on http://localhost:5173
```

## 📖 API Usage Guide

Once your project is created in the dashboard, use your **Public API Key** to make requests.

### 1. Database API

**Insert Data:**

```javascript
await fetch('http://localhost:1234/api/data/products', {
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

**Fetch Data:**

```javascript
const res = await fetch('http://localhost:1234/api/data/products', {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});
const data = await res.json();
```

### 2. Authentication API

**Register User:**

```javascript
await fetch('http://localhost:1234/api/userAuth/signup', {
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
```

### 3. Storage API

**Upload File:**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const res = await fetch('http://localhost:1234/api/storage/upload', {
  method: 'POST',
  headers: { 'x-api-key': 'YOUR_API_KEY' },
  body: formData
});
// Returns { url: "..." }
```

## ⚠️ Limits & Quotas

- **Rate Limit**: 100 requests / 15 mins per IP.
- **Database Size**: Max 50MB per project.
- **File Storage**: Max 100MB per project (5MB max per file).

## 🤝 Contributing

1. Fork the Repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ by **Yash Pouranik**