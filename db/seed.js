const client = require('./client.js');
const { createItem } = require('./items.js');
const { createUser } = require('./users.js');
const { createOrder,fetchCart,updateOrder } = require('./orders.js');

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS users;
    `);
  } catch(err) {
    console.log(err);
  }
}

const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR (30) UNIQUE NOT NULL,
        password VARCHAR (60) NOT NULL,
        location VARCHAR (50) NOT NULL
      );

      CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        name VARCHAR (30) NOT NULL,
        quantity INT NOT NULL,
        location VARCHAR (50) NOT NULL,
        price INT NOT NULL,
        img_url TEXT UNIQUE,
        description VARCHAR (200),
        type VARCHAR (7) NOT NULL,
        seller_id INT NOT NULL REFERENCES users(id)
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        item_id INT REFERENCES items(id),
        buyer_id INT REFERENCES users(id),
        status VARCHAR (30) NOT NULL
      );
    `);
  } catch(err) {
    console.log(err);
  }
}

const syncAndSeed = async() => {
  await client.connect();
  console.log('connected');
  await dropTables();
  console.log('tables dropped');
  await createTables();
  console.log('tables created');
  await createUser('testUser1', 'password1', 'Sacramento, CA');
  await createUser('bobjoe', 'thisisapass', 'Phoenix, AZ');
  await createUser('gardener', 'gardenerRocks', 'Olive Branch, MS');
  console.log('users created');
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
  await createItem(
    'Hoe', 10, 'Phoenix, AZ', 2499,
    'https://images.thdstatic.com/productImages/edfbbcbf-edff-435a-9c42-52ad04b59aa5/svn/bon-tool-garden-hoes-84-472-64_600.jpg',
    'Prep the ground for planting!', 'tools', 2
  );
  await createItem(
    'Roses', 25, 'Phoenix, AZ', 499,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGNr7i-B1PaZealbetV5ZinyYHKtghXfbeqw&s',
    'They smell good too!', 'sprouts', 2
  );
  await createItem(
    'Bonsai Tree', 3, 'Olive Branch, MS', 9999,
    'https://i.etsystatic.com/22505610/r/il/680831/5562032999/il_570xN.5562032999_kb18.jpg',
    'A perfect compliment to car wax!', 'sprouts', 3
  );
  await createItem(
    'Green Bean Seeds', 100, 'Olive Branch, MS', 99,
    'https://survivalgardenseeds.com/cdn/shop/products/Bean-Contender-01.jpg?v=1655320962&width=1214',
    'Beans, beans, the magical fruit', 'seeds', 3
  );
  console.log('items created');
  await client.end();
  console.log('disconnected');
}

syncAndSeed();