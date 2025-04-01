# image_optimizer
![Home](https://github.com/user-attachments/assets/dbe1eff0-aaec-49e9-a909-ff0eda6493df)

## Index
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [JPEG Compression Algorithm](#jpeg-compression-algorithm)
- [License](#license)

## Overview
This project is an image optimization web application that allows users to upload images, compress them to different qualities, rotate them if needed, and download the optimized images. The backend is built with Flask, and the frontend is built with React.

## Features
- Upload images for optimization
- Compress images to different quality levels (25, 50, 75)
- Rotate images if not oriented correctly
- Download optimized images
- Display original and compressed image sizes

## Tech Stack
- React 18
- TailwindCSS
- Flask (Python)
- Scipy (Python)

## Setup Instructions

### Backend
1. **Navigate to the backend directory:**
   ```
   cd backend
   ```
   
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask server:**
   ```bash
   python app.py
   ```

### Frontend
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the React app:**
   ```bash
   npm start
   ```

## Usage
1. **Upload an Image:**
   - Navigate to the upload page.
   - Select an image to upload.

2. **Optimize Image:**
   - The app will automatically check the image size and determine if optimization is needed.
   - Click "OK" on the notification to start the compression process.

3. **Rotate Image:**
   - If the image is not oriented correctly, click the rotate icon on the image card to rotate it.

4. **Download Image:**
   - Click the download button to download the optimized image.
   - The app will navigate back to the home page after the download is complete.

## JPEG Compression Algorithm
1. **Parse the JPEG file**.
2. **Decode image data:** Transform the image into YCbCr format and compute the DCT.
3. **Quantize the coefficients:** Use standard quantization tables adjusted for the desired compression level.
4. **Re-encode the data:** Write the quantized coefficients back to a valid JPEG file.

## License
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
