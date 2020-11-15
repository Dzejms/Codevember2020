new p5((p5) => {

    const arp = {
      width:  70,
      synth: {}
    };

    const padWidth = 2 * arp.width;
    const columnWidth = 5;
    const gutters = 1;
    const columns = gutters + 2
    const canvasWidth = (columns * columnWidth) + arp.width;
    const xOffset = columnWidth;
    
    p5.setup = () => {
      p5.createCanvas(70, 300);
      p5.fill(0);
      p5.strokeWeight(2);
      p5.rectMode(p5.CENTER);
    };
  
    let x = 0;
    let x2 = 0;
    let notes = [];
    const arpDelay = new Tone.Delay(0.50).toDestination();
    arp.synth = new Tone.PolySynth().connect(arpDelay).toMaster()
    let rootMidiNote = 48;
  
    p5.draw = () => {
      p5.background(255);
      
      const atTheBeginning = x === xOffset;
      if(atTheBeginning) {
        notes = getArpNotes(p5, rootMidiNote);
      }
      
      // Draw play head
      x = (p5.frameCount % arp.width) + xOffset;
      p5.line(x, 0, x, p5.height);
      
      x2 = (p5.frameCount % p5.width) + xOffset;
      p5.line(x2, 0, x2, p5.height);
      
      drawArpNotes(notes, p5, x, arp.synth, xOffset);
    };
  }, document.querySelector("#content"));
  
  function drawArpNotes(notes, p5, x, synth, xOffset) {
      notes.forEach(note => {
          p5.stroke("black");
          p5.fill("black");
          let circSize = 5;
          if (x === note.x + xOffset) {
              synth.triggerAttackRelease(note.n, '8n');
              p5.stroke("orange");
              p5.fill("orange");
              circSize = 100;
          }
          p5.ellipse(note.x + xOffset, p5.height - note.n, circSize, circSize);
      });
  }
  
  function getArpNotes(p5, rootMidiNote) {
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
  
          let midiNote = rootMidiNote + scale[n];
          if (i > 0) {
              while (midiNote < notes[i - 1].m) {
                  n = getRandom();
                  midiNote = rootMidiNote + scale[n];
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
      return notes;
  }

  window.document.querySelector("#content").addEventListener("click", () => {
    Tone.Start();
  });
  