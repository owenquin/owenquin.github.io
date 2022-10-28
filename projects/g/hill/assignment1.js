function drawing() { "use strict";
    var canvas = document.getElementById('myCanvas');
    var cloudSlider = document.getElementById('cloudSlider');
    var timeSlider = document.getElementById('timeSlider');
    cloudSlider.value = 0;
    timeSlider.value = 0;
    function draw() {
        var cxt = canvas.getContext('2d');
        var csv = cloudSlider.value;
        var tsv = timeSlider.value;
        
        function drawCircle(x, y, radius, color) {
            cxt.beginPath();
            cxt.arc(x + radius, y + radius, radius, 0, 2 * Math.PI, false);
            cxt.fillStyle = color;
            cxt.fill();
        }
        
        function drawCloud(x, y) {
            var cloudColor = "white";
            drawCircle(0 + x, 5 + y, 10, cloudColor);
            drawCircle(10 + x, 0 + y, 15, cloudColor);
            drawCircle(25 + x, 0 + y, 15, cloudColor);
            drawCircle(45 + x, 5 + y, 10, cloudColor);
        }
        
        function drawLandscape() {
            var skyColor = "LightSkyBLue";
            var nightColor = "MidnightBlue";
            var grassColor1 = "MediumSeaGreen";
            var grassColor2 = "SeaGreen";
            
            //draw sky
            cxt.fillStyle = skyColor;
            cxt.fillRect(0, 0, canvas.width, canvas.height);
            
            //draw night sky
            cxt.save();
            cxt.globalAlpha = tsv/100;
            cxt.fillStyle = nightColor;
            cxt.fillRect(0, 0, canvas.width, canvas.height);
            cxt.restore();
            
            //draw sun/moon
            drawCircle(20, 20, 20, "yellow")
            
            //draw background hill
            cxt.beginPath();
            cxt.moveTo(0, 125);
            cxt.bezierCurveTo(10, 75, 210, 75, 240, 125);
            cxt.fillStyle = grassColor2;
            cxt.fill();
            cxt.closePath();
            cxt.fillRect(0, 125, 240, 125);

            //draw foreground hill
            cxt.beginPath();
            cxt.moveTo(-20, 110);
            cxt.bezierCurveTo(0, 40, 210, 120, 220, 150);
            cxt.fillStyle = grassColor1;
            cxt.fill();
            cxt.closePath();
            cxt.fillRect(-20, 110, 175, 220);
            cxt.fillRect(155, 135, 220, 220);
        }
        
        function drawTree(x, y) {
            var treeColor = "#316354";
            
            cxt.beginPath();
            cxt.moveTo(x, 20 + y);
            cxt.lineTo(7 + x, y);
            cxt.lineTo(14 + x, 20 + y);
            cxt.fillStyle = treeColor;
            cxt.fill();
            cxt.closePath();
        }
        
        function drawCabin(x,y) {
            var cabinColor = "Tan";
            var cabinShadeColor = "RosyBrown";
            var doorColor = "SaddleBrown";
            var roofColor = "SteelBlue";
            var roofShadeColor = "Navy";
            var windowColor = "DarkSlateBlue";
            var windowColorNight = "yellow";
            var bodyOffsetx = 3;
            var bodyOffsety = 13;
            
            //back roof
            cxt.beginPath();
            cxt.moveTo(16 + x, 0 + y);
            cxt.lineTo(32 + x, 0 + y);
            cxt.lineTo(48 + x, 16 + y);
            cxt.lineTo(32 + x, 16 + y);
            cxt.fillStyle = roofShadeColor;
            cxt.fill();
            cxt.closePath();
            
            //cabin body
            cxt.fillStyle = cabinColor;
            cxt.fillRect(0 + bodyOffsetx + x, 0 + bodyOffsety + y, 40, 30);
            cxt.beginPath();
            cxt.moveTo(15 + bodyOffsetx + x, 0 + bodyOffsety + y);
            cxt.lineTo(27.5 + bodyOffsetx + x, -12 + bodyOffsety + y);
            cxt.lineTo(40 + bodyOffsetx + x, 0 + bodyOffsety + y);
            cxt.fill();
            cxt.closePath();
            cxt.fillStyle = cabinShadeColor;
            cxt.fillRect(0 + bodyOffsetx + x, 0 + bodyOffsety + y, 15, 30);
            
            //door
            cxt.fillStyle = doorColor;
            cxt.fillRect(22 + bodyOffsetx + x, 10 + bodyOffsety + y, 12, 20);
            
            //window
            cxt.fillStyle = windowColor;
            cxt.fillRect(4 + bodyOffsetx + x, 10 + bodyOffsety + y, 7, 10);
            
            //nightwindow
            cxt.save();
            cxt.globalAlpha = tsv/100;
            cxt.fillStyle = windowColorNight;
            cxt.fillRect(4 + bodyOffsetx + x, 10 + bodyOffsety + y, 7, 10);
            cxt.restore();
            
            //front roof
            cxt.beginPath();
            cxt.moveTo(0 + x, 16 + y);
            cxt.lineTo(16 + x, 0 + y);
            cxt.lineTo(32 + x, 0 + y);
            cxt.lineTo(16 + x, 16 + y);
            cxt.fillStyle = roofColor;
            cxt.fill();
            cxt.closePath();
            
            
        }
        
        //landscape
        drawLandscape();
        cxt.save();
        
        //movable clouds
        cxt.translate(csv, 0);
        drawCloud(5, 10);
        drawCloud(85, 45);
        drawCloud(175, 7);
        drawCloud(-95, 7);
        drawCloud(-45, 50);
        cxt.restore();
        
        //groups of trees
        drawTree(5, 110);
        drawTree(15, 100);
        drawTree(25, 115);
        
        drawTree(75, 165);
        drawTree(95, 166);
        drawTree(86, 172);
        drawTree(110, 170);
        
        drawTree(115, 90);
        drawTree(125, 100);
        drawTree(140, 97);
        
        drawTree(30, 70);
        drawTree(42, 75);
        
        //cabin
        drawCabin(50,100);
    }
    cloudSlider.addEventListener("input", draw);
    timeSlider.addEventListener("input", draw);
    draw();
}
window.onload = drawing;