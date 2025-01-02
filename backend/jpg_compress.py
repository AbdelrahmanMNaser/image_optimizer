import numpy as np
from PIL import Image
from scipy.fftpack import dct, idct
from pathlib import Path

class JPEGCompressor:
    def __init__(self, quality):
        self.quality = self._validate_quality(quality)
        self.qtable = self._get_quantization_table()
        
    @staticmethod
    def _validate_quality(quality):
        if not isinstance(quality, (int, float)) or quality < 1 or quality > 100:
            raise ValueError("Quality must be between 1 and 100")
        return quality
    
    def _get_quantization_table(self):
        qtable = np.array([
            [16, 11, 10, 16, 24, 40, 51, 61],
            [12, 12, 14, 19, 26, 58, 60, 55],
            [14, 13, 16, 24, 40, 57, 69, 56],
            [14, 17, 22, 29, 51, 87, 80, 62],
            [18, 22, 37, 56, 68, 109, 103, 77],
            [24, 35, 55, 64, 81, 104, 113, 92],
            [49, 64, 78, 87, 103, 121, 120, 101],
            [72, 92, 95, 98, 112, 100, 103, 99]
        ])
        
        scale = 100 - self.quality
        if self.quality < 50:
            scale = 5000 / self.quality
        return np.floor((qtable * scale + 50) / 100)

    @staticmethod
    def _split_into_blocks(image_array):
        height, width, channels = image_array.shape
        blocks = []
        for i in range(0, height, 8):
            for j in range(0, width, 8):
                block = image_array[i:i+8, j:j+8]
                if block.shape[0] != 8 or block.shape[1] != 8:
                    padded = np.zeros((8, 8, channels))
                    padded[:block.shape[0], :block.shape[1]] = block
                    block = padded
                blocks.append(block)
        return blocks

    @staticmethod
    def _dct2d(block):
        return dct(dct(block.T, norm='ortho').T, norm='ortho')

    @staticmethod
    def _idct2d(block):
        return idct(idct(block.T, norm='ortho').T, norm='ortho')

    def compress(self, image_path, output_path=None):
        try:
            img = Image.open(image_path)
            img_array = np.array(img)
        except Exception as e:
            raise IOError(f"Error loading image: {e}")

        blocks = self._split_into_blocks(img_array)
        compressed_blocks = []
        
        for block in blocks:
            dct_blocks = np.zeros_like(block, dtype=float)
            for channel in range(block.shape[2]):
                dct_block = self._dct2d(block[:,:,channel])
                quantized = np.round(dct_block / self.qtable)
                dequantized = quantized * self.qtable
                idct_block = self._idct2d(dequantized)
                dct_blocks[:,:,channel] = idct_block
            
            compressed_blocks.append(np.clip(dct_blocks, 0, 255).astype(np.uint8))

        height, width, _ = img_array.shape
        compressed = np.zeros_like(img_array)
        block_idx = 0
        
        for i in range(0, height, 8):
            for j in range(0, width, 8):
                h = min(8, height - i)
                w = min(8, width - j)
                compressed[i:i+h, j:j+w] = compressed_blocks[block_idx][:h,:w]
                block_idx += 1

        if output_path is None:
            input_path = Path(image_path)
            output_path = str(input_path.with_stem(f"{input_path.stem}_compressed_q{self.quality}"))
        
        Image.fromarray(compressed).save(output_path, quality=self.quality)
        return output_path
