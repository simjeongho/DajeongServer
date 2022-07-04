import multer from "multer";
// multer 설정
const uploadImage = multer({
	storage: multer.diskStorage({
		// 저장할 장소
		destination(req, file, done) {
			done(null, "public/singleAlbum");
		},
		// 저장할 이미지의 파일명
		filename(req, file, done) {
			// 파일이름 + 현재시간밀리초 + 파일확장자명
			done(null, Date.now() + file.originalname);
		},
	}),
	// limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

export default uploadImage;
