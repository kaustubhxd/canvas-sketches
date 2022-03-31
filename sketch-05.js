const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const params = {
  resetOnTweak :true,
  invert : false,
  lineWidth: 20,
  lineSkew: 0.7,
  spacing: 54,
  lineCap : 'round',
  delay: 1,
  strokeStyle : '#000000ff',
  ERROR_FLAG: false
}

let spacing = params.spacing 
let x = 0, y = 0

const createTweakPane = ({pane,ctx,width,height}) => {
  const paneFolder = pane.addFolder({title: 'Tweakpane'})
  paneFolder.addInput(params,'resetOnTweak')
  paneFolder.addInput(params,'invert')
  paneFolder.addInput(params,'lineWidth',{min: 1, max: 30,step:1})
  paneFolder.addInput(params,'lineCap',{options: {
    round: 'round', butt: 'butt', square: 'square'
  }})
  paneFolder.addInput(params,'lineSkew',{min: 0.0, max: 1.0,step:0.1})
  paneFolder.addInput(params,'delay',{min: 1, max: 10,step:1})
  paneFolder.addInput(params,'spacing',{min: 40, max: 100,step:10})
  paneFolder.addInput(params, 'strokeStyle', {
    picker: 'inline',
    expanded: true,
  });
  paneFolder.addSeparator();
  paneFolder.addButton({title: 'Reset'}).on('click', ()  => resetSketch({ctx,width,height})
 );
}

const resetSketch = ({ctx,width, height}) => {
  spacing = params.spacing
  x = 0, y = 0
  ctx.fillStyle = params.invert? 'black' : 'white';
  ctx.fillRect(0, 0, width, height);
}

const sketch = ({context:ctx,width, height}) => {
    resetSketch({ctx,width,height})
    const pane = new Tweakpane.Pane()
    pane.on('change', (ev) => {
        console.log(ev)
        if(params.resetOnTweak)
          resetSketch({ctx,width,height})
    });
    createTweakPane({pane,ctx,width, height})
    

    return ({ context: ctx, width, height,frame }) => {
      if (params.ERROR_FLAG) return
      if(y > height) return
      try{
        console.log(ctx.strokeStyle)

        ctx.lineCap = params.lineCap
        ctx.lineWidth = params.lineWidth
        ctx.strokeStyle = params.strokeStyle
        
        ctx.beginPath()
        if(frame % params.delay === 0){
          if(Math.random() > params.lineSkew){
            ctx.moveTo(x,y)
            ctx.lineTo(x + spacing,y + spacing)
          }else{
            ctx.moveTo(x,y + spacing)
            ctx.lineTo(x + spacing,y)
          }
          ctx.stroke()
          x += spacing
          if(x > width) {
            x = 0
            y += spacing 
          }
        }
    }catch(err){
      console.log(err)
      params.ERROR_FLAG = true
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height);
      ctx.font = '48px serif';
      ctx.fillStyle = 'black'
      ctx.fillText(err, 10, 50);
    }
  };
   
};


try{
  canvasSketch(sketch, settings);
}catch(err){
  console.log(err)
  params.ERROR_FLAG = true
}

// #c83737ff