import React, { Component } from 'react';
export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropCanvasSize: { width: 0, height: 0 },
      displayCropCanvas: false
    };
  }

  componentDidMount() {
    console.log('Canvas UI Mount');
  }
  componentDidUpdate() {
    console.log('Canvas UI Update');
  }
  componentWillUnmount() {
    console.log('Canvas UI Unmount');
  }

  handleChange = (event) => {
    let change_state = {
      width: this.state.cropCanvasSize.width,
      height: this.state.cropCanvasSize.height
    };
    if (event.target.name === 'width') {
      if (this.props.object.left - event.target.value / 2 < 0 ||
        this.props.object.left + event.target.value / 2 > this.props.canvas.width) {
        if (this.props.object.left < event.target.value / 2) {
          this.props.object.left = event.target.value / 2;
        }
        else {
          this.props.object.left = this.props.canvas.width - event.target.value / 2;
        }
        if (event.target.value > this.props.canvas.width) {
          this.props.object.left = this.props.canvas.width / 2;
          change_state.width = this.props.canvas.width;
        }
        else {
          change_state.width = event.target.value;
        }
      }
      else {
        change_state[event.target.name] = event.target.value;
      }
    }
    else {
      if (this.props.object.top - event.target.value / 2 < 0 ||
        this.props.object.top + event.target.value / 2 > this.props.canvas.height) {
        if (this.props.object.top < event.target.value / 2) {
          this.props.object.top = event.target.value / 2;
        }
        else {
          this.props.object.top = this.props.canvas.height - event.target.value / 2;
        }
        if (event.target.value > this.props.canvas.height) {
          this.props.object.top = this.props.canvas.height / 2;
          change_state.height = this.props.canvas.height;
        }
        else {
          change_state.height = event.target.value;
        }
      }
      else {
        change_state[event.target.name] = event.target.value;
      }
    }
    new Promise((resolve) => {
      this.setState({ cropCanvasSize: change_state });
      resolve();
    })
      .then(() => {
        this.props.handleCropCanvasSizeChange(this.state.cropCanvasSize);
      })
  }

  cropCanvas = () => {
    this.setState({displayCropCanvas: true});
    this.props.cropCanvas(this.offdisplayCropCanvas);
  }

  cropEndCanvas = () => {
    this.setState({displayCropCanvas: false});
    this.props.cropEndCanvas();
  }

  offdisplayCropCanvas = () => {
    this.setState({displayCropCanvas: false});
  }

  render() {
    return (
      <div className="sub">
        <div className="sub-title">
          Canvas ( {this.props.object.type} )
        </div>
        <div className="sub-iconmenu">
          <div>
            <button onClick={this.props.resetCanvas}> 리셋 캔버스</button>
            <button onClick={this.cropCanvas}>cropCanvas</button>
            <button onClick={this.cropEndCanvas}>cropEndCanvas</button>
            {this.state.displayCropCanvas ?
              <div>
                <label htmlFor='width'> x : </label>
                <input
                  type='number'
                  onChange={this.handleChange}
                  name='width'
                  min='1'
                  max={this.props.canvas.width}
                  value={this.state.cropCanvasSize.width}
                />
                <label htmlFor='height'> y: </label>
                <input
                  type='number'
                  onChange={this.handleChange}
                  name='height'
                  min='1'
                  max={this.props.canvas.height}
                  value={this.state.cropCanvasSize.height}
                />
              </div>
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}