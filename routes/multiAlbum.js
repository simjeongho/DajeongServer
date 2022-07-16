import express from 'express';
import { isLoggedIn } from './middlewares.js';
import { uploadS3 } from '../multer.js';
export const multiAlbumRouter = express.Router();

multiAlbumRouter.post('/uploadMultiAlbumPost', isLoggedIn, uploadS3.array('multiImage'), (req, res) => {
	console.log('multiupload', req.files);
	res.json(req.files.map((y) => y.location)); // 파일 명 리턴
	//리사이징
});
