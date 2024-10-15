type Narrow<T> = | (T extends infer U ? U : never) | Extract<T, any> | ([T] extends [[]] ? [] : { [K in keyof T]: Narrow<T[K]> });
type Contract = {}

declare module "badusb" {
    type USBConfiguration = {
        /** Vendor ID (mandatory) */
        vid: number,
        /** Product ID (mandatory) */
        pid: number,
        /** Manufacturer name (32 ASCII characters max), optional */
        mfr_name?: string,
        /** Product name (32 ASCII characters max), optional */
        prod_name?: string
    }

    /**
     * Start USB HID with optional parameters. Should be called before all other methods
     * @param config Configuration object (optional)
     * @example
     * // Start USB HID with default parameters
     * badusb.setup();
     * // Start USB HID with custom vid:pid = AAAA:BBBB, manufacturer and product strings not defined
     * badusb.setup({ vid: 0xAAAA, pid: 0xBBBB }); 
     * // Start USB HID with custom vid:pid = AAAA:BBBB, manufacturer string = "Flipper Devices", product string = "Flipper Zero"
     * badusb.setup({ vid: 0xAAAA, pid: 0xBBBB, mfr_name: "Flipper Devices", prod_name: "Flipper Zero" });
     */
    function setup(config?: USBConfiguration): void;
    /**
     * Returns USB connection state.
     * @returns true if connected, false otherwise
     * @example
     * if (badusb.isConnected()) {
     *    // Do something
     * } else {
     *    // Show an error
     * }
     */
    function isConnected(): boolean;

    /**
     * Press and release a key.
     * @param keys Key or modifier name, key code.
     * @example
     * badusb.press("a"); // Press "a" key
     * badusb.press("A"); // SHIFT + "a"
     * badusb.press("CTRL", "a"); // CTRL + "a"
     * badusb.press("CTRL", "SHIFT", "ESC"); // CTRL + SHIFT + ESC combo
     * badusb.press(98); // Press key with HID code (dec) 98 (Numpad 0 / Insert)
     * badusb.press(0x47); // Press key with HID code (hex) 0x47 (Scroll lock)
     */
    function press(...keys: (string | number)[]): void;

    /**
     * Hold a key. Up to 5 keys (excluding modifiers) can be held simultaneously.
     * @param keys Key or modifier name, key code.
     * @example
     * badusb.hold("a"); // Press and hold "a" key
     * badusb.hold("CTRL", "v"); // Press and hold CTRL + "v" combo
     */
    function hold(...keys: (string | number)[]): void;

    /**
     * Release a previously held key.
     * @param keys Key or modifier name, key code. (optional)
     * Release all keys if called without parameters.
     * @example
     * badusb.release(); // Release all keys
     * badusb.release("a"); // Release "a" key
     */
    function release(...keys: (string | number)[]): void;

    /**
     * Print a string.
     * @param message A string to print
     * @param delay Delay between key presses (optional)
     * @example
     * badusb.print("Hello, world!"); // print "Hello, world!"
     * badusb.print("Hello, world!", 100); // Add 100ms delay between key presses
     */
    function print(message: string, delay?: number): void;

    /**
     * Print a string and press "ENTER".
     * @param message A string to print
     * @param delay Delay between key presses (optional)
     * @example
     * badusb.println("Hello, world!"); // print "Hello, world!" and press "ENTER"
     */
    function println(message: string, delay?: number): void;
}

declare module "event_loop" {
    type SubscriptionManager = {
        /** Cancels the subscription. */
        cancel(): void;
    };
    type Queue = {
        /**
         * @param message a value of any type that will be placed at the end of the queue
         */
        send(message: any): void;
        /** A Contract (event source) that pops items from the front of the queue */
        input: Contract;
    }
    /** Runs the event loop until it is stopped with stop. */
    function run(): void;
    /**
     * Subscribes a function to an event.
     * 
     * ### Warning
     * 
     * Each event source may only have one callback associated with it.
     */
    function subscribe<T extends any[]>(contract: Contract,
        /**
         * @param _subscription The subscription manager returned from the call to subscribe()
         * @param _item The event item for events that produce extra data; the ones that don't set this to undefined
         * @returns An array of the same length as the count of the extra arguments to modify them for the next time that the event handler is called
         */
        callback: (_subscription: SubscriptionManager, _item: any, ...args: T) => T | undefined, ...args: Narrow<T>): SubscriptionManager;
    /** Stops the event loop. */
    function stop(): void;
    /**
     * Produces an event source that fires with a constant interval either once or indefinitely
     * @param interval The timeout for "oneshot" timers or the period for "periodic" timers
     */
    function timer(mode: "oneshot" | "periodic", interval: number): Contract;
    /** 
     * Produces a queue that can be used to exchange messages.
     * @param length The maximum number of items that the queue may contain
     */
    function queue(length: number): Queue;
}

