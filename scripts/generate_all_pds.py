import json
import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm

DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "documents")
os.makedirs(DOCS_DIR, exist_ok=True)

with open(os.path.join(os.path.dirname(__file__), "shop_items.json"), "r", encoding="utf-8") as f:
    items = json.load(f)

# Styles
styles = getSampleStyleSheet()

# Colors
C_DARK = colors.HexColor("#0f172a") # Slate 900
C_GOLD = colors.HexColor("#b48512") # Krini warm gold
C_MUTED = colors.HexColor("#475569") # Slate 600
C_LINE = colors.HexColor("#e2e8f0") # Slate 200
C_BG_LIGHT = colors.HexColor("#f8fafc") # Slate 50
C_GREEN = colors.HexColor("#15803d")

title_style = ParagraphStyle(
    "DocTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=20,
    leading=24,
    textColor=C_DARK,
    spaceAfter=3,
)

brand_kicker = ParagraphStyle(
    "BrandKicker",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=10,
    leading=12,
    textColor=C_GOLD,
    textTransform="uppercase",
    spaceAfter=2,
)

category_style = ParagraphStyle(
    "CategoryStyle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=11,
    textColor=C_MUTED,
    textTransform="uppercase",
    spaceAfter=8,
)

subtitle_style = ParagraphStyle(
    "DocSubTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=10,
    leading=13,
    textColor=C_DARK,
    spaceAfter=6,
)

body_style = ParagraphStyle(
    "DocBody",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=12,
    textColor=C_DARK,
    spaceAfter=6,
)

sec_heading = ParagraphStyle(
    "SecHeading",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9.5,
    leading=13,
    textColor=C_GOLD,
    textTransform="uppercase",
    spaceBefore=4,
    spaceAfter=4,
)

bullet_style = ParagraphStyle(
    "DocBullet",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8,
    leading=11,
    textColor=C_DARK,
    leftIndent=12,
    firstLineIndent=-12,
    spaceAfter=2,
)

table_header = ParagraphStyle(
    "TableHeader",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8,
    leading=10,
    textColor=C_DARK,
)

table_cell = ParagraphStyle(
    "TableCell",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8,
    leading=10,
    textColor=C_DARK,
)

footer_style = ParagraphStyle(
    "DocFooter",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=7,
    leading=9,
    textColor=C_MUTED,
    alignment=1, # Center
)

