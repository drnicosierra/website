#!/usr/bin/env python3
"""
Manual face censoring for casos clinicos.
Run before uploading images to src/content/vidas-transformadas/

Usage:
  python3 scripts/censor-caso-images.py path/to/image.jpg
  python3 scripts/censor-caso-images.py path/to/directory/

Originals are saved to src/content/vidas-transformadas/originals/ (gitignored).
Censored versions are saved to src/content/vidas-transformadas/.
"""

import sys
import os
import shutil
from pathlib import Path
import cv2

ORIGINALS_DIR = Path("src/content/vidas-transformadas/originals")
OUTPUT_DIR = Path("src/content/vidas-transformadas")
CASCADE = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

def censor_image(img_path: Path):
    ORIGINALS_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Save original
    original_dest = ORIGINALS_DIR / img_path.name
    shutil.copy2(img_path, original_dest)
    print(f"  Original saved → {original_dest}")

    # Detect + blur faces
    img = cv2.imread(str(img_path))
    if img is None:
        print(f"✗ Could not read {img_path.name}")
        sys.exit(1)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    detector = cv2.CascadeClassifier(CASCADE)
    faces = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        print(f"ℹ {img_path.name} — no faces detected. Review manually before publishing.")
    else:
        for (x, y, w, h) in faces:
            face_region = img[y:y+h, x:x+w]
            blurred = cv2.GaussianBlur(face_region, (99, 99), 30)
            img[y:y+h, x:x+w] = blurred
        print(f"✓ {img_path.name} — {len(faces)} face(s) censored")

    # Save censored version
    out_path = OUTPUT_DIR / img_path.name
    cv2.imwrite(str(out_path), img)
    print(f"  Censored saved → {out_path}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/censor-caso-images.py <image_or_directory>")
        sys.exit(1)

    target = Path(sys.argv[1])

    if target.is_dir():
        images = list(target.glob("*.jpg")) + list(target.glob("*.jpeg")) + list(target.glob("*.png"))
        if not images:
            print(f"No images found in {target}")
            sys.exit(0)
        for img in images:
            censor_image(img)
    elif target.is_file():
        censor_image(target)
    else:
        print(f"✗ Not found: {target}")
        sys.exit(1)

if __name__ == "__main__":
    main()
