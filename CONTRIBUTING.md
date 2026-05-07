# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the CHEATSHEET.md with details of command translations.
3. Update the README.md with details of changes to the API.
4. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm run test

# Coverage
npm run test:c
```

## Code Style

- ESLint with flat config
- 2-space indentation
- Single quotes
- No semicolons

See [ESLint config](./eslint.config.mjs) for details.