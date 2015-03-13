/// <reference path="source/sourcetypeenum.ts" />
/// <reference path="source/source.ts" />
/// <reference path="oscillator/oscillatortypeenum.ts" />
/// <reference path="oscillator/oscillator.ts" />

//constants
var c: number = 299792458, //Light speed m/s
    toGHz = Math.pow(10, 9);

//Observable variables
var sourceWavelength: number = 3 * Math.pow(10, -3),
    sourceFrequency: number = (c / sourceWavelength), //Hz
    sourceAmplitude: number = 1,
    sourceOffset: number = 0,
    sourceWidth: number = 10,
    sourceType: string = 'Gaussian',
    sourceAngularSize: number = 0,
    localOscillatorFreqency: number = (80 * Math.pow(10, 9)),
    localOscillatorAmplitude: number = 10,
    telescopeBaseline: number = 100, //m
    observingAngle: number = 90; //horizon angle


var source: RadioInterferometry.Source = new RadioInterferometry.Source(SourceType[sourceType], sourceAmplitude, sourceOffset, sourceWidth, 2048, 0.1);
var inputs: Array<RadioInterferometry.Oscillator> = source.generateWaves(telescopeBaseline, Math.PI / 2, sourceFrequency, sourceWidth);
var input1: RadioInterferometry.Oscillator = inputs[0];
var input2: RadioInterferometry.Oscillator = inputs[1];
var localOscillator: RadioInterferometry.Oscillator = new RadioInterferometry.Oscillator(OscillatorType.Cosine, localOscillatorFreqency, 0, localOscillatorAmplitude, 2048, 44100);
var mixed1: RadioInterferometry.Oscillator = input1.mix(localOscillator, true);
var mixed2: RadioInterferometry.Oscillator = input2.mix(localOscillator, true);
var output: RadioInterferometry.Oscillator = new RadioInterferometry.Oscillator(OscillatorType.Saw, 100, 0, 1, 2048, 44100);

var sourceData: Array<Array<number>> = [],
    input1Data: Array<Array<number>> = [],
    input2Data: Array<Array<number>> = [],
    localOscillatorData: Array<Array<number>> = [],
    mixed1Data: Array<Array<number>> = [],
    mixed2Data: Array<Array<number>> = [],
    outputData: Array<Array<number>> = [];

for (var i = 0; i < source.signalX.length; i++) {
    sourceData.push([
        source.signalX[i],
        source.signalY[i]
    ]);
}

for (var i = 0; i < input1.signalX.length; i++) {
    input1Data.push([
        input1.signalX[i],
        input1.signalY[i]
    ]);

    input2Data.push([
        input2.signalX[i],
        input2.signalY[i]
    ]);

    localOscillatorData.push([
        localOscillator.signalX[i],
        localOscillator.signalY[i]
    ]);

    mixed1Data.push([
        mixed1.signalX[i],
        mixed1.signalY[i]
    ]);

    mixed2Data.push([
        mixed2.signalX[i],
        mixed2.signalY[i]
    ]);

    outputData.push([
        output.signalX[i],
        output.signalY[i]
    ]);
}

var options = {
    xaxis: {
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

var sourceGraph = $.plot($('#source'), [sourceData], options),
    input1Graph = $.plot($('#input1'), [input1Data], options),
    input2Graph = $.plot($('#input2'), [input2Data], options),
    localOscillatorGraph = $.plot($('#localOscillator'), [localOscillatorData], options),
    mixed1Graph = $.plot($('#mixed1'), [mixed1Data], options),
    mixed2Graph = $.plot($('#mixed2'), [mixed2Data], options),
    outputGraph = $.plot($('#output'), [outputData], options);