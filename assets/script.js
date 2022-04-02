const world = document.querySelector(".world");

const mouseAimMarginX = 250;
const mouseAimMarginY = 200;

let currentX = 0;
let currentY = 0;
let aimX = 0;
let aimY = 0;

const handleMouseMove = (event) => {
  const { clientX: mouseX, clientY: mouseY, pageX, pageY } = event;
  const { innerWidth: winWidth, innerHeight: winHeight } = window;
  const { clientWidth: worldWidth, clientHeight: worldHeight } = world;

  //   console.log({ pageX, pageY, mouseX, mouseY, winWidth, winHeight, worldWidth, worldHeight });

  const panWidth = worldWidth - winWidth;
  const panHeight = worldHeight - winHeight;

  const normalX = (mouseX - mouseAimMarginX) / (winWidth - 2 * mouseAimMarginX);
  const normalY = (mouseY - mouseAimMarginY) / (winHeight - 2 * mouseAimMarginY);

  aimX = -1 * (panWidth * normalX);
  aimY = -1 * (panHeight * normalY);

  console.log(aimY, worldHeight, winHeight);

  //   console.log({ normalX, normalY });
};

const animate = () => {
  currentX += (aimX - currentX) * 0.05;
  currentY += (aimY - currentY) * 0.05;

  world.style.left = currentX + "px";
  world.style.top = currentY > mouseAimMarginY / 2 ? mouseAimMarginY / 2 : currentY + "px";

  requestAnimationFrame(animate);
};

if (window.innerWidth > 768) {
  animate();
  document.addEventListener("mousemove", handleMouseMove);
}
