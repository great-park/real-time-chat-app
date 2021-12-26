import express from "express";
import http from "http";
import { SocketAddress } from "net";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home")); //home.pug를 render 해주는 route handler
app.get("/*", (req, res) => res.redirect("/")); //redirection
const handelListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

//socket.io server API 문서 참고 ->사용해보니 websocket보다 기능이 많고 편리하다.
io.on("connection", (socket) => {
  socket["nickname"] = "익명";
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  });

  /* 채팅방 입장 */
  socket.on("enter_room", (roomName, nickname, done) => {
    socket.onAny((event) => {
      console.log(`Socket Event : ${event}`);
    });
    socket["nickname"] = nickname;
    socket.join(roomName);
    socket.to(roomName).emit("Welcome", socket.nickname);
    done(); //방에 들어왔을 때 app.js에서 전달받은 showRoom을 실행
  });

  /* 연결 끊김 */
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });

  /* 메세지 입력 */
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done(); //frontend에서 실행될 것
  });

  /* 닉네임 설정 */
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handelListen);
