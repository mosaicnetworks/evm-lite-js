# EVM-Lite Library

A javascript library to interact with EVM-Lite.

## Usage

Typescript usage support:
```typescript
import {Controller} from 'evm-lite-lib';

const controller = new Controller('127.0.0.1', 8080);

controlller.api.getAccounts()
    .then((accounts) => console.log(accounts))
    .catch((error) => console.log(error));
```