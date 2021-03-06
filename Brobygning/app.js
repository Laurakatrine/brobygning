const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const uri = "mongodb+srv://gruppe1:brobygning@cluster0.o8mem.mongodb.net/brobygning?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
initRoutes = require('./routes');
initRoutes(app);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile('startside.html');
});

var saveddata;
var input;
var img;




//connect to the database
client.connect(err => {
    if (err) console.log(err);

    const collection1 = client.db("brobygning").collection("test");

    //find the playerdata 
    collection1.find({}).toArray((err, docs) => { //you can chosse filter inside the find
        if (err) console.log(err);
        console.log("Found the following records");
        console.log(docs);
        console.log(' ...Done ');

        console.log('---------------------------------------');

        saveddata = docs;

    });

    const collectionIMG = client.db("brobygning").collection("foto.files");
    collectionIMG.find({}).toArray((err, docs) => { //you can chosse filter inside the find
        if (err) console.log(err);
        console.log("Found the following img");
        console.log(docs);
        console.log(' ...Done ');

        console.log('---------------------------------------');

        img = docs;

    });
});

io.on('connection', function (socket) {

    socket.on("readyLoad", function () {
        client.connect(err => {
            if (err) console.log(err);

            const collection1 = client.db("brobygning").collection("test");

            //find the playerdata 
            collection1.find({}).toArray((err, docs) => { //you can chosse filter inside the find
                if (err) console.log(err);
                console.log("Found the following records");
                console.log(docs);
                console.log(' ...Done ');

                console.log('---------------------------------------');

                saveddata = docs;

            });
            socket.emit("saved", JSON.stringify(saveddata));
        });
    });

    socket.on('indl??g', (data, username, titel) => {
        input = data;
        //datastil = fontdata;
        var dateObj = new Date();
        var day = dateObj.getUTCDate();
        var month = dateObj.toLocaleDateString('default', {
            month: 'long'
        });
        var year = dateObj.getFullYear();
        var hour = dateObj.getHours();
        var minute = dateObj.getMinutes();

        var date = day + ". " + month + " " + year;
        var time = hour + ":" + minute;

        client.connect(err => {
            if (err) console.log(err);

            const collection2 = client.db("brobygning").collection("test");

            collection2.insertOne({
                indl??g: data,
                titel: titel,
                brugernavn: username,
                dato: date,
                tidspunkt: time
            })
        })

    });


    socket.on('login', (username, password) => {
        console.log(username + password);

        const collectionLogin = client.db("brobygning").collection("login");

        collectionLogin.find({}).toArray((err, docs) => { //you can chosse filter inside the find
            if (err) console.log(err);
            console.log("Found the following login");
            console.log(docs);
            var foundData = docs;
            console.log("Login");

            socket.emit("logging_in", JSON.stringify(foundData));
        });


    });

    socket.on('checkbox', (data, id, checked, label, day) => {

        const collectionGruppedata = client.db("brobygning").collection("gruppedata");
        collectionGruppedata.find({
            gruppenavn: data,
            id: id,
            day: day
        }).count().then((n) => {
            console.log('There are ' + n + ' documents');
            if (n == 0) {
                collectionGruppedata.insertOne({
                    gruppenavn: data,
                    id: id,
                    checked: checked,
                    label: label,
                    day: day
                });
            } else {
                collectionGruppedata.findOneAndUpdate({
                    gruppenavn: data,
                    id: id,
                    day: day
                }, {
                    $set: {
                        checked: checked,
                        label: label
                    }
                })
            }
        });

    });

    socket.on('test', (data) => {
        console.log('Er her');
    });

    socket.on('checkboxCheck', (data) => {
        console.log(data);

        const collectionGruppedata = client.db("brobygning").collection("gruppedata");

        collectionGruppedata.find({
            gruppenavn: data
        }).toArray((err, docs) => { //you can chosse filter inside the find
            if (err) console.log(err);
            console.log("Found the following gruppedata");
            console.log(docs);
            var foundData = docs;

            socket.emit('checkboxBack', JSON.stringify(foundData));
        });

    });


    socket.on('edit', (data, username, titel) => {
        var dateObj = new Date();
        var day = dateObj.getUTCDate();
        var month = dateObj.toLocaleDateString('default', {
            month: 'long'
        });
        var year = dateObj.getFullYear();
        var hour = dateObj.getHours();
        var minute = dateObj.getMinutes();

        var date = day + ". " + month + " " + year;
        var time = hour + ":" + minute;

        client.connect(err => {
            if (err) console.log(err);
            const collectionEdit = client.db("brobygning").collection("test");
            // create a filter for a data to update
            const filter = {
                titel: titel,
                brugernavn: username
            };
            // this option instructs the method to create a document if no documents match the filter
            const options = {
                upsert: true
            };
            // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    indl??g: data,
                    dato: date,
                    tidspunkt: time
                },
            };
            const result = collectionEdit.updateOne(filter, updateDoc, options);

        })
    })
});

http.listen(3000, () => {
    console.log('Server started: listening on localhost:3000');
});
