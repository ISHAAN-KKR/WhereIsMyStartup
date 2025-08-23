from settings import *

def generate_pdf(text):
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter, leftMargin=50, rightMargin=50, topMargin=50, bottomMargin=50)
    
    styles = getSampleStyleSheet()
    normal_style = styles["Normal"]
    normal_style.fontSize = 12
    styles.add(ParagraphStyle(name="Bold", fontName="Helvetica-Bold", fontSize=12))
    styles.add(ParagraphStyle(name="Heading", fontName="Helvetica-Bold", fontSize=14, spaceAfter=10, underline=True))

    content = []

    lines = text.split("\n")
    
    for line in lines:
        line = line.strip()

        # Convert bold text (**text**) to <b>text</b>
        line = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", line)

        if line.startswith("###"):  # Subheadings
            content.append(Paragraph(f"<b>{line.strip('# ')}</b>", styles["Heading"]))
        elif line.startswith("* "):  # Bullet points
            content.append(Paragraph(f"• {line.strip('* ')}", styles["Normal"]))
        elif "|" in line:  # Table Data
            row_data = [cell.strip() for cell in line.split("|") if cell.strip()]
            content.append(Table([row_data], colWidths=[150, 150]))
        else:  # Normal text with bold fixes
            content.append(Paragraph(line, styles["Normal"]))
        
        content.append(Spacer(1, 10))

    doc.build(content)
    pdf_buffer.seek(0)
    return pdf_buffer
