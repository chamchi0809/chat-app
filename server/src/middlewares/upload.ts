import multer from 'multer';
import { randomUUID } from 'crypto';
import path from 'path';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    (req as any).mimetype = file.mimetype;
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  }
});


export default multer({storage});