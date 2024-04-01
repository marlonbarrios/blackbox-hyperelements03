// Import React and the necessary wrappers
import React from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import p5 from "p5";

// Define the Slider class that uses p5 types
class Slider {
  name: string;
  slider: p5.Element;
  px: number;
  py: number;
  val: number;

  constructor(p: p5, name: string, min: number, max: number, start: number, px: number, py: number) {
    this.name = name;
    this.px = px;
    this.py = py;
    this.slider = p.createSlider(min, max, start);
    this.slider.position(px, py);
    this.slider.style('width', '100px');
    this.val = start; // Initialize val with start value
  }

  display(p: p5) {
    // Ensure this.val is always a number
    this.val = +this.slider.value();
    
    p.push();
    p.translate(-p.width / 2, -p.height / 2); // Adjust for WEBGL mode
    p.text(this.name, this.px + 120, this.py + 11);
    p.text(this.slider.value().toString(), this.px + 160, this.py + 11);
    p.pop();
  }
}

// Define the sketch function
const sketch = (p: p5) => {
  let rotX: Slider, rotY: Slider, num: Slider, rez: Slider, amp: Slider, speed: Slider;
  let angle = 0;
  let play = true;

  p.setup = () => {
    p.createCanvas(600, 600, p.WEBGL);
    p.angleMode(p.DEGREES);
  
    const canvasWidth = 600;
    const rightMargin = 10; // Width of the slider plus some margin
    const startX = p.windowWidth/2-70; // Starting X position for sliders
  
    // Initialize Slider objects with adjusted positions
    rotX = new Slider(p, "RotX:", 0, 360, 15, startX, 10);
    rotY = new Slider(p, "RotY:", 0, 360, 45, startX, 30);
    num = new Slider(p, "Num:", 1, 400, 300, startX, 50);
    rez = new Slider(p, "Rez:", 1, 15, 10, startX, 70);
    speed = new Slider(p, "Speed:", 1, 10, 1, startX, 90);
    amp = new Slider(p, "Amp:", 10, 200, 100, startX, 110);
  
    p.textFont('Roboto-Black');
    p.fill(255);
  
    // // Play/Pause button
    // const button = p.createButton('Play/Pause');
    // button.mousePressed(() => play = !play);
    // button.position(startX, 150);
  };
  

  p.draw = () => {
    p.background(0);
    rotX.display(p);
    rotY.display(p);
    num.display(p);
    rez.display(p);
    speed.display(p);
    amp.display(p);

    p.rotateX(rotX.val);
    p.rotateY(rotY.val);
    if (play) {
      angle += speed.val;
      for (let i = 0; i < num.val; i += rez.val) {
        p.push();
        p.noFill();
        p.stroke(255, i / num.val * 255);
        let depth = amp.val * p.sin(angle + i);
        p.translate(100, -50, depth);
        p.ellipse(0, 0, i, i);
        p.pop();
      }
    }
  };
};

// The React component that renders the P5 sketch
export default function P5Block() {
  return <NextReactP5Wrapper sketch={sketch} />;
}
