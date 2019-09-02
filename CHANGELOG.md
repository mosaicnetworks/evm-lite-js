# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

-   Added Babble `/blocks/{index}?limit{x}/` to Babble client
-   Added Monet export to `evm-lite-core`

### Changed

-   Made keystore optional in constructor for `DataDirectory` class
-   Deprecated Babble `/block/` endpoint
-   Made consensus optional on `Node`

## 1.0.0

-   `evm-lite-core@1.0.0` - Core module to interact with an EVM-Lite node (Web & Node.js Compatible)
-   `evm-lite-keystore@1.0.0` - Keystore management for applications (Not Web Compatible)
-   `evm-lite-datadir@1.0.0` - Data directory management for applications (Not Web Compatible)
-   `evm-lite-utils@1.0.0` - An aggregate of utility functions used by EVM-Lite JS modules (Web & Node.js Compatible)
-   `evm-lite-consensus@1.0.0` - Our consensus clients as well as an `IAbstractConsensus` class (Web & Node.js Compatible)
-   `evm-lite-client@1.0.0` - A simple HTTP client for EVM-Lite (Web & Node.js Compatible)
