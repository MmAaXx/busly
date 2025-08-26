#!/usr/bin/env python3
"""
Script pour générer les écrans de lancement (splash screens) PWA
Crée des images avec le logo centré sur un fond coloré
"""

import os
from PIL import Image, ImageDraw
import sys

def create_splash_screen(logo_path, width, height, output_path, bg_color="#667eea", logo_scale=0.3):
    """
    Crée un écran de lancement avec le logo centré
    """
    # Créer l'image de fond
    splash = Image.new('RGB', (width, height), bg_color)
    
    # Ouvrir et redimensionner le logo
    with Image.open(logo_path) as logo:
        # Convertir en RGBA si nécessaire
        if logo.mode != 'RGBA':
            logo = logo.convert('RGBA')
        
        # Calculer la taille du logo (proportion de l'écran)
        logo_size = int(min(width, height) * logo_scale)
        logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Calculer la position pour centrer le logo
        x = (width - logo_size) // 2
        y = (height - logo_size) // 2
        
        # Coller le logo sur le fond (en gérant la transparence)
        splash.paste(logo_resized, (x, y), logo_resized)
    
    # Sauvegarder
    splash.save(output_path, "PNG", optimize=True)
    return True

def generate_all_splash_screens(logo_path, output_dir, bg_color="#667eea"):
    """
    Génère tous les écrans de lancement pour différents appareils
    """
    # Définition des tailles d'écrans (largeur, hauteur, nom)
    splash_sizes = [
        # iPhone
        (640, 1136, "splash-640x1136.png"),    # iPhone SE
        (750, 1334, "splash-750x1334.png"),    # iPhone 8
        (1242, 2208, "splash-1242x2208.png"),  # iPhone 8 Plus
        (1125, 2436, "splash-1125x2436.png"),  # iPhone X/XS
        (828, 1792, "splash-828x1792.png"),    # iPhone XR
        (1242, 2688, "splash-1242x2688.png"),  # iPhone XS Max
        
        # iPad
        (1536, 2048, "splash-1536x2048.png"),  # iPad
        (1668, 2224, "splash-1668x2224.png"),  # iPad Pro 10.5"
        (1668, 2388, "splash-1668x2388.png"),  # iPad Pro 11"
        (2048, 2732, "splash-2048x2732.png"),  # iPad Pro 12.9"
        
        # Formats génériques
        (1080, 1920, "splash-1080x1920.png"),  # Android FHD
        (1440, 2560, "splash-1440x2560.png"),  # Android QHD
    ]
    
    print(f"🎨 Génération des écrans de lancement depuis: {logo_path}")
    print(f"📁 Dossier de sortie: {output_dir}")
    print(f"🎨 Couleur de fond: {bg_color}")
    
    # Créer le dossier de sortie si nécessaire
    os.makedirs(output_dir, exist_ok=True)
    
    success_count = 0
    
    for width, height, filename in splash_sizes:
        output_path = os.path.join(output_dir, filename)
        
        try:
            if create_splash_screen(logo_path, width, height, output_path, bg_color):
                print(f"✅ Créé: {filename} ({width}x{height})")
                success_count += 1
            else:
                print(f"❌ Erreur: {filename}")
        except Exception as e:
            print(f"❌ Erreur pour {filename}: {e}")
    
    print(f"\n🎉 {success_count}/{len(splash_sizes)} écrans de lancement générés!")
    return success_count == len(splash_sizes)

def main():
    # Chemins
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    logo_path = os.path.join(project_root, "public", "busly-logo-only.png")
    output_dir = os.path.join(project_root, "public", "icons")
    
    # Couleur de fond (thème de l'app)
    background_color = "#667eea"  # Bleu violet comme dans le manifest
    
    # Vérifier si Pillow est installé
    try:
        import PIL
        print(f"✅ Pillow version: {PIL.__version__}")
    except ImportError:
        print("❌ Pillow n'est pas installé.")
        print("💡 Installez-le avec: pip install Pillow")
        return False
    
    # Vérifier si le fichier logo existe
    if not os.path.exists(logo_path):
        print(f"❌ Logo introuvable: {logo_path}")
        print("💡 Assurez-vous que 'busly-logo-only.png' existe dans le dossier public/")
        return False
    
    # Générer les écrans de lancement
    return generate_all_splash_screens(logo_path, output_dir, background_color)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
