import passport from 'passport';
import local from './local.js';
import db from '../models/index.js';

const User = db.User;
const passportConfig = () => {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findOne({ where: id });
			console.log('deserialize!', user);
			done(null, user);
		} catch (error) {
			console.error(error);
			done(error);
		}
	});

	local();
};

export default passportConfig;
