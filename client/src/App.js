import React, { useState } from 'react'
import './App.css'

const DragAndDrop = () => {
  const [dragging, setDragging] = useState(false);
  const [answer, setAnswer] = useState('')

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
          return response.text()
          // console.log(response.body)
        } else {
          throw new Error('Error uploading image');
        }
        })
        .then(data => {
          setAnswer('Our model predicts that your image is of type: ' + data)
          console.log(answer)
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
      <div>
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default DragAndDrop