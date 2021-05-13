class Obstacle{
    constructor(lane,y){
        this.lane=lane;
        this.x=LaneAnchors[lane];
        this.y=y;
        this.width=90;
        this.height=180;
        this.sprite=randomInt(1,7);
        this.granted=false;
    }
    torect(){
        return({
            x:this.x-this.width/2,
            y:this.y-this.height/2,
            width:this.width,
            height:this.height
        })
    }
    update(speed){
        this.y+=speed;
    }
    collide(car){
        let rect1=this.torect();
        let rect2=car.torect();
        return (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y)       
    }
}