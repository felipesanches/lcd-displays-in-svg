// Date: 2022-February-20
// Author: Felipe Correa da Silva Sanches
// This source-code is dedicated to the public domain.

var timer=0;

function clock_tick(){
    timer+=1;
    update_timer();
}

//  14-segment display
//  Segment names:
//
//             A
//       -------------
//      |\     |     /|
//      | \   I|    / |
//      | H\   |  J/  |
//    F |   \  |  /   | B
//      |    \ | /    |
//      |  G1 \|/  G2 |
//       ------ -------
//      |     /|\     |
//      |    / | \    |
//      |  M/  |  \K  | C
//    E |  /  L|   \  |
//      | /    |    \ |
//      |/     |     \|
//       -------------  
//             D

const FontTable = {
//         ABCDEFGGHIJKLM
//               12
    ' ': 0b00000000000000,
    '0': 0b11111100001001,
    '1': 0b01100000001000,
    '2': 0b11011011000000,
    '3': 0b11110001000000,
    '4': 0b01100111000000,
    '5': 0b10110111000000,
    '6': 0b10111111000000,
    '7': 0b11100000000000,
    '8': 0b11111111000000,
    '9': 0b11110111000000,
    'A': 0b11101111000000,
    'B': 0b11110001010010,
    'C': 0b10011100000000,
    'D': 0b11110000010010,
    'E': 0b10011111000000,
    'F': 0b10001111000000,
    'G': 0b10111101000000,
    'H': 0b01101111000000,
    'I': 0b10010000010010,
    'J': 0b01111000000000,
    'K': 0b00001110001100,
    'L': 0b00011100000000,
    'M': 0b01101100101000,
    'N': 0b01101100100100,
    'O': 0b11111100000000,
    'P': 0b11001111000000,
    'Q': 0b11111100000100,
    'R': 0b11001111000100,
    'S': 0b10110111000000,
    'T': 0b10000000010010,
    'U': 0b01111100000000,
    'V': 0b00001100001001,
    'W': 0b01101100000101,
    'X': 0b00000000101101,
    'Y': 0b01000111000010,
    'Z': 0b10010000001001,
}

function setDigit(digit, char) {
    const labels = ['m', 'l', 'k', 'j', 'i', 'h', 'g2', 'g1', 'f', 'e', 'd', 'c', 'b', 'a'];
    var state = FontTable[char];
    for (var segment = 0; segment < 14; segment++)
        setSegment(digit, labels[segment], state & (1 << segment));
}

function setSegment(digit, seg, state) {
    var s = document.getElementById('d' + String.fromCharCode(0x61+digit) + '_' + seg);
    s.setAttribute('visibility', state ? 'visible' : 'hidden');
}


function setSeconds(sec) {
    for (var i=0; i<=59; i++){
        var n = String(i);
        if (i<10) n = "0" + n;
        var s = document.getElementById('dot_' + n);
        s.setAttribute('visibility', i<=sec ? 'visible' : 'hidden');
    }
}


function print_text(text_string, position){
    for (var i=0; i<text_string.length; i++){ 
        setDigit(9-(position+i), text_string[text_string.length - 1 - i]);
    }
}

function print_number(value, position, field_length){
    for (var digit=position; digit<=position+field_length-1; digit++){
        if (digit>=0 && digit<=7){
            if (value){
                setDigit(7-digit, String.fromCharCode(0x30 + value%10));
                value = Math.floor(value/10);
            } else {
                setDigit(7-digit, ' ');
            }
        }
    }
}

function scroll_text(text_string, position){
    var i = timer % (text_string.length + 10);
    text_string = "          " + text_string + "          ";
    print_text(text_string.slice(i, i+10), position);
}

const text_messages = [
    "VERY COOL SVG ANIMATION",
    "0123456789",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

function update_timer(){
//    print_number(timer, 0, 10);
//    print_text("TESTE UVWXYZ", 0);
    scroll_text(text_messages.join("          "), 0);
    setSeconds(timer%60);
}

function reset_display() {
    timer = 0;
    update_timer();
}

function init_clock_display(){
    reset_display();
    setInterval(clock_tick, 200);
}
