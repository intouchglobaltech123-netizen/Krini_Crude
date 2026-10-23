from PIL import Image
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")
PROD_DIR = os.path.join(OUT_DIR, "products")
os.makedirs(PROD_DIR, exist_ok=True)

MEDIA_DIR = r"C:\Users\sandh\.gemini\antigravity-ide\brain\db317170-28e5-4262-8b8c-3376cdbc9f78\.user_uploaded"

f1 = os.path.join(MEDIA_DIR, "media_1792676580505.jpg") # 1-COOL AL 5000 Front
f2 = os.path.join(MEDIA_DIR, "media_1792676589782.jpg") # 1-COOL AL 5000 Back
f3 = os.path.join(MEDIA_DIR, "media_1792676713182.jpg") # 1-COOL AL 7000 Front
f4 = os.path.join(MEDIA_DIR, "media_1792676743045.jpg") # 1-COOL AL 7000 Back
f5 = os.path.join(MEDIA_DIR, "media_1792677111119.jpg") # Rust Preventive Oil Front & Back
f_aquacut = os.path.join(MEDIA_DIR, "media_1792676159292.jpg") # 1-COOL Aquacut 150

def make_card_image(cropped_img, target_w=800, target_h=600):
    """
    Creates a 4:3 card image with the pail centered cleanly,
    occupying ~90% of the card height so it never cuts off and looks ultra premium.
    """
    canvas = Image.new("RGB", (target_w, target_h), (255, 255, 255))
    cw, ch = cropped_img.size
    
    # Scale to fit comfortably within target_h * 0.92
    max_h = int(target_h * 0.92)
    max_w = int(target_w * 0.85)
    
    scale = min(max_w / cw, max_h / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    
    resized = cropped_img.resize((new_w, new_h), Image.LANCZOS)
    
    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    
    canvas.paste(resized, (offset_x, offset_y))
    return canvas

def make_square_view(cropped_img, size=1000):
    """
    Creates a 1:1 square canvas for the Gallery slide with the pail centered cleanly.
    """
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    cw, ch = cropped_img.size
    
    max_dim = int(size * 0.90)
    scale = min(max_dim / cw, max_dim / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    
    resized = cropped_img.resize((new_w, new_h), Image.LANCZOS)
    
    offset_x = (size - new_w) // 2
    offset_y = (size - new_h) // 2
    
    canvas.paste(resized, (offset_x, offset_y))
    return canvas

# 1. 1-COOL AL 5000
im1 = Image.open(f1) # Front
crop1 = im1.crop((120, 25, 905, 975))
card1 = make_card_image(crop1, 800, 600)
front1 = make_square_view(crop1, 1000)

im2 = Image.open(f2) # Back
crop2 = im2.crop((60, 45, 915, 1020))
back1 = make_square_view(crop2, 1000)

card1.save(os.path.join(OUT_DIR, "1-cool-al-5000.webp"), "WEBP", quality=95)
front1.save(os.path.join(PROD_DIR, "1-cool-al-5000-front.webp"), "WEBP", quality=95)
back1.save(os.path.join(PROD_DIR, "1-cool-al-5000-back.webp"), "WEBP", quality=95)
print("Saved 1-COOL AL 5000 images")

# 2. 1-COOL AL 7000
im3 = Image.open(f3) # Front
crop3 = im3.crop((110, 70, 905, 1005))
card3 = make_card_image(crop3, 800, 600)
front3 = make_square_view(crop3, 1000)

im4 = Image.open(f4) # Back
crop4 = im4.crop((125, 50, 900, 990))
back3 = make_square_view(crop4, 1000)

card3.save(os.path.join(OUT_DIR, "1-cool-al-7000.webp"), "WEBP", quality=95)
front3.save(os.path.join(PROD_DIR, "1-cool-al-7000-front.webp"), "WEBP", quality=95)
back3.save(os.path.join(PROD_DIR, "1-cool-al-7000-back.webp"), "WEBP", quality=95)
print("Saved 1-COOL AL 7000 images")

# 3. Rust Preventive Oil (from side-by-side Image 5)
im5 = Image.open(f5)
crop5_front = im5.crop((15, 20, 505, 670))
crop5_back = im5.crop((515, 20, 1005, 670))

card5 = make_card_image(crop5_front, 800, 600)
front5 = make_square_view(crop5_front, 1000)
back5 = make_square_view(crop5_back, 1000)

card5.save(os.path.join(OUT_DIR, "rust-preventive-oil.webp"), "WEBP", quality=95)
front5.save(os.path.join(PROD_DIR, "rust-preventive-oil-front.webp"), "WEBP", quality=95)
back5.save(os.path.join(PROD_DIR, "rust-preventive-oil-back.webp"), "WEBP", quality=95)
print("Saved Rust Preventive Oil images")

# 4. Also optimize 1-COOL Aquacut 150 card image for 800x600 4:3
im_aq = Image.open(f_aquacut)
crop_aq_front = im_aq.crop((20, 50, 510, 612))
card_aq = make_card_image(crop_aq_front, 800, 600)
card_aq.save(os.path.join(OUT_DIR, "1-cool-aquacut-150.webp"), "WEBP", quality=95)
print("Optimized 1-COOL Aquacut 150 card image")

print("\nAll product images processed successfully!")
