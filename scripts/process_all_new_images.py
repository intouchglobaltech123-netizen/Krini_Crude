import os
from PIL import Image
import numpy as np

MEDIA_DIR = r"C:\Users\sandh\.gemini\antigravity-ide\brain\6efe2596-444b-48e9-8c4a-ddbcf156e1fd\.user_uploaded"
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT_DIR, "public", "images")
PROD_DIR = os.path.join(IMG_DIR, "products")
os.makedirs(PROD_DIR, exist_ok=True)

def process_object(obj_arr, target_height_ratio=0.885, canvas_w=1000, canvas_h=1000):
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
    
    if target_w > int(canvas_w * 0.90):
        scale = int(canvas_w * 0.90) / cw
        target_w = int(cw * scale)
        target_h = int(ch * scale)
        
    resized = cropped.resize((target_w, target_h), Image.LANCZOS)
    
    canvas = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))
    pos_x = (canvas_w - target_w) // 2
    pos_y = (canvas_h - target_h) // 2
    canvas.paste(resized, (pos_x, pos_y))
    return canvas

# 1. Pails processor
def process_pail_image(filename, slug, alias_slugs=[]):
    p = os.path.join(MEDIA_DIR, filename)
    im_raw = Image.open(p).convert("RGB")
    arr_raw = np.array(im_raw).astype(np.float32)
    adj = np.clip(arr_raw * (255.0 / 252.0), 0, 255).astype(np.uint8)
    
    mid = adj.shape[1] // 2
    left_half = adj[:, :mid]
    right_half = adj[:, mid:]
    
    front_1000 = process_object(left_half, target_height_ratio=0.883, canvas_w=1000, canvas_h=1000)
    back_1000 = process_object(right_half, target_height_ratio=0.883, canvas_w=1000, canvas_h=1000)
    card_800 = process_object(left_half, target_height_ratio=0.905, canvas_w=800, canvas_h=600)
    
    all_slugs = [slug] + alias_slugs
    for s in all_slugs:
        card_p = os.path.join(IMG_DIR, f"{s}.webp")
        card_800.save(card_p, "WEBP", quality=95, method=6)
        front_p = os.path.join(PROD_DIR, f"{s}-front.webp")
        front_1000.save(front_p, "WEBP", quality=95, method=6)
        back_p = os.path.join(PROD_DIR, f"{s}-back.webp")
        back_1000.save(back_p, "WEBP", quality=95, method=6)
        print(f"Pail [{s}] saved card, front, back")

# 2. Spray can processor
def process_spray_can_image(filename, slug):
    p = os.path.join(MEDIA_DIR, filename)
    im_raw = Image.open(p).convert("RGB")
    arr_raw = np.array(im_raw).astype(np.float32)
    adj = np.clip(arr_raw * (255.0 / 252.0), 0, 255).astype(np.uint8)
    
    # Split between can 1 and can 2 around x=515
    left_can = adj[:, :515]
    right_can = adj[:, 515:]
    
    front_1000 = process_object(left_can, target_height_ratio=0.894, canvas_w=1000, canvas_h=1000)
    back_1000 = process_object(right_can, target_height_ratio=0.894, canvas_w=1000, canvas_h=1000)
    card_800 = process_object(left_can, target_height_ratio=0.893, canvas_w=800, canvas_h=600)
    
    card_p = os.path.join(IMG_DIR, f"{slug}.webp")
    card_800.save(card_p, "WEBP", quality=95, method=6)
    front_p = os.path.join(PROD_DIR, f"{slug}-front.webp")
    front_1000.save(front_p, "WEBP", quality=95, method=6)
    back_p = os.path.join(PROD_DIR, f"{slug}-back.webp")
    back_1000.save(back_p, "WEBP", quality=95, method=6)
    print(f"Spray can [{slug}] saved card, front, back")

# Execute all 5
print("Processing 1: Release Spray...")
process_spray_can_image("media_1793010099841.png", "release-spray")

print("Processing 2: 1-COOL Grease...")
process_pail_image("media_1793010111611.png", "1-cool-grease", ["greases"])

print("Processing 3: 1-COOL AL 7000...")
process_pail_image("media_1793010121266.png", "1-cool-al-7000")

print("Processing 4: 1-COOL Cutting Oil...")
process_pail_image("media_1793010131183.png", "cutting-oil", ["1-cool-cutting-oil"])

print("Processing 5: 1-COOL Engine Oil...")
process_pail_image("media_1793010140546.png", "engine-oil", ["1-cool-engine-oil"])

print("All 5 products processed successfully!")
