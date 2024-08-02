const bcrypt = require("bcrypt");
const saltRounds = 10;

/*FUNC TO GENERATE HASH PASSWORD*/
const generetHashPassword = async (normalPassword) => {
  return bcrypt.hashSync(normalPassword, saltRounds);
};

/*FUNC TO VERIFY PASSWORD*/
const verifyPassword = async (plianPassword, hashPass) => {
  return bcrypt.compareSync(plianPassword, hashPass);
};

module.exports = {
  generetHashPassword,
  verifyPassword
};