import request from "supertest";
import { app } from "../../app";

it("should have a route handler to /api/tickets for post request", async () => {
  const res = await request(app).post("/api/tickets").send({});
  expect(res.status).not.toEqual(404);
});
it("should be accessed  if user sign in", async () => {});
it("should return err if invalid title provided", async () => {});
it("should return err if invalid price provided", async () => {});
it("should create a ticket with valid inputs", async () => {});
