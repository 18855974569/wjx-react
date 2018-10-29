import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';

const fakeList = [
  "/images/ori/1.jpg",  "/images/ori/2.jpg",  "/images/ori/3.jpg",
  "/images/ori/4.jpg",  "/images/ori/5.jpg",  "/images/ori/6.jpg",
  "/images/ori/7.jpg",  "/images/ori/8.jpg",  "/images/ori/9.jpg",
  "/images/ori/10.jpg", "/images/ori/11.jpg", "/images/ori/12.jpg",
  "/images/ori/13.jpg", "/images/ori/14.jpg", "/images/ori/15.jpg",
  "/images/ori/16.jpg", "/images/ori/17.jpg",
];

const GRID_WIDTH = 150;
const GRID_HEIGHT = 120;
const IMAGE_WIDTH = 100;
const IMAGE_HEIGHT = 80;


const HILIGHT_POSITION = 3;

export default class ImageList extends Component {
  state = {
    imageList: [],
  };
  imgRefs = [];
  

  setImageHilightStyle = (type) => {
    let grid = ReactDOM.findDOMNode(this.imgRefs[HILIGHT_POSITION-this.imgPosition]);

    switch(type) {
      case 'normal':
      grid.style.backgroundSize = `${IMAGE_WIDTH}px ${IMAGE_HEIGHT}px`;
      grid.style.boxShadow = '';
      break;

      case 'hilight':
      grid.style.backgroundSize = `${GRID_WIDTH}px ${GRID_HEIGHT}px`;
      grid.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
      break;

      default:
      break;
    }

    let gridFirst = ReactDOM.findDOMNode(this.imgRefs[0]);
    gridFirst.style.marginLeft = `${this.imgPosition*GRID_WIDTH}px`;
  }

  handleImageClick = (index) => {
    // set the old high-light grid as normal size.
    this.setImageHilightStyle('normal');
    // set index to hilight position.
    this.imgPosition = HILIGHT_POSITION - index;
    // set the new high-light grid as big size.
    this.setImageHilightStyle('hilight');

    // tell imageview to draw the hilighted image.
    if (typeof(this.props.handleSelectImage) === 'function') {
      this.props.handleSelectImage(this.state.imageList[index]);
    }
  }


  scrollImageList = (dir) => {

    // set the old high-light grid as normal size.
    this.setImageHilightStyle('normal');

    // set index.
    if (dir === 'left') {
      if (this.imgPosition < HILIGHT_POSITION) {
        this.imgPosition += 1;
      }
    } else if (dir === 'right') {
      if (this.state.imageList.length-Math.abs(this.imgPosition) > HILIGHT_POSITION+1) {
        this.imgPosition -= 1;
      }
    }

    // set the new high-light grid as big size.
    this.setImageHilightStyle('hilight');
  }


  handleScrollButtonClick = (dir) => {
    this.scrollImageList(dir);
  }


  handleWheel = (e) => {
    let delta = e.deltaY;
    console.log(delta);
    
    if(delta < 0) {
      this.scrollImageList('left');
    } else if(delta > 0) {
      this.scrollImageList('right');
    }

    // avoid main page scrolling.
    e.preventDefault();
  }

  componentDidUpdate = () => {
    if (this.firstUpdate) {
      this.imgPosition = 0;
      this.setImageHilightStyle('hilight');

      // tell imageview to draw the hilighted image.
      if (typeof(this.props.handleSelectImage) === 'function') {
        this.props.handleSelectImage(this.state.imageList[HILIGHT_POSITION]);
      }
    }
    this.firstUpdate = false;
  }

  componentDidMount = () => {
    this.setState({
      imageList: fakeList,
    });

    this.imgPosition = 0;

    this.firstUpdate = true;
  }

  render() {
    let items = [];
    this.state.imageList.map((listItem, i) => {

      items.push(
        <div key={i} ref={child => this.imgRefs[i]=child}
          onClick={(index) => this.handleImageClick(i)}
          onWheel={this.handleWheel}
          style={{
            display: 'inline-block',
            width: `${GRID_WIDTH}px`,
            height: `${GRID_HEIGHT}px`,
            backgroundImage: `url(${listItem})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${IMAGE_WIDTH}px ${IMAGE_HEIGHT}px`,
            backgroundPosition: 'center',
            transition: 'margin-left 0.5s, background-size 0.5s, box-shadow 0.5s',
          }}
        ></div>
      );
    });

    let len = this.state.imageList.length;
    let listWidth = (GRID_WIDTH*len)*2;

    return (
      <div style={{overflow:'hidden'}}>
        <div disabled={false}>
          <Icon type="caret-left" className="image-list-left-icon" onClick={(e)=>this.handleScrollButtonClick('left',e)}/>
        </div>
        <div disabled={false} style={{float:'right'}}>
          <Icon type="caret-right" className="image-list-right-icon" onClick={(e)=>this.handleScrollButtonClick('right',e)}/>
        </div>

        <div style={{width: `${listWidth}px`}}>{items}</div>
      </div>
    );
  }
}