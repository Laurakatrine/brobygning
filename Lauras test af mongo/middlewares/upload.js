
const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
var storage = new GridFsStorage({
  url: "mongodb+srv://gruppe1:brobygning@cluster0.o8mem.mongodb.net/brobygning?retryWrites=true&w=majority",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {

      const filename = `${Date.now()}-gruppe2-${file.originalname}`;

      const filename = `${Date.now()}-gruppe1-${file.originalname}`;

      return filename;
    }
    return {
      bucketName: "photos",

      filename: `${Date.now()}-gruppe2-${file.originalname}

      filename: `${Date.now()}-gruppe1-${file.originalname}

    };
  }
});
//var uploadFiles = multer({ storage: storage }).single("file");
var uploadFiles = multer({ storage: storage }).array("file", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;