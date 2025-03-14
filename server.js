const { createItem, fetchItems, typeFetch, oneItem } = require('./db/items.js');
const { loginUser, validateUser, createUser } = require('./db/users.js');
const { createOrder, fetchCart, updateOrder, deleteOrder, fetchOrders} = require('./db/orders.js');
const { fetchReviews } = require('./db/reviews.js');

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
//ALL REVIEWS//
app.get('/api/reviews', async(req, res) => {
  try {
    const allReviews = await fetchReviews();
    if (allReviews === undefined || allReviews.length == 0) {
      res.send('No Reviews Found');
    }else{
      res.send(allReviews);
    }
  } catch(err) {
    res.send(err.message);
  }
});
//ALL ORDERS//
app.get('/api/orders', async(req, res) => {
  try {
    const orders = await fetchOrders();
    if (orders === undefined || orders.length == 0) {
      res.send('No Orders Found');
    }else{
      res.send(orders);
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

//ITEM POST
app.post('/api/items', async (req, res, next) => {
  try{
    const { name, quantity, location, price, imgUrl, description, type, sellerId } = req.body;
    const newPost = await createItem(name, quantity, location, price, imgUrl, description, type, sellerId)
    res.send('done')
  } catch(err) {
    res.send(err.message);
  }
})


//USER REGISTRATION
app.post('/api/auth/register', async (req, res, next) => {
  try{
    const { username, password, location } = req.body; 
    const registeredUserToken = await createUser(username, password, location);
    res.send({token: registeredUserToken});
  } catch (err) {
    res.send(err.message);
  }
})

//ADD TO CART
app.post('/api/user/cart', async (req, res) => {
  try {
    console.log(req.body);
    const {itemId, quantity, token} = req.body;
    console.log('here');
    const userData = await validateUser(token);
    console.log('there');
    const order = await createOrder(itemId, userData.id, quantity);
    if(order){
      res.status(201).send(order);
    }else{
      throw new Error('A problem was encountered upon creation');
    }
  } catch (error) {
    res.send(error.message);
  }
})


//     DELETE Requests      //
//Delete order
app.delete('/api/user/cart', async (req, res) => {
  try {
    const {itemId, token} = req.body;
    const userData = await validateUser(token);
    await deleteOrder(itemId, userData.id);
    res.status(200).send('Order Deleted!');
  }catch (error) {
    res.send(error.message);
  }
})

app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}`);
});
