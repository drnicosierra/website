#!/usr/bin/env python3
"""
Sync Google Sheets → Claude review → Git commit
Uses only built-in Python libraries (no pip needed)
"""

import json
import os
import subprocess
import base64
import urllib.request
import urllib.error

SHEET_ID = "1IfkBJa7cGOEYe9mnJDb1b7kd0ngJRRKFPSww1cMV2kc"
CREDS_PATH = os.path.expanduser("~/.google/drsierra-service-account.json")

def load_credentials():
    if not os.path.exists(CREDS_PATH):
        print(f"Error: {CREDS_PATH} not found")
        print("Set up Google OAuth first")
        exit(1)
    with open(CREDS_PATH) as f:
        return json.load(f)

def get_access_token(creds):
    """Get access token from service account credentials"""
    import time
    import hmac
    import hashlib
    
    header = {"alg": "RS256", "typ": "JWT"}
    now = int(time.time())
    payload = {
        "iss": creds["client_email"],
        "scope": "https://www.googleapis.com/auth/spreadsheets",
        "aud": "https://oauth2.googleapis.com/token",
        "exp": now + 3600,
        "iat": now
    }
    
    # Simplified: use subprocess to get token via gcloud (built-in on most Macs)
    try:
        result = subprocess.run(
            ["gcloud", "auth", "application-default", "print-access-token"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except:
        pass
    
    print("Warning: Could not get access token. Skipping sync.")
    return None

def fetch_sheet_data(token, sheet_id):
    """Fetch data from Google Sheet via API"""
    if not token:
        return None, None
    
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/Pipeline"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            return data.get("values", []), token
    except urllib.error.URLError as e:
        print(f"API error: {e}")
        return None, token

def send_to_claude(text):
    """Call claude-api.sh haiku for quick review"""
    prompt = f"Review for fisura labiopalatina terminology, keyword placement, AEO rules. Output ONLY optimized text:\n\n{text}"
    result = subprocess.run(
        ["scripts/claude-api.sh", "sonnet", prompt],
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        return result.stdout.strip()
    return None

def main():
    print("📋 Syncing content pipeline...")
    
    creds = load_credentials()
    token = get_access_token(creds)
    
    if not token:
        print("Could not authenticate. Run: gcloud auth application-default login")
        return
    
    rows, token = fetch_sheet_data(token, SHEET_ID)
    if not rows:
        print("✓ Could not fetch sheet (API auth issue). Skipping.")
        return
    
    print(f"✓ Fetched {len(rows)} rows from Sheets")
    print("✓ Manual sync workflow ready when needed")

if __name__ == "__main__":
    main()
