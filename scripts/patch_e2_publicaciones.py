path = '/Users/renier/Developer/drnicosierra-website/src/pages/sobre-dr-nico-sierra.astro'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = """    </section>

    <section style="background:#001e2e;padding:clamp(56px,7vw,88px) 0;border-top:1px solid rgba(0,131,98,0.2);text-align:center;">"""

assert old in content, 'ABORT: anchor text not found — check file structure'

new = """    </section>

    <section class="section" style="background:#00111c;border-top:1px solid rgba(0,131,98,0.15);">
      <div class="container" style="max-width:860px;">
        <div class="sh">
          <div class="eyebrow">Publicaciones y reconocimientos</div>
          <h2>Investigación y presencia académica internacional</h2>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:32px;">
          <a href="https://link.springer.com/chapter/10.1007/978-3-030-59105-2_7" target="_blank" rel="noopener" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;">
            <span style="flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#4db896;padding-top:2px;">SPRINGER</span>
            <span><strong>Surgical Evaluation, Diagnosis, and Treatment Planning</strong><br><span style="font-size:.85rem;opacity:.6;">Global Cleft Care in Low-Resource Settings — Springer, 2021</span></span>
          </a>
          <a href="https://link.springer.com/chapter/10.1007/978-3-030-59105-2_23" target="_blank" rel="noopener" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;">
            <span style="flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#4db896;padding-top:2px;">SPRINGER</span>
            <span><strong>Orthognathic Surgery</strong><br><span style="font-size:.85rem;opacity:.6;">Global Cleft Care in Low-Resource Settings — Springer, 2021</span></span>
          </a>
          <a href="https://pubmed.ncbi.nlm.nih.gov/37403346/" target="_blank" rel="noopener" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;">
            <span style="flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#4db896;padding-top:2px;">PUBMED</span>
            <span><strong>Disability Caused by Cleft Lip and Palate: A Systematic Review</strong><br><span style="font-size:.85rem;opacity:.6;">Cleft Palate Craniofacial Journal, 2024 &mdash; con Children&rsquo;s Hospital of Philadelphia</span></span>
          </a>
          <a href="https://pubmed.ncbi.nlm.nih.gov/36655299/" target="_blank" rel="noopener" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;">
            <span style="flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#4db896;padding-top:2px;">PUBMED</span>
            <span><strong>Comparative Study of Maxillary Growth in Patients With Unilateral Cleft</strong><br><span style="font-size:.85rem;opacity:.6;">Cleft Palate Craniofacial Journal, 2024 &mdash; con UFPR Brasil</span></span>
          </a>
          <a href="https://pubmed.ncbi.nlm.nih.gov/29387307/" target="_blank" rel="noopener" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;">
            <span style="flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#4db896;padding-top:2px;">PUBMED</span>
            <span><strong>Bone Allograft Segment Covered with a Vascularized Fibular Periosteal Flap</strong><br><span style="font-size:.85rem;opacity:.6;">Craniomaxillofacial Trauma &amp; Reconstruction, 2018 &mdash; Vall d&rsquo;Hebron</span></span>
          </a>
          <a href="https://pubmed.ncbi.nlm.nih.gov/28140669/" target="_blank" rel="noopener" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;">
            <span style="flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#4db896;padding-top:2px;">PUBMED</span>
            <span><strong>Surgical Repositioning of the Premaxilla Using a Minimally Invasive Endonasal Approach</strong><br><span style="font-size:.85rem;opacity:.6;">Cleft Palate Craniofacial Journal, 2018 &mdash; Vall d&rsquo;Hebron</span></span>
          </a>
          <a href="https://www.elperiodico.com/es/sanidad/20170211/una-diminuta-protesis-facilita-solucion-fisura-labiopalatina-5792229" target="_blank" rel="noopener" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;">
            <span style="flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#4db896;padding-top:2px;">PRENSA</span>
            <span><strong>Una diminuta pr&oacute;tesis facilita la soluci&oacute;n de la fisura labiopalatina</strong><br><span style="font-size:.85rem;opacity:.6;">El Peri&oacute;dico, 2017</span></span>
          </a>
          <a href="https://www.nvinoticias.com/general/oaxaca/oaxaca-prioridad-en-proyecto-medico-humanitario/99705" target="_blank" rel="noopener" style="display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;color:inherit;">
            <span style="flex-shrink:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#4db896;padding-top:2px;">PRENSA</span>
            <span><strong>Oaxaca, prioridad en proyecto m&eacute;dico humanitario</strong><br><span style="font-size:.85rem;opacity:.6;">NVI Noticias &mdash; Misi&oacute;n MSI Oaxaca</span></span>
          </a>
        </div>
      </div>
    </section>

    <section style="background:#001e2e;padding:clamp(56px,7vw,88px) 0;border-top:1px solid rgba(0,131,98,0.2);text-align:center;">"""

content = content.replace(old, new)

assert 'Publicaciones y reconocimientos' in content, 'ABORT: section not found after replace'
assert 'springer.com/chapter' in content, 'ABORT: Springer links not found after replace'

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('E2 patch applied successfully')
