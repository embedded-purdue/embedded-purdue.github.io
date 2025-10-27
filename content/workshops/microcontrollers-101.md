---
title: "Microcontrollers 101"
slug: "microcontrollers-101"
date: "2025-11-17T18:00:00-04:00"
location: "BHEE 117"
summary: "Introduction to microcontrollers! By the end of this workshop, you should hopefully have a fully working **Chrome Dino Run** game running on your own liquid crystal display with audio support."
tags: ["c++", "c", "microcontrollers", "beginner", "esp32"]
duration: "120 min"
level: "Beginner"
instructors:
  - "Connor Powell"
  - "Tom Concannon"
---

![dino](/workshops/microcontroller-dino.png)

---

**Level:** Beginner | **Offered:** Fall 2025 | **Time:** 2 hours

- [📑 Slide deck](https://docs.google.com/presentation/d/1Dk7lakdtn65Ym86UzuRHYTsuG3ByWMMBZX1VucDLHyQ/edit?usp=sharing)
- [🖥️ SunFounder ESP32 Starter Kit](https://www.amazon.com/SunFounder-Compatiple-Beginners-Engineers-ESP32-WROOM-32E/dp/B0CLDJ2DL7?sr=8-1)

---

This workshop is intended to be an introduction to microcontrollers. It may benefit you if you've have prior experience with microcontollers or Arduinos before, but it's not necessary. Having an understanding of microcontrollers is key to any embedded systems engineer.

To complete this workshop, you will need a SunFounder ESP32 Starter Kit. These kits will be provided in person in the workshop for you to build your project on. As much as we would like you to take these kits home with you, they are unfortunately not yours to keep! Please return all parts at the end of this workshop, so we can host this workshop again next year.

---

## Tasks

### Task 0: Environment Setup

- **Install the Arduino IDE**  
  Follow this [short guide](https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE) and follow the steps to install on your personal device.

---

### Task 1: Install the ESP32 Board Package
To program the ESP32 microcontroller, we first need to install the ESP32 board package in the Arduino IDE. A board package is a collection of software files and configurations that allow the Arduino IDE to recognize and compile code specifically for a given microcontroller or development board.

1. **Install the ESP32 Board**
   - In the **Boards Manager** window (the second icon from the top on the left side pannel), type **ESP32** in the search bar. Click the **Install** button to start the  installation process. This will download and install the ESP32 board package.

2. **Connect to the Board**

   ![esp32](/workshops/microcontroller-esp.jpg)
   *Find the ***ESP32 microcontroller*** in your kit*

   - Connect the ESP32 to your computer via the USB cable provided in your kit. If you do not have a USB Type-A port on your laptop, please see us at the front and we will provide you with a different cable or adapter.
   - Navigate to **Tools -> Board -> esp32** (the tools tab is in your toolbar), and select **ESP32 Dev Module**.
   - If your ESP32 is connected to your laptop, you can choose the correct port by clicking on **Tools -> Port**.
   - You are now ready to upload code to your board!

---

### Task 2: What Components do I need?

To start our project, we first need to get an idea of the required hardware. We’ll be using four main components in this build: the **ESP32 microcontroller**, **liquid crystal display (LCD)**, **push button**, and **buzzer**. Each of these plays a specific role in making our dino game come to life. Additionally we will need a **breadboard**, and lots of wires to interconnect all our components together.

#### 1. Microcontroller (ESP32)
**Purpose:**  
The ESP32 will be the “brain” of your project. It'll run the Dino game code, handling the game logic, detecting button presses, updating the display, and generating audio signals.

**How it works:**  
The ESP32 will execute your program instructions continuously, updating the game state (like when the dino jumps or collides with obstacles). It will send signals to the LCD to draw graphics and to the buzzer to produce sounds.

**Connections:**  
- Sends data to the **LCD display** via [I²C](https://en.wikipedia.org/wiki/I%C2%B2C) communication pins.  
- Outputs sound signals through a **[pulse-width modulation (PWM)](https://en.wikipedia.org/wiki/Pulse-width_modulation) pin** connected to the **buzzer**.  
- Reads input from the **push button** through a digital input pin.

---

#### 2. LCD Display

   ![lcd](/workshops/microcontroller-lcd.jpeg)
   *Find the ***LCD*** in your kit*

**Purpose:**  
The [LCD (Liquid Crystal Display)](https://en.wikipedia.org/wiki/Liquid-crystal_display) shows the game graphics like the dinosaur, ground, and obstacles, in real time.

**How it works:**  
The ESP32 will send pixel or character data to the LCD over I²C. The LCD refreshes its screen rapidly to show motion, creating the illusion of the dino running and jumping.

**Connections:**  
- Connected to the ESP32’s I²C pins, SDA (serial data) and SCL (serial clock).  
- Powered by **5V** and **GND** from the ESP32.

---

#### 3. Push Button

   ![pb](/workshops/microcontroller-pb.webp)
   *Find the ***push button*** in your kit*

**Purpose:**
The push button serves as the player’s input, pressing it will make the dinosaur jump.

**How it works:**  
When you press the button, it will close an electrical circuit, sending a digital HIGH or LOW signal to one of the ESP32’s [GPIO](https://en.wikipedia.org/wiki/General-purpose_input/output) input pins. Your program will detect this change and update the game state to make the dinosaur jump.

**Connections:**  
- One side will connect to a **GPIO input pin** on the ESP32.
- The other side will connect to **GND**.

---

#### 4. Buzzer

   ![pb](/workshops/microcontroller-buzzer.jpg)
   *Find the ***buzzer*** in your kit*

**Purpose:**  
The buzzer will generate sound effects for our game to make it more interactive.

**How it works:**  
The ESP32 sends a **pulse-width modulation (PWM)** signal to the buzzer. The PWM frequency determines the pitch of the sound you hear.

**Connections:**  
- Connected to **PWM** output signal as its power source.
- The other side will connect to **GND**.

---

#### 5. Breadboard

   ![breadboard](/workshops/microcontroller-breadboard.jpeg)
   *Find the ***breadboard*** in your kit*

**Purpose:**  
The breadboard allows us to build and test our circuit without [soldering](https://en.wikipedia.org/wiki/Soldering#Electronics_soldering). It provides a simple way to connect components together electrically using internal metal strips that run underneath the holes. The breadboard is used to mount the ESP32, button, LCD, and buzzer together. It makes it easy to wire connections between the microcontroller and each component using jumper wires, while keeping the setup neat and easy to modify as you test your dino game.

**How it works:**  
Each group of holes in a row or column are electrically connected. The central gap separates the two sides of the board, which is where you can place integrated circuits or modules. The long rails on the edges (usually marked with red and blue lines) act as power and ground buses, letting you easily distribute power to all your components.

**Connections:**  
- Literally everything

---

The schematic for your hardware layout is provided below:

![schematic](/workshops/microcontroller-schematic.jpeg)

Using this schematic, please wire your breadboard together.

---

### Task 3: Write your Software!

Now that we've connected our hardware, we need to write software to control it. 

---

## Contributions

- Guide: [Tom Concannon](https://www.linkedin.com/in/thomascon)  
- Project Design: [Connor Powell](https://www.linkedin.com/in/connorzanepowell)
