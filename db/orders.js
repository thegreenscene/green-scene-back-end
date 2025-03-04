const client = require('./client.js');

const createOrder = async(itemId, buyerId, quantity) => {
  try {
    const {rows} = await client.query(`
      INSERT INTO orders (item_id,buyer_id,status,quantity)
      VALUES (${itemId}, ${buyerId}, 'cart', ${quantity})
      RETURNING *;
    `);
    console.log('Order created!')
    return rows[0];
  } catch (error) {
    console.log(error)
  }
}

const fetchCart = async(userId) => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM orders WHERE buyer_id=${userId};
    `);
    return rows;
  } catch (error) {
    console.log(error)
  }
}

const updateOrder = async(orderId, status) => {
  try {
    const {rows} = await client.query(`
      UPDATE orders
      SET
        status=${status}
      WHERE
        id=${orderId}
      RETURNING *;
    `);
    console.log('Order Updated!');
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

const deleteOrder = async(orderId) => {
  try {
    await client.query(`
      DELETE FROM orders WHERE id=${orderId};
    `);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createOrder,
  fetchCart,
  updateOrder,
  deleteOrder
}