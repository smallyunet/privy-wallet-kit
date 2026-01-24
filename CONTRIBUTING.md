# Contributing to Privy Wallet Kit

Thank you for your interest in contributing to Privy Wallet Kit! We welcome contributions from the community.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/privy-wallet-kit.git
    cd privy-wallet-kit
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Development

To start the development server with the playground app:

```bash
npm run dev
```

To run Storybook for component development:

```bash
npm run storybook
```

## Code Style

We use **Prettier** for code formatting and **ESLint** for linting. Please ensure your code is formatted and linted before submitting a PR.

```bash
npm run lint
npm run format
```

## Submitting a Pull Request

1.  Create a new branch for your feature or fix: `git checkout -b feature/my-new-feature`.
2.  Commit your changes with clear commit messages.
3.  Push your branch to your fork.
4.  Open a Pull Request against the `main` branch of the original repository.
5.  Describe your changes and link to any relevant issues.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## Release (Maintainers)

This repo publishes to npm automatically when you push a git tag like `v0.0.8`.

Prerequisites:

- Add a repository secret named `NPM_TOKEN` with an npm access token that has publish rights for `privy-wallet-kit`.

Release steps:

1. Bump the version in `package.json` (and update `CHANGELOG.md`).
2. Run `npm test` and `npm run build` locally.
3. Commit and push to `main`.
4. Tag and push:
   - `git tag v0.0.8`
   - `git push origin v0.0.8`

GitHub Actions will verify the tag matches the `package.json` version, then run build/lint/tests, and finally `npm publish`.
