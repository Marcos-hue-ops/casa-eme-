"""
Gera os desenhos da marca a partir da fonte Baskervville (peso 600), com as
letras convertidas em contorno — o selo aparece igual em qualquer lugar, sem
depender de fonte carregada.

  src/assets/img/marca/selo-casa-eme.svg   selo usado no site
  tools/marca/selo-icone.svg               selo de traço mais grosso, base dos ícones PNG
  src/static/favicon.svg                   o M ("eme") dentro do anel duplo

As medidas reproduzem a logo do perfil do Instagram (fotos/referencias/
logo-perfil-instagram.jpg): disco creme, dois anéis finos e o nome ao centro.
Assim que o arquivo vetorial original da logo existir, ele substitui estes.

Uso (precisa de Python com fonttools e brotli: pip install fonttools brotli):
  python3 tools/marca/gerar-selo.py && npm run icons
"""
import os
RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..') + '/'
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

font = TTFont(RAIZ + 'src/assets/fonts/baskervville-latin.woff2')
font = instantiateVariableFont(font, {'wght': 600})
gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font['head'].unitsPerEm
cap = font['OS/2'].sCapHeight or 700

def palavra(texto, tracking_em):
    """Devolve lista (glifo, x) em unidades da fonte e a largura total sem o tracking final."""
    x = 0; itens = []
    for i, ch in enumerate(texto):
        g = cmap[ord(ch)]
        itens.append((g, x))
        adv = gs[g].width
        x += adv + (tracking_em * upm if i < len(texto) - 1 else 0)
    # largura visual: do lsb do primeiro ao fim do último contorno
    bp0 = BoundsPen(gs); gs[itens[0][0]].draw(bp0)
    bpn = BoundsPen(gs); gs[itens[-1][0]].draw(bpn)
    x0 = bp0.bounds[0]; x1 = itens[-1][1] + bpn.bounds[2]
    return itens, x0, x1

def path_de(texto, tracking_em, cx, cy, altura_caixa):
    itens, x0, x1 = palavra(texto, tracking_em)
    s = altura_caixa / cap
    largura = (x1 - x0) * s
    ox = cx - largura / 2 - x0 * s
    oy = cy + altura_caixa / 2
    pen = SVGPathPen(gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    for g, x in itens:
        tp = TransformPen(pen, (s, 0, 0, -s, ox + x * s, oy))
        gs[g].draw(tp)
    return pen.getCommands(), largura

MARROM = '#74501C'; CREME = '#F3E6D6'

# Selo completo (viewBox 500)
d, w = path_de('CASA EME', 0.1, 250, 250, 43.5)
print('largura texto selo', round(w, 1))
selo = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" role="img" aria-labelledby="t"><title id="t">Casa EME</title><circle cx="250" cy="250" r="250" fill="{CREME}"/><g fill="none" stroke="{MARROM}" stroke-width="3.4"><circle cx="250" cy="250" r="229"/><circle cx="250" cy="250" r="204"/></g><path fill="{MARROM}" d="{d}"/></svg>'''
open(RAIZ + 'src/assets/img/marca/selo-casa-eme.svg','w').write(selo + '\n')

# Selo para ícones (anéis mais grossos: o desenho vai a 180px e menos)
d2, _ = path_de('CASA EME', 0.08, 250, 250, 44)
icone = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><circle cx="250" cy="250" r="250" fill="{CREME}"/><g fill="none" stroke="{MARROM}"><circle cx="250" cy="250" r="226" stroke-width="7"/><circle cx="250" cy="250" r="198" stroke-width="5"/></g><path fill="{MARROM}" d="{d2}"/></svg>'''
open(RAIZ + 'tools/marca/selo-icone.svg','w').write(icone + '\n')

# Favicon: o M — "eme" é o nome da letra — dentro do anel duplo
d3, _ = path_de('M', 0, 32, 32.6, 25)
fav = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="{CREME}"/><g fill="none" stroke="{MARROM}"><circle cx="32" cy="32" r="29.2" stroke-width="2.2"/><circle cx="32" cy="32" r="25.4" stroke-width="1.4"/></g><path fill="{MARROM}" d="{d3}"/></svg>'''
open(RAIZ + 'src/static/favicon.svg','w').write(fav + '\n')
print('ok', len(selo), len(icone), len(fav))
