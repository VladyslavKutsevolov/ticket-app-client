import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();

  process.env.JWT_KEY = "fasf";

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "1234565";

  const res = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = res.get("Set-Cookie");

  return cookie;
};
