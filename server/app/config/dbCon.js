const mongoose = require('mongoose')



const dbCon = async () => {

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL)
        if (db) {
            console.log("Database Connected Successfully😊!")
        }
    } catch (err) {
        console.log("Database Connection failed 😒!")
          console.error(err.message);
    }

}

module.exports = dbCon