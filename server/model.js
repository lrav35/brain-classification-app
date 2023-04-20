const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');

async function loadModel() {
    const modelPath = path.resolve('./final_unet_model_js/model.json');
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('Model loaded successfully');
    return model;
  }

module.exports = { loadModel };

