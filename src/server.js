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
  socket["nickname"] = "anony"; //nickname 안 정한 경우
  //listenr 설정
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg); //string을  JSON으로
    //message의 type에 따라
    switch (message.type) {
      case "new_message":
        sockets.forEach((eachSocket) =>
          eachSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload; //socket에 저장
        break;
    }
  });
});

server.listen(3000, handelListen);
