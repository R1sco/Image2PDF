import React from 'react';
import './App.css';
import ImageConverter from './components/ImageConverter';

function App() {
  return (
    <div className="App">
      <h1>Image to PDF Converter</h1>
      <ImageConverter />
      <div className="author-credit">Created by Risco</div>
    </div>
  );
}

export default App;