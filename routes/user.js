import express from 'express';
import next from 'next';
import passport from 'passport';
import db from '../models/index.js';
import { isNotLoggedIn, isLoggedIn } from '../routes/middlewares.js';
export const userRouter = express.Router();

const User = db.User;
userRouter.post('/login', isNotLoggedIn, (req, res, next) => {
	console.log(req);
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
			console.log('authenticated', req.isAuthenticated());
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

export default userRouter;
