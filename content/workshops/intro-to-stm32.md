---
title: "Intro to STM32"
slug: "intro-to-stm32"
date: "2025-09-15T18:00:00-04:00"
location: "BHEE 162"
summary: "Flash your first STM32 program, set up the toolchain, and debug with SWD."
tags: ["mcu", "stm32", "arm"]
cover: "/workshops/intro-stm32.jpg"   # optional image in /public/workshops/
duration: "60–75 min"
level: "Beginner"
instructors:
  - "Trevor Antle"
  - "ES@P Mentors"
rsvpUrl: "https://example.com/rsvp"   # optional
---

## Overview
Kickstart your STM32 journey. In this workshop you'll install the toolchain, flash your first program, and get hands-on with SWD debugging.

**You’ll leave with:**
- A working toolchain (compiler + debugger)
- A blinky program running on an STM32
- Confidence using SWD/JTAG for basic debug

> Boards and ST-Link debuggers will be provided during the session.

## Prerequisites
- Laptop with admin rights (Windows/macOS/Linux)
- **VS Code** installed
- USB-A/C port (dongle if needed)

## Agenda
| Time (min) | Topic                          |
|---:|---|
| 0–10 | Intro, goals, board overview |
| 10–25 | Toolchain + project scaffold |
| 25–45 | Blink LED: build/flash |
| 45–60 | SWD debug: breakpoints, step, watch |
| 60–75 | Q&A, next steps (buffer) |

## Setup (Before the Workshop)
- [ ] Install **VS Code**
- [ ] Install VS Code extensions: **C/C++** and **CMake Tools**
- [ ] Install **GNU Arm Embedded Toolchain**
- [ ] *(Windows)* Install **ST-LINK** USB driver

```bash
# Verify toolchain in your terminal
arm-none-eabi-gcc --version
