const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {};

mongoose.connect(
  "mongodb+srv://welder:welder@cluster0-bvx8q.mongodb.net/semana9?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

io.on("connection", (socket) => {
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;
  /* console.log(socket.handshake.query);
  console.log("Usuário conectado ", socket.id); */
});

app.use((request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());

app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
app.use(routes);

server.listen(3333);
