import {SignedTransaction} from "../model/SignedTransaction";
const KeyPairsApi = require( 'ripple-keypairs' );
const addressCodecApi = require('ripple-address-codec');
import { randomBytes } from "tweetnacl";
import { transactionID} from '../hashes';
import {KeyPair} from "../model/KeyPair";
import {DecodedTransaction} from "../model/DecodedTransaction";


export class KeyBurner {

    generateSeed(): string {
        return KeyPairsApi.generateSeed({entropy: randomBytes(16), algorithm: 'ed25519'})
    }

    deriveKeyPair( seed: string ) : KeyPair {
        return KeyPairsApi.deriveKeypair( seed ) as KeyPair;
    }

    deriveAddress( keypair: KeyPair ) : string {
        const publicKey = keypair.publicKey;
        return KeyPairsApi.deriveAddress(publicKey);
    }

    hexAddress( address: string ) : string {
        return this.toHex(addressCodecApi.decodeAccountID(address))
    }

    toHex(bytes : string) : string {
        return Buffer.from(bytes).toString('hex').toUpperCase()
    }

    encodePayload(payload: any) : string {
        return Buffer.from(JSON.stringify(payload)).toString('hex').toUpperCase()
    }

    decodePayload(base64 : string) : any {
        return JSON.parse(Buffer.from(base64, 'hex').toString('utf-8'));
    }

    signTransaction(payload : any, keypair: KeyPair) : SignedTransaction{
        // -- add the signing public key to the payload
        payload['SigningPubKey'] = keypair.publicKey;
        // -- encode the payload with the public key for signing.
        const preSigned = this.encodePayload(payload);
        // -- sign the payload
        const signed = KeyPairsApi.sign(preSigned, keypair.privateKey);
        // -- add the signature to the payload.
        payload['TxnSignature'] = signed;
        // -- re-encode the signed payload.
        const pl =  this.encodePayload(payload);
        const txId = transactionID( Buffer.from(pl, 'hex'));
        return {
            id: txId.toString(), signedTransaction: pl
        };
    }

    decodeTransaction(signedPayloadInHex : string) : DecodedTransaction {
        // -- decode the signed payload
        const decoded = this.decodePayload(signedPayloadInHex);
        // -- obtain the signing public key
        const signingPubKey = decoded.SigningPubKey;
        // -- calculate the address
        const derivedAddress = KeyPairsApi.deriveAddress(signingPubKey);
        // -- obtain the signature
        const signature = decoded.TxnSignature;
        // -- delete the signature from the object
        delete decoded.TxnSignature;
        delete decoded.Signers;
        // -- re-encode the payload without the extra bits.
        const encoded = this.encodePayload(decoded);
        // -- verify the re-encoded payload
        const verified = KeyPairsApi.verify(encoded, signature, signingPubKey);
        // -- delete the signing public key from the payload
        delete decoded.SigningPubKey;
        // -- return.
        return {
            id: transactionID( Buffer.from(signedPayloadInHex, 'hex')).toString(),
            raw: signedPayloadInHex,
            verified: verified,
            accountId: derivedAddress,
            signingKey: signingPubKey,
            signature: signature,
            payload: decoded
        }
    }
}