const client = require('./client.js');

const createItem = async(
  itemName, itemQuantity, itemLocation, itemPrice, 
    itemImageUrl, itemDescription, itemType, itemSellerId
) => {
  try {
    await client.query(`
      INSERT INTO items (
        name, quantity, location, price, img_url, description, type, seller_id
      )
      VALUES (
        '${itemName}', ${itemQuantity}, '${itemLocation}', ${itemPrice}, 
          '${itemImageUrl}', '${itemDescription}', '${itemType}', ${itemSellerId}
      )
    `);
  } catch(err) {
    console.log(err);
  }
}

module.exports = createItem;