#!/usr/bin/env node
/**
 * Generate docs/Neo-CYCLONE-User-Manual.pdf from docs/USER_MANUAL.md
 * Requires: playwright (dev or workspace), python3 with no deps (inline converter)
 * Usage: node scripts/generate-manual-pdf.mjs
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mdPath = path.join(root, "docs/USER_MANUAL.md");
const htmlPath = path.join(root, "docs/manual-print.html");
const pdfPath = path.join(root, "docs/Neo-CYCLONE-User-Manual.pdf");

const py = `
from pathlib import Path
import re, html as html_lib, sys
md = Path(sys.argv[1]).read_text()
ver_m = re.search(r'\\*\\*Version\\*\\*\\s*\\|\\s*([^\\n|]+)', md)
version = (ver_m.group(1).strip() if ver_m else '1.0.0')

def esc(s): return html_lib.escape(s)
def inline(s):
    codes=[]
    def save(m):
        codes.append(m.group(1)); return f'\\x00C{len(codes)-1}\\x00'
    s=re.sub(r'\`([^\`]+)\`', save, s)
    s=re.sub(r'\\[([^\\]]+)\\]\\(([^)]+)\\)', r'<a href="\\2">\\1</a>', s)
    s=re.sub(r'\\*\\*(.+?)\\*\\*', r'<strong>\\1</strong>', s)
    s=re.sub(r'(?<![\\w*])\\*(?!\\*)([^*]+)\\*(?!\\*)', r'<em>\\1</em>', s)
    for i,c in enumerate(codes):
        s=s.replace(f'\\x00C{i}\\x00', f'<code>{esc(c)}</code>')
    return s
def split_cells(line):
    line=line.strip()
    if line.startswith('|'): line=line[1:]
    if line.endswith('|'): line=line[:-1]
    return [c.strip() for c in line.split('|')]
def is_sep(row):
    return all(re.match(r'^:?-+:?$', c.replace(' ','')) for c in row)
parts=[]; i=0; lines=md.splitlines()
while i < len(lines):
    line=lines[i]
    if not line.strip() or line.strip()=='---':
        i+=1; continue
    if line.startswith('# '):
        parts.append(f'<h1>{inline(line[2:].strip())}</h1>'); i+=1; continue
    if line.startswith('## '):
        parts.append(f'<h2>{inline(line[3:].strip())}</h2>'); i+=1; continue
    if line.startswith('### '):
        parts.append(f'<h3>{inline(line[4:].strip())}</h3>'); i+=1; continue
    if line.strip().startswith('\`\`\`'):
        i+=1; code=[]
        while i < len(lines) and not lines[i].strip().startswith('\`\`\`'):
            code.append(lines[i]); i+=1
        if i < len(lines): i+=1
        parts.append(f'<pre><code>{esc(chr(10).join(code))}</code></pre>'); continue
    if line.strip().startswith('|'):
        rows=[]
        while i < len(lines) and lines[i].strip().startswith('|'):
            rows.append(split_cells(lines[i])); i+=1
        if len(rows)<2: continue
        head, body = rows[0], rows[1:]
        if body and is_sep(body[0]): body=body[1:]
        th=''.join(f'<th>{inline(c)}</th>' for c in head)
        trs=[]
        for row in body:
            while len(row)<len(head): row.append('')
            trs.append('<tr>'+''.join(f'<td>{inline(c)}</td>' for c in row[:len(head)])+'</tr>')
        parts.append(f'<table><thead><tr>{th}</tr></thead><tbody>{"".join(trs)}</tbody></table>'); continue
    if line.startswith('>'):
        q=[]
        while i < len(lines) and lines[i].startswith('>'):
            q.append(lines[i].lstrip('> ').strip()); i+=1
        parts.append(f'<blockquote>{inline(" ".join(q))}</blockquote>'); continue
    if re.match(r'^[-*] ', line):
        items=[]
        while i < len(lines) and re.match(r'^[-*] ', lines[i]):
            items.append(inline(re.sub(r'^[-*] ', '', lines[i]))); i+=1
        parts.append('<ul>'+''.join(f'<li>{it}</li>' for it in items)+'</ul>'); continue
    if re.match(r'^\\d+\\. ', line):
        items=[]
        while i < len(lines) and re.match(r'^\\d+\\. ', lines[i]):
            items.append(inline(re.sub(r'^\\d+\\. ', '', lines[i]))); i+=1
        parts.append('<ol>'+''.join(f'<li>{it}</li>' for it in items)+'</ol>'); continue
    if line.startswith('**Q:'):
        q=line; i+=1; a=''
        if i < len(lines) and lines[i].startswith('A:'): a=lines[i]; i+=1
        parts.append(f'<div class="faq"><p class="q">{inline(q)}</p><p class="a">{inline(a)}</p></div>'); continue
    if line.startswith('*') and line.endswith('*') and line.count('*')==2:
        parts.append(f'<p class="footer-note">{inline(line.strip("*"))}</p>'); i+=1; continue
    parts.append(f'<p>{inline(line.strip())}</p>'); i+=1
content='\\n'.join(parts)
html=f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Neo-CYCLONE User Manual v{esc(version)}</title>
<style>
@page {{ size: A4; margin: 16mm 15mm 18mm 15mm; }}
body {{ font-family: "Segoe UI","Helvetica Neue",Arial,sans-serif; font-size:10.5pt; line-height:1.55; color:#1a1814; }}
.cover {{ page-break-after:always; min-height:240mm; display:flex; flex-direction:column; justify-content:center; padding:12mm 8mm; border-top:6px solid #c9a227; }}
.cover h1 {{ font-size:28pt; margin:0 0 8px; border:none; }}
.cover .tagline {{ font-size:11pt; letter-spacing:0.14em; text-transform:uppercase; color:#c9a227; font-weight:600; }}
.cover .blurb {{ font-size:12pt; max-width:420px; color:#3d3830; line-height:1.65; margin-top:16px; }}
.cover .meta {{ margin-top:36px; font-size:9.5pt; color:#5c564e; line-height:1.7; }}
.gold-rule {{ height:2px; width:64px; background:linear-gradient(90deg,#c9a227,#e8d48b); margin:10px 0 16px; }}
h1 {{ font-size:18pt; margin:28px 0 10px; border-bottom:2px solid #c9a227; padding-bottom:6px; page-break-after:avoid; }}
h2 {{ font-size:14pt; margin:22px 0 8px; page-break-after:avoid; }}
h3 {{ font-size:11.5pt; margin:16px 0 6px; page-break-after:avoid; }}
p {{ margin:0 0 9px; }}
ul,ol {{ margin:6px 0 12px; padding-left:1.3em; }}
li {{ margin-bottom:4px; }}
code {{ font-family:Consolas,"Courier New",monospace; font-size:9pt; background:#f5f1e8; border:1px solid #e5dcc8; border-radius:3px; padding:0 4px; }}
pre {{ background:#f7f4ed; border:1px solid #e0d6c2; border-left:4px solid #c9a227; border-radius:4px; padding:10px 12px; font-size:8.5pt; page-break-inside:avoid; margin:10px 0 14px; white-space:pre-wrap; }}
pre code {{ background:none; border:none; padding:0; }}
table {{ width:100%; border-collapse:collapse; margin:10px 0 16px; font-size:9pt; page-break-inside:avoid; }}
th {{ background:#f0ebe0; text-align:left; font-size:8pt; text-transform:uppercase; padding:7px 8px; border-bottom:2px solid #c9a227; }}
td {{ padding:7px 8px; border-bottom:1px solid #e8e2d6; vertical-align:top; }}
tr:nth-child(even) td {{ background:#fcfaf6; }}
blockquote {{ margin:14px 0; padding:12px 16px; border:1px solid #e0d4a8; border-left:4px solid #c9a227; background:#fbf7eb; border-radius:4px; page-break-inside:avoid; }}
.faq {{ margin:10px 0; padding:8px 12px; border:1px solid #ebe5d8; border-radius:4px; page-break-inside:avoid; }}
.faq .q {{ font-weight:600; margin:0 0 4px; }} .faq .a {{ margin:0; }}
.footer-note {{ margin-top:24px; font-size:9pt; color:#6b6560; font-style:italic; }}
a {{ color:#8a7018; text-decoration:none; }}
</style></head><body>
<section class="cover">
  <h1>Neo-CYCLONE</h1>
  <p class="tagline">AI-Assisted Construction Operation Simulation</p>
  <div class="gold-rule"></div>
  <p class="blurb">User Manual for students, instructors, and practitioners who want to understand construction operations as <em>flow</em>—in the spirit of Daniel W. Halpin’s CYCLONE.</p>
  <div class="meta">
    <div><strong>Version</strong> {esc(version)}</div>
    <div><strong>Live studio</strong> https://neo-cyclone.vercel.app/</div>
    <div><strong>Language</strong> English</div>
    <div><strong>References</strong> at the end of this document</div>
  </div>
</section>
<main>
{content}
</main>
</body></html>
'''
Path(sys.argv[2]).write_text(html)
print('html', version, len(html))
`

const r = spawnSync("python3", ["-c", py, mdPath, htmlPath], { encoding: "utf8" });
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
console.log(r.stdout.trim());

const require = createRequire(import.meta.url);
let chromium;
try {
  chromium = require("playwright").chromium;
} catch {
  try {
    chromium = require("/workspace/node_modules/playwright").chromium;
  } catch (e) {
    console.error("Install playwright: npm i -D playwright");
    process.exit(1);
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("file://" + htmlPath, { waitUntil: "networkidle" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  footerTemplate: `<div style="width:100%;font-size:8.5px;color:#6b6560;font-family:Segoe UI,sans-serif;padding:0 14mm;display:flex;justify-content:space-between;">
    <span>Neo-CYCLONE · AI-Assisted Construction Operation Simulation</span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
  </div>`,
  margin: { top: "16mm", bottom: "18mm", left: "15mm", right: "15mm" },
});
await browser.close();
console.log("PDF", pdfPath, fs.statSync(pdfPath).size, "bytes");
