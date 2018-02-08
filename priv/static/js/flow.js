var flow_data = {'u': null, 'v': null, 'p':null};
var flow_width = 0;
var flow_height = 0;

// drawing parameters
var MAX_LENGTH = 100000;
var DELTA = 0.1;

function getCorrectVel(x, y) {
    // interpolation (just getting average of 4 arround points)
    // TODO: it seems too heaby process to be done for each turn
    var min_x = Math.floor(x);
    var min_y = Math.floor(y);
    var min_x_cont = x - min_x;
    var min_y_cont = y - min_y;
    var mm_dist = min_x_cont ** 2 + min_y_cont ** 2;
    var mp_dist = min_x_cont ** 2 + (1 - min_y_cont) ** 2;
    var pm_dist = (1 - min_x_cont) ** 2 + min_y_cont ** 2;
    var pp_dist = (1 - min_x_cont) ** 2 + (1 - min_y_cont) ** 2;
    var total = mm_dist + mp_dist + pm_dist + pp_dist;

    interpolated_u =
        flow_data['u'][min_y][min_x] * (mm_dist / total) +
        flow_data['u'][min_y+1][min_x] * (mp_dist / total) +
        flow_data['u'][min_y][min_x+1] * (pm_dist / total) +
        flow_data['u'][min_y+1][min_x+1] * (pp_dist / total);
    interpolated_v =
        flow_data['v'][min_y][min_x] * (mm_dist / total) +
        flow_data['v'][min_y+1][min_x] * (mp_dist / total) +
        flow_data['v'][min_y][min_x+1] * (pm_dist / total) +
        flow_data['v'][min_y+1][min_x+1] * (pp_dist / total);

    return [interpolated_u, interpolated_v];
}
function getAbsVel(x, y) {
    var vel = getCorrectVel(x, y);
    return (vel[0] ** 2 + vel[1] ** 2);
}

function getStreamLine(start_pos) {
    var acm = [start_pos];

    var current_x, current_y;
    var vel_1, vel_2, vel_3, vel_4;
    var k_x1, k_x2, k_x3, k_x4;
    var k_y1, k_y2, k_y3, k_y4;
    try {
        while (true) {
            current_x = acm[acm.length - 1][0];
            current_y = acm[acm.length - 1][1];

            // runge-kutta method
            vel_1 = getCorrectVel(current_x, current_y);
            k_x1 = DELTA * vel_1[0];
            k_y1 = DELTA * vel_1[1];
            vel_2 = getCorrectVel(current_x + k_x1 / 2, current_y + k_y1 / 2);
            k_x2 = DELTA * vel_2[0];
            k_y2 = DELTA * vel_2[1];
            vel_3 = getCorrectVel(current_x + k_x2 / 2, current_y + k_y2 / 2);
            k_x3 = DELTA * vel_3[0];
            k_y3 = DELTA * vel_3[1];
            vel_4 = getCorrectVel(current_x + k_x3 / 2, current_y + k_y3 / 2);
            k_x4 = DELTA * vel_4[0];
            k_y4 = DELTA * vel_4[1];
            
            var next_x = current_x + (k_x1 + k_x2 / 2 + k_x3 / 2 + k_x4) / 6;
            var next_y = current_y + (k_y1 + k_y2 / 2 + k_y3 / 2 + k_y4) / 6;

            if (next_x >= flow_width || next_y >= flow_height || next_x < 0 || next_y < 0 || acm.length > MAX_LENGTH) {
                return acm;
            } else {
                acm.push([next_x, next_y]);
                // if (acm.length < 3) {
                //     console.log(acm);
                // }
            }
        }
    } catch(e) {
        return acm;
    }
}

function getStreamLines(num) {
    var distance = flow_data['u'].length / (num + 1);
    var result = new Array(num);

    for (var i = 0; i < num; i++) {
        result[i] = getStreamLine([0, distance * (i+1)]);
    }
    return result;
}

//NOTE: prepare the special start positions manually for visualization the fow around obstacles
function getExtraStreamLines() {
    var START_POS_LIST = [[220, 200], [220, 196], [220, 204], [200, 186], [200, 184], [200, 214], [200, 216]];
    if (START_POS_LIST.length == 0) { return []; }
    var result = new Array(START_POS_LIST.length);
    console.log(START_POS_LIST);
    for (var i = 0; i < START_POS_LIST.length; i++) {
        result[i] = getStreamLine(START_POS_LIST[i]);
    }
    // console.log("[Debug] getExtraStreamLines");
    // console.log(result);
    return result;
}

function getPressureCoefficient(i, j) {
    return flow_data['p'][j][i];
}

var scale;
function setColorRange(min_color, max_color, min_val, max_val) {
    scale = chroma.scale([min_color, max_color]).domain([min_val, max_val]);
}
// function value2Color(val, min_val, max_val) {
//     color_array = scale(val)['_rgb'];
//     return '#' +
//         Math.floor(color_array[0]).toString(16) +
//         Math.floor(color_array[1]).toString(16) +
//         Math.floor(color_array[2]).toString(16);
// }
var color_num_array;
function value2ColorNum(val, min_val, max_val) {
    var color_num_array = scale(val)['_rgb'];
    return [Math.floor(color_num_array[0]),
            Math.floor(color_num_array[1]),
            Math.floor(color_num_array[2])];
}
var color_array;
function value2Color(val, min_val, max_val) {
    var color_array = value2ColorNum(val, min_val, max_val);
    return '#' + color_array[0].toString(16) + color_array[1].toString(16) + color_array.toString(16);
}
