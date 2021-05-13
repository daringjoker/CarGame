class Car{
    constructor(){
        this.x=85;
        this.deltaX=LaneSwitchSpeed;
        this.width=90;
        this.height=180;
        this.currentLane=1;
        this.targetLane=2;
        this.status="switching";
        this.angle=0;
        this.y=GAME_HEIGHT-this.height/2-30;
        this.score=0;

    }
    torect(){
        return({
            x:this.x-this.width/2,
            y:this.y-this.height/2,
            width:this.width,
            height:this.height
        })
    }    
    update(){
        if(this.status==="switching")
        {
            this.x+=this.deltaX;
            this.angle=MaxAngle-Math.abs(scale(this.x,LaneAnchors[this.currentLane],LaneAnchors[this.targetLane],-MaxAngle,MaxAngle));
            this.angle*=this.deltaX/Math.abs(this.deltaX);
            if(Math.abs(this.x-LaneAnchors[this.targetLane])<=Math.abs(this.deltaX)){
                this.currentLane=this.targetLane;
                this.x=LaneAnchors[this.targetLane];
                this.status="driving";
                this.angle=0;
                this.deltaX=0;
            }
                     
        }
    }

    goLeft(){
        if(this.status!=="switching"&& this.currentLane!==1)
        {
            this.targetLane=this.currentLane-1;
            this.status="switching";
            this.deltaX=-LaneSwitchSpeed;
            this.angle=-Math.PI/8;
        }
    }

    goRight(){
        if(this.status!=="switching"&&this.currentLane!==3)
        {
            this.targetLane=this.currentLane+1;
            this.status="switching";
            this.deltaX=LaneSwitchSpeed;
            this.angle=Math.PI/8;
        }
    }

}