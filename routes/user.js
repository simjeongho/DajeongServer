import express from 'express';
import next from 'next';
import passport from 'passport';
import db from '../models/index.js';
export const userRouter = express.Router();

const User = db.User;
userRouter.post('/login', (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
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
			return res.status(200).json(fullUserWithoutPassword);
		});
	})(req, res, next);
});

userRouter.post('/logout', (req, res) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.session.destroy();
	});
	res.send('logout Success');
});

export default userRouter;
