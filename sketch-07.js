const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  errorFlag: false,
  bgColor: "#e4d0ec",
  mainColor: "#f33f48",
};

const sketch = ({ context: ctx, width, height }) => {
  const shapes = [];
  const numberOfShapes = 10;
  const shapeRadius = 250;
  const shapeWidth = 100;
  const shapeHeight = 100;

  for (let i = 0; i < numberOfShapes; i++) {
    const angle = (2 * Math.PI * i) / numberOfShapes;
    const x = shapeRadius * Math.cos(angle);
    const y = shapeRadius * Math.sin(angle);
    // console.log({ x, y });
    const shape = new Square(x, y, shapeWidth, shapeHeight, angle);
    shapes.push(shape);
  }

  return ({ context: ctx, width, height, frame }) => {
    if (params.errorFlag) return;
    ctx.fillStyle = params.bgColor;
    ctx.fillRect(0, 0, width, height);

    try {
      ctx.translate(width / 2, height / 2);

      ctx.save();
      ctx.rotate(frame * 0.022);
      shapes.forEach((shape) => {
        shape.update(ctx, frame);
        shape.draw(ctx);
      });
      ctx.restore();
    } catch (err) {
      console.log(err);
      params.errorFlag = true;
    }
  };
};

class Square {
  constructor(x, y, width, height, angle) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    // this.fillStyle = params.mainColor;
    this.rotation = 0;
    this.scale = 1;
    this.scaleExpand = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.rotate(this.rotation);

    this.scale = this.scaleExpand ? this.scale + 0.005 : this.scale - 0.005;
    if (this.scale > 3) this.scaleExpand = false;
    else if (this.scale <= 1) this.scaleExpand = true;
    ctx.scale(this.scale, this.scale);
    ctx.beginPath();
    ctx.rect(0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
    ctx.fillStyle = params.mainColor;
    ctx.fill();
    ctx.restore();
  }

  update(ctx, frame) {
    this.rotation = frame * 0.025;
  }
}

const createTweakPane = () => {
  const pane = new Tweakpane.Pane();
  const paneFolder = pane.addFolder({ title: "Tweakpane" });
  paneFolder.expanded = false;
  paneFolder.addInput(params, "bgColor");
  paneFolder.addInput(params, "mainColor");
};

canvasSketch(sketch, settings);
createTweakPane();
