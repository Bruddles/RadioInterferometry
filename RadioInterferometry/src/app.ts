/// <reference path="oscillator/oscillator.ts" />
/// <reference path="fft/fft.ts" />

var a = new RadioInterferometry.Oscillator(OscillatorType.Saw, 100, 0, 1, 2048, 44100);

var data = []

for (var i = 0; i < a.signalX.length; i++) {
    data.push([
        a.signalX[i],
        a.signalY[i]
    ]);
}

var options = {
    axisLabels: {
        show: true
    },
    xaxes: [{
        axisLabel: 'Time / s'
    }],
    yaxes: [{
        position: 'left',
        axisLabel: 'Amplitude'
    }]
};

var source = $.plot($('#source'), [data], options),
    input1 = $.plot($('#input1'), [data], options),
    input2 = $.plot($('#input2'), [data], options),
    localOscillator = $.plot($('#localOscillator'), [data], options),
    mixed1 = $.plot($('#mixed1'), [data], options),
    mixed2 = $.plot($('#mixed2'), [data], options),
    output = $.plot($('#output'), [data], options);