declare module "flipper" {
    function getBatteryCharge(): number;
    function getName(): string;
    function getModel(): string;
}

declare module "gpio" {
    type Mode = {
        pull?: "up" | "down";
    }
    type ModeOut = {
        direction: "out";
        outMode: "open_drain" | "push_pull";
    } & Mode;
    type ModeInBase = {
        direction: "in";
        inMode: "analog" | "plain_digital" | "event";
    } & Mode;
    type ModeInEdge = {
        direction: "in";
        inMode: "interrupt";
        edge: "rising" | "falling" | "both";
    } & Mode;
    type Pin = {
        /** Configures a pin */
        init(mode: ModeOut | ModeInBase | ModeInEdge): void;
        /**
         * Writes a digital value to a pin configured with direction: "out"
         * @param value value: boolean logic level to write
         */
        write(value: boolean): void;
        /** Reads a digital value from a pin configured with direction: "in" and any inMode except "analog" */
        read(): boolean;
        /**
         * Reads an analog voltage level in millivolts from a pin configured with direction: "in" and inMode: "analog"
         * @returns Voltage on pin in millivolts
         */
        read_analog(): number;
        /**
         * Attaches an interrupt to a pin configured with direction: "in" and inMode: "interrupt" or "event"
         * @returns An event loop Contract object that identifies the interrupt event source. The event does not produce any extra data.
         */
        interrupt(): Contract;
    };
    /**
     * Gets a Pin object that can be used to manage a pin.
     * @param pin pin identifier (examples: "pc3", 7, "pa6", 3)
     */
    function get(pin: number | string): Pin;
}

type View<T> = {} & T;
type ViewDispatcher = {
    /**
     * Switches to a view, giving it control over the display and input
     * @param view the View to switch to
     */
    switchTo(view: View<any>): void;
    /** Sends the viewport that the dispatcher manages to the front of the stackup (effectively making it visible), or to the back (effectively making it invisible) */
    sendTo(direction: "front" | "back"): void;
    /** Sends a custom number to the custom event handler */
    sendCustom(event: number): void;
    /** An event loop Contract object that identifies the custom event source, triggered by ViewDispatcher.sendCustom(event) */
    custom: Contract;
    /** An event loop Contract object that identifies the navigation event source, triggered when the back key is pressed */
    navigation: Contract;
};
type ViewFactory<T, E> = {
    // not sure how to implement E yet
    /** Creates an instance of a View */
    make(): View<E>;
    /** Creates an instance of a View and assigns initial properties from props */
    make(props: T): View<E>;
}

declare module "gui" {
    /** The viewDispatcher constant holds the ViewDispatcher singleton */
    const viewDispatcher: ViewDispatcher;
}

type gui_dialog = ViewFactory<{
    /** Text that appears in bold at the top of the screen */
    header: string;
    /** Text that appears in the middle of the screen */
    text: string;
    /** Text for the left button. If unset, the left button does not show up. */
    left: string;
    /** Text for the center button. If unset, the center button does not show up. */
    center: string;
    /** Text for the right button. If unset, the right button does not show up. */
    right: string;
    /** Fires when the user presses on either of the three possible buttons. The item contains one of the strings "left", "center" or "right" depending on the button. */
    // input: "left" | "center" | "right";
}, {
    /** Fires when the user presses on either of the three possible buttons. The item contains one of the strings "left", "center" or "right" depending on the button. */
    input: "left" | "center" | "right";
}>;
type gui_empty_screen = ViewFactory<{}, {}>;
type gui_loading = ViewFactory<{}, {}>;
type gui_submenu = ViewFactory<{
    /** Single line of text that appears above the list */
    header: string;
    /** The list of options */
    items: string[];
    /** Fires when an entry has been chosen by the user. The item contains the index of the entry. */
    // chosen: number;
}, {
    /** Fires when an entry has been chosen by the user. The item contains the index of the entry. */
    chosen: number;
}>;
type gui_text_box = ViewFactory<{
    /** Text to show in the text box. */
    text: string;
}, {}>;
type gui_text_input = ViewFactory<{
    /** Smallest allowed text length */
    minLength: number;
    /** Biggest allowed text length */
    maxLength: number;
    /** Single line of text that appears above the keyboard */
    header: string;
}, {
    /** Fires when the user selects the "save" button and the text matches the length constrained by `minLength` and `maxLength`. */
    input: string;
}>;

