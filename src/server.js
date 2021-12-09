import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname+ "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home")); //home.pug를 render 해주는 route handler
app.get("/*", (req,res)=> res.redirect("/")); //redirection

const handelListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handelListen); 