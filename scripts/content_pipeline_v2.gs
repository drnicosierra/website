/**
 * drnicosierra.com — Content Pipeline helper (v2 — adds Comentarios column)
 *
 * This is a Google Apps Script bound to the "Content Imports" Google Sheet
 * (Sheet ID: 1IfkBJa7cGOEYe9mnJDb1b7kd0ngJRRKFPSww1cMV2kc). It does not run
 * from this repo — it lives in the Sheet's Extensions → Apps Script editor.
 * This copy is kept here for version control and so Claude can read the
 * exact import/export format without needing it pasted every session.
 */

const COLUMNS = {
  SECCION: 1,
  ELEMENTO: 2,
  TEXTO_ACTUAL: 3,
  TEXTO_NICO: 4,
  TEXTO_REVISADO: 5,
  ESTADO: 6,
  CAMPO_JSON: 7,
  COMENTARIOS: 8,
};

const SKIP_SHEETS = ['Instrucciones'];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Content Pipeline')
    .addItem('0. Agregar columna Comentarios (una sola vez)', 'agregarColumnaComentarios')
    .addItem('1. Exportar pendientes para Claude', 'exportarPendientes')
    .addItem('2. Importar revisiones de Claude', 'importarRevisiones')
    .addItem('3. Marcar estados (consistencia)', 'marcarEstados')
    .addToUi();
}

function agregarColumnaComentarios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets().filter(s => !SKIP_SHEETS.includes(s.getName()));
  let added = 0;

  sheets.forEach(sheet => {
    const existingHeader = sheet.getRange(1, COLUMNS.COMENTARIOS).getValue();
    if (existingHeader === 'Comentarios (Claude)') return;
    sheet.getRange(1, COLUMNS.COMENTARIOS).setValue('Comentarios (Claude)');
    sheet.getRange(1, COLUMNS.COMENTARIOS).setFontWeight('bold').setBackground('#1F3A4D').setFontColor('#FFFFFF');
    sheet.setColumnWidth(COLUMNS.COMENTARIOS, 320);
    added++;
  });

  SpreadsheetApp.getUi().alert(`Columna "Comentarios (Claude)" agregada en ${added} pestaña(s).`);
}

function exportarPendientes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets().filter(s => !SKIP_SHEETS.includes(s.getName()));
  let out = [];
  let count = 0;

  sheets.forEach(sheet => {
    const data = sheet.getDataRange().getValues();
    let sheetHasRows = false;
    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      const elemento = row[COLUMNS.ELEMENTO - 1];
      const nico = row[COLUMNS.TEXTO_NICO - 1];
      const revisado = row[COLUMNS.TEXTO_REVISADO - 1];
      if (!elemento) continue;
      if (nico && String(nico).trim() && (!revisado || !String(revisado).trim())) {
        if (!sheetHasRows) {
          out.push(`\nTAB: ${sheet.getName()}`);
          sheetHasRows = true;
        }
        const seccion = row[COLUMNS.SECCION - 1];
        out.push(`${seccion} | ${elemento}`);
        out.push(String(nico));
        out.push('---');
        count++;
      }
    }
  });

  const result = count === 0
    ? 'No hay filas pendientes de revisión ahora mismo.'
    : out.join('\n');

  showExportDialog(result, count);
}

function showExportDialog(text, count) {
  const html = HtmlService.createHtmlOutput(
    `<p><b>${count} fila(s) pendiente(s).</b> Copia todo el texto de abajo y pégalo en el chat con Claude.</p>` +
    `<textarea style="width:100%;height:400px;font-family:monospace;font-size:12px;">${escapeHtml(text)}</textarea>`
  ).setWidth(600).setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, 'Exportar pendientes para Claude');
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function importarRevisiones() {
  const ui = SpreadsheetApp.getUi();
  const html = HtmlService.createHtmlOutput(
    '<p>Pega aquí el texto que te dio Claude:</p>' +
    '<textarea id="t" style="width:100%;height:350px;font-family:monospace;font-size:12px;"></textarea>' +
    '<br><br><button onclick="google.script.run.withSuccessHandler(function(r){' +
    'document.getElementById(\'result\').innerText = r; })' +
    '.procesarImportacion(document.getElementById(\'t\').value)">Importar</button>' +
    '<p id="result"></p>'
  ).setWidth(600).setHeight(500);
  ui.showModalDialog(html, 'Importar revisiones de Claude');
}

