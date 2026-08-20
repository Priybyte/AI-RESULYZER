const multer = require("multer")


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
        const allowedName = /\.(pdf|docx)$/i.test(file.originalname || "")

        if (allowedTypes.includes(file.mimetype) || allowedName) {
            return cb(null, true)
        }

        cb(null, false)
    }
})


module.exports = upload
