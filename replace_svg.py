import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the svg tag to add overflow=visible
content = content.replace(
    '<svg class="hero-ecg-svg" viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">',
    '<svg class="hero-ecg-svg" viewBox="0 0 1440 100" preserveAspectRatio="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">'
)

old_path_pattern = re.compile(r'<!-- Realistic PQRST cardiac waveform × 7 cycles -->\s*<path class="hero-ecg-path"[^>]*d="[^"]+"\s*/>', re.DOTALL)
new_path = '''<!-- Continuous scrolling QRS waveform -->
        <path class="hero-ecg-path" filter="url(#ecgGlow)" d="
          M -240,60 L -60,60 L -50,30 L -40,90 L -30,10 L -20,70 L -10,60 L 0,60
          L 180,60 L 190,30 L 200,90 L 210,10 L 220,70 L 230,60 L 240,60
          L 420,60 L 430,30 L 440,90 L 450,10 L 460,70 L 470,60 L 480,60
          L 660,60 L 670,30 L 680,90 L 690,10 L 700,70 L 710,60 L 720,60
          L 900,60 L 910,30 L 920,90 L 930,10 L 940,70 L 950,60 L 960,60
          L 1140,60 L 1150,30 L 1160,90 L 1170,10 L 1180,70 L 1190,60 L 1200,60
          L 1380,60 L 1390,30 L 1400,90 L 1410,10 L 1420,70 L 1430,60 L 1440,60
          L 1620,60 L 1630,30 L 1640,90 L 1650,10 L 1660,70 L 1670,60 L 1680,60
        "/>'''

content = old_path_pattern.sub(new_path, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced index.html")
