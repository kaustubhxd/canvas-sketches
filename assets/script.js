const world = document.querySelector(".world");

function mapRange(value, inputMin, inputMax, outputMin, outputMax, clamp) {
  // Reference:
  // https://openframeworks.cc/documentation/math/ofMath/
  if (Math.abs(inputMin - inputMax) < Number.EPSILON) {
    return outputMin;
  } else {
    var outVal = ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
    if (clamp) {
      if (outputMax < outputMin) {
        if (outVal < outputMax) outVal = outputMax;
        else if (outVal > outputMin) outVal = outputMin;
      } else {
        if (outVal > outputMax) outVal = outputMax;
        else if (outVal < outputMin) outVal = outputMin;
      }
    }
    return outVal;
  }
}

const worldMargin = 20;
const mouseTrackMargin = 50;

const handleMouseMove = (e) => {
  const { clientX, clientY } = e;
  const { innerWidth: winWidth, innerHeight: winHeight } = window;
  const { clientWidth: worldWidth, clientHeight: worldHeight } = world;

  console.log({ clientX, clientY, winWidth, winHeight, worldWidth, worldHeight });
  //   const clientWidthMap = (clientX * winWidth) / worldWidth;
  //   const clientHeightMap = (clientY * winHeight) / worldHeight;

  const clientWidthMap = mapRange(
    clientX,
    worldMargin,
    winWidth,
    -worldMargin,
    worldWidth - (winWidth - worldMargin)
  );
  const clientHeightMap = mapRange(
    clientY,
    worldMargin,
    winHeight,
    -worldMargin,
    worldHeight - winHeight - worldMargin
  );

  console.log({ clientWidthMap, clientHeightMap });

  // world.style.left = (clientWidthMap < worldMargin ? worldMargin : -clientWidthMap) + "px";
  // world.style.top = (clientHeightMap < worldMargin ? worldMargin : -clientHeightMap) + "px";

  world.style.left = -clientWidthMap + "px";
  world.style.top = -clientHeightMap + "px";
};

document.addEventListener("mousemove", handleMouseMove);
