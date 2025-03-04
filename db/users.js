const client = require('./client.js');
const bcrypt = require('bcrypt');

const createUser = async (userName, password, userLocation) => {

  const hashedPW = await bcrypt.hash(password, 10);
  
  await client.query(`
    INSERT INTO users (username, password, location)
    VALUES ('${userName}', '${hashedPW}', '${userLocation}');
    `);
}
module.exports = {
createUser
}