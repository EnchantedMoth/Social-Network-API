const connection = require('../config/connection')
const { Thought, User } = require('../models')
const { thoughts, users} = require('./data')

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');
    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
        await connection.dropCollection('users');
    }

    let thoughtcheck = await connection.db.listCollections({ name: 'thoughts'}).toArray();
    if (thoughtcheck.length) {
        await connection.dropCollection('thoughts');
    }

    await User.collection.insertMany(users);
    await Thought.collection.insertMany(thoughts);
    


    console.table(users);
    console.table(thoughts);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});