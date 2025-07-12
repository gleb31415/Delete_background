<<<<<<< HEAD
# Delete_background
=======
# Delete Background Tool

A React-based image editing tool that allows users to upload images, place red dots on white areas, and remove all pure white pixels connected to the selected area.

## Features

- 🖼️ **Image Upload**: Drag and drop or click to upload images (JPG, PNG, GIF, WEBP)
- 🔴 **Red Dot Placement**: Click on white areas to place red dots
- 🗑️ **White Pixel Removal**: Automatically removes all pure white pixels connected to the red dot area
- 💾 **Image Download**: Download the processed image as PNG
- 🔄 **Reset Functionality**: Reset to original image or upload a new one
- 📱 **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Upload an Image**: Drag and drop an image file or click to browse
2. **Place Red Dots**: Click on any white area you want to remove
3. **Remove Background**: The tool automatically removes all connected white pixels
4. **Download Result**: Save your processed image as a PNG file

## Technical Details

- Built with **React + Vite** for fast development and performance
- Uses **HTML5 Canvas** for image manipulation
- Implements **flood fill algorithm** for connected white pixel removal
- Detects pure white pixels (RGB: 255, 255, 255) as removal targets
- Non-white pixels act as boundaries and won't be removed

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ImageUploader.jsx     # File upload component
│   ├── ImageUploader.css
│   ├── ImageEditor.jsx       # Main canvas editing component
│   ├── ImageEditor.css
│   ├── ToolPanel.jsx         # Control buttons
│   └── ToolPanel.css
├── App.jsx                   # Main application component
├── App.css
├── index.css                 # Global styles
└── main.jsx                  # Application entry point
```

## Algorithm

The tool uses a flood fill algorithm to remove white pixels:

1. User clicks on a white area
2. A red dot is placed at the click position
3. The algorithm checks if the clicked pixel is pure white (RGB: 255, 255, 255)
4. If true, it recursively removes all connected white pixels
5. Non-white pixels act as boundaries and stop the removal process
6. Removed pixels become transparent (alpha = 0)

## Browser Compatibility

- Modern browsers with HTML5 Canvas support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

MIT License+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 8ce90de (videcode)
