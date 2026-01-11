# 3D JS Rendering Demo

A simple 3D object rendering demo using HTML5 Canvas and JavaScript. Displays wireframe models of a cube and a penger (penguin-like) shape, with rotation and switching capabilities.

## Features

- Real-time 3D wireframe rendering
- XZ-plane rotation animation
- Object switching between cube and penger via spacebar
- Perspective projection and Z-translation

## Files

- `index.html`: Main HTML file with canvas element
- `index.js`: JavaScript code for rendering, animation, and input handling
- `objects.js`: 3D model data (vertices and faces for cube and penger)

## Setup

1. Open `index.html` in a modern web browser.

## Usage

- The scene renders automatically with rotating objects.
- Press the spacebar to switch between the cube and penger shapes.
- View in a browser supporting HTML5 Canvas.

## Dependencies

None (vanilla JavaScript).

## Notes

- Penger model vertices extracted from a Blender OBJ file.
- Animation uses `requestAnimationFrame` for smooth rendering.