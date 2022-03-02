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

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

var saveddata;
var input;


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



});





io.on('connection', function (socket) {

    socket.emit("saved", JSON.stringify(saveddata));

    socket.on('indlæg', (data, username) => {
        input = data;

        console.log("data" + data + "username: " + username);



        client.connect(err => {
            if (err) console.log(err);

            const collection2 = client.db("brobygning").collection("test");

            collection2.insertOne({
                indlæg: data,
                brugernavn: username
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

});

http.listen(3000, () => {
    console.log('Server started: listening on localhost:3000');
});
