const client = require('./db/client.js');
client.connect();

const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to The Green Scene!');
})

app.get('/api/items', async(req, res) => {
  try {
    const allItems = await client.query(`SELECT * FROM items;`);
    res.send(allItems.rows);
  } catch(err) {
    res.send(err.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}`);
});