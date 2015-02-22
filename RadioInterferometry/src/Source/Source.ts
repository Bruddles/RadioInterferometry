module RadioInterferometry {
    export class Source {
        static Point(step: number, offset: number, width?: number) {
            return Math.floor(step) === Math.floor(offset) ? 1 : 0;
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

        constructor(type: SourceType, amplitude: number, offset: number, width: number, bufferSize: number, sampleRate: number) {
            this._amplitude = amplitude;
            this._offset = offset;
            this._width = width;
            this._bufferSize = bufferSize;
            this._sampleRate = sampleRate;

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
            for (var i = - this._bufferSize /2; i < this._bufferSize/2; i++) {
                var theta: number = i / this._sampleRate;

                this._signalY[i] = this._amplitude * this._func(theta, this._offset, this._width);
                this._signalX[i] = theta;
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
    }
}

