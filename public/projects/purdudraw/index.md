---
title: PurduDraw Overview
---

# PurduDraw Spring ‘25
**An Automated Etch A Sketch-Style Drawing Machine**

![PurduDraw1](/purdudraw1.jpg)
## Overview
PurduDraw is a team project lead by Connor Powell partnered with Tom Concannon. The project consisted of a fully automated Etch A Sketch capable of taking an image, processing it into drawable paths, and rendering the result using stepper motors. PurduDraw was then entered in the annually ECE spark challenge.

We took inspiration from classic mechanical drawing toys and merged it with modern embedded systems and algorithmic control. The result: a surprisingly accurate, fully functioning drawing robot.

![PurduDraw2](/purdudraw2.jpg)

##  Hardware Setup
At its core, PurduDraw uses:
- **Stepper motors** (for precise movement in X and Y directions)
- **Direct drive motor coupling** to interface with the Etch A Sketch dials
- **Microcontroller (ESP32)** to serially receive drawing instructions and control motors
- **Serial interface** to communicate between host (Python) and the MCU

  
The mechanical system is driven much like a CNC — the two stepper motors control a point that moves in 2D space, effectively dragging a stylus across the drawing surface.

##  Software Pipeline
The real magic lies in the software. Here's the flow we implemented:
1. ### **Image to Graph**
We start by converting an input image into a **node/graph-based representation**:
- Applied **Laplacian filtering** to extract strong gradients and edges
- Simplified the output into a sparse set of meaningful nodes

2. ### **Path Optimization**
With the graph defined, we used a **Traveling Salesman Problem (TSP)** approach to find an efficient order to connect the points. This reduced backtracking and optimized motor movement.

3. ### **Command Generation**
We generated a list of movement commands representing each line segment:
- Each command contained a vector for traveling from the current node to the next
- Commands were serialized and sent to the MCU over the serial terminal

4. ### **Microcontroller Execution**
The MCU parsed the serial stream and translated the path into **precise stepper motor actions**, moving the drawing stylus


## Reflections
PurduDraw was an awesome intersection of image processing, algorithm design, hardware control, and embedded systems. It was one of the more satisfying builds we have worked on — a full pipeline from software to physical output.


