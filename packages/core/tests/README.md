# Tests

## Accounts Module

- Creating an account generates `privateKey`, `address` and the `signTransaction` method correctly
- Account encrypts to correct `V3JSONKeystore` and decrypts to the respective `Account`
- Generates the same account with the `privateKey`
- `signTransaction` signs a `Transaction` correctly


## Transaction Module

- Test all types of constant transactions and seee whether the `constant` property returns `true`
- Check if the `clean()` methods prefixes the `0x` to all required fields
- Different lengths of addresses for `to` and `from`