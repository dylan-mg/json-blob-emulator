const fs = require('fs');

// names a new file
function fileNamer(suffix = "") {
    const rightNow = Date.now();
    return rightNow + suffix;
}

// makes a new file
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

function dataFixer(data, fileName) {
    data = JSON.parse(data);
    data._links.self.href += `${fileName}.json`;

    return data;
}

function errorMan(errno, res, requestInfo = "") {
    // error codes used in the document
    const ERROR_NUMS = [415, 401, 404];
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
        data = dataFixer(data, requestInfo);
        res.send(data);
    });
}

module.exports = {
    fileNamer,
    fileMaker,
    errorMan
}