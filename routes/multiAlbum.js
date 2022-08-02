import express from 'express';
import { isLoggedIn } from './middlewares.js';
import { uploadS3 } from '../multer.js';
import db from '../models/index.js';
import sequelize from 'sequelize';
export const multiAlbumRouter = express.Router();

multiAlbumRouter.get('/getList', async (req, res) => {
	console.log(req);
	try {
		const postList = await db.Post.findAll({
			limit: 9,
			order: [['id', 'DESC']],
			include: [
				{
					model: db.Image,
					attributes: ['src', 'PostId'],
				},
				{
					model: db.User,
					attributes: ['nickname', 'profileImage'],
				},
			],
		});
		const multiAlbum = {
			multiAlbumList: postList,
		};
		res.status(200).json(multiAlbum);
	} catch (err) {
		console.log(err);
	}
});

multiAlbumRouter.get('/getAllList', async (req, res) => {
	console.log(req);
	let offset = req.query.offset;
	let limit = req.query.limit;
	console.log('req.query는', req.query.limit);
	console.log('req.path는', req.baseUrl + req.url);
	const count = await db.Post.count();
	try {
		const postList = await db.Post.findAll({
			order: [['id', 'DESC']],
			offset: Number(offset),
			limit: Number(limit),
			//attributes: { include: [[sequelize.fn('COUNT', 'id'), 'totalPost']] },
			include: [
				{
					model: db.Image,
					attributes: ['src', 'PostId'],
				},
				{
					model: db.User,
					attributes: ['nickname', 'profileImage'],
				},
			],
		});
		const multiAlbum = {
			multiAlbumList: postList,
			hasMore: Number(offset) + Number(limit) < count ? true : false,
			next: req.baseUrl + req.url,
			limit: limit,
			nextOffset: Number(offset) + Number(limit),
			count: count,
		};
		res.status(200).json(multiAlbum);
	} catch (err) {
		console.log(err);
	}
});

multiAlbumRouter.get('/:id', isLoggedIn, async (req, res) => {
	console.log(req);
	try {
		const FullPost = await db.Post.findOne({
			where: { id: Number(req.params.id) },
			include: [
				{
					model: db.Image,
					attributes: ['src', 'PostId'],
				},
				{
					model: db.Comment,
					attributes: ['UserId', 'content', 'createdAt'],
				},
				{
					model: db.User,
					attributes: ['nickname', 'profileImage'],
				},
				{
					model: db.User,
					as: 'Likers',
					attributes: ['id', 'nickname', 'profileImage'],
				},
			],
		});
		const fullPost = {
			multiAlbumDetail: FullPost,
		};
		res.status(200).json(fullPost);
	} catch (err) {
		console.log(err);
	}
});

multiAlbumRouter.post('/uploadMultiAlbumImage', isLoggedIn, uploadS3.array('multiImage'), async (req, res) => {
	console.log('multiupload', req.files);
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
multiAlbumRouter.get('/:postId/liked', async (req, res, next) => {
	// 포스트마다 좋아요 누른 사람
	try {
		const postLikers = await db.Post.findOne({
			where: { id: req.params.postId },
			include: [
				{
					model: db.User,
					as: 'Likers',
				},
			],
		});
		if (!postLikers) {
			return res.status(403).send('게시글이 존재하지 않습니다.');
		}
		res.json(postLikers);
		//res.json(user);
	} catch (err) {
		console.log(err);
		next(err);
	}
});
multiAlbumRouter.get('/:userId/likes', async (req, res, next) => {
	// 유저가 좋아요 누른 포스트
	try {
		const user = await db.User.findOne({
			where: { id: Number(req.params.userId) },
			include: [
				{
					model: db.Post,
					as: 'Liked',
					attributes: ['id', 'title', 'content', 'UserId'],
					include: [
						{
							model: db.Image,
						},
					],
				},
			],
		});
		console.log('user', req.params.userId);
		//const userLike = await user.getLiked();
		if (!user) {
			return res.status(403).send('유저가 존재하지 않습니다.');
		}
		res.json(user);
		//res.json({ PostId: post.id, UserId: req.user.id, Message: '좋아요 성공' });
	} catch (err) {
		console.log(err);
		next(err);
	}
});

multiAlbumRouter.patch('/:id/like', isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({
			where: { id: req.body.PostId },
		});
		console.log(req.body);
		console.log('user', req.user.id);
		if (!post) {
			return res.status(403).send('게시글이 존재하지 않습니다.');
		}
		await post.addLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id, Message: '좋아요 성공' });
	} catch (err) {
		console.log(err);
		next(err);
	}
});
multiAlbumRouter.delete('/:id/like', isLoggedIn, async (req, res, next) => {
	// DELETE /post/1/like
	try {
		const post = await db.Post.findOne({ where: { id: req.params.id } });
		if (!post) {
			return res.status(403).send('게시글이 존재하지 않습니다.');
		}
		await post.removeLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id, Message: '좋아요 취소 성공' });
	} catch (error) {
		console.error(error);
		next(error);
	}
});
