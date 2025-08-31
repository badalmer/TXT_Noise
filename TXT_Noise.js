///////////////////////////////
// Brandon A. Dalmer - 2025
// Noise Cloud - TXT
///////////////////////////////

let cols, rows;
let scl = 10;
const SCALE_INCH_TO_PIX = 2.639;
let panelX, panelY;
let panelWidth = 200;
let paletteSize = 6;
let inc = 0.1;
let fileCounter = 0;
let noiseSeedOffset = 0;
let selectedWidth = 18, selectedHeight = 24;
let isCustom = false;
let palette = [];
let noiseValues = [];
let sortedNoiseValues = [];
let showText = false;
let isSorted = false;
let bwToggle, isBW = false;
let outlineToggle, showOutline = false;
let sortDirection = 'vertical';

let customWidthInput, customHeightInput;
let sizeDropdown, generateNoiseButton, generateTextButton, pixelSortButton, saveTextButton, saveSVGButton;
let paletteSizeLabel, paletteSizeInput, pixelSizeLabel, pixelSizeInput;
let textOutputDiv;

function rgbToHex(c) {
  let r = red(c).toString(16).padStart(2, '0');
  let g = green(c).toString(16).padStart(2, '0');
  let b = blue(c).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function exportSVG() {
  let svgWidth = cols * scl;
  let svgHeight = rows * scl;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">\n`;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = isSorted ? sortedNoiseValues[y][x] : noiseValues[y][x];
      let hexColor = rgbToHex(palette[index]);
      let strokeAttr = showOutline ? ` stroke="black"` : '';
      svg += `<rect x="${x * scl}" y="${y * scl}" width="${scl}" height="${scl}" fill="${hexColor}"${strokeAttr}/>\n`;
    }
  }

  svg += '</svg>';

  let blob = new Blob([svg], { type: "image/svg+xml" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = `noise_output_${fileCounter}.svg`;
  a.click();
  URL.revokeObjectURL(url);
  fileCounter++;
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  panelX = windowWidth - panelWidth - 10;
  panelY = 15;
  let buttonWidth = 180;
  let inputWidth = 180;  

  sizeDropdown = createSelect();
  sizeDropdown.position(panelX + 10, panelY + 10);
  sizeDropdown.option('18" X 24"');
  sizeDropdown.option('30" X 30"');
  sizeDropdown.option('24" X 36"');
  sizeDropdown.option('36" X 48"');
  sizeDropdown.option('Custom');
  sizeDropdown.changed(onSizeChange);
  ButtonStyle(sizeDropdown, buttonWidth);

  customWidthInput = createInput();
  customHeightInput = createInput();
  customWidthInput.position(panelX + 10, panelY + 40);
  customHeightInput.position(panelX + 10, panelY + 70);
  customWidthInput.attribute('placeholder', ' Width');
  customHeightInput.attribute('placeholder', ' Height');
  ButtonStyle(customWidthInput, inputWidth);
  ButtonStyle(customHeightInput, inputWidth);

  paletteSizeLabel = createSpan('Palette Size: ');
  paletteSizeLabel.position(panelX + 10, panelY + 105);
  paletteSizeLabel.style('color', 'red');
  paletteSizeLabel.style('font-family', 'monospace');
  paletteSizeLabel.style('font-size', '12px');

  paletteSizeInput = createInput(paletteSize.toString());
  paletteSizeInput.position(panelX + 110, panelY + 100);
  paletteSizeInput.size(75, 20);
  paletteSizeInput.style('color', 'red');
  paletteSizeInput.style('background-color', 'black');
  paletteSizeInput.style('border', '1px solid red');
  paletteSizeInput.style('font-family', 'monospace');
  paletteSizeInput.style('text-align', 'center');
  paletteSizeInput.style('line-height', '25px');
  paletteSizeInput.style('font-size', '12px');
  paletteSizeInput.input(() => {
    let val = int(paletteSizeInput.value());
    if (!isNaN(val) && val >= 1 && val <= 11) {
      paletteSize = val;
      generatePalette();
      generateNoiseValues();
      redraw();
    }
  });

  generateNoiseButton = createButton('Generate Noise');
  generateNoiseButton.position(panelX + 10, panelY + 130);
  generateNoiseButton.mousePressed(() => {
    generatePalette();
    generateNoise();
  });
  ButtonStyle(generateNoiseButton, buttonWidth);

  generateTextButton = createButton('Generate Text');
  generateTextButton.position(panelX + 10, panelY + 160);
  generateTextButton.mousePressed(() => {
    showText = true;
    displayText();
  });
  ButtonStyle(generateTextButton, buttonWidth);

  pixelSortButton = createButton('Pixel Sort');
  pixelSortButton.position(panelX + 10, panelY + 190);
  pixelSortButton.mousePressed(() => {
    sortDirection = (sortDirection === 'vertical') ? 'horizontal' : 'vertical';
    glitchPixelSort(sortDirection);
  });
  ButtonStyle(pixelSortButton, buttonWidth);

  saveTextButton = createButton('Save Text');
  saveTextButton.position(panelX + 10, panelY + 220);
  saveTextButton.mousePressed(saveTextFile);
  ButtonStyle(saveTextButton, buttonWidth);

  saveSVGButton = createButton('Save SVG');
  saveSVGButton.position(panelX + 10, panelY + 250);
  saveSVGButton.mousePressed(exportSVG);
  ButtonStyle(saveSVGButton, buttonWidth);

  bwToggle = createCheckbox('B&W', false);
  bwToggle.position(panelX + 10, panelY + 280);
  bwToggle.changed(() => {
    isBW = bwToggle.checked();
    generatePalette();
    generateNoise();
  });
  ButtonStyle(bwToggle, buttonWidth);

  outlineToggle = createCheckbox('Outline', false);
  outlineToggle.position(panelX + 100, panelY + 280);
  outlineToggle.changed(() => {
    showOutline = outlineToggle.checked();
    redraw();
  });
  ButtonStyle(outlineToggle, buttonWidth/2);

  textOutputDiv = createDiv('');
  textOutputDiv.style('white-space', 'pre-wrap');
  textOutputDiv.style('font-family', 'monospace');
  textOutputDiv.style('background-color', '#f0f0f0');
  textOutputDiv.style('font-size', '6px');
  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (windowWidth - 245) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');
  textOutputDiv.style('overflow', 'auto');
  textOutputDiv.hide();

  customWidthInput.input(() => restorePlaceholder(customWidthInput, ' Width'));
  customHeightInput.input(() => restorePlaceholder(customHeightInput, ' Height'));

  noLoop();
  generatePalette();
  generateNoise();
}

function generatePalette() {
  palette = [];
  for (let i = 0; i < paletteSize; i++) {
    if (isBW) {
      let gray = int(random(255));
      palette.push(color(gray, gray, gray));
    } else {
      palette.push(color(int(random(255)), int(random(255)), int(random(255))));
    }
  }
}

function generateNoise() {
  if (isCustom) {
    let customW = int(customWidthInput.value());
    let customH = int(customHeightInput.value());
    if (!isNaN(customW)) selectedWidth = customW;
    if (!isNaN(customH)) selectedHeight = customH;
  }
  
  cols = int(selectedWidth * 2.5);
  rows = int(selectedHeight * 2.5);
  
  scl = floor(min((width - panelWidth - 20) / cols, (height - 20) / rows));
  
  noiseSeedOffset = random(1000);

  generateNoiseValues();
  isSorted = false;
  showText = false;
  textOutputDiv.hide();
  redraw();
}

function generateNoiseValues() {
  noiseValues = [];
  sortedNoiseValues = [];

  let yoff = noiseSeedOffset;
  for (let y = 0; y < rows; y++) {
    let row = [];
    let xoff = noiseSeedOffset;
    for (let x = 0; x < cols; x++) {
      let n = noise(xoff, yoff);
      n = constrain((n - 0.5) * 1.8 + 0.5, 0, 1); // stretch
      let index = int(n * palette.length);
      index = constrain(index, 0, palette.length - 1);
      row.push(index);
      xoff += inc;
    }
    noiseValues.push(row);
    sortedNoiseValues.push([...row]);
    yoff += inc;
  }
}

function displayNoise() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = isSorted ? sortedNoiseValues[y][x] : noiseValues[y][x];
      fill(palette[index]);
      if (showOutline) stroke(0);
      else noStroke();
      rect(x * scl, y * scl, scl, scl);
    }
  }
}

