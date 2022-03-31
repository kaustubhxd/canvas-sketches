const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const degToRad = (deg) => deg / 180 * Math.PI

const sketch = () => {
  return ({ context : ctx, width, height }) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'black'
    x = width * 0.5
    y = height * 0.5
    w = width * 0.01
    h = height * 0.1

    const count = 12
    const slice = 360 / 12

    
    
    for(let i=0;i<count;i++){
      x = width * Math.random()
      y = height * Math.random()
      w = width * Math.random() * (0.04 - 0.01) + 0.01
      h = height * Math.random()* (0.4 - 0.1) + 0.1
      for(let j=0;j<count;j++){
        ctx.save()
        ctx.beginPath()
        ctx.translate(x,y)
        ctx.rotate(degToRad(slice * j))
        ctx.rect(-(w * 0.5),-(h * 0.5),w,h)
        ctx.fill()
        ctx.restore()
      }
    }  


  };
};

canvasSketch(sketch, settings);
