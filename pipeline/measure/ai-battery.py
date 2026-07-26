#!/usr/bin/env python3
"""
ai-battery.py — AI citation battery for drnicosierra.com SEO/AEO baseline.
Usage:
    python3 ai-battery.py --dry-run     # Single prompt, 1 run each engine
    python3 ai-battery.py               # Full 25x3x3 battery
"""
import sys, os, sqlite3, re
from datetime import datetime
from typing import Optional, List
import requests
import google.generativeai as genai
from openai import OpenAI

OPENAI_KEY = os.environ.get('OPENAI_API_KEY')
GEMINI_KEY = os.environ.get('GEMINI_API_KEY')
PERPLEXITY_KEY = os.environ.get('PERPLEXITY_API_KEY')

if not all([OPENAI_KEY, GEMINI_KEY, PERPLEXITY_KEY]):
    print('ERROR: Missing API keys.')
    sys.exit(1)

DB_PATH = os.path.expanduser('~/Developer/drnicosierra-website/pipeline/measure/ai-battery.db')
MARKDOWN_PATH = os.path.expanduser('~/Developer/drnicosierra-website/docs/baselines/ai-baseline-2026-07.md')

BRAND_PATTERNS = [
    r'Dr\.?\s+Nico\s+Sierra',
    r'Dr\.?\s+Nicol[aá]s\s+Sierra',
    r'Nicol[aá]s\s+E\.?\s+Sierra',
    r'NE\s+Sierra',
]

COMPETITORS = ['Operation Smile', 'Smile Train', 'Clínica Tresserra']

PROMPTS = [
    {'lang': 'es', 'category': 'prenatal', 'text': 'a mi bebé le han diagnosticado fisura labiopalatina, qué hago ahora'},
    {'lang': 'es', 'category': 'surgeon_finding', 'text': 'quién opera fisura labiopalatina en España'},
    {'lang': 'es', 'category': 'surgeon_finding', 'text': 'mejor cirujano de fisura labiopalatina en Barcelona'},
    {'lang': 'es', 'category': 'surgeon_finding', 'text': 'especialista fisura labiopalatina España'},
    {'lang': 'es', 'category': 'procedure', 'text': 'a qué edad se opera el labio fisurado'},
    {'lang': 'es', 'category': 'procedure', 'text': 'qué es la ortopedia NAM fisura labiopalatina'},
    {'lang': 'es', 'category': 'procedure', 'text': 'cómo es la cirugía de paladar hendido'},
    {'lang': 'es', 'category': 'procedure', 'text': 'cirugía labio fisurado en bebés'},
    {'lang': 'es', 'category': 'procedure', 'text': 'injerto óseo alveolar fisura labiopalatina'},
    {'lang': 'es', 'category': 'revision', 'text': 'cirugía de revisión de labio fisurado en adultos España'},
    {'lang': 'es', 'category': 'revision', 'text': 'revisión estética labio fisurado adultos'},
    {'lang': 'es', 'category': 'identity', 'text': 'quién es el Dr. Nico Sierra'},
    {'lang': 'es', 'category': 'identity', 'text': 'quién es el Dr. Nicolás Sierra cirujano maxilofacial'},
    {'lang': 'es', 'category': 'identity', 'text': 'Dr. Sierra Barcelona fisura labiopalatina'},
    {'lang': 'es', 'category': 'terminology', 'text': 'labio leporino qué es'},
    {'lang': 'es', 'category': 'terminology', 'text': 'tratamiento labio leporino en España'},
    {'lang': 'es', 'category': 'terminology', 'text': 'diferencia labio leporino fisura labiopalatina'},
    {'lang': 'en', 'category': 'international', 'text': 'cleft lip and palate surgeon in Spain for international patients'},
    {'lang': 'en', 'category': 'international', 'text': 'best cleft surgeon Spain Barcelona international'},
    {'lang': 'es', 'category': 'procedure', 'text': 'ortognática fisura labiopalatina'},
    {'lang': 'es', 'category': 'procedure', 'text': 'rinoplastia después de labio fisurado'},
    {'lang': 'es', 'category': 'surgeon_finding', 'text': 'cirujano maxilofacial especializado Barcelona'},
    {'lang': 'es', 'category': 'prenatal', 'text': 'diagnóstico prenatal fisura labiopalatina qué hacer'},
    {'lang': 'es', 'category': 'procedure', 'text': 'cicatriz labio fisurado corrección'},
    {'lang': 'es', 'category': 'surgeon_finding', 'text': 'cirujano fisura labiopalatina experiencia internacional España'},
]

