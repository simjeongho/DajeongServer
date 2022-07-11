import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.js";

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
					if (!user) {
						done(null, false, { reason: "존재하지 않는 사용자 입니다." });
					}
					if (password === user.password()) {
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
