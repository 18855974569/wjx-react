import React, { Component } from 'react';
import { Spin, message } from 'antd';
import ic_imgLoading from '../icons/imgloading.jpg';
import $ from 'jquery';

const IMAGE_WIDTH = 500;
const IMAGE_HEIGHT = 400;

export default class ImageView extends Component {
  state = {
    imageLoading: false,
    oriImgURL: '',
    destImgURL: '',
    seconds: 0
  };

  tick = () => {
    const { seconds } = this.state;
    this.setState({
      seconds: seconds + 1,
    })
    if (seconds >= 10) {
      this.setState({ seconds: 0});
      clearInterval(this.interval);
    }
  }

  componentWillReceiveProps = (newProps) => {

    this.setState({ imageLoading: true, destImgURL: ic_imgLoading });

    if (newProps.uploadImgURL.count !== this.props.uploadImgURL.count) {
      let imgName = newProps.uploadImgURL.value.slice(newProps.uploadImgURL.value.lastIndexOf('/') + 1);

      this.setState({ imageLoading: true, oriImgURL: newProps.uploadImgURL.value, destImgURL: ic_imgLoading });

      // run with python.
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `/api/python?filename=${encodeURIComponent(imgName)}`,
        success: (res) => {
          if (res.ok === 'no-result') {
            message.error(res.data);
          } else if (res.ok === 'ok') {
            this.interval = setInterval(() => this.tick(), 1000);
            this.setState({ imageLoading: false, destImgURL: res.data });
          }
        },
        error: () => {
          message.error("Inferencing SERVER ERROR.");
          this.setState({ imageLoading: false, destImgURL: newProps.uploadImgURL.value });
        }
      });
    }
  }

  render() {

   
    console.log('ImageView render()', this.state.destImgURL);

    return (
      <div className='image-view' style={{ paddingTop: '30px', width: '100%', height: '520px' }}>
        <div style={{ float: 'left', textAlign: 'center', fontSize: '150%' }}>
          <img src={this.state.oriImgURL} alt='' width={IMAGE_WIDTH} height={IMAGE_HEIGHT} />
          <br />待识别原图
        </div>

        <div style={{ float: 'right', textAlign: 'center', fontSize: '150%', }}>
          <Spin spinning={this.state.imageLoading} style={{ float: 'center' }}>
            <img src={this.state.destImgURL} alt='' width={IMAGE_WIDTH} height={IMAGE_HEIGHT} />
            <br />识别结果图
          </Spin>
        </div>

      </div>
    );
  }
}