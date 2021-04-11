import request from "supertest";
import { app } from "../../app";

it("should fail when email that does not exist is supplied ", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "tes@te.com",
      password: "12345",
    })
    .expect(400);
});

it("should fail when incorrect password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "passw",
    })
    .expect(400);
});

it("should succeed with valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});
