import { Component, Input } from '@angular/core';

@Component({
  selector: 'fluid-progressbar',
  templateUrl: './fluid-progressbar.component.html',
  styleUrls: ['./fluid-progressbar.component.scss'],
})
export class FluidProgressbarComponent {


  @Input() set progress(v: number) {
    this.pProgress = v;
    this.GROUPS = [50, 50, 50].map(e => e * this.pProgress);
    this.newParticles();
  };
  pProgress = 0.1;
  @Input() mouseInfluence = 1;
  @Input() gravityX = 0;
  @Input() gravityY = 0.1;
  @Input() mouseRepel = false;
  @Input() groupColours = ['#0055ff', '#0077ff', '#1177ff', '#11aaff'];
  GROUPS = [10, 10, 10];
  ctx: any;
  width!: number;
  height!: number;
  num_x!: number;
  num_y!: number;
  particles: any[] = [];
  grid!: { length: number; close: any[] }[];
  meta_ctx!: CanvasRenderingContext2D;
  threshold = 220;
  play = false;
  spacing = 45;
  radius = 30;
  limit = this.radius * 0.66;
  textures!: any[];
  num_particles!: number;
  mouse: any;

  constructor() {
    const w = window as any;
    w.requestAnimFrame =
      w.requestAnimationFrame ||
      w.webkitRequestAnimationFrame ||
      w.mozRequestAnimationFrame ||
      w.oRequestAnimationFrame ||
      w.msRequestAnimationFrame ||
      function (callback: TimerHandler) {
        window.setTimeout(callback, 1000 / 60);
      };
  }

  set() {
    const that = this;
    for (var i = 0; i < that.GROUPS.length; i++) {
      var colour;

      if (that.groupColours[i]) {
        colour =
          that.groupColours[i % that.groupColours.length] || '#0055ff';
      }

      this.textures[i] = document.createElement('canvas');
      this.textures[i].width = this.radius * 2;
      this.textures[i].height = this.radius * 2;
      var nctx = this.textures[i].getContext('2d');

      var grad = nctx.createRadialGradient(
        this.radius,
        this.radius,
        1,
        this.radius,
        this.radius,
        this.radius
      );

      grad.addColorStop(0, colour + 'ff');
      grad.addColorStop(1, colour + '00');
      nctx.fillStyle = grad;
      nctx.beginPath();
      nctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2, true);
      nctx.closePath();
      nctx.fill();
    }
  }

  newParticles() {
    this.particles = [];
    for (var i = 0; i < this.GROUPS.length; i++) {
      for (var k = 0; k < this.GROUPS[i]; k++) {
        this.particles.push(
          new Particle(
            i,
            this.radius + Math.random() * (this.width - this.radius * 2),
            this.radius + Math.random() * (this.height - this.radius * 2),
            this.grid,
            this.spacing,
            this.num_x,
            this.mouse,
            this,
            this.radius,
            this.limit,
            this.textures,
            this.meta_ctx,
            this.width,
            this.height
          )
        );
      }
    }

    this.num_particles = this.particles.length;
  }

  ngAfterViewInit() {
    const that = this;
    var fluid = (() => {



      that.particles = this.particles;
      that.num_particles = this.num_particles;
      this.mouse = {
        down: false,
        x: 0,
        y: 0,
      };

      var process_image = () => {
        var imageData = this.meta_ctx!.getImageData(0, 0, this.width, this.height),
          pix = imageData.data;

        for (var i = 0, n = pix.length; i < n; i += 4) {
          pix[i + 3] < this.threshold && (pix[i + 3] /= 6);
        }

        that.ctx.putImageData(imageData, 0, 0);
      };

      var run = () => {
        //var time = new Date().getTime();
        this.meta_ctx!.clearRect(0, 0, this.width, this.height);

        for (var i = 0, l = this.num_x * this.num_y; i < l; i++) this.grid[i].length = 0;

        var i = this.num_particles;
        while (i--) this.particles[i].first_process();
        i = this.num_particles;
        while (i--) this.particles[i].second_process();

        process_image();

        if (this.mouse.down) {
          that.ctx.canvas.style.cursor = 'none';

          that.ctx.fillStyle = 'rgba(97, 160, 232, 0.05)';
          that.ctx.beginPath();
          that.ctx.arc(
            this.mouse.x,
            this.mouse.y,
            this.radius * that.mouseInfluence,
            0,
            Math.PI * 2
          );
          that.ctx.closePath();
          that.ctx.fill();

          that.ctx.fillStyle = 'rgba(97, 160, 232, 0.05)';
          that.ctx.beginPath();
          that.ctx.arc(
            this.mouse.x,
            this.mouse.y,
            (this.radius * that.mouseInfluence) / 3,
            0,
            Math.PI * 2
          );
          that.ctx.closePath();
          that.ctx.fill();
        } else that.ctx.canvas.style.cursor = 'default';

        //console.log(new Date().getTime() - time);

        if (this.play) (window as any).requestAnimFrame(run);
      };

      return {
        init: (
          canvas: string | HTMLElement | null | any,
          w: number,
          h: number
        ) => {
          this.particles = [];
          this.grid = [];
          const close: any = [];
          this.textures = [];

          canvas = document.getElementById(canvas)! as HTMLCanvasElement;
          this.ctx = (canvas as any).getContext('2d');
          canvas.height = h || window.innerHeight;
          canvas.width = w || window.innerWidth;
          this.width = canvas.width;
          this.height = canvas.height;

          var meta_canvas = document.createElement('canvas');
          meta_canvas.width = this.width;
          meta_canvas.height = this.height;
          this.meta_ctx = meta_canvas.getContext('2d')!;

          that.radius = this.radius;
          that.textures = this.textures;

          that.set();



          canvas.onmousedown = function (e: any) {
            that.mouse.down = true;
            return false;
          };

          canvas.onmouseup = function (e: any) {
            that.mouse.down = false;
            return false;
          };

          canvas.onmousemove = function (e: {
            clientX: number;
            clientY: number;
          }) {
            var rect = canvas.getBoundingClientRect();
            that.mouse.x = e.clientX - rect.left;
            that.mouse.y = e.clientY - rect.top;
            return false;
          };

          this.num_x = Math.round(this.width / this.spacing) + 1;
          this.num_y = Math.round(this.height / this.spacing) + 1;

          for (var i = 0; i < this.num_x * this.num_y; i++) {
            this.grid[i] = {
              length: 0,
              close: [],
            };
          }



          this.play = true;
          run();
        },

        stop: function () {
          that.play = false;
        },
      };
    })();

    fluid.init('c', 100, 376);
  }
}

