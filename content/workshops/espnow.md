---
title: "ESP NOW"
slug: "espnow"
date: "2026-11-16"
location: "STEW 320"
summary: "ESP NOW"
tags:
  - "esp"
  - "espnow"
---

Github Starter: [https://github.com/embedded-purdue/espnow_workshop](https://github.com/embedded-purdue/espnow_workshop)

# ESP-NOW Wireless Chatroom Workshop (1602 I2C LCD)

Build a two-way wireless text communicator using two **ESP32-WROOM-32E** boards and **16x2 I2C LCD screens**—no Wi-Fi router, password, or internet connection required.

## Repository Contents
* `1_mac_finder/1_mac_finder.ino` — Run this first to find your ESP32's MAC address and verify your LCD wiring.
* `2_espnow_starter/2_espnow_starter.ino` — Your main workshop file containing 5 `TODO` tasks to complete.

---

## 1. Hardware Wiring

Connect your **1602 I2C LCD** to your **ESP32-WROOM-32E** using 4 jumper wires:

| 1602 LCD Pin | ESP32-WROOM-32E Pin | Purpose |
| :--- | :--- | :--- |
| **GND** | **GND** | Common ground |
| **VCC** | **VIN** (or **5V**) | 5V USB power for the LCD backlight |
| **SDA** | **GPIO 21** (`D21` / `21`) | I2C Data line |
| **SCL** | **GPIO 22** (`D22` / `22`) | I2C Clock line |

> **Hardware Tip:** If your screen lights up with a blue/green glow but shows no letters, use a small screwdriver to turn the **blue potentiometer dial** on the back of the LCD backpack until text appears.

---

## 2. Software & Library Setup

1. Open **Arduino IDE** and select your board (**Tools → Board → esp32 → ESP32 Dev Module**) and COM port (**Tools → Port**).
2. Install the LCD library:
   * Go to **Sketch → Include Library → Manage Libraries...**
   * Search for **`LiquidCrystal I2C`**
   * Install **`LiquidCrystal I2C` by Frank de Brabander**
3. Configure the **Serial Monitor** (top-right magnifying glass icon):
   * Set Baud Rate to **`115200`**
   * Set the Line Ending dropdown next to it to **`Newline`** or **`Both NL & CR`**

---

## 3. Step-by-Step Workshop Guide

### Phase 1: Find Your MAC Address & Check Your Screen
1. Pair up with another team across the table or room.
2. Open `1_mac_finder/1_mac_finder.ino` and upload it to your ESP32.
3. Open the Serial Monitor (`115200` baud) and press the **`EN` / `RST`** button on your ESP32.
4. Note two things printed in the terminal:
   * **Your Copy-Paste Array:** Trade this `{0x.., 0x..}` array with your partner team. *(Remember: you put **their** address in your code, and they put **yours** in theirs!)*
   * **LCD I2C Address:** Confirm whether your screen is at `0x27` (default) or `0x3F`.

---

### Phase 2: Complete the 5 TODOs in `2_espnow_starter.ino`

Open `2_espnow_starter/2_espnow_starter.ino` and work through each `TODO` block in order:

#### **TODO 1: Set the Destination Address (`receiverAddress`)**
* **Goal:** Tell your ESP32 which board in the room should receive your packets.
* **How it works:** ESP-NOW routes messages using 6-byte hardware MAC addresses rather than IP addresses. Replace the placeholder zeros in `receiverAddress[]` with the `{0x.., 0x..}` byte array your partner team gave you.

#### **TODO 2: Define the Payload Structure (`struct_message`)**
* **Goal:** Create the shared data "envelope" that holds your text message.
* **How it works:** Both ESP32s must agree on the exact byte layout of the packet being transmitted. Inside `typedef struct struct_message`, declare a fixed-size C character array named `textMsg` with enough room for 31 characters plus a null terminator (`32` bytes total).
* **Syntax refresher:** `dataType variableName[size];`

#### **TODO 3: Initialize the LCD in `setup()`**
* **Goal:** Wake up the 16x2 display and verify it prints a startup message before testing wireless communication.
* **How it works:** Over I2C, the LCD needs to be initialized and have its backlight turned on before accepting text. Use the `lcd` object created at the top of the file:
  * Initialize the display: `lcd.init();`
  * Turn on the backlight: `lcd.backlight();`
  * Position the cursor at column `0`, row `0`: `lcd.setCursor(col, row);`
  * Print a short welcome string: `lcd.print("...");`

#### **TODO 4: Transmit the Packet in `loop()`**
* **Goal:** Send `myData` over the air whenever you type a message in the Serial Monitor.
* **How it works:** The starter code already reads your typed text and packs it into `myData.textMsg`. Now call `esp_now_send()` using three arguments:
  1. Target MAC address array (`receiverAddress`)
  2. Pointer to your data struct cast as raw bytes (`(uint8_t *) &myData`)
  3. Byte size of your struct (`sizeof(myData)`)
* Capture the return value in an `esp_err_t` variable and check if it equals `ESP_OK` to print a confirmation message to your Serial Monitor.

#### **TODO 5: Render Incoming Messages in `OnDataRecv()`**
* **Goal:** Display received messages on your LCD whenever a wireless packet arrives.
* **How it works:** `OnDataRecv()` is an interrupt-driven **callback function**—it runs automatically in the background the instant your antenna receives a packet. `memcpy` has already unpacked the incoming bytes into `myData.textMsg` and converted it into an Arduino `String` named `msg`.
  * Wipe any old text off the screen first using `lcd.clear()`.
  * Move the cursor to `(0, 0)` and print `msg`.
  * **Bonus Challenge:** A 1602 LCD only fits **16 characters per row**. Check `msg.length()`—if it is longer than 16 characters, use `msg.substring(start, end)` to print the first 16 characters on Row `0` and the remaining characters on Row `1`!

---

## 4. Phase 3: Global Broadcast Finale
Once your two-team chat works reliably:
1. Change `receiverAddress[]` in **TODO 1** to `{0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}`.
2. Re-upload your sketch. Your ESP32 will now broadcast every message you type to **every screen in the room simultaneously**.

---

## Troubleshooting Quick Reference
* **`Delivery Fail` in Serial Monitor:** Double-check that you entered the **other team's** MAC address (not your own), that each byte uses `0x` + commas, and that the other team's ESP32 is plugged in.
* **`Delivery Success`, but nothing appears on the other screen:** Check the other team's `SDA`/`SCL` wiring (Pins 21 & 22), turn their blue contrast potentiometer on the back of the LCD, or change `0x27` to `0x3F` on line 18 of their code.
* **Typing in Serial Monitor does nothing:** Verify the Serial Monitor baud rate is `115200` and the dropdown next to it is set to `Newline` (not `No Line Ending`).
