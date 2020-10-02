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
 * Bytes list is a collection of buffer objects
 */
class BytesList {
    private bytesArray: Array<Buffer> = [];

    /**
     * Get the total number of bytes in the BytesList
     *
     * @return the number of bytes
     */
    public getLength(): number {
        return Buffer.concat(this.bytesArray).byteLength;
    }

    /**
     * Put bytes in the BytesList
     *
     * @param bytesArg A Buffer
     * @return this BytesList
     */
    public put(bytesArg: Buffer): BytesList {
        const bytes = Buffer.from(bytesArg); // Temporary, to catch instances of Uint8Array being passed in
        this.bytesArray.push(bytes);
        return this;
    }

    /**
     * Write this BytesList to the back of another bytes list
     *
     *  @param list The BytesList to write to
     */
    public toBytesSink(list: BytesList): void {
        list.put(this.toBytes());
    }

    public toBytes(): Buffer {
        return Buffer.concat(this.bytesArray);
    }

    toHex(): string {
        return this.toBytes().toString("hex").toUpperCase();
    }
}



export { BytesList };