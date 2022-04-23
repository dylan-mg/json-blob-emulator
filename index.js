// body-parser for request parsing
const bodyParser = require('body-parser');
// express for server stuff
const express = require('express');
// fs for json files'
const fs = require('fs');
const fHelp = require('./modules/fileHelpers');
const port = 1337;
const SERVLINK = `http://localhost:${port}`;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log("Listeneing on port " + port);
});

app.get("/api/jsonblob/:fileName", (req, res) => {
    // designate response type
    res.contentType("application/json");
    // checks to read the file
    fs.readFile(`blobs/${req.params.fileName}.json`, (err, data) => {
        // if there's an error, 
        if (err) {
            // ...call error handler function
            fHelp.errorMan(err.errno, res, req.params.fileName);
        } else {
            // otherwise, send the parsed data and an OK signal
            res.status(200);
            res.send(JSON.parse(data));
        }
    });
});

// creates a new json blob, returns the json blob's contents
// adds the location header that makes a link to the api endpoint with this blob
app.post("/api/jsonblob", (req, res) => {
    // check if req has the correct content type
    // if json
    if (req.headers['content-type'] == "application/json") {
        // make the fiie
        let fileName = fHelp.fileMaker(req.body, "./blobs");
        // header location is /api/jsonblob/blobID
        // return the content of the file
        res.status(200);
        res.location(`${SERVLINK}/api/jsonblob/${fileName}`);
        res.send(req.body);
    } else {
        // if not JSON, return 415 for unsupported media type
        res.status(415);
        res.send("placeholdre");
    }
});

// PUT -- replaces current blob content and returns the new blob content
app.put("/api/jsonblob/:blobID", (req, res) => {
    // check if req has correct content type
    // if json
    // if the file exists
    // fs write the file
    // save it
    // close stream
    // if error, return error
    // else return 200
    // return content of the file
    // otherwise return 404
    // if not, return 415 with message
});

app.delete("/api/jsonblob/:blobID", (req, res) => {

});