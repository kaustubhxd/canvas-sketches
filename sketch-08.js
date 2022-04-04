// BOILERPLATE CODE
const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");
const { easeInOutCubic } = require("./utils/easing").EasingFunctions;
const math = require("canvas-sketch-util/math");

// html stuff
document.title = document.URL.split("/").at(-2);
document.body.style.backgroundColor = "aliceblue";

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  errorFlag: false,
  bgColor: "#fff",
  primaryColor: "#000",
  secondaryColor: "#fff",
  noOfShapes: 50,
  minShapeSize: 100,
  shapeIncrement: 20,
  animateDuration: 60 * 2,
  aDelay: 1 / 120,
};

let shapes = [];

const resetSketch = () => {
  shapes = [];
  for (let i = params.noOfShapes; i >= 0; i--) {
    const pos = -(params.minShapeSize / 2 + params.shapeIncrement * i);
    const size = (params.minShapeSize + params.shapeIncrement * i) * 2 - params.minShapeSize;
    const fillColor = i % 2 === 0 ? params.primaryColor : params.secondaryColor;
    const shape = new Square(pos, pos, size, size, fillColor);
    shapes.push(shape);
  }
  console.log(shapes);
};

const sketch = ({ context: ctx, width, height }) => {
  resetSketch();

  return ({ context: ctx, width, height, frame }) => {
    if (params.errorFlag) return;
    ctx.fillStyle = params.bgColor;
    ctx.fillRect(0, 0, width, height);

    try {
      shapes.forEach((shape, index) => {
        shape.draw(ctx, width, height);
        shape.update(frame, index);
      });
    } catch (err) {
      console.log(err);
      params.errorFlag = true;
    }
  };
};

class Square {
  constructor(x, y, width, height, fillColor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.rotation = 0;
  }

  draw(ctx, width, height) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.restore();
  }

  update(frame, index) {
    const currentFrame = frame % params.animateDuration;

    const frameNormal = currentFrame / params.animateDuration;
    // console.log(frameNormal);

    const staggerStart = params.aDelay * (params.noOfShapes - index);
    const staggerEnd = params.aDelay * index;

    const frameStaggerNormal = math.mapRange(frameNormal, staggerStart, 1 - staggerEnd, 0, 1, true);
    const easeNormal = easeInOutCubic(frameStaggerNormal);

    this.rotation = easeNormal * Math.PI;
  }
}

const createTweakPane = () => {
  const pane = new Tweakpane.Pane();
  const paneFolder = pane.addFolder({ title: "Tweakpane" });
  // paneFolder.expanded = false;
  paneFolder.addInput(params, "primaryColor");
  paneFolder.addInput(params, "secondaryColor");
  paneFolder.addInput(params, "noOfShapes", { label: "No. of shapes", min: 1, max: 60, step: 1 });
  paneFolder.addInput(params, "minShapeSize", { min: 50, max: 250, step: 1 });
  paneFolder.addInput(params, "shapeIncrement", { min: 10, max: 50, step: 1 });
  paneFolder.addInput(params, "animateDuration", { min: 30, max: 360, step: 30 });

  pane.on("change", (tweak) => {
    resetSketch();
  });
  document.querySelector(".tp-dfwv").style.width = "280px";
};

canvasSketch(sketch, settings);
createTweakPane();
