const upload = require("../middlewares/upload");
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://gruppe1:brobygning@cluster0.o8mem.mongodb.net/brobygning?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const baseUrl = "http://localhost:3000/files/";

const uploadFiles = async (req, res) => {
    try {
        await upload (req, res);
        console.log(req.files);
        if(req.files.length <= 0) {
            return res.status(400).send({message: 'You must select one file'});
        }
        return res.sendFile(path.join(`${__dirname}/../public/opret.html`));
        //return res.status(200).send({message: 'Files have been uploaded'});
    }
    catch(error) {
        console.log(error);
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload.",
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`,
        });
    }
}

const getHome = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../public/startside.html`));
};

const videoer = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../public/videoer.html`));
};

const getListFilesChunks = async(req, res) => {
    try {
        await client.connect();
        const collectionChunks = client.db("brobygning").collection("photos.chunks");
        const cursorChunks = collectionChunks.find({});
        if ((await cursorChunks.count()) === 0) {
            return res.status(500).send({
                message: 'No files found',
            });
        }
        let chunksInfos = [];
        await cursorChunks.forEach((doc) => {
            console.log("found these: " + doc.files_id);
            chunksInfos.push({
                files_id: doc.files_id,
                data: doc.data,
                nr: doc.n,
            })
        });

        return res.status(200).send(chunksInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }

};

let getListFiles = async (req, res) => {
    try {
        await client.connect();
        const collectionFiles = client.db("brobygning").collection("photos.files");
        const cursorFiles = collectionFiles.find({});
        if ((await cursorFiles.count()) === 0) {
            return res.status(500).send({
                message: 'No files found',
            });
        }
        let filesInfos = [];
        await cursorFiles.forEach((doc) => {
            var navn = doc.filename.split("_");
            var navngruppe = navn[1];
            console.log(navngruppe);
            
            
            if(navngruppe == "sesg-mkluge16-7")
                {
            filesInfos.push({
                name: doc.filename,
                id: doc._id,
                type: doc.contentType,
            })
                }
        });

        return res.status(200).send(filesInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

module.exports = {
    uploadFiles: uploadFiles,
    getHome: getHome,
    getListFilesChunks: getListFilesChunks,
    getListFiles: getListFiles,
    videoer: videoer,
};
