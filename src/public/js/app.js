const socket = io(); //자동으로 socket.io를 실행하는 서버를 찾음

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { patload: input.value }, () => {
    console.log("Server is done");
  }); //argument 1.Event name 2.payload 3.callback
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);
