let canvas=document.getElementById("myCanvas");
let ctx=canvas.getContext("2d");

ctx.canvas.width=GAME_WIDTH;
ctx.canvas.height=GAME_HEIGHT;
let status="showing";
let roadMarkers=[];

let score=0;
let highScore=0;
let backgroundY=0;
let speed=5;


let carSprite=new Image();
carSprite.src="assets/car.png"

let roadSprite=new Image();
roadSprite.src="assets/road.jpg"
let menuSettings={
        state:"first",
        bg:roadSprite,
        ready:false
}
enemySprite=[]
for(let i=1;i<=7;i++){
    let sheet=new Image();
    sheet.src=`assets/${i}.png`;
    enemySprite.push(sheet);
}


for(let i=0;i<=GAME_HEIGHT;i+=GAME_HEIGHT/20){
    roadMarkers.push(new RoadMarkers(0,i,25,GAME_HEIGHT/20));
    roadMarkers.push(new RoadMarkers(GAME_WIDTH-25,i,25,GAME_HEIGHT/20));
}

for(let i=0;i<=GAME_HEIGHT;i+=GAME_HEIGHT/2.2){
    roadMarkers.push(new RoadMarkers(145,i,25,GAME_HEIGHT/2.2));
    roadMarkers.push(new RoadMarkers(285,i,25,GAME_HEIGHT/2.2));
}

let player=null;
let enemies=[];

function initialize(){
    player=new Car();
    let y=0;
    score=0;
    speed=5;
    highScore=+localStorage.getItem("highScore");
    backgroundY=0;
    enemies=[];
    for(let i=0;i<10;i++)
    {
        y-=randomInt(MinGap,MaxGap);
        enemies.push(new Obstacle(randomInt(1,3),y));
        
    }
    document.removeEventListener("keydown",handleKeyDown);
}


function update(){
    backgroundY=(backgroundY+speed)%GAME_HEIGHT;
    player.update();
    roadMarkers.forEach(marker=>marker.update(speed));
    enemies.forEach(enemy=>{
        enemy.update(2*speed);
        if(player.status!=="switching"&&enemy.collide(player)){
            status="showing";
            if(score>highScore)localStorage.setItem("highScore",score.toString());
            menuSettings.state="last";
            menuSettings.ready=false;
            menuSettings.bg=new Image();
            menuSettings.bg.src=canvas.toDataURL("image/png");
            setTimeout(()=>{
                menuSettings.ready=true;
                document.addEventListener("keydown",handleKeyDown);
            },1000)
        }
        if(enemy.y>GAME_HEIGHT+enemy.height){
            enemies.shift();
            enemies.push(new Obstacle(randomInt(1,3),enemies[enemies.length-1].y-randomInt(MinGap,MaxGap)));
        }
        if(!enemy.granted){
            if(enemy.y-enemy.height/2>GAME_HEIGHT-20){
                score++;
                if(score%5==0)speed++;
                enemy.granted=true;
            }
        }
    });
}

function render(){
    
    ctx.drawImage(roadSprite,0,0,800,800,0,backgroundY,canvas.width,canvas.height);
    ctx.drawImage(roadSprite,0,0,800,800,0,backgroundY-GAME_HEIGHT,canvas.width,canvas.height);
    //drawing the road markers
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,25,canvas.height);
    ctx.fillRect(canvas.width-25,0,25,canvas.height);
    ctx.fillStyle="#ddd";
    roadMarkers.forEach(marker=>ctx.fillRect(marker.x,marker.y,marker.width,marker.height/2));
    //drawing the enemies
    enemies.forEach(enemy=>ctx.drawImage(enemySprite[enemy.sprite-1],0,0,enemySprite[enemy.sprite-1].width,enemySprite[enemy.sprite-1].height
        ,enemy.x-enemy.width/2,enemy.y-enemy.height/2,enemy.width,enemy.height));
    //drawing the car
    ctx.save();
    ctx.translate(player.x,player.y);
    ctx.rotate(player.angle);
    ctx.translate(-player.x,-player.y);
    ctx.fillStyle="blue";
    ctx.drawImage(carSprite,77,25,98,214,player.x-player.width/2,player.y-player.height/2,player.width,player.height);
    ctx.restore();
    ctx.fillStyle="green";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SCORE: "+score,80,30);
    ctx.fillText("HIGHSCORE: "+Math.max(score,highScore),340,30);

}


function renderMenu(){
    ctx.drawImage(menuSettings.bg,0,0,menuSettings.bg.width,menuSettings.bg.height,0,0,canvas.width,canvas.height);
    ctx.globalAlpha=0.7;
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalAlpha=1;
    if(menuSettings.state==="last"){
        ctx.fillStyle="white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle="red";
        ctx.fillText(`GAME OVER`,canvas.width/2,canvas.height/2-50);
        ctx.fillStyle="white";
        if(score>highScore){
            ctx.fillText(`NEW HIGHSCORE: ${score}`,canvas.width/2,canvas.height/2);
        }
        else{
            ctx.fillText(`SCORE: ${score}`,canvas.width/2,canvas.height/2);
        }
        ctx.font="20px Arial";
        if(menuSettings.ready)
        ctx.fillText("Press Any Key to RESTART",canvas.width/2,canvas.height/2+40);
        ctx.fillStyle="yellow";
        ctx.fillText("Use L/R Arrow Keys to Control",canvas.width/2,canvas.height/2+75);

    }
    else if(menuSettings.state=="first")
    {
        ctx.textAlign = "center";
        ctx.fillStyle="white";
        ctx.font="30px Arial";
        ctx.fillText("Press Any Key to START",canvas.width/2,canvas.height/2-40);
        ctx.fillStyle="red";
        ctx.fillText("Use L/R Arrow Keys to Control",canvas.width/2,canvas.height/2+20);

    }

}

function nextFrame(){
    let animstep=requestAnimationFrame(nextFrame);
    if(status==="playing"){
        update();
        render();
    }
    else if (status==="showing")
    {
        renderMenu();
    }
}

function handleKeyDown(e){
    if(status=="showing")
    {
        status="playing";
        initialize();
    }
}

function handleKey(e){
    switch(e.key){
        case "ArrowLeft":player.goLeft();break;
        case "ArrowRight":player.goRight();break;
    }
}

document.addEventListener("keydown",handleKeyDown);
document.addEventListener("keydown",handleKey);
// initialize();
requestAnimationFrame(nextFrame);

