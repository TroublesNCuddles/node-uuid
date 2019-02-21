//MIT License
//
//Copyright (c) 2019 Athena
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.
//
// REQUIREMENTS
//
const crypto = require("crypto");

//
//CONSTANTS
//

//Generate a easy to refer map of hexadecimal formatted bytes.
const BYTE_MAP = Array.from(Array(256).keys()).map(index => (index + 0x100).toString(16).slice(1));
const UUID_INSTRUCTIONS = [4, 2, 2, 2, 6];
const UUID_STRING_LENGTH = 36;
const UUID_VALID_VERSIONS = [1, 2, 3, 4, 5];

//
//FUNCTIONS
//


/**
 *
 * This function is used to generate an array of cryptographically random bytes.
 * It'll return/resolve an Array the size of {amount} with the bytes.
 *
 * A Promise is returned when {asynchronous} is set to true which will resolve with an array of bytes, and reject with
 * whichever error crypto.randomBytes may throw at it.
 *
 * @param {number} amount the amount of bytes to generate. Defaults to 16
 * @param {boolean} asynchronous wether or not to run the function asynchronously. Defaults to FALSE
 * @returns {Array|Promise<Array|Error>}
 */
const getRandomBytes = (amount = 16, asynchronous = false) => {
    if (typeof amount !== "number" || amount <= 0) {
        throw new TypeError("amount needs to be a number above 0");
    } else if (asynchronous !== false && asynchronous !== true) {
        throw new TypeError("asynchronous needs to be a EXPLICIT boolean");
    }

    if (!asynchronous) {
        if (amount > 256) {
            console.error(
                "[%s] [WARNING] [https://github.com/AthenasEngineering/node-uuid] getRandomByes should be used" +
                " ASYNCHRONOUSLY when generating more than 256 bytes", (new Date()).toUTCString()
            );
        }

        return crypto.randomBytes(amount);
    }

    return new Promise((resolve, reject) => {
        return crypto.randomBytes(amount, (error, bytes) => {
            if (error) {
                return reject(error);
            }

            return resolve(bytes);
        });
    });
};

const convertBytesToUUIDString = (bytes, offset = 0, map = BYTE_MAP) => {
    if (!bytes || (!Array.isArray(bytes) && !(bytes instanceof Buffer))) {
        throw new TypeError("bytes needs to be an array or a Buffer.");
    } else if (typeof offset !== "number" || offset < 0) {
        throw new TypeError("offset needs to be a number above 0 (inclusive)");
    } else if (!Array.isArray(map) || map.length !== 256) {
        throw new TypeError("map needs to be an array at least 256 in length");
    }

    return UUID_INSTRUCTIONS.map(instruction => {
        const instruction_part = [];

        for (let index = 0; index < instruction; index++) {
            const byte = bytes[offset++];
            instruction_part.push(map[byte]);
        }

        return instruction_part.join("");
    }).join("-");
};

const convertUUIDStringToBytes = (uuid) => {
    if (typeof uuid !== "string") {
        throw new TypeError("uuid needs to be a valid uuid string");
    }

    uuid = uuid.split("-").join('');

    console.log(uuid);

    return typeof Buffer.from === "function" ? Buffer.from(uuid, "hex") : new Buffer(uuid, "hex");
};

const convertStringToBytes = (str) => {
    if (typeof str !== "string") {
        throw new TypeError("str needs to be a string");
    }

    str = decodeURIComponent(encodeURIComponent(str));

    return str.split().map(char => char.charCodeAt(0));
};

const extractVersion = (uuid) => {
    if (typeof uuid !== "string" || uuid.length !== UUID_STRING_LENGTH) {
        throw new TypeError("uuid needs to be a string of at least 36 characters");
    }

    const version = uuid.charAt(14) | 0;

    if (!UUID_VALID_VERSIONS.includes(version)) {
        throw new TypeError(`uuid version needs to be one of ${UUID_VALID_VERSIONS.join("|")}, not ${version}`);
    }

    return version;
};

const isValidByteArray = bytes => {
    if (!Array.isArray(bytes) && !(bytes instanceof Buffer)) {
        return false;
    }

    for (let index = 0; index < bytes.length; index++) {
        const byte = bytes[index];

        if (typeof byte !== "number" || !Number.isInteger(byte) || byte < 0 || byte > 256) {
            return false;
        }
    }

    return true;
};

const getSHA1Sum = (content) => {
    if (!(content instanceof Buffer) && !Array.isArray(content) && typeof content !== "string") {
        throw new TypeError("content needs to be a Buffer, an Array or a string");
    }

    if (!(content instanceof Buffer)) {
        if (typeof Buffer.from === "function") {
            if (Array.isArray(content)) {
                content = Buffer.from(content);
            } else {
                content = Buffer.from(content, "utf8");
            }
        } else {
            if (Array.isArray(content)) {
                content = new Buffer(content);
            } else {
                content = new Buffer(content, "utf8");
            }
        }
    }

    return crypto.createHash("sha1").update(content).digest();
};

const finalizeUUID = (uuid, version, buffer, offset = 0) => {
    if (!uuid || (!Array.isArray(uuid) && !(uuid instanceof Buffer))) {
        throw new TypeError("uuid needs to be an Array or instanceof Buffer.");
    } else if (![0x20, 0x30, 0x40, 0x50].includes(version)) {
        throw new TypeError("version needs to be either 0x20, 0x30, 0x40, 0x50");
    } else if (buffer && (!Array.isArray(buffer) && !(buffer instanceof Buffer))) {
        throw new TypeError("buffer needs to be an Array or instanceof Buffer.");
    } else if (typeof offset !== "number" || offset < 0) {
        throw new TypeError("offset needs to be a number above 0");
    }

    const bytes = uuid;
    //Version specific values
    bytes[6] = (bytes[6] & 0x0F) | version;
    bytes[8] = (bytes[8] & 0x3F) | 0x80;

    if (buffer) {
        if (buffer.length < offset + 16) {
            throw new TypeError("buffer isn't large enough to accommodate a uuid with the specified offset.");
        }

        for (let index = 0; index < 16; index++) {
            buffer[offset + index] = bytes[index];
        }

        return buffer;
    }

    return convertBytesToUUIDString(bytes);
};

//
//EXPORTS
//

module.exports = {
    BYTE_MAP,
    UUID_INSTRUCTIONS,
    UUID_STRING_LENGTH,
    UUID_VALID_VERSIONS,
    getRandomBytes,
    convertBytesToUUIDString,
    convertUUIDStringToBytes,
    convertStringToBytes,
    extractVersion,
    isValidByteArray,
    getSHA1Sum,
    finalizeUUID
};