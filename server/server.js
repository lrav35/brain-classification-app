const express = require('express');
const bodyparser = require('body-parser');
const tf = require('@tensorflow/tfjs-node');
const app = express();
app.use(bodyparser.json());
const { loadModel } = require("./model")
const { createCanvas, loadImage } = require('canvas');


let model;
let result;
const hemorrhages = ['epidural', 'intraparenchymal', 'subarachnoid', 'subdural', 'multiple', 'normal']
loadModel().then((m) => {
    model = m;
  });


async function getData(req) {
    try {
        const canvas = createCanvas();
        const ctx = canvas.getContext('2d');
        const img = await loadImage(req.body.image);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;

        const width = canvas.width;
        const height = canvas.height;
        const pixelArray = [];

        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
              const index = (y * width + x) * 4;
              const red = pixelData[index] / 255;
              const green = pixelData[index + 1] / 255;
              const blue = pixelData[index + 2] / 255;
              const rgb = [red, green, blue];
              row.push(rgb);
            }
            pixelArray.push(row);
          }
        console.log(pixelArray)

        
        // add a dimension in the 0 index for model
        let tensor = tf.tensor3d(pixelArray).expandDims(0);
        const pred = await model.predict(tensor);
      
        await pred.data().then(data => {
            const imageData = [];
            for (let i = 0; i < data.length; i++) {
                imageData[i] = (data[i] > 0.2105) ? 1 : 0;
            }
            result = imageData;          
            }
        )
    } catch (error) {
      console.error(error);
    }
  }


app.post('/upload-image', async (req, res) => {

    try {
        const data = await new Promise((resolve, reject) => {
            const returnValue = getData(req);
            resolve(returnValue);
        });
        console.log(typeof result)
        res.status(200).send(result)
    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
  });

app.listen(5000, () => { console.log("server is listening on port 5000") })