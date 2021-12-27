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

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  // const sids = io.sockets.adapter.sids;
  // const rooms = io.sockets.adapter.rooms;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

//socket.io server API 문서 참고 ->사용해보니 websocket보다 기능이 많고 편리하다.
io.on("connection", (socket) => {
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
    done(); //방에 들어왔을 때 app.js에서 전달받은 showRoom을 실행
    socket.to(roomName).emit("Welcome", socket.nickname, countRoom(roomName));

    io.sockets.emit("room_change", publicRooms()); //모든 socket으로 공지
  });

  /* 연결 끊김 */ //disconnecting의 경우 퇴장하기 직전, 방을 떠나지 않음
  socket.on("disconnecting", () => {
    socket.rooms.forEach(
      (room) =>
        socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1) //퇴장하기 직전이라 우리방을 포함하므로 1을 빼줌
    );
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms()); //모든 socket으로 공지
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
