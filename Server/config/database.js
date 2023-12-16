const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(
      "mongodb+srv://aj748694:M02CSxfGPNnhrJfQ@cluster0.7apz2dm.mongodb.net/?retryWrites=true&w=majority",
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
