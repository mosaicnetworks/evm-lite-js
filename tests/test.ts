import Keystore from '../src/tools/Keystore';


const keystore = new Keystore('/Users/danu/Desktop')

keystore.createWithPromise('asd')
    .then((acc) => console.log(acc))
