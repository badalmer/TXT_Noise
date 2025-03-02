///////////////////////////////
// Brandon A. Dalmer - 2025
// Noise Cloud - TXT
///////////////////////////////

let cols, rows;
let scl = 10;
let inc = 0.1;
let fileCounter = 0;
let noiseSeedOffset = 0;
let selectedWidth = 18, selectedHeight = 24;
let isCustom = false;
let noiseValues = [];
let sortedNoiseValues = [];
let showText = false;
let isSorted = false;

let customWidthInput, customHeightInput;
let sizeDropdown, generateNoiseButton, generateTextButton, pixelSortButton, saveTextButton;
let textOutputDiv;

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGridSize();

  let panelX = windowWidth - 200;
  let panelY = 10;
  let buttonWidth = 160;
  
  let panelW = 200;  // Increase panel width
  let inputWidth = 140; // Adjusted to make input fields shorter

  sizeDropdown = createSelect();
  sizeDropdown.position(panelX + 10, panelY + 10);
  sizeDropdown.option('18" X 24"');
  sizeDropdown.option('24" X 36"');
  sizeDropdown.option('36" X 48"');
  sizeDropdown.option('Custom');
  sizeDropdown.changed(onSizeChange);
  sizeDropdown.style('width', buttonWidth + 'px');

  customWidthInput = createInput();
  customHeightInput = createInput();
  customWidthInput.position(panelX + 10, panelY + 40);
  customHeightInput.position(panelX + 10, panelY + 70);
  customWidthInput.attribute('placeholder', 'Width');
  customHeightInput.attribute('placeholder', 'Height');
  customWidthInput.style('width', inputWidth + 'px');  // Reduced width
  customHeightInput.style('width', inputWidth + 'px');  // Reduced width

  generateNoiseButton = createButton('Generate Noise');
  generateNoiseButton.position(panelX + 10, panelY + 100);
  generateNoiseButton.mousePressed(generateNoise);
  generateNoiseButton.style('width', buttonWidth + 'px');

  generateTextButton = createButton('Generate Text');
  generateTextButton.position(panelX + 10, panelY + 130);
  generateTextButton.mousePressed(() => {
    showText = true;
    displayText();
  });
  generateTextButton.style('width', buttonWidth + 'px');

  pixelSortButton = createButton('Pixel Sort');
  pixelSortButton.position(panelX + 10, panelY + 160);
  pixelSortButton.mousePressed(pixelSort);
  pixelSortButton.style('width', buttonWidth + 'px');
  
  saveTextButton = createButton('Save Text');
  saveTextButton.position(panelX + 10, panelY + 190);
  saveTextButton.mousePressed(saveTextFile);
  saveTextButton.style('width', buttonWidth + 'px');

  textOutputDiv = createDiv('');
  textOutputDiv.style('white-space', 'pre-wrap');
  textOutputDiv.style('font-family', 'monospace');
  textOutputDiv.style('background-color', '#f0f0f0');
  textOutputDiv.style('font-size', '6px');
  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (windowWidth - 245) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');
  textOutputDiv.style('overflow-x', 'auto'); 
  textOutputDiv.style('overflow-y', 'auto');
  textOutputDiv.style('white-space', 'pre'); // Prevent line breaks to enable horizontal scrolling
  textOutputDiv.style('z-index', '1000');
  textOutputDiv.hide();

  customWidthInput.input(() => restorePlaceholder(customWidthInput, 'Width'));
  customHeightInput.input(() => restorePlaceholder(customHeightInput, 'Height'));
  
  document.addEventListener('click', (event) => {
    let isClickInside = textOutputDiv.elt.contains(event.target);
    let isButtonClick = generateTextButton.elt.contains(event.target);
  
    if (!isClickInside && !isButtonClick) {
      setTimeout(() => {
        textOutputDiv.hide();
        showText = false;
      }, 100); // Small delay to prevent instant hiding
    }
  });

  noLoop();
}

function generateNoise() {
  if (isCustom) {
    let customW = parseInt(customWidthInput.value());
    let customH = parseInt(customHeightInput.value());

    if (!isNaN(customW) && customW > 0) selectedWidth = customW;
    if (!isNaN(customH) && customH > 0) selectedHeight = customH;
  }

  noiseSeedOffset = random(1000);
  calculateGridSize();
  generateNoiseValues();
  isSorted = false;
  showText = false;
  textOutputDiv.hide();
  redraw();
}

function calculateGridSize() {
  cols = int(selectedWidth * 2.5);
  rows = int(selectedHeight * 2.5);
  generateNoiseValues();
}

function generateNoiseValues() {
  noiseValues = [];
  sortedNoiseValues = [];
  let yoff = noiseSeedOffset;
  for (let y = 0; y < rows; y++) {
    let row = [];
    let xoff = noiseSeedOffset;
    for (let x = 0; x < cols; x++) {
      row.push(int(noise(xoff, yoff) * 255));
      xoff += inc;
    }
    noiseValues.push(row);
    sortedNoiseValues.push([...row]);
    yoff += inc;
  }
}

function pixelSort() {
  for (let y = 0; y < rows; y++) {
    sortedNoiseValues[y].sort((a, b) => a - b);
  }
  isSorted = true;
  redraw();
}

function onSizeChange() {
  let selectedSize = sizeDropdown.value();

  if (selectedSize === 'Custom') {
    isCustom = true;
    customWidthInput.show();
    customHeightInput.show();
    customWidthInput.value(selectedWidth || '');
    customHeightInput.value(selectedHeight || '');
  } else {
    isCustom = false;
    let size = selectedSize.split(' X ');
    selectedWidth = int(size[0]);
    selectedHeight = int(size[1]);
  }
}

function restorePlaceholder(inputField, placeholderText) {
  if (inputField.value().trim() === '') {
    inputField.attribute('placeholder', placeholderText);
  }
}

function displayText() {
  // Use sortedNoiseValues when pixel sorting has been applied
  let textOutput = (isSorted ? sortedNoiseValues : noiseValues)
    .map(row => row.map(v => nf(v, 3)).join(' ')).join('\n');
  textOutputDiv.html(textOutput);
  textOutputDiv.show();
}


function saveTextFile() {
  let textOutput = noiseValues.map(row => row.map(v => nf(v, 3)).join(' ')).join('\n');
  let fileName = 'noise_output_${fileCounter}.txt';
  fileCounter++;
  saveStrings([textOutput], fileName);
}

function draw() {
  background(0);
  displayNoise();  

  if (showText) {
    displayText();
  }

  drawUIPanel();
}

function displayNoise() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let brightnessValue = isSorted ? sortedNoiseValues[y][x] : noiseValues[y][x];
      fill(brightnessValue);
      noStroke();
      rect(x * scl, y * scl, scl, scl);
    }
  }
}

function drawUIPanel() {
  let panelX = windowWidth - 200;
  let panelY = 10;
  let panelW = 200; // Adjusted width
  let panelH = 230;

  fill(0);
  stroke(255);
  rect(panelX, panelY, panelW, panelH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGridSize();
  redraw();

  // Adjust the position of the UI elements
  let panelX = windowWidth - 200;
  let panelY = 10;

  sizeDropdown.position(panelX + 10, panelY + 10);
  customWidthInput.position(panelX + 10, panelY + 40);
  customHeightInput.position(panelX + 10, panelY + 70);
  generateNoiseButton.position(panelX + 10, panelY + 100);
  generateTextButton.position(panelX + 10, panelY + 130);
  pixelSortButton.position(panelX + 10, panelY + 160);
  saveTextButton.position(panelX + 10, panelY + 190);
}
