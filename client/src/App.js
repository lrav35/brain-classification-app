import React, { useState, useRef, useEffect } from 'react'
import './App.css'

const Canvas = ({pixels, height, width}) => {
  const canvas = useRef();
  
  console.log(pixels)

  useEffect(() => {
    
    const context = canvas.current.getContext("2d");
    const imageData = context.createImageData(height, width);
    const pixelData = imageData.data;
    
    if(pixels){
      for (let i = 0; i < 262144; i++) {
        const value = pixels[i] ? 255 : 0; // If the value is 1, set it to 255 (white), otherwise set it to 0 (black)
        const j = i * 4; // Each pixel has four values (RGBA), so we need to multiply the index by 4
        pixelData[j] = value; // Set the red channel
        pixelData[j + 1] = value; // Set the green channel
        pixelData[j + 2] = value; // Set the blue channel
        pixelData[j + 3] = 255; // Set the alpha channel to 255 (fully opaque)
      }
      
      context.putImageData(imageData, 0, 0);
    }  
  });
  

  return <canvas ref={canvas} height={height} width={width} />;
}



const DragAndDrop = () => {
  const [dragging, setDragging] = useState(false);
  const [imgData, setImgData] = useState(null)

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result;
      fetch('/upload-image', {
        method: 'POST',
        body: JSON.stringify({ image }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          console.log(response)
          return response.json()
          // console.log(response.body)
        } else {
          throw new Error('Error uploading image');
        }
        })
        .then(data => {
          setImgData(data)
        })
        .catch(error => {
          console.error(error);
        });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className='drag-and-drop'
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={dragging ? 'drop-area.active' : 'drop-area'}>
        <p>Drop your image here</p>
      </div>
      <Canvas pixels={imgData} height={512} width={512} />
    </div>
    
  )
}

export default DragAndDrop