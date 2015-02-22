/// <reference path="source/source.ts" />
/// <reference path="oscillator/oscillator.ts" />

var a = new RadioInterferometry.Oscillator(OscillatorType.Saw, 100, 0, 1, 2048, 44100);
var b = new RadioInterferometry.Source(SourceType.Point, 10, 0, 0, 2048, 0.1);
var c = new RadioInterferometry.Source(SourceType.Gaussian, 10, 0, 5, 2048, 0.1);

var data: Array<Array<number>> = [];
var data1: Array<Array<number>> = [];
var data2: Array<Array<number>> = [];

for (var i = 0; i < a.signalX.length; i++) {
    data.push([
        a.signalX[i],
        a.signalY[i]
    ]);
}

for (var i = 0; i < b.signalX.length; i++) {
    data1.push([
        b.signalX[i],
        b.signalY[i]
    ]);

    data2.push([
        c.signalX[i],
        c.signalY[i]
    ]);
}

var options = {
    xaxis: {
        min: -150,
        max: 150
    },
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
    input1 = $.plot($('#input1'), [data1], options),
    input2 = $.plot($('#input2'), [data2], options),
    localOscillator = $.plot($('#localOscillator'), [data], options),
    mixed1 = $.plot($('#mixed1'), [data], options),
    mixed2 = $.plot($('#mixed2'), [data], options),
    output = $.plot($('#output'), [data], options);