import os
from PIL import Image
import numpy as np

def hex_to_rgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], dtype=float)

def recolor_word_to_gold(img, x_min, x_max, y_min=0, y_max=None):
    """
    Recolors pixels in the [x_min, x_max] range that have an orange/red hue
    into the website's metallic gold (#D4AF37) while preserving 3D shading,
    specular highlights, bevels, and alpha transparency.
    """
    img = img.convert("RGBA")
    arr = np.array(img, dtype=float)
    h_img, w_img, _ = arr.shape
    if y_max is None:
        y_max = h_img

    # Define the region of interest
    r = arr[y_min:y_max, x_min:x_max, 0]
    g = arr[y_min:y_max, x_min:x_max, 1]
    b = arr[y_min:y_max, x_min:x_max, 2]
    a = arr[y_min:y_max, x_min:x_max, 3]

    # Mask for non-transparent pixels with warm/orange/red tone:
    # In the logo, KRINI has R > G and R > B, and a > 10.
    # Typically R is at least 1.1 * G, and B is noticeably lower than G.
    mask = (a > 15) & (r > 60) & (r >= g * 1.05) & (g >= b)

    if not np.any(mask):
        print(f"No matching pixels in [{x_min}, {x_max}]")
        return img

    # Compute perceived luminance (0.0 to 1.0)
    lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0

    # Target metallic gold palette:
    # Deep shadow: #7A580A (122, 88, 10)
    # Mid-dark:    #B8921E (184, 146, 30)
    # Base gold:   #D4AF37 (212, 175, 55)
    # Bright gold: #ECD27A (236, 210, 122)
    # Specular:    #FFF6D0 (255, 246, 208)
    
    col_deep   = np.array([122.0,  88.0,  10.0])
    col_dark   = np.array([184.0, 146.0,  30.0])
    col_base   = np.array([212.0, 175.0,  55.0])
    col_hi     = np.array([238.0, 212.0, 124.0])
    col_spec   = np.array([255.0, 248.0, 215.0])

    new_r = np.copy(r)
    new_g = np.copy(g)
    new_b = np.copy(b)

    # Interpolate according to luminance
    m_lum = lum[mask]
    res_r = np.zeros_like(m_lum)
    res_g = np.zeros_like(m_lum)
    res_b = np.zeros_like(m_lum)

    # 4 zones of luminance:
    # 0.00 - 0.25: deep -> dark
    # 0.25 - 0.50: dark -> base
    # 0.50 - 0.75: base -> hi
    # 0.75 - 1.00: hi -> spec
    
    z1 = m_lum < 0.25
    t1 = m_lum[z1] / 0.25
    res_r[z1] = col_deep[0] + (col_dark[0] - col_deep[0]) * t1
    res_g[z1] = col_deep[1] + (col_dark[1] - col_deep[1]) * t1
    res_b[z1] = col_deep[2] + (col_dark[2] - col_deep[2]) * t1

    z2 = (m_lum >= 0.25) & (m_lum < 0.50)
    t2 = (m_lum[z2] - 0.25) / 0.25
    res_r[z2] = col_dark[0] + (col_base[0] - col_dark[0]) * t2
    res_g[z2] = col_dark[1] + (col_base[1] - col_dark[1]) * t2
    res_b[z2] = col_dark[2] + (col_base[2] - col_dark[2]) * t2

    z3 = (m_lum >= 0.50) & (m_lum < 0.75)
    t3 = (m_lum[z3] - 0.50) / 0.25
    res_r[z3] = col_base[0] + (col_hi[0] - col_base[0]) * t3
    res_g[z3] = col_base[1] + (col_hi[1] - col_base[1]) * t3
    res_b[z3] = col_base[2] + (col_hi[2] - col_base[2]) * t3

    z4 = m_lum >= 0.75
    t4 = np.clip((m_lum[z4] - 0.75) / 0.25, 0.0, 1.0)
    res_r[z4] = col_hi[0] + (col_spec[0] - col_hi[0]) * t4
    res_g[z4] = col_hi[1] + (col_spec[1] - col_hi[1]) * t4
    res_b[z4] = col_hi[2] + (col_spec[2] - col_hi[2]) * t4

    new_r[mask] = res_r
    new_g[mask] = res_g
    new_b[mask] = res_b

    arr[y_min:y_max, x_min:x_max, 0] = np.clip(new_r, 0, 255)
    arr[y_min:y_max, x_min:x_max, 1] = np.clip(new_g, 0, 255)
    arr[y_min:y_max, x_min:x_max, 2] = np.clip(new_b, 0, 255)

    return Image.fromarray(arr.astype(np.uint8), "RGBA")

def process_file(in_path, out_path, is_horizontal=True):
    print(f"Processing {in_path} -> {out_path}")
    img = Image.open(in_path)
    w, h = img.size
    print(f"Size: {w}x{h}")
    
    if is_horizontal:
        # In 739x220, KRINI is approximately between x=200 and x=450
        x_min = int(w * 0.27)
        x_max = int(w * 0.61)
        recolored = recolor_word_to_gold(img, x_min, x_max)
    else:
        # In vertical logo, KRINI is at bottom left
        x_min = 0
        x_max = int(w * 0.52)
        y_min = int(h * 0.88)
        recolored = recolor_word_to_gold(img, x_min, x_max, y_min=y_min)
        
    recolored.save(out_path, "WEBP", quality=95)
    print("Done!")

def main():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    img_dir = os.path.join(root, "public", "images")
    
    # 1. logo-krini-h.webp
    f1 = os.path.join(img_dir, "logo-krini-h.webp")
    if os.path.exists(f1):
        process_file(f1, f1, is_horizontal=True)
        
    # 2. logo-krini-h-light.webp
    f2 = os.path.join(img_dir, "logo-krini-h-light.webp")
    if os.path.exists(f2):
        process_file(f2, f2, is_horizontal=True)
        
    # 3. logo-krini.webp
    f3 = os.path.join(img_dir, "logo-krini.webp")
    if os.path.exists(f3):
        process_file(f3, f3, is_horizontal=False)

    # Also update nested Krini_Crude/public/images if it exists
    nested_dir = os.path.join(root, "Krini_Crude", "public", "images")
    if os.path.exists(nested_dir):
        for fname, is_h in [("logo-krini-h.webp", True), ("logo-krini-h-light.webp", True), ("logo-krini.webp", False)]:
            src = os.path.join(img_dir, fname)
            dst = os.path.join(nested_dir, fname)
            if os.path.exists(src):
                import shutil
                shutil.copy2(src, dst)
                print(f"Copied to {dst}")

if __name__ == "__main__":
    main()
