#!/usr/bin/env python3
"""
Update careTimeline in src/content/homepage/main.json
Changes: 9 columns → 18 columns, restructure all rows per specs
"""

import json
import sys

FILE_PATH = "src/content/homepage/main.json"

# Read the file
with open(FILE_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# New 18 columns matching the image
new_columns = [
    "<strong>Pre Natal</strong>",
    "<strong>0m</strong>",
    "<strong>3m</strong>",
    "<strong>6m</strong>",
    "<strong>9m</strong>",
    "<strong>12m</strong>",
    "<strong>18m</strong>",
    "<strong>2a</strong>",
    "<strong>3a</strong>",
    "<strong>4a</strong>",
    "<strong>5a</strong>",
    "<strong>6a</strong>",
    "<strong>7a</strong>",
    "<strong>8a</strong>",
    "<strong>9a</strong>",
    "<strong>10a</strong>",
    "<strong>Adolescentes</strong>",
    "<strong>+18a</strong>"
]

# New rows with all 10 changes
new_rows = [
    {"label": "Asesoramiento y educación familiar", "type": "coordinated", "startCol": 1, "endCol": 19},
    {"label": "PSIO-NAM", "type": "treatment", "startCol": 2, "endCol": 5, "color": "#7C3AED", "href": "/ortopedia-prequirurgica-nam/"},
    {"label": "Cirugía de Labio Fisurado", "type": "treatment", "startCol": 3, "endCol": 5, "color": "#a01255", "href": "/cirugia-labio-fisurado/"},
    {"label": "Cirugía de Paladar Hendido", "type": "treatment", "startCol": 4, "endCol": 7, "color": "#008362", "href": "/cirugia-paladar-hendido/"},
    {"label": "Alimentación y nutrición", "type": "coordinated", "startCol": 2, "endCol": 8},
    {"label": "Pruebas auditivas", "type": "coordinated", "startCol": 2, "endCol": 8},
    {"label": "Estimulación temprana - Terapia del habla y lenguaje", "type": "coordinated", "startCol": 2, "endCol": 14},
    {"label": "Seguimiento ORL (Audición, Respiración, Adenoides, Amígdalas)", "type": "coordinated", "startCol": 3, "endCol": 17},
    {"label": "Ortodoncia y seguimiento", "type": "coordinated", "startCol": 8, "endCol": 18},
    {"label": "Reconstrucción de Encía (Injerto Óseo)", "type": "treatment", "startCol": 12, "endCol": 17, "color": "#16A34A", "href": "/injerto-oseo-alveolar/"},
    {"label": "Cirugía Ortognática", "type": "treatment", "startCol": 14, "endCol": 18, "color": "#B45309", "href": "/cirugia-ortognatica-flp/"},
    {"label": "Rinoplastia en FLP", "type": "treatment", "startCol": 14, "endCol": 18, "color": "#0891B2", "href": "/rinoplastia-flp/"},
    {"label": "Cirugía de Revisión", "type": "treatment", "startCol": 8, "endCol": 19, "color": "#0d74c4", "href": "/cirugia-revision-fisura/"},
    {"label": "Salud oral", "type": "coordinated", "startCol": 8, "endCol": 19},
    {"label": "Acompañamiento psicosocial", "type": "coordinated", "startCol": 8, "endCol": 19}
]

# Update the careTimeline
data["careTimeline"]["columns"] = new_columns
data["careTimeline"]["rows"] = new_rows

# Write back
with open(FILE_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Timeline updated: 9 columns → 18 columns")
print(f"✅ Rows restructured: {len(new_rows)} treatment/coordinated streams")
print(f"✅ File saved: {FILE_PATH}")
