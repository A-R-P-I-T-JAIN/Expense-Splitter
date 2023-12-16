const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(
      "mongodb+srv://aj748694:1X7A514CaN7IpuQL@cluster0.2fn37ae.mongodb.net/?retryWrites=true&w=majority",
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
