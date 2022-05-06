const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
import Listen from "./mongoDB";
const port = 8080;

//express에서 static으로 활용할 폴더를 알려준다.
app.use(express.static(path.join(__dirname, "../dajeong/build")));

Listen();

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../dajeong/build/index.html"));
}); // url 과 req, res를 받는다.
//sendFile의 경우 파일 위치로 현재 server폴더이 위치 + 참조할 파일 위치를 적어줘야한다.
//현재 경로 + 상대 경로 합쳐주는 라이브러리 path

app.get("/express", (req, res) => {
	res.send("Hello Express!");
}); // url 과 req, res를 받는다.

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../dajeong/build/index.html"));
}); // url 과 req, res를 받는다.
//라우팅 규칙
