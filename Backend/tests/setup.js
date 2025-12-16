const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

/**
    * TEST SETUP FILE
    make sure to disable redis,
    cookies secure: true to false in login.js
    before running tests, which are meant for local environment.
 */

let mongo;

// START IN-MEMORY MONGO
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    dbName: "jest",
  });
});

// CLEAN DB AFTER EACH TEST
afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// SHUTDOWN EVERYTHING CLEANLY
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongo.stop();
});
