import passport from "passport";
import Config from "../config/config.json";
import { Strategy as LocalStrategy } from "passport-local";
import Sequelize from "sequelize";
import db from "../models/index.js";
const env = process.env.NODE_ENV || "development";

const User = db.User;
const PassportStrategy = () => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
			},
			async (email, password, done) => {
				try {
					const user = await User.findOne({
						where: { email },
					});
					console.log(user);
					if (!user) {
						done(null, false, { reason: "존재하지 않는 사용자 입니다." });
					}
					if (password === user.dataValues.password) {
						console.log("done!");
						return done(null, user);
					} else {
						return done(null, false, { reason: "비밀번호가 틀렸습니다." });
					}
				} catch (err) {
					console.error(err);
					return done(err);
				}
			},
		),
	);
};

export default PassportStrategy;
