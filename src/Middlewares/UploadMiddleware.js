import multer from "multer";
import path from "path";

const generateRandomName = (totalCharacters, extension) => {
    const posibleChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let filename = "";
    for (let i = 0; i < totalCharacters; i++) {
        const randomChar = Math.floor(Math.random() * (posibleChars.length - 1 - 0));
        filename += posibleChars[randomChar];
    }

    return filename + extension;
};

export const Upload = (destination) => {
    const options = multer.diskStorage({
        destination: (err, file, cb) => {
            cb(null, __dirname + "/../../public/assets/uploads/" + destination);
        },
        filename: (err, file, cb) => {
            cb(null, generateRandomName(40, path.extname(file.originalname)));
        },
    });

    return multer({
        storage: options,
    });
};
