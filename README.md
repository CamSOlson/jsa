# JSA (JavaScript Animation)
A lightweight JavaScript animation library

## About
This library can be added to any HTML file to allow for easy animations that are dynamically generated to suit the user's parameters without having to create complicated CSS rules and scripts. Animations can be activated through a variety of triggers to allow for a more lively and responsive experience.

This is an *extremely* early prototype that will be receiving new features and updates 

## Usage
* Begin by adding the following script tag to the head of your file: `<script src="https://camsolson.github.io/jsa/jsa.js"></script>`
* Alternatively, you can download `jsa.js` from https://github.com/CamSOlson/jsa and include it locally in your file
* In any element that you want to animate, add `data-animation`
* Add animation data directly to the element's `data-animation`

## Animations
Animation data is formatted like a JavaScript function call to retain familiarity and modularity. The general template is as follows: `<animation name>(<trigger>, <duration>, <delay>,  <animation-specific arguments>...);`

### Animation Types
JSA currently has the following animation types:
* **Fade** 
  * *Shift an element's opacity from one value to another*
  * Value: `fade`
  * Additional arguments
    * `Argument 4: starting opacity` 
      * A `float` value controling the element's opacity when the animation starts
      * Default value: `0`
    * `Argument 5: ending opacity` 
      * A `float` value controling the element's opacity after the animation is completed
      * Default value: `1`
* **Slide In**
  * *Move an element from offscreen to its position*
  * Value: `slide`
  * Additional arguments
    * `Argument 4: direction` 
      * A `string` value controling what direction the element moves in from
        * `top` or `down` - Slide down from the top of the page
        * `topleft` or `downleft` - Slide down from the upper left corner of the page
        * `topright` or `downright` - Slide down from the upper right corner of the page
        * `left` - Slide in from the left side of the page
        * `right` - Slide in from the right side of the page
        * `bottom` or `up` - Slide up from the bottom of the page
        * `bottomleft` or `upleft` - Slide up from the lower left corner of the page
        * `bottomright` or `upright` - Slide up from the lower right corner of the page
      * Default value: `top`

### Animation Triggers
JSA currently has the following animation triggers:
* **Scroll**
  * *Begin the animation then the page has been scrolled to a point where the element is visible*
  * Value: `scroll`
  
## Contact
If you have any requests, concerns, or questions, please email me at `camsolson@gmail.com`