function procesarImportacion(pastedText) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const lines = pastedText.split('\n');

  let currentSheet = null;
  let currentSeccion = null;
  let currentElemento = null;
  let buffer = [];
  let commentBuffer = [];
  let inComment = false;
  let written = 0;
  let notFound = [];

  function flush() {
    if (!currentSheet || !currentSeccion || !currentElemento || (buffer.length === 0 && commentBuffer.length === 0)) {
      buffer = []; commentBuffer = []; inComment = false;
      return;
    }
    const sheet = ss.getSheetByName(currentSheet);
    if (!sheet) { notFound.push(`Tab no encontrado: ${currentSheet}`); buffer = []; commentBuffer = []; inComment = false; return; }
    const data = sheet.getDataRange().getValues();
    let found = false;
    for (let r = 1; r < data.length; r++) {
      const seccion = String(data[r][COLUMNS.SECCION - 1] || '').trim();
      const elemento = String(data[r][COLUMNS.ELEMENTO - 1] || '').trim();
      if (seccion === currentSeccion.trim() && elemento === currentElemento.trim()) {
        if (buffer.length) {
          sheet.getRange(r + 1, COLUMNS.TEXTO_REVISADO).setValue(buffer.join('\n').trim());
        }
        if (commentBuffer.length) {
          sheet.getRange(r + 1, COLUMNS.COMENTARIOS).setValue(commentBuffer.join('\n').trim());
        }
        sheet.getRange(r + 1, COLUMNS.ESTADO).setValue('Pendiente Aprobación (Dr. Sierra)');
        found = true;
        written++;
        break;
      }
    }
    if (!found) notFound.push(`${currentSheet}: "${currentSeccion} | ${currentElemento}" no encontrado`);
    buffer = []; commentBuffer = []; inComment = false;
  }

  lines.forEach(line => {
    const tabMatch = line.match(/^TAB:\s*(.+)$/);
    if (tabMatch) {
      flush();
      currentSheet = tabMatch[1].trim();
      currentSeccion = null;
      currentElemento = null;
      return;
    }
    if (line.trim() === '---') {
      flush();
      currentSeccion = null;
      currentElemento = null;
      return;
    }
    if (currentSeccion === null && line.includes(' | ')) {
      const parts = line.split(' | ');
      currentSeccion = parts[0];
      currentElemento = parts.slice(1).join(' | ');
      return;
    }
    if (line.startsWith('COMENTARIO:')) {
      inComment = true;
      const rest = line.slice('COMENTARIO:'.length).trim();
      if (rest) commentBuffer.push(rest);
      return;
    }
    if (currentSeccion !== null) {
      if (inComment) commentBuffer.push(line);
      else buffer.push(line);
    }
  });
  flush();

  let msg = `${written} fila(s) actualizada(s).`;
  if (notFound.length) msg += `\n\nNo encontrado (revisar manualmente):\n${notFound.join('\n')}`;
  return msg;
}

function marcarEstados() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets().filter(s => !SKIP_SHEETS.includes(s.getName()));
  let changed = 0;

  sheets.forEach(sheet => {
    const data = sheet.getDataRange().getValues();
    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      const elemento = row[COLUMNS.ELEMENTO - 1];
      if (!elemento) continue;
      const nico = String(row[COLUMNS.TEXTO_NICO - 1] || '').trim();
      const revisado = String(row[COLUMNS.TEXTO_REVISADO - 1] || '').trim();
      const estadoActual = String(row[COLUMNS.ESTADO - 1] || '').trim();
      const texto_actual = String(row[COLUMNS.TEXTO_ACTUAL - 1] || '').trim();

      let nuevoEstado = null;
      if (texto_actual.includes('PENDIENTE')) {
        nuevoEstado = 'Placeholder — pendiente contenido real';
      } else if (nico && revisado) {
        nuevoEstado = 'Pendiente Aprobación (Dr. Sierra)';
      } else if (nico && !revisado) {
        nuevoEstado = 'Pendiente Revisión';
      } else if (!nico) {
        nuevoEstado = 'Live';
      }

      if (nuevoEstado && nuevoEstado !== estadoActual) {
        sheet.getRange(r + 1, COLUMNS.ESTADO).setValue(nuevoEstado);
        changed++;
      }
    }
  });

  SpreadsheetApp.getUi().alert(`${changed} estado(s) actualizado(s) por consistencia.`);
}
