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
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value; // 메세지 창을 비우기 위한 임시 저장
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  }); //backend로 new_message 이벤트와 실행 할 function 전달
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", inpust.value);
}

function handleRoomSubmit(event) {
  const roomNameInput = form.querySelector("#roomName");
  const nickNameInput = form.querySelector("#name");
  event.preventDefault();
  socket.emit("enter_room", roomNameInput.value, nickNameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  const changeNameInput = room.querySelector("#name input");
  changeNameInput.value = nickNameInput.value;
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("Welcome", (user) => {
  addMessage(`${user} joined`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left`);
});

socket.on("new_message", addMessage); // ===  (msg)=> {addMessage(msg)}  같은 동작

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = ""; //다른 방을 목록에 추가할 때 이전 방이 같이 달려옴
  //방이 사라지면, 지우기
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
