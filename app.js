import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { Postsrouter } from './routes/Post.js';
import { singleAlbumRouter } from './routes/singleAlbum.js';
import mongodbUrl from './password.js';
import db from './models/index.js';
import { userRouter } from './routes/user.js';
import passportConfig from './passport/index.js';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import { multiAlbumRouter } from './routes/multiAlbum.js';
import commentRouter from './routes/comments.js';
const port = 5000;
const app = express();
const __dirname = path.resolve();
const front = 'http://localhost:3000';

dotenv.config();
passportConfig();
const Options = {
	origin: `${front}`,
	credentials: true, // 쿠키 전달
};
app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);
app.use(cors(Options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	session({
		saveUninitialized: false,
		resave: false,
		secret: process.env.COOKIE_SECRET,
		cookie: {
			httpOnly: true,
			secure: false,
		},
	}),
);
app.use(passport.initialize());
app.use(passport.session());

//express에서 static으로 활용할 폴더를 알려준다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../dajeong/build')));
app.use('/public/singleAlbum', express.static('./public/singleAlbum'));
app.use('/posts', Postsrouter);
app.use('/singleAlbum', singleAlbumRouter);
app.use('/user', userRouter);
app.use('/multiAlbum', multiAlbumRouter);
app.use('/comment', commentRouter);
db.sequelize
	.sync()
	.then(() => {
		console.log('sql connected');
	})
	.catch((err) => {
		console.log(err);
	});
//에러 처리 미들웨어
//  app.use((err, req, res, next) => {
//에러 페이지 등
//  })

//Listen;
app.listen(port, () => {
	mongoose
		.connect(mongodbUrl)
		.then(() => {
			console.log(`Example app listening on port ${port}`);
			console.log(`connecting MongoDB`);
		})
		.catch((err) => {
			console.log('Error!');
			console.log(`${err}`);
		});
	console.log('app running');
});
app.get('/', (req, res) => {
	console.log('app running');
	res.send('Hello world');
	//res.sendFile(path.join(__dirname, "../dajeong/build/index.html"));
}); // url 과 req, res를 받는다.
//sendFile의 경우 파일 위치로 현재 server폴더이 위치 + 참조할 파일 위치를 적어줘야한다.
//현재 경로 + 상대 경로 합쳐주는 라이브러리 path

//body parser사용해야함

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../dajeong/build/index.html'));
}); // url 과 req, res를 받는다.
//라우팅 규칙
// app.post("/uploadImages", uploadImage.single("content"), (req, res) => {
// 	//해당 라우터가 정상동작 하면 public/upload에 이미지가 업로드된다.
// 	//업로드 된 이미지의 URL경로를 프론트엔드로 반환한다.
// 	console.log("전달받은 파일: ", req.file);
// 	console.log("저장된 파일의 이름", req.file.filename);

// 	//파일이 저장된 경로를 클라이언트에게 반환해준다.
// 	const IMG_URL = `http://localhost:5000/uploads/${req.file.filename}`;
// 	console.log(IMG_URL);
// 	res.json({ url: IMG_URL });
// });

/*
1. Post MongoDB Model
2. Client CSS (BootStrap, Emotion)
*/
