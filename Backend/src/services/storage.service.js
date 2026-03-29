import dotenv from 'dotenv';
dotenv.config();
import ImageKit, { toFile } from '@imagekit/nodejs';

const imagekit  = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, 
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY, 
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file,fileName){

  const fileObject = await toFile(file, fileName);

  const result = await imagekit.files.upload({
     file: fileObject,
    fileName: fileName,
  })
  return result;
}

export default {
  uploadFile
}