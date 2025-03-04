const client = require('./client.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (userName, password, location) => {

  const hashedPW = await bcrypt.hash(password, 10);

  await client.query(`
    INSERT INTO users(username, password, location)
    VALUES ('${userName}', '${hashedPW}', '${location}');
    `);
}

const loginUser = async (inputUser, inputPassword) => {
  try {
    const { rows } = await client.query(`
    SELECT * FROM users WHERE username='${inputUser}';
    `);
    const userCheck = rows[0];
    if (userCheck) {
      const isPasswordValid = await bcrypt.compare(inputPassword, userCheck.password);
      if (isPasswordValid) {
        const token = await jwt.sign({ id: userCheck.id }, process.env.SECRET);

        return token;
      }
    } else {
      throw new Error('Bad Credentials');
    }
  } catch (err) {
    throw new Error('Bad Credentials');
  }
}
module.exports = {
  createUser,
  loginUser
}