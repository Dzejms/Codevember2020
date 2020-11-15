class Pad {
    constructor(p5, width, numNotes, rootMidiNote, xOffset) {
        this.p5 = p5;
        this.x = xOffset;
        this.numNotes = numNotes;
        this.width = width;
        this.rootMidiNote = rootMidiNote;
        this.xOffset = xOffset;

        const arpDelay = new Tone.Delay(0.50).toDestination();
        this.synth = new Tone.PolySynth().connect(arpDelay).toMaster();
        this.notes = [];
    }

    playAndDraw () {
        const atTheBeginning = this.x === this.xOffset;
        if (atTheBeginning) {
            this.getNewNotes(this.p5, this.rootMidiNote);
        }
    
        this.setXPosition();
        this.drawPlayHead();
        this.playAndDrawNotes();
    }

    setXPosition () {
        this.x = (this.p5.frameCount % this.width) + this.xOffset;
    }

    drawPlayHead () {
        this.p5.line(this.x, 0, this.x, this.p5.height);
    }

    getNewNotes () {
        const notes = [];
        let scale = [0, 2, 3, 5, 7, 8, 10, 12]; // minor scale - idea from https://editor.p5js.org/mrbombmusic/sketches/SBiAtigLs
        for (let i = 0; i < this.numNotes; i++) {
            let xDivisor = 20;
            let quantizedX = i * xDivisor;
    
            let n = 0;
            const getRandom = () => {
                return this.p5.int(this.p5.random(scale.length));
            };
    
            if (i > 0) {
                n = getRandom();
            }
    
            let midiNote = this.rootMidiNote + scale[n];
            if (i > 0) {
                while (midiNote < notes[i - 1].m) {
                    n = getRandom();
                    midiNote = this.rootMidiNote + scale[n];
                }
                if (n === scale.length - 1) {
                    // go back down?
                }
            }

            let scaleNote = Tone.Frequency(midiNote, 'midi');
    
            notes.push({
                x: quantizedX,
                m: midiNote,
                n: scaleNote
            });
        }
        this.notes = notes;
    }

    playAndDrawNotes () {
        this.notes.forEach(note => {
            this.p5.stroke("black");
            this.p5.fill("black");
            let circSize = 5;
            if (this.x === note.x + this.xOffset) {
                this.synth.triggerAttackRelease(note.n, '8n');
                this.p5.stroke("orange");
                this.p5.fill("orange");
                circSize = 100;
            }
            this.p5.ellipse(note.x + this.xOffset, this.p5.height - note.n, circSize, circSize);
        });
    }
};