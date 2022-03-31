const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')
const Tweakpane = require('tweakpane')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const params = {
  cols : 10,
  rows : 10,
  lineWidthMin : 1,
  lineWidthMax  : 30,
  frameScalar : 7,
  frequency: 0.001,
  amplitude : 1,
  lineCap: 'butt',
  invert: false
}

const sketch = () => {
  return ({ context : ctx, width, height, frame }) => {
    ctx.fillStyle = params.invert ? 'black' : 'white';
    ctx.fillRect(0, 0, width, height);

    gridw = width * 0.8
    gridh = height * 0.8

    cols = params.cols
    rows = params.rows
    totalCells = cols * rows

    margX = (width - gridw) * 0.5
    margY = (height - gridh) * 0.5

    cellw = gridw / cols
    cellh = gridh / rows

    
    for(let i=0;i<totalCells;i++){
      const col = i % cols
      const row = Math.floor(i / cols)
      // console.log(row,col)
      
      const x = col * cellw
      const y = row * cellh
      
      // const n = random.noise2D(x + (frame * 7),y + (frame * 7),0.001)
       const n = random.noise3D(x ,y ,(frame * params.frameScalar),params.frequency,params.amplitude)
      
      
      const angle = n * Math.PI * 0.5
      
      // const scale = ((n + 1) / 2) * 30
      const scale = math.mapRange(n,-1,1,params.lineWidthMin,params.lineWidthMax)
      ctx.lineWidth = scale
      ctx.strokeStyle = params.invert ? 'white' : 'black'
      ctx.lineCap = params.lineCap
      
      const w = cellw * 0.8
      const h = cellh * 0.8 
      
      ctx.save()
      ctx.translate(x,y)
      ctx.translate(margX,margY)
      ctx.translate(w * 0.5, h * 0.5)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(w * -0.5,0)
      ctx.lineTo(w * 0.5, 0)
      ctx.stroke() 
      ctx.restore()
    }

 


  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane()
  const gridFolder = pane.addFolder({title: 'Grid'})

  gridFolder.addInput(params, 'cols', {min: 1, max: 100, step: 1})
  gridFolder.addInput(params, 'rows', {min: 1, max: 100, step: 1})
  gridFolder.addInput(params, 'lineWidthMin', {min: 1, max: 10, step: 1})
  gridFolder.addInput(params, 'lineWidthMax', {min: 10, max: 30, step: 1})

  const lineFolder = pane.addFolder({title: 'Design'})
  lineFolder.addInput(params,'invert')
  lineFolder.addInput(params, 'lineCap',{options: {butt: 'butt', round: 'round', square: 'square'}})

  const noiseFolder = pane.addFolder({title: 'Noise'})
  noiseFolder.addInput(params, 'frameScalar', {min: 1, max: 20, step: 1})
  noiseFolder.addInput(params, 'frequency', {min: -0.01, max: 0.01})
  noiseFolder.addInput(params, 'amplitude', {min: 0, max: 1, step: 0.1})


}

createPane()
canvasSketch(sketch, settings);
