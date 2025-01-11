import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import config from "../../config.json";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME, REGION } = config.AWS.S3;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

/**
 * Multer-S3 설정을 통한 이미지 업로드 미들웨어 생성 함수.
 * @returns {Middleware} Express용 multer 미들웨어.
 */
const uploadImageToS3 = () =>
  multer({
    storage: multerS3({
      s3: s3Client,
      bucket: BUCKET_NAME,
      // acl: "public-read", // 업로드된 파일의 접근 권한
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = `${uuidv4()}${fileExtension}`;
        cb(null, uniqueFileName);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (5MB)
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("허용되지 않은 파일 형식입니다."), false);
      }
    },
  });

export default uploadImageToS3;
