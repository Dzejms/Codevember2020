new p5((p5) => {
    const columnWidth = 5;
    const gutters = 1;
    const numColumns = gutters + 2

    const arp = new Arp(p5, 70, 8, 48, columnWidth);
    const pad = new Pad(p5, 170, 8, 48, columnWidth * 2 + arp.width);
    
    p5.setup = () => {
      p5.createCanvas(300, 300);
      p5.fill(0);
      p5.strokeWeight(2);
      p5.rectMode(p5.CENTER);
    };
  
    p5.draw = () => {
      clearCanvas(p5);
      arp.playAndDraw(p5);
      pad.playAndDraw(p5);
    };
  }, document.querySelector("#content"));

function clearCanvas(p5) {
    p5.background(255);
}
