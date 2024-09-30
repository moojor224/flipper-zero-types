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

declare module "dialog" {
    /**
     * Show a simple message dialog with header, text and "OK" button.
     * @param header Dialog header text
     * @param text Dialog text
     * @returns true if central button was pressed, false if the dialog was closed by back key press
     * @example
     * dialog.message("Dialog demo", "Press OK to start");
     */
    function message(header: string, text: string): boolean;
    type DialogConfig = {
        /** Dialog header text */
        header: string,
        /** Dialog text */
        text: string,
        /** left button name (optional) */
        button_left?: string,
        /** right button name (optional) */
        button_right?: string,
        /** central button name (optional) */
        button_center?: string
    }

    /**
     * More complex dialog with configurable buttons
     * @param config Dialog configuration object
     * @returns Name of pressed button or empty string if the dialog was closed by back key press
     * @example
     * let dialog_params = ({
     *     header: "Dialog header",
     *     text: "Dialog text",
     *     button_left: "Left",
     *     button_right: "Right",
     *     button_center: "OK"
     * });
     * 
     * dialog.custom(dialog_params);
     */
    function custom(config: DialogConfig): string;
}

declare module "flipper" {
    function getBatteryCharge(): number;
    function getName(): string;
    function getModel(): string;
}

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

declare module "submenu" {
    /**
     * Set the submenu header text
     * @param header The submenu header text
     */
    function setHeader(header: string): void;

    /**
     * Add a new submenu item
     * @param label The submenu item label text
     * @param id The submenu item ID, must be a Uint32 number
     */
    function addItem(label: string, id: number): void;

    /**
     * Show a submenu that was previously configured using the {@link setHeader()|`setHeader()`} and {@link addItem()|`addItem()`} methods
     * @returns The ID of the submenu item that was selected, or undefined if the BACK button was pressed
     */
    function show(): number | undefined;
}

declare module "textbox" {
    /**
     * Set focus and font for the textbox
     * @param focus "start" to focus on the beginning of the text, or "end" to focus on the end of the text
     * @param font "text" to use the default proportional font, or "hex" to use a monospaced font, which is convenient for aligned array output in HEX
     * @example
     * textbox.setConfig("start", "text");
     * textbox.addText("Hello world");
     * textbox.show();
     */
    function setConfig(focus: "start" | "end", font: "text" | "hex"): void;

    /**
     * Add text to the end of the textbox
     * @param text The text to add to the end of the textbox
     * @example
     * textbox.addText("New text 1\nNew text 2");
     */
    function addText(text: string): void;

    /**
     * Clear the textbox
     * @example
     * textbox.clearText();
     */
    function clearText(): void;

    /**
     * Return true if the textbox is open
     * @returns True if the textbox is open, false otherwise
     * @example
     * let isOpen = textbox.isOpen();
     */
    function isOpen(): boolean;

    /**
     * Show the textbox. You can add text to it using the addText() method before or after calling the show() method
     * @example
     * textbox.show();
     */
    function show(): void;

    /**
     * Close the textbox
     * @example
     * if (textbox.isOpen()) {
     *     textbox.close();
     * }
     */
    function close(): void;
}

interface modules {
    "badusb": typeof import("badusb");
    "dialog": typeof import("dialog");
    "flipper": typeof import("flipper");
    "math": typeof import("math");
    "serial": typeof import("serial");
    "notification": typeof import("notification");
    "submenu": typeof import("submenu");
    "textbox": typeof import("textbox");
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
 * converts a number to a string
 * @param num the number to convert
 */
declare function to_string(num: number): string;

/**
 * converts a number to a hex string
 * @param num the number to convert
 */
declare function to_hex_string(num: number): string;