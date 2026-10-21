import { describe, it } from "node:test";
import assert from "node:assert";
import { certifications, period } from "#themes/person.js";

describe("period", () => {
  for (const [input, expected] of [
    ["2020-01-15", "2020-01"],
    ["2020-12-01", "2020-12"],
    ["2021-10", "2021-10"],
    ["2021-10-01T00:00:00Z", "2021-10"],
    [new Date(Date.UTC(2019, 0, 31)), "2019-01"],
    [new Date(Date.UTC(2019, 11, 1)), "2019-12"]
  ]) {
    it(`${input instanceof Date ? input.toISOString() : input} -> ${expected}`, () => {
      assert.strictEqual(period(input), expected);
    });
  }

  it("returns text that isn't a date unchanged", () => {
    assert.strictEqual(period("Spring term"), "Spring term");
  });
});

describe("certifications", () => {
  it("lists certifications and then credentials", () => {
    const person = {
      hasCertification: [{ name: "AZ-204" }],
      hasCredential: [{ name: "MSc" }]
    };
    assert.deepStrictEqual(
      certifications(person).map((cert) => cert.name),
      ["AZ-204", "MSc"]
    );
  });

  it("leaves out one without a name", () => {
    const person = {
      hasCertification: [{ "@type": "Certification", issuedBy: "Microsoft" }],
      hasCredential: [{ "@type": "EducationalOccupationalCredential" }, { name: "MSc" }]
    };
    assert.deepStrictEqual(
      certifications(person).map((cert) => cert.name),
      ["MSc"]
    );
  });
});
