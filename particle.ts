namespace Endabgabe_EIA2 {

    export class Particle extends Moveable {

        lifetime: number;
        alpha: number;
        color: string;

        constructor(_position: Vector, _velocity: Vector) {

            super(_position);
            this.position.x = _position.x;
            this.position.y = _position.y;
            this.velocity = _velocity;
            this.alpha = 1;
            this.color = (color);
        }

        draw(): void {
            //Lifespan -> reduziert Helligkeit des Parikels
            this.alpha -= lifespanNumber;
            if (this.alpha < 0) {
                this.alpha = 0;
            }

            // Form des Partikels
            crc2.save();
            crc2.globalAlpha = this.alpha;
            crc2.beginPath();
            crc2.arc(this.position.x, this.position.y, particleSize, 0, 360);
            crc2.closePath();
            crc2.fillStyle = this.color;
            crc2.fill();
            crc2.restore();
        }


    }
}