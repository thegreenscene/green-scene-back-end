const client = require('./client.js');
const createItem = require('./items.js');

const dropTables = async(req, res) => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS items;
    `);
  } catch(err) {
    res.send(err);
  }
}

const createTables = async(req, res) => {
  try {
    // When users.js and corresponding table are created, add 'REFERENCES users(id)' to seller_id below.
    await client.query(`
      CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        name VARCHAR (30) NOT NULL,
        quantity INT NOT NULL,
        location VARCHAR (50) NOT NULL,
        price INT NOT NULL,
        img_url TEXT UNIQUE,
        description VARCHAR (200),
        type VARCHAR (7) NOT NULL,
        seller_id INT NOT NULL
        );
    `);
  } catch(err) {
    res.send(err);
  }
}

const syncAndSeed = async() => {
  await client.connect();
  await dropTables();
  await createTables();
  await createItem(
    'Shovel', 7, 'Sacramento, CA', 2999,
    'https://media.istockphoto.com/id/1281644568/vector/shovel-shape-vector-icon-spade-symbol-cartoon-industrial-tool-logo-sign-silhouette-isolated.jpg?s=612x612&w=0&k=20&c=tx4uALD6qYG0gsg1GxsYZ7zEcYE3vfDF9knE3jPyBP0=',
    'Can you dig it?', 'tools', 1
  );
  await createItem(
    'Carrot Seeds', 100, 'Sacramento, CA', 99,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaazQGS60nODfO9Ep6IWbULFYpNTO6a1cCuA&s',
    'Your bunnies will LOVE these carrots!', 'seeds', 1
  );
  console.log('items created');
  await client.end();
}

syncAndSeed();