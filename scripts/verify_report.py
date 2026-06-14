from zipfile import ZipFile

path = "report-output/AI_CyberShield_60_Page_Project_Report.docx"
with ZipFile(path) as docx:
    media = [name for name in docx.namelist() if name.startswith("word/media/")]
    xml = docx.read("word/document.xml").decode("utf-8")
    print(f"media_files={len(media)}")
    print(f"page_breaks={xml.count('w:type=\"page\"')}")
    print(f"document_xml_bytes={len(xml)}")
