// SKETCH 07: Squares in a circle rotating and revolving
const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");
const { autoAdjustCanvas } = require("./utils/autoAdjustCanvas");

console.log(autoAdjustCanvas);

// html stuff
document.title = document.URL.split("/").at(-2);
document.body.style.backgroundColor = "aliceblue";
document.body.style.overflowX = "hidden";
document.body.style.overflowY = "hidden";

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  errorFlag: false,
  bgColor: "#e4d0ec",
  mainColor: "#f33f48",
  numberOfShapes: 10,
  circleRadius: 250,
  shapeWidth: 100,
  shapeHeight: 100,
  circleSpeed: 0.022,
  shapeSpeed: 0.025,
  scaleMin: 1,
  scaleMax: 3,
};

let shapes = [];

const resetSketch = () => {
  shapes = [];
  for (let i = 0; i < params.numberOfShapes; i++) {
    const angle = (2 * Math.PI * i) / params.numberOfShapes;
    const x = params.circleRadius * Math.cos(angle);
    const y = params.circleRadius * Math.sin(angle);
    // console.log({ x, y });
    const shape = new Square(x, y, params.shapeWidth, params.shapeHeight, angle);
    shapes.push(shape);
  }
};

const sketch = ({ context: ctx, width, height }) => {
  resetSketch();
  return ({ context: ctx, width, height, frame }) => {
    if (params.errorFlag) return;
    ctx.fillStyle = params.bgColor;
    ctx.fillRect(0, 0, width, height);

    try {
      ctx.translate(width / 2, height / 2);

      ctx.save();
      ctx.rotate(frame * params.circleSpeed);
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
    if (this.scale > params.scaleMax) this.scaleExpand = false;
    else if (this.scale <= params.scaleMin) this.scaleExpand = true;
    ctx.scale(this.scale, this.scale);
    ctx.beginPath();
    ctx.rect(0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
    ctx.fillStyle = params.mainColor;
    ctx.fill();
    ctx.restore();
  }

  update(ctx, frame) {
    this.rotation = frame * params.shapeSpeed;
  }
}

const createTweakPane = ({ canvas }) => {
  const pane = new Tweakpane.Pane();
  const paneFolder = pane.addFolder({ title: "Tweakpane" });
  paneFolder.expanded = false;
  paneFolder.addInput(params, "bgColor");
  paneFolder.addInput(params, "mainColor");
  paneFolder.addInput(params, "numberOfShapes", { min: 1, max: 100, step: 1, label: "No. of shapes" });
  paneFolder.addInput(params, "circleRadius", { min: 10, max: 400, step: 1 });
  paneFolder.addInput(params, "shapeWidth", { min: 10, max: 200, step: 1 });
  paneFolder.addInput(params, "shapeHeight", { min: 10, max: 200, step: 1 });
  paneFolder.addInput(params, "circleSpeed", { min: 0, max: 0.5, step: 0.01 });
  paneFolder.addInput(params, "shapeSpeed", { min: 0, max: 0.5, step: 0.01 });
  paneFolder.addInput(params, "scaleMin", { min: 0, max: 1.5, step: 0.1 });
  paneFolder.addInput(params, "scaleMax", { min: 2, max: 3.5, step: 0.1 });

  const panelNode = pane.containerElem_;
  autoAdjustCanvas(canvas, panelNode, paneFolder.expanded);

  pane.on("change", (ev) => {
    console.log(ev);
    resetSketch();
  });
  document.querySelector(".tp-dfwv").style.width = "280px";
};

canvasSketch(sketch, settings).then(({ props }) => {
  const { canvas } = props;
  createTweakPane({ canvas });
});
