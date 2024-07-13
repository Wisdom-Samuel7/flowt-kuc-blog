const multer = require("multer")
const path = require("path")

const uploadPostImg = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'Uploader/uploadimgs')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
        }
    }),

    limits: { fileSize: 6000000 }, //6MB STORAGE
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
           // console.log(file)
            return cb(null, true)
        } else {
            return cb(new Error('Invalid file type'))
        }
    }
})
 
module.exports = {uploadPostImg} 
