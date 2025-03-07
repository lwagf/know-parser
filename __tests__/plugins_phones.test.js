const PhonesPlugin = require("../src/plugins/phones.js");

describe("phoneNumbers_plugin", () => {
    describe("constructor", () => {
        it("should set instance param", () => {
            const instance = "Not a real instance";
            const plugin = new PhonesPlugin(instance);
            expect(plugin.instance).toBe(instance);
        });
    });
    describe("main", () => {
        it("should not call grabHrefTel on bad data", () => {
            const instance = {lines:["foo", "bar"]};
            const plugin = new PhonesPlugin(instance);
            plugin.grebHrefTel = jest.fn(() => []);

            plugin.main();
            expect(plugin.grebHrefTel.mock.calls.length).toEqual(0);
        });
        it("should give useful lines to grabHrefTel", () => {
            const instance = {lines:["tel:'+44 1632 960983'"]};
            const plugin = new PhonesPlugin(instance);
            plugin.grabHrefTel = jest.fn();

            plugin.main();
            expect(plugin.grabHrefTel.mock.calls.length).toEqual(1);
        });
        it("should return results", () => {
            const phones = [
                "href='tel:+44 1632 960983'",
                "+44 1632 960984"
            ];
            const instance = {lines:phones};
            const plugin = new PhonesPlugin(instance);
            plugin.grabHrefTel = jest.fn(() => phones[0].split("tel:")[1].split("'")[0]);
            plugin.validate = jest.fn(() => [phones[1]]);

            expect(plugin.main()).toEqual(
                [
                    phones[0].split("tel:")[1].split("'")[0].replace(/\s/g, ""),
                    phones[1].replace(/\s/g, "")
                ]
            );
            expect(plugin.grabHrefTel.mock.calls.length).toEqual(1);
            expect(plugin.validate.mock.calls.length).toEqual(1);
        });
    });
    describe("grabHrefTel", () => {
        it("should return a number", () => {
            const line = "href='tel:+44 1632 960983'";
            const plugin = new PhonesPlugin();

            expect(plugin.grabHrefTel(line)).toEqual(
                line.split("tel:")[1].split("'")[0].replace(/\s/g, "")
            );
        });
        it("should not return bad data", () => {
            const line = "href='tel:+44 1632 bunch of crap'";
            const plugin = new PhonesPlugin();

            expect(plugin.grabHrefTel(line)).toBeNull();
        });
    });
    describe("validate", () => {
        it("should return results", () => {
            const number = "+441632960983";
            const line = `Here is some text with ${number} inside of it`;
            const plugin = new PhonesPlugin();

            expect(plugin.validate(line)).toEqual([number]);
        });
        it("should return an empty array on no results", () => {
            const line = "bunch of words, nothing with a number inside";
            const plugin = new PhonesPlugin();

            expect(plugin.validate(line)).toEqual([]);
        });
        it("should remove duplicates", () => {
            const number = "+441632960983";
            const line = `two numbers, ${number} and ${number}`;
            const plugin = new PhonesPlugin();

            expect(plugin.validate(line).length).toEqual(1);
        });
    });
});
