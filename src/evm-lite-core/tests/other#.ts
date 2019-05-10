import { EVMLC } from 'evm-lite-core';


const evmlc = new EVMLC('n0.monet.network', 8080, {
    from: '0xc7532cb0698d68df214f5b7425672b215fe60bb7'.toUpperCase(),
    gas: 10000000,
    gasPrice: 0
})

const keystore = '{"address":"c7532cb0698d68df214f5b7425672b215fe60bb7","crypto":{"cipher":"aes-128-ctr","ciphertext":"5bfd72a142decd988751c95c71fc89a919f24b6f2688732b60db0b37f35488a4","cipherparams":{"iv":"d174bbdcd033bd98645789af3e9816a9"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"c2e82647c9c27f78707c205cb6eaa53e5f92ecea5a1455d783da3f8a1a0e0c47"},"mac":"ed632a77079ca4629e0719ce65b155fe226c06dd8df5cfb1320d81ab525f94b9"},"id":"b6a1243b-58a7-4422-8fb9-105e546618b2","version":3}'


const run = async () => {
    const account = await evmlc.accounts.decrypt(JSON.parse(keystore), 'supersecurepassword');
    const transaction = evmlc.accounts.prepareTransfer('0xc7532cb0698d68df214f5b7425672b215fe60bb8', 100)

    await transaction.sign(account)

    // await transaction.submit(account, {
    //     value: 200,
    //     timeout: 10
    // });

    return evmlc.defaultFrom
}

run().then(console.log).catch(console.log)
