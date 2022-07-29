import express from 'express';
import { isLoggedIn } from './middlewares.js';
import db from '../models/index.js';
import e from 'express';

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
			where: { PostId: Number(req.params.id) },
			order: [['createdAt', 'DESC']],
			include: [
				{
					model: db.User,
					attributes: ['nickname', 'profileImage'],
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

commentRouter.delete('/multiAlbum/delete/:id', isLoggedIn, async (req, res) => {
	console.log(req.body);
	if (req.body.UserId === req.body.creatorId) {
		try {
			await db.Comment.destroy({ where: { id: req.body.id } });
		} catch (err) {
			console.log('error occur! while delete comment');
		}
	} else {
		res.status(401).json({ success: false, message: '작성자가 아닙니다.' });
	}
});

export default commentRouter;
