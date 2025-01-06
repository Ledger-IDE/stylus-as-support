# Stylus-AS-Support

This project implements a token contract on the NEAR blockchain using AssemblyScript and Stylus.

## Prerequisites

- Node.js and npm installed
- Check the package.json for exact versions

## Project Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Project Structure

```
├── assembly/          # AssemblyScript smart contract code
│   └── token_stylus.ts
├── out/              # Compiled WebAssembly output
└── package.json      # Project dependencies and scripts
```

## Building the Contract

To build the smart contract, run the following command:

```bash
npx asc assembly/token_stylus.ts -b out/token_stylus.wasm -O3 --sourceMap --optimize
```

Alternatively, you can use the npm script:

```bash
npm run asbuild
```

## Dependencies

- `as-bignum`: ^0.3.1 - Big number implementation for AssemblyScript
- `assemblyscript`: ^0.19.23 - AssemblyScript compiler and runtime
- `near-sdk-as`: ^3.2.3 - NEAR SDK for AssemblyScript

## Development

The smart contract is written in AssemblyScript and uses the NEAR SDK. The main contract file is located in `assembly/token_stylus.ts`.

## License

ISC

## Contributing

Feel free to submit issues and pull requests.

---
Last updated: January 6, 2025
