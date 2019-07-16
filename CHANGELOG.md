# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

-   Long decryption issue in `evm-lite-keystore` with method `Keystore.decrypt`
-   `Keystore.list` now only reads files in can read and passes any it can not

## v1.0.0-alpha.10

### Added

-   Package `evm-lite-utils` contains a merged `Utils` class from `evm-lite-core`, `evm-lite-keystore` and `evm-lite-datadir`.

### Changes

-   `Keystore.import` now takes one argument `V3JSONKeyStore`
-   Contract methods now read in `value` attribute in a `transaction`.
