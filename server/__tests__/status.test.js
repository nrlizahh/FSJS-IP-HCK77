const request = require("supertest");
const app = require("../app");
const { describe, expect, test } = require("@jest/globals");
const { sequelize, Status, User } = require("../models");
const { signToken } = require("../helpers/jwt");

const status = [
  {
    name: "To Do",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "In Progress",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Completed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const user = [
  {
    username: "tangsa",
    email: "tangsaky@mail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: "nara",
    email: "naravt@mail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let validToken;
beforeAll(async () => {
  try {
    await sequelize.queryInterface.bulkInsert("Users", user);
    await sequelize.queryInterface.bulkInsert("Statuses", status);
    const admin = await User.findOne({ where: { email: "tangsaky@mail.com" } });

    validToken = signToken({ id: admin.id });
  } catch (err) {
    console.log("🚀 ~ beforeAll ~ err:", err);
  }
});

afterAll(async () => {
  await Status.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("Statuses", () => {
  test("200 - Fetch all statuses successfully with valid token", async () => {
    const res = await request(app)
      .get("/statuses")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    res.body.forEach((status, index) => {
      expect(status).toHaveProperty(
        "name",
        ["To Do", "In Progress", "Completed"][index]
      );
    });
  });

  test("401 - Unauthorized when no token is provided", async () => {
    const response = await request(app).get("/statuses");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});