declare module "math" {
    const PI: 3.14159265358979323846264338327950288;
    const E: 2.71828182845904523536028747135266250;
    const EPSILON: 2.2204460492503131e-16;
    /**
     * Return the absolute value of a number
     * @param x A number
     * @returns The absolute value of x. If x is negative (including -0), returns -x. Otherwise, returns x. The result is therefore always a positive number or 0
     * @example
     * math.abs(-5); // 5
     */
    function abs(x: number): number;

    /**
     * Return the inverse cosine (in radians) of a number
     * @param x A number between -1 and 1, inclusive, representing the angle's cosine value
     * @returns The inverse cosine (angle in radians between 0 and π, inclusive) of x. If x is less than -1 or greater than 1, returns NaN
     * @example
     * math.acos(-1); // 3.141592653589793
     */
    function acos(x: number): number;

    /**
     * Return the inverse hyperbolic cosine of a number
     * @param x A number greater than or equal to 1
     * @returns The inverse hyperbolic cosine of x
     * @example
     * math.acosh(1); // 0
     */
    function acosh(x: number): number;

    /**
     * Return the inverse sine (in radians) of a number
     * @param x A number between -1 and 1, inclusive, representing the angle's sine value
     * @returns The inverse sine (angle in radians between -𝜋/2 and 𝜋/2, inclusive) of x
     * @example
     * math.asin(0.5); // 0.5235987755982989
     */
    function asin(x: number): number;

    /**
     * Return the inverse hyperbolic sine of a number
     * @param x A number
     * @returns The inverse hyperbolic sine of x
     * @example
     * math.asinh(1); // 0.881373587019543
     */
    function asinh(x: number): number;

    /**
     * Return the inverse tangent (in radians) of a number
     * @param x A number
     * @returns The inverse tangent (angle in radians between -𝜋/2 and 𝜋/2, inclusive) of x
     * @example
     * math.atan(1); // 0.7853981633974483
     */
    function atan(x: number): number;

    /**
     * Return the angle in the plane (in radians) between the positive x-axis and the ray from (0, 0) to the point (x, y), for math.atan2(y, x)
     * @param y The y coordinate of the point
     * @param x The x coordinate of the point
     * @returns The angle in radians (between -π and π, inclusive) between the positive x-axis and the ray from (0, 0) to the point (x, y)
     * @example
     * math.atan2(90, 15); // 1.4056476493802699
     */
    function atan2(y: number, x: number): number;

    /**
     * The method returns the inverse hyperbolic tangent of a number
     * @param x A number between -1 and 1, inclusive
     * @returns The inverse hyperbolic tangent of x
     * @example
     * math.atanh(0.5); // 0.5493061443340548
     */
    function atanh(x: number): number;

    /**
     * Return the cube root of a number
     * @param x A number
     * @returns The cube root of x
     * @example
     * math.cbrt(2); // 1.2599210498948732
     */
    function cbrt(x: number): number;

    /**
     * Round up and return the smallest integer greater than or equal to a given number
     * @param x A number
     * @returns The smallest integer greater than or equal to x. It's the same value as -math.floor(-x)
     * @example
     * math.ceil(-7.004); // -7
     * math.ceil(7.004);  // 8
     */
    function ceil(x: number): number;

    /**
     * Return the number of leading zero bits in the 32-bit binary representation of a number
     * @param x A number
     * @returns The number of leading zero bits in the 32-bit binary representation of x
     * @example
     * math.clz32(1);    // 31
     * math.clz32(1000); // 22
     */
    function clz32(x: number): number;

    /**
     * Return the cosine of a number in radians
     * @param x A number representing an angle in radians
     * @returns The cosine of x, between -1 and 1, inclusive
     * @example
     * math.cos(math.PI); // -1
     */
    function cos(x: number): number;

    /**
     * Return e raised to the power of a number
     * @param x A number
     * @returns A nonnegative number representing e^x, where e is the base of the natural logarithm
     * @example
     * math.exp(0); // 1
     * math.exp(1); // 2.718281828459045
     */
    function exp(x: number): number;

