const keyPairsApi = require('ripple-keypairs');
const addressCodecApi = require('ripple-address-codec');
import { randomBytes } from "tweetnacl";
import { transactionID} from './hashes';

export class KeyBurner {

    generateSeed() {
        return keyPairsApi.generateSeed({entropy: randomBytes(16), algorithm: 'ed25519'})
    }

    deriveKeyPair( seed ) {
        return keyPairsApi.deriveKeypair( seed );
    }

    deriveAddress( keypair ) {
        return keyPairsApi.deriveAddress(keypair.publicKey);
    }

    hexAddress( address ) {
        return this.toHex(addressCodecApi.decodeAccountID(address))
    }

    toHex(bytes) {
        return Buffer.from(bytes).toString('hex').toUpperCase()
    }

    encodePayload(payload) {
        return Buffer.from(JSON.stringify(payload)).toString('hex').toUpperCase()
    }

    decodePayload(base64) {
        return JSON.parse(Buffer.from(base64, 'hex').toString('utf-8'));
    }

    signTransaction(payload, keypair) {
        // -- add the signing public key to the payload
        payload['SigningPubKey'] = keypair.publicKey;
        // -- encode the payload with the public key for signing.
        const preSigned = this.encodePayload(payload);
        // -- sign the payload
        const signed = keyPairsApi.sign(preSigned, keypair.privateKey);
        // -- add the signture to the payload.
        payload['TxnSignature'] = signed;
        // -- re-encode the signed payload.
        const pl =  this.encodePayload(payload);
        const txId = transactionID( Buffer.from(pl, 'hex'));
        return {
            id: txId, signedTransaction: pl
        };
    }

    decodeTransaction(signedPayloadInHex) {
        // -- decode the signed payload
        const decoded = this.decodePayload(signedPayloadInHex);
        // -- obtain the signing public key
        const signingPubKey = decoded.SigningPubKey;
        // -- calculate the address
        const derivedAddress = keyPairsApi.deriveAddress(signingPubKey);
        // -- obtain the signature
        const signature = decoded.TxnSignature;
        // -- delete the signature from the object
        delete decoded.TxnSignature;
        delete decoded.Signers;
        // -- re-encode the payload without the extra bits.
        const encoded = this.encodePayload(decoded);
        // -- verify the re-encoded payload
        const verified = keyPairsApi.verify(encoded, signature, signingPubKey);
        // -- delete the signing public key from the payload
        delete decoded.SigningPubKey;
        // -- return.
        return {
            id: transactionID( Buffer.from(signedPayloadInHex, 'hex')),
            raw: signedPayloadInHex,
            verified: verified,
            accountId: derivedAddress,
            signingKey: signingPubKey,
            signature: signature,
            payload: decoded
        }
    }
}