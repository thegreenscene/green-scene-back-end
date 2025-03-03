const client = require('./client.js');
const bcrypt = require('bcrypt');

const createUser = async (userName, password) => {

  const hashedPW = await bcrypt.hash(password, 10);
  
  await client.query(`
    INSERT INTO users(username, password)
    VALUES ('${userName}', '${hashedPW}');
    `);
}
module.exports = {
createUser
}