import express from "express";
import mongoose from "mongoose";
import path from "path";
import Post from "./Model/Post.js";
import mongodbUrl from "./mongoDB.js";
const port = 5000;
const app = express();

const __dirname = path.resolve();

//express에서 static으로 활용할 폴더를 알려준다.
app.use(express.static(path.join(__dirname, "../dajeong/build")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Listen;
app.listen(port, () => {
	mongoose
		.connect(mongodbUrl)
		.then(() => {
			console.log(`Example app listening on port ${port}`);
			console.log(`connecting MongoDB`);
		})
		.catch((err) => {
			console.log("Error!");
			console.log(`${err}`);
		});
	console.log("app running");
});

app.get("/", (req, res) => {
	console.log("app running");
	res.send("Hello world");
	//res.sendFile(path.join(__dirname, "../dajeong/build/index.html"));
}); // url 과 req, res를 받는다.
//sendFile의 경우 파일 위치로 현재 server폴더이 위치 + 참조할 파일 위치를 적어줘야한다.
//현재 경로 + 상대 경로 합쳐주는 라이브러리 path

app.get("/express", (req, res) => {
	res.send("Hello Express!");
}); // url 과 req, res를 받는다.

//body parser사용해야함
app.post("/api/test", (req, res) => {
	const ContentPost = new Post({ title: "test", content: "테스트입니다." });
	ContentPost.save().then(() => {
		res.status(200).json({ success: true });
	});
	console.log(req.body);
	res.send("요청 성공!");
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../dajeong/build/index.html"));
}); // url 과 req, res를 받는다.
//라우팅 규칙

/*
1. Post MongoDB Model
2. Client CSS (BootStrap, Emotion)
*/
