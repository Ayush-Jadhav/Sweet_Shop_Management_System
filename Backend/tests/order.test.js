const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const Sweet = require("../models/sweet");

describe("Order Tests", () => {
  let cookie;
  let sweet;

  beforeEach(async () => {
    await User.create({
      fullName: "User",
      email: "user@test.com",
      number: 1234567890,
      password: "user123",
      role: "customer",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "user@test.com",
      password: "user123",
    });

    cookie = loginRes.headers["set-cookie"];

    sweet = await Sweet.create({
      name: "Kaju Katli",
      category: "Indian",
      price: 50,
      quantity: 10,
    });
  }, 10000);

  it("user can place order", async () => {
    const res = await request(app)
      .post("/api/sweets/purchase")
      .set("Cookie", cookie)
      .send({
        items: [{ sweetId: sweet._id, quantity: 2 }],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
