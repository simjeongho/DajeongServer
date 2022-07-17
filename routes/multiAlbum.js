import express from 'express';
import { isLoggedIn } from './middlewares.js';
import { uploadS3 } from '../multer.js';
import db from '../models/index.js';
export const multiAlbumRouter = express.Router();

multiAlbumRouter.post('/uploadMultiAlbumImage', isLoggedIn, uploadS3.array('multiImage'), async (req, res) => {
	console.log('multiupload', req.files);
	const date = new Date();
	res.json(req.files.map((y) => y.location)); // 파일 명 리턴
	console.log('req body다 ', req.body);
	console.log('req.body.content', req.body.content);
	//리사이징

	//포스트 아이디 가져와서 보내주기
	// 이미지 주소 저장하기
});

multiAlbumRouter.post('/uploadMultiAlbumContent', isLoggedIn, async (req, res, next) => {
	console.log('두번 요청', req.body);
	res.status(200).json('두번도됨');
	//
	try {
		const post = await db.Post.create({
			title: req.body.title,
			content: req.body.content,
			UserId: req.body.userId,
		}); // 포스트 만들기
		if (req.body.imagepath) {
			if (Array.isArray(req.body.imagepath)) {
				const images = await Promise.all(
					req.body.imagepath.map((image) => {
						db.Image.create({ src: image, PostId: post.id });
					}),
				);
				console.log('여기 실행됨');
				//await post.addImages(images);
			} else {
				const image = await db.Image.create({ src: req.body.imagepath });
				await post.addImages(image);
			}
		}
	} catch (err) {
		console.log(err);
	}
});
