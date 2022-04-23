/* Modules */
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const methodOverride = require('method-override')
const fHelp = require('./modules/fileHelpers');
const { jsonVerifier, nameVerifiier, jsonHandler } = require('./modules/verifyHelper');

/* Constants */
const port = 1337;
const SERVLINK = `http://localhost:${port}`;
const BlobPath = "./blobs";

/* App and middleware */
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// ensures content type is json, bit without the prior middleware, 
// will return syntax error on invalid req bodies
app.use(bodyParser.json());

app.use(methodOverride());

// error handler for errors thrown from above middlewares
app.use(jsonHandler);

// ensures blobID is valid before contiuing
app.use("/api/jsonblob/:blobID", (req, res, next) => {
    // if the name is valid
    if (nameVerifiier(req.params.blobID)) {
        next();
    } else {
        fHelp.errorMan(400, res, req.baseUrl);
    }
});

// Ensures Content type is json, if not, returns error message
app.use(jsonVerifier);

app.listen(port, () => {
    console.log("Listeneing on port " + port);
});

/* API Endpoints */
// Gets a specific blob
app.get("/api/jsonblob/:blobID", (req, res) => {
    let fileName = `${BlobPath}/${req.params.blobID}.json`

    // checks to read the file
    fs.readFile(fileName, (err, data) => {
        // if there's an error, 
        if (err) {
            // ...call error handler function
            fHelp.errorMan(err.errno, res, req.url);
        } else {
            // otherwise, try to parse the data
            // if it throws an error, send error message
            // otherwise send data as normal
            try {
                data = JSON.parse(data);
                res.status(200);
                res.send(data);
            } catch (error) {
                fHelp.errorMan(400, res, req.url);
            }
        }
    });
});

// Creates a new blob
app.post("/api/jsonblob", (req, res) => {
    // make the fiie
    let fileName = fHelp.fileMaker(req.body, BlobPath);
    // header location is /api/jsonblob/blobID
    // return the content of the file

    res.status(201);
    res.location(`${SERVLINK}/api/jsonblob/${fileName}`);
    res.send(req.body);
});

// Updates a specific blob
app.put("/api/jsonblob/:blobID", (req, res) => {
    // if the file exists
    let fileName = `${BlobPath}/${req.params.blobID}.json`;

    if (fs.existsSync(fileName)) {
        fs.writeFile(fileName, JSON.stringify(req.body), (err) => {
            if (err) {
                fHelp.errorMan(500, res, req.url);
            } else {
                res.status(200);
                res.send(req.body);
            }
        });
    } else {
        fHelp.errorMan(404, res, req.url);
    }
});

// Deletes a specific blob
app.delete("/api/jsonblob/:blobID", (req, res) => {
    // if the file exists
    let fileName = `${BlobPath}/${req.params.blobID}.json`;

    if (fs.existsSync(fileName)) {
        fs.rm(fileName, (err) => {
            if (err) {
                fHelp.errorMan(500, res, req.url);
            } else {
                res.status(200);
                res.send({ message: `Blob ${req.params.blobID} Deleted` });
            }
        })
    } else {
        fHelp.errorMan(404, res, req.url);
    }
});