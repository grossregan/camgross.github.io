// Trampoline Simulation MicroSim with Labeled Sliders, Unit Toggle, and Animated Jumper
// Built with p5.js

console.log("sketch.js is loaded");

let weightSlider, forceSlider, gravitySlider;
let weightLabel, forceLabel, gravityLabel;
let unitToggle;
let jumper;
let gravity;
let useMetric = true;

function setup() {
  let canvas = createCanvas(400, 400);
  console.log("Canvas created:", canvas);
  canvas.parent("trampoline-sim-container"); // Attach canvas to the container

  // Get the canvas position
  let canvasX = canvas.position().x;
  let canvasY = canvas.position().y;

  // Adjust offsets for elements below the canvas
  let sliderOffsetY = canvasY + canvas.height + 20; // 20px below the canvas
  let labelOffsetY = sliderOffsetY - 20;           // Labels appear just above sliders

  // Create labels
  weightLabel = createDiv('Weight:');
  weightLabel.position(canvasX + 20, labelOffsetY); // Adjusted position

  forceLabel = createDiv('Force:');
  forceLabel.position(canvasX + 160, labelOffsetY); // Adjusted position

  gravityLabel = createDiv('Gravity:');
  gravityLabel.position(canvasX + 300, labelOffsetY); // Adjusted position

  // Create unit toggle checkbox
  unitToggle = createCheckbox('Metric (kg)', true);
  unitToggle.position(canvasX + 20, sliderOffsetY + 40); // Below sliders
  unitToggle.changed(toggleUnits);

  // Initialize jumper
  jumper = new Jumper();

   // Initialize sliders
  weightSlider = createSlider(40, 120, 70); // kg
  weightSlider.position(canvasX + 20, sliderOffsetY); // Adjusted position
  weightSlider.style('width', '120px');

  forceSlider = createSlider(0, 100, 50); // percent
  forceSlider.position(canvasX + 160, sliderOffsetY); // Adjusted position
  forceSlider.style('width', '120px');

  gravitySlider = createSlider(1.6, 9.8, 3.7, 0.1); // Moon to Earth gravity
  gravitySlider.position(canvasX + 300, sliderOffsetY); // Adjusted position
  gravitySlider.style('width', '120px');
}

function toggleUnits() {
  useMetric = unitToggle.checked();

  if (useMetric) {
    weightSlider.elt.min = 40;
    weightSlider.elt.max = 120;
    weightSlider.value(70);
  } else {
    weightSlider.elt.min = 88;
    weightSlider.elt.max = 265;
    weightSlider.value(154);
  }
}

function getGravityBodyName(value) {
  if (value <= 2.5) return "Moon";
  else if (value <= 6.0) return "Mars";
  else return "Earth";
}

function draw() {
  background(220);
  console.log("draw() is running");
  drawTrampoline(); // Draw trampoline

  // Update simulation variables
  gravity = gravitySlider.value();
  let weight = weightSlider.value();
  let displayWeight = weight;

  if (!useMetric) {
    weight = weight * 0.453592; // Convert lbs to kg
  }
  jumper.mass = weight;
  jumper.force = forceSlider.value();
  jumper.gravity = gravity;

  jumper.update();
console.log("jumper.update() called");
jumper.display();
console.log("jumper.display() called");

  // Update labels with units and values
  weightLabel.html(`Weight: ${nf(displayWeight, 0, 0)} ${useMetric ? "kg" : "lbs"}`);
  forceLabel.html(`Leg Force: ${nf(forceSlider.value(), 0, 0)}%`);
  gravityLabel.html(`Gravity: ${getGravityBodyName(gravity)}`);
}

function drawTrampoline() {
  console.log("drawTrampoline() is running");
  stroke(120);
  strokeWeight(4);

  // Calculate the horizontal center of the canvas
  let trampolineWidth = 300; // Adjust the width of the trampoline as needed
  let leftX = (width - trampolineWidth) / 2; // Left edge of the trampoline
  let rightX = leftX + trampolineWidth; // Right edge of the trampoline
  let trampolineY = height - 50; // Vertical position of the trampoline (near the bottom of the canvas)

  // Draw the trampoline
  line(leftX, trampolineY, rightX, trampolineY);
}

class Jumper {
  constructor() {
    this.y = 349;
    this.vy = 0;
    this.mass = 70;
    this.force = 50;
    this.gravity = 9.8;
    this.onTrampoline = true;
  }


  update() {
    if (this.y >= 349) {
      this.onTrampoline = true;
      let jumpImpulse = map(this.force, 0, 100, 0, 20);
      this.vy = -jumpImpulse / (this.mass * 0.01);
    } else {
      this.vy += this.gravity * 0.1;
      this.onTrampoline = false;
    }
    this.y += this.vy;

    if (this.y > 349) {
      this.y = 349;
      this.vy = 0;
    }
  }

  display() {
    // Draw a simple stick figure
    let x = width / 2;
    let headSize = 20;
    let bodyLength = 30;
    let legLength = 20;
    let armLength = 15;

    // Head
    fill(255, 220, 180);
    ellipse(x, this.y - bodyLength - headSize / 2, headSize, headSize);

    stroke(0);
    strokeWeight(2);

    // Body
    line(x, this.y - bodyLength, x, this.y);

    // Arms
    line(x, this.y - bodyLength + 5, x - armLength, this.y - bodyLength + 15);
    line(x, this.y - bodyLength + 5, x + armLength, this.y - bodyLength + 15);

    // Legs
    line(x, this.y, x - legLength, this.y + legLength);
    line(x, this.y, x + legLength, this.y + legLength);
  }
}
