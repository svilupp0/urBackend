# Contributing to urBackend

Thank you for your interest in contributing to urBackend! We welcome contributions to help make this "Backend-as-a-Service" platform even better.

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## 🚀 Getting Started

### 1. Fork and Clone
Fork the repository to your GitHub account and then clone it locally:

```bash
git clone https://github.com/YOUR_USERNAME/urBackend.git
cd urBackend
```

### 2. Project Structure
The repository is organized into two main directories:
- **`backend/`**: Node.js & Express application handling the API, database, and authentication.
- **`frontend/`**: React.js (Vite) application for the user dashboard.

### 3. Setup and Installation

#### Backend
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file (refer to `README.md` for required variables).
4. Start the server:
   ```bash
   npm start
   ```

#### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

1. **Create a Branch**: Always create a new branch for your work. Use descriptive names like `feature/new-login-ui` or `fix/database-connection`.
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Implement your feature or fix. 

3. **Test Your Changes**:
   - **Backend**: Run tests using Jest.
     ```bash
     cd backend
     npm test
     ```
   - **Frontend**: Ensure there are no linting errors.
     ```bash
     cd frontend
     npm run lint
     ```

4. **Commit**: Use clear and concise commit messages.
   ```bash
   git commit -m "Add feature X"
   ```

5. **Push**: Push your branch to your forked repository.
   ```bash
   git push origin feature/your-feature-name
   ```

## 📬 Submitting a Pull Request (PR)

1. Go to the original repository and click "Compare & pull request".
2. Provide a clear title and description of your changes.
3. Link any related issues (e.g., "Fixes #123").
4. Wait for review and address any feedback.

## 🐛 Reporting Bugs & Feature Requests

- **Bugs**: If you find a bug, please create an issue describing the problem, steps to reproduce, and expected behavior.
- **Features**: If you have an idea for a new feature, feel free to open an issue to discuss it before starting implementation.

## 🤝 Code of Conduct

Please be respectful and considerate of others. We aim to create a welcoming and inclusive environment for all contributors.

---
Happy Coding! 🚀
