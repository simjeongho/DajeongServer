import dotenv from "dotenv";
dotenv.config();

const Config = {
	development: {
		username: "root",
		password: process.env.DB_PASSWORD,
		database: "simbwatda",
		host: "127.0.0.1",
		port: 3306,
		dialect: "mysql",
	},
	test: {
		username: "root",
		password: null,
		database: "database_test",
		host: "127.0.0.1",
		dialect: "mysql",
	},
	production: {
		username: "root",
		password: null,
		database: "database_production",
		host: "127.0.0.1",
		dialect: "mysql",
	},
};

export default Config;
