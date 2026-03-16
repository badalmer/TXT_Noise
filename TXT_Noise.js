///////////////////////////////
// Brandon A. Dalmer - 2026
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
let seedInput;
let seedLabel;
let baseSeed = 0;
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
let paletteSizeLabel, paletteSizeInput;
let pixelSizeLabel, pixelSizeInput;
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

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  panelX = windowWidth - panelWidth - 10;
  panelY = 15;
  let buttonWidth = 180;

  sizeDropdown = createSelect();
  sizeDropdown.position(panelX + 10, panelY + 10);
  sizeDropdown.option('18" X 24"');
  sizeDropdown.option('30" X 30"');
  sizeDropdown.option('24" X 36"');
  sizeDropdown.option('36" X 48"');
  sizeDropdown.option('48" X 48"');
  sizeDropdown.option('Custom');
  sizeDropdown.changed(onSizeChange);
  ButtonStyle(sizeDropdown, buttonWidth);

  customWidthInput = createInput();
  customHeightInput = createInput();
  customWidthInput.position(panelX + 10, panelY + 40);
  customHeightInput.position(panelX + 10, panelY + 70);
  customWidthInput.attribute('placeholder', ' Width');
  customHeightInput.attribute('placeholder', ' Height');
  ButtonStyle(customWidthInput, buttonWidth);
  ButtonStyle(customHeightInput, buttonWidth);

  paletteSizeLabel = createSpan('Palette Size: ');
  paletteSizeLabel.position(panelX + 10, panelY + 105);
  paletteSizeLabel.style('color','red');
  paletteSizeLabel.style('font-family', 'monospace');
  paletteSizeLabel.style('font-size', '12px');
  
  paletteSizeInput = createSlider(1, 10, paletteSize, 1);
  paletteSizeInput.position(panelX + 10, panelY + 118);
  ButtonStyle(paletteSizeInput, buttonWidth);
  paletteSizeInput.input(() => {
    paletteSize = paletteSizeInput.value();
    generatePalette();
    generateNoiseValues();
    redraw();
  });

  pixelSizeLabel = createSpan("Pixel Size:");
  pixelSizeLabel.position(panelX + 10, panelY + 155);
  pixelSizeLabel.style("color", "red");
  pixelSizeLabel.style("font-family", "monospace");
  pixelSizeLabel.style("font-size", "12px");
  
  pixelSizeInput = createInput(scl.toString());
  pixelSizeInput.position(panelX + 110, panelY + 150);
  pixelSizeInput.size(75, 20);
  pixelSizeInput.style('color', 'red');
  pixelSizeInput.style('background-color', 'black');
  pixelSizeInput.style('border', '1px solid red');
  pixelSizeInput.style('font-family', 'monospace');
  pixelSizeInput.style('text-align', 'center');
  pixelSizeInput.style('line-height', '25px');
  pixelSizeInput.style('font-size', '12px');
  pixelSizeInput.input(() => {
    let val = float(pixelSizeInput.value());
    if(!isNaN(val) && val > 1){
      scl = val;
      generateNoise();
    }
  });

  seedLabel = createSpan("Seed:");
  seedLabel.position(panelX + 10, panelY + 180);
  seedLabel.style("color", "red");
  seedLabel.style("font-family", "monospace");
  seedLabel.style("font-size", "12px");
  
  seedInput = createInput("0");
  seedInput.position(panelX + 110, panelY + 175);
  seedInput.size(75, 20); 
  seedInput.style('color', 'red');
  seedInput.style('background-color', 'black');
  seedInput.style('border', '1px solid red');
  seedInput.style('font-family', 'monospace');
  seedInput.style('text-align', 'center');
  seedInput.style('line-height', '25px');
  seedInput.style('font-size', '12px');
  seedInput.input(() => {
    let val = float(seedInput.value());
    if(!isNaN(val)){
      baseSeed = val;
      noiseSeed(baseSeed);
      generateNoiseValues();
      redraw();
    }
  });

  generateNoiseButton = createButton("Generate Noise");
  generateNoiseButton.position(panelX + 10, panelY + 205);
  generateNoiseButton.mousePressed(() => {
    generatePalette(true);
    generateNoise();
  });
  ButtonStyle(generateNoiseButton, buttonWidth);

  generateTextButton = createButton("Generate Text");
  generateTextButton.position(panelX + 10, panelY + 235);
  generateTextButton.mousePressed(() => {
    showText = true;
    displayText();
  });
  ButtonStyle(generateTextButton, buttonWidth);

  pixelSortButton = createButton("Pixel Sort");
  pixelSortButton.position(panelX + 10, panelY + 265);
  pixelSortButton.mousePressed(()=> {
    sortDirection = (sortDirection === "vertical") ? "horizontal" : "vertical";
    glitchPixelSort(sortDirection);
  });
  ButtonStyle(pixelSortButton,buttonWidth);

  saveTextButton = createButton("Save Text");
  saveTextButton.position(panelX + 10, panelY + 295);
  saveTextButton.mousePressed(saveTextFile);
  ButtonStyle(saveTextButton, buttonWidth);

  saveSVGButton = createButton("Save SVG");
  saveSVGButton.position(panelX + 10, panelY + 325);
  saveSVGButton.mousePressed(exportSVG);
  ButtonStyle(saveSVGButton, buttonWidth);

  bwToggle = createCheckbox("B&W", false);
  bwToggle.position(panelX + 10, panelY + 355);
  bwToggle.changed(()=> {
    isBW = bwToggle.checked();
    generatePalette();
    generateNoise();
  });
  ButtonStyle(bwToggle, buttonWidth);

  outlineToggle = createCheckbox("Outline", false);
  outlineToggle.position(panelX + 100, panelY + 355);
  outlineToggle.changed(()=> {
    showOutline = outlineToggle.checked();
    redraw();
  });
  ButtonStyle(outlineToggle, buttonWidth/2);

  textOutputDiv = createDiv("");
  textOutputDiv.style("white-space", "pre-wrap");
  textOutputDiv.style("font-family", "monospace");
  textOutputDiv.style("background-color", "#f0f0f0");
  textOutputDiv.style("font-size", "6px");
  textOutputDiv.position(20, 20);
  textOutputDiv.style("width", (windowWidth - 245) + "px");
  textOutputDiv.style("height", (windowHeight - 60) + "px");
  textOutputDiv.style("overflow", "auto");
  textOutputDiv.hide();
  
  customWidthInput.input(() => restorePlaceholder(customWidthInput, ' Width'));
  customHeightInput.input(() => restorePlaceholder(customHeightInput, ' Height'));

  noLoop();
  generatePalette();
  generateNoise();
}

