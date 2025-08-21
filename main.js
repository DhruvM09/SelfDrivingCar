const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const ctx = canvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
// const car = new Car(road.getLaneCenter(1), 500, 30, 50 , "AI");
var slider = document.getElementById("mutation");
var output = document.getElementById("mutationRate");

if(localStorage.getItem("mutation")){
    slider.value = JSON.parse(localStorage.getItem("mutation")) * 100;
}
output.innerHTML = slider.value;
var mutation = slider.value / 100;
let N = 1;
let numberOfCars = document.getElementById("N");

if(localStorage.getItem("N")){
    N = JSON.parse(localStorage.getItem("N"));
    numberOfCars.value = N;

}

numberOfCars.addEventListener("change", function() {
    Num = parseInt(this.value);
    if(isNaN(Num) || Num < 1){
        Num = 1;
    }
    this.value = Num;
    localStorage.setItem("N", JSON.stringify(Num));
});
let cars = generateCars(N)
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i < cars.length; i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if(i !== 0){
            NeuralNetwork.mutate(cars[i].brain, mutation);
        }
    }
}
slider.oninput = function() {
  output.innerHTML = this.value;
  mutation = this.value / 100;
  localStorage.setItem("mutation", JSON.stringify(mutation));
}

let traffic = [new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
                new Car(road.getLaneCenter(1), -300, 30, 50, "DUMMY", 2),
                new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
                new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
                new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
                new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
                new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),
                new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),


];

localStorage.setItem("traffic", JSON.stringify(traffic));
function addTrafficCar() {
    const lane = parseInt(document.getElementById("lanePicker").value);
    const distance = parseInt(document.getElementById("carDistance").value);
    
    // Distance is negative to place cars ahead of the AI
    traffic.push(
        new Car(road.getLaneCenter(lane), 100-distance, 30, 50, "DUMMY", 2)
    );
    
    // Save traffic to localStorage
    localStorage.setItem("traffic", JSON.stringify(traffic));
}

function clearTraffic() {
    traffic = [];
    localStorage.removeItem("traffic");
}
const randomizer = new Randomizer(bestCar);
// Add this after localStorage checks at the start
// if(localStorage.getItem("traffic")) {
//     const savedTraffic = JSON.parse(localStorage.getItem("traffic"));
//     savedTraffic.forEach(element => {
//        traffic.push(
//             new Car(element.initialX, element.initialY, element.width, element.height, "DUMMY", 2)
//         ); 
//     });
// }
function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard(){
    localStorage.removeItem("bestBrain");
}
function generateCars(N){
    let carsT = [];
    for(let i = 0; i < N; i++){
        carsT.push(new Car(road.getLaneCenter(1), 100 ,30  ,50, "AI"))
    }
    return carsT;
}
function animate(time){
    randomizer.randomizeCars(traffic, road, bestCar);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders , []);
    }
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders , traffic);
        if(cars[i].y > bestCar.y + 100){
            cars[i].damaged = true;
        }
    }
    bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));

    canvas.height = window.innerHeight;
    networkCanvas.height = 300;
    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.7);
    road.draw(ctx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(ctx , "red");
    }
    ctx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(ctx , "blue");
    }

    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "blue", true);
    ctx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    window.requestAnimationFrame(animate);
}

animate();
