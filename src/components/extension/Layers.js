import Extension from './Extension';
import { fabric } from 'fabric';
import React from 'react';
class Layers extends Extension {
    constructor(App) {
      super('Layers', App);
    }


    showLayers = () => {
        const canvas = this.getCanvas();

        if(canvas){
            let objs = canvas.getObjects();
            let canvas_list = [];
            for(let i=0 ;i< objs.length ; i++){
                let c = new fabric.Canvas('thumbnail' + i, {
                    preserveObjectStacking: true,
                    height: canvas.getHeight(),
                    width: canvas.getWidth(),
                    backgroundColor: 'grey'
                });
                c.add(objs[i]);
                canvas_list.push(c);
            }

            const listitem = objs.map((obj, index) =>
                <p key = {index}>
                    <img src={canvas_list[index].toDataURL({format: 'png'})} alt="" height="10%" width="10%" onClick = {this.clickLayer} index = {index}/>
                </p>
            );

            return(
                <div>
                  {listitem}
                </div>
            )
        }
        else{
            return(
                <div>
                  <p>no canvas</p>
                </div>
            )
        }
    }

    clickLayer = (event) => {
        const canvas = this.getCanvas();
        let idx = event.target.getAttribute("index");
        canvas.setActiveObject(canvas.item(idx));
        canvas.renderAll();

    }

}

export default Layers;