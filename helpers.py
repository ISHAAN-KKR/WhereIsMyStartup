from settings import *

def preprocess_text(text):
    """Cleans raw markdown-like text into structured blocks."""
    lines = text.split("\n")
    cleaned_lines = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Remove ALL stray "■" anywhere in the line
        line = line.replace("■", "").strip()

        # Normalize bullets
        if line.startswith(("- ", "* ", "•", "✔")):
            line = "• " + line.lstrip("-*•✔ ").strip()

        # Convert bold markers **bold**
        line = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", line)

        cleaned_lines.append(line)

    return cleaned_lines


def generate_pdf(text):
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(
        pdf_buffer,
        pagesize=letter,
        leftMargin=50,
        rightMargin=50,
        topMargin=50,
        bottomMargin=50
    )

    # Styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="CustomHeading", fontName="Helvetica-Bold", fontSize=14, spaceAfter=10, textColor=colors.HexColor("#2E86C1")))
    styles.add(ParagraphStyle(name="CustomSubHeading", fontName="Helvetica-Bold", fontSize=12, spaceAfter=6, textColor=colors.HexColor("#1A5276")))
    styles.add(ParagraphStyle(name="CustomBullet", fontName="Helvetica", fontSize=11, leftIndent=20, bulletIndent=10, spaceAfter=4))
    styles.add(ParagraphStyle(name="CustomNormal", fontName="Helvetica", fontSize=11, spaceAfter=6))

    content = []
    lines = preprocess_text(text)

    table_data = []
    in_table = False

    for line in lines:
        # Promote "Section:" style to headings
        if line.endswith(":") and not "|" in line:
            content.append(Paragraph(line.rstrip(":"), styles["CustomHeading"]))

        elif line.startswith("##"):
            heading_text = line.replace("##", "").strip()
            content.append(Paragraph(heading_text, styles["CustomHeading"]))

        elif re.match(r"^\d+\.", line):  # Numbered steps (1., 2., etc.)
            content.append(Paragraph(line, styles["CustomSubHeading"]))

        elif line.startswith("• "):  # Bullet points
            bullet_text = line.lstrip("• ").strip()
            content.append(Paragraph(bullet_text, styles["CustomBullet"], bulletText="•"))

        elif "|" in line:  # Table row
            row_data = [cell.strip() for cell in line.split("|") if cell.strip()]
            if row_data:
                table_data.append(row_data)
                in_table = True

        elif "---" in line:  # Table separator line
            continue

        else:  # Normal text
            if in_table and table_data:
                # Render table properly
                t = Table(table_data, hAlign="LEFT")
                t.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2E86C1")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
                ]))
                content.append(t)
                content.append(Spacer(1, 10))
                table_data = []
                in_table = False

            content.append(Paragraph(line, styles["CustomNormal"]))

        content.append(Spacer(1, 4))

    # Final check for last table
    if in_table and table_data:
        t = Table(table_data, hAlign="LEFT")
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2E86C1")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
        ]))
        content.append(t)

    doc.build(content)
    pdf_buffer.seek(0)
    return pdf_buffer
