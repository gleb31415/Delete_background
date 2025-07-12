import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import ImageEditor from './components/ImageEditor'
import './App.css'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Delete Background Tool</h1>
        <p>Upload an image, place red dots on white areas, and remove unwanted backgrounds</p>
      </header>
      
      <main className="app-main">
        {!uploadedImage ? (
          <ImageUploader onImageUpload={setUploadedImage} />
        ) : (
          <ImageEditor 
            image={uploadedImage} 
            onReset={() => setUploadedImage(null)}
          />
        )}
      </main>
    </div>
  )
}

export default App
