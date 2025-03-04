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

module.exports = { createReview }