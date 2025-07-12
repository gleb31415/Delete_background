import { useRef, useEffect, useState } from 'react'
import ToolPanel from './ToolPanel'
import './ImageEditor.css'

const ImageEditor = ({ image, onReset }) => {
  const canvasRef = useRef(null)
  const [canvasContext, setCanvasContext] = useState(null)
  const [originalImageData, setOriginalImageData] = useState(null)
  const [currentImageData, setCurrentImageData] = useState(null)
  const [canvasScale, setCanvasScale] = useState(1)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    setCanvasContext(ctx)

    // Load and draw the image
    const img = new Image()
    img.onload = () => {
      // Calculate canvas size to fit the image while maintaining aspect ratio
      const maxWidth = 801
      const maxHeight = 601
      
      let { width, height } = img
      const scale = Math.min(maxWidth / width, maxHeight / height, 1)
      
      width *= scale
      height *= scale
      
      canvas.width = width
      canvas.height = height
      
      // Draw the image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Store original image data
      const imageData = ctx.getImageData(0, 0, width, height)
      setOriginalImageData(imageData)
      setCurrentImageData(new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
      ))
      
      setCanvasScale(scale)
    }
    img.src = image.url
  }, [image])

  const handleCanvasClick = (e) => {
    if (!canvasContext || !currentImageData) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor(e.clientX - rect.left)
    const y = Math.floor(e.clientY - rect.top)

    // Draw red dot at click position
    canvasContext.fillStyle = '#ff0000'
    canvasContext.beginPath()
    canvasContext.arc(x, y, 5, 0, 2 * Math.PI)
    canvasContext.fill()

    // Remove white pixels connected to this point
    removeWhitePixels(x, y)
  }

  const removeWhitePixels = (startX, startY) => {
    if (!currentImageData) return

    const { data, width, height } = currentImageData
    const visited = new Set()
    const stack = [{ x: startX, y: startY }]

    // Check if a pixel is 95%+ white (more aggressive detection)
    const isWhitePixel = (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return false
      
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      const a = data[index + 3]
      
      // Skip already transparent pixels
      if (a === 0) return false
      
      // Calculate brightness percentage (0-100)
      const brightness = (r + g + b) / (3 * 255) * 100
      
      // Check if pixel is 95%+ white
      // Also check individual RGB values are high (≥ 240)
      const isVeryBright = brightness >= 95
      const isHighRGB = r >= 240 && g >= 240 && b >= 240
      
      return isVeryBright && isHighRGB && a > 200
    }

    // Enhanced flood fill algorithm with 8-directional connectivity
    while (stack.length > 0) {
      const { x, y } = stack.pop()
      const key = `${x},${y}`
      
      if (visited.has(key) || !isWhitePixel(x, y)) continue
      
      visited.add(key)
      
      // Make pixel transparent
      const index = (y * width + x) * 4
      data[index + 3] = 0 // Set alpha to 0 (transparent)
      
      // Add 8-directional neighbors (including diagonals for better coverage)
      const neighbors = [
        { x: x + 1, y },     // right
        { x: x - 1, y },     // left
        { x, y: y + 1 },     // down
        { x, y: y - 1 },     // up
        { x: x + 1, y: y + 1 }, // bottom-right
        { x: x - 1, y: y + 1 }, // bottom-left
        { x: x + 1, y: y - 1 }, // top-right
        { x: x - 1, y: y - 1 }  // top-left
      ]
      
      neighbors.forEach(neighbor => {
        const neighborKey = `${neighbor.x},${neighbor.y}`
        if (!visited.has(neighborKey)) {
          stack.push(neighbor)
        }
      })
    }

    // Second pass: Clean up isolated nearly-white pixels
    cleanupIsolatedWhitePixels()

    // Update canvas with modified image data
    canvasContext.putImageData(currentImageData, 0, 0)
  }

  // Additional cleanup method for isolated white pixels
  const cleanupIsolatedWhitePixels = () => {
    if (!currentImageData) return

    const { data, width, height } = currentImageData
    const pixelsToClean = []

    // Scan for remaining white-ish pixels
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]

        if (a === 0) continue // Skip already transparent

        // Check if pixel is light (90%+ white)
        const brightness = (r + g + b) / (3 * 255) * 100
        
        if (brightness >= 90 && r >= 230 && g >= 230 && b >= 230) {
          // Check surrounding pixels - if most are transparent, remove this one too
          let transparentNeighbors = 0
          const totalNeighbors = 8

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue
              
              const nx = x + dx
              const ny = y + dy
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIndex = (ny * width + nx) * 4
                if (data[nIndex + 3] === 0) {
                  transparentNeighbors++
                }
              }
            }
          }

          // If 50% or more neighbors are transparent, mark for removal
          if (transparentNeighbors >= totalNeighbors * 0.5) {
            pixelsToClean.push(index)
          }
        }
      }
    }

    // Clean up the marked pixels
    pixelsToClean.forEach(index => {
      data[index + 3] = 0 // Make transparent
    })
  }

  const resetImage = () => {
    if (originalImageData && canvasContext) {
      const newImageData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
      )
      setCurrentImageData(newImageData)
      canvasContext.putImageData(newImageData, 0, 0)
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'processed-image.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const performAdvancedClean = () => {
    if (!currentImageData || !canvasContext) return

    const { data, width, height } = currentImageData
    let pixelsRemoved = 0

    // More aggressive cleaning: remove all pixels that are 90%+ white
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]

        if (a === 0) continue // Skip already transparent

        // Calculate brightness and color uniformity
        const brightness = (r + g + b) / (3 * 255) * 100
        const colorVariance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b)

        // Remove if:
        // 1. Brightness is 90%+ AND
        // 2. Colors are uniform (low variance) AND
        // 3. All RGB values are high
        if (brightness >= 90 && colorVariance < 30 && r >= 220 && g >= 220 && b >= 220) {
          data[index + 3] = 0 // Make transparent
          pixelsRemoved++
        }
      }
    }

    // Update canvas
    canvasContext.putImageData(currentImageData, 0, 0)
    
    console.log(`Advanced clean removed ${pixelsRemoved} additional pixels`)
  }

  return (
    <div className="image-editor">
      <div className="editor-header">
        <h2>Advanced White Background Removal</h2>
        <ToolPanel 
          onReset={resetImage}
          onDownload={downloadImage}
          onNewImage={onReset}
          onAdvancedClean={performAdvancedClean}
        />
      </div>
      
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="editing-canvas"
        />
      </div>
      
      <div className="instructions">
        <p>🔴 Click on any white/light area to place a red dot and remove all connected pixels</p>
        <p>🎯 Advanced detection: Removes pixels that are 95%+ white with high precision</p>
        <p>🧹 Multi-pass cleanup: Automatically removes isolated light pixels for clean results</p>
        <p>💾 Download your processed image when you're done</p>
      </div>
    </div>
  )
}

export default ImageEditor
