import React, { Component } from 'react';
import { message } from 'antd';
import Dropzone from 'react-dropzone';
import request from 'superagent';

export default class UploadComponent extends Component {

  onImageDrop = (files) => {
    console.log(files);
    const req = request.post('/api/images');
    files.forEach(file => {
      req.attach(file.name, file);
    });
    //req.field("id",this.props.wsId);
    req.end((err, res) => {
      if (err) {
        message.error("Upload image SERVER ERROR!");
        return console.error(err);
      }

      switch (res.body.ok) {
        case "no-file":
          message.error("no files sent to server!");
          break;
        case "no-workspace":
          message.error("no workspace sent to server!");
          break;
        case "file-exist":
          message.warning("Some files already exist.");
          break;
        case "ok":
          //message.success("Upload finished.");
          if (this.props.noticeUploadFiles) {
            this.props.noticeUploadFiles(res.body.fileList[0]);
          }
          break;
        default:
          message.error("What happened?");
          break;
      }
    });

    // IMPORTANT!!! the preview need to be destroyed manually, to avoid memory leaks.
    // Since I don't need preview so set disablePreview as true, no preview acturally.
    //window.URL.revokeObjectURL(file.preview);
  }

  render() {
    return (
      <Dropzone
        multiple={false}
        accept="image/*"
        disablePreview={true}
        onDrop={this.onImageDrop}
        className="drop-zone"
      >
      </Dropzone>
    );
  }
}