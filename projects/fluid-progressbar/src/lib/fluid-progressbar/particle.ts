export class Particle {
  y: number;
  x: number;
  vx: number;
  px: any;
  vy: number;
  py: any;
  type: any;
  constructor(type: number, x: number, y: number,
    public grid: any[], public spacing: number, public numX: number,
    public mouse: { down: any; x: any; y: any; }, public that: any,
    public radius: number,
    public limit: number,
    public textures: any[],
    public imageContext: CanvasRenderingContext2D,
    public width: number,
    public height: number
  ) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
  }

  abP() {
    let g =
      this.grid[Math.round(this.y / this.spacing) * this.numX + Math.round(this.x / this.spacing)];

    if (g) g.close[g.length++] = this;

    this.vx = this.x - this.px;
    this.vy = this.y - this.py;

    if (this.mouse.down) {
      let distX = this.x - this.mouse.x;
      let distY = this.y - this.mouse.y;
      let dist = Math.sqrt(distX * distX + distY * distY);
      if (dist < this.radius * this.that.touchEffect) {
        let cos = distX / dist;
        let sin = distY / dist;
        this.vx += this.that.invertMouseAction ? cos : -cos;
        this.vy += this.that.invertMouseAction ? sin : -sin;
      }
    }

    this.vx += this.that.gravityX;
    this.vy += this.that.gravityY;
    this.px = this.x;
    this.py = this.y;
    this.x += this.vx;
    this.y += this.vy;
  }

  pbP() {
    let force = 0,
      forceB = 0,
      cellX = Math.round(this.x / this.spacing),
      cellY = Math.round(this.y / this.spacing),
      close: any[] = [];

    for (let xOff = -1; xOff < 2; xOff++) {
      for (let yOff = -1; yOff < 2; yOff++) {
        let cell = this.grid[(cellY + yOff) * this.numX + (cellX + xOff)];
        if (cell && cell.length) {
          for (let a = 0, l = cell.length; a < l; a++) {
            let particle = cell.close[a] as any;
            if (particle != this) {
              let dfx = particle.x - this.x;
              let dfy = particle.y - this.y;
              let distance = Math.sqrt(dfx * dfx + dfy * dfy);
              if (distance < this.spacing) {
                let m = 1 - distance / this.spacing;
                force += Math.pow(m, 2);
                forceB += Math.pow(m, 3) / 2;
                particle.m = m;
                particle.dfx = (dfx / distance) * m;
                particle.dfy = (dfy / distance) * m;
                close.push(particle);
              }
            }
          }
        }
      }
    }

    force = (force - 3) * 0.5;
    let l = close.length;

    for (let i = 0; i < l; i++) {
      let neighbor = close[i];

      let press = force + forceB * neighbor.m;
      if (this.type != neighbor.type) press *= 0.35;

      let dx = neighbor.dfx * press * 0.5;
      let dy = neighbor.dfy * press * 0.5;

      neighbor.x += dx;
      neighbor.y += dy;
      this.x -= dx;
      this.y -= dy;
    }

    if (this.x < this.limit) this.x = this.limit;
    else if (this.x > this.width - this.limit) this.x = this.width - this.limit;

    if (this.y < this.limit) this.y = this.limit;
    else if (this.y > this.height - this.limit) this.y = this.height - this.limit;

    this.draw();
  }

  draw() {
    let size = this.radius * 2;

    this.imageContext!.drawImage(
      this.textures[this.type],
      this.x - this.radius,
      this.y - this.radius,
      size,
      size
    );
  }
}
