import express from "express";
import http from "http";
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

io.on("connection", (socket) => {
  socket.on("enter_room", (msg, done) => {
    //event의 name, front에서 전달받은 JSON objet와 콜백
    //backend에서 콜백을 호출하지만 frontend에서 실행됨
    console.log(msg);
    setTimeout(() => {
      done();
    }, 10000);
  });
});

httpServer.listen(3000, handelListen);
