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
};
let pane;

/**
 * @param {Object} sketch
 * @param {CanvasRenderingContext2D} sketch.ctx canvas context
 */
const resetSketch = ({ ctx, width, height }) => {
  console.log({ ctx, width, height });

  ctx.fillStyle = params.bgColor;
  ctx.fillRect(0, 0, width, height);
};

/**
 * @param {Object} sketch
 * @param {CanvasRenderingContext2D} sketch.context canvas context
 */
const sketch = ({ context: ctx, width, height }) => {
  resetSketch({ ctx, width, height });
  pane.on("change", (tweak) => {
    resetSketch({ ctx, width, height });
  });
  return ({ context: ctx, width, height, frame }) => {
    if (params.errorFlag) return;

    try {
      // animation code here
    } catch (err) {
      console.log(err);
      params.errorFlag = true;
    }
  };
};

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