    /**
     * Round down and return the largest integer less than or equal to a given number
     * @param x A number
     * @returns The largest integer smaller than or equal to x. It's the same value as -math.ceil(-x)
     * @example
     * math.floor(-45.95); // -46
     * math.floor(-45.05); // -46
     * math.floor(-0); // -0
     * math.floor(0); // 0
     * math.floor(45.05); // 45
     * math.floor(45.95); // 45
     */
    function floor(x: number): number;

    /**
     * Return true if the difference between numbers a and b is less than the specified parameter e
     * @param a A number a
     * @param b A number b
     * @param e An epsilon parameter
     * @returns True if the difference between numbers a and b is less than the specified parameter e. Otherwise, false
     * @example
    * math.is_equal(1.4, 1.6, 0.2);      // false
    * math.is_equal(3.556, 3.555, 0.01); // true
    */
    function is_equal(a: number, b: number, e: number): boolean;

    /**
     * Return the largest of two numbers given as input parameters
     * @param a A number a
     * @param b A number b
     * @returns The largest of the given numbers
     * @example
     * math.max(10, 20);   // 20
     * math.max(-10, -20); // -10
     */
    function max(a: number, b: number): number;

    /**
     * Return the smallest of two numbers given as input parameters
     * @param a A number a
     * @param b A number b
     * @returns The smallets of the given numbers
     * @example
     * math.max(10, 20);   // 10
     * math.max(-10, -20); // -20
     */
    function min(a: number, b: number): number;

    /**
     * Return the value of a base raised to a power
     * @param base The base number
     * @param exponent The exponent number
     * @returns A number representing base taken to the power of exponent
     * @example
     * math.pow(7, 2);  // 49
     * math.pow(7, 3);  // 343
     * math.pow(2, 10); // 1024
     */
    function pow(base: number, exponent: number): number;

    /**
     * Return a floating-point, pseudo-random number that's greater than or equal to 0 and less than 1, with approximately uniform distribution over that range - which you can then scale to your desired range
     * @returns A floating-point, pseudo-random number between 0 (inclusive) and 1 (exclusive)
     * @example
     * let num = math.random();
     */
    function random(): number;

    /**
     * Return 1 or -1, indicating the sign of the number passed as argument
     * @param x A number
     * @returns -1 if the number is less than 0, and 1 otherwise
     * @example
     * math.sign(3);  // 1
     * math.sign(0);  // 1
     * math.sign(-3); // -1
     */
    function sign(x: number): number;

    /**
     * Return the sine of a number in radians
     * @param x A number representing an angle in radians
     * @returns The sine of x, between -1 and 1, inclusive
     * @example
     * math.sin(math.PI / 2); // 1
     */
    function sin(x: number): number;

    /**
     * Return the square root of a number
     * @param x A number greater than or equal to 0
     * @returns The square root of x, a nonnegative number. If x < 0, script will fail with an error
     * @example
     * math.sqrt(25); // 5
     */
    function sqrt(x: number): number;

    /**
     * Return the integer part of a number by removing any fractional digits
     * @param x A number
     * @returns The integer part of x
     * @example
     * math.trunc(-1.123); // -1
     * math.trunc(0.123);  // 0
     * math.trunc(13.37);  // 13
     * math.trunc(42.84);  // 42
     */
    function trunc(x: number): number;
}

declare module "serial" {
    /**
     * Configure serial port. Should be called before all other methods.
     * @param port Serial port name (usart, lpuart)
     * @param baudrate Data transmission rate
     * @example
     * serial.setup("lpuart", 115200);
     */
    function setup(port: "lpuart" | "usart", baudrate: 4800 | 9600 | 19200 | 38400 | 57600 | 115200 | number): void;

    /**
     * Write data to serial port
     * @param data Data to be sent. Can be a string, number, number array, ArrayBuffer or DataView
     */
    function write(...data: (string | number | number[] | ArrayBuffer | DataView)[]): void;

    /**
     * Read a fixed number of characters from serial port
     * @param bytes Number of bytes to read
     * @param timeout Timeout value in ms (optional)
     * @returns A string of received characters or undefined if nothing was received before timeout.
     * @example
     * serial.read(1); // Read a single byte, without timeout
     * serial.read(10, 5000); // Read 10 bytes, with 5s timeout
     */
    function read(bytes: number, timeout?: number): string | undefined;

