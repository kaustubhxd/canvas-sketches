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

const resetSketch = () => {};

const sketch = ({ context: ctx, width, height }) => {
  resetSketch();
  return ({ context: ctx, width, height, frame }) => {
    if (params.errorFlag) return;
    ctx.fillStyle = params.bgColor;
    ctx.fillRect(0, 0, width, height);

    try {
      // animation code here
    } catch (err) {
      console.log(err);
      params.errorFlag = true;
    }
  };
};

const createTweakPane = () => {
  const pane = new Tweakpane.Pane();
  const paneFolder = pane.addFolder({ title: "Tweakpane" });
  // paneFolder.expanded = false;
  paneFolder.addInput(params, "bgColor");
  paneFolder.addInput(params, "mainColor");

  pane.on("change", (tweak) => {
    resetSketch();
  });
  document.querySelector(".tp-dfwv").style.width = "280px";
};

canvasSketch(sketch, settings);
createTweakPane();
