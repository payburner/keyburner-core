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
import { BytesList } from "../serdes/binary-serializer";

type JSON = string | number | boolean | null | undefined | JSON[] | JsonObject;

type JsonObject = { [key: string]: JSON };

/**
 * The base class for all binary-codec types
 */
class SerializedType {
    protected readonly bytes: Buffer = Buffer.alloc(0);

    constructor(bytes: Buffer) {
        this.bytes = bytes ?? Buffer.alloc(0);
    }

    static from(value: SerializedType | JSON | bigint): SerializedType {
        throw new Error("from not implemented");
        return this.from(value);
    }

    /**
     * Write the bytes representation of a SerializedType to a BytesList
     *
     * @param list The BytesList to write SerializedType bytes to
     */
    toBytesSink(list: BytesList): void {
        list.put(this.bytes);
    }

    /**
     * Get the hex representation of a SerializedType's bytes
     *
     * @returns hex String of this.bytes
     */
    toHex(): string {
        return this.toBytes().toString("hex").toUpperCase();
    }

    /**
     * Get the bytes representation of a SerializedType
     *
     * @returns A buffer of the bytes
     */
    toBytes(): Buffer {
        if (this.bytes) {
            return this.bytes;
        }
        const bytes = new BytesList();
        this.toBytesSink(bytes);
        return bytes.toBytes();
    }

    /**
     * Return the JSON representation of a SerializedType
     *
     * @returns any type, if not overloaded returns hexString representation of bytes
     */
    toJSON(): JSON {
        return this.toHex();
    }

    /**
     * @returns hexString representation of this.bytes
     */
    toString(): string {
        return this.toHex();
    }
}

/**
 * Base class for SerializedTypes that are comparable
 */
class Comparable extends SerializedType {
    lt(other: Comparable): boolean {
        return this.compareTo(other) < 0;
    }

    eq(other: Comparable): boolean {
        return this.compareTo(other) === 0;
    }

    gt(other: Comparable): boolean {
        return this.compareTo(other) > 0;
    }

    gte(other: Comparable): boolean {
        return this.compareTo(other) > -1;
    }

    lte(other: Comparable): boolean {
        return this.compareTo(other) < 1;
    }

    /**
     * Overload this method to define how two Comparable SerializedTypes are compared
     *
     * @param other The comparable object to compare this to
     * @returns A number denoting the relationship of this and other
     */
    compareTo(other: Comparable): number {
        throw new Error(
            `cannot compare ${this.toString()} and ${other.toString()}`
        );
    }
}

export { SerializedType, Comparable, JSON, JsonObject };