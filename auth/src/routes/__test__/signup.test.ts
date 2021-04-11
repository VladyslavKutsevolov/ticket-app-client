import request from "supertest";
import { app } from "../../app";

it("should return 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("should return 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test2test.com",
      password: "password",
    })
    .expect(400);
});

it("should return 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("should return 400 with with missing email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("should disallows duplicates email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("should set a cookie after signup", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(res.get("Set-Cookie")).toBeDefined();
});
