# Fluid ProgressBar for Angular

![Coverage](https://img.shields.io/codecov/c/github/VincenzoManto/fluid-progressbar)
![Downloads](https://img.shields.io/npm/dw/fluid-progressbar)
![License](https://img.shields.io/npm/l/fluid-progressbar)
![npm version](https://img.shields.io/npm/v/fluid-progressbar)


Fluid ProgressBar is an Angular component that provides a customizable, fluid-like 🫗 progress bar with interactive effects such as gravity, mouse influence, and custom color groups. 💧

> "Progress is not achieved by luck or accident, but by working on yourself daily." - Epictetus

> "Progress is made by bubbles 🫧; without them it's just a normal bar."

*Based on [Fluid Simulation CodePen](https://codepen.io/dissimulate/pen/nLNMKQ) by [Dissumulate](https://codepen.io/dissimulate) who must be thanked*


![Fluid Progress Bar](https://github.com/VincenzoManto/fluid-progressbar/raw/main/media/example.gif)

## Features

- **Customizable progress bar:** Set the progress value dynamically.
- **Mouse interaction:** Influence the progress bar particles with mouse movement.
- **Gravity:** Simulate gravity effects on progress bar elements.
- **Custom colors:** Define color groups for the progress bar.
- **Smooth animations** based on progress changes.

## Installation

To install the library via npm:

```bash
npm install fluid-progressbar --save
```

## Usage

To use the `fluid-progressbar` component in your Angular application:

### 1. Import the Module

First, import the `FluidProgressbarModule` into your application module:

```typescript
import { FluidProgressbarModule } from 'fluid-progressbar';

@NgModule({
  imports: [FluidProgressbarModule]
})
export class AppModule {}
```

### 2. Use the Component

Now, you can use the `<fluid-progressbar>` component in your templates:

```html
<fluid-progressbar
  [progress]="progress"
  [mouseEffect]="0.5"
  [gravityX]="0.1"
  [gravityY]="0.05"
  [invertMouseAction]="true"
  [groupColours]="['#ff0000', '#00ff00', '#0000ff']">
  <h1>{{progress}}%</h1>
</fluid-progressbar>
```

### Example

```html
<div>
  <fluid-progressbar
    [progress]="progressValue"
    [mouseEffect]="0.1"
    [gravityX]="0.2"
    [gravityY]="0.1"
    [invertMouseAction]="true"
    [groupColours]="['#0055ff', '#0077ff', '#1177ff', '#11aaff']">
    <h1>{{progressValue}}%</h1>
  </fluid-progressbar>
</div>
```

## Input Properties

| Property        | Type      | Default Value         | Description                                                   |
| --------------- | --------- | --------------------- | ------------------------------------------------------------- |
| `progress`      | `number`  | `0.1`                 | The progress percentage, which dynamically updates the bar.    |
| `mouseEffect`| `number`  | `1`                   | Strength of the mouse's influence on the progress particles.   |
| `gravityX`      | `number`  | `0`                   | Horizontal gravity effect on the particles.                    |
| `gravityY`      | `number`  | `0.1`                 | Vertical gravity effect on the particles.                      |
| `invertMouseAction`    | `boolean` | `false`               | If true, particles will be repelled by the mouse.              |
| `groupColours`  | `string[]`| `['#0055ff', '#0077ff', '#1177ff', '#11aaff']` | Array of colors for the different groups of particles.         |

## Running Tests

To run tests for the library:

1. Clone the repository.
2. Run the following commands:

```bash
npm install
npm run test
```


This document outlines the test coverage for the `fluid-progressbar` component. The tests ensure that the component behaves as expected under various conditions.


### 1. Progress Value

- **Test:** Verify that the progress bar updates correctly when the `progress` input changes.
- **Expected Result:** The progress bar should reflect the new progress value.

### 2. Mouse Influence

- **Test:** Verify that the mouse influence affects the progress particles as expected.
- **Expected Result:** The particles should move according to the `mouseEffect` value.

### 3. Gravity Effects

- **Test:** Verify that the gravity effects (`gravityX` and `gravityY`) influence the particles correctly.
- **Expected Result:** The particles should move according to the specified gravity values.

### 4. Mouse Repel

- **Test:** Verify that the particles are repelled by the mouse when `invertMouseAction` is true.
- **Expected Result:** The particles should move away from the mouse pointer.

### 5. Custom Colors

- **Test:** Verify that the progress bar uses the specified `groupColours`.
- **Expected Result:** The particles should display the colors defined in the `groupColours` array.

## Example Test Implementation

Below is an example of how you might implement these tests using Jasmine and Angular's testing utilities.


This will run the test suite and ensure the library is working as expected.

## Contributing

Feel free to open an issue or a pull request if you would like to contribute to this project. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
