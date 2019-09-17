# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v1.3.2

### Changed

-   Add `^` to `evm-lite-*` modules

## v1.3.1

### Changed

-   Made keystore optional in constructor for `DataDirectory` class
-   Decrypt and encrypt now use `crypto.scryptSync`
-   Maxmem for `scrypt` increased from 33MB to 300MB

---

## First Release v1.0.0

Keystore management for applications (Not Web Compatible)