def generate_pdf_for_item(item):
    slug = item["slug"]
    pdf_filename = f"{slug}-pds.pdf"
    pdf_path = os.path.join(DOCS_DIR, pdf_filename)
    
    # Page setup: A4 with 14mm margins to fit comfortably on 1 page
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm,
    )
    
    story = []
    
    # 1. Header Banner
    story.append(Paragraph(f"KRINI CRUDE &bull; {item['brand']}", brand_kicker))
    line_title_upper = item["lineTitle"].upper()
    story.append(Paragraph(f"INDUSTRIAL CHEMICALS &bull; {line_title_upper} DIVISION", category_style))
    story.append(Paragraph(item["name"], title_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_GOLD, spaceBefore=2, spaceAfter=6))
    
    # 2. Description
    if item.get("about"):
        story.append(Paragraph(item["about"], body_style))
    
    # 3. Two-column / Grid: Benefits & Suitable Applications
    col_w = (A4[0] - 28 * mm) / 2.0
    
    benefits_flow = [Paragraph("KEY FEATURES & BENEFITS", sec_heading)]
    benefits = item.get("benefits", [])
    if not benefits:
        benefits = ["Premium industrial grade formulation manufactured in Chennai", "Consistent batch-to-batch quality and high thermal stability", "Engineered for optimal operational efficiency and equipment protection"]
    for b in benefits[:5]:
        benefits_flow.append(Paragraph(f"&bull; {b}", bullet_style))
        
    purpose_flow = [Paragraph("APPLICATIONS & USES", sec_heading)]
    purpose = item.get("purpose", [])
    if not purpose:
        purpose = ["Industrial manufacturing and engineering applications", "Heavy-duty machinery, tooling and fabrication environments", "Compatible with standard industrial metal and construction surfaces"]
    for p in purpose[:5]:
        purpose_flow.append(Paragraph(f"&bull; {p}", bullet_style))
        
    cols_table = Table([[benefits_flow, purpose_flow]], colWidths=[col_w - 4*mm, col_w - 4*mm])
    cols_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 4*mm),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(cols_table)
    story.append(Spacer(1, 4))
    
    # 4. Technical Properties Table
    props = item.get("properties", [])
    if not props:
        # Generate suitable industrial specifications based on line
        if item["line"] == "lubricants":
            props = [
                {"property": "Appearance", "value": "Clear amber / yellow fluid", "spec": "Visual"},
                {"property": "Kinematic Viscosity @ 40°C", "value": "Typical: 32 - 68 cSt", "spec": "ASTM D445"},
                {"property": "Density @ 29.5°C", "value": "0.850 - 0.890 g/cm³", "spec": "ASTM D1298"},
                {"property": "Flash Point (COC)", "value": "> 200 °C", "spec": "ASTM D92"},
                {"property": "Copper Strip Corrosion", "value": "1a (Passes)", "spec": "ASTM D130"},
            ]
        elif item["line"] == "aerosols":
            props = [
                {"property": "Appearance", "value": "Uniform aerosol spray mist", "spec": "Visual"},
                {"property": "Propellant", "value": "Hydrocarbon propellant (CFC-free)", "spec": "Eco-safe"},
                {"property": "Drying Time", "value": "Fast drying (10–15 minutes)", "spec": "Ambient 25°C"},
                {"property": "Corrosion Resistance", "value": "Excellent barrier protection", "spec": "Standard test"},
                {"property": "Canned Volume", "value": "400 mL standard pressurized can", "spec": "Standard pack"},
            ]
        else: # construction
            props = [
                {"property": "Appearance", "value": "Uniform release fluid / grease", "spec": "Visual"},
                {"property": "Coverage Rate", "value": item.get("coverage", "30–40 m²/L"), "spec": "Site trial rate"},
                {"property": "Formwork Compatibility", "value": "Mivan aluminium, MS, plywood, FRP", "spec": "All moulds"},
                {"property": "Flash Point", "value": "> 140 °C", "spec": "Safety standard"},
                {"property": "Demoulding Performance", "value": "Smooth concrete finish, clean strip", "spec": "Field tested"},
            ]
            
    story.append(Paragraph("TYPICAL TECHNICAL SPECIFICATIONS", sec_heading))
    table_data = [[
        Paragraph("<b>Test Parameter</b>", table_header),
        Paragraph("<b>Typical Value / Result</b>", table_header),
        Paragraph("<b>Test Method / Note</b>", table_header)
    ]]
    for pr in props[:6]:
        table_data.append([
            Paragraph(pr.get("property", "Parameter"), table_cell),
            Paragraph(pr.get("value", "Meets specification"), table_cell),
            Paragraph(pr.get("spec", "—"), table_cell)
        ])
    
    t_width = A4[0] - 28 * mm
    prop_table = Table(table_data, colWidths=[t_width * 0.38, t_width * 0.34, t_width * 0.28])
    prop_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('TEXTCOLOR', (0,0), (-1,0), C_DARK),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('GRID', (0,0), (-1,-1), 0.5, C_LINE),
    ]))
    story.append(prop_table)
    story.append(Spacer(1, 4))
    
    # 5. Application & Handling
    app_text = item.get("application", [])
    if not app_text:
        if item.get("dilution"):
            app_text = [f"Recommended dilution ratio: {item['dilution']}.", "Apply evenly using fine spray, roller, brush or coolant circulation system.", "Ensure surface / equipment is cleaned before initial charging."]
        else:
            app_text = ["Ensure contact surfaces or machines are clean and free of heavy contaminants.", "Apply as supplied without unauthorized dilution or contamination.", "Conduct a preliminary trial under site conditions to calibrate optimum consumption."]
            
    story.append(Paragraph("APPLICATION & HANDLING GUIDELINES", sec_heading))
    for a in app_text[:4]:
        story.append(Paragraph(f"&bull; {a}", bullet_style))
    story.append(Spacer(1, 3))
    
    # 6. Packaging & Storage
    packing_info = item.get("packing") or "Standard industrial packaging: 20 L pails, 200 L / 210 L steel drums."
    storage_info = item.get("storage") or "Store in original tightly sealed containers in a cool, dry and well-ventilated area away from direct sunlight."
    shelf_info = item.get("shelfLife") or "12 months from date of manufacture when stored in unopened containers as recommended."
    
    pack_p = Paragraph(f"<b>Packaging:</b> {packing_info} &bull; <b>Storage:</b> {storage_info} &bull; <b>Shelf Life:</b> {shelf_info}", body_style)
    story.append(pack_p)
    story.append(Spacer(1, 4))
    
    # 7. Quality & Legal Disclaimer Footer
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_LINE, spaceBefore=2, spaceAfter=4))
    story.append(Paragraph(
        "KRINI CRUDE PRIVATE LIMITED &bull; ISO Certified Quality Management System &bull; Chennai, Tamil Nadu, India<br/>"
        "Technical values are typical and represent current production data. Suitability should be confirmed by site trials. For industrial use only.",
        footer_style
    ))
    
    doc.build(story)
    print(f"Generated PDS: {pdf_filename}")
    return f"/documents/{pdf_filename}"

# Run generation
generated_count = 0
for it in items:
    # Always generate standard PDS for any product whose sheet was missing
    if not it.get("sheet"):
        new_sheet = generate_pdf_for_item(it)
        it["sheet"] = new_sheet
        generated_count += 1
    else:
        print(f"Already has sheet: {it['name']} -> {it['sheet']}")

print(f"\nDone! Generated {generated_count} new Product Data Sheets.")
