from PIL import Image
import os

def detect_image_extension(image_path):
    valid_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')
    extension = image_path.lower().split('.')[-1]
    normalized_extension = f'.{extension}'
    is_valid = normalized_extension in valid_extensions
    return normalized_extension, is_valid

def rotate_image(image_path, output_path):
    """Rotate image 90 degrees clockwise"""
    try:
        img = Image.open(image_path)
        rotated_img = img.rotate(-90, expand=True)  # negative for clockwise
        rotated_img.save(output_path)
        return True
    except Exception as e:
        raise Exception(f"Error rotating image: {e}")
    
def get_file_size(image_path):
    """Get file size in bytes and check if needs optimization"""
    size = os.path.getsize(image_path)
    Size_inkb = size/1024
    print(f"File size: {size} bytes")
    needs_optimization = size > 2 * 1024 * 1024  # 2MB threshold
    return size, needs_optimization

def open_image(image_path):
    img = Image.open(image_path)
    return img, img.size

def save_image(img, output_path):
    img.save(output_path, optimize=True)