// Auto-adjusts canvas when tweakpane is open

let canvasNode, isPanelExpanded;
let originalSize = {
  cSide: 0,
  cMarginTop: 0,
  cMarginLeft: 0,
};

const resizeObserver = new ResizeObserver((entries) => {
  if (!isPanelExpanded) return;
  for (let entry of entries) {
    if (entry.contentRect) {
      // check if the canvas and panel clash on the X axis
      const panelMarginLeft = entry.target.offsetLeft;
      const canvasMarginLeft = canvasNode.offsetLeft;
      const canvasWidth = parseInt(canvasNode.style.width);
      const isCanvasPanelClashingXAxis = canvasMarginLeft + canvasWidth > panelMarginLeft;
      if (!isCanvasPanelClashingXAxis) return;

      // check which axis the canvas should translate to. if X-axis, exit resizeObserver
      if (panelMarginLeft - canvasWidth > 0) {
        console.log("translateLeft!");
        canvasNode.style.transition = "all 0.3s ease-in-out";
        canvasNode.style.marginLeft = originalSize.cMarginLeft + "px";
        window.requestAnimationFrame(() => {
          canvasNode.style.marginLeft =
            canvasMarginLeft - (canvasMarginLeft + canvasWidth - panelMarginLeft + 20) + "px";
          // canvasNode.style.width = originalSize.cSide + "px";
          // canvasNode.style.height = originalSize.cSide + "px";
          canvasNode.addEventListener("transitionend", () => {
            console.log("Transition ended");
            canvasNode.style.transition = "none";
            // canvasNode.removeEventListener("transitionend", handleMouseDown, true);
          });
        });
        return;
      }

      const panelHeight = +entry.contentRect.height;
      const panelWidth = +entry.contentRect.width;

      const panelMarginTop = entry.target.offsetTop;

      const panelTotalHeightFromTop = panelHeight + panelMarginTop;

      const canvasHeight = parseInt(canvasNode.style.height);

      const canvasMarginTop = canvasNode.offsetTop;

      const canvasTotalHeightFromTop = canvasHeight + canvasMarginTop;
      const canvasPanelMarginTop = 8;
      const canvasPanelMarginBottom = 20;

      if (panelTotalHeightFromTop > canvasMarginTop) {
        const canvasPanelOverlapHeight = panelTotalHeightFromTop - canvasMarginTop;
        const updatedCanvasMarginTop =
          canvasMarginTop + canvasPanelOverlapHeight + canvasPanelMarginTop + "px";
        console.log("panelclash", canvasPanelOverlapHeight, canvasMarginTop, updatedCanvasMarginTop);

        canvasNode.style.marginTop = updatedCanvasMarginTop;
      }

      // check if canvas overflows
      const isCanvasPanelClashingYAxis = canvasMarginTop + canvasHeight > window.innerHeight;
      console.log("leftclash", isCanvasPanelClashingXAxis);

      if (isCanvasPanelClashingYAxis) {
        const shrinkPx = canvasMarginTop + canvasHeight - window.innerHeight;
        canvasNode.style.width = canvasWidth - (shrinkPx + canvasPanelMarginBottom) + "px";
        canvasNode.style.height = canvasHeight - (shrinkPx + canvasPanelMarginBottom) + "px";
      }
      console.log("paneldown", { panelTotalHeightFromTop, canvasMarginTop });

      console.log(canvasNode, canvasNode.style);

      // const updatedCanvasMarginTop = canvasHeight + panelHeight + "px";
      // console.log({ canvasHeight, canvasMarginTop, panelHeight, updatedCanvasMarginTop });
    }
  }
});

/**
 * @param {HTMLElement} panelNode
 * @param {CanvasRenderingContext2D} canvas canvas context
 */
export const autoAdjustCanvas = (canvas, panelNode, isPanelOpen) => {
  console.log(canvas, panelNode);
  canvasNode = canvas;
  resizeObserver.observe(panelNode);

  originalSize = {
    cSide: parseInt(canvasNode.style.width),
    cMarginTop: canvasNode.offsetTop,
    cMarginLeft: canvasNode.offsetLeft,
  };

  panelNode.addEventListener("click", () => {
    isPanelOpen = !isPanelOpen;
    isPanelExpanded = isPanelOpen;
    console.log("clicked!", isPanelOpen);

    if (!isPanelOpen) {
      canvasNode.style.transition = "all 0.3s ease-in-out 0s";
      canvasNode.style.marginTop = originalSize.cMarginTop + "px";
      canvasNode.style.width = originalSize.cSide + "px";
      canvasNode.style.height = originalSize.cSide + "px";
      canvasNode.addEventListener("transitionend", () => {
        console.log("Transition ended");
        canvasNode.style.transition = "none";
        // canvasNode.removeEventListener("transitionend", handleMouseDown, true);
      });
    }
  });
};