function draw() {
  background(0);
  displayNoise();
  drawUIPanel();
}

function drawUIPanel() {
  const swatchX = panelX + 10;
  const swatchY = 350;
  const swatchSize = 15;

  fill(0);
  stroke(255, 0, 0);
  rect(panelX, panelY, panelWidth, height - 30);

  textSize(12);
  fill(255);
  noStroke();
  text("Palette:", swatchX, swatchY - 10);

  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]);
    rect(swatchX, swatchY + i * 25, swatchSize, swatchSize);

    let r = red(palette[i]);
    let g = green(palette[i]);
    let b = blue(palette[i]);

    fill(255);
    text(`${int(r)}, ${int(g)}, ${int(b)}`, swatchX + swatchSize + 5, swatchY + i * 25 + 12);
  }
}

function glitchPixelSort(direction = 'vertical') {
  let glitchiness = random(0.2, 0.9);

  switch(direction) {
    case 'vertical':
      for (let x = 0; x < cols; x++) {
        let column = [], positions = [];
        let threshold = random(0.2, 0.8);
        for (let y = 0; y < rows; y++) {
          let val = noiseValues[y][x];
          if (val >= threshold && random(1) > glitchiness) {
            column.push(val);
            positions.push(y);
          }
        }
        if (column.length > 1) {
          if (random(1) < 0.5) column.reverse();
          else column.sort((a,b)=>a-b);
        }
        for (let i = 0; i < positions.length; i++) {
          let index = int(column[i] * palette.length);
          sortedNoiseValues[positions[i]][x] = constrain(index, 0, palette.length-1);
        }
      }
      break;

    case 'horizontal':
      for (let y = 0; y < rows; y++) {
        let row = [], positions = [];
        let threshold = random(0.2, 0.8);
        for (let x = 0; x < cols; x++) {
          let val = noiseValues[y][x];
          if (val >= threshold && random(1) > glitchiness) {
            row.push(val);
            positions.push(x);
          }
        }
        if (row.length > 1) {
          if (random(1) < 0.5) row.reverse();
          else row.sort((a,b)=>a-b);
        }
        for (let i = 0; i < positions.length; i++) {
          let index = int(row[i] * palette.length);
          sortedNoiseValues[y][positions[i]] = constrain(index, 0, palette.length-1);
        }
      }
      break;
  }

  isSorted = true;
  redraw();
}

