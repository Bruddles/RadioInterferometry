/// <reference path="oscillator/oscillator.ts" />
/// <reference path="fft/fft.ts" />

var a = new RadioInterferometry.Oscillator(OscillatorType.Sine, 1, 0, 1, 2048, 44100);



var data = []

for (var i = 0; i < a.signalX.length; i++) {
    data.push([
        a.signalX[i],
        a.signalY[i]
    ]);
}


var plot = $.plot($('#graph'), data, null);