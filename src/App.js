import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import './App.css';
import ImageView from './components/ImageView';
import UploadComponent from './components/UploadComponent';
import ic_ts from './icons/image001.png';

const MAIN_PAGE_WIDTH = 1200;

export default class App extends Component {
  state = {
    uploadImgURL: { value: '', count: 0 },
  };

  handleWindowResize = () => {
    // console.log(window.innerWidth);

    let imgPage = ReactDOM.findDOMNode(this.refs.imagePage);
    if (window.innerWidth > MAIN_PAGE_WIDTH) {
      imgPage.style.marginLeft = `${(window.innerWidth - MAIN_PAGE_WIDTH) / 2}px`;
    } else {
      imgPage.style.marginLeft = '0px';
    }
  }


  onUploadClick = () => {
    let ele = ReactDOM.findDOMNode(this.refs.uploadRef);
    if (ele) {
      ele.click();
    }
  }

  handleUploadFilesDone = (imgURL) => {
    // TODO:
    console.log("imgURL", imgURL);
    let uploadImgURL = { ...this.state.uploadImgURL };
    uploadImgURL.value = imgURL;
    uploadImgURL.count += 1;
    this.setState({ uploadImgURL: uploadImgURL });
  }

  componentDidMount = () => {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  render() {
    return (
      <div>

        <div className='head-page'>
         {/*  <a href='http://www.thundersoft.com'>
            <img className='ts-image' src={ic_ts} alt='' width='240px' height='45px' />
          </a>
          <a href='https://www.thundersoft.com/index.php/about/index/1-5-5-5-13'>
            <p className='contact-us'>联系我们</p>
          </a> */}
        </div>


        <div className='image-page-container'>
          <div ref='imagePage' className='image-page main-page'>
            <p className='image-page-title'>识别对比</p>
            <div className="upload-button-bar">
              <Button type='primary' icon='upload' className="upload-button" onClick={this.onUploadClick}>
                上传图片
                <UploadComponent ref="uploadRef" noticeUploadFiles={this.handleUploadFilesDone} />
              </Button>
            </div>
            <ImageView uploadImgURL={this.state.uploadImgURL} />
          </div>
        </div>
      </div>
    );
  }
}