assert len(PROMPTS) == 25, f'Expected 25 prompts, got {len(PROMPTS)}'

def is_mentioned(text: str) -> bool:
    for p in BRAND_PATTERNS:
        if re.search(p, text, re.IGNORECASE):
            return True
    return False

def extract_url(text: str) -> Optional[str]:
    urls = re.findall(r'https?://[^\s\)\"\']+', text)
    for url in urls:
        if 'drnicosierra' in url:
            return url
    return urls[0] if urls else None

def extract_position(text: str) -> Optional[int]:
    if not is_mentioned(text):
        return None
    sentences = text.split('.')
    total = len(sentences)
    for p in BRAND_PATTERNS:
        for idx, sent in enumerate(sentences):
            if re.search(p, sent, re.IGNORECASE):
                if idx < total / 3:
                    return 1
                elif idx < 2 * total / 3:
                    return 2
                else:
                    return 3
    return 2

def extract_competitors(text: str) -> List[str]:
    return [c for c in COMPETITORS if c.lower() in text.lower()]

def call_openai(prompt: str) -> str:
    client = OpenAI(api_key=OPENAI_KEY)
    try:
        response = client.responses.create(
            model='gpt-4o',
            tools=[{'type': 'web_search_preview'}],
            input=prompt,
        )
        return response.output_text
    except Exception as e:
        return f'ERROR: {e}'

def call_gemini(prompt: str) -> str:
    genai.configure(api_key=GEMINI_KEY)
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(
            prompt,
            tools='google_search_retrieval',
        )
        return response.text
    except Exception as e:
        return f'ERROR: {e}'

def call_perplexity(prompt: str) -> str:
    try:
        r = requests.post(
            'https://api.perplexity.ai/chat/completions',
            headers={'Authorization': f'Bearer {PERPLEXITY_KEY}', 'Content-Type': 'application/json'},
            json={'model': 'sonar', 'messages': [{'role': 'user', 'content': prompt}], 'max_tokens': 1000, 'temperature': 0.0},
            timeout=30,
        )
        if r.status_code == 200:
            return r.json()['choices'][0]['message']['content']
        return f'ERROR: HTTP {r.status_code} {r.text[:200]}'
    except Exception as e:
        return f'ERROR: {e}'

