#!/usr/bin/env python3
"""
Automatic face censoring for casos clínicos (Vidas Transformadas).
Runs during build. Detects faces via mediapipe, censors via Pillow blur.
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw
import mediapipe as mp
import cv2
import json

def process_caso_images(src_dir: str, output_dir: str):
    """
    Scan src_dir for images, detect faces, blur, output to output_dir.
    """
    src_path = Path(src_dir)
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    
    mp_face = mp.solutions.face_detection
    
    results = {"processed": 0, "faces_censored": 0, "errors": []}
    
    # Find all images in source
    for img_file in src_path.glob("**/*.{jpg,jpeg,png,JPG,PNG}"):
        try:
            # Read with OpenCV for mediapipe
            cv_img = cv2.imread(str(img_file))
            if cv_img is None:
                results["errors"].append(f"Could not read {img_file}")
                continue
            
            h, w, _ = cv_img.shape
            
            # Detect faces
            with mp_face.FaceDetection(min_detection_confidence=0.7) as detector:
                result = detector.process(cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB))
            
            # If faces found, blur them
            faces_found = False
            if result.detections:
                faces_found = True
                pil_img = Image.open(img_file).convert("RGB")
                draw = ImageDraw.Draw(pil_img)
                
                for detection in result.detections:
                    bbox = detection.location_data.relative_bounding_box
                    x_min = max(0, int(bbox.xmin * pil_img.width))
                    y_min = max(0, int(bbox.ymin * pil_img.height))
                    x_max = min(pil_img.width, int((bbox.xmin + bbox.width) * pil_img.width))
                    y_max = min(pil_img.height, int((bbox.ymin + bbox.height) * pil_img.height))
                    
                    # Blur the face region
                    face_region = pil_img.crop((x_min, y_min, x_max, y_max))
                    face_region = face_region.filter(ImageFilter.GaussianBlur(radius=20))
                    pil_img.paste(face_region, (x_min, y_min, x_max, y_max))
                    
                    results["faces_censored"] += 1
                
                # Save censored image
                out_img = out_path / img_file.relative_to(src_path)
                out_img.parent.mkdir(parents=True, exist_ok=True)
                pil_img.save(out_img, "JPEG" if img_file.suffix.lower() in [".jpg", ".jpeg"] else "PNG")
                
                print(f"✓ Censored {img_file.name} ({len(result.detections)} face(s))")
                results["processed"] += 1
            else:
                # No faces — copy original
                out_img = out_path / img_file.relative_to(src_path)
                out_img.parent.mkdir(parents=True, exist_ok=True)
                pil_img = Image.open(img_file).convert("RGB")
                pil_img.save(out_img, "JPEG" if img_file.suffix.lower() in [".jpg", ".jpeg"] else "PNG")
                results["processed"] += 1
        
        except Exception as e:
            results["errors"].append(f"{img_file}: {str(e)}")
            print(f"✗ Error processing {img_file}: {e}")
    
    # Summary
    print(f"\n✓ Processed {results['processed']} caso images")
    print(f"  Faces censored: {results['faces_censored']}")
    if results["errors"]:
        print(f"  Errors: {len(results['errors'])}")
        for err in results["errors"]:
            print(f"    - {err}")
    
    return results

if __name__ == "__main__":
    src = "src/content/vidas-transformadas"
    out = "dist/vidas-transformadas"
    
    if not Path(src).exists():
        print(f"Source directory {src} not found. Skipping.")
        sys.exit(0)
    
    results = process_caso_images(src, out)
    sys.exit(0 if not results["errors"] else 1)
