export default (sequelize, DataTypes) => {
	const Hashtag = sequelize.define(
		"Hashtag",
		{
			//id가 기본적으로 들어있다.
			name: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
		},
		{
			charset: "utf8mb4",
			collate: "utf8mb4_general_ci", // 이모티콘 저장
		},
	);
	Hashtag.associate = (db) => {
		db.Hashtag.belongsToMany(db.Hashtag);
	};
	return Hashtag;
};
