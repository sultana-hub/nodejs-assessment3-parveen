const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashedPassword = (password) => {
    const salt = 10;
    const hash = bcryptjs.hashSync(password, salt);
    return hash

}

const comparePassword = (password, hashedPassword) => {

    return bcryptjs.compareSync(password, hashedPassword)

}

module.exports = { hashedPassword, comparePassword}