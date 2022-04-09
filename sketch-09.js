// BOILERPLATE CODE

// dependencies
const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");
const { roundRect } = require("./utils/ctxMethods");

CanvasRenderingContext2D.prototype.roundRect = roundRect;

// html-css styling stuff
document.title = document.URL.split("/").at(-2);
document.body.style.backgroundColor = "aliceblue";

const settings = {
  dimensions: [1080, 1080],
  // animate: true,
};

const params = {
  errorFlag: false,
  bgColor: "#fff",
  mainColor: "#000",
  noOfShapes: 200,
  squareSize: 20,
  borderRadius: 100,
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

  let { squareSize, noOfShapes } = params;
  const decrement = squareSize / noOfShapes;
  for (let i = 0; i < noOfShapes; i++) {
    squareSize -= 1;
    const shape = new RoundedSquare(
      -squareSize / 2,
      -squareSize / 2,
      squareSize,
      squareSize,
      params.borderRadius - i * 3
    );
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
      ctx.translate(width / 2, height / 2);
      shapes.forEach((shape, index) => {
        shape.draw(ctx);
      });
      const size = params.squareSize;
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

  draw(ctx) {
    ctx.lineWidth = 6;
    ctx.roundRect(ctx, this.x, this.y, this.width, this.height, this.radius, "stroke");
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
