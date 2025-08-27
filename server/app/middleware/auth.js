

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpStatusCode = require('../helper/httpStatusCode');


const hashedPassword = (password) => {
    const salt = 10;
    const hash = bcryptjs.hashSync(password, salt);
    return hash

}

const comparePassword = (password, hashedPassword) => {

    return bcryptjs.compareSync(password, hashedPassword)

}


const AuthCheck = (req, res, next) => {
    const token = req?.body?.token || req?.headers['x-access-token']
    if (!token) {
        return res.status(httpStatusCode.BadRequest).json({
            status: false,
            message: "please login first to access this apge"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(" Token decoded:", decoded);
        req.user = decoded
        next()
    } catch (error) {
        return res.status(httpStatusCode.NotFound).json({
            status: false,
            message: "invalid token access"
        })
    }


}









module.exports = { hashedPassword, comparePassword, AuthCheck }