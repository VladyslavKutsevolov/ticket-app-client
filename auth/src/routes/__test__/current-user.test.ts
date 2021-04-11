import request from "supertest";
import { app } from "../../app";

it("should responds with details about current user", async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual("test@test.com");
});
