// Interactive Vector Addition Engine with Konva.js
(function () {
  const container = document.getElementById('container');

  // Values
  let augendVal = 5;
  let addendVal = 8;
  const unitSize = 35; // Pixels per grid unit

  // Konva Setup
  const stage = new Konva.Stage({
    container: 'container',
    width: container.offsetWidth,
    height: container.offsetHeight,
  });

  const gridLayer = new Konva.Layer();
  const vectorLayer = new Konva.Layer();
  stage.add(gridLayer);
  stage.add(vectorLayer);

  // Colors
  const colors = {
    augend: '#16a34a', // Green
    addend: '#2563eb', // Blue
    sum: '#9333ea',    // Purple
    grid: '#e2e8f0',
    axis: '#94a3b8',
    text: '#1e293b'
  };

  function getOrigin() {
    return {
      x: 60,
      y: stage.height() / 2 + 20
    };
  }

  // Draw Background Axis & Grid
  function drawGrid() {
    gridLayer.destroyChildren();
    const origin = getOrigin();
    const width = stage.width();
    const height = stage.height();

    // Baseline
    gridLayer.add(new Konva.Line({
      points: [0, origin.y, width, origin.y],
      stroke: colors.axis,
      strokeWidth: 2
    }));

    // Ticks & Numbers
    const maxTicks = Math.floor((width - origin.x) / unitSize);
    for (let i = 0; i <= maxTicks; i++) {
      const x = origin.x + i * unitSize;

      // Vertical Grid line
      gridLayer.add(new Konva.Line({
        points: [x, 0, x, height],
        stroke: colors.grid,
        strokeWidth: 1,
        dash: [4, 4]
      }));

      // Tick mark
      gridLayer.add(new Konva.Line({
        points: [x, origin.y - 6, x, origin.y + 6],
        stroke: colors.axis,
        strokeWidth: 2
      }));

      // Number Label
      gridLayer.add(new Konva.Text({
        x: x - 10,
        y: origin.y + 12,
        text: i.toString(),
        fontSize: 14,
        fontFamily: 'sans-serif',
        fill: colors.text,
        align: 'center',
        width: 20
      }));
    }

    gridLayer.draw();
  }

  // Create Animated Arrow Vector Helper
  function createVector(startX, startY, lengthUnits, color, labelText) {
    const group = new Konva.Group({ opacity: 0 });
    const targetLength = lengthUnits * unitSize;

    const arrow = new Konva.Arrow({
      x: startX,
      y: startY,
      points: [0, 0, 0, 0], // Starts at 0 length for animation
      pointerLength: 12,
      pointerWidth: 12,
      fill: color,
      stroke: color,
      strokeWidth: 4,
      lineCap: 'round'
    });

    const label = new Konva.Text({
      x: startX + targetLength / 2 - 15,
      y: startY - 28,
      text: labelText,
      fontSize: 18,
      fontStyle: 'bold',
      fontFamily: 'sans-serif',
      fill: color,
      opacity: 1
    });

    group.add(arrow);
    group.add(label);

    return {
      group,
      animateIn: function (onComplete) {
        group.opacity(1);
        vectorLayer.draw();

        new Konva.Tween({
          node: arrow,
          duration: 0.5,
          points: [0, 0, targetLength, 0],
          easing: Konva.Easings.EaseOut,
          onFinish: onComplete
        }).play();
      },
      hide: function () {
        group.opacity(0);
        arrow.points([0, 0, 0, 0]);
      }
    };
  }

  let vecAugend, vecAddend, vecSum;

  function buildVectors() {
    vectorLayer.destroyChildren();
    const origin = getOrigin();

    // Augend (Vector 1 - Green)
    vecAugend = createVector(origin.x, origin.y - 25, augendVal, colors.augend, `+${augendVal}`);

    // Addend (Vector 2 - Blue, placed nose-to-tail)
    const addendStartX = origin.x + augendVal * unitSize;
    vecAddend = createVector(addendStartX, origin.y - 25, addendVal, colors.addend, `+${addendVal}`);

    // Sum (Vector 3 - Purple, drawn overall)
    const totalSum = augendVal + addendVal;
    vecSum = createVector(origin.x, origin.y - 80, totalSum, colors.sum, `Sum = ${totalSum}`);

    vectorLayer.add(vecAugend.group);
    vectorLayer.add(vecAddend.group);
    vectorLayer.add(vecSum.group);
    vectorLayer.draw();
  }

  function resetAll() {
    if (vecAugend) vecAugend.hide();
    if (vecAddend) vecAddend.hide();
    if (vecSum) vecSum.hide();
    vectorLayer.draw();
  }

  // Event Listeners
  document.getElementById('step1').addEventListener('click', () => {
    resetAll();
    vecAugend.animateIn();
  });

  document.getElementById('step2').addEventListener('click', () => {
    if (vecAugend.group.opacity() === 0) vecAugend.animateIn();
    vecAddend.animateIn();
  });

  document.getElementById('step3').addEventListener('click', () => {
    if (vecAugend.group.opacity() === 0) vecAugend.animateIn();
    if (vecAddend.group.opacity() === 0) vecAddend.animateIn();
    vecSum.animateIn();
  });

  document.getElementById('reset').addEventListener('click', resetAll);

  document.getElementById('newExample').addEventListener('click', () => {
    resetAll();
    augendVal = Math.floor(Math.random() * 5) + 2; // Random 2 to 6
    addendVal = Math.floor(Math.random() * 6) + 2; // Random 2 to 7
    buildVectors();
    vecAugend.animateIn();
  });

  // Handle Window Resize Responsively
  window.addEventListener('resize', () => {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    stage.width(w);
    stage.height(h);
    drawGrid();
    buildVectors();
  });

  // Initial Initialize
  drawGrid();
  buildVectors();
})();