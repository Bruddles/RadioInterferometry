//module RadioInterferomtery {
//    export class FourierTransform {
//        public _bufferSize: number;
//        public _sampleRate: number;
//        public _bandwidth: number;

//        public _spectrum: Float32Array;
//        public _real: Float32Array;
//        public _imag: Float32Array;

//        public _peakBand: number;
//        public _peak: number;

//        constructor(bufferSize, sampleRate) {
//            this._bufferSize = bufferSize;
//            this._sampleRate = sampleRate;
//            this._bandwidth = 2 / bufferSize * sampleRate / 2;

//            this._spectrum = new Float32Array(bufferSize / 2);
//            this._real = new Float32Array(bufferSize);
//            this._imag = new Float32Array(bufferSize);

//            this._peakBand = 0;
//            this._peak = 0;
//        }
//        /**
//         * Calculates the *middle* frequency of an FFT band.
//         *
//         * @param {Number} index The index of the FFT band.
//         *
//         * @returns The middle frequency in Hz.
//         */
//        public getBandFrequency(index) {
//            return this._bandwidth * index + this._bandwidth / 2;
//        }

//        public calculateSpectrum() {
//            var spectrum = this._spectrum,
//                real = this._real,
//                imag = this._imag,
//                bSi = 2 / this._bufferSize,
//                sqrt = Math.sqrt,
//                rval,
//                ival,
//                mag;

//            for (var i = 0, N = this._bufferSize / 2; i < N; i++) {
//                rval = real[i];
//                ival = imag[i];
//                mag = bSi * sqrt(rval * rval + ival * ival);

//                if (mag > this._peak) {
//                    this._peakBand = i;
//                    this._peak = mag;
//                }

//                spectrum[i] = mag;
//            }
//        }
//    }

//    export class FFT extends FourierTransform {
//        public bufferSize: number;
//        public sampleRate: number;
//        public reverseTable: Uint32Array;
//        public sinTable: Float32Array;
//        public cosTable: Float32Array;


//        public constructor(bufferSize: number, sampleRate: number) {
//            super( bufferSize, sampleRate);

//            this.reverseTable = new Uint32Array(bufferSize);

//            var limit = 1;
//            var bit = bufferSize >> 1;

//            var i;

//            while (limit < bufferSize) {
//                for (i = 0; i < limit; i++) {
//                    this.reverseTable[i + limit] = this.reverseTable[i] + bit;
//                }

//                limit = limit << 1;
//                bit = bit >> 1;
//            }

//            this.sinTable = new Float32Array(bufferSize);
//            this.cosTable = new Float32Array(bufferSize);

//            for (i = 0; i < bufferSize; i++) {
//                this.sinTable[i] = Math.sin(-Math.PI / i);
//                this.cosTable[i] = Math.cos(-Math.PI / i);
//            }
//        }

//        public forward(buffer: Array<any>) {
//            // Locally scope variables for speed up
//            var bufferSize = this.bufferSize,
//                cosTable = this.cosTable,
//                sinTable = this.sinTable,
//                reverseTable = this.reverseTable,
//                real = this._real,
//                imag = this._imag,
//                spectrum = this._spectrum;

//            var k = Math.floor(Math.log(bufferSize) / Math.LN2);

//            if (Math.pow(2, k) !== bufferSize) { throw "Invalid buffer size, must be a power of 2."; }
//            if (bufferSize !== buffer.length) { throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + bufferSize + " Buffer Size: " + buffer.length; }

//            var halfSize = 1,
//                phaseShiftStepReal,
//                phaseShiftStepImag,
//                currentPhaseShiftReal,
//                currentPhaseShiftImag,
//                off,
//                tr,
//                ti,
//                tmpReal,
//                i;

//            for (i = 0; i < bufferSize; i++) {
//                real[i] = buffer[reverseTable[i]];
//                imag[i] = 0;
//            }

//            while (halfSize < bufferSize) {
//                //phaseShiftStepReal = Math.cos(-Math.PI/halfSize);
//                //phaseShiftStepImag = Math.sin(-Math.PI/halfSize);
//                phaseShiftStepReal = cosTable[halfSize];
//                phaseShiftStepImag = sinTable[halfSize];

//                currentPhaseShiftReal = 1;
//                currentPhaseShiftImag = 0;

//                for (var fftStep = 0; fftStep < halfSize; fftStep++) {
//                    i = fftStep;

//                    while (i < bufferSize) {
//                        off = i + halfSize;
//                        tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
//                        ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

//                        real[off] = real[i] - tr;
//                        imag[off] = imag[i] - ti;
//                        real[i] += tr;
//                        imag[i] += ti;

//                        i += halfSize << 1;
//                    }

//                    tmpReal = currentPhaseShiftReal;
//                    currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
//                    currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
//                }

//                halfSize = halfSize << 1;
//            }

//            return this.calculateSpectrum();
//        }

//        public inverse(real, imag) {
//            // Locally scope variables for speed up
//            var bufferSize = this.bufferSize,
//                cosTable = this.cosTable,
//                sinTable = this.sinTable,
//                reverseTable = this.reverseTable,
//                spectrum = this.spectrum;

//            real = real || this.real;
//            imag = imag || this.imag;

//            var halfSize = 1,
//                phaseShiftStepReal,
//                phaseShiftStepImag,
//                currentPhaseShiftReal,
//                currentPhaseShiftImag,
//                off,
//                tr,
//                ti,
//                tmpReal,
//                i;

//            for (i = 0; i < bufferSize; i++) {
//                imag[i] *= -1;
//            }

//            var revReal = new Float32Array(bufferSize);
//            var revImag = new Float32Array(bufferSize);

//            for (i = 0; i < real.length; i++) {
//                revReal[i] = real[reverseTable[i]];
//                revImag[i] = imag[reverseTable[i]];
//            }

//            real = revReal;
//            imag = revImag;

//            while (halfSize < bufferSize) {
//                phaseShiftStepReal = cosTable[halfSize];
//                phaseShiftStepImag = sinTable[halfSize];
//                currentPhaseShiftReal = 1;
//                currentPhaseShiftImag = 0;

//                for (var fftStep = 0; fftStep < halfSize; fftStep++) {
//                    i = fftStep;

//                    while (i < bufferSize) {
//                        off = i + halfSize;
//                        tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
//                        ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

//                        real[off] = real[i] - tr;
//                        imag[off] = imag[i] - ti;
//                        real[i] += tr;
//                        imag[i] += ti;

//                        i += halfSize << 1;
//                    }

//                    tmpReal = currentPhaseShiftReal;
//                    currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
//                    currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
//                }

//                halfSize = halfSize << 1;
//            }

//            var buffer = new Float32Array(bufferSize); // this should be reused instead
//            for (i = 0; i < bufferSize; i++) {
//                buffer[i] = real[i] / bufferSize;
//            }

//            return buffer;
//        }
//    }
//}