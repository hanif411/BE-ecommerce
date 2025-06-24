import multer from "multer";
import path from "path";

const FILE_TYPE = {
    "image/jpeg": "jpg",
    "image/png": "png",
}

const storage = multer.diskStorage({
    destination: function(req,file,cb){

        const isValidFormat = FILE_TYPE[file.mimetype];
        let uploadError = new Error('format file salah');
        
        if (isValidFormat) {
            uploadError = null;
        }

        cb(uploadError, 'public/uploads')
    },
    filename: function(req, file, cb) {
        const uniquefilename = `-${Date.now()}-${file.originalname}`
        cb(null, uniquefilename);
    }
})

export const upload = multer({storage: storage}).single('image'); 