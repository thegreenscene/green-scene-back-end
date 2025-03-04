const client = require('./client.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (userName, password, userLocation) => {

  const hashedPW = await bcrypt.hash(password, 10);
  
  const { rows } = await client.query(`
    INSERT INTO users (username, password, location)
    VALUES ('${userName}', '${hashedPW}', '${userLocation}')
    RETURNING * ;
    `);

    const createdUser = rows[0];
    return createdUser;
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

const validateUser = async (token) => {
  try {
    const userData = await jwt.verify(token, process.env.SECRET);
    const {rows} = await client.query(`
      SELECT * FROM users WHERE id='${userData.id}';
    `);
    const user = rows[0];
    if(user){
      return user;
    }else{
      throw new Error('Bad Token');
    }
  } catch (error) {
    throw new Error('Bad Token');
  }
}

module.exports = {
  createUser,
  loginUser,
  validateUser
}