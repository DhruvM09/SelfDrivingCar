class Randomizer{
    constructor(){
    }
    randomizeCars(traffic , road , bestCar){
        for(let i = 0; i < traffic.length; i++){
            let lane = Math.floor(Math.random() * 3);
            if(traffic[i].y > bestCar.y +300 ){
                traffic[i].x = road.getLaneCenter(lane);; 
                traffic[i].y = bestCar.y -600 ;
            }
        }
        
        localStorage.setItem("traffic", JSON.stringify(traffic));
    }
}