class Particle {
  y: number;
  x: number;
  vx: number;
  px: any;
  vy: number;
  py: any;
  type: any;
  constructor(type: number, x: number, y: number,
    public grid: any[], public spacing: number, public num_x: number,
    public mouse: { down: any; x: any; y: any; }, public that: any,
    public radius: number,
    public limit: number,
    public textures: any[],
    public meta_ctx: CanvasRenderingContext2D,
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

  first_process() {
    var g =
      this.grid[Math.round(this.y / this.spacing) * this.num_x + Math.round(this.x / this.spacing)];

    if (g) g.close[g.length++] = this;

    this.vx = this.x - this.px;
    this.vy = this.y - this.py;

    if (this.mouse.down) {
      var dist_x = this.x - this.mouse.x;
      var dist_y = this.y - this.mouse.y;
      var dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
      if (dist < this.radius * this.that.mouseInfluence) {
        var cos = dist_x / dist;
        var sin = dist_y / dist;
        this.vx += this.that.mouseRepel ? cos : -cos;
        this.vy += this.that.mouseRepel ? sin : -sin;
      }
    }

    this.vx += this.that.gravityX;
    this.vy += this.that.gravityY;
    this.px = this.x;
    this.py = this.y;
    this.x += this.vx;
    this.y += this.vy;
  }

  second_process() {
    var force = 0,
      force_b = 0,
      cell_x = Math.round(this.x / this.spacing),
      cell_y = Math.round(this.y / this.spacing),
      close: any[] = [];

    for (var x_off = -1; x_off < 2; x_off++) {
      for (var y_off = -1; y_off < 2; y_off++) {
        var cell = this.grid[(cell_y + y_off) * this.num_x + (cell_x + x_off)];
        if (cell && cell.length) {
          for (var a = 0, l = cell.length; a < l; a++) {
            var particle = cell.close[a] as any;
            if (particle != this) {
              var dfx = particle.x - this.x;
              var dfy = particle.y - this.y;
              var distance = Math.sqrt(dfx * dfx + dfy * dfy);
              if (distance < this.spacing) {
                var m = 1 - distance / this.spacing;
                force += Math.pow(m, 2);
                force_b += Math.pow(m, 3) / 2;
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
    l = close.length;

    for (var i = 0; i < l; i++) {
      var neighbor = close[i];

      var press = force + force_b * neighbor.m;
      if (this.type != neighbor.type) press *= 0.35;

      var dx = neighbor.dfx * press * 0.5;
      var dy = neighbor.dfy * press * 0.5;

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
    var size = this.radius * 2;

    this.meta_ctx!.drawImage(
      this.textures[this.type],
      this.x - this.radius,
      this.y - this.radius,
      size,
      size
    );
  }
}
