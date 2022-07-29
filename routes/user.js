import express from 'express';
import next from 'next';
import passport from 'passport';
import db from '../models/index.js';
import { uploadS3Profile } from '../multer.js';
import { isNotLoggedIn, isLoggedIn } from '../routes/middlewares.js';
export const userRouter = express.Router();

const User = db.User;
userRouter.get('/', async (req, res, next) => {
	try {
		if (req.user) {
			const user = await User.findOne({
				where: { id: req.user.id },
			});
			res.status(200).json(user);
		} else {
			res.status(200).json(null);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});
userRouter.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			console.error(err);
			return next(err);
		}
		if (info) {
			return res.status(401).send(info.reason);
		}
		return req.login(user, async (loginErr) => {
			if (loginErr) {
				console.log(loginErr);
				return next(loginErr);
			}
			const fullUserWithoutPassword = await User.findOne({
				where: { id: user.id },
				attributes: {
					exclude: ['password'],
				},
				include: [
					{
						model: db.Post,
					},
					{
						model: db.Comment,
					},
				],
			});
			return res.status(200).json(fullUserWithoutPassword);
		});
	})(req, res, next);
});

userRouter.post('/logout', isLoggedIn, (req, res) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		console.log(req.body);
		req.session.destroy();
	});
	res.send('logout Success');
});

userRouter.post('/Description', isLoggedIn, async (req, res) => {
	console.log(req);
	try {
		await User.update(
			{
				profileDescription: req.body.profileDescription,
			},
			{ where: { id: req.body.userId } },
		);
		res.status(200).json({ userDescriptionUploadSuccess: true });
	} catch (err) {
		console.log(err);
		res.status(401).json({ userDescriptionUploadSuccess: false });
	}
});

userRouter.post('/profileImage', isLoggedIn, uploadS3Profile.single('profileImage'), async (req, res) => {
	console.log(req.file);

	res.json(req.file.location);
	try {
		await User.update(
			{
				profileImage: req.file.location,
			},
			{ where: { id: req.body.userId } },
		);
		res.status(200).json({ userProfileImageUploadSuccess: true });
	} catch (err) {
		console.log(err);
		res.status(401).json({ userProfileImageUploadSuccess: false });
	}
});

export default userRouter;
