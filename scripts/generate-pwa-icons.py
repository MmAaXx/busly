#!/usr/bin/env python3
"""
Script pour générer les icônes PWA en différentes tailles
Utilise Pillow pour redimensionner l'icône source
"""

import os
from PIL import Image, ImageOps
import sys

def generate_pwa_icons(source_image_path, output_dir):
    """
    Génère toutes les icônes PWA nécessaires
    """
    # Tailles d'icônes PWA recommandées
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    try:
        # Ouvrir l'image source
        with Image.open(source_image_path) as img:
            # Convertir en RGBA si nécessaire
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            print(f"📱 Génération des icônes PWA depuis: {source_image_path}")
            print(f"📁 Dossier de sortie: {output_dir}")
            
            # Créer le dossier de sortie si nécessaire
            os.makedirs(output_dir, exist_ok=True)
            
            for size in sizes:
                # Redimensionner l'image
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                
                # Nom du fichier de sortie
                output_filename = f"icon-{size}x{size}.png"
                output_path = os.path.join(output_dir, output_filename)
                
                # Sauvegarder
                resized_img.save(output_path, "PNG", optimize=True)
                print(f"✅ Créé: {output_filename} ({size}x{size})")
            
            # Créer aussi une favicon
            favicon_sizes = [16, 32, 48]
            for size in favicon_sizes:
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                favicon_filename = f"favicon-{size}x{size}.png"
                favicon_path = os.path.join(output_dir, favicon_filename)
                resized_img.save(favicon_path, "PNG", optimize=True)
                print(f"✅ Créé: {favicon_filename} ({size}x{size})")
            
            # Créer favicon.ico
            favicon_ico_path = os.path.join(os.path.dirname(output_dir), "favicon.ico")
            favicon_img = img.resize((32, 32), Image.Resampling.LANCZOS)
            favicon_img.save(favicon_ico_path, "ICO")
            print(f"✅ Créé: favicon.ico (32x32)")
            
            print(f"\n🎉 {len(sizes) + len(favicon_sizes) + 1} icônes générées avec succès!")
            
    except FileNotFoundError:
        print(f"❌ Erreur: Fichier source introuvable: {source_image_path}")
        return False
    except Exception as e:
        print(f"❌ Erreur lors de la génération: {e}")
        return False
    
    return True

def main():
    # Chemins
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    source_image = os.path.join(project_root, "public", "busly-logo-only.png")
    output_dir = os.path.join(project_root, "public", "icons")
    
    # Vérifier si Pillow est installé
    try:
        import PIL
        print(f"✅ Pillow version: {PIL.__version__}")
    except ImportError:
        print("❌ Pillow n'est pas installé.")
        print("💡 Installez-le avec: pip install Pillow")
        return False
    
    # Vérifier si le fichier source existe
    if not os.path.exists(source_image):
        print(f"❌ Image source introuvable: {source_image}")
        print("💡 Assurez-vous que 'busly-logo-only.png' existe dans le dossier public/")
        return False
    
    # Générer les icônes
    return generate_pwa_icons(source_image, output_dir)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
