import os
from PIL import Image
import numpy as np

SRC = r"C:\Users\sandh\.gemini\antigravity-ide\brain\6efe2596-444b-48e9-8c4a-ddbcf156e1fd\.user_uploaded\media_1793011174515.png"
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT_DIR, "public", "images")
PROD_DIR = os.path.join(IMG_DIR, "products")

im_raw = Image.open(SRC).convert("RGB")
arr_raw = np.array(im_raw).astype(np.float32)

# Seamless white background
adj = np.clip(arr_raw * (255.0 / 252.0), 0, 255).astype(np.uint8)

mid = adj.shape[1] // 2
left_half = adj[:, :mid]
right_half = adj[:, mid:]

def process_object(obj_arr, target_height_ratio=0.883, canvas_w=1000, canvas_h=1000):
    mask = np.any(obj_arr < 252, axis=-1)
    ys, xs = np.where(mask)
    min_x, max_x = xs.min(), xs.max()
    min_y, max_y = ys.min(), ys.max()
    
    min_x = max(0, min_x - 1)
    max_x = min(obj_arr.shape[1] - 1, max_x + 1)
    min_y = max(0, min_y - 1)
    max_y = min(obj_arr.shape[0] - 1, max_y + 1)
    
    cropped = Image.fromarray(obj_arr[min_y:max_y+1, min_x:max_x+1])
    cw, ch = cropped.size
    
    target_h = int(canvas_h * target_height_ratio)
    scale = target_h / ch
    target_w = int(cw * scale)
    
    resized = cropped.resize((target_w, target_h), Image.LANCZOS)
    canvas = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))
    pos_x = (canvas_w - target_w) // 2
    pos_y = (canvas_h - target_h) // 2
    canvas.paste(resized, (pos_x, pos_y))
    return canvas

front_1000 = process_object(left_half, target_height_ratio=0.883, canvas_w=1000, canvas_h=1000)
back_1000 = process_object(right_half, target_height_ratio=0.883, canvas_w=1000, canvas_h=1000)
card_800 = process_object(left_half, target_height_ratio=0.905, canvas_w=800, canvas_h=600)

targets = [
    os.path.join(IMG_DIR, "1-cool-al-7000.webp"),
    os.path.join(IMG_DIR, "al-7000.webp"),
]
for p in targets:
    card_800.save(p, "WEBP", quality=95, method=6)
    print("Saved card:", p)

front_targets = [
    os.path.join(PROD_DIR, "1-cool-al-7000-front.webp"),
    os.path.join(PROD_DIR, "al-7000-front.webp"),
]
for p in front_targets:
    front_1000.save(p, "WEBP", quality=95, method=6)
    print("Saved front:", p)

back_targets = [
    os.path.join(PROD_DIR, "1-cool-al-7000-back.webp"),
    os.path.join(PROD_DIR, "al-7000-back.webp"),
]
for p in back_targets:
    back_1000.save(p, "WEBP", quality=95, method=6)
    print("Saved back:", p)

print("AL 7000 processing finished!")
