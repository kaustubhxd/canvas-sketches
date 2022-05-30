// BOILERPLATE CODE

// dependencies
const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");
const { roundRectTypeA, roundRectTypeB } = require("./utils/ctxMethods");

CanvasRenderingContext2D.prototype.roundRect = roundRectTypeB;

// html-css styling stuff
document.title = document.URL.split("/").at(-2);
document.body.style.backgroundColor = "aliceblue";

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  errorFlag: false,
  bgColor: "#fff",
  mainColor: "#000",
  noOfShapes: 30,
  lineWidth: 10,
};
let pane;

const resetSketch = ({ ctx, width, height }) => {
  console.log({ ctx, width, height });

  ctx.fillStyle = params.bgColor;
  ctx.fillRect(0, 0, width, height);
};

let shapes = [];
/**
 * @param {Object} sketch
 * @param {CanvasRenderingContext2D} sketch.context canvas context
 */
const sketch = ({ context: ctx, width, height }) => {
  resetSketch({ ctx, width, height });
  pane.on("change", (tweak) => {
    resetSketch({ ctx, width, height });
  });

  let squareSize = 10;
  let borderRadius = 10;
  for (let i = 0; i < params.noOfShapes; i++) {
    const shape = new RoundedSquare(-squareSize / 2, -squareSize / 2, squareSize, squareSize, borderRadius);
    borderRadius += i * 0.3;
    squareSize += params.lineWidth * 2.5;
    shapes.push(shape);
  }
  console.log(shapes);
  /**
   * @param {Object} sketch
   * @param {CanvasRenderingContext2D} sketch.context canvas context
   */
  return ({ context: ctx, width, height, frame }) => {
    if (params.errorFlag) return;

    try {
      // animation code here
      ctx.fillStyle = "white";
      ctx.rect(0, 0, width, height);
      ctx.fill();
      ctx.translate(width / 2, height / 2);
      // ctx.strokeStyle = "black";
      ctx.lineWidth = params.lineWidth;
      shapes.forEach((shape, index) => {
        shape.draw(ctx, frame, index);
      });
    } catch (err) {
      console.log(err);
      params.errorFlag = true;
    }
  };
};

class RoundedSquare {
  constructor(x, y, width, height, radius) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
  }

  draw(ctx, frame, index) {
    ctx.save();
    ctx.rotate(Math.sin((frame + index) * 0.002));
    ctx.roundRect(ctx, this.x, this.y, this.width, this.height, this.radius, "stroke");
    ctx.stroke();
    ctx.restore();
  }
}

const createTweakPane = () => {
  pane = new Tweakpane.Pane();
  const paneFolder = pane.addFolder({ title: "Tweakpane" });
  // paneFolder.expanded = false;
  paneFolder.addInput(params, "bgColor");
  //   paneFolder.addInput(params, "mainColor");

  // increase tweak pane width
  document.querySelector(".tp-dfwv").style.width = "280px";
};

canvasSketch(sketch, settings);
createTweakPane();
