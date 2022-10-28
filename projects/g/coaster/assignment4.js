function drawing() {
	var canvas = document.getElementById('myCanvas');
	
	var heightSlider = document.getElementById('height');
	heightSlider.value = 0;
	var bgSlider = document.getElementById('bg');
	bgSlider.value = 0;

	var progress = -0.1;

	function draw() {
		var cxt = canvas.getContext('2d');
		canvas.width = canvas.width;
		var height = (heightSlider.value * 0.01) - 0.75;
		var bgShape = (bgSlider.value * 0.05) - 5;

		
		//drawing functions
		function moveToTx(loc, Tx) { var res = vec2.create(); vec2.transformMat3(res, loc, Tx); cxt.moveTo(res[0], res[1]); }

		function lineToTx(loc, Tx) { var res = vec2.create(); vec2.transformMat3(res, loc, Tx); cxt.lineTo(res[0], res[1]); }

		//curve functions
		var Hermite = function (t) {
			return [
				2 * t * t * t - 3 * t * t + 1,
				t * t * t - 2 * t * t + t,
				-2 * t * t * t + 3 * t * t,
				t * t * t - t * t
			];
		}

		var HermiteDerivative = function (t) {
			return [
				6 * t * t - 6 * t,
				3 * t * t - 4 * t + 1,
				-6 * t * t + 6 * t,
				3 * t * t - 2 * t
			];
		}

		function Cubic(basis, P, t) {
			var b = basis(t);
			var result = vec2.create();
			vec2.scale(result, P[0], b[0]);
			vec2.scaleAndAdd(result, result, P[1], b[1]);
			vec2.scaleAndAdd(result, result, P[2], b[2]);
			vec2.scaleAndAdd(result, result, P[3], b[3]);
			return result;
		}

		var Ccomp = function (t) {
			if (t < 1) {
				var u = t;
				return C0(u);
			} else {
				var u = t - 1.0;
				return C1(u);
			}
		}

		var Ccomp_tangent = function (t) {
			if (t < 1) {
				var u = t;
				return C0prime(u);
			} else {
				var u = t - 1.0;
				return C1prime(u);
			}
		}

		// draws line over an interval (reworked from class example)
		function drawTrajectory(t_begin, t_end, intervals, C, Tx) {
			lineToTx(C(t_begin), Tx);
			for (var i = 1; i <= intervals; i++) {
				var t = ((intervals - i) / intervals) * t_begin + (i / intervals) * t_end;
				lineToTx(C(t), Tx);
			}
		}

		//draws image from filepath at position (x,y)
		function drawImagePath(path, x, y) {
            var image = new Image()
            image.src = path;
            cxt.drawImage(image, x, y);
        }

		function placeCar(carFunc, offset, track) {
			var car_to_track = mat3.create();
			mat3.fromTranslation(car_to_track, Ccomp(progress + offset));
			var car_to_canvas = mat3.create();
			var tangent = Ccomp_tangent(progress + offset);
			var angle = Math.atan2(tangent[1], tangent[0]);
			mat3.rotate(car_to_track, car_to_track, angle);
			mat3.multiply(car_to_canvas, track, car_to_track);
			carFunc(car_to_canvas);
		}

		var coasterStrokeStyle = "#5D2232"
		var coasterFillStyle = "#FFEFA2"
		var coasterLineWidth = 3;

		function drawFrontCoaster(Tx) {
			cxt.beginPath();
			cxt.fillStyle = coasterFillStyle;
			cxt.strokeStyle = coasterStrokeStyle;
			cxt.lineWidth = coasterLineWidth;
			moveToTx([-.1, 0], Tx);
			lineToTx([-.1, .15], Tx);
			lineToTx([.07, .15], Tx);
			lineToTx([.15, 0], Tx);
			cxt.closePath();
			cxt.fill();
			cxt.stroke();
		}

		function drawCoaster(Tx) {
			cxt.beginPath();
			cxt.fillStyle = coasterFillStyle;
			cxt.strokeStyle = coasterStrokeStyle;
			cxt.lineWidth = coasterLineWidth;
			moveToTx([-.125, 0], Tx);
			lineToTx([-.125, .15], Tx);
			lineToTx([.125, .15], Tx);
			lineToTx([.125, 0], Tx);
			cxt.closePath();
			cxt.fill();
			cxt.stroke();
		}

		function drawTrack() {

		}

		//background
        drawImagePath("assets/bg.png", 0, 0);


		//background track curve definitions
		var p0 = [-1, 0];
		var d0 = [1, 5];
		var p1 = [1.5, 1];
		var d1 = [2.5, (3 + bgShape)];
		var p2 = [4, 0];
		var d2 = [4, -3];

		var P0 = [p0, d0, p1, d1]; // First two points and tangents
		var P1 = [p1, d1, p2, d2]; // Last two points and tangents

		var C0 = function (t_) { return Cubic(Hermite, P0, t_); };
		var C1 = function (t_) { return Cubic(Hermite, P1, t_); };

		var C0prime = function (t_) { return Cubic(HermiteDerivative, P0, t_); };
		var C1prime = function (t_) { return Cubic(HermiteDerivative, P1, t_); };
		

		//draw bg track defined by curve
		var track_to_canvas = mat3.create();
		mat3.fromTranslation(track_to_canvas, [0, 350]);
		mat3.scale(track_to_canvas, track_to_canvas, [150, -150]);

		var latticeImage = new Image()
        latticeImage.src = "assets/bg_lattice.png";
		lattice = cxt.createPattern(latticeImage,'repeat');
		cxt.strokeStyle = "#966A59";
		cxt.fillStyle = lattice;
		cxt.lineWidth = 8;

		cxt.beginPath();
		drawTrajectory(0.0, 1.0, 100, C0, track_to_canvas);
		drawTrajectory(0.0, 1.0, 100, C1, track_to_canvas);
		cxt.closePath();
		cxt.stroke();
		cxt.fill();


		//foreground track curve definitions
		var p0 = [-0.25, 0];
		var d0 = [1, 2];
		var p1 = [1.25, (1.5 + height)];
		var d1 = [2, (2 + height)];
		var p2 = [3, 0];
		var d2 = [3, 0];

		var P0 = [p0, d0, p1, d1]; // First two points and tangents
		var P1 = [p1, d1, p2, d2]; // Last two points and tangents

		var C0 = function (t_) { return Cubic(Hermite, P0, t_); };
		var C1 = function (t_) { return Cubic(Hermite, P1, t_); };

		var C0prime = function (t_) { return Cubic(HermiteDerivative, P0, t_); };
		var C1prime = function (t_) { return Cubic(HermiteDerivative, P1, t_); };


		//draw fg track defined by curve
		var track_to_canvas = mat3.create();
		mat3.fromTranslation(track_to_canvas, [0, 350]);
		mat3.scale(track_to_canvas, track_to_canvas, [150, -150]);

		var latticeImage = new Image()
        latticeImage.src = "assets/lattice.png";
		lattice = cxt.createPattern(latticeImage,'repeat');
		cxt.strokeStyle = "#5D2232";
		cxt.fillStyle = lattice;
		cxt.lineWidth = 8;

		cxt.beginPath();
		drawTrajectory(0.0, 1.0, 100, C0, track_to_canvas);
		drawTrajectory(0.0, 1.0, 100, C1, track_to_canvas);
		cxt.closePath();
		cxt.stroke();
		cxt.fill();


		//draw coaster cars on track
		placeCar(drawCoaster, -0.3, track_to_canvas);
		placeCar(drawCoaster, -0.15, track_to_canvas);
		placeCar(drawFrontCoaster, 0, track_to_canvas);


		if (progress <= 2.4) {
			progress += .01;
		} else {
			progress = -0.05;
		}
		window.requestAnimationFrame(draw);
	}
	draw();
}
window.onload = drawing;

