# Change Log

## UNREALEASED

FEATURES:

IMPROVEMENTS:

- `.prepareTransfer` no longer returns a promise.
  
SECURITY:

BUG FIXES:

---

## 0.2.18

FEATURES:

IMPROVEMENTS:

- `.prepareTransfer` no longer returns a promise.
- `Contract` class now has the ability to set a
  `.signingAccount(account: Account)` to make deployment and method execution
  cleaner.
- Redundant types have no been removed.
- Nonce is only fetch before `Transaction` submission
- ChaidID also set before `Transaction` submission
  
SECURITY:

BUG FIXES:

---

## 0.2.16

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
