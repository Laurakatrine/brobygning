const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.js');

let routes = app => {
    router.post("/upload", uploadController.uploadFiles);
    router.get("/", uploadController.getHome);
    router.get("/chunks", uploadController.getListFilesChunks);
    router.get("/files", uploadController.getListFiles);
    router.get("/videoer", uploadController.videoer);
    return app.use("/", router);
};

module.exports = routes;