#!/usr/bin/env bash

# Generates an code upload transaction. This tx has to be executed by a whitelisted address

NODE="https://babylon.nodes.guru:443/rpc"
CONTRACT="astroport_factory.wasm"
MULTISIG="bbn1v3lucy6ugmdlut0385afdq27d07zhur3tjazrc"
CHAINID="bbn-1"

REPO_ROOT=$(git rev-parse --show-toplevel)

babylond tx wasm store "$REPO_ROOT/artifacts/$CONTRACT" --from $MULTISIG --chain-id "$CHAINID" --fees 5000ubbn --gas 300000 --node $NODE -o json --generate-only