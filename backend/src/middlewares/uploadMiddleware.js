import multer from "multer";

// Use memory storage — file is held in buffer, then uploaded to Cloudinary
const storage = multer.memoryStorage();

// File filter (restrict to PDFs only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed!"), false);
    }
};

// File filter for images (avatar/profile photo)
const avatarFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (JPG, PNG, WEBP, etc.) are allowed!"), false);
    }
};

// Multer upload instance for resume
export const uploadResumeMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Multer upload instance for profile photo
export const uploadAvatarMiddleware = multer({
    storage,
    fileFilter: avatarFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});



