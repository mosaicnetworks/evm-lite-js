# Change Log

## UNRELEASED

FEATURES:

- none

IMPROVEMENTS:

- Changed constructors for `Keystore`, `Config`, `Database` to accept one
  parameter representing the full path to their respective selves.
- Renamed `Keystore.decryptAccount` to `Keystore.decrypt`.
- Removed one param from `Keystore.list`. Now only accepts one param
  representing a `EVMLC` object to fetch balance and nonce from the node.
- `Transaction` submittion now only signed one way.
- `Transaction` object requires an optional `Account` object to be signed
  only for non-constant transactions.

SECURITY:

- Upgraded dependencies

BUG FIXES:

- none
