# Cartesian System Lite

A coordinate grid system for universal use.

## What is this?
This is a grid system that splits up the world into cols and row of cells.
But you still get to keep associative arrays for each Game Object.

This system will only update game objects that it sees in the window of the world's cells.
Each cell contains an arrayname and index reference to each game object in the world.

Note: Integrating this library into other JS game engines and libraries, you'll need 
to come up with some kind of integration. Because this engine just doesn't directly plug 
itself in. **You'll need to be in control of the current game objects in the scene of the world**

If you want a further version of this library (more experimental) here it is:
https://github.com/prolightHub/CartesianSystemEngine/blob/master/libraries/cartesianSystemEngine.js

## Examples:

An example of it in use can be found here:
https://github.com/prolightHub/SpaceExploration

## Usage

This sets you with a world:
```js
var config = {
    level: {
        x: 0,
        y: 0,
        width: 340 * 16,
        height: 340 * 16
    },
    camera: {
        x: 0,
        y: 0,
        width: 800,
        height: 480
    },
    cameraGrid: {
        cellWidth: 340,
        cellHeight: 340,
    }
};

var world = new CartesianSystemLite(config);
```
----
You can define your main loop as:

```js
window.setInterval(function()
{
    world.camera.view(gameObject, translate); 
    // or world.camera.view(x, y, translate);
    
    world.gameObjects.window();
    world.gameObjects.drawAndUpdate();
    
    // Or world.gameObjects.update();
    // then world.gameObjects.draw();
}, 1000 / 60);

```
Notice the translate parameter, this is passed in as a function to
translate/pan the camera around the world.
But what is window?
Window uses the camera's view to setup up all the gameObjects to be called in draw/update functions.

---
Well okay, but now you're probably thinking *how do I define some game objects?*
It's simple:

```js
function SomeGameObject()
{
    // Inheritance from "GameObject". You can also
    // use "Rect" (x, y, width, height) or "Circle" (x, y, diameter)
    CartesianSystemLite.GameObjects.GameObject.apply(this, arguments);
    
    this.setup = function() 
    {
        // Sets things up
    };
    
    this.update = function()
    {
        // Update as well as maybe call built in functions in here
        // Like this.updateBoundingBox();
    };
    
    this.draw = function()
    {
        // Draw this gameObject
    };
}

world.factory.addArray("someGameObject", SomeGameObject);
```
---

What about creating SomeGameObjects?

```js
var someGameObject = world.add("someGameObject", arg1, arg2, arg3, arg4);
```

Okay by now you know the basic outline of how to use this library!

For more info either look in the code or this repository:
https://github.com/prolightHub/SpaceExploration
