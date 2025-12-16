const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

describe("Sweet Tests", () => {
  let cookie;

  beforeEach(async () => {
    await User.create({
      fullName: "Admin",
      email: "admin@test.com",
      number: 1234567890,
      password: "admin123",
      role: "admin",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123",
    });

    cookie = loginRes.headers["set-cookie"];
  }, 10000);

  it("admin can create sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Cookie", cookie)
      .send({
        name: "Rasgulla",
        category: "Indian",
        price: 20,
        quantity: 100,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.sweet.name).toBe("Rasgulla");
  });
});
