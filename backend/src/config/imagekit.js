import multer from 'multer'
import ImageKit from 'imagekit'
import { ENV } from './env.js';
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// ImageKit initialization
export const imagekit = new ImageKit({
  publicKey: ENV.PUBLIC_KEY,
  privateKey: ENV.PRIVATE_KEY,
  urlEndpoint: ENV.URL_ENDPOINT
});
