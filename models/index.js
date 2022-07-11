import Sequelize from "sequelize";
import Config from "../config/config.js";
import Comment from "./comment.js";
import Hashtag from "./hashtag.js";
import Image from "./image.js";
import Post from "./post.js";
import User from "./user.js";
const env = process.env.NODE_ENV || "development";
const config = Config[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Comment = Comment(sequelize, Sequelize);
db.Hashtag = Hashtag(sequelize, Sequelize);
db.Image = Image(sequelize, Sequelize);
db.Post = Post(sequelize, Sequelize);
db.User = User(sequelize, Sequelize);
Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
