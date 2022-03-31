const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context: ctx, width, height }) => {

  const agents = []
  const agentCount = 40

  let x,y
  for(let i=0;i<agentCount;i++){
    x = random.range(10,width - 10)
    y = random.range(10,height - 10)
    agents.push(new Agent(x,y))
  }

  return ({context : ctx, width, height }) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);



    // animate lines
    for(let i=0;i<agents.length;i++){
      const agentX = agents[i]
      for(let j=i+1;j<agents.length;j++){
        const agentY = agents[j]

        const distance = agentX.pos.getDistance(agentY.pos) 
        if( distance > 200) continue

        ctx.save()
        const alpha = math.mapRange(distance, 0, 200, 1,0)
        ctx.beginPath()
        
        ctx.strokeStyle = `rgba(256,256,256,${alpha})`
        ctx.lineWidth = 4
        ctx.moveTo(agentX.pos.x, agentX.pos.y)
        ctx.lineTo(agentY.pos.x, agentY.pos.y)
        ctx.stroke()
        ctx.restore()
      }
    }

    // animate vectors
    agents.forEach(agent => {
      agent.update()
    //   if(agent.type === 'fill'){
    //     agent.bounce(width,height)
    //   }else{
    //     agent.wrap(width,height)
    //   }
      agent.bounce(width,height)
      agent.draw(ctx)
    })



  };
};

canvasSketch(sketch, settings);

class Vector{
  constructor(x,y){
    this.x = x
    this.y = y
  }
  getDistance(otherVector){
    const dx = this.x - otherVector.x
    const dy = this.y - otherVector.y
    return Math.sqrt((dx * dx) + (dy * dy))
  }

}

class Agent {
  constructor(x,y){
    this.pos = new Vector(x,y)
    this.velocity = new Vector(random.range(-3,2)
                                ,random.range(-3,2))
    this.radius = random.range(5,20)
    this.type = Math.random() > 0.5 ? 'fill' : 'stroke'
    this.lineWidth = 4
    this.offset = this.type === 'fill'? 0 : this.lineWidth
  }

  update(){
    this.pos.x += this.velocity.x
    this.pos.y += this.velocity.y
  }

  bounce(width,height){
    if(this.pos.x - this.radius - this.offset   <= 0 
        || this.pos.x + this.radius + this.offset  > width )  
      this.velocity.x *= -1
    if(this.pos.y - this.radius - this.offset  <= 0 
        || this.pos.y + this.radius + this.offset > height )  
    this.velocity.y *= -1
  }

  wrap(width,height){
    this.pos.x = (this.pos.x + width) % width
    this.pos.y = (this.pos.y + height) % height
  }


  draw(ctx){
    ctx.save()
    ctx.translate(this.pos.x,this.pos.y)
    ctx.beginPath()
    ctx.arc(0,0,
              this.radius,0,Math.PI * 2)
    if(this.type === 'stroke'){
      ctx.lineWidth = this.lineWidth
      ctx.fillStyle = 'black'
      ctx.strokeStyle = 'white'
      ctx.fill()
      ctx.stroke()
    }else{
      ctx.fillStyle = 'white'
      ctx.fill()
    }
    ctx.restore()
  }
}