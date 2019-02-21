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
const {getRandomBytes, isValidByteArray, finalizeUUID} = require("./utils.js");

//
//FUNCTIONS
//
const generate = (buffer, offset = 0, random = getRandomBytes(16)) => {
    if ((!Array.isArray(random) && !(random instanceof Buffer)) || random.length !== 16 || !isValidByteArray(random)) {
        console.log(random);
        throw new TypeError("random needs to be an array of bytes of at exactly 16 bytes");
    }

    return finalizeUUID(random, 0x40, buffer, offset);
};

//
//EXPORTS
//
module.exports = {
    generate
};