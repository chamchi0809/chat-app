import fs from 'fs-extra';
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filePath = `attachments/${req.params.roomId}/${(req as any).randomId}`;
        (req as any).filePath = filePath;
        fs.mkdirSync(filePath, {recursive: true});
        cb(null, filePath)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        (req as any).mimetype = file.mimetype;
        cb(null, path.basename(file.originalname, ext) + ext);
    }
});


export default multer({storage});