function generatePalette(forceRefresh = false) {
  if (forceRefresh) {
    palette = [];
  }
  
  
  if (palette.length < paletteSize) {
    let toAdd = paletteSize - palette.length;

    for (let i = 0; i < toAdd; i++) {
      if (isBW) {
        let gray = int(random(255));
        palette.push(color(gray, gray, gray));
      } else {
        palette.push(color(int(random(255)), int(random(255)), int(random(255))));
      }
    }
  }

  if (palette.length > paletteSize) {
    palette.splice(paletteSize);
  }
}

function generateNoise() {
  if (isCustom) {
    let customW = int(customWidthInput.value());
    let customH = int(customHeightInput.value());

    if (!isNaN(customW)) selectedWidth = customW;
    if (!isNaN(customH)) selectedHeight = customH;
  }

  let pixelSize = float(pixelSizeInput.value()) || 10;

  cols = int((selectedWidth * 2.5) / (pixelSize / 10));
  rows = int((selectedHeight * 2.5) / (pixelSize / 10));

  cols = max(1, cols);
  rows = max(1, rows);

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

function draw(){
  background(0);
  displayNoise();
  drawUIPanel();
}

function drawUIPanel() {
  const swatchX = panelX + 10;
  const swatchY = 425;
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
  paletteSizeInput.position(panelX + 10, panelY + 118);
  pixelSizeLabel.position(panelX + 10, panelY + 155);
  pixelSizeInput.position(panelX + 110, panelY + 150);
  seedLabel.position(panelX + 10, panelY + 180);
  seedInput.position(panelX + 110, panelY + 175);
  generateNoiseButton.position(panelX + 10, panelY + 205);
  generateTextButton.position(panelX + 10, panelY + 235);
  pixelSortButton.position(panelX + 10, panelY + 265);
  saveTextButton.position(panelX + 10, panelY + 295);
  saveSVGButton.position(panelX + 10, panelY + 325);
  bwToggle.position(panelX + 10, panelY + 355);
  outlineToggle.position(panelX + 100, panelY + 355);

  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (panelX - 30) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');

  redraw();
}
