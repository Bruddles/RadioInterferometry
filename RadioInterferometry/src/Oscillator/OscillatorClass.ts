module RadioInterferometry {
    export class Oscillator {
        public static Sine = function(step: number, phi?: number) {
            return Math.sin((2 * Math.PI * step) + (phi ? phi : 0));
        };

        public static Cosine = function(step: number, phi?: number) {
            return Math.cos((2 * Math.PI * step) + (phi ? phi : 0));
        };

        public static Square = function(step: number, phi?: number) {
            return step < 0.5 ? 1 : -1;
        };

        public static Saw = function(step: number, phi?: number) {
            return 2 * (step - Math.round(step));
        };

        public static Triangle = function(step: number, phi?: number) {
            return 1 - 4 * Math.abs(Math.round(step) - step);
        };

        private _frequency: number;
        private _phaseDifference: number;
        private _amplitude: number;
        private _timeStep: number;
        private _bufferSize: number;
        private _signal: { [time: number]: number } = [];
        private _func: any;

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
        constructor(type: OscillatorType, frequency: number, phaseDifference: number, amplitude: number, bufferSize: number) {
            this._frequency = frequency;
            this._phaseDifference = phaseDifference;
            this._amplitude = amplitude;
            this._bufferSize = bufferSize;
            this._timeStep = this._frequency / 10;

            switch (type) {
            case OscillatorType.Cosine:
                this._func = Oscillator.Cosine;
                break;
            case OscillatorType.Triangle:
                this._func = Oscillator.Triangle;
                break;

            case OscillatorType.Saw:
                this._func = Oscillator.Saw;
                break;

            case OscillatorType.Square:
                this._func = Oscillator.Square;
                break;

            default:
            case OscillatorType.Sine:
                this._func = Oscillator.Sine;
                break;
            }

            this._generate();

        }

        private _generate() {
            for (var i = -1 * this._bufferSize; i < this._bufferSize; i++) {
                var time: number = i * this._timeStep;
                this._signal[time] = this._amplitude * this._func(time, this._phaseDifference);
            }
        }

        public setAmp(amplitude: number) {
            this._amplitude = amplitude;
        }

        public setFreq(frequency: number) {
            this._frequency = frequency;
        }

        public setPhaseDifference(phaseDifference: number) {
            this._phaseDifference = phaseDifference;
        }
    }
}

var a = new RadioInterferometry.Oscillator(OscillatorType.Sine, 1, 0, 1, 100);
