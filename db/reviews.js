const client = require('./client.js');

const createReview = async(itemId, reviewTitle, reviewDescription, reviewRating) => {
  try {
    await client.query(`
      INSERT INTO reviews (item_id, title, description, rating)
      VALUES (${itemId}, '${reviewTitle}', '${reviewDescription}', ${reviewRating});
    `);
  } catch(err) {
    console.log(err);
  }
}

const fetchReviews = async() => {
  try {
    const {rows} = await client.query(`
      SELECT * FROM items;
    `);
    return rows;
  } catch (error) {
    throw new Error('Bad Fetch')
  }
}

module.exports = { createReview, fetchReviews }