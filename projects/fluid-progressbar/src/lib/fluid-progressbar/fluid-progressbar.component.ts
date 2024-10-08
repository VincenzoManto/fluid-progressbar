import { Component, Input } from '@angular/core';
import { Particle } from './particle';

@Component({
  selector: 'fluid-progressbar',
  templateUrl: './fluid-progressbar.component.html',
  styleUrls: ['./fluid-progressbar.component.scss'],
})
export class FluidProgressbarComponent {


  @Input() set progress(v: number) {
    this.pProgress = v || 0;
    let t = 0;
    if (!this.imageContext) {
      t = 500;
    }
    setTimeout(() => {

      this.noodles = [50, 50, 50].map(e => e * this.pProgress);
      this.newParticles();
    }, t);
  };
  pProgress = 0.1;
  @Input() touchEffect = 1;
  @Input() gravityX = 0;
  @Input() gravityY = 0.1;
  @Input() invertMouseAction = false;
  @Input() groupColours = ['#0055ff', '#0077ff', '#1177ff', '#11aaff'];
  noodles = [10, 10, 10];
  context: any;
  width!: number;
  height!: number;
  numX!: number;
  numY!: number;
  particles: Particle[] = [];
  grid: { length: number; close: any[] }[] = [];
  imageContext!: CanvasRenderingContext2D;
  threshold = 220;
  play = false;
  spacing = 45;
  radius = 30;
  limit = this.radius * 0.66;
  textures!: any[];
  numParticles: number = 0;
  mouse: any;
  fluid: any;

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

      const that = this;
      this.fluid = (() => {



        that.particles = this.particles;
        that.numParticles = this.numParticles;
        this.mouse = {
          down: false,
          x: 0,
          y: 0,
        };

        let toImage = () => {
          let imageData = this.imageContext!.getImageData(0, 0, this.width, this.height),
            pix = imageData.data;

          for (let i = 0, n = pix.length; i < n; i += 4) {
            pix[i + 3] < this.threshold && (pix[i + 3] /= 6);
          }

          that.context.putImageData(imageData, 0, 0);
        };

        let run = () => {
          this.imageContext!.clearRect(0, 0, this.width, this.height);

          for (let i = 0, l = this.numX * this.numY; i < l; i++) this.grid[i].length = 0;

          let i = this.numParticles;
          while (i--) this.particles[i].abP();
          i = this.numParticles;
          while (i--) this.particles[i].pbP();

          toImage();

          if (this.mouse.down) {
            that.context.canvas.style.cursor = 'none';

            that.context.fillStyle = 'rgba(97, 160, 232, 0.05)';
            that.context.beginPath();
            that.context.arc(
              this.mouse.x,
              this.mouse.y,
              this.radius * that.touchEffect,
              0,
              Math.PI * 2
            );
            that.context.closePath();
            that.context.fill();

            that.context.fillStyle = 'rgba(97, 160, 232, 0.05)';
            that.context.beginPath();
            that.context.arc(
              this.mouse.x,
              this.mouse.y,
              (this.radius * that.touchEffect) / 3,
              0,
              Math.PI * 2
            );
            that.context.closePath();
            that.context.fill();
          } else that.context.canvas.style.cursor = 'default';


          if (this.play) (window as any).requestAnimFrame(run);
        };

        return {
          init: (
            canvas: string | HTMLElement | null | any,
            w: number,
            h: number
          ) => {
            const close: any = [];
            this.textures = [];

            canvas = document.getElementById(canvas)! as HTMLCanvasElement;
            this.context = (canvas as any).getContext('2d');
            canvas.height = h || window.innerHeight;
            canvas.width = w || window.innerWidth;
            this.width = canvas.width;
            this.height = canvas.height;

            let metaCanvas = document.createElement('canvas');
            metaCanvas.width = this.width;
            metaCanvas.height = this.height;
            this.imageContext = metaCanvas.getContext('2d')!;

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
              let rect = canvas.getBoundingClientRect();
              that.mouse.x = e.clientX - rect.left;
              that.mouse.y = e.clientY - rect.top;
              return false;
            };

            this.numX = Math.round(this.width / this.spacing) + 1;
            this.numY = Math.round(this.height / this.spacing) + 1;

            for (let i = 0; i < this.numX * this.numY; i++) {
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
  }

  set() {
    const that = this;
    for (let i = 0; i < that.noodles.length; i++) {
      let colour;

      if (that.groupColours[i]) {
        colour =
          that.groupColours[i % that.groupColours.length] || '#0055ff';
      }

      this.textures[i] = document.createElement('canvas');
      this.textures[i].width = this.radius * 2;
      this.textures[i].height = this.radius * 2;
      let ncontext = this.textures[i].getContext('2d');

      let grad = ncontext.createRadialGradient(
        this.radius,
        this.radius,
        1,
        this.radius,
        this.radius,
        this.radius
      );

      grad.addColorStop(0, colour + 'ff');
      grad.addColorStop(1, colour + '00');
      ncontext.fillStyle = grad;
      ncontext.beginPath();
      ncontext.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2, true);
      ncontext.closePath();
      ncontext.fill();
    }
  }

  newParticles() {
    this.particles = [];
    for (let i = 0; i < this.noodles.length; i++) {
      for (let k = 0; k < this.noodles[i]; k++) {
        this.particles.push(
          new Particle(
            i,
            this.radius + Math.random() * (this.width - this.radius * 2),
            this.radius + Math.random() * (this.height - this.radius * 2),
            this.grid,
            this.spacing,
            this.numX,
            this.mouse,
            this,
            this.radius,
            this.limit,
            this.textures,
            this.imageContext,
            this.width,
            this.height
          )
        );
      }
    }

    this.numParticles = this.particles.length;
  }

  ngAfterViewInit() {


    this.fluid.init('c', 100, 376);
  }
}

