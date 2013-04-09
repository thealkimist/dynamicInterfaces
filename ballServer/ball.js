
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var x = 50;
var y = 50;
var velX = 4;
var velY = 3.5;
var radius = 30; 
var color = "#0000ff"; 
 
window.onload = init; 
 
function init() {
    setInterval(update, 1000/60); // 60 frames per second
};
 
function update() {

    x += velX;
    y += velY; 
 
    if (x >= canvas.width || x < 0){
        velX *= -1;
    }
    if (y >= canvas.height || y < 0){
        velY *= -1;    
    }

  ball();
};
 
function ball() {
    with (context){
        clearRect(0, 0, canvas.width, canvas.height); // clear canvas
        fillStyle = color;
        beginPath();
        arc(x, y, radius, 0, 2*Math.PI, true);
        closePath();
        fill();
    };
};

