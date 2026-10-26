import os
from PIL import Image
import numpy as np

MEDIA_SRC = r"C:\Users\sandh\.gemini\antigravity-ide\brain\6efe2596-444b-48e9-8c4a-ddbcf156e1fd\.user_uploaded\media_1793008273076.png"
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT_DIR, "public", "images")
PROD_DIR = os.path.join(IMG_DIR, "products")
os.makedirs(PROD_DIR, exist_ok=True)

im_raw = Image.open(MEDIA_SRC).convert("RGB")
arr_raw = np.array(im_raw).astype(np.float32)

# Adjust background to pure white while preserving soft shadows
# Pixels >= 252 become pure white (255)
adj = np.clip(arr_raw * (255.0 / 252.0), 0, 255).astype(np.uint8)

# Split left (Front) and right (Back)
left_half = adj[:, :512]
right_half = adj[:, 512:]

def process_pail(half_arr, target_height_ratio=0.885, canvas_w=1000, canvas_h=1000):
    # Find bounding box
    mask = np.any(half_arr < 252, axis=-1)
    ys, xs = np.where(mask)
    min_x, max_x = xs.min(), xs.max()
    min_y, max_y = ys.min(), ys.max()
    
    # Crop with 1px padding
    min_x = max(0, min_x - 1)
    max_x = min(half_arr.shape[1] - 1, max_x + 1)
    min_y = max(0, min_y - 1)
    max_y = min(half_arr.shape[0] - 1, max_y + 1)
    
    cropped = Image.fromarray(half_arr[min_y:max_y+1, min_x:max_x+1])
    cw, ch = cropped.size
    
    target_h = int(canvas_h * target_height_ratio)
    scale = target_h / ch
    target_w = int(cw * scale)
    
    # If width exceeds canvas, constrain by width
    if target_w > int(canvas_w * 0.90):
        scale = int(canvas_w * 0.90) / cw
        target_w = int(cw * scale)
        target_h = int(ch * scale)
        
    resized = cropped.resize((target_w, target_h), Image.LANCZOS)
    
    # Create canvas
    canvas = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))
    pos_x = (canvas_w - target_w) // 2
    pos_y = (canvas_h - target_h) // 2
    canvas.paste(resized, (pos_x, pos_y))
    return canvas

# 1. Front 1000x1000 (Modal view)
front_1000 = process_pail(left_half, target_height_ratio=0.883, canvas_w=1000, canvas_h=1000)
# 2. Back 1000x1000 (Modal view)
back_1000 = process_pail(right_half, target_height_ratio=0.883, canvas_w=1000, canvas_h=1000)

# 3. Card 800x600 (Front pail for shop/catalogue cards)
front_card = process_pail(left_half, target_height_ratio=0.905, canvas_w=800, canvas_h=600)

# Save images
targets = [
    (os.path.join(IMG_DIR, "gear-oil.webp"), front_card),
    (os.path.join(IMG_DIR, "1-cool-gear-oil.webp"), front_card),
    (os.path.join(PROD_DIR, "gear-oil-front.webp"), front_1000),
    (os.path.join(PROD_DIR, "gear-oil-back.webp"), back_1000),
    (os.path.join(PROD_DIR, "1-cool-gear-oil-front.webp"), front_1000),
    (os.path.join(PROD_DIR, "1-cool-gear-oil-back.webp"), back_1000),
]

for path, img in targets:
    img.save(path, "WEBP", quality=95, method=6)
    print(f"Saved: {os.path.relpath(path, ROOT_DIR)} - Size: {img.size}")

print("Processing complete!")
