namespace EIA_Endabgabe {
  const canvas = document.getElementById('fireworkCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const particleCountSlider = document.getElementById('particleCountSlider') as HTMLInputElement;
  const particleCountValue = document.getElementById('particleCountValue') as HTMLSpanElement;
  const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
  const speedValue = document.getElementById('speedValue') as HTMLSpanElement;
  const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;

  if (!ctx) throw new Error('Canvas-Kontext konnte nicht geladen werden!');

  canvas.width = 1920;
  canvas.height = 540;

  let rocketSpeed = 5;  
  let rocketColor = '#ff0000'; // Initialfarbe
  let particleCount = parseInt(particleCountSlider.value) || 50; 
  let rockets: Rocket[] = [];

  // Farbwahl Event Listener
  colorPicker.addEventListener('input', () => {
    rocketColor = colorPicker.value;  // Setze den aktuellen Wert der Farbauswahl
  });

  // Lade den Sound
  const fireworkSound = new Audio('fireworkblast-106275.mp3');
  fireworkSound.preload = 'auto';  // Sicherstellen, dass der Sound im Hintergrund geladen wird

  function getColor(): string {
    return rocketColor;  // Verwende die aktuelle Farbe
  }

  function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = rockets.length - 1; i >= 0; i--) {
      const rocket = rockets[i];

      if (rocket.exploded) {
        rocket.particles.forEach((particle) => {
          particle.update();
          particle.draw(ctx);
        });

        rocket.particles = rocket.particles.filter((p) => p.life > 0);
        if (rocket.particles.length === 0) {
          rockets.splice(i, 1);
        }
      }
    }

    requestAnimationFrame(updateCanvas);
  }

  function explodeAt(x: number, y: number) {
    // Versuche den Sound abzuspielen und überprüfe auf Fehler
    fireworkSound.play().catch((error) => {
      console.error('Fehler beim Abspielen des Sounds:', error);
    });

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 2 + 2) * (rocketSpeed / 5);
      const radius = Math.random() * 2 + 2;
      const life = Math.random() * 100 + 50;
      const color = getColor();  // Nutze die dynamische Farbe

      particles.push(new EIA_Endabgabe.Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, life, radius, color));
    }

    rockets.push({ x, y, exploded: true, particles });
  }

  canvas.addEventListener('click', (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;
    explodeAt(mouseX, mouseY);
  });

  // Partikelanzahl Slider-Event-Listener
  particleCountSlider.addEventListener('input', () => {
    particleCount = parseInt(particleCountSlider.value);
    particleCountValue.textContent = particleCountSlider.value;
  });

  // Geschwindigkeit Slider-Event-Listener
  speedSlider.addEventListener('input', () => {
    rocketSpeed = parseFloat(speedSlider.value);
    speedValue.textContent = speedSlider.value;
  });

  updateCanvas();
}
