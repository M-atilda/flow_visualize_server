// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
// import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import {Socket} from "phoenix"


var sock;
var channel;

var ite_times = 15000;
var MAX_ITE_TIMES = 3400;

function initSock() {
    sock = new Socket("/socket");
    sock.connect();
    channel = sock.channel("room:lobby", {});
    channel.join();

    channel.on("data", function(data) {
        flow_data['u'] = data.flow_data['u'];
        flow_data['v'] = data.flow_data['v'];
        flow_data['p'] = data.flow_data['p'];
        flow_width = flow_data['u'][0].length;
        flow_height = flow_data['u'].length;
        update();
        console.log("[Info] image updated <", ite_times, ">");
        // if (ite_times < MAX_ITE_TIMES) {
        //     channel.push("data", {name: "sample", time: String(ite_times)});
        //     ite_times += 1;
        // } else {
        //     console.log("[Info] finish");
        // }
    });
}

function sendStart() {
    console.log("[Info] send start signal");
    channel.push("data", {name: "sample", time: String(ite_times)});
    ite_times += 1;
}

window.onload = function() {
    initSock();
    document.getElementById("start_button").onclick = function() {
        sendStart();
    }
}
