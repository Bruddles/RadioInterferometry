var Oscillator = (function () {
    /**
    * Oscillator class for generating and modifying signals
    *
    * @param {Number} type       A waveform constant (eg. DSP.SINE)
    * @param {Number} frequency  Initial frequency of the signal
    * @param {Number} amplitude  Initial amplitude of the signal
    * @param {Number} bufferSize Size of the sample buffer to generate
    * @param {Number} sampleRate The sample rate of the signal
    *
    * @contructor
    */
    function Oscillator(type, frequency, amplitude, bufferSize, sampleRate) {
        this._frequency = frequency;
        this._amplitude = amplitude;
        this._bufferSize = bufferSize;
        this._sampleRate = sampleRate;
        this._frameCount = 0;
        this._waveTableLength = 2048;
        this._cyclesPerSample = frequency / sampleRate;
        this._signal = new Float32Array(bufferSize);
        this._envelope = null;
        switch (type) {
            case 1 /* Cosine */:
                this._func = Oscillator.Cosine;
                break;
            case 2 /* Triangle */:
                this._func = Oscillator.Triangle;
                break;
            case 3 /* Saw */:
                this._func = Oscillator.Saw;
                break;
            case 4 /* Square */:
                this._func = Oscillator.Square;
                break;
            default:
            case 0 /* Sine */:
                this._func = Oscillator.Sine;
                break;
        }
        if (typeof Oscillator.waveTable === 'undefined') {
            Oscillator.waveTable = {};
        }
        if (typeof Oscillator.waveTable[this._func] === 'undefined') {
            this._generateWaveTable();
        }
        this._waveTable = Oscillator.waveTable[this._func];
    }
    Oscillator.prototype._generateWaveTable = function () {
        Oscillator.waveTable[this._func] = new Float32Array(2048);
        var waveTableTime = this._waveTableLength / this._sampleRate;
        var waveTableHz = 1 / waveTableTime;
        for (var i = 0; i < this._waveTableLength; i++) {
            Oscillator.waveTable[this._func][i] = this._func(i * waveTableHz / this._sampleRate);
        }
    };
    Oscillator.Sine = function (step) {
        return Math.sin(2 * Math.PI * step);
    };
    Oscillator.Cosine = function (step) {
        return Math.cos(2 * Math.PI * step);
    };
    Oscillator.Square = function (step) {
        return step < 0.5 ? 1 : -1;
    };
    Oscillator.Saw = function (step) {
        return 2 * (step - Math.round(step));
    };
    Oscillator.Triangle = function (step) {
        return 1 - 4 * Math.abs(Math.round(step) - step);
    };
    Oscillator.Pulse = function (step) {
        // stub
    };
    return Oscillator;
})();
exports.Oscillator = Oscillator;
//# sourceMappingURL=OscillatorClass.js.map