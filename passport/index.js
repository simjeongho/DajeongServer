import passport from "passport";
import local from "./local.js";

const passportConfig = () => {
	passport.serializeUser(() => {});

	passport.deserializeUser(() => {});

	local();
};

export default passportConfig;
