import express from "express";
import passport from "passport";
export const userRouter = express.Router();

userRouter.post("/login", (req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
	console.log(req);
	passport.authenticate("local", (err, user, info) => {
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
		if (err) {
			console.error(err);
			return next(err);
		}
		if (info) {
			return res.status(401).send(info.reason);
		}
		return req.login(user, async (loginErr) => {
			res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
			if (loginErr) {
				console.log(loginErr);
				return next(loginErr);
			}
			return res.json(user);
		});
	})(req, res, next);
});

export default userRouter;
