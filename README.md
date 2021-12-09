#Noom

Zoom Clone using NodeJs, WebRTC and Websockets"# zoom-clone" 
노마드 코더 강의를 보며 연습한 코드입니다.


Nodemon - 변경사항이 있을 시 서버를 재시작
이때 "exec": "babel-node src/server.js" 서버를 재시작하는 대신 babel-node실행 -> babel.config.json 찾아감 -> 코드에 적용돼야 하는 preset 실행 ...단순히 모든 es6 plugin을 설치 및 원하는 브라우저만 지원하도록 plugin 선택 
babel은 작성한 코드를 일반 NodeJs코드로 컴파일해줌, 그 작업을 src/server.js

server.js - BackEnd 구성
express를 import해서 express 어플리케이션을 구성, view engine은 Pug로 설정
* app.use("/public", express.static(__dirname+"/public")); : public 파일을 공개. 유저가 볼 수 있는 파일을 지정한 것
* app.get("/", (req,res)=> res.render("home")); : 해당 웹에 접속 시 사용될 템플릿을 랜더링(views에 있는 home.pug)
* app.get("/*", (req,res)=> res.redirect("/")); : 해당 프로젝트에서 다른 Url은 사용하지 않을 계획이므로, redirectin을 적용시킨다.

public - FrontEnd 구성

