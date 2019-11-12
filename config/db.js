const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');


const connectDb = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log("MongoDB connected...");
    } catch (err) {
        console.error(err);
        process.exit(1)
    }
};

// mongoose.connect(db, {
//         useUnifiedTopology: true,
//         useNewUrlParser: true
//     })
//     .then(() => {
//         console.log("connected to database")
//     })
//     .catch((err) => {
//         console.error(err, "not connected to database")
//     });



module.exports = connectDb;