<!-- markdownlint-disable -->

# Review App

🍿 **Live Demo:** Experience the decentralized Review App firsthand. [Click here to view](https://review-frontend-nine.vercel.app/).

## Overview

Explore the Review App, a Solana-based app where users interact seamlessly within a user-friendly environment. This application enables users to submit and modify their reviews directly on the Solana blockchain, ensuring a secure and decentralized experience. Easily navigate through transactions on the devnet with intuitive functionalities.

### Features

- Secure login with wallet integration allows users to author reviews confidently.
- Exclusive update capabilities ensure that only the authors can modify their submissions, preserving the integrity of each review.

### Getting Started

#### Review Program

- `lib.rs`: Serves as the primary entry point, initializing the Solana program and directing command execution.
- `instructions.rs`: Defines the set of instructions our Solana program understands, including the logic for adding and updating review entries.
- `state.rs`: Manages the program's internal state, outlining the structure of review accounts and defining custom error messages for better error handling.

#### Build and Deploy

To build the Rust program:

```sh
cargo build-bpf
```

To deploy the program and get the program ID:

```sh
solana program deploy ./target/deploy/review_program.so
```

Example output:

```sh
Program Id: EFH95fWg49vkFNbAdw9vy75tM7sWZ2hQbTTUmuACGip3
```

🔗 For a detailed deployment guide: [Deploying Solana Programs](https://docs.solanalabs.com/cli/examples/deploy-a-program#how-to-deploy-a-program)

#### Review Frontend

Explore the frontend setup [here](review-frontend/README.md)

### License

This project is licensed under [the MIT License](LICENSE).
