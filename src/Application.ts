import { UIElement } from "./ui/UIElement";
import { Pad } from "./ui/Pad";
import { Button } from "./ui/Button";

export class Application {
    canvas: HTMLCanvasElement;
    /**
     * Canvas rendering context for drawing.
     */
    ctx: CanvasRenderingContext2D;

    /**
     * All contained user interface elements.
     */
    uiElements: UIElement[];

    /**
     * Initiates a new application with given HTML5 canvas for rendering.
     * 
     * @param canvas Canvas for rendering.
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.init();
    }

    private init() {
        // add listeners
        this.attachEventListeners(this.canvas);

        // init user interface
        this.initUserInterface();

        // start render loop
        window.addEventListener('resize', () => this.resizeCanvas(), false);
        this.resizeCanvas();
        window.requestAnimationFrame(() => this.renderLoop());
    }

    /**
     * Add all necessary elements of the user interface.
     */
    private initUserInterface() {
        // add pad
        let pad = new Pad();
        pad.position.set(200, 200);
        this.addUiElement(pad);
        // add button
        let buttonA = new Button();
        buttonA.position.set(200, 200);
        this.addUiElement(buttonA);
    }

    private attachEventListeners(canvas: HTMLCanvasElement) {
        // add mouse events
        canvas.addEventListener('mousedown', (event) => {
            this.handlePointerDown(event.pageX, event.pageY, 0);
        }, false);
        canvas.addEventListener('mousemove', (event) => {
            this.handlePointerMove(event.pageX, event.pageY, 0);
        }, false);
        canvas.addEventListener('mouseup', (event) => {
            this.handlePointerUp(0);
        }, false);
        // add touch events
        canvas.addEventListener('touchstart', (event) => {
            for (let i = 0; i < event.targetTouches.length; i++) {
                let touch = event.targetTouches[i];
                this.handlePointerDown(touch.pageX, touch.pageY, touch.identifier);
            }
        }, false);
        canvas.addEventListener('touchmove', (event) => {
            for (let i = 0; i < event.targetTouches.length; i++) {
                let touch = event.targetTouches[i];
                this.handlePointerDown(touch.pageX, touch.pageY, touch.identifier);
            }
        }, false);
        canvas.addEventListener('touchend', (event) => {
            console.log(event);
            for (let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                this.handlePointerUp(touch.identifier);
            }
        }, false);
        canvas.addEventListener('touchcancel', (event) => {
            for (let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                this.handlePointerUp(touch.identifier);
            }
        }, false);
    }

    /**
     * Consolidates mouse and touch events.
     * 
     * @param x X-position on page.
     * @param y Y-position on page.
     * @param identifier Pointer number - for multi touch each pointer has a unique id.
     */
    private handlePointerDown(x: number, y: number, identifier: number) {
        // notify ui elements
        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                if (element.onPointerDown) {
                    element.onPointerDown(x, y, identifier);
                }
            });
        }
    }

    /**
     * Consolidates mouse and touch events.
     * 
     * @param identifier Pointer number - for multi touch each pointer has a unique id.
     */
    private handlePointerUp(identifier: number) {
        // notify ui elements
        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                if (element.onPointerUp) {
                    element.onPointerUp(identifier);
                }
            });
        }
    }
    
    /**
     * Consolidates mouse and touch events.
     * 
     * @param x X-position on page.
     * @param y Y-position on page.
     * @param identifier Pointer number - for multi touch each pointer has a unique id.
     */
    private handlePointerMove(x: number, y: number, identifier: number) {
        // notify ui elements
        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                if (element.onPointerMove) {
                    element.onPointerMove(x, y, identifier);
                }
            });
        }
    }

    /**
     * Adds given ui element to app.
     * 
     * @param element 
     */
    addUiElement(element: UIElement) {
        if (!this.uiElements) {
            this.uiElements = [];
        }
        this.uiElements.push(element);
    }

    /**
     * Core rendering loop.
     * Clears canvas and redraws by requesting window animation frames.
     */
    private renderLoop() {
        // clear background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // user interface
        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                element.draw(this.ctx);
            });
        }

        // request next render frame
        window.requestAnimationFrame(() => this.renderLoop());
    }

    /**
     * Scale canvas to always match window size.
     */
    private resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}