const socket = io(); //자동으로 socket.io를 실행하는 서버를 찾음

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function showRoom() {
  //방 입장 후 화면전환
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom); //argument 1.Event name 2.payload 3.callback
  roomName = input.value;
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);
