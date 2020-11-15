new p5((p5) => {
    const columnWidth = 5;
    const gutters = 1;
    const numColumns = gutters + 2

    const arp = {
        x: 0,
        width:  70,
        rootMidiNote: 48,
        xOffset: columnWidth,
        synth: {},
        notes: [],

        init: () => {
            const arpDelay = new Tone.Delay(0.50).toDestination();
            arp.synth = new Tone.PolySynth().connect(arpDelay).toMaster();
        },

        playAndDraw: (p5) => {
            const atTheBeginning = arp.x === arp.xOffset;
            if (atTheBeginning) {
                arp.getNewNotes(p5, arp.rootMidiNote);
            }
        
            arp.setXPosition(p5);
            arp.drawPlayHead(p5);
            arp.playAndDrawNotes(p5);
        },

        setXPosition: (p5) => {
            arp.x = (p5.frameCount % arp.width) + arp.xOffset;
        },

        drawPlayHead: (p5) => {
            p5.line(arp.x, 0, arp.x, p5.height);
        },

        getNewNotes: (p5) => {
            const numNotes = 8;
            const notes = [];
            let scale = [0, 2, 3, 5, 7, 8, 10, 12]; // minor scale - idea from https://editor.p5js.org/mrbombmusic/sketches/SBiAtigLs
            for (i = 0; i < numNotes; i++) {
                let xDivisor = 20;
                let quantizedX = i * xDivisor;
        
                let n = 0;
                const getRandom = () => {
                    return p5.int(p5.random(scale.length));
                };
        
                if (i > 0) {
                    n = getRandom();
                }
        
                let midiNote = arp.rootMidiNote + scale[n];
                if (i > 0) {
                    while (midiNote < notes[i - 1].m) {
                        n = getRandom();
                        midiNote = arp.rootMidiNote + scale[n];
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
            arp.notes = notes;
        },

        playAndDrawNotes: (p5) => {
            arp.notes.forEach(note => {
                p5.stroke("black");
                p5.fill("black");
                let circSize = 5;
                if (arp.x === note.x + arp.xOffset) {
                    arp.synth.triggerAttackRelease(note.n, '8n');
                    p5.stroke("orange");
                    p5.fill("orange");
                    circSize = 100;
                }
                p5.ellipse(note.x + arp.xOffset, p5.height - note.n, circSize, circSize);
            });
        }

    };

    // for the pad synth
    const padWidth = 2 * arp.width;
    
    const canvasWidth = (numColumns * columnWidth) + arp.width;
    
    p5.setup = () => {
      p5.createCanvas(70, 300);
      p5.fill(0);
      p5.strokeWeight(2);
      p5.rectMode(p5.CENTER);

      arp.init();
    };
  
    p5.draw = () => {
      p5.background(255);
      
      arp.playAndDraw(p5);
    };
  }, document.querySelector("#content"));
