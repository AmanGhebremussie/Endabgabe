"use strict";
var EIA_Endabgabe;
(function (EIA_Endabgabe) {
    class Particle {
        x;
        y;
        speedX;
        speedY;
        life;
        radius;
        color;
        constructor(x, y, speedX, speedY, life, radius, color) {
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
        draw(ctx) {
            ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${this.life / 100})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    EIA_Endabgabe.Particle = Particle;
})(EIA_Endabgabe || (EIA_Endabgabe = {}));
//# sourceMappingURL=particle.js.map