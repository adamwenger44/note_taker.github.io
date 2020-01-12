// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

var allNotes = []

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

// Create New Note - takes in JSON input

app.post("/api/notes", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var newNote = req.body;

    console.log(newNote);

    var noteData = fs.readFileSync(path.join('./db/db.json'), "utf8"); 


    allNotes = JSON.parse(noteData);
    allNotes.push(newNote);

    function assignId(item, index) {
        item.id = index + 1;
    };

    allNotes.forEach(assignId);

    var stringifyNote = JSON.stringify(allNotes)
    fs.writeFileSync(path.join('./db/db.json'), stringifyNote, (err) => {
        if (err) throw err;
    });

   
res.json(allNotes)

});

app.delete("/api/notes/:id", function (req, res) {
    var noteData = fs.readFileSync(path.join('./db/db.json'), "utf8");


    var deleteNote = req.params.id;

    let remove = JSON.parse(noteData).filter(note => note.id !== parseInt(deleteNote));
    let stringifyData = JSON.stringify(remove);

    fs.writeFileSync(path.join('./db/db.json'), stringifyData, (err) => {
        if (err) throw err;
    })
    res.json(stringifyData);

});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});