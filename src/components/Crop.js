import Action from './Action';
import { fabric } from 'fabric';
class Crop extends Action {
  constructor(App) {
    super('Crop', App);
    this._cropzone = null;
    this._cropImage = null;
  }

  cropObj = (activeObject, option) => {
    let canvas = this.getCanvas();
    var image = activeObject;
    this._cropzone = image;


    fabric.Container = fabric.util.createClass(fabric.Rect, {

      type: 'Container',
      initialize: function(options) {
  
          this.placedColor = 'rgba(211,211,211, 0)';
          this.virtualModeColor = 'rgba(211,211,211, 0)';
          this.canvas = canvas
          this.setToVirtualMode();

          options || (options = { });
          this.callSuper('initialize', options);
          this.set({
              label : options.label || '',
              'top' : options.top || 0,
              'left':  options.left || 0,
              'height' : options.height || 50,
              'angle' : options.angle,
              'fill' : options.fill || this.backgroundColor,
              'borderColor' : 'black',
              // 'hasControls' : false
          });
          // self = this;
      },
  
      /**
       *@description set render mode to virtual
       */
      setToVirtualMode : function () {
          this.isInVirtualMode = true;
          this.backgroundColor = this.virtualModeColor;
      },
  
      /**
       * @description set render mode to placement
       */
      setToPlacementMode : function(){
          this.isInVirtualMode = false;
          this.backgroundColor = this.placedColor;
      },
  
      /**
       * @description toggle virtual mode on and off
       */
      toggleVirtualMode : function(){
  
          if (this.isInVirtualMode){
              this.setToPlacementMode();
          }else{
              this.setToVirtualMode();
          }
          this.set('fill', this.backgroundColor);
      },


  
      _render: function(ctx) {
          this.callSuper('_render', ctx);
      }
    });


    this._cropzone = new fabric.Container(
      {label: 'aasdasd',
       top: image.top, 
       left: image.left, 
       height: image.height, 
       width:image.width,
       scaleX : image.scaleX,
       scaleY : image.scaleY,
       angle : image.angle,
       canvas : canvas
    })
    canvas.add(this._cropzone);
    canvas.renderAll();
    this.addEvent();

    canvas.setActiveObject(this._cropzone);

  }

  cropObjend = (activeObject, cropOption) => {
    let canvas = this.getCanvas();
    let image = activeObject;


    let test_canvas = new fabric.Canvas('test', {
      preserveObjectStacking: true,
    });

    const filters = image.filters;
    
    image.angle = 0;
    image.filters = [];
    image.applyFilters();
    test_canvas.add(image);

    let cropRect = {
      left : this._cropzone.left,
      top : this._cropzone.top,
      height : this._cropzone.height * this._cropzone.scaleY,
      width : this._cropzone.width * this._cropzone.scaleX,
      angle : 0
    }
    canvas.remove(this._cropzone);

    // console.log(cropRect);
    const imageData = {
      imageName: "test",
      url: test_canvas.toDataURL(cropRect)
    };

    test_canvas.clear();
    test_canvas.dispose();
    
    

    

    new Promise(resolve => {
      fabric.Image.fromURL(imageData.url, img => {
        img.set({
          angle : this._cropzone.angle,
          left : this._cropzone.left,
          top : this._cropzone.top,
          height : this._cropzone.height* this._cropzone.scaleY,
          width : this._cropzone.width* this._cropzone.scaleX,
          filters : filters,
        });
        resolve(img);
      }, { crossOrigin: 'Anonymous' }
      );
    })
    .then((data) => {
      data.applyFilters();
      canvas.add(data);
    })
    .then(() => {
      canvas.remove(activeObject);
      this.deleteEvent();
    })
    .then(() => {
      canvas.renderAll();
    })

  }


  fillOuterBox = () => {
    let canvas = this.getCanvas();
    const xy = {
      left : this._cropzone.left,
      top : this._cropzone.top,
      height : this._cropzone.height * this._cropzone.scaleY,
      width : this._cropzone.width * this._cropzone.scaleX,
    }
    // console.log(xy)
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgb(0,0,0,0.8)';

      ctx.save();
      
      // outer
      ctx.beginPath();

      ctx.moveTo(0 , 0);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.lineTo(0 , 0);
      ctx.closePath();



      // //inner
      // ctx.moveTo(xy.left , xy.top);
      // ctx.lineTo(xy.left, xy.top + xy.height);
      // ctx.lineTo(xy.left + xy.width, xy.top + xy.height);
      // ctx.lineTo(xy.left + xy.width, xy.top);
      // ctx.lineTo(xy.left , xy.top);
      // ctx.closePath();

      //inner
      ctx.moveTo(this._cropzone.aCoords.tl.x , this._cropzone.aCoords.tl.y);
      ctx.lineTo(this._cropzone.aCoords.bl.x , this._cropzone.aCoords.bl.y);
      ctx.lineTo(this._cropzone.aCoords.br.x , this._cropzone.aCoords.br.y);
      ctx.lineTo(this._cropzone.aCoords.tr.x , this._cropzone.aCoords.tr.y);
      ctx.moveTo(this._cropzone.aCoords.tl.x , this._cropzone.aCoords.tl.y);
      ctx.closePath();



      ctx.fill();
      ctx.restore();


      // console.log(ctx);
    }
  }


  addEvent = () => {
    const canvas = this.getCanvas();
    this.fillOuterBox();
    // canvas.on('object:moving', (event) => {
      
    //   console.log("move");    
    //   this.fillOuterBox();

    // });

    canvas.on('after:render', (event) => {
      this.fillOuterBox();

    });





  }



  deleteEvent = () => {
    const canvas = this.getCanvas();

    canvas.off('after:render');


  }

}

export default Crop;