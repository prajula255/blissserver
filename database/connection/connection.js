const mongoose = require("mongoose");
const connectionString = process.env.dbConnectionString

mongoose.connect(connectionString).then(() => {
    console.log("connection success");

}).catch(error => {
    console.log("connection to db failed", error);

})



