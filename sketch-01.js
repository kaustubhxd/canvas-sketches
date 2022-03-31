const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    let offList = [
  false,
  true,
  false,
  true,
  false,
  false,
  true,
  true,
  false,
  true,
  false,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  true,
  true,
  false,
  true,
  true
]

    context.lineWidth = 5
    context.strokeStyle = 'black'

    const w = width * 0.10, h = height * 0.10 
    const gap = width * 0.03
    const ix = (width / 2) - 
                ( ((w * 5) + (gap * 4)) / 2)
    const iy = (height / 2) - 
                ( ((h * 5) + (gap * 4)) / 2)
    let x,y
    const off = width * 0.02


    for(let i=0;i<5;i++){
        for(let j=0;j<5;j++){
            context.beginPath()
            x = ix + ((w + gap) * i)
            y = iy + ((h + gap) * j)
            context.strokeStyle = '#36454F'
            context.rect(x, y, w,h)
            context.stroke()
            if(!offList[(5 * i) + j]){
                context.beginPath()
                context.strokeStyle = 'black'
                context.rect(x + (off / 2), 
                              y + (off / 2), 
                              w - off,h - off)
                context.stroke()
            }
        }
    }
  };
};

canvasSketch(sketch, settings);
