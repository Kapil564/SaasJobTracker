# Contributing to CareerTransit

Thank you for your interest in contributing to CareerTransit! We welcome contributions from the community. This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher)
- npm or yarn
- Git
- A Neon database account
- Basic knowledge of React and Node.js

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/SaasJobTracker.git
cd SaasJobTracker
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/original-owner/SaasJobTracker.git
```

## 🛠 Development Setup

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```env
NODE_ENV=development
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Initialize database and start server:

```bash
node src/lib/createTables.js
npm run dev
```

### Frontend Setup

```bash
cd ../client
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start development server:

```bash
npm run dev
```

## 🔄 Development Workflow

### 1. Choose an Issue

- Check the [Issues](https://github.com/your-repo/issues) page for open tasks
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes

- Write clear, focused commits
- Test your changes thoroughly
- Follow the coding standards below

### 4. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

## 💻 Coding Standards

### JavaScript/React

- Use ES6+ features
- Use `const` and `let` instead of `var`
- Use arrow functions for anonymous functions
- Use template literals for string interpolation
- Follow React hooks rules
- Use meaningful variable and function names

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use descriptive commit messages
- Keep lines under 100 characters

### File Structure

- Group related components together
- Use kebab-case for file names (e.g., `job-card.jsx`)
- Place utility functions in appropriate directories
- Keep components small and focused

### Example Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobCard = ({ job, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (updatedJob) => {
    try {
      await axios.patch(`/api/applications/${job.id}`, updatedJob);
      onUpdate(updatedJob);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  return (
    <div className="job-card">
      {/* Component JSX */}
    </div>
  );
};

export default JobCard;
```

## 🧪 Testing

### Backend Testing

```bash
cd server
npm test
```

Tests are located in the `tests/` directory. When adding new features:

1. Create corresponding test files
2. Write unit tests for functions
3. Write integration tests for API endpoints
4. Ensure all tests pass before submitting

### Frontend Testing

```bash
cd client
npm run lint
```

The project uses ESLint for code quality. Ensure:

- No linting errors
- Code follows the established patterns
- Components are properly structured

## 📝 Submitting Changes

### Commit Guidelines

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep the first line under 50 characters
- Add detailed description if needed

Examples:
```
Add user authentication middleware
Fix drag-and-drop bug in Kanban board
Update README with installation instructions
```

### Pull Request Process

1. Ensure your branch is up-to-date with main
2. Run tests and linting
3. Push your changes:

```bash
git push origin your-branch-name
```

4. Create a Pull Request on GitHub with:
   - Clear title describing the changes
   - Detailed description of what was implemented
   - Screenshots for UI changes
   - Reference to any related issues

5. Wait for review and address any feedback

### Pull Request Template

Please use this template when creating PRs:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes.

## Related Issues
Fixes #issue-number
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable
- Code snippets if relevant

### Feature Requests

For new features, please provide:

- Clear description of the proposed feature
- Use case and benefits
- Mockups or examples if applicable
- Any technical considerations

## 📞 Getting Help

If you need help or have questions:

- Check existing issues and documentation
- Create a new issue with detailed information
- Join our community discussions

## 🎯 Areas for Contribution

- Frontend UI/UX improvements
- Backend API development
- Database optimization
- Testing and quality assurance
- Documentation
- Performance optimization
- Accessibility improvements

Thank you for contributing to CareerTransit! 🚀</content>
<parameter name="filePath">c:\Users\kapil\Desktop\projects\SaasJobTracker\CONTRIBUTING.md