    /**
     * Read from serial port until line break character
     * @param timeout Timeout value in ms (optional)
     * @returns A string of received characters or undefined if nothing was received before timeout.
     * @example
     * serial.readln(); // Read without timeout
     * serial.readln(5000); // Read with 5s timeout
     */
    function readln(timeout?: number): string | undefined;

    /**
     * Read a fixed number of bytes from serial port
     * @param bytes Number of bytes to read
     * @param timeout Timeout value in ms (optional)
     * @example
     * serial.readBytes(4); // Read 4 bytes, without timeout
     * 
     * // Read one byte from receive buffer with zero timeout, returns UNDEFINED if Rx buffer is empty
     * serial.readBytes(1, 0);
     */
    function readBytes(bytes: number, timeout?: number): ArrayBuffer | undefined;

    /**
     * Search for a string pattern in received data stream
     * @param pattern the pattern to search for eother in string or byte array format
     * @param timeout Timeout value in ms (optional)
     * @example
     * // Wait for root shell prompt with 1s timeout, returns 0 if it was received before timeout, undefined if not
    * serial.expect("# ", 1000); 
    * 
    * // Infinitely wait for one of two strings, should return 0 if the first string got matched, 1 if the second one
    * serial.expect([": not found", "Usage: "]);
     */
    function expect(pattern: string | string[] | number[], timeout?: number): number | undefined;
}

declare module "notification" {
    /** "Success" flipper notification message */
    function success(): void;

    /** "Error" flipper notification message */
    function error(): void;

    /**
     * Blink notification LED
     * @param color Blink color
     * @param type Blink type
     */
    function blink(color: "blue" | "red" | "green" | "yellow" | "cyan" | "magenta", type: "short" | "long"): void;
}


interface modules {
    "badusb": typeof import("badusb");
    "event_loop": typeof import("event_loop");
    "flipper": typeof import("flipper");
    /** This module depends on the `event_loop` module, so it _must_ only be imported after `event_loop` is imported */
    "gpio": typeof import("gpio");
    /** This module depends on the `event_loop` module, so it _must_ only be imported after `event_loop` is imported. */
    "gui": typeof import("gui");
    /**
     * Displays a dialog with up to three options.
     * 
     * This module depends on the gui module, which in turn depends on the event_loop module, so they must be imported in this order. It is also recommended to conceptualize these modules first before using this one.
     */
    "gui/dialog": gui_dialog;
    /**
     * Displays nothing.
     * 
     * This module depends on the `gui` module, which in turn depends on the `event_loop` module, so they _must_ be imported in this order. It is also recommended to conceptualize these modules first before using this one.
     */
    "gui/empty_screen": gui_empty_screen;
    /**
     * Displays an animated hourglass icon. Suppresses all `navigation` events, making it impossible for the user to exit the view by pressing the back key.
     * 
     * This module depends on the `gui` module, which in turn depends on the `event_loop` module, so they _must_ be imported in this order. It is also recommended to conceptualize these modules first before using this one.
     */
    "gui/loading": gui_loading;
    /**
     * Displays a scrollable list of clickable textual entries.
     * 
     * This module depends on the `gui` module, which in turn depends on the `event_loop` module, so they _must_ be imported in this order. It is also recommended to conceptualize these modules first before using this one.
     */
    "gui/submenu": gui_submenu;
    /**
     * Displays a scrollable read-only text field.
     * 
     * This module depends on the `gui` module, which in turn depends on the `event_loop` module, so they _must_ be imported in this order. It is also recommended to conceptualize these modules first before using this one.
     */
    "gui/text_box": gui_text_box;
    /**
     * Displays a keyboard.
     * 
     * This module depends on the `gui` module, which in turn depends on the `event_loop` module, so they _must_ be imported in this order. It is also recommended to conceptualize these modules first before using this one.
     */
    "gui/text_input": gui_text_input;
    "math": typeof import("math");
    "serial": typeof import("serial");
    "notification": typeof import("notification");
}

declare function require<M extends keyof modules>(module: M): modules[M];

/**
 * Delay for a number of milliseconds
 * @param ms Delay value in ms
 */
declare function delay(ms: number): void;

/**
 * Print a message on a screen console
 * @param args the values to be printed
 */
declare function print(...args: (string | number | boolean | undefined)[]): void;

/**
 * Convert a number to string with an optional base.
 * @param num the number to convert
 */
declare function to_string(num: number, base: number): string;
