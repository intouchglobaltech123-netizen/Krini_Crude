import os
from PIL import Image
import numpy as np

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")
PROD_DIR = os.path.join(OUT_DIR, "products")
os.makedirs(PROD_DIR, exist_ok=True)

MEDIA_DIR = r"C:\Users\sandh\.gemini\antigravity-ide\brain\db317170-28e5-4262-8b8c-3376cdbc9f78\.user_uploaded"

ITEMS = [
    {
        "name": "galva-zinc-spray",
        "aliases": ["vibrant-galva-zinc-spray"],
        "src": os.path.join(MEDIA_DIR, "media_1792727685131.png")
    },
    {
        "name": "any-ral-shades",
        "aliases": ["vibrant-any-ral-shades"],
        "src": os.path.join(MEDIA_DIR, "media_1792727868260.png")
    },
    {
        "name": "relese-anti-spatter-spray",
        "aliases": ["anti-spatter-spray"],
        "src": os.path.join(MEDIA_DIR, "media_1792728085057.png")
    }
]

def crop_tight_object(im_half):
    arr = np.array(im_half)
    mask = (arr[:, :, 0] < 250) | (arr[:, :, 1] < 250) | (arr[:, :, 2] < 250)
    ys, xs = np.where(mask)
    if len(xs) == 0 or len(ys) == 0:
        return im_half
    min_x, max_x = xs.min(), xs.max()
    min_y, max_y = ys.min(), ys.max()
    
    # 2px padding safe clamp
    min_x = max(0, min_x - 2)
    max_x = min(im_half.width, max_x + 3)
    min_y = max(0, min_y - 2)
    max_y = min(im_half.height, max_y + 3)
    return im_half.crop((min_x, min_y, max_x, max_y))

def make_card_image(cropped_img, target_w=800, target_h=600):
    canvas = Image.new("RGB", (target_w, target_h), (255, 255, 255))
    cw, ch = cropped_img.size
    max_h = int(target_h * 0.90)  # 540px high
    max_w = int(target_w * 0.85)  # 680px wide
    scale = min(max_w / cw, max_h / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    resized = cropped_img.resize((new_w, new_h), Image.LANCZOS)
    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y))
    return canvas

def make_square_view(cropped_img, size=1000):
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    cw, ch = cropped_img.size
    max_dim = int(size * 0.90)   # 900px high
    scale = min(max_dim / cw, max_dim / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    resized = cropped_img.resize((new_w, new_h), Image.LANCZOS)
    offset_x = (size - new_w) // 2
    offset_y = (size - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y))
    return canvas

for item in ITEMS:
    slug = item["name"]
    im = Image.open(item["src"]).convert("RGB")
    mid = im.width // 2
    
    front_half = im.crop((0, 0, mid, im.height))
    back_half = im.crop((mid, 0, im.width, im.height))
    
    crop_front = crop_tight_object(front_half)
    crop_back = crop_tight_object(back_half)
    
    card = make_card_image(crop_front, 800, 600)
    front = make_square_view(crop_front, 1000)
    back = make_square_view(crop_back, 1000)
    
    names = [slug] + item["aliases"]
    for name in names:
        card.save(os.path.join(OUT_DIR, f"{name}.webp"), "WEBP", quality=95)
        front.save(os.path.join(PROD_DIR, f"{name}-front.webp"), "WEBP", quality=95)
        back.save(os.path.join(PROD_DIR, f"{name}-back.webp"), "WEBP", quality=95)
    
    print(f"Processed {slug}: front {crop_front.size}, back {crop_back.size}")

print("All products cropped and saved successfully!")
