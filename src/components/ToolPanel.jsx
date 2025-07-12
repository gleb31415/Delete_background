import './ToolPanel.css'

const ToolPanel = ({ onReset, onDownload, onNewImage, onAdvancedClean }) => {
  return (
    <div className="tool-panel">
      <button 
        className="tool-btn secondary"
        onClick={onReset}
        title="Reset to original image"
      >
        🔄 Reset
      </button>
      
      {onAdvancedClean && (
        <button 
          className="tool-btn advanced"
          onClick={onAdvancedClean}
          title="Remove all remaining light pixels (90%+ white)"
        >
          🧹 Deep Clean
        </button>
      )}
      
      <button 
        className="tool-btn primary"
        onClick={onDownload}
        title="Download processed image"
      >
        💾 Download PNG
      </button>
      
      <button 
        className="tool-btn secondary"
        onClick={onNewImage}
        title="Upload a new image"
      >
        📁 New Image
      </button>
    </div>
  )
}

export default ToolPanel
