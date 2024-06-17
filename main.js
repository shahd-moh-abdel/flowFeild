function resizeCanvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Get the device pixel ratio, falling back to 1 if not available
    const dpr = window.devicePixelRatio || 1;
    
    // Set the canvas dimensions to the window's dimensions multiplied by the device pixel ratio
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Scale all drawing operations by the dpr
    ctx.scale(dpr, dpr);
    
    // Set the canvas style to fill the window
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    
    // Call the function to draw your particles
    drawCanvas(ctx)
}

// Call the resizeCanvas function when the window is resized
window.addEventListener('resize', resizeCanvas);

// Initial call to set up the canvas
resizeCanvas();

function drawCanvas(ctx){
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.2
    class Particle{
        constructor(effect){
            this.effect = effect;
            this.x = Math.floor(Math.random() * this.effect.width);
            this.y = Math.floor(Math.random() * this.effect.height);
            this.speedX;
            this.speedY;
            this.speedModifier = Math.floor(Math.random() * 3 +1)
            this.history = [{x: this.x,y:this.y}];
            this.maxLength = Math.floor(Math.random() * 50 + 10);
            this.angle = 0;
            this.timer = this.maxLength * 2;
            this.heu =9;

        }
        draw(context){
            // context.fillRect(this.x,this.y,10,10);
            context.strokeStyle = 'hsl(' + this.heu + ',100%,50%)';
            context.beginPath();
            context.moveTo(this.history[0].x,this.history[0].y);
            for (let i = 0; i < this.history.length; i++) {
                context.lineTo(this.history[i].x,this.history[i].y)
            }
            context.stroke()
            
        }
        update(){
            this.heu+= 0.1
            this.timer--;
            if(this.timer >= 1){
                let x = Math.floor(this.x / this.effect.cellSize);
                let y = Math.floor(this.y / this.effect.cellSize);
                let index = y * this.effect.cols + x;
                this.angle = this.effect.flowFeild[index];
                
                this.speedX = Math.cos(this.angle) * this.speedModifier
                this.speedY = Math.sin(this.angle) * this.speedModifier

                this.x += this.speedX;
                this.y += this.speedY;
                
                
                this.history.push({x: this.x,y:this.y})
                if(this.history.length > this.maxLength){
                    this.history.shift()
                }
            }else if(this.history.length > 1){
                this.history.shift()
            }else{
                this.reset();
            }
        }
        reset(){
            this.x = Math.floor(Math.random() * this.effect.width);
            this.y = Math.floor(Math.random() * this.effect.height);
            this.history = [{x: this.x,y:this.y}];
            this.timer = this.maxLength * 2;
        }
    }
    class Effect{
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.particles = [];
            this.particlesNumber = 900;
            this.cellSize = 5;
            this.curve = 0.8;
            this.zoom = 0.02
            this.rows;
            this.cols;
            this.flowFeild = [];
            this.init()
        }
        init(){
            //create flow field
            this.rows = Math.floor(this.height / this.cellSize);
            this.cols = Math.floor(this.width / this.cellSize);
            this.flowFeild =  [];

            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom))* this.curve;
                    this.flowFeild.push(angle)
                }
            }

            //create particles
            for (let i = 0; i < this.particlesNumber; i++) {                
                this.particles.push(new Particle(this ))
            }
        }
        render(context){
            this.particles.forEach(particle => {
                particle.draw(context);
                particle.update();
            });

        }
    }
    const effect = new Effect(window.innerWidth,window.innerHeight);
    ;

    function animate(){
        ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
        effect.render(ctx);
        requestAnimationFrame(animate)
    }
    animate();

}
