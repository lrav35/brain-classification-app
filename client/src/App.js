import React, { useState, useRef, useEffect } from 'react'
import './App.css'


const Canvas = ({pixels, height, width}) => {
  const canvas = useRef();
  // const canvas = document.createElement("canvas");
  // const [url, setUrl] = useState('')
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
      
      // for (let i = 0; i < height*width*4; i += 4) {
      //   const pixelValue = 1-pixels[Math.floor(i / 4)];
        
      //   // set the pixel color based on the pixel value
      //   pixelData[i] = pixelValue * 255; // red
      //   pixelData[i + 1] = pixelValue * 255; // green
      //   pixelData[i + 2] = pixelValue * 255; // blue
      //   pixelData[i + 3] = 255; // alpha
      // }

        // // draw the ImageData object on the canvas
        // context.putImageData(imageData, 0, 0);

        // // get the image as a data URL
        // const dataUrl = canvas.toDataURL("imge/jpeg");
        // setUrl(dataUrl);

        context.putImageData(imageData, 0, 0);

        // console.log(context.imageData.data)
    }  
  });
  

  return <canvas ref={canvas} height={height} width={width} />;
}


// function ImageDataComponent({ imageData }) {
//   // const [imgSrc, setImgSrc] = useState(null)
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     // if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     // Set the canvas' size to match the image data
//     // canvas.width = imageData.width;
//     // canvas.height = imageData.height;
//     // Set the canvas' pixels to the image data
//     // ctx.putImageData(imageData, 0, 0);
//     // const imgData = new ImageData(imageData.data, imageData.width, imageData.height);
//     ctx.putImageData(imageData, 0, 0);
//     console.log('here')
//     // setImgSrc(x)
//   }, [imageData]);

//   // Create an img element with the canvas' data URL as the src attribute
  
//   // console.log(imgSrc)
//   const x = canvasRef.current ? canvasRef.current.toDataURL() : '';
//   console.log(canvasRef.current)

//   // if (!x) {
//   //   return <div>" "</div>
//   // }
//   return <img src={x} alt="Image" />;
// }




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
          console.log(data[0])
          // const img = new ImageData(512, 512)
          // img.data.set(data)
          
          // console.log(img)
          setImgData(data)
          // console.log(answer)
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