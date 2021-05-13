class RoadMarkers{
    constructor(x,y,width,height){
        this.x=Math.round(x);
        this.y=Math.round(y);
        this.width=Math.round(width);
        this.height=Math.round(height);
    }
    update(gameSpeed){
        this.y+=gameSpeed;
        if(this.y>GAME_HEIGHT)
        this.y=-this.height;
    }
}