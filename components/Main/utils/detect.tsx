import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import { renderBoxes } from "./renderBox";
import labels from "./labels.json";

const numClass = labels.length;

/**
 * Preprocess image / frame before forwarded into the model
 * @param {HTMLVideoElement|HTMLImageElement} source
 * @param {Number} modelWidth
 * @param {Number} modelHeight
 * @returns input tensor, xRatio and yRatio
 */
const preprocess = (source : any, modelWidth : any, modelHeight : any) => {
  let xRatio, yRatio; // ratios for boxes

  const input = tf.tidy(() => {
 
    const img = tf.browser.fromPixels(source);

    // padding image to square => [n, m] to [n, n], n > m
    const [h, w] = img.shape.slice(0, 2); // get source width and height
    const maxSize = Math.max(w, h); // get max size

    const imgPadded : tf.Tensor3D = img.pad([
      [0, maxSize - h], // padding y [bottom only]
      [0, maxSize - w], // padding x [right only]
      [0, 0],
    ]);

    xRatio = maxSize / w; // update xRatio
    yRatio = maxSize / h; // update yRatio

    return tf.image
      .resizeBilinear(imgPadded, [modelWidth, modelHeight]) // resize frame
      .div(255.0) // normalize
      .expandDims(0); // add batch
  });

  return [input, xRatio, yRatio];
};

/**
 * Function run inference and do detection from source.
 * @param {HTMLImageElement|HTMLVideoElement} source
 * @param {tf.GraphModel} model loaded YOLOv8 tensorflow.js model
 * @param {HTMLCanvasElement} canvasRef canvas reference
 * @param {VoidFunction} callback function to run after detection process
 */
export const detect = async (source : any, model : any, canvasRef : any) => {
  const [modelWidth, modelHeight] = model.inputShape.slice(1, 3); // get model width and height
  console.log({backend: tf.getBackend()});


  tf.engine().startScope(); // start scoping tf engine
  const [input, xRatio, yRatio] = preprocess(source, modelWidth, modelHeight); // preprocess image
  
  const res = model.net.execute(input); // inference model
  const transRes = res.transpose([0, 2, 1]); // transpose result [b, det, n] => [b, n, det]
  const boxes : any = tf.tidy(() => {
    const w = transRes.slice([0, 0, 2], [-1, -1, 1]); // get width
    const h = transRes.slice([0, 0, 3], [-1, -1, 1]); // get height
    const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)); // x1
    const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)); // y1
    return tf
      .concat(
        [
          y1,
          x1,
          tf.add(y1, h), //y2
          tf.add(x1, w), //x2
        ],
        2
      )
      .squeeze();
  }); // process boxes [y1, x1, y2, x2]

  const [scores, classes] = tf.tidy(() => {
    const rawScores = transRes.slice([0, 0, 4], [-1, -1, numClass]).squeeze(0); 
    return [rawScores.max(1), rawScores.argMax(1)];
  }); 

  const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.45, 0.65); // NMS to filter boxes

  const boxes_data = boxes.gather(nms, 0).dataSync(); 
  const scores_data = scores.gather(nms, 0).dataSync(); 
  const classes_data = classes.gather(nms, 0).dataSync(); 

  if(scores_data.length != 0) {//scores_data isn't empty
    const max_idx = scores_data.indexOf(Math.max(...scores_data)); // get max score index
    const max_box = boxes_data.slice(max_idx * 4, (max_idx + 1) * 4); // get max box
    const max_class = classes_data[max_idx]; // get max class
    renderBoxes(canvasRef, max_box, scores_data[max_idx], max_class, [xRatio, yRatio]); // render boxes
    tf.dispose([res, transRes, boxes, scores, classes, nms]); // clear memory
    tf.engine().endScope(); // end of scoping
    return [labels[max_class], scores_data[max_idx]]; // return class and score
  }
  else{
    const ctx = canvasRef.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas
    tf.dispose([res, transRes, boxes, scores, classes, nms]); // clear memory
    return ["", 0];
  }
  
};
