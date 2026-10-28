---
title: "Linux 101"
slug: "linux101"
date: "2026-10-28"
location: "UNIV 229"
summary: "Beginner-friendly introduction to Linux"
tags:
  - "linux"
  - "website"
  - "beginner"
---

---

**Level:** Beginner | **Offered:** Fall 2026 | **Time:** 1–2 hours

- [📑 Slide deck](https://docs.google.com/presentation/d/1NtXJ0Hx4RWEjWhQCwQ47gz7zfTjRosBsIvniG-uC98s/edit)

---

This workshop is designed for beginner and intermediate Linux users. Most of the talk is focused on the basics, but some topics covered are outside what is normally covered and are intended for those who know the basics, but are interested in the inner workings.

To complete this workshop, follow along in the slides and complete the tasks on your computer as they appear.

---

## Tasks

### Task 0: Requirements

- **Log in to your machine**  
  Open your terminal. 
  
  On Windows, it is called cmd or PowerShell (ps), either should work. 

  On MacOS, open the Terminal application.

  On Linux, open your terminal emulator of choice.

  <details>
    Make sure you are using the stock ssh binary, other clients (eg. kitten ssh) will not work.
  </details>

  Type the following command:

  ```bash
    ssh <your Purdue username>@workshop.esap.dev
  ```

  For example: `ssh bondarv@workshop.esap.dev`

  Follow the instructions to log in:
  - For the secret word, it will be announced in class.
  - Then go to your email, and copy the code

  You will then be placed into a shell, eg:

  ```bash
  bondarv@esapworkshop:~$
  ```

  (raise your hand if you have any issues)


  |                          ⚠️  Warning                                  |
  |-----------------------------------------------------------------------|
  |Please do not do anything bad with this access. Bad things will happen.|

---

### Task 1: Run your first command
- Try the following commands, and see what they do:

  ```bash
   whoami
   ```

   ```bash
   pwd
   ```

   ```bash
   date
   ```

   ```bash
   echo "test"
   ```

- Write a command to welcome yourself
- Scroll and and down through your commands with the up and down arrows, and through a command with a side to side arrow
- Clear the screen with `clear`
- Auto complete `da` with the \<Tab\> key

---

### Task 2: Working with files 
- Go to your home folder (`~` is "home"):
   ```bash
   cd ~
   pwd
   ```
- Make a folder for the workshop and move into it:
   ```bash
   mkdir workshop
   cd workshop
   ```
- Create an empty file:
   ```bash
   touch notes.txt
   ls
   ```
- Write a line into the file (`>` overwrites, `>>` appends):
   ```bash
   echo "First line" > notes.txt
   echo "Second line" >> notes.txt
   ```
- Read the file:
   ```bash
   cat notes.txt
   ```
- Edit the file in a text editor:
  ```bash
   vim notes.txt
   ```
   
   or
  
   ```bash
   nano notes.txt
   ```


  - Add a line of your own.
  - Save and exit (clear on nano, `:wq` in vim normal modee)
- Copy the file:
   ```bash
   cp notes.txt notes-backup.txt
   ls
   ```
- Move the file:
   ```bash
   mv notes-backup.txt old-notes.txt
   ls
   ```
- Make a subfolder and move a file into it:
   ```bash
   mkdir archive
   mv old-notes.txt archive/
   ls archive
   ```
- Go up one level and back down:
    ```bash
    cd ..
    pwd
    cd workshop
    ```
- Delete (permanently) a file
    ```bash
    rm archive/old-notes.txt
    rmdir archive
    ls
    ```
  
---

### Task 3: An aside on Linux itself (system files, users, processes, sudo)

**System files**

- Look at the very top of the file system. / = root
   ```bash
   ls /
   ```
- Peek at a few important folders:
   ```bash
   ls /etc 
   ls /home 
   ls /var/log 
   ```
- Find out which Linux you're running:
   ```bash
   cat /etc/os-release
   ```

**Users**

- See your user ID and the groups you belong to:
   ```bash
   id
   ```
- See the list of users on the system:
   ```bash
   cat /etc/passwd
   ```
- Look at file ownership and permissions:
   ```bash
   ls -l ~/workshop
   ```
   - The first column (e.g. `-rw-r--r--`) shows who can r - Read, w - Write, x - eXecute
   - The next names show the **owner** and **group**.

**Processes**

- See the programs you're running in this terminal:
   ```bash
   ps
   ```
- Start a program in the background (`&` runs it in the background):
   ```bash
   sleep 300 &
   ps
   ```
- Stop it using its process ID (PID) from the `ps` output:
   ```bash
   kill <PID>
   ps
   ```
- See everything running on the machine (press `q` to quit):
    ```bash
    top
    ```

**sudo**

- Try to read a protected file:
    ```bash
    cat /etc/shadow
    ```
    You'll get `Permission denied`.
- Run it again as the administrator (root) using `sudo`:
    ```bash
    sudo cat /etc/shadow
    ```

#### Sudo is a very powerful tool, and you should only use it when it is nedded

---

### Task 4.1: Let's make a basic website - Creating the files

- Create the folder ~/website
- Create the file ~/website/index.html
- Add to it
   ```html
   <html>
     <head>
       <title>Hello</title>
     </head>
     <body>
       <h1>Hello from Linux!</h1>
       <p>Botton Text.</p>
     </body>
   </html>
   ```
4. Save
5. Check it was saved using `cat`
---

### Task 4.2: Let's make a basic website - Learning about programs and install nginx

- Find where `ls` lives:
   ```bash
   which ls
   ```
- Look at some of the other programs installed:
   ```bash
   ls /usr/bin
   ```
- Check whether nginx (a web server) is installed yet:
   ```bash
   which nginx
   ```
   No output means it isn't installed.
- Update the list of available packages:
   ```bash
   sudo apt update
   ```
- Install nginx and curl
   ```bash
   sudo apt install -y nginx curl
   ```
- Check it's installed now:
   ```bash
   which nginx
   ```
- Check that nginx is running as a service:
   ```bash
   systemctl status nginx
   ```

  Check if it apears to be active.

- Requst the page using the curl command:
   ```bash
   curl http://localhost
   ```
- Go to https://workshop.esap.dev/<your purdue username\>/80/

Ex. https://workshop.esap.dev/bondarv/80/

Check out your website there

- Try stopping and starting the service, refresh the browser to see the result:

    ```bash
    sudo systemctl stop nginx
    sudo systemctl start nginx
    ```

---

### Task 4.3: Let's make a basic website - Putting everything together
- Look at where nginx keeps its web pages:
   ```bash
   ls -l /var/www/html
   ```
   Notice the files are owned by `root`.
- Copy your page there (use `sudo`):
   ```bash
   sudo cp ~/website/index.html /var/www/html/index.html
   ```
- Check it's there:
   ```bash
   ls -l /var/www/html
   ```
- Refresh your previously opened page
- Make a change to your page:

   Add a new line, e.g. `<p>test</p>`, then save and exit.
- Publish the update and refresh the browser:
   ```bash
   sudo cp ~/website/index.html /var/www/html/index.html
   ```
- See what nginx logs:
   ```bash
   sudo tail /var/log/nginx/access.log
   ```

---

## Extra Resources

- [Debian Documentation](https://www.debian.org/doc/)
- [Arch Wiki](https://wiki.archlinux.org/title/Main_page), good resource, even if you are not using Arch

---

## Contributions

- Slide deck and exercises: [Vlad Bondar](https://www.linkedin.com/in/drvladb/)
