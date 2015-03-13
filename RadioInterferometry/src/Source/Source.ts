module RadioInterferometry {
    export class Source {
        static Point(step: number, offset: number, width?: number) {
            return Math.floor(step) === Math.floor(offset) ? 1 : 0; //TODO rounding down dont work / no negative numbers
        }

        static Gaussian(step: number, offset: number, width: number) {
            return Math.exp(-Math.pow((step - offset), 2) / (2*(Math.pow(width, 2)))); 
        }

        private _amplitude: number;
        get amplitude(): number {
            return this._amplitude;
        }

        private _offset: number;
        get offset(): number {
            return this._offset;
        }

        private _width: number;
        get width(): number {
            return this._width;
        }

        private _bufferSize: number;
        get bufferSize(): number {
            return this._bufferSize;
        }

        private _resolution: number;
        get resolution(): number {
            return this._resolution;
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

        constructor(type: SourceType, amplitude: number, offset: number, width: number, bufferSize: number, resolution: number) {
            this._amplitude = amplitude;
            this._offset = offset;
            this._width = width;
            this._bufferSize = bufferSize;
            this._resolution = resolution;

            this._signalY = new Float32Array(bufferSize);
            this._signalX = new Float32Array(bufferSize);

            switch (type) {
            case SourceType.Point:
                this._func = Source.Point;
                break;
            case SourceType.Gaussian:
                this._func = Source.Gaussian;
                break;
            }

            this._generate();
        }

        private _generate() {
            for (var i = -(this._bufferSize / 2); i < this._bufferSize/2; i++) {
                var ii = i + this._bufferSize / 2,
                    theta: number = i * this._resolution;

                this._signalY[ii] = this._amplitude * this._func(theta, this._offset, this._width);
                this._signalX[ii] = theta;
            }
        }

        public setAmp(amplitude: number) {
            this._amplitude = amplitude;
        }

        public setOffset(offset: number) {
            this._offset = offset;
        }

        public setWidth(width: number) {
            this._width = width;
        }

        public generateWaves(baseline: number, horizonAngle: number, frequency: number, sourceWidth: number): Array<Oscillator> {
            if (sourceWidth === 0) {
                var phaseDiff: number = this._calculatePhaseDifference(baseline, horizonAngle, frequency);
                return [
                    new Oscillator(OscillatorType.Cosine, frequency, horizonAngle >= (Math.PI / 2) ? 0 : phaseDiff, this.amplitude, 2048, 44100),
                    new Oscillator(OscillatorType.Cosine, frequency, horizonAngle <= (Math.PI / 2) ? 0 : phaseDiff, this.amplitude, 2048, 44100)
                ];
            } else {
                //not correct? maybe
                var phaseDiff: number = this._calculatePhaseDifference(baseline, horizonAngle, frequency),
                    phaseDiffA: number = this._calculatePhaseDifference(baseline, horizonAngle - sourceWidth / 2, frequency),
                    phaseDiffB: number = this._calculatePhaseDifference(baseline, horizonAngle + sourceWidth / 2, frequency),
                    phaseDiffC: number = (phaseDiffA - phaseDiffB) / 2,
                    amplitude: number = -2 * this.amplitude * Math.cos(phaseDiffC);

                return [
                    new Oscillator(OscillatorType.Cosine, frequency, horizonAngle >= (Math.PI / 2) ? 0 : phaseDiff + phaseDiffC, amplitude, 2048, 44100),
                    new Oscillator(OscillatorType.Cosine, frequency, horizonAngle <= (Math.PI / 2) ? 0 : phaseDiff + phaseDiffC, amplitude, 2048, 44100)
                ];

            }
        }

        private _calculatePhaseDifference(baseline: number, horizonAngle: number, frequency: number): number {
            return (2 * (Math.PI)) * (baseline / (c / frequency)) * Math.cos(horizonAngle);
        }
    }
}

