import os
from PIL import Image
import numpy as np

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")
PROD_DIR = os.path.join(OUT_DIR, "products")
os.makedirs(PROD_DIR, exist_ok=True)

MEDIA_DIR = r"C:\Users\sandh\.gemini\antigravity-ide\brain\db317170-28e5-4262-8b8c-3376cdbc9f78\.user_uploaded"

f_silease_front = os.path.join(MEDIA_DIR, "media_1792730953587.jpg")
f_silease_back = os.path.join(MEDIA_DIR, "media_1792730970856.jpg")
f_nikri30 = os.path.join(MEDIA_DIR, "media_1792731118509.jpg")
f_nikrial = os.path.join(MEDIA_DIR, "media_1792731199928.jpg")

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
    max_dim = int(size * 0.90)   # 900px
    scale = min(max_dim / cw, max_dim / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    resized = cropped_img.resize((new_w, new_h), Image.LANCZOS)
    offset_x = (size - new_w) // 2
    offset_y = (size - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y))
    return canvas

# 1. Silease 360 Shuttering Oil (Image 1 Front, Image 2 Back)
im_s_front = Image.open(f_silease_front).convert("RGB")
im_s_back = Image.open(f_silease_back).convert("RGB")
crop_s_front = crop_tight_object(im_s_front)
crop_s_back = crop_tight_object(im_s_back)

card_s = make_card_image(crop_s_front, 800, 600)
front_s = make_square_view(crop_s_front, 1000)
back_s = make_square_view(crop_s_back, 1000)

for s in ["silease-360-shuttering-oil", "silease-360"]:
    card_s.save(os.path.join(OUT_DIR, f"{s}.webp"), "WEBP", quality=95)
    front_s.save(os.path.join(PROD_DIR, f"{s}-front.webp"), "WEBP", quality=95)
    back_s.save(os.path.join(PROD_DIR, f"{s}-back.webp"), "WEBP", quality=95)
print("1. Processed Silease 360:", crop_s_front.size, crop_s_back.size)

# 2. Nikri 30 Shuttering Oil (Image 3: Left Front, Right Back)
im_n30 = Image.open(f_nikri30).convert("RGB")
mid_n30 = im_n30.width // 2
crop_n30_front = crop_tight_object(im_n30.crop((0, 0, mid_n30, im_n30.height)))
crop_n30_back = crop_tight_object(im_n30.crop((mid_n30, 0, im_n30.width, im_n30.height)))

card_n30 = make_card_image(crop_n30_front, 800, 600)
front_n30 = make_square_view(crop_n30_front, 1000)
back_n30 = make_square_view(crop_n30_back, 1000)

for s in ["nikri-30-shuttering-oil", "nikri-30"]:
    card_n30.save(os.path.join(OUT_DIR, f"{s}.webp"), "WEBP", quality=95)
    front_n30.save(os.path.join(PROD_DIR, f"{s}-front.webp"), "WEBP", quality=95)
    back_n30.save(os.path.join(PROD_DIR, f"{s}-back.webp"), "WEBP", quality=95)
print("2. Processed Nikri 30:", crop_n30_front.size, crop_n30_back.size)

# 3. Nikri AL Shuttering Oil (Image 4: Left Front, Right Back)
im_nal = Image.open(f_nikrial).convert("RGB")
mid_nal = im_nal.width // 2
crop_nal_front = crop_tight_object(im_nal.crop((0, 0, mid_nal, im_nal.height)))
crop_nal_back = crop_tight_object(im_nal.crop((mid_nal, 0, im_nal.width, im_nal.height)))

card_nal = make_card_image(crop_nal_front, 800, 600)
front_nal = make_square_view(crop_nal_front, 1000)
back_nal = make_square_view(crop_nal_back, 1000)

for s in ["nikri-al-shuttering-oil", "nikri-al"]:
    card_nal.save(os.path.join(OUT_DIR, f"{s}.webp"), "WEBP", quality=95)
    front_nal.save(os.path.join(PROD_DIR, f"{s}-front.webp"), "WEBP", quality=95)
    back_nal.save(os.path.join(PROD_DIR, f"{s}-back.webp"), "WEBP", quality=95)
print("3. Processed Nikri AL:", crop_nal_front.size, crop_nal_back.size)

print("All 3 shuttering oil drums processed successfully!")
