const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;
var sleep = require('sleep');

const PORT = 8024;

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const IMG_ROOT_FOLDER = 'IMAGES/';
const IMG_MAIN_FOLDER = 'images/';
const IMG_FOLDER_TEMP = IMG_ROOT_FOLDER + IMG_MAIN_FOLDER + 'temp/';
const IMG_FOLDER_SERVER = IMG_ROOT_FOLDER + IMG_MAIN_FOLDER;
const IMG_FOLDER_CLIENT = '/' + IMG_MAIN_FOLDER;

const UPLOAD_FOLDER = 'upload';
const REAULT_FOLDER = 'result';

function getTimeStampName(filename) {
  let dotIdx = filename.lastIndexOf('.');
  let prefix = filename.slice(0, dotIdx);
  let suffix = filename.slice(dotIdx);
  let date = new Date().getTime();
  let newFileName = prefix + '---' + date.toString() + suffix;
  // no +, space for python.
  newFileName = newFileName.replace(/\+/g, '-').replace(/ /g, '-');
  return newFileName;
}


/**************************************************************
 * app.get('/api/python')
 * run python process
***************************************************************/
app.get('/api/python', (req, res) => {


  //Upload picture location
  let clientName = IMG_ROOT_FOLDER + IMG_MAIN_FOLDER + UPLOAD_FOLDER + '/' + req.query.filename;

  var cmd = 'cd darknet/ && ./darknet detect cfg/yolov3-voc.cfg yolov3-voc_15000.weights ../' + clientName;

  console.log("cmd", cmd);

  exec(cmd, function (error, stdout, stderr) {
    console.log(stdout);

    let originalname = 'result_' + req.query.filename;
    let resultdir = IMG_ROOT_FOLDER + IMG_MAIN_FOLDER + REAULT_FOLDER;
    let destpath = resultdir + '/' + originalname;

    if (!fs.existsSync(resultdir)) {
      fs.mkdirSync(resultdir);
    }

    console.log("move ", clientName, " to ", destpath);
    fs.renameSync('darknet/predictions.jpg', destpath);

    let resulturl = IMG_MAIN_FOLDER + REAULT_FOLDER + '/' + originalname;
    res.json({ ok: 'ok', data: resulturl });
  });
});

/**************************************************************
 * app.post('/api/images')
 * upload image files.
***************************************************************/
const upload = multer({ dest: IMG_FOLDER_TEMP });
app.post('/api/images', upload.any(), (req, res) => {

  let folderName = UPLOAD_FOLDER;
  console.log("\n\n****************");
  console.log("****upload image req received:\n", req.files);

  if (!req.files) {
    res.json({ ok: "no-file" });
    return;
  }

  //Here is in forEach, so if need res.json to response, must use sync fs methods.
  let clientList = [];
  let okString = 'ok';
  req.files.forEach(file => {
    let srcpath = file.path;
    let destdir = IMG_FOLDER_SERVER + folderName + "/";
    let originalname = getTimeStampName(file.originalname);
    let destpath = destdir + originalname;

    if (fs.existsSync(destpath)) {
      okString = "file-exist";
      console.log(destpath, " already exists.");
      // delete the src file in temp folder.
      fs.unlinkSync(srcpath);
    } else {
      if (!fs.existsSync(destdir)) {
        fs.mkdirSync(destdir);
      }
      console.log("move ", srcpath, " to ", destpath);
      fs.renameSync(srcpath, destpath);

      clientList.push(IMG_FOLDER_CLIENT + folderName + "/" + originalname);
    }
  });

  res.json({ ok: okString, fileList: clientList });

});


/**********************************************************
 * app, must be last.
 **********************************************************/
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, IMG_ROOT_FOLDER)));
app.use(express.static(path.join(__dirname, 'darknet')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, function () {
  console.log("start server on port ", PORT);
});

