import re
import json

with open('src/content/catalogue.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find each line
line_chunks = text.split("id: \"")
products_list = []

for chunk in line_chunks[1:]:
    line_id = chunk.split('"')[0]
    # find all ranges or products
    # We can match `name: "..."`
    names = re.findall(r'name:\s*"([^"]+)"', chunk)
    for n in names:
        if n in ["1-COOL", "Lubecon", "Vibrant"]:
            continue
        products_list.append((line_id, n))

print(f"Total products: {len(products_list)}")
for l, n in products_list:
    slug = re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-')
    print(f"{l:15} | {n:35} | {slug}")
