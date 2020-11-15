new p5((p5) => {
    const columnWidth = 5;
    const gutters = 1;
    const numColumns = gutters + 2

    class Arp {
        constructor(p5, x, width, rootMidiNote, xOffset) {
            this.p5 = p5;
            this.x = x;
            this.width = width;
            this.rootMidiNote = rootMidiNote;
            this.xOffset = xOffset;

            const arpDelay = new Tone.Delay(0.50).toDestination();
            this.synth = new Tone.PolySynth().connect(arpDelay).toMaster();
            this.notes = [];
        }

        playAndDraw (p5) {
            const atTheBeginning = this.x === this.xOffset;
            if (atTheBeginning) {
                this.getNewNotes(p5, this.rootMidiNote);
            }
        
            this.setXPosition(p5);
            this.drawPlayHead(p5);
            this.playAndDrawNotes(p5);
        }

        setXPosition (p5) {
            this.x = (p5.frameCount % this.width) + this.xOffset;
        }

        drawPlayHead (p5) {
            p5.line(this.x, 0, this.x, p5.height);
        }

        getNewNotes (p5) {
            const numNotes = 8;
            const notes = [];
            let scale = [0, 2, 3, 5, 7, 8, 10, 12]; // minor scale - idea from https://editor.p5js.org/mrbombmusic/sketches/SBiAtigLs
            for (let i = 0; i < numNotes; i++) {
                let xDivisor = 20;
                let quantizedX = i * xDivisor;
        
                let n = 0;
                const getRandom = () => {
                    return p5.int(p5.random(scale.length));
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

        playAndDrawNotes (p5) {
            this.notes.forEach(note => {
                p5.stroke("black");
                p5.fill("black");
                let circSize = 5;
                if (this.x === note.x + this.xOffset) {
                    this.synth.triggerAttackRelease(note.n, '8n');
                    p5.stroke("orange");
                    p5.fill("orange");
                    circSize = 100;
                }
                p5.ellipse(note.x + this.xOffset, p5.height - note.n, circSize, circSize);
            });
        }
    };

    const myArp = new Arp(p5, 0, 70, 48, columnWidth);
    
    p5.setup = () => {
      p5.createCanvas(70, 300);
      p5.fill(0);
      p5.strokeWeight(2);
      p5.rectMode(p5.CENTER);
    };
  
    p5.draw = () => {
      p5.background(255);
      myArp.playAndDraw(p5);
    };
  }, document.querySelector("#content"));
