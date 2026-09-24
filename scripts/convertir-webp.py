"""Convertit les images JPG/PNG de src/assets en WebP (qualité 85) et met à jour les références.

Usage : python scripts/convertir-webp.py [--qualite 85]
- Applique l'orientation EXIF (photos de téléphone) avant conversion ; conserve la transparence (PNG).
- Remplace « /assets/…/nom.jpg|png » par « .webp » dans src/ (gabarits, données, CSS, JS).
- Déplace les originaux dans assets-originaux/ (non publié), en gardant l'arborescence.
Relançable : ne traite que les JPG/PNG encore présents dans src/assets.
"""
import argparse, re, shutil
from pathlib import Path
from PIL import Image, ImageOps

RACINE = Path(__file__).resolve().parent.parent
ASSETS = RACINE / "src" / "assets"
ORIGINAUX = RACINE / "assets-originaux"

parser = argparse.ArgumentParser()
parser.add_argument("--qualite", type=int, default=85)
qualite = parser.parse_args().qualite

images = sorted(p for p in ASSETS.rglob("*") if p.suffix.lower() in (".jpg", ".jpeg", ".png"))
if not images:
    print("Aucune image JPG/PNG à convertir.")
    raise SystemExit

avant = apres = 0
renommages = {}
for src in images:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        transparent = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        im = im.convert("RGBA" if transparent else "RGB")
        cible = src.with_suffix(".webp")
        im.save(cible, "WEBP", quality=qualite, method=6)
    a, b = src.stat().st_size, cible.stat().st_size
    avant += a; apres += b
    rel = src.relative_to(ASSETS).as_posix()
    renommages[rel] = cible.relative_to(ASSETS).as_posix()
    print(f"{rel:42} {a/1e6:6.2f} Mo -> {b/1e6:6.2f} Mo")
    dest = ORIGINAUX / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src), dest)

# Mise à jour des références dans src/
motif = re.compile(r"/assets/([\w/.-]+?\.(?:jpe?g|png))", re.I)
fichiers_modifies = 0
for f in (RACINE / "src").rglob("*"):
    if f.suffix not in (".njk", ".json", ".css", ".js", ".md", ".html") or "assets" in f.parts:
        continue
    texte = f.read_text(encoding="utf-8")
    nouveau = motif.sub(lambda m: "/assets/" + renommages.get(m.group(1), m.group(1)), texte)
    if nouveau != texte:
        f.write_text(nouveau, encoding="utf-8", newline="\n")
        fichiers_modifies += 1

print(f"\n{len(images)} images : {avant/1e6:.1f} Mo -> {apres/1e6:.1f} Mo ({100 - apres*100/avant:.0f} % de moins)")
print(f"{fichiers_modifies} fichiers de src/ mis à jour ; originaux déplacés dans {ORIGINAUX.name}/")
