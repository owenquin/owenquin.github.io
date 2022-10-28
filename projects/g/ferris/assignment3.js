const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

function drawing() { "use strict";
    var canvas = document.getElementById('myCanvas');
                    
    var speedSlider = document.getElementById('speed');
    
    var progress = 0;
                    
    function draw() {
        var cxt = canvas.getContext('2d');
        
        var speed = speedSlider.value * 0.005 * Math.PI;
        
        function drawImagePath(path, x, y) {
            var image = new Image()
            image.src = path;
            cxt.drawImage(image, x, y);
        }
        
        function moveToTx(x,y,Tx) {
            var res=vec2.create(); 
            vec2.transformMat3(res,[x,y],Tx); 
            cxt.moveTo(res[0],res[1]);
        }

        function lineToTx(x,y,Tx) {
            var res=vec2.create(); 
            vec2.transformMat3(res,[x,y],Tx); 
            cxt.lineTo(res[0],res[1]);
        }

        function drawSeat (x, y, Tx) {
            var res=vec2.create(); 
            vec2.transformMat3(res,[x,y], Tx);
            drawImagePath("assets/chair.png", res[0] - 18, res[1]);
        }

        function drawWheel(x, y, rotation) {
            function wheelShape() {
                cxt.beginPath();
                // draw spokes
                moveToTx(0, -135, Tx);
                lineToTx(0, 135, Tx);
                moveToTx(-135, 0, Tx);
                lineToTx(135, 0, Tx);
                moveToTx(95.4594154602, 95.4594154602, Tx);
                lineToTx(-95.4594154602, -95.4594154602, Tx);
                moveToTx(-95.4594154602, 95.4594154602, Tx);
                lineToTx(95.4594154602, -95.4594154602, Tx);
                // draw rim
                moveToTx(0, -135, Tx);
                lineToTx(95.4594154602, -95.4594154602, Tx);
                lineToTx(135, 0, Tx);
                lineToTx(95.4594154602, 95.4594154602, Tx);
                lineToTx(0, 135, Tx);
                lineToTx(-95.4594154602, 95.4594154602, Tx);
                lineToTx(-135, 0, Tx);
                lineToTx(-95.4594154602, -95.4594154602, Tx);
                cxt.closePath();
                cxt.stroke();
            }
            var wheel_to_canvas = mat3.create();
            mat3.fromTranslation(wheel_to_canvas,[x,y]);
            mat3.rotate(wheel_to_canvas, wheel_to_canvas, rotation);
            var Tx = wheel_to_canvas;

            // seats
            drawSeat(0, 135, Tx);
            drawSeat(0, -135, Tx);
            drawSeat(135, 0, Tx);
            drawSeat(-135, 0, Tx);
            drawSeat(95.4594154602, 95.4594154602, Tx);
            drawSeat(-95.4594154602, -95.4594154602, Tx);
            drawSeat(-95.4594154602, 95.4594154602, Tx);
            drawSeat(95.4594154602, -95.4594154602, Tx);

            // draw wheel
            cxt.lineWidth = 7
            cxt.strokeStyle = "#4C4469";
            wheelShape();
            cxt.lineWidth = 2
            cxt.strokeStyle = "#FF826B";
            wheelShape();
        }
        
        //background
        drawImagePath("assets/ferris_bg.png", 0, 0);
        
        //wheel
        
        progress += 0.005 * speed
        drawWheel(225,205,progress);

        //foreground
        drawImagePath("assets/ferris_fg.png", 0, 0);
        
        window.requestAnimationFrame(draw);
    }
    draw();
}
window.onload = drawing;