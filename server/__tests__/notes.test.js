const request = require("supertest");
const app = require("../app");
const { describe, expect, test } = require("@jest/globals");
const { sequelize, Status, User, Note } = require("../models");
const { signToken } = require("../helpers/jwt");

const statuses = [
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

const users = [
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

const notes = [
  {
    task: "Membuat API",
    description: "Membuat endpoint API untuk fitur autentikasi",
    userId: 1,
    statusId: 1,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    task: "Desain UI",
    description: "Mendesain halaman utama aplikasi dengan React",
    userId: 1,
    statusId: 2,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    task: "Testing",
    description: "Melakukan testing API menggunakan Postman",
    userId: 2,
    statusId: 3,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let validToken;
beforeAll(async () => {
  try {
    await sequelize.queryInterface.bulkInsert("Users", users);
    await sequelize.queryInterface.bulkInsert("Statuses", statuses);
    await sequelize.queryInterface.bulkInsert("Notes", notes);

    const admin = await User.findOne({ where: { email: "tangsaky@mail.com" } });
    validToken = signToken({ id: admin.id });
  } catch (err) {
    console.log("🚀 ~ beforeAll ~ err:", err);
  }
});

afterAll(async () => {
  await Note.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
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

describe("Notes", () => {
  test("200 - Fetch all notes successfully with valid token", async () => {
    const res = await request(app)
      .get("/notes")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(3);

    const expectedTasks = ["Membuat API", "Desain UI", "Testing"];
    res.body.forEach((note, index) => {
      expect(note).toHaveProperty("task", expectedTasks[index]);
      expect(note).toHaveProperty("description");
      expect(note).toHaveProperty("userId");
      expect(note).toHaveProperty("statusId");
      expect(note).toHaveProperty("order");
    });
  });

  test("401 - Unauthorized when no token is provided", async () => {
    const res = await request(app).get("/notes");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid Token");
  });
});
