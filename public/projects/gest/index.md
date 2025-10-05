---
title: GEST Overview
---

# Gest: Gesture-Controlled Interface

## What's Gest About?

Imagine being able to control your computer without even touching it. That's what Gest is about! Slip on a sensor-packed glove and control your computer, games, or a robot arm with nothing but gesture. You can even fly around in Minecraft by just moving your wrist! At its core, Gest uses an ESP32, an MPU6050 IMU, and a flex sensor to track your hand’s flicks and finger bends, then streams that data wirelessly over ESP-NOW.

Gest senses your movements, sends it, and your device responds instantly. That's what it means to #GestUp!

---

## Hardware Components

- **ESP32 Dev Board** (Transmitter & Receiver)
- **MPU6050 IMU** for motion sensing with six degrees of freedom
- **Flex Sensor** for finger bend detection through ADC
- **Battery & Voltage Regulator** (9V Battery + 5 V UBEC)
- **Wiring & Glove** (breadboard, jumper wires, 3D printed glove)

## Software Components

- **Arduino IDE** for firmware development
- **ESP-NOW** for peer-to-peer wireless data transfer
- **Adafruit MPU6050 & Sensor Libraries**
- **Python with PySerial & Pygame** for desktop integration



## Program Architecture (Deep Dive)

### 1. Initialization (`setup()`)

- **Serial & Bluetooth**: Opens USB‑Serial at 115200 baud for debugging and `SerialBT` status messages.
- **MPU6050**:
  1. `mpu.begin()` initializes I2C.
  2. Sets accelerometer range to ±2 G.
  3. `calibrateAccelerometer()` collects 500 samples to compute `accelOffset`, centering stationary readings at (0,0,0).
- **ESP‑NOW**:
  1. `WiFi.mode(WIFI_STA)` sets Wi‑Fi station mode.
  2. Locks to channel 1 via `esp_wifi_set_channel()`.
  3. `esp_now_init()` then registers a broadcast peer for low‑latency comms.

```cpp
void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32_Transmitter");
  if (!mpu.begin()) while (1) delay(10);
  mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
  calibrateAccelerometer();
  initEspNow();
}
```

### 2. Main Loop (`loop()`)

Runs at \~60 Hz (\~16 ms delay):

1. **Read Sensors**
   - `readAccel()` returns zero‑centered accelerations (X, Y, Z).
   - `calcGyro()` approximates pitch/roll by scaling accelerometer axes.
2. **Flex Sensor**
   - `analogRead(flexPin)` yields 0–4095 → converted to 0–3300 mV.
   - If below `flexThreshold_mV`, sets a binary flex flag.
3. **Pack & Send Data**
   - Create a 6‑float array: `[accX, accY, accZ, pitch, roll, flex_mV]`.
   - Print CSV via `Serial.printf(...)` for Python parsing.
   - Broadcast with `esp_now_send()` for receiver units.

```cpp
void loop() {
  auto a = readAccel();
  auto g = calcGyro(a);
  float flexMV = analogRead(flexPin) / 4095.0f * 3300.0f;
  Serial.printf("%.3f,%.3f,%.3f,%.3f,%.3f,%.1f\n",
                a.x, a.y, a.z, g.x, g.y, flexMV);
  esp_now_send(broadcastAddress, (uint8_t*)&myData, sizeof(myData));
  delay(16);
}
```

---

## Programming Tricks

### Flick Detection Algorithm

- Maintains a rolling buffer of the last `HISTORY_SIZE` acceleration samples.
- Each loop, shifts existing samples right and inserts the newest at index 0.
- To detect a flick on axis `i`:
  1. Check if `history[0].<axis>` exceeds `FLICK_THRESH`.
  2. Search older samples for one with the opposite sign > `FLICK_THRESH`.
  3. Continue searching for a subsequent sample that returns to the original sign > `FLICK_THRESH`.
  4. If the pattern `[+ → − → +]` or `[- → + → -]` appears, set `flick.<axis> = sign`.

### Calibration Routine

- Collects `SAMPLES` readings while the glove is stationary.
- Computes `accelOffset` by averaging these samples to remove static gravity bias.
- After calibration, `readAccel()` yields zero-centered motion data (0,0,0 at rest).

---

## Core Features

- **Automatic Calibration**: Removes gravity bias for zero‑centered output.
- **Sub-5 ms Latency**: ESP‑NOW peer‑to‑peer for real‑time control.
- **Modular Data**: CSV lines integrate smoothly with Python or Arduino.

---

## Pygame Integration

Bring gestures into a Python game with these steps:

1. **Install Dependencies**

   ```bash
   pip install pygame pyserial
   ```

2. **Open the Serial Port**\
   Use the same COM port and baud as your ESP32:

   ```python
   import serial
   ser = serial.Serial('COM3', 115200, timeout=0.1)
   ```

3. **Parse CSV Lines**\
   Gest outputs lines like `0.123,-0.456,0.789,1.234,5.678,210.4`:

   ```python
   raw = ser.readline().decode('utf-8', errors='ignore').strip()
   parts = raw.split(',')
   if len(parts) == 6:
       accel_x = float(parts[0])
       accel_y = float(parts[1])
       accel_z, pitch, roll, flex_mV = map(float, parts[2:6])
   ```

4. **Mapping Sensor to Velocity** Define a helper to map an input range to pixel speed:

   ```python
   def map_val(x, in_min=-2, in_max=2, out_min=-10, out_max=10):
       """Linearly map x from [in_min,in_max] to [out_min,out_max]"""
       return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
   ```

5. **Sample Snake Game Loop**

   ```python
   import pygame, serial

   # Initialize Pygame and Serial
   ser = serial.Serial('COM3', 115200, timeout=0.1)
   pygame.init()
   screen = pygame.display.set_mode((800, 600))
   clock = pygame.time.Clock()

   # Initial position
   x, y = 400, 300

   while True:
       # 1. Handle events (e.g., window close)
       for event in pygame.event.get():
           if event.type == pygame.QUIT:
               pygame.quit()
               exit()

       # 2. Read and parse sensor data
       line = ser.readline().decode('utf-8').strip()
       if line and ',' in line:
           parts = list(map(float, line.split(',')))
           accel_x, accel_y = parts[0], parts[1]

           # 3. Map sensor values to velocity
           vx = map_val(accel_x)
           vy = map_val(accel_y)

           # 4. Update position, with wrapping
           x = (x + vx) % 800
           y = (y + vy) % 600

       # 5. Draw background and snake head
       screen.fill((0, 0, 0))
       pygame.draw.circle(screen, (0, 255, 0), (int(x), int(y)), 10)

       # 6. Refresh display and cap frame rate
       pygame.display.flip()
       clock.tick(30)  # 30 FPS
   ```

**How it works:**

- **Event Loop:** Keeps the window responsive and checks for quit events.
- **Serial Read:** Non-blocking `readline()` fetches the latest CSV string.
- **Parsing:** Splits by comma and converts to floats, ignoring any partial or malformed lines.
- **Mapping:** Translates accelerometer range (e.g., ±2 m/s²) to pixel velocities (±10 px/frame).
- **Position Update:** Moves the on-screen object, wrapping around edges for continuous motion.
- **Frame Control:** `clock.tick(30)` ensures a smooth 30 frames-per-second animation.

---

## Potential Upgrades

- Incorporate into a robotic arm
- ML gesture classification
- Test VR Capabilities

---
