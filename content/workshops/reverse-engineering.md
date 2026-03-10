---
title: "Reverse Engineering"
slug: "reverse-engineering"
date: "2026-03-11T19:00:00-05:00"
location: "ME G061"
summary: "This workshop will involve dumping the data stored in an EEPROM and interpretting it to put back together a lost file."
tags: ["c++", "esp32", "python"]
duration: "120 min"
level: "Intermediate"
instructors:
  - "Tom Concannon"

---

**Level:** Intermediate | **Offered:** Spring 2026 | **Time:** 2 hours

---

You should have been handed a Microchip 24LC256 Serial EEPROM, a non-volatile memory chip capable of storing up to 256 Kbits of data even without power. The all-powerful ES@P executive team has preloaded a JPEG file onto the chip. Your mission is to establish a stable I2C communication bus between an ESP32 microcontroller and the EEPROM, navigate the chip's 16-bit addressing architecture, and stream the data back to your terminal. By mastering the physical layer—including proper pull-up resistor placement and hardware address configuration—you will reconstruct the original file bit-by-bit and unlock the data hidden within the silicon.

This is an open-ended challenge with minimal step-by-step instructions, so you’ll need to rely on the 24XX256 datasheet and your own problem-solving skills to pull the data off the chip.

There is no "correct" solution to rebuild the file—it’s up to you to figure out how to handle the pull-up resistors, hardware addressing, and the raw bits trapped in the silicon. If you hit a wall or need a nudge in the right direction, please ask AI or raise your hand and we’ll come by to help!

Use AI, the internet, and your peers to your advantage!

- [24LC256 Datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/MPD/ProductDocuments/DataSheets/24AA256-24LC256-24FC256-256K-I2C-Serial-EEPROM-DS20001203.pdf)

---

## Tasks

### Task 0: Environment Setup

If you do not already, install the arduino IDE using this
[guide](https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE) and follow the steps to install on your personal device. Then, follow the steps below.

- In the **Boards Manager** window (the second icon from the top on the left side pannel), type **ESP32** in the search bar. Click the **Install** button to start the  installation process. This will download and install the ESP32 board package.
- Connect the ESP32 to your computer via the USB cable provided in your kit. If you do not have a USB Type-A port on your laptop, please see us at the front and we will provide you with a different cable or adapter.
- Navigate to **Tools -> Board -> esp32** (the tools tab is in your toolbar), and select **ESP32 Dev Module**.
- If your ESP32 is connected to your laptop, you can choose the correct port by clicking on **Tools -> Port**.
- You are now ready to upload code to your board!

---

### Task 1: Extract the Data
The goal of this first task is to establish a stable conversation between your ESP32 and the EEPROM. You need to "knock on the door" of the chip, tell it which memory address you want to look at, and then listen as it streams the raw data back to you. 

#### Hints
- Most I2C devices require you to send a "control byte" first. Check the datasheet to see what the specific bit pattern is for this chip. 
- This chip uses 16-bit addressing. That means when you tell it where to start reading, you have to send the address in two separate pieces (High Byte and Low Byte)
- You can read one byte at a time, or you can use "Sequential Read" to pull large chunks of data in one go. The latter is much faster!
- Print the data gathered from the EEPROM to the serial monitor in hexadecimal, then copy and paste into a new file

#### Common Mistakes

- I2C lines are "open-drain." If you don't have resistors pulling the SDA and SCL lines up to 3.3V, your ESP32 will just sit there waiting for a signal that never comes.
- If the address pins ($A_0, A_1, A_2$) aren't connected to anything, the chip's address might "drift," and your code won't be able to find it

---

### Task 2: Interpret the Data

Right now, the data you copied from the serial monitor is likely a long list of binary or hexadecimal values printed as text. However, image viewers expect a binary JPEG file, not a text representation of the bytes. Your task is to figure out how to convert the data you collected into a valid .jpg file.

#### Hints
- JPEG files have recognizable start and end markers. Looking at the beginning and end of your dump may help you confirm that the data was captured correctly.
- A Python script can be very helpful for reading a text file containing hex values and writing those values into a binary file.

## Contributions

- Guide: [Tom Concannon](https://www.linkedin.com/in/thomascon)
- Project Design: [Tom Concannon](https://www.linkedin.com/in/thomascon)
