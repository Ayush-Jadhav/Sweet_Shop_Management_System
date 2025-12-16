const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

describe("Auth Tests", () => {
  it("should login user and return cookies", async () => {
    await User.create({
      fullName: "Ayush",
      email: "test@test.com",
      number: 1234567890,
      password: "password123",
      role: "customer",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body.success).toBe(true);
  }, 10000);

  it("should block protected route without token", async () => {
    const res = await request(app).get("/api/orders/me");
    expect(res.statusCode).toBe(401);
  });
});
