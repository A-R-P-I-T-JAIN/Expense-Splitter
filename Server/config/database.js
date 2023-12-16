const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(
      "mongodb://0.0.0.0:27017/",
      { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
      }
    )
    .then((data) => {
      console.log(`mongodb connected with server: ${data.connection.host}`);
    })
    .catch((er) => {
      console.log(er);
    });
};

module.exports = connectDatabase;
