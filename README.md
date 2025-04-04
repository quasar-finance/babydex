# BabyDex

[![codecov](https://codecov.io/gh/astroport-fi/astroport-core/branch/main/graph/badge.svg?token=ROOLZTGZMM)](https://codecov.io/gh/astroport-fi/astroport-core)

Multi pool type automated market-maker (AMM) protocol powered by smart contracts on the Babylon Genesis chain.

## Contracts diagram

![contract diagram](./assets/sc_diagram.png "Contracts Diagram")

## General Contracts

| Name                                               | Description                                                         |
|----------------------------------------------------|---------------------------------------------------------------------|
| [`factory`](contracts/factory)                     | Pool creation factory                                               |
| [`pair`](contracts/pair)                           | Pair with x*y=k curve                                               |
| [`pair_concentrated`](contracts/pair_concentrated) | Passive Concentrated Liquidity pair inspired by Curve v2 whitepaper |
| [`router`](contracts/router)                       | Multi-hop trade router                                              |

## Tokenomics Contracts

Tokenomics related smart contracts are hosted on ../contracts/tokenomics.

| Name                                                | Description                                                         |
|-----------------------------------------------------|---------------------------------------------------------------------|
| [`incentives`](contracts/tokenomics/generator)      | Rewards distributor for liquidity providers                         |

## Building Contracts

You will need Rust 1.68.0+ with wasm32-unknown-unknown target installed.

### You can compile each contract:

Go to contract directory and run

```
cargo wasm
cp ../../target/wasm32-unknown-unknown/release/astroport_token.wasm .
ls -l astroport_token.wasm
sha256sum astroport_token.wasm
```

### You can run tests for all contracts

Run the following from the repository root

```
cargo test
```

### For a production-ready (compressed) build:

Run the following from the repository root

```
./scripts/build_release.sh
```

The optimized contracts are generated in the artifacts/ directory.

## Deployment

You can find versions and commits for actual deployed
contracts will be published here once the

## Docs

Docs can be generated using `cargo doc --no-deps`
<!-- 
## Bug Bounty

The contracts in this repo are included in a [bug bounty program](https://www.immunefi.com/bounty/astroport). -->

## Attribution

This project includes code derived from [Astroport Core](https://github.com/astroport-fi/astroport-core), which is licensed under the GNU General Public License v3.0.

Original work © Astroport
