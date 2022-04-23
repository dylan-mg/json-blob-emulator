const fHelp = require('./fileHelpers');

/**
 * @param {Request} req Express.js request
 * @param {Response} res Express.js response
 * @param {NextFunciton} next Express.js NextFunction
 */
function jsonVerifier(req, res, next) {
    if (req.method !== "GET") {
        if (req.headers['content-type'] == 'application/json') {
            res.contentType('application/json');
            next();
        } else {
            fHelp.errorMan(415, res, req.url);
        }
    } else {
        next()
    }
}

/**
 * Verifies a file name contains no numbers
 * @param {string} fileName name of file to be checked
 * @returns {boolean} True if filename is valid, false otherwise
 */
function nameVerifiier(fileName) {
    /* most of the file names are 13 characters, 
    but on the off chance Math.random returns a small decimal,
    limit for length is 11 */
    if (fileName.length > 11) {
        // check for non-digit characters
        const regMan = /\D/;

        // if non-digits are present, say fileName is not valid (false)
        if (!(regMan.test(fileName))) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 
 * @param {Error} err Express.js Error
 * @param {Request} req Express.js request that threw the error
 * @param {Response} res Express.js response
 * @param {NextFunciton} next Next function that would handle an error
 */
function jsonHandler(err, req, res, next) {
    fHelp.errorMan(err.statusCode, res, req.url);
}

module.exports = { jsonVerifier, nameVerifiier, jsonHandler };