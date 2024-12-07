# GitHub Actions JWT generator

Do you want to send an HTTP request using HTTPie or CURL with a signed JWT token and wondering how you can create the token for a given payload and secret? Well, look no further!

## Installation
```yaml
- name: JWT Generator
  uses: salscode/github-actions-jwt-generator@1.0.0
```

## Usage

The required inputs are `secret` and `payload`. It is recommended to store the secret as an encrypted [environment variable.](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables)

### Inputs

- `secret` (required): The shared secret used to sign the JWTs
- `payload` (required): The payload to encrypt (must be valid JSON)

### Outputs

- `token`: The generated JWT token

The token is generated with the specified HMAC SHA algorithm (defaults to HS256).

### Example usage
```yaml
on: [push]

jobs:
  send:
    name: Send new verison
    runs-on: ubuntu-latest
    steps:
      - name: JWT Generator
        id: jwtGenerator
        uses: salscode/github-actions-jwt-generator@1.0.0
        with:
          secret: ${{ secrets.JWT_SECRET }}
          payload: '{"hello":"world"}'
      - name: Use Token
        run: echo ${{ steps.jwtGenerator.outputs.token }}
```

## Development

This action requires production dependencies to be committed to the repository. When making changes:

1. Install dev dependencies for development:
```bash
yarn install
```

2. Make your changes and test:
```bash
yarn build
yarn test
```

3. Prepare for release:
```bash
rm -rf node_modules
yarn install --production
```

4. Commit and create a new release
