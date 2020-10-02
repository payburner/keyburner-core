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
import { Comparable } from "./serialized-type";

/**
 * Base class defining how to encode and decode hashes
 */
class Hash extends Comparable {
    static readonly width: number;

    constructor(bytes: Buffer) {
        super(bytes);
        if (this.bytes.byteLength !== (this.constructor as typeof Hash).width) {
            throw new Error(`Invalid Hash length ${this.bytes.byteLength}`);
        }
    }

    /**
     * Construct a Hash object from an existing Hash object or a hex-string
     *
     * @param value A hash object or hex-string of a hash
     */
    static from<T extends Hash | string>(value: T): Hash {
        if (value instanceof this) {
            return value;
        }

        if (typeof value === "string") {
            return new this(Buffer.from(value, "hex"));
        }

        throw new Error("Cannot construct Hash from given value");
    }

    /**
     * Overloaded operator for comparing two hash objects
     *
     * @param other The Hash to compare this to
     */
    compareTo(other: Hash): number {
        return Buffer.compare(
            this.bytes,
            (this.constructor as typeof Hash).from(other).bytes
        );
    }

    /**
     * @returns the hex-string representation of this Hash
     */
    toString(): string {
        return this.toHex();
    }

    /**
     * Returns four bits at the specified depth within a hash
     *
     * @param depth The depth of the four bits
     * @returns The number represented by the four bits
     */
    nibblet(depth: number): number {
        const byteIx = depth > 0 ? (depth / 2) | 0 : 0;
        let b = this.bytes[byteIx];
        if (depth % 2 === 0) {
            b = (b & 0xf0) >>> 4;
        } else {
            b = b & 0x0f;
        }
        return b;
    }
}

export { Hash };