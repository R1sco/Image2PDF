import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './ImageConverter.css';

const ImageConverter = () => {
  // State for tracking the selected file, filename, and loading state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [customFileName, setCustomFileName] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setError('');
    } else {
      setSelectedFile(null);
      setFileName('No file chosen');
    }
  };

  // Handle custom filename input
  const handleFileNameChange = (event) => {
    setCustomFileName(event.target.value);
  };

  // Convert image to PDF
  const convertImageToPdf = () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsConverting(true);
    setError('');

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        try {
          // Create new jsPDF instance
          const pdf = new jsPDF();
          
          // Calculate dimensions to fit the image on the PDF page
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (img.height * imgWidth) / img.width;
          
          // Add image to PDF
          pdf.addImage(img.src, 'PNG', 0, 0, imgWidth, imgHeight);
          
          // Get custom file name or use default
          const outputFileName = customFileName.trim() ? 
              (customFileName.endsWith('.pdf') ? customFileName : customFileName + '.pdf') : 
              'output.pdf';
          
          // Save the PDF with custom name
          pdf.save(outputFileName);
          console.log('PDF created and saved successfully as: ' + outputFileName);
          setIsConverting(false);
        } catch (error) {
          console.error('Error creating PDF:', error);
          setError('Error creating PDF: ' + error.message);
          setIsConverting(false);
        }
      };

      img.onerror = () => {
        console.error('Error loading image');
        setError('Error: Could not load the image.');
        setIsConverting(false);
      };
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setError('Error reading file: ' + error.message);
      setIsConverting(false);
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="converter-container">
      {/* File input for selecting image with custom styling */}
      <div className="file-input-container">
        <input 
          type="file" 
          id="imageInput" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <label htmlFor="imageInput" className="file-input-label">
          Choose File
        </label>
        <div className="file-name">{fileName}</div>
      </div>
      
      {/* Custom filename input */}
      <div className="filename-input-container">
        <input 
          type="text" 
          id="customFileName" 
          placeholder="Enter custom file name (optional)" 
          value={customFileName}
          onChange={handleFileNameChange}
        />
      </div>
      
      {/* Convert button */}
      <button 
        className={`convert-btn ${isConverting ? 'converting' : ''}`} 
        onClick={convertImageToPdf}
        disabled={isConverting}
      >
        {isConverting ? 'Converting...' : 'Convert to PDF'}
      </button>

      {/* Error message display */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ImageConverter;