class AIBattery:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.results = []
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        conn.execute('''CREATE TABLE IF NOT EXISTS battery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT, prompt_text TEXT, prompt_category TEXT, prompt_lang TEXT,
            engine TEXT, run_number INTEGER, mentioned INTEGER, cited_url TEXT,
            position_in_answer INTEGER, competitors TEXT, full_response TEXT)''')
        conn.commit()
        conn.close()

    def log(self, engine, prompt, category, lang, run_num, response):
        self.results.append({
            'timestamp': datetime.utcnow().isoformat(),
            'prompt_text': prompt, 'prompt_category': category, 'prompt_lang': lang,
            'engine': engine, 'run_number': run_num,
            'mentioned': 1 if is_mentioned(response) else 0,
            'cited_url': extract_url(response),
            'position_in_answer': extract_position(response),
            'competitors': ','.join(extract_competitors(response)),
            'full_response': response,
        })

    def run(self):
        prompts = PROMPTS[:1] if self.dry_run else PROMPTS
        runs = 1 if self.dry_run else 3
        print(f'{"DRY-RUN" if self.dry_run else "FULL BATTERY"} — {len(prompts)} prompts x {runs} runs x 3 engines = {len(prompts)*runs*3} calls')
        for i, p in enumerate(prompts, 1):
            print(f'\n[{i}/{len(prompts)}] {p["category"]} ({p["lang"]}): {p["text"][:60]}')
            for run in range(1, runs + 1):
                print(f'  run {run}: OpenAI...', end='', flush=True)
                self.log('OpenAI gpt-4o', p['text'], p['category'], p['lang'], run, call_openai(p['text']))
                print('✓  Gemini...', end='', flush=True)
                self.log('Google Gemini', p['text'], p['category'], p['lang'], run, call_gemini(p['text']))
                print('✓  Perplexity...', end='', flush=True)
                self.log('Perplexity sonar', p['text'], p['category'], p['lang'], run, call_perplexity(p['text']))
                print('✓')
        self.write_db()
        self.write_markdown()
        print(f'\nDone. DB: {DB_PATH}')
        print(f'Markdown: {MARKDOWN_PATH}')

    def write_db(self):
        conn = sqlite3.connect(DB_PATH)
        for r in self.results:
            conn.execute('''INSERT INTO battery
                (timestamp,prompt_text,prompt_category,prompt_lang,engine,run_number,
                mentioned,cited_url,position_in_answer,competitors,full_response)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)''',
                (r['timestamp'],r['prompt_text'],r['prompt_category'],r['prompt_lang'],
                r['engine'],r['run_number'],r['mentioned'],r['cited_url'],
                r['position_in_answer'],r['competitors'],r['full_response']))
        conn.commit()
        conn.close()

    def write_markdown(self):
        os.makedirs(os.path.dirname(MARKDOWN_PATH), exist_ok=True)
        total = len(self.results)
        m_count = sum(1 for r in self.results if r['mentioned'])
        engines = {}
        for r in self.results:
            e = r['engine']
            if e not in engines:
                engines[e] = {'total': 0, 'mentioned': 0, 'urls': set(), 'competitors': set()}
            engines[e]['total'] += 1
            if r['mentioned']:
                engines[e]['mentioned'] += 1
            if r['cited_url']:
                engines[e]['urls'].add(r['cited_url'])
            if r['competitors']:
                for c in r['competitors'].split(','):
                    if c:
                        engines[e]['competitors'].add(c)
        md = f'# AI Citation Battery Baseline — {datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")}\n\n'
        md += f'**Mode:** {"DRY-RUN" if self.dry_run else "FULL BATTERY (25x3x3)"}\n\n'
        md += f'## Summary\n\n- Total calls: {total}\n- Mentioned: {m_count}/{total} ({m_count/total*100:.1f}%)\n\n'
        md += '## Per-Engine\n\n'
        for e, s in sorted(engines.items()):
            pct = s["mentioned"]/s["total"]*100 if s["total"] else 0
            md += f'### {e}\n- Calls: {s["total"]}\n- Mentioned: {s["mentioned"]} ({pct:.1f}%)\n'
            md += f'- URLs cited: {len(s["urls"])}\n- Competitors: {", ".join(sorted(s["competitors"])) or "None"}\n\n'
        md += '## Raw Results\n\n| Engine | Run | Category | Mentioned | URL | Position | Competitors |\n|---|---|---|---|---|---|---|\n'
        for r in self.results:
            md += f'| {r["engine"]} | {r["run_number"]} | {r["prompt_category"]} | {"✓" if r["mentioned"] else "✗"} | {r["cited_url"] or "—"} | {r["position_in_answer"] or "—"} | {r["competitors"] or "—"} |\n'
        with open(MARKDOWN_PATH, 'w', encoding='utf-8') as f:
            f.write(md)

if __name__ == '__main__':
    AIBattery('--dry-run' in sys.argv).run()
