<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Project: Delete Background Tool

This is a React-based image editing tool that allows users to:
1. Upload images
2. Place red dots on white areas
3. Remove all pure white pixels connected to the red dot area
4. Download the processed image

## Technical Details:
- Built with React + Vite
- Uses HTML5 Canvas for image manipulation
- Implements flood fill algorithm for white pixel removal
- Modern UI with drag-and-drop file upload
- Pure white pixel detection (RGB: 255, 255, 255)
- Canvas-based image editing and processing

## Key Components:
- ImageUploader: Handles file upload and validation
- ImageEditor: Main canvas component for image editing
- ToolPanel: Controls for actions and downloads

When writing code for this project, focus on:
- Canvas performance optimization
- Image processing accuracy
- User-friendly interface
- Proper error handling for image operations
