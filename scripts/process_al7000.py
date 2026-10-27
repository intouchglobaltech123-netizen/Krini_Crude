import os
from PIL import Image, ImageOps
import numpy as np

front_src = r"C:\Users\sandh\.gemini\antigravity-ide\brain\6efe2596-444b-48e9-8c4a-ddbcf156e1fd\.user_uploaded\media_1793085178812.jpg"
back_src = r"C:\Users\sandh\.gemini\antigravity-ide\brain\6efe2596-444b-48e9-8c4a-ddbcf156e1fd\.user_uploaded\media_1793085408923.jpg"

im_front = Image.open(front_src).convert("RGB")
im_back = Image.open(back_src).convert("RGB")

# Target gallery size: 1000 x 1000
# Target pail height: 880px (leaving 60px padding top/bottom)
# Current front pail height: 939px (from y=48 to y=987)
# Center x of front pail: 511px

target_pail_h = 880
scale_front = target_pail_h / 939.0
new_w_front = int(round(im_front.width * scale_front))
new_h_front = int(round(im_front.height * scale_front))
res_front = im_front.resize((new_w_front, new_h_front), Image.Resampling.LANCZOS)

# Current back pail height: 889px (from y=63 to y=952)
# Center x of back pail: 503px
scale_back = target_pail_h / 889.0
new_w_back = int(round(im_back.width * scale_back))
new_h_back = int(round(im_back.height * scale_back))
res_back = im_back.resize((new_w_back, new_h_back), Image.Resampling.LANCZOS)

# Create 1000x1000 white gallery images
front_gallery = Image.new("RGB", (1000, 1000), (255, 255, 255))
back_gallery = Image.new("RGB", (1000, 1000), (255, 255, 255))

# Paste front:
# Top lid at y=48 in original -> 48 * scale_front = 45px
# To put lid at y=60: paste_y = 60 - int(round(48 * scale_front))
# Pail center x at 511 in original -> 511 * scale_front
# To center at x=500: paste_x = 500 - int(round(511 * scale_front))
paste_x_f = 500 - int(round(511 * scale_front))
paste_y_f = 60 - int(round(48 * scale_front))
front_gallery.paste(res_front, (paste_x_f, paste_y_f))

# Paste back:
# Top lid at y=63 in original -> 63 * scale_back
# To put lid at y=60: paste_y = 60 - int(round(63 * scale_back))
# Pail center x at 503 in original -> 503 * scale_back
# To center at x=500: paste_x = 500 - int(round(503 * scale_back))
paste_x_b = 500 - int(round(503 * scale_back))
paste_y_b = 60 - int(round(63 * scale_back))
back_gallery.paste(res_back, (paste_x_b, paste_y_b))

# Target card image: 800 x 600
# In AL 5000 (800x600): pail height was 535px (top at y=32, bottom at y=567, centered at x=400)
card_pail_h = 535
scale_card = card_pail_h / 939.0
card_w = int(round(im_front.width * scale_card))
card_h = int(round(im_front.height * scale_card))
res_card = im_front.resize((card_w, card_h), Image.Resampling.LANCZOS)

card_img = Image.new("RGB", (800, 600), (255, 255, 255))
paste_x_card = 400 - int(round(511 * scale_card))
paste_y_card = 32 - int(round(48 * scale_card))
card_img.paste(res_card, (paste_x_card, paste_y_card))

# Save outputs
os.makedirs("public/images/products", exist_ok=True)

# 1. Gallery front & back (1000x1000)
front_gallery.save("public/images/products/1-cool-al-7000-front.webp", "WEBP", quality=95)
front_gallery.save("public/images/products/al-7000-front.webp", "WEBP", quality=95)

back_gallery.save("public/images/products/1-cool-al-7000-back.webp", "WEBP", quality=95)
back_gallery.save("public/images/products/al-7000-back.webp", "WEBP", quality=95)

# 2. Main card image (800x600)
card_img.save("public/images/1-cool-al-7000.webp", "WEBP", quality=95)
card_img.save("public/images/al-7000.webp", "WEBP", quality=95)

print("Saved all 1-COOL AL 7000 images successfully!")
