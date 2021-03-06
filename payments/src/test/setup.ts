import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51HbxKUHtdojMu9vNHmuvfPIvb31Jr3pf931dJ57VimhlojFALACCD3JdXcWlPYYUKzPtm0mVHoPeCPtvpXVoUYbX009lnXlgrQ";
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
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  const payload = {
    id: id || mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const jwtToken = jwt.sign(payload, process.env.JWT_KEY!);

  const session = {
    jwt: jwtToken,
  };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`express:sess=${base64}`];
};
