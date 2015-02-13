module RadioInterferometry {
    export class Oscillator {
        static Sine(step: number, phi?: number) {
            return Math.sin((2 * Math.PI * step) + (phi ? phi : 0));
        }

        static Cosine(step: number, phi?: number) {
            return Math.cos((2 * Math.PI * step) + (phi ? phi : 0));
        }

        static Square(step: number, phi?: number) {
            return step < 0.5 ? 1 : -1;
        }

        static Saw(step: number, phi?: number) {
            return 2 * (step - Math.round(step));
        }

        static Triangle(step: number, phi?: number) {
            return 1 - 4 * Math.abs(Math.round(step) - step);
        }

        private _frequency: number;
        get frequency(): number {
            return this._frequency;
        }
          
        private _phaseDifference: number;
        get phaseDifference(): number {
            return this._phaseDifference;
        }

        private _amplitude: number;
        get amplitude(): number {
            return this._amplitude;
        }

        private _bufferSize: number;
        get bufferSize(): number {
            return this._bufferSize;
        }

        private _sampleRate: number;
        get sampleRate(): number {
            return this._sampleRate;
        }

        private _signalY: Float32Array;
        get signalY(): Float32Array {
            return this._signalY;
        }

        private _signalX: Float32Array;
        get signalX(): Float32Array {
            return this._signalX;
        }

        private _func: any;
        get func(): number {
            return this._func;
        }

        constructor(type: OscillatorType, frequency: number, phaseDifference: number, amplitude: number, bufferSize: number, sampleRate: number) {
            this._frequency = frequency;
            this._phaseDifference = phaseDifference;
            this._amplitude = amplitude;
            this._bufferSize = bufferSize;
            this._sampleRate = sampleRate;

            this._signalY = new Float32Array(bufferSize);
            this._signalX = new Float32Array(bufferSize);

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
            for (var i = 0; i < this._bufferSize; i++) {
                var time: number = i / this._sampleRate,
                    theta: number = time * this._frequency;

                this._signalY[i] = this._amplitude * this._func(theta, this._phaseDifference);
                this._signalX[i] = time;
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

        public mix(oscillator: Oscillator, lowBand: boolean): Oscillator {
            if (lowBand) {
                return new Oscillator(OscillatorType.Cosine,(this._frequency - oscillator.frequency),(this._phaseDifference - oscillator.phaseDifference),(0.5 * this._amplitude * oscillator.amplitude), this._bufferSize, this._sampleRate);
            } else {
                return new Oscillator(OscillatorType.Cosine,(this._frequency + oscillator.frequency),(this._phaseDifference + oscillator.phaseDifference),(0.5 * this._amplitude * oscillator.amplitude), this._bufferSize, this._sampleRate);
            }
        }
    }
}

