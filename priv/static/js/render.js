var canvas = document.getElementById("canvas");
var canvas_width = canvas.width
var canvas_height = canvas.height

var context = canvas.getContext('2d');
context.strokeStyle = '#2f4f4f';
context.lineWidth = 1;

// function onDown(e) {
//   console.log("down");
// }

// function onUp(e) {
//   console.log("up");
// }

function onClick(e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;

    x_int = Math.round(x * (flow_width / canvas_width));
    y_int = Math.round(y * (flow_height / canvas_height));
    console.log("x:", x_int, "y:", y_int);
    console.log("u:", flow_data['u'][y_int][x_int], "v:", flow_data['v'][y_int][x_int]);
}

// function drawRect(x, y, width, height) {
//   var context = canvas.getContext('2d');
//   context.fillRect(x, y, width, height);
// }

// function onOver(e) {
//   console.log("mouseover");
// }

// function onOut() {
//   console.log("mouseout");
// }

// canvas.addEventListener('mousedown', onDown, false);
// canvas.addEventListener('mouseup', onUp, false);
canvas.addEventListener('click', onClick, false);
// canvas.addEventListener('mouseover', onOver, false);
// canvas.addEventListener('mouseout', onOut, false);


function drawSegment(start, end) {
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.lineTo(end[0], end[1]);
    context.stroke();
}

function update() {
    console.log("[Info] update");
    aspect_ratio = [canvas_width / flow_width, canvas_height / flow_height];
    context.clearRect(0, 0, canvas_width, canvas_height);

    var image_data = context.getImageData(0, 0, canvas_width, canvas_height);
    setColorRange('#99ff99', '#00ff00', -1.0, 0.0);
    for (var j = 0; j < canvas_height; j++) {
        for (var i = 0; i < canvas_width; i++) {
            var bg_color = value2ColorNum(getPressureCoefficient(Math.floor(i / aspect_ratio[0]), Math.floor(j / aspect_ratio[1])), -1.0, 0.0);
            var index = 4 * (i + j * canvas_width);
            image_data.data[index + 0] = bg_color[0];
            image_data.data[index + 1] = bg_color[1];
            image_data.data[index + 2] = bg_color[2];
            image_data.data[index + 3] = 255;
        }
    }
    context.putImageData(image_data, 0, 0);

    var normal_line_data = getStreamLines(80);
    var extra_line_data = getExtraStreamLines();
    var line_data = normal_line_data.concat(extra_line_data);;
    setColorRange('#000000', '#ffffff', 0, (aspect_ratio[0] + aspect_ratio[1]) / 5);

    // render the stream lines
    for (var i = 0; i < line_data.length; i++) {
        line_data[i][0][0] *= aspect_ratio[0];
        line_data[i][0][1] *= aspect_ratio[1];
        for (var j = 1; j < line_data[i].length; j++) {
            try {
                context.strokeStyle = value2Color(getAbsVel(line_data[i][j][0], line_data[i][j][1]));
            } catch(e) {}
            line_data[i][j][0] = line_data[i][j][0] * aspect_ratio[0];
            line_data[i][j][1] = line_data[i][j][1] * aspect_ratio[1];
            drawSegment(line_data[i][j-1], line_data[i][j]);
        }
    }
}
