# Shankara Vision
<p align="center">
  <img src="public/shankaralogo.png" title="shankara">
</p>

Shankara Vision is an open-source application that helps people who have trouble with hearing using Sign Language.

## Overview
<p align="center">
  <img src="public/detection.png">
</p>

There are more than 900 thousand Indonesians who have difficulty hearing according to the Indonesian Central Statistics Agency (BPSI) in 2022. This app based on [American Sign Language(ASL)](https://www.nidcd.nih.gov/health/american-sign-language) and utilizes a Deep Convolutional Neural Network (CNN) to detect sign language. The app is deployed on a website platform. 

## Run It Locally
1. Clone this repository
2. Change directory to the cloned repo
3. Make sure [NodeJS(v18.17.1)](https://nodejs.org/en) and npm(9.6.7) is installed
4. Open your local terminal, run `npm install` for installing dependencies
5. Run the development server with `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stacks
- [Numpy](https://numpy.org/)
- [OpenCV](https://opencv.org/)
- [Pytorch](https://pytorch.org/)
- [YOLOv8 by Ultralytics](https://github.com/ultralytics/ultralytics)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Chakra-UI](https://chakra-ui.com/)
- [ONNXRunTime](https://onnxruntime.ai/)

## Room for Improvement
- Use various datasets to enhance accuracy and performance
- Consider using a different CNN model alongside YOLOv8
- Enhance app performance through object tracking instead of object detection
- Explore development for other platforms such as Android or embedded devices (for ex: Raspberry Pi)

## Paper reference

[UAV Detection using Web Application Approach based on SSD Pre-Trained Model](https://ieeexplore.ieee.org/document/9665191)
[A Web-Based Application for Identifying Objects In Images: Object Recognition Software](https://ieeexplore.ieee.org/document/8932735)
[TensorFlow.js: Machine Learning for the Web and Beyond](https://arxiv.org/abs/1901.05350)
[You Only Look Once: Unified, Real-Time Object Detection](https://pjreddie.com/media/files/papers/yolo_1.pdf)
[A survey on Image Data Augmentation for Deep Learning](https://journalofbigdata.springeropen.com/articles/10.1186/s40537-019-0197-0?ref=blog.roboflow.com)


## Author
Team LATS(Look At The Stars)

