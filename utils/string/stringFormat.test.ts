import { stringFormat } from "./stringFormat";

describe("stringFormat", () => {
  it("stringFormat will returns correctly", () => {
    const stringToFormat =
      '[{{InnerText}}] Key "value" and "va.lue" and "va_lue" has changed: {value}, {va.lue}, {va_lue}';
    const paramToFormat = {
      value: "string",
      "va.lue": null,
      va_lue: 1,
    };
    const expected = '[{InnerText}] Key "value" and "va.lue" and "va_lue" has changed: string, {va.lue}, 1';
    const expected2 = '[{InnerText}] Key "value" and "va.lue" and "va_lue" has changed: , {va.lue}, ';

    expect(stringFormat(stringToFormat, paramToFormat)).toBe(expected);
    expect(stringFormat(stringToFormat)).toBe(expected2);
  });
});
