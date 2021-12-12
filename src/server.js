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

//express application으로 wetsocket을 만들 서버 만들어서 접근하기
// 같은 서버에서 http와 ws 작동
const server = http.createServer(app); //http 서버
//webSocket server
const wss = new WebSocket.Server({ server }); //동일한 포트 내 http, ws request 처리

function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

function onSocketMessage(message) {
  console.log(message.toString("utf8"));
}
//특정 event -> 지정한 콜백을 실행, ws에서 정해진 event와 콜백명을 쓰면 됨
//frontend로 socket 주고 받기
//여기서의  socket - 브라우저와의 connetction
wss.on("connection", (socket) => {
  //listenr 설정
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", onSocketMessage);
  socket.send("hello");
});

server.listen(3000, handelListen);
