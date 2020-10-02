/**
 * Copyright (c) 2015 Ripple Labs Inc.

 Permission to use, copy, modify, and distribute this software for any
 purpose with or without fee is hereby granted, provided that the above
 copyright notice and this permission notice appear in all copies.

 THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
/**
 * Write a 32 bit integer to a Buffer
 *
 * @param uint32 32 bit integer to write to buffer
 * @returns a buffer with the bytes representation of uint32
 */
function bytes(uint32: number): Buffer {
    const result = Buffer.alloc(4);
    result.writeUInt32BE(uint32);
    return result;
}

/**
 * Maps HashPrefix names to their byte representation
 */
const HashPrefix: Record<string, Buffer> = {
    transactionID: bytes(0x54584e00),
    // transaction plus metadata
    transaction: bytes(0x534e4400),
    // account state
    accountStateEntry: bytes(0x4d4c4e00),
    // inner node in tree
    innerNode: bytes(0x4d494e00),
    // ledger master data for signing
    ledgerHeader: bytes(0x4c575200),
    // inner transaction to sign
    transactionSig: bytes(0x53545800),
    // inner transaction to sign
    transactionMultiSig: bytes(0x534d5400),
    // validation for signing
    validation: bytes(0x56414c00),
    // proposal for signing
    proposal: bytes(0x50525000),
    // payment channel claim
    paymentChannelClaim: bytes(0x434c4d00),
};

export { HashPrefix };