## 0.1.20

FEATURES:

IMPROVEMENTS:

-   `Keystore.decrypt` renamed to `Keystore.decryptAccount`
-   Removed `solc` as dependency as a result also removed `EVMLC.compileContract`

SECURITY:

BUG FIXES:

## 0.1.19

FEATURES:

-   `call()` and `send()` transactions merged into one function `submit()`
-   API to handle interactions with transactions
-   Contract abstraction (both deployed and not)
    -   Solidity function abstraction
-   Transfer tokens
-   Promised wrapped HTTP handler
-   Default options for top level class
-   Account handling
-   Wallet handling (WiP)
-   Added testing for Solidity Contract class

IMPROVEMENTS:

-   Testing Capabilities
-   Documentation for classes and functions
-   Functions to set transaction attributes
-   User experience improvements SolidityContract.ts
-   User experience improvements SolidityFunction.ts
-   Type definitions

SECURITY:

BUG FIXES:
