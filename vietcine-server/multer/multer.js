const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const dateSuffix = Date.now();
        cb(null, file.fieldname + '-' + dateSuffix);
    }
});

const upload = multer({ storage });

module.exports = upload;
