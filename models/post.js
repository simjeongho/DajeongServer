const Post = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		"Post",
		{
			//id가 기본적으로 들어있다.
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		//retweetId
		{
			charset: "utf8mb4",
			collate: "utf8mb4_general_ci", // 이모티콘 저장
		},
	);
	Post.associate = (db) => {
		db.Post.belongsTo(db.User);
		db.Post.hasMany(db.Comment);
		db.Post.hasMany(db.Image);
		db.Post.belongsToMany(db.Hashtag, { through: "postHashtag" });
		db.Post.belongsTo(db.Post, { as: "Retweet" });
		db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
	};
	return Post;
};

export default Post;
