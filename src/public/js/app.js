//frontend
//server로 socket 보내고 받기
//여기서의 socket - 서버로의 connection
const socket = new WebSocket(`ws://${window.location.host}`);