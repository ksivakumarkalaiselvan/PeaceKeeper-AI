const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UPLOAD_PATH } = require('../config/env');

// Ensure upload directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(path.join(UPLOAD_PATH, 'evidence'));
ensureDir(path.join(UPLOAD_PATH, 'satellite'));
ensureDir(path.join(UPLOAD_PATH, 'documents'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'evidence';
    if (req.baseUrl.includes('satellite')) {
      folder = 'satellite';
    } else if (file.mimetype.includes('pdf') || file.originalname.endsWith('.doc')) {
      folder = 'documents';
    }
    const dest = path.join(UPLOAD_PATH, folder);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|pdf|mp4|webm/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid || mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image (jpeg, png, webp), video (mp4), and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter
});

module.exports = upload;
