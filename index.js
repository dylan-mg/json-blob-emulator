// body-parser for request parsing
const bodyParser = require('body-parser');
// express for server stuff
const express = require('express');
// fs for json files'
const fs = require('fs');
const fHelp = require('./modules/fileHelpers');
const port = 1337;
const SERVLINK = `http://localhost:${port}`;
const BlobPath = "./blobs";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// ensures content type is json
app.use((req, res, next) => {
    if (req.headers['content-type'] == 'application/json') {
        res.contentType('application/json');
        next();
    } else {
        if (req.params.blobID) {
            fHelp.errorMan(415, res, req.params.blobID);
        } else {
            fHelp.errorMan(415, res)
        };
    }
});

app.listen(port, () => {
    console.log("Listeneing on port " + port);
});

app.get("/api/jsonblob/:fileName", (req, res) => {
    // checks to read the file
    fs.readFile(`${BlobPath}/${req.params.fileName}.json`, (err, data) => {
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
    // make the fiie
    let fileName = fHelp.fileMaker(req.body, BlobPath);
    // header location is /api/jsonblob/blobID
    // return the content of the file
    res.status(201);
    res.location(`${SERVLINK}/api/jsonblob/${fileName}`);
    res.send(req.body);
});

// PUT -- replaces current blob content and returns the new blob content
app.put("/api/jsonblob/:blobID", (req, res) => {
    // if the file exists
    let fileName = `${BlobPath}/${req.params.blobID}.json`;
    if (fs.existsSync(fileName)) {
        fs.writeFile(fileName, JSON.stringify(req.body), (err) => {
            if (err) {
                fHelp.errorMan(500, res, req.params.blobID);
            } else {
                res.status(200);
                res.send(req.body);
            }
        })
    } else {
        fHelp.errorMan(404, res, req.params.blobID);
    }
});

app.delete("/api/jsonblob/:blobID", (req, res) => {
    // if the file exists
    let fileName = `${BlobPath}/${req.params.blobID}.json`;
    if (fs.existsSync(fileName)) {
        fs.rm(fileName, (err) => {
            if (err) {
                fHelp.errorMan(500, res, req.params.blobID);
            } else {
                res.status(200);
                res.send({ message: `Blob ${req.params.blobID} Deleted` });
            }
        })
    } else {
        fHelp.errorMan(404, res, req.params.blobID);
    }
});