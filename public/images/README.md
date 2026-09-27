# Product Images

10 bijoux images en WebP pour optimiser le chargement.

## Format
- **WebP** : format moderne (80% compression vs JPEG)
- **Taille** : 400x400px
- **Quality** : 80

## Compression (libwebp)
```bash
# Installer
apt install libwebp

# Convertir JPG → WebP
cwebp -quality 80 image.jpg -o image.webp

# Batch
for f in *.jpg; do cwebp -quality 80 "$f" -o "${f%.jpg}.webp"; done
```

## Usage HTML
```html
<picture>
  <source srcset="images/ring-1.webp" type="image/webp">
  <img src="images/ring-1.jpg" alt="Ring">
</picture>
```
