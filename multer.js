import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';
import dotenv from 'dotenv';
import { s3_access_key_id, s3_secret_access_key } from './password.js';
// multer 설정
const uploadImage = multer({
	storage: multer.diskStorage({
		// 저장할 장소
		destination(req, file, done) {
			done(null, 'public/singleAlbum');
		},
		// 저장할 이미지의 파일명
		filename(req, file, done) {
			// 파일이름 + 현재시간밀리초 + 파일확장자명
			done(null, Date.now() + file.originalname);
		},
	}),
	// limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

AWS.config.update({
	accessKeyId: s3_access_key_id,
	secretAccessKey: s3_secret_access_key,
	region: 'ap-northeast-2',
});

export const uploadS3 = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: 'simbwatda',
		key(req, file, cb) {
			cb(null, `multiAlbum/${Date.now()}_${path.basename(file.originalname)}`);
		},
	}),
	limits: { fileSize: 20 * 1024 * 1024 },
});
export default uploadImage;
