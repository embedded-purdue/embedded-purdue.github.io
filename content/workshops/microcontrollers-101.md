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

![git meme](/workshops/microcontroller-meme.jpeg)

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
   - Connect the ESP32 to your computer via the USB cable provided in your kit. If you do not have a USB Type-A port on your laptop, please see us at the front and we will provide you with a different cable or adapter.
   - Navigate to **Tools -> Board -> esp32** (the tools tab is in your toolbar), and select **ESP32 Dev Module**.
   - If your ESP32 is connected to your laptop, you can choose the correct port by clicking on **Tools -> Port**.
   - You are now ready to upload code to your board!

---

### Task 2: Make and Push Changes

1. **Create Files**

   ```bash
   echo "Hello, world!" > hello.txt
   echo "# My First Repository" > README.md
   ```

2. **Check status**

   ```bash
   git status
   ```

3. **Stage files**

   ```bash
   git add .
   ```

4. **Commit**

   ```bash
   git commit -m "Add hello.txt and README.md"
   ```

5. **Push**

   ```bash
   git push
   ```

---

### Task 3: Work on a Branch + .gitignore

1. **Create a branch**

   ```bash
   git checkout -b solo-changes
   ```

2. **Add `.gitignore`**

   ```bash
   echo "*.log" > .gitignore
   git add .gitignore
   git commit -m "Add .gitignore"
   ```

3. **Test it**

   ```bash
   echo "Temporary log data" > temp.log
   git status   # temp.log should NOT appear
   ```

4. **Edit another file**

   ```bash
   echo "More text added during solo branch work." >> hello.txt
   git add hello.txt
   git commit -m "Update hello.txt"
   ```

5. **Merge back into main**

   ```bash
   git checkout main
   git merge solo-changes
   git push
   ```

---

### Task 4: Collaborate + Pull Request

1. **Invite a collaborator**  
   Settings → Collaborators → Add people

2. **Each partner clones repo & creates a branch**

   ```bash
   git checkout -b feature-[yourname]
   ```

3. **Make changes**  
   Edit `README.md` (to cause a conflict), add a personal `.txt` file.

4. **Commit and push branch**

   ```bash
   git add .
   git commit -m "Feature work by [your name]"
   git push origin feature-[yourname]
   ```

5. **One partner merges both branches locally**

   ```bash
   git fetch origin feature-partner2
   git merge origin/feature-partner2
   ```

6. **Resolve conflicts if needed**

   ```bash
   git add .
   git commit -m "Merge partner branch"
   ```

7. **Push merged branch and open PR → main**

---

## Extra Resources

- [GitHub Learning Lab](https://lab.github.com/)  
- [Git Handbook](https://docs.github.com/en/get-started/using-git/about-git)  
- [Oh Shit, Git!?!](https://ohshitgit.com/)

---

## Contributions

- Slide deck: [Alex Aylward](https://www.linkedin.com/in/alexayl)  
- Exercises: [Trevor Antle](https://www.linkedin.com/in/trevor-antle/)
