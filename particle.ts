namespace EIA_Endabgabe {
    export class Particle {
      x: number;
      y: number;
      speedX: number;
      speedY: number;
      life: number;
      radius: number;
      color: string;
  
      constructor(x: number, y: number, speedX: number, speedY: number, life: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.life = life;
        this.radius = radius;
        this.color = color;
      }
  
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
      }
  
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  