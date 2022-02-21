// Date: 2022-February-19
// Author: Felipe Correa da Silva Sanches
// This source-code is dedicated to the public domain.

function set_led_player_1(state){
    document.getElementById('p1-led').setAttribute('visibility', state ? 'visible' : 'hidden');
}

function set_led_player_2(state){
    document.getElementById('p2-led').setAttribute('visibility', state ? 'visible' : 'hidden');
}

const TOTAL_GAME_TIME = 5*60;
const PLAYER_1 = 0
const PLAYER_2 = 1
const CLOCK_STOPPED = 2
var current_player = CLOCK_STOPPED;
var timers = [TOTAL_GAME_TIME,
              TOTAL_GAME_TIME];

function set_active_player(p){
    current_player = p;
    if (p == PLAYER_1){
        set_led_player_1(true);
        set_led_player_2(false);
    } else {
        set_led_player_1(false);
        set_led_player_2(true);
    }
}

var tick=0;

function set_tick_segments(tick){
    if (current_player == PLAYER_1){
        document.getElementById('p1-tick').setAttribute('visibility', tick ? 'visible' : 'hidden');
        document.getElementById('p2-tick').setAttribute('visibility', 'visible');
    }

    if (current_player == PLAYER_2){
        document.getElementById('p1-tick').setAttribute('visibility', 'visible');
        document.getElementById('p2-tick').setAttribute('visibility', tick ? 'visible' : 'hidden');
    }
}

function clock_tick(){
    if (tick==0){
        tick=1;
    } else {
        tick=0;
        if (current_player != CLOCK_STOPPED){
            if (timers[current_player] == 0){
                current_player = CLOCK_STOPPED;
            } else {
                timers[current_player]--;
                update_timer(current_player);
            }
        }
    }
    set_tick_segments(tick);
}

function p1_button_pressed(){
    if (current_player == CLOCK_STOPPED){
        reset_clock(TOTAL_GAME_TIME);
        set_active_player(PLAYER_1);
    } else {
        set_active_player(PLAYER_2);
    }
}

function p2_button_pressed(){
    if (current_player == CLOCK_STOPPED){
        reset_clock(TOTAL_GAME_TIME);
        set_active_player(PLAYER_2);
    } else {
        set_active_player(PLAYER_1);
    }
}

function reset_button_pressed(){
    if (current_player == CLOCK_STOPPED){
        reset_clock(TOTAL_GAME_TIME);
    } else {
        current_player = CLOCK_STOPPED;
    }
}

//  7-segment display
//  Segment names:
//
//         a
//       -----
//      |     |
//     f|     |b
//      |  g  |
//       -----
//      |     |
//     e|     |c
//      |  d  |
//       -----  

const FontTable = {
//       abcdefg
    0: 0b1111110,
    1: 0b0110000,
    2: 0b1101101,
    3: 0b1111001,
    4: 0b0110011,
    5: 0b1011011,
    6: 0b1011111,
    7: 0b1110000,
    8: 0b1111111,
    9: 0b1111011
}

function setDigit(player, digit, value) {
        var state = FontTable[value];
        for (var segment = 0; segment < 7; segment++)
            setSegment(player, digit, 'gfedcba'[segment], state & (1 << segment));
}

function setSegment(player, digit, seg, state) {
    var s = document.getElementById('p' + (player+1) + '_d' + digit + '_' + seg);
    s.setAttribute('visibility', state ? 'visible' : 'hidden');
}

function update_timer(player){
    var time = timers[player];
    setDigit(player, 0, Math.floor(time/60));
    setDigit(player, 1, Math.floor((time%60)/10));
    setDigit(player, 2, (time%60)%10);
}

function reset_clock(total_game_time) {
    current_player = CLOCK_STOPPED;
    set_led_player_1(false);
    set_led_player_2(false);

    timers[PLAYER_1] = total_game_time;
    update_timer(PLAYER_1);

    timers[PLAYER_2] = total_game_time;
    update_timer(PLAYER_2);
}

function init_chess_timer(){
    reset_clock(TOTAL_GAME_TIME);
    setInterval(clock_tick, 500);
}