function displayText() {
  let textOutput = (isSorted ? sortedNoiseValues : noiseValues)
    .map(row => row.map(v => nf(v, 3)).join(' ')).join('\n');
  textOutputDiv.html(textOutput);
  textOutputDiv.show();
}

function saveTextFile() {
  let textOutput = noiseValues.map(row => row.map(v => nf(v, 3)).join(' ')).join('\n');
  let fileName = `noise_output_${fileCounter}.txt`;
  fileCounter++;
  saveStrings([textOutput], fileName);
}

function onSizeChange() {
  let selectedSize = sizeDropdown.value();
  if (selectedSize === 'Custom') {
    isCustom = true;
    customWidthInput.show();
    customHeightInput.show();
    customWidthInput.value(selectedWidth);
    customHeightInput.value(selectedHeight);
  } else {
    isCustom = false;
    let size = selectedSize.split(' X ');
    selectedWidth = int(size[0]);
    selectedHeight = int(size[1]);
    customWidthInput.hide();
    customHeightInput.hide();
  }
  generateNoise();
}

function restorePlaceholder(inputField, placeholderText) {
  if (inputField.value().trim() === '') {
    inputField.attribute('placeholder', placeholderText);
  }
}

function ButtonStyle(btn, w) {
  btn.style('width', w + 'px');
  btn.style('height', '25px');
  btn.style('color', 'red');
  btn.style('background-color', 'black');
  btn.style('border', '1px solid red');
  btn.style('padding', '0');
  btn.style('line-height', '25px');
  btn.style('font-size', '12px');
  btn.style('box-sizing', 'border-box');
  btn.style('font-family', 'monospace');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  panelX = windowWidth - panelWidth - 10;
  panelY = 15;

  sizeDropdown.position(panelX + 10, panelY + 10);
  customWidthInput.position(panelX + 10, panelY + 40);
  customHeightInput.position(panelX + 10, panelY + 70);
  paletteSizeLabel.position(panelX + 10, panelY + 105);
  paletteSizeInput.position(panelX + 110, panelY + 100);
  generateNoiseButton.position(panelX + 10, panelY + 130);
  generateTextButton.position(panelX + 10, panelY + 160);
  pixelSortButton.position(panelX + 10, panelY + 190);
  saveTextButton.position(panelX + 10, panelY + 220);
  saveSVGButton.position(panelX + 10, panelY + 250);
  bwToggle.position(panelX + 10, panelY + 280);
  outlineToggle.position(panelX + 100, panelY + 280);

  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (panelX - 30) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');

  redraw();
}
