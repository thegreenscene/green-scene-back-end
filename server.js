const { createItem, fetchItems, typeFetch, oneItem } = require('./db/items.js');
const { loginUser, createUser } = require('./db/users.js');


const client = require('./db/client.js');
client.connect();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


//      GET REQUESTS      //
//DEFAULT//
app.get('/', (req, res) => {
  res.send('Welcome to The Green Scene!');
})
//ALL ITEMS//
app.get('/api/items', async(req, res) => {
  try {
    const allItems = await fetchItems();
    if (allItems === undefined || allItems.length == 0) {
      res.send('Nothing Here')
    }else{
      res.send(allItems);
    }
  } catch(err) {
    res.send(err.message);
  }
});
//ITEMS BY type//
app.get('/api/items/type/:type', async(req, res) => {
  const { type } = req.params;
  try {
    const itemType = await typeFetch(type);
    if (itemType === undefined || itemType.length == 0) {
      res.send('Nothing Here')
    }else{
      res.send(itemType);
    }
  } catch(err) {
    res.send(err.message);
  }
});
//ITEM BY ID//
app.get('/api/items/:id', async(req, res) => {
  const { id } = req.params;
  try {
    const item = await oneItem(id);
    if(item === undefined){
      res.send('Item not Found');
    }else{
      res.send(item);
    }

  } catch(err) {
    res.send(err.message);
  }
});

//     USER Requests      //
//USER LOGIN 
app.post('/api/auth/login', async (req, res) => {
  try{
  const { username, password } = req.body; 
  const authToken = await loginUser(username, password);
  res.send({token: authToken});
} catch(err){
  res.send(err.message);
}
})

app.post('/api/auth/register', async (req, res, next) => {
  try{
    const { username, password, location } = req.body; 
    const registeredUser = await createUser(username, password, location);
    res.send(`${registeredUser.username} created successfully.`);
  } catch (err) {
    res.send(err.message);
  }
})

app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}`);
});