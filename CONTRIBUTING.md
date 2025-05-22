# Contributing to WebAudioTranscriber

Thank you for your interest in contributing to WebAudioTranscriber! We appreciate your time and effort in making this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/WebAudioTranscriber.git
   cd WebAudioTranscriber
   ```
3. **Set up** the development environment
   ```bash
   # Install dependencies
   npm install
   
   # Set up environment variables (copy .env.example to .env)
   cp .env.example .env
   ```
4. **Run** the development server
   ```bash
   # Start client and server in development mode
   npm run dev:all
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. Make your changes and commit them following the [commit guidelines](#commit-guidelines)

3. Push your changes to your fork
   ```bash
   git push origin your-branch-name
   ```

4. Open a Pull Request against the `main` branch

## Code Style

We use the following tools to maintain code quality and style:

- **TypeScript**: Strict mode enabled
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **EditorConfig**: For consistent editor settings

Before committing, please run:
```bash
# Format code
npm run format

# Lint code
npm run lint

# Run type checking
npm run type-check
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This allows us to automatically generate changelogs and determine version bumps.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

### Examples

```
feat(auth): add login with Google

Add Google OAuth authentication support using Passport.js

Closes #123
```

```
fix(server): prevent race condition in user registration

Add proper locking mechanism to prevent duplicate user registration

Fixes #456
```

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations, and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Reporting Issues

When opening an issue, please include:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots or error messages (if applicable)
6. Environment information (browser, OS, Node.js version, etc.)

## License

By contributing, you agree that your contributions will be licensed under its [MIT License](LICENSE).
