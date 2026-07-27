#!/usr/bin/env python3
"""C10: Homepage FAQ — remove FLP from Q1, keyword fix Q2, AEO restatement Q3."""
import json, sys, pathlib

PATH = pathlib.Path("src/content/homepage/main.json")
raw = PATH.read_text(encoding="utf-8")

# Change 1 — Q1: '(FLP)' in patient-facing answer — hard stop
OLD1 = "La fisura labiopalatina (FLP) es una condición congénita"
NEW1 = "La fisura labiopalatina es una condición congénita"
assert OLD1 in raw, f"ABORT: Q1 old text not found.\nLooking for: {OLD1!r}"
raw = raw.replace(OLD1, NEW1, 1)
assert NEW1 in raw and OLD1 not in raw, "ABORT: Q1 replacement did not apply cleanly"
print("✓ Q1 — '(FLP)' removed from patient-facing answer")

# Change 2 — Q2: first sentence missing keyword — prepend compliant opener, preserve his text
OLD2 = "El calendario quirúrgico clásico contempla la reconstrucción de labio fisurado alrededor de los 3"
NEW2 = "El tratamiento de la fisura labiopalatina sigue un calendario adaptado al desarrollo de cada bebé. El calendario quirúrgico clásico contempla la reconstrucción de labio fisurado alrededor de los 3"
assert OLD2 in raw, f"ABORT: Q2 old text not found.\nLooking for: {OLD2!r}"
raw = raw.replace(OLD2, NEW2, 1)
assert NEW2 in raw, "ABORT: Q2 replacement did not apply cleanly"
print("✓ Q2 — keyword sentence prepended, original text preserved")

# Change 3 — Q3: bare 'Sí.' opening violates rule 13.1 — replace with AEO restatement
OLD3 = "Sí. La cirugía de revisión es una parte muy importante de la práctica de Dr. Nico Sierra. Muchos"
NEW3 = "La cirugía de revisión en fisura labiopalatina puede mejorar de forma significativa los resultados de intervenciones previas. Muchos"
assert OLD3 in raw, f"ABORT: Q3 old text not found.\nLooking for: {OLD3!r}"
raw = raw.replace(OLD3, NEW3, 1)
assert NEW3 in raw and OLD3 not in raw, "ABORT: Q3 replacement did not apply cleanly"
print("✓ Q3 — bare 'Sí.' replaced with compliant AEO restatement")

# Validate JSON integrity
try:
    json.loads(raw)
except json.JSONDecodeError as e:
    sys.exit(f"ABORT: JSON invalid after edits — {e}")

PATH.write_text(raw, encoding="utf-8")
print("\n✓ src/content/homepage/main.json written. JSON valid.")
