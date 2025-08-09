## Installation

Download Raspberry Imager or install with homebrew
`brew install --cask raspberry-pi-imager`

Install new image, also setting up initial config for Raspberry

- username
- password
- hostname
- WiFi network and password
- enable ssh

## First boot

Start the Raspberry Pi, and connect to it via ssh

If a router or WiFi network is not available, connect directly to the Raspberry Pi using an ethernet cable: follow this instructions on how to connect to it from terminal https://raspberrypi-guide.github.io/networking/create-direct-ethernet-connection

- check os installed in raspberry: `cat /etc/os-release`

- check hostname and general info: `hostnamectl`

- check disk space usage: `df -h`

- enable user lingering: `sudo loginctl enable-linger <username>`

- verify user lingering: `loginctl show-user <username> | grep Linger`

## Git setup

The following steps allow, together with the above user lingering setup, to have git ssh configuration always already setup when the user logs in and after every reboot

- git install: `sudo apt install git`
- create ssh key
- copy public key in Gihub online settings
- activate ssh agent: `eval "$(ssh-agent -s)"`
- add private key to ssh agent: `ssh-add ~/.ssh/[name of the private key file]`
- setup `~/.ssh/config` file
  - create file: `touch ~/.ssh/config`
  - paste content in config file:
  ```
  Host github.com
    AddKeysToAgent yes
    ForwardAgent yes
    IdentityFile ~/.ssh/[name of the private key file]
  ```

## Safe reboot and shutdown

Choose one of the following commands to reboot:

- `sudo reboot`
- `sudo shutdown -r now`

Choose one of the following commands to shutdown:

- `sudo shutdown -h now`
- `sudo poweroff`
- `sudo shutdown -h +10`
- `sudo shutdown -h 22:30`

## Usb device config

- system profiler to find usb connections: `system_profiler SPUSBDataType`

- from system profiler command, get the device Product ID, Vendor ID and serial number (e.g. 0x62de, 0x2d37, 420BU-SN248220011)

- find usb device in mac os: `ioreg -irc IOUSBDevice`

## Printer config

- printer status information in mac os (https://ss64.com/mac/lpstat.html): `lpstat -p`

- print files in mac os (https://ss64.com/mac/lpr.html), is part of CUPS (https://www.cups.org/): `lpr`

- command line printing options CUPS https://www.cups.org/doc/options.html

- cups address: [raspberry-pi-ip-address]:631

- lp(r) fit to page params https://discussions.apple.com/thread/7899241?sortBy=rank

- lp(r) margins and smaller font https://superuser.com/questions/229480/how-do-you-get-lpr-on-os-x-to-print-with-margins-and-a-smaller-font

## Python config

- initialise virtual env for python project: `python3 -m venv venv`

- to use python inside the virtual env: `source venv/bin/activate`

## Docker config

- installation: follow instructions here https://docs.docker.com/engine/install/raspberry-pi-os/#install-using-the-repository

- access and authenticate with GitHub container registry: follow official documentation here https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

- set `.env` file in the same path of docker compose files: check .env.example

- pull image from Container Registry: `docker pull ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_BACKEND:v-0.0.3`

- build image: `docker buildx build --load ./packages/backend/ -t ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_BACKEND:$VERSION`

- push image in Container Registry: `docker push ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_BACKEND:$VERSION`

- access image files: `docker exec -it [container name] sh`

- access files inside volume (named volume): `docker volume inspect [volume name] --format '{{ .Mountpoint }}'`

- copy from volume files: `sudo cp -a "$(docker volume inspect [volume name] --format '{{ .Mountpoint }}')" [path on host]`
