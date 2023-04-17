const express = require('express');
const bodyparser = require('body-parser');
const tf = require('@tensorflow/tfjs-node');
const app = express();
app.use(bodyparser.json());
const { loadModel } = require("./model")
const { createCanvas, loadImage } = require('canvas');

// app.get("/api", (req,res) => {
//     res.json({"users": ["hello", "world"] })
// })

let model;
let result;
let answerKey = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
"Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"];
const hemorrhages = ['epidural', 'intraparenchymal', 'subarachnoid', 'subdural', 'multiple', 'normal']
// need to check what the model outputs and if it will be in the same format
loadModel().then((m) => {
    model = m;
  });

function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

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
              const red = pixelData[index];
              const green = pixelData[index + 1];
              const blue = pixelData[index + 2];
            //   const alpha = pixelData[index + 3];
            //   const grayScale = (red + green + blue) / 3;
            //   row.push(grayScale);
              const rgb = [red, green, blue];
              row.push(rgb);
            }
            pixelArray.push(row);
          }

        
        // add a dimension in the 0 index for model
        let tensor = tf.tensor3d(pixelArray).expandDims(0);
        tensor = tf.image.resizeBilinear(tensor, [256, 256]);
        console.log(tensor)
        console.log(hemorrhages[6])

        const pred = await model.predict(tensor);
        console.log(pred)
        await pred.data().then(data => {
            console.log(data)
            console.log(Array.from(data))
            result = argMax(Array.from(data))
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
        console.log(hemorrhages[result])
        res.status(200).send(hemorrhages[result])
    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
  });

app.listen(5000, () => { console.log("server is listening on port 5000") })