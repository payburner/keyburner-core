import {KeyBurner} from '..';

test('Test signing and decoding an arbitrary payload', async () => {
    const client = new KeyBurner();
    const seed = client.generateSeed();
    const keypair = client.deriveKeyPair(seed);
    const address = client.deriveAddress(keypair);
    console.log('Address:' + address);
    const payload = {
        "doggy": " wendy",
        "Amount": "3000",
        "Fee": "1000",
        "Sequence": 1
    };
    const signed = client.signTransaction(payload, keypair);
    console.log('Signed:' + JSON.stringify(signed, null, 2));
    const decoded = client.decodeTransaction(signed.signedTransaction);
    console.log('Decoded:' + JSON.stringify(decoded, null, 2));
});



