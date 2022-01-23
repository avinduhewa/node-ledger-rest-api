const app = require("../../src/app");
const request = require("supertest");

const { generateToken } = require("../../scripts/generate-token");
const { createLineItems } = require("../../src/services/ledger.service");

beforeAll(() => {
  bearerToken = `Bearer ${generateToken()}`;
  queryParams = {
    start_date: "2022-01-01T00:00:00+0000",
    end_date: "2022-02-01T00:00:00+0000",
    frequency: "WEEKLY",
    weekly_rent: 300,
    timezone: "Asia/Colombo",
  };
});

describe("Get Accounting Ledger", () => {
  it("Should return correct line items", async () => {
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query(queryParams);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      {
        start_date: "2022-01-01T00:00:00.000Z",
        end_date: "2022-01-07T00:00:00.000Z",
        amount: 300,
      },
      {
        start_date: "2022-01-08T00:00:00.000Z",
        end_date: "2022-01-14T00:00:00.000Z",
        amount: 300,
      },
      {
        start_date: "2022-01-15T00:00:00.000Z",
        end_date: "2022-01-21T00:00:00.000Z",
        amount: 300,
      },
      {
        start_date: "2022-01-22T00:00:00.000Z",
        end_date: "2022-01-28T00:00:00.000Z",
        amount: 300,
      },
      {
        start_date: "2022-01-29T00:00:00.000Z",
        end_date: "2022-02-01T00:00:00.000Z",
        amount: 171.43,
      },
    ]);
  });
});

describe("Get ledger parameter validation", () => {
  it("should return bad request error if start_date is not given", async () => {
    let { start_date, ...rest } = queryParams;
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query(rest);
    expect(res.status).toBe(400);
  });
  it("should return bad request error if end_date is not given", async () => {
    let { end_date, ...rest } = queryParams;
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query(rest);
    expect(res.status).toBe(400);
  });
  it("should return bad request error if start_date is after end_date", async () => {
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query({ ...queryParams, start_date: "2022-03-01T00:00:00+0000" });
    expect(res.status).toBe(400);
  });
  it("should return bad request error if frequency is not given", async () => {
    let { frequency, ...rest } = queryParams;
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query(rest);
    expect(res.status).toBe(400);
  });
  it("should return bad request error if frequency is invalid", async () => {
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query({ ...queryParams, frequency: "YEARLY" });
    expect(res.status).toBe(400);
  });
  it("should return bad request error if weekly_rent is not given", async () => {
    let { weekly_rent, ...rest } = queryParams;
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query(rest);
    expect(res.status).toBe(400);
  });
  it("should return bad request error if weekly_rent is invalid", async () => {
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query({ ...queryParams, weekly_rent: -100 });
    expect(res.status).toBe(400);
  });
  it("should return bad request error if timezone is not given", async () => {
    let { timezone, ...rest } = queryParams;
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query(rest);
    expect(res.status).toBe(400);
  });
  it("should return bad request error if timezone is not valid", async () => {
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken)
      .query({ ...queryParams, timezone: "A/Z" });
    expect(res.status).toBe(400);
  });
});

describe("JWT Token Authentication", () => {
  it("it should authorize when bearerToken is provided", async () => {
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", bearerToken);
    expect(res.status).toBe(400);
  });
  it("it should return unauthorized when bearerToken is not valid", async () => {
    const res = await request(app)
      .get("/api/accounting/ledger")
      .set("Authorization", "Bearer " + "INVALID_TOKEN");
    expect(res.status).toBe(401);
  });
  it("it should return unauthorized when bearerToken is not provided", async () => {
    const res = await request(app).get("/api/accounting/ledger");
    expect(res.status).toBe(403);
  });
});
