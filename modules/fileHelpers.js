const fs = require('fs');

/**
 * Generates a file name composed of the current timestamp * a random decimal
 * @param {string} suffix Optional string to be added to the end of the file name
 * @returns {string} returns the file name
 */
function fileNamer(suffix = "") {
    const rightNow = Date.now();
    let fileName = Math.floor(rightNow * Math.random());
    return fileName + suffix;
}

/**
 * Creates a file of a unique
 * @param {Object} fileData Javascript object representing data that will be written into the file
 * @param {String} path pathway to the directory where the file will be stored
 * @param {String} suffix string appended to end of file name (e.g. test.json -> test_suffix.json)
 * @returns {String} returns the name of the new file
 */
function fileMaker(fileData, path, suffix = "") {
    // generate the file name
    let fileName;
    if (suffix != "") {
        suffix = "_" + suffix;
    }
    do {
        fileName = fileNamer(suffix);
        // if the file exists, make new name
    } while (fs.existsSync(`${path}/${fileName}.json`));

    fs.writeFileSync(`${path}/${fileName}.json`, JSON.stringify(fileData));

    return fileName;
}

/**
 * parses and returns data, adds information to error message
 * @param {Buffer} data Buffer of JSON data representing an error message file
 * @param {String} fileName Name of the requested file
 * @returns {Object} Javascript object representing the data from the input buffer
 */
function dataFixer(data, reqURL) {
    data = JSON.parse(data);
    data._links.self.href += reqURL;

    return data;
}

/**
 * Determines which error message to send and sends it
 * @param {int} errno represents error code to be sent to the client
 * @param {Response} res res object
 * @param {String} methodMan method of the request that threw the error
 * @param {Stirng} reqURL Optional; Name of the file requested.
 */
function errorMan(errno, res, reqURL) {
    // error codes used in the document
    const ERROR_NUMS = [400, 415, 401, 404];
    let resStat;
    if (errno == -4058) {
        resStat = 404;
    } else if (ERROR_NUMS.includes(errno)) {
        resStat = errno;
    } else {
        resStat = 500;
    }

    res.status(resStat)
    fs.readFile(`./error/${resStat}.json`, (err, data) => {
        data = dataFixer(data, reqURL);
        res.send(data);
    });
}

module.exports = {
    fileNamer,
    fileMaker,
    errorMan
}