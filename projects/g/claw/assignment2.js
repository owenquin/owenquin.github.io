function drawing() { "use strict";
    var canvas = document.getElementById('myCanvas');
                    
    var control = document.getElementById('control');
                    
    var xSlider = document.getElementById('clawXPos');
    var ySlider = document.getElementById('clawYPos');
    var clawSlider = document.getElementById('clawClose');
    
    var xSpeedSlider = document.getElementById('clawXSpeed');
    var ySpeedSlider = document.getElementById('clawYSpeed');
    
    var animation;
          
    control.checked = false;
                    
    disable();
                    
    //animation variables
    var x = 0;
    var y = 0;
    var clawVal = 0;
                    
    function disable() {
        xSlider.disabled = !control.checked;
        ySlider.disabled = !control.checked;
        clawSlider.disabled = !control.checked;
        
        xSpeedSlider.disabled = control.checked;
        ySpeedSlider.disabled = control.checked;
        
        xSlider.value = 50;
        ySlider.value = 50;
        clawSlider.value = 0;
        
        xSpeedSlider.value = 0;
        ySpeedSlider.value = 0;
        
        draw();
    }    
                    
    function draw() {
        var cxt = canvas.getContext('2d');
        
        var xVal = xSlider.value;
        var yVal = ySlider.value;
        var claw = clawSlider.value;
        
        var xSpeed = xSpeedSlider.value;
        var ySpeed = ySpeedSlider.value;
        
        var animated = Boolean(!control.checked);
        
        function drawClaw(clawX, clawY, closed) {
            cxt.save();
            
            cxt.translate(120, -110)
            cxt.translate(clawX, clawY);
            
            cxt.save();
            cxt.translate(-23, 211);
            cxt.translate(30, 12);
            cxt.rotate(.5 - (closed * 0.0016 * Math.PI));
            cxt.translate(-30, -12);
            drawImagePath("assets/claw_lfinger.png");
            cxt.restore();
            
            cxt.save();
            cxt.translate(-6, 211);
            cxt.translate(13, 12);
            cxt.rotate(-.5 + (closed * 0.0016 * Math.PI));
            cxt.translate(-13, -12);
            drawImagePath("assets/claw_rfinger.png");
            cxt.restore();
            
            var clawArm = new Image();
            drawImagePath("assets/claw_arm.png");
            cxt.drawImage(clawArm, 0, 0);
            
            cxt.restore();
        }
        
        function drawImagePath(path) {
            var image = new Image()
            image.src = path;
            cxt.drawImage(image, 0, 0);
        }
        
        if (animated && animation) {
            window.cancelAnimationFrame(animation);
        }
        
        //background
        drawImagePath("assets/claw_bg.png");
        
        //movable claw
        if (animated) {
            var xAngle = ((x/100) * 360) * (180 / Math.PI) * (0.0001 * (xSpeed/70 + 1.5));
            var yAngle = ((y/100) * 360) * (180 / Math.PI) * (0.0001 * (ySpeed/70 + 1.5));
            drawClaw(100 + (50 * Math.cos(xAngle)), 40 + (50 * Math.sin(yAngle)), (Math.sin(clawVal * 0.03) * 100));
            x = (x + 1);
            y = (y + 1);
            clawVal = (clawVal + 1);
        } else {
            drawClaw(xVal * 2, yVal, claw);
        }
        
        //toys
        cxt.save();
        cxt.translate(120, 193);
        drawImagePath("assets/toy_bear.png");
        cxt.translate(60, 37);
        drawImagePath("assets/toy_ball.png");
        cxt.translate(83, -3);
        drawImagePath("assets/toy_truck.png");
        cxt.translate(-55, -1);
        drawImagePath("assets/toy_football.png");
        cxt.restore();
        
        //foreground
        drawImagePath("assets/claw_fg.png");
        
        
        if (animated) {
            animation = window.requestAnimationFrame(draw);
        }
    }
    xSlider.addEventListener("input", draw);
    ySlider.addEventListener("input", draw);
    clawSlider.addEventListener("input", draw);
    control.addEventListener("change", disable);
    draw();
}
window.onload = drawing;