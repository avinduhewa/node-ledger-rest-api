const faker = require("faker");
const httpStatus = require("http-status");
const {
  WEEKLY,
  FORTNIGHTLY,
  MONTHLY,
  CUSTOM,
} = require("../../src/config/constants");
const ledgerService = require("../../src/services/ledger.service");
const ApiError = require("../../src/utils/ApiError");

describe("Accounting Ledger creation service", () => {
  describe("Should create line items", () => {
    it("Should return expected line items for weekly frequency", () => {
      const items = ledgerService.createLineItems({
        start_date: "2022-01-01T00:00:00+0000",
        end_date: "2022-02-01T00:00:00+0000",
        frequency: "WEEKLY",
        weekly_rent: 300,
        timezone: "Asia/Colombo",
      });

      const expected = [
        {
          id: 1,
          start_date: "2022-01-01T00:00:00.000Z",
          end_date: "2022-01-07T00:00:00.000Z",
          amount: 300,
        },
        {
          id: 2,
          start_date: "2022-01-08T00:00:00.000Z",
          end_date: "2022-01-14T00:00:00.000Z",
          amount: 300,
        },
        {
          id: 3,
          start_date: "2022-01-15T00:00:00.000Z",
          end_date: "2022-01-21T00:00:00.000Z",
          amount: 300,
        },
        {
          id: 4,
          start_date: "2022-01-22T00:00:00.000Z",
          end_date: "2022-01-28T00:00:00.000Z",
          amount: 300,
        },
        {
          id: 5,
          start_date: "2022-01-29T00:00:00.000Z",
          end_date: "2022-02-01T00:00:00.000Z",
          amount: 171.43,
        },
      ];

      expect(items).toEqual(expected);
    });

    it("Should return expected line items for fortnightly frequency", () => {
      const items = ledgerService.createLineItems({
        start_date: "2022-03-28T00:00:00+0000",
        end_date: "2022-05-27T00:00:00+0000",
        frequency: "FORTNIGHTLY",
        weekly_rent: 555,
        timezone: "Asia/Colombo",
      });

      const expected = [
        {
          id: 1,
          start_date: "2022-03-28T00:00:00.000Z",
          end_date: "2022-04-10T00:00:00.000Z",
          amount: 1110,
        },
        {
          id: 2,
          start_date: "2022-04-11T00:00:00.000Z",
          end_date: "2022-04-24T00:00:00.000Z",
          amount: 1110,
        },
        {
          id: 3,
          start_date: "2022-04-25T00:00:00.000Z",
          end_date: "2022-05-08T00:00:00.000Z",
          amount: 1110,
        },
        {
          id: 4,
          start_date: "2022-05-09T00:00:00.000Z",
          end_date: "2022-05-22T00:00:00.000Z",
          amount: 1110,
        },
        {
          id: 5,
          start_date: "2022-05-23T00:00:00.000Z",
          end_date: "2022-05-27T00:00:00.000Z",
          amount: 396.43,
        },
      ];

      expect(items).toEqual(expected);
    });

    it("Should return expected line items for monthly frequency", () => {
      const items = ledgerService.createLineItems({
        start_date: "2022-01-01T00:00:00+0000",
        end_date: "2022-04-01T00:00:00+0000",
        frequency: "MONTHLY",
        weekly_rent: 300,
        timezone: "Asia/Colombo",
      });

      const expected = [
        {
          id: 1,
          start_date: "2022-01-01T00:00:00.000Z",
          end_date: "2022-01-31T00:00:00.000Z",
          amount: 1303.57,
        },
        {
          id: 2,
          start_date: "2022-02-01T00:00:00.000Z",
          end_date: "2022-02-28T00:00:00.000Z",
          amount: 1303.57,
        },
        {
          id: 3,
          start_date: "2022-03-01T00:00:00.000Z",
          end_date: "2022-03-31T00:00:00.000Z",
          amount: 1303.57,
        },
      ];

      expect(items).toEqual(expected);
    });
  });

  describe("Should not create line items", () => {
    const { createLineItems } = ledgerService;
    const start_date = "2022-01-01T00:00:00+0000";
    const end_date = "2022-01-07T00:00:00+0000";
    const weekly_rent = 500;
    const frequency = WEEKLY;

    it("Should throw error when frequency is invalid", () => {
      expect(() => {
        createLineItems({
          start_date,
          end_date,
          weekly_rent,
        });
      }).toThrow();

      expect(() => {
        createLineItems({
          start_date,
          end_date,
          weekly_rent,
          frequency: "YEARLY",
        });
      }).toThrow();

      expect(() => {
        createLineItems({
          start_date,
          end_date,
          weekly_rent,
          frequency: "YEARLY",
        });
      }).toThrow(ApiError);
    });

    it("Should throw error when not sending weekly rent", () => {
      expect(() => {
        createLineItems({
          start_date,
          end_date,
          frequency,
        });
      }).toThrow();

      expect(() => {
        createLineItems({
          start_date,
          end_date,
          frequency,
          weekly_rent: -999,
        });
      }).toThrow(ApiError);

      expect(() => {
        createLineItems({
          start_date,
          end_date,
          frequency,
          weekly_rent: "Wrong",
        });
      }).toThrow(ApiError);
    });
  });
});

