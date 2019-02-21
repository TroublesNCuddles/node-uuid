const utils = require("../src/utils.js");
const {assert} = require("chai");

describe("constants", () => {
    it("export a valid byte_map", () => {
        const test_case_byte_map = Array.from(Array(256).keys()).map(index => (index + 0x100).toString(16).slice(1));
        assert.lengthOf(utils.BYTE_MAP, 256);
        assert.deepEqual(utils.BYTE_MAP, test_case_byte_map);
    });

    it("export a valid uuid instruction set", () => {
        assert.lengthOf(utils.UUID_INSTRUCTIONS, 5, "should have a length of 5");
        assert.typeOf(utils.UUID_INSTRUCTIONS, "array", "should be an array");
        assert.deepEqual(utils.UUID_INSTRUCTIONS, [4, 2, 2, 2, 6], "should be an array of 6, 2, 2, 2, 6");
    });
});