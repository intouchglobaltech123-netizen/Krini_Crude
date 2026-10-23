import os
from PIL import Image
import numpy as np

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")
PROD_DIR = os.path.join(OUT_DIR, "products")
os.makedirs(PROD_DIR, exist_ok=True)

MEDIA_DIR = r"C:\Users\sandh\.gemini\antigravity-ide\brain\db317170-28e5-4262-8b8c-3376cdbc9f78\.user_uploaded"

f_krini_grease = os.path.join(MEDIA_DIR, "media_1792728671418.png")
f_lock_front = os.path.join(MEDIA_DIR, "media_1792728897280.png")
f_lock_back = os.path.join(MEDIA_DIR, "media_1792728971430.png")
f_repel_grease = os.path.join(MEDIA_DIR, "media_1792729057689.jpg")

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

# 1. Krini Shuttering Grease
im1 = Image.open(f_krini_grease).convert("RGB")
mid1 = im1.width // 2
crop_k_front = crop_tight_object(im1.crop((0, 0, mid1, im1.height)))
crop_k_back = crop_tight_object(im1.crop((mid1, 0, im1.width, im1.height)))

card_k = make_card_image(crop_k_front, 800, 600)
front_k = make_square_view(crop_k_front, 1000)
back_k = make_square_view(crop_k_back, 1000)

card_k.save(os.path.join(OUT_DIR, "krini-shuttering-grease.webp"), "WEBP", quality=95)
front_k.save(os.path.join(PROD_DIR, "krini-shuttering-grease-front.webp"), "WEBP", quality=95)
back_k.save(os.path.join(PROD_DIR, "krini-shuttering-grease-back.webp"), "WEBP", quality=95)
print("1. Processed Krini Shuttering Grease:", crop_k_front.size, crop_k_back.size)

# 2 & 3. Lock-Bond Adhesive Spray
im2 = Image.open(f_lock_front).convert("RGB")
im3 = Image.open(f_lock_back).convert("RGB")
crop_l_front = crop_tight_object(im2)
crop_l_back = crop_tight_object(im3)

card_l = make_card_image(crop_l_front, 800, 600)
front_l = make_square_view(crop_l_front, 1000)
back_l = make_square_view(crop_l_back, 1000)

for slug in ["lock-bond-adhesive-spray-400ml", "lock-bond-adhesive-spray"]:
    card_l.save(os.path.join(OUT_DIR, f"{slug}.webp"), "WEBP", quality=95)
    front_l.save(os.path.join(PROD_DIR, f"{slug}-front.webp"), "WEBP", quality=95)
    back_l.save(os.path.join(PROD_DIR, f"{slug}-back.webp"), "WEBP", quality=95)
print("2 & 3. Processed Lock-Bond Adhesive Spray:", crop_l_front.size, crop_l_back.size)

# 4. Repel Shuttering Grease
im4 = Image.open(f_repel_grease).convert("RGB")
mid4 = im4.width // 2
crop_r_front = crop_tight_object(im4.crop((0, 0, mid4, im4.height)))
crop_r_back = crop_tight_object(im4.crop((mid4, 0, im4.width, im4.height)))

card_r = make_card_image(crop_r_front, 800, 600)
front_r = make_square_view(crop_r_front, 1000)
back_r = make_square_view(crop_r_back, 1000)

card_r.save(os.path.join(OUT_DIR, "repel-shuttering-grease.webp"), "WEBP", quality=95)
front_r.save(os.path.join(PROD_DIR, "repel-shuttering-grease-front.webp"), "WEBP", quality=95)
back_r.save(os.path.join(PROD_DIR, "repel-shuttering-grease-back.webp"), "WEBP", quality=95)
print("4. Processed Repel Shuttering Grease:", crop_r_front.size, crop_r_back.size)

print("All 4 products processed successfully!")