describe("Should calculate line item amount", () => {
  const weekly_rent = 200;
  it("Should calculate correct amount for WEEKLY", () => {
    expect(ledgerService.calculateRent[WEEKLY](weekly_rent)).toBe(200);
  });

  it("Should calculate correct amount for FORTNIGHTLY", () => {
    expect(ledgerService.calculateRent[FORTNIGHTLY](weekly_rent)).toBe(400);
  });

  it("Should calculate correct amount for MONTHLY", () => {
    expect(ledgerService.calculateRent[MONTHLY](weekly_rent)).toBe(869.05);
  });

  it("Should calculate correct amount for CUSTOM", () => {
    expect(ledgerService.calculateRent[CUSTOM](weekly_rent, 5)).toBe(142.86);
  });

  it("Should throw error for incorrect frequency", () => {
    expect(() => ledgerService.calculateRent["YEARLY"](weekly_rent)).toThrow();
  });
});

describe("Should handle monthly end date scenario", () => {
  const start_date = "2022-01-31T00:00:00+0000";
  const weekly_rent = 200;
  const frequency = MONTHLY;
  const timezone = "Asia/Colombo";

  it("Should calculate correct amount for MONTHLY", () => {
    expect(
      ledgerService.createLineItems({
        start_date,
        frequency,
        weekly_rent,
        timezone,
        end_date: "2022-02-28T00:00:00+0000",
      })
    ).toEqual([
      {
        id: 1,
        start_date: "2022-01-31T00:00:00.000Z",
        end_date: "2022-02-28T00:00:00.000Z",
        amount: 869.05,
      },
    ]);
  });

  it("Should calculate correct amount for MONTHLY", () => {
    expect(
      ledgerService.createLineItems({
        start_date,
        frequency,
        weekly_rent,
        timezone,
        end_date: "2022-04-15T00:00:00+0000",
      })
    ).toEqual([
      {
        id: 1,
        start_date: "2022-01-31T00:00:00.000Z",
        end_date: "2022-02-28T00:00:00.000Z",
        amount: 869.05,
      },
      {
        id: 2,
        start_date: "2022-03-01T00:00:00.000Z",
        end_date: "2022-03-31T00:00:00.000Z",
        amount: 869.05,
      },
      {
        id: 3,
        start_date: "2022-04-01T00:00:00.000Z",
        end_date: "2022-04-15T00:00:00.000Z",
        amount: 428.57,
      },
    ]);
  });

  it("Should calculate correct amount for Partial MONTHLY", () => {
    expect(
      ledgerService.createLineItems({
        start_date,
        frequency,
        weekly_rent,
        timezone,
        end_date: "2022-02-15T00:00:00+0000",
      })
    ).toEqual([
      {
        id: 1,
        start_date: "2022-01-31T00:00:00.000Z",
        end_date: "2022-02-15T00:00:00.000Z",
        amount: 457.14,
      },
    ]);
  });
});
