# TXT_Noise

**TXT_Noise** is a generative visual tool that creates grid-based Perlin noise patterns using a random color palette. It includes UI controls for customizing resolution (canvas size), palette size, and various rendering options, with text-based output support.

### Features

- Perlin noise-based pattern generation
- Customizable grid resolution (width × height)
- Adjustable palette size and colors
- Black-and-white and outline toggle modes
- Pixel sort effect
- Generate and display text output
- Export visuals or pattern data

### Controls

- **Size dropdown**: Select from preset or custom grid sizes  
- **Palette size input**: Number of colors used in the pattern  
- **Generate Noise**: Regenerate Perlin pattern and palette  
- **Generate Text**: Display grid data as text output  
- **Pixel Sort**: Vertically sort each column by palette index  
- **BW Toggle**: Enable grayscale palette  
- **Outline Toggle**: Draw outlines between grid cells  
- **Size Input**: Adjust cell size dynamically  

### How it Works

- A palette of random colors (or grayscale) is generated.
- Perlin noise is sampled for each grid cell.
- Noise values are mapped to palette indices.
- All visual and text output responds to user input in real time.

### File Output

- Text output is displayed on-screen
- `Save Text` button allows download (if enabled)

### Credits

Developed by **Brandon A. Dalmer**, 2025  
http://www.badalmer.com
