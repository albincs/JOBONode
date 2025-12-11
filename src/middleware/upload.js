import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on some logic or default to 'static/uploads'
    // Django uses 'awards/images/', 'projects/images/' etc.
    // We can just dump in 'static/uploads' for now or parse fieldname.
    cb(null, 'static/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export default upload;
