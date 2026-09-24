"""Convertit les images JPG/PNG en WebP et met à jour les références.

Usage :
  python scripts/convertir-webp.py                         → convertit les JPG/PNG ajoutés dans src/assets
  python scripts/convertir-webp.py --depuis-originaux      → réencode toutes les images depuis assets-originaux/
                                                              (pour changer la qualité sans perte cumulée)
  Options : --qualite N (défaut : 75)
            --max N     (défaut : 1920) plus grand côté en pixels ; les images plus grandes sont réduites

- Applique l'orientation EXIF (photos de téléphone) avant conversion ; conserve la transparence (PNG).
- Réduit les images dont la largeur ou la hauteur dépasse --max, en gardant leurs proportions.
- Remplace « /assets/…/nom.jpg|png » par « .webp » dans src/ (gabarits, données, CSS, JS).
- Range les originaux dans assets-originaux/ (non publié), en gardant l'arborescence.
"""
import argparse, re, shutil
from pathlib import Path
from PIL import Image, ImageOps

RACINE = Path(__file__).resolve().parent.parent
ASSETS = RACINE / "src" / "assets"
ORIGINAUX = RACINE / "assets-originaux"
EXTENSIONS = (".jpg", ".jpeg", ".png")

parser = argparse.ArgumentParser()
parser.add_argument("--qualite", type=int, default=75)
parser.add_argument("--max", type=int, default=1920)
parser.add_argument("--depuis-originaux", action="store_true")
args = parser.parse_args()

def encoder(source, cible):
    with Image.open(source) as im:
        im = ImageOps.exif_transpose(im)
        if max(im.size) > args.max:
            im.thumbnail((args.max, args.max), Image.LANCZOS)
        transparent = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        im.convert("RGBA" if transparent else "RGB").save(cible, "WEBP", quality=args.qualite, method=6)

if args.depuis_originaux:
    # Chaque original de assets-originaux/ produit src/assets/<même chemin>.webp
    travaux = [(o, ASSETS / o.relative_to(ORIGINAUX).with_suffix(".webp"))
               for o in sorted(ORIGINAUX.rglob("*")) if o.suffix.lower() in EXTENSIONS]
else:
    travaux = [(s, s.with_suffix(".webp"))
               for s in sorted(ASSETS.rglob("*")) if s.suffix.lower() in EXTENSIONS]

if not travaux:
    print("Aucune image à convertir.")
    raise SystemExit

avant = apres = 0
renommages = {}
for source, cible in travaux:
    precedent = cible.stat().st_size if cible.exists() else source.stat().st_size
    cible.parent.mkdir(parents=True, exist_ok=True)
    encoder(source, cible)
    b = cible.stat().st_size
    avant += precedent; apres += b
    rel_cible = cible.relative_to(ASSETS).as_posix()
    print(f"{rel_cible:42} {precedent/1e6:6.2f} Mo -> {b/1e6:6.2f} Mo")
    if not args.depuis_originaux:
        rel = source.relative_to(ASSETS).as_posix()
        renommages[rel] = rel_cible
        dest = ORIGINAUX / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(source), dest)

# Mise à jour des références dans src/ (nouvelles images uniquement)
fichiers_modifies = 0
if renommages:
    motif = re.compile(r"/assets/([\w/.-]+?\.(?:jpe?g|png))", re.I)
    for f in (RACINE / "src").rglob("*"):
        if f.suffix not in (".njk", ".json", ".css", ".js", ".md", ".html") or "assets" in f.parts:
            continue
        texte = f.read_text(encoding="utf-8")
        nouveau = motif.sub(lambda m: "/assets/" + renommages.get(m.group(1), m.group(1)), texte)
        if nouveau != texte:
            f.write_text(nouveau, encoding="utf-8", newline="\n")
            fichiers_modifies += 1

print(f"\n{len(travaux)} images, qualité {args.qualite}, max {args.max}px : {avant/1e6:.1f} Mo -> {apres/1e6:.1f} Mo")
if not args.depuis_originaux:
    print(f"{fichiers_modifies} fichiers de src/ mis à jour ; originaux rangés dans {ORIGINAUX.name}/")
