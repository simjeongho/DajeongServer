import mongoose from 'mongoose';
import express from 'express';
import uploadImage from '../multer.js';
import Counter from './counter.js';
import { isLoggedIn } from './middlewares.js';
export const singleAlbumRouter = express.Router();
const singleAlbumSchema = new mongoose.Schema({
	title: String,
	content: String,
	filePath: String,
	postNum: Number,
});

const SingleAlbum = mongoose.model('singleAlbum', singleAlbumSchema);

singleAlbumRouter.post('/uploadSingleAlbumPost', isLoggedIn, uploadImage.single('singleImage'), (req, res, next) => {
	if (next) {
		const imageUrl = 'http://localhost:5000/public/singleAlbum';
		const body = req.body;
		Counter.findOne({ name: 'counter' })
			.exec()
			.then((counter) => {
				body.postNum = counter.postNum;

				const singleAlbum = new SingleAlbum({ ...body, filePath: res.req.file.path });
				singleAlbum
					.save()
					.then(() => {
						Counter.updateOne({ name: 'counter' }, { $inc: { postNum: 1 } }).then(() => {
							res.setHeader('Access-Control-Allow-Origin', '*');

							res
								.status(200)
								.json({ success: true, filePath: `${imageUrl}${res.req.file.path}`, text: '몽고 DB 저장 성공' });
						});
					})
					.catch((err) => {
						res.status(400).json({ success: false });
					});
			});
	} else {
		res.send('SingleImageTestSuccess!');
	}
});

singleAlbumRouter.get('/getList', isLoggedIn, (req, res, next) => {
	SingleAlbum.find()
		.exec()
		.then((doc) => {
			res.setHeader('X-Content-Type-Options', 'nosniff');
			res.status(200).json({ success: true, singleAlbumList: doc });
		})
		.catch((err) => {
			res.status(400).json({ success: false });
		});
});

singleAlbumRouter.get('/getDetail/:postNum', isLoggedIn, (req, res, next) => {
	console.log(req);
	SingleAlbum.findOne({ postNum: Number(req.params.postNum) })
		.exec()
		.then((doc) => {
			console.log(doc);

			res.setHeader('X-Content-Type-Options', 'nosniff');
			res.status(200).json({ success: true, singleAlbumDetail: doc });
		})
		.catch((err) => {
			res.status(400).json({ success: false });
		});
});

export default SingleAlbum;
