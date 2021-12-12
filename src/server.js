import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home")); //home.pug를 render 해주는 route handler
app.get("/*", (req, res) => res.redirect("/")); //redirection

const handelListen = () => console.log(`Listening on http://localhost:3000`);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); //동일한 포트 내 http, ws request 처리

function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

const sockets = []; //connection한 브라우저

wss.on("connection", (socket) => {
  sockets.push(socket);
  //listenr 설정
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (message) => {
    const messageString = message.toString("utf8");
    sockets.forEach((eachSocket) => eachSocket.send(messageString));
  });
});

server.listen(3000, handelListen);
