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
const {convertStringToBytes, getSHA1Sum, finalizeUUID} = require(
    "./utils.js");

//
//FUNCTIONS
//
//TODO Add More checks
const generate = (value, namespace, buffer, offset = 0) => {
    if (!value || (typeof value !== "string" && !(value instanceof Buffer) && !Array.isArray(value))) {
        throw new TypeError("value needs to either be a string, a Buffer or an array");
    } else if (!namespace || (typeof namespace !== "string" && !(namespace instanceof Buffer) && !Array.isArray(
        namespace))) {
        throw new TypeError("namespace needs to either be a string, a Buffer or an array");
    } else if (buffer && (!Array.isArray(buffer) && !(buffer instanceof Buffer))) {
        throw new TypeError("buffer needs to be an Array or instanceof Buffer.");
    } else if (typeof offset !== "number" || offset < 0) {
        throw new TypeError("offset needs to be a number above 0");
    }

    if (typeof value === "string") {
        value = convertStringToBytes(value);
    }

    if (typeof namespace === "string") {
        namespace = convertStringToBytes(namespace);
    }

    const bytes = getSHA1Sum(namespace.concat(value));
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    return finalizeUUID(bytes, 0x50, buffer, offset);
};

//
//EXPORTS
//
module.exports = {
    generate
};