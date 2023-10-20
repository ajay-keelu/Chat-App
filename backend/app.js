const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose"); // ajaykeelu ajay1234 -- chatapp chatapp

const app = express();
const { notFound, errorHandler } = require("./middlewareError/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
app.use(cors());

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

{
  /* ====== Mongo Connection ========*/
  const url =
    "mongodb+srv://ajaykeelu:ajay1234@chatappp.my1tv6e.mongodb.net/chatapp?retryWrites=true&w=majority";
  // "mongodb+srv://bsahwik379:ChatApp123@chatapp.jsyuwev.mongodb.net/?retryWrites=true&w=majority";

  const mongoConnect = async () => {
    await mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log(" db connected ");
      })
      .catch((err) => console.log(err));
  };
  mongoConnect();

  /* ====== Mongo Connection ======== */
}

app.use("/", (req, res) => {
  res.send("Welcome Home");
});

app.listen(1111, () => {
  console.log("http://localhost:1111");
});
