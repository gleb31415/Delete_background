import { useRef, useState } from 'react'
import './ImageUploader.css'

const ImageUploader = ({ onImageUpload }) => {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = (files) => {
    const file = files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setError('')
    
    // Create image object
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.onload = () => {
        onImageUpload({
          file,
          url: e.target.result,
          width: img.width,
          height: img.height
        })
      }
      img.src = e.target.result
    }

    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className="image-uploader">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={openFileSelector}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <h3>Drop your image here</h3>
          <p>or click to browse files</p>
          <div className="supported-formats">
            Supports: JPG, PNG, GIF, WEBP
          </div>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ImageUploader
