const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  resetOnTweak: true,
  invert: false,
  lineWidth: 20,
  lineSkew: 0.7,
  spacing: 54,
  lineCap: "round",
  delay: 1,
  strokeStyle: "#000000ff",
  ERROR_FLAG: false,
};

let spacing = params.spacing;
let pos = {
  x: 0,
  y: 0,
  moveXCount: 1,
  moveYCount: 1,
  xMovesLeft: 1,
  yMovesLeft: 1,
  xDirRight: true,
  yDirDown: false,
};

const createTweakPane = ({ pane, ctx, width, height }) => {
  const paneFolder = pane.addFolder({ title: "Tweakpane" });
  paneFolder.expanded = false;
  paneFolder.addInput(params, "resetOnTweak");
  paneFolder.addInput(params, "invert");
  paneFolder.addInput(params, "lineWidth", { min: 1, max: 30, step: 1 });
  paneFolder.addInput(params, "lineCap", {
    options: {
      round: "round",
      butt: "butt",
      square: "square",
    },
  });
  paneFolder.addInput(params, "lineSkew", { min: 0.0, max: 1.0, step: 0.1 });
  paneFolder.addInput(params, "delay", { min: 1, max: 10, step: 1 });
  paneFolder.addInput(params, "spacing", { min: 40, max: 100, step: 10 });
  paneFolder.addInput(params, "strokeStyle", {
    picker: "inline",
    expanded: true,
  });
  paneFolder.addSeparator();
  paneFolder.addButton({ title: "Redraw" }).on("click", () => resetSketch({ ctx, width, height }));
};

const resetSketch = ({ ctx, width, height }) => {
  spacing = params.spacing;
  pos.x = Math.round(width / 2) - spacing / 2;
  pos.y = Math.round(height / 2) - spacing / 2;
  pos = {
    ...pos,
    moveXCount: 1,
    moveYCount: 1,
    xMovesLeft: 1,
    yMovesLeft: 1,
    xDirRight: true,
    yDirDown: false,
  };
  ctx.fillStyle = params.invert ? "black" : "white";
  ctx.fillRect(0, 0, width, height);
};

const sketch = ({ context: ctx, width, height }) => {
  resetSketch({ ctx, width, height });
  const pane = new Tweakpane.Pane();
  pane.on("change", (ev) => {
    console.log(ev);
    if (params.resetOnTweak) resetSketch({ ctx, width, height });
  });
  createTweakPane({ pane, ctx, width, height });

  return ({ context: ctx, width, height, frame }) => {
    if (params.ERROR_FLAG) return;
    if (pos.y > height || pos.y < 0 || pos.x < 0 || pos.x > width) return;
    console.log("running");

    try {
      ctx.lineCap = params.lineCap;
      ctx.lineWidth = params.lineWidth;
      ctx.strokeStyle = params.strokeStyle;

      if (frame % params.delay === 0) {
        ctx.beginPath();
        if (Math.random() > params.lineSkew) {
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(pos.x + spacing, pos.y + spacing);
        } else {
          ctx.moveTo(pos.x, pos.y + spacing);
          ctx.lineTo(pos.x + spacing, pos.y);
        }
        ctx.stroke();
        console.log(pos);
        if (pos.yMovesLeft > 0) {
          pos.y = pos.yDirDown ? pos.y + spacing : pos.y - spacing;
          pos.yMovesLeft -= 1;
        } else if (pos.xMovesLeft > 0) {
          pos.x = pos.xDirRight ? pos.x + spacing : pos.x - spacing;
          pos.xMovesLeft -= 1;
        } else {
          pos.yDirDown = !pos.yDirDown;
          pos.xDirRight = !pos.xDirRight;
          pos.moveXCount += 1;
          pos.moveYCount += 1;
          pos.xMovesLeft = pos.moveXCount;
          pos.yMovesLeft = pos.moveYCount;
        }
      }
    } catch (err) {
      console.log(err);
      params.ERROR_FLAG = true;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);
      ctx.font = "48px serif";
      ctx.fillStyle = "black";
      ctx.fillText(err, 10, 50);
    }
  };
};

canvasSketch(sketch, settings);

// #c83737ff
