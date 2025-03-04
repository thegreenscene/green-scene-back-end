const { createItem, fetchItems, typeFetch, oneItem } = require('./db/items.js');
const { loginUser, validateUser } = require('./db/users.js');
const { createOrder, fetchCart, updateOrder, deleteOrder} = require('./db/orders.js');


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

//     POST Requests      //
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
//ADD TO CART
app.post('/api/user/cart', async (req, res) => {
  try {
    const {itemId, quantity, token} = req.body;
    const userData = await validateUser(token);
    const order = createOrder(itemId, userData.id, quantity);
    if(order){
      res.status(200).send(order);
    }else{
      throw new Error('A problem was encountered upon creation');
    }
  } catch (error) {
    req.send(error.message);
  }
})


app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}`);
});