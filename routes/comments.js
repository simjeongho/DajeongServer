import express from 'express';
import { isLoggedIn } from './middlewares.js';
import db from '../models/index.js';

export const commentRouter = express.Router();

commentRouter.post('/multiAlbum/:id', isLoggedIn, async (req, res) => {
	console.log('commentsss', req.body);
	try {
		const comment = await db.Comment.create({
			UserId: req.body.userId,
			PostId: req.params.id,
			content: req.body.content,
		}); // 댓글 쓰기 user정보와 post 정보
		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err);
	}
});

commentRouter.get('/multiAlbum/:id', isLoggedIn, async (req, res) => {
	try {
		const comments = await db.Comment.findAll({
			order: [['createdAt', 'DESC']],
			include: [
				{
					model: db.User,
					attributes: ['nickname'],
				},
			],
		});
		const multiAlbumComments = {
			multiAlbumComments: comments,
		};
		res.status(200).json(multiAlbumComments);
	} catch (err) {
		console.log(err);
		res.status(403).json({ success: false });
	}
});

export default commentRouter;
