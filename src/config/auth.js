require('dotenv').config();

export default {
  secret: process.env.JWT_TOKEN_SECRET,
  expiresIn: '365d',
};
