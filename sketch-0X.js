// BOILERPLATE CODE
const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");

// html stuff
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
  fillStyle: "lemonchiffon",
  shapeSize: 42,
  noOfShapes: 25,
};
let pane;
const shapes = [];

/**
 * @param {Object} sketch
 * @param {CanvasRenderingContext2D} sketch.ctx canvas context
 */
const resetSketch = ({ ctx, width, height }) => {
  console.log({ ctx, width, height });

  ctx.fillStyle = params.bgColor;
  ctx.fillRect(0, 0, width, height);

  const sy = height / 2 - params.shapeSize / 2;
  for (let i = 0; i < params.noOfShapes; i++) {
    const sx = params.shapeSize * i + 10;
    const shape = new Square(sx, sy);
    shapes.push(shape);
  }
};

/**
 * @param {Object} sketch
 * @param {CanvasRenderingContext2D} sketch.context canvas context
 */
const sketch = ({ context: ctx, width, height }) => {
  // code to execute once
  resetSketch({ ctx, width, height });
  pane.on("change", (tweak) => {
    resetSketch({ ctx, width, height });
  });

  // code to execute each frame, if animate : true
  return ({ context: ctx, width, height, frame }) => {
    if (params.errorFlag) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    try {
      // animation code here
      shapes.forEach((shape) => {
        shape.draw(ctx);
      });
    } catch (err) {
      console.log(err);
      params.errorFlag = true;
    }
  };
};

class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.fillStyle = params.fillStyle;
    ctx.fillRect(this.x, this.y, params.shapeSize, params.shapeSize);
  }
}

const createTweakPane = () => {
  pane = new Tweakpane.Pane();
  const paneFolder = pane.addFolder({ title: "Tweakpane" });
  // paneFolder.expanded = false;
  paneFolder.addInput(params, "bgColor");
  //   paneFolder.addInput(params, "mainColor");

  document.querySelector(".tp-dfwv").style.width = "280px";
};

canvasSketch(sketch, settings);
createTweakPane();
