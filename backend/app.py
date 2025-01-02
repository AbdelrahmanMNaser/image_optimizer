from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from utils import detect_image_extension, rotate_image, get_file_size
from jpg_compress import JPEGCompressor


app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'

# Create directories if they don't exist
for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

@app.route('/detect', methods=['POST'])
def detect_extension():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if not file:
        return jsonify({'error': 'Invalid file'}), 400

    filename = secure_filename(file.filename)
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(input_path)
    
    try:
        extension, is_valid = detect_image_extension(input_path)
        return jsonify({
            'success': True,
            'extension': extension,
            'is_valid': is_valid
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/check-size', methods=['POST'])
def check_file_size():
    try:
        # Ensure 'filename' exists in the request
        if 'filename' not in request.form:
            app.logger.error("Filename is missing in the request payload.")
            return jsonify({'error': 'Filename is required in the request payload.'}), 400

        # Retrieve filename from the request
        filename = request.form['filename']
        app.logger.info(f"Received filename: {filename}")

        # Construct the file path
        input_path = os.path.join(UPLOAD_FOLDER, filename)

        # Check if the file exists
        if not os.path.exists(input_path):
            app.logger.error(f"File not found: {input_path}")
            return jsonify({'error': f"File '{filename}' not found on the server."}), 404

        # Calculate file size and determine if optimization is needed
        file_size, needs_optimization = get_file_size(input_path)

        # Success response
        app.logger.info(f"File size check successful for {filename}: {file_size} bytes.")
        return jsonify({
            'success': True,
            
            'file_size': round(float(file_size), 2),
            'needs_optimization': needs_optimization
        })

    except Exception as e:
        # Log and return internal server error
        app.logger.error(f"An error occurred in /check-size: {str(e)}")
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/compress', methods=['POST'])
def compress():
    if 'filename' not in request.files and 'filename' not in request.form:
        return jsonify({'error': 'No file provided'}), 400

    filename = request.files.get('filename') or request.form.get('filename')
    name, ext = os.path.splitext(filename)
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    
    if not os.path.exists(input_path):
        return jsonify({'error': 'Original file not found'}), 404

    results = {}
    qualities = [25, 50, 75]
    
    for quality in qualities:
        output_filename = f'{name}_compressed_q{quality}{ext}'
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        
        # Create compressor and compress
        if ext.lower() in ['.jpg', '.jpeg']:
            compressor = JPEGCompressor(quality=quality)
            compressor.compress(input_path, output_path)
            
            # Get file sizes
            original_size = os.path.getsize(input_path)
            compressed_size = os.path.getsize(output_path)
            
            results[quality] = {
                'compressed_url': f'/outputs/{output_filename}',
                'original_size': original_size,
                'compressed_size': compressed_size,
                'compression_ratio': round((1 - compressed_size/original_size) * 100, 2),
                'quality': quality
            }
    
    return jsonify({
        'success': True,
        'results': results
    })
        


@app.route('/rotate', methods=['POST'])
def rotate_image_endpoint():
    if 'image' not in request.files and 'image' not in request.form:
        return jsonify({'error': 'No image provided'}), 400
    
    filename = request.files.get('image') or request.form.get('image')
    name, ext = os.path.splitext(filename)
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    output_filename = f'{name}_compressed_rotated{ext}'
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    
    if not os.path.exists(input_path):
        return jsonify({'error': 'Original file not found'}), 404
    
    try:
        # Rotate image 90 degrees clockwise
        rotate_image(input_path, output_path)
        
        return jsonify({
            'success': True,
            'rotated_url': f'/outputs/{output_filename}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500



@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/outputs/<filename>')
def serve_output(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)