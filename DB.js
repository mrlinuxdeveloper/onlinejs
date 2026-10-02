require("dotenv").config();   // این خط باید اول باشه
const mongoose = require("mongoose");

const DB = (app) => {
    const DBuri = process.env.MONGODB_URI;

    if (!DBuri) {
        console.error("MONGODB_URI is not defined in .env file");
        process.exit(1);
    }

    mongoose.connect(DBuri)
        .then(() => {
            app.listen(process.env.PORT || 3000, () => {
                console.log(`Server is listening on port ${process.env.PORT || 3000}...`);
            });
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        });
};

module.exports = DB;