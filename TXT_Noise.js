///////////////////////////////
// Brandon A. Dalmer - 2026
// Noise Cloud - TXT
///////////////////////////////

let cols, rows;
let scl = 10;
const SCALE_INCH_TO_PIX = 2.639;
let panelX, panelY;
let panelWidth = 200;
let paletteSize = 10;
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
let paletteModeDropdown;
let paletteMode = "random";
let masterPalette = [];

let textOutputDiv;

class Paint {
  constructor(muns, name, r, g, b) {
    this.muns = muns;
    this.name = name;
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

function getPalette() {
  return [
    new Paint(1450, "Alizarin Crimson Hue", 81, 61, 62),
    new Paint(1005, "Anthraquinone Blue", 62, 56, 66),
    new Paint(1463, "Aureolin Hue", 214, 153, 29),
    new Paint(1464, "Azurite Hue", 47, 79, 99),
    new Paint(1007, "Bismuth Vanadate Yellow", 255, 235, 3),
    new Paint(4075, "Black Mica Flakes", 0, 0, 0),
    new Paint(1010, "Bone Black", 58, 58, 59),
    new Paint(1020, "Burnt Sienna", 110, 69, 60),
    new Paint(1030, "Burnt Umber", 74, 66, 61),
    new Paint(1035, "Burnt Umber Light", 86, 67, 57),
    new Paint(1070, "C.P. Cadmium Orange", 255, 109, 36),
    new Paint(1080, "C.P. Cadmium Red Dark", 156, 56, 60),
    new Paint(1090, "C.P. Cadmium Red Light", 220, 70, 53),
    new Paint(1100, "C.P. Cadmium Red Medium", 181, 57, 58),
    new Paint(1110, "C.P. Cadmium Yellow Dark", 255, 171, 0),
    new Paint(1120, "C.P. Cadmium Yellow Light", 255, 220, 0),
    new Paint(1130, "C.P. Cadmium Yellow Medium", 255, 195, 0),
    new Paint(1135, "C.P. Cadmium Yellow Prim", 255, 231, 37),
    new Paint(1552, "Cadmium Red Medium Hue", 177, 57, 54),
    new Paint(1554, "Cadmium Yellow Medium Hue", 255, 188, 32),
    new Paint(1040, "Carbon Black", 61, 61, 61),
    new Paint(1051, "Cerulean Blue Deep", 0, 99, 126),
    new Paint(1050, "Cerulean Blue, Chromium", 0, 109, 153),
    new Paint(1060, "Chromium Oxide Green", 88, 111, 77),
    new Paint(1061, "Chromium Oxide Green Dark", 65, 85, 64),
    new Paint(1140, "Cobalt Blue", 21, 86, 161),
    new Paint(1556, "Cobalt Blue Hue", 23, 88, 154),
    new Paint(1142, "Cobalt Green", 48, 93, 79),
    new Paint(1145, "Cobalt Teal", 0, 177, 172),
    new Paint(1143, "Cobalt Titanate Green", 92, 159, 99),
    new Paint(1144, "Cobalt Turquois", 0, 117, 118),
    new Paint(1465, "Cobalt Violet Hue", 91, 58, 80),
    new Paint(1147, "Diarylide Yellow", 255, 159, -4),
    new Paint(1150, "Dioxazine Purple", 63, 57, 59),
    new Paint(1160, "Graphite Grey", 92, 91, 89),
    new Paint(1170, "Green Gold", 109, 117, 55),
    new Paint(1180, "Hansa Yellow Light", 252, 216, 0),
    new Paint(1190, "Hansa Yellow Medium", 255, 179, 0),
    new Paint(1191, "Hansa Yellow Opaque", 255, 203, 0),
    new Paint(1454, "Hookers Green Hue", 59, 65, 63),
    new Paint(1455, "Indian Yellow Hue", 197, 110, 47),
    new Paint(1195, "Jenkins Green", 57, 64, 63),
    new Paint(1558, "Light Green (BS)", 70, 184, 77),
    new Paint(1560, "Light Green (YS)", 135, 207, 80),
    new Paint(1562, "Light Magenta", 238, 148, 170),
    new Paint(1564, "Light Turquois (Phthalo)", 0, 150, 128),
    new Paint(1566, "Light Ultramarine Blue", 182, 156, 84),
    new Paint(1568, "Light Violet", 122, 117, 184),
    new Paint(1457, "Manganese Blue Hue", 0, 107, 148),
    new Paint(1200, "Mars Black", 61 ,60 ,60),
    new Paint(1202, "Mars Yellow", 163, 92, 65),
    new Paint(1570, "Medium Magenta", 186, 89, 153),
    new Paint(1572, "Medium Violet", 94, 73, 120),
    new Paint(1210, "Napthol Red Light", 186, 59, 53),
    new Paint(1220, "Napthol Red Medium", 148, 56, 55),
    new Paint(1459, "Naples Yellow Hue", 234, 181, 118),
    new Paint(1442, "Neutral Grey N2", 67, 68, 68),
    new Paint(1443, "Neutral Grey N3", 84, 83, 83),
    new Paint(1444, "Neutral Grey N4", 102, 103, 102),
    new Paint(1445, "Neutral Grey N5", 123, 124, 124),
    new Paint(1446, "Neutral Grey N6", 151, 151, 149),
    new Paint(1447, "Neutral Grey N7", 173, 172, 170),
    new Paint(1448, "Neutral Grey N8", 201, 201, 198),
    new Paint(1225, "Nickel Azo Yellow", 162, 115, 53),
    new Paint(1240, "Paynes Grey", 56, 57, 60),
    new Paint(1250, "Permanent Green Light", 0, 120, 71),
    new Paint(1252, "Permanent Maroon", 72, 60, 63),
    new Paint(1253, "Permanent Violet Dark", 71, 59, 70),
    new Paint(1255, "Phthalo Blue (GS)", 57, 56, 86),
    new Paint(1260, "Phthalo Blue (RS)", 59, 56, 72),
    new Paint(1270, "Phthalo Blue (BS)", 43, 68, 71),
    new Paint(1275, "Phthalo Blue (YS)", 43, 71, 65),
    new Paint(1500, "Primary Cyan", 10, 87, 133),
    new Paint(1510, "Primary Magenta", 169, 58, 64),
    new Paint(1530, "Primary Yellow", 255, 203, 0),
    new Paint(1460, "Prussian Blue Hue", 60, 58, 63),
    new Paint(1276, "Pyrrole Orange", 238, 79, 41),
    new Paint(1277, "Pyrrole Red", 185, 48, 51),
    new Paint(1278, "Pyrrole Red Dark", 164, 45, 56),
    new Paint(1279, "Pyrrole Red Light", 205, 61, 52),
    new Paint(1280, "Quinacridone Burnt Orange", 87, 63, 61),
    new Paint(1290, "Quinacridone Crimson", 90, 59, 92),
    new Paint(1305, "Quinacridone Magenta", 144, 56, 70),
    new Paint(1310, "Quinacridone Red", 152, 57, 66),
    new Paint(1320, "Quinacridone Red Light", 171, 62, 65),
    new Paint(1330, "Quinacridone Violet", 104, 55, 60),
    new Paint(1331, "Quinacridone Nickel Azo Gold", 115, 69, 59),
    new Paint(1340, "Raw Sienna", 240, 217, 196),
    new Paint(1350, "Raw Umber", 72, 68, 64),
    new Paint(1360, "Red Oxide", 203, 151, 151),
    new Paint(1461, "Sap Green Hue", 61, 67, 63),
    new Paint(1467, "Smalt Hue", 54, 60, 82),
    new Paint(1468, "Terre Verte Hue", 76, 86, 68),
    new Paint(1370, "Titan Buff", 228, 209, 178),
    new Paint(1375, "Titanate Yellow", 245, 224, 112),
    new Paint(1380, "Titanium White", 250, 251, 245),
    new Paint(1383, "Transparent Brown Iron Oxide", 77, 67, 64),
    new Paint(1384, "Transparent Pyrrole Orange", 192, 63, 50),
    new Paint(1385, "Transparent Red Iron Oxide", 106, 67, 63),
    new Paint(1386, "Transparent Yellow Iron Oxide", 152, 103, 71),
    new Paint(1390, "Turquois (Phthalo)", 51, 62, 73),
    new Paint(1400, "Ultramarine Blue", 53, 54, 96),
    new Paint(1401, "Ultramarine Violet", 61, 57, 83),
    new Paint(1462, "VanDyke Brown Hue", 64, 64, 63),
    new Paint(1403, "Vat Orange", 224, 83, 47),
    new Paint(1405, "Violet Oxide", 105, 65, 63),
    new Paint(1469, "Violet Green Hue", 21, 96, 83),
    new Paint(1407, "Yellow Ochre", 182, 126, 71),
    new Paint(1410, "Yellow Oxide", 193, 136, 69),
    new Paint(1415, "Zinc White", 242, 243, 240)
  ];
}

function getGoldenColors(count) {
  if (!masterPalette || masterPalette.length === 0) masterPalette = getPalette();
  let shuffled = [...masterPalette].sort(() => random() - 0.5);
  let golden = [];
  for (let i = 0; i < count; i++) {
    let p = shuffled[i % shuffled.length];
    golden.push(color(p.r, p.g, p.b));
  }
  return golden;
}

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
      let c = palette[index];
      if (paletteMode === "golden" && c.paint) c = c.color;
      let hexColor  = rgbToHex(c);
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
  
  let sw = 120;
  let sh = 60;
  let pg = createGraphics(palette.length * sw, sh);
  pg.background(255);
  pg.textSize(8);
  pg.textFont('monospace');
  pg.fill(0);
  
  for (let i = 0; i < palette.length; i++) {
    let p = palette[i];
    let c, name, rgb;
    
    if (paletteMode === "golden" && p.paint) {
      c = p.color;
      name = p.paint.name;
      rgb = `${p.paint.r}, ${p.paint.g}, ${p.paint.b}`;
    } else {
      c = p;
      name = "Random";
      rgb = `${int(red(c))}, ${int(green(c))}, ${int(blue(c))}`;      
    }
    
    let x = i * sw;
    
    pg.noStroke();
    pg.fill(c);
    pg.rect(i * sw, 0, sw, 20);
    
    pg.fill(0);
    pg.text(`${i}`, x + 2, 30);
    pg.text(name, x + 2, 40);
    pg.text(`(${rgb})`, x + 2, 50)
  }
  
  save(pg, `palette_${fileCounter}.png`);
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
  
  paletteModeDropdown = createSelect();
  paletteModeDropdown.position(panelX + 10, panelY + 100);
  paletteModeDropdown.option("Generate Colors", "random");
  paletteModeDropdown.option("Golden Heavy Body", "golden");
  paletteModeDropdown.selected("random");
  paletteModeDropdown.changed(() => {
    paletteMode = paletteModeDropdown.value();
    generatePalette(true);
    generateNoise();
  });
  
  ButtonStyle(paletteModeDropdown, 180);
  

  paletteSizeLabel = createSpan('Palette Size: ');
  paletteSizeLabel.position(panelX + 10, panelY + 135);
  paletteSizeLabel.style('color','red');
  paletteSizeLabel.style('font-family', 'monospace');
  paletteSizeLabel.style('font-size', '12px');
  
  paletteSizeInput = createSlider(1, 10, paletteSize, 1);
  paletteSizeInput.position(panelX + 10, panelY + 148);
  ButtonStyle(paletteSizeInput, buttonWidth);
  paletteSizeInput.input(() => {
    paletteSize = paletteSizeInput.value();
    generatePalette();
    generateNoiseValues();
    redraw();
  });

  pixelSizeLabel = createSpan("Pixel Size:");
  pixelSizeLabel.position(panelX + 10, panelY + 185);
  pixelSizeLabel.style("color", "red");
  pixelSizeLabel.style("font-family", "monospace");
  pixelSizeLabel.style("font-size", "12px");
  
  pixelSizeInput = createInput(scl.toString());
  pixelSizeInput.position(panelX + 110, panelY + 180);
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
  seedLabel.position(panelX + 10, panelY + 210);
  seedLabel.style("color", "red");
  seedLabel.style("font-family", "monospace");
  seedLabel.style("font-size", "12px");
  
  seedInput = createInput("0");
  seedInput.position(panelX + 110, panelY + 205);
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
  generateNoiseButton.position(panelX + 10, panelY + 235);
  generateNoiseButton.mousePressed(() => {
    generatePalette(true);
    generateNoise();
  });
  ButtonStyle(generateNoiseButton, buttonWidth);

  generateTextButton = createButton("Generate Text");
  generateTextButton.position(panelX + 10, panelY + 265);
  generateTextButton.mousePressed(() => {
    showText = true;
    displayText();
  });
  ButtonStyle(generateTextButton, buttonWidth);

  pixelSortButton = createButton("Pixel Sort");
  pixelSortButton.position(panelX + 10, panelY + 295);
  pixelSortButton.mousePressed(()=> {
    sortDirection = (sortDirection === "vertical") ? "horizontal" : "vertical";
    glitchPixelSort(sortDirection);
  });
  ButtonStyle(pixelSortButton,buttonWidth);

  saveTextButton = createButton("Save Text");
  saveTextButton.position(panelX + 10, panelY + 325);
  saveTextButton.mousePressed(saveTextFile);
  ButtonStyle(saveTextButton, buttonWidth);

  saveSVGButton = createButton("Save SVG");
  saveSVGButton.position(panelX + 10, panelY + 355);
  saveSVGButton.mousePressed(exportSVG);
  ButtonStyle(saveSVGButton, buttonWidth);

  bwToggle = createCheckbox("B&W", false);
  bwToggle.position(panelX + 10, panelY + 385);
  bwToggle.changed(()=> {
    isBW = bwToggle.checked();
    generatePalette();
    generateNoise();
  });
  ButtonStyle(bwToggle, buttonWidth);

  outlineToggle = createCheckbox("Outline", false);
  outlineToggle.position(panelX + 100, panelY + 385);
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
  masterPalette = getPalette();
  generatePalette();
  generateNoise();
}

function generatePalette(forceRefresh = false) {
  if (forceRefresh) palette = [];

  if (paletteMode === "random") {
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
  
  if (paletteMode === "golden") {
    let sourcePalette;
    
    if (isBW) {
      sourcePalette = [
        new Paint(1442, "Neutral Grey N2", 67, 68, 68),
        new Paint(1443, "Neutral Grey N3", 84, 83, 83),
        new Paint(1444, "Neutral Grey N4", 102, 103, 102),
        new Paint(1445, "Neutral Grey N5", 123, 124, 124),
        new Paint(1446, "Neutral Grey N6", 151, 151, 149),
        new Paint(1447, "Neutral Grey N7", 173, 172, 170),
        new Paint(1448, "Neutral Grey N8", 201, 201, 198),
        new Paint(1010, "Bone Black", 10, 10, 10),
        new Paint(1040, "Carbon Black", 0, 0, 0),
        new Paint(1200, "Mars Black", 20, 20 , 20),
        new Paint(1380, "Titanium White", 250, 251, 245),
        new Paint(1415, "Zinc White", 242, 243, 240)
        ];
      } else {
        if (!masterPalette || masterPalette.length === 0) masterPalette = getPalette();
        sourcePalette = [...masterPalette];
      }
      
      let shuffled = [...sourcePalette].sort(() => random() - 0.5);
      palette = [];
      for (let i = 0; i < paletteSize; i++) {
        let p = shuffled[i % shuffled.length];
        palette.push({ paint: p, color: color(p.r, p.g, p.b) });
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
      
      let c = palette[index];
      if (paletteMode === "golden" && c.paint) c = c.color;
      fill(c);
      
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
  const swatchY = 455;
  const swatchSize = 15;

  fill(0);
  stroke(255, 0, 0);
  rect(panelX, panelY, panelWidth, height - 30);

  textSize(10);
  fill(255);
  noStroke();
  text("Palette:", swatchX, swatchY - 10);

  for (let i = 0; i < palette.length; i++) {
    let c, textStr;

    if (paletteMode === "golden" && palette[i].paint) {
      c = palette[i].color;
      textStr = `#${palette[i].paint.muns} ${palette[i].paint.name}`;
    } else {
      c = palette[i];
      textStr = `(${int(red(c))}, ${int(green(c))}, ${int(blue(c))})`;
    }

    fill(c);
    rect(swatchX, swatchY + i * 20, swatchSize, swatchSize);

    fill(255);
    noStroke();
    text(textStr, swatchX + swatchSize + 5, swatchY + i * 20 + 12);
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
  paletteModeDropdown.position(panelX + 10, panelY + 100);
  customWidthInput.position(panelX + 10, panelY + 40);
  customHeightInput.position(panelX + 10, panelY + 70);
  paletteSizeLabel.position(panelX + 10, panelY + 135);
  paletteSizeInput.position(panelX + 10, panelY + 148);
  pixelSizeLabel.position(panelX + 10, panelY + 185);
  pixelSizeInput.position(panelX + 110, panelY + 180);
  seedLabel.position(panelX + 10, panelY + 210);
  seedInput.position(panelX + 110, panelY + 205);
  generateNoiseButton.position(panelX + 10, panelY + 235);
  generateTextButton.position(panelX + 10, panelY + 265);
  pixelSortButton.position(panelX + 10, panelY + 295);
  saveTextButton.position(panelX + 10, panelY + 325);
  saveSVGButton.position(panelX + 10, panelY + 355);
  bwToggle.position(panelX + 10, panelY + 385);
  outlineToggle.position(panelX + 100, panelY + 385);

  textOutputDiv.position(20, 20);
  textOutputDiv.style('width', (panelX - 30) + 'px');
  textOutputDiv.style('height', (windowHeight - 60) + 'px');

  redraw();
}
