import test from 'ava'
import mongoose from 'mongoose';
import model from '../lib/model'
import { MongoDBServer } from 'mongomem';

test(t => {
  t.true(true)
})

test.before('start server', async t => {
  await MongoDBServer.start();
});

test.beforeEach(async t => {
  const db = new mongoose.Mongoose();
  const connectionString = await MongoDBServer.getConnectionString()
  console.log('connection string:', connectionString)
  await db.connect(connectionString);

  console.log('_____model names:', mongoose.modelNames())
  for (const name of mongoose.modelNames()) {
    db.model(name, mongoose.model(name).schema);
  }

  t.context.db = db;
});

test.after.always('cleanup', t => {
  MongoDBServer.tearDown(); // Cleans up temporary file storage
});

test('my Mongoose model integration test', async t => {
  const { db } = t.context;
  // Now use the isolated DB instance in your test
  console.log('stats -----------:', db.connection.readyState)

  // each test must use its own mongoose instance and retrieve the models from there
  const Kitten = db.model('Kitten')
  await new Kitten({
    name: 'Boomie'
  }).save()

  const tasks = await Kitten.find({})

  t.is(tasks.length, 1)
});
