import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";
import config from "../../config.json";
import { NotAllowedError } from "../../errors";
import logger from "../../logger";

const {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  BUCKET_NAME,
  REGION,
  CLOUDFRONT_URL,
} = config.AWS.S3;

/**
 * 업로드 디렉토리의 존재 여부를 확인하고, 없을 경우 생성합니다.
 * @param {string} destination - 업로드 디렉토리 경로
 */
const ensureDirectoryExists = (destination) => {
  try {
    fs.readdirSync(destination);
  } catch (err) {
    console.error(
      `${destination} 폴더가 없어 ${destination} 폴더를 생성합니다.`
    );
    fs.mkdirSync(destination, { recursive: true });
  }
};

/**
 * 업로드 미들웨어를 생성하는 팩토리 함수
 * @param {string} destination - 업로드 디렉토리 경로
 * @returns {multer.Multer} - multer 미들웨어 인스턴스
 */
export const createUploadMiddleware = (destination) => {
  // 디렉토리 존재 여부 확인 및 생성
  ensureDirectoryExists(destination);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  return multer({ storage });
};

/**
 * Multer-S3 설정을 통한 이미지 업로드 미들웨어 생성 함수.
 * @returns {Middleware} Express용 multer 미들웨어.
 */
export const uploadImageToS3 = () => {
  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: BUCKET_NAME,
      // acl: "public-read", // 업로드된 파일의 접근 권한
      metadata: (req, file, cb) => {
        logger.debug(
          `[uploadImageToS3] file: ${JSON.stringify(file, null, 2)}`
        );
        cb(null, {});
      },
      key: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = `${uuidv4()}${fileExtension}`;
        cb(null, uniqueFileName);
      },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new NotAllowedError("허용되지 않은 파일 형식입니다."), false);
      }
    },
  });
};

export const getCloudfrontUrl = (fileKey) => `${CLOUDFRONT_URL}/${fileKey}`;
