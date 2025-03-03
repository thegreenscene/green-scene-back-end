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

const fetchItems = async() => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM items;
    `);
    return rows;
  } catch (error) {
    throw new Error('Bad Items Fetch')
  }
}

const typeFetch = async(typeName) => {
  try {
    if(typeName!='sprouts' && typeName!='seeds' && typeName!='tools'){
      throw new Error('Invalid Item type');
    }
    const {rows} = await client.query(`
      SELECT * FROM items WHERE type='${typeName}';
    `);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error('Bad type Fetch')
  }
}

const oneItem = async(itemId) => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM items WHERE id=${itemId};
    `);
    return rows[0];
  } catch (error) {
    throw new Error('Bad Item Fetch');
  }
}

module.exports = {
  createItem,
  fetchItems,
  typeFetch,
  oneItem
};
