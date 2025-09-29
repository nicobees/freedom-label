### Commands in MacOS terminal

- system profiler to find usb connections: `system_profiler SPUSBDataType`
- from system profiler command, get the device Product ID, Vendor ID and serial number (e.g. 0x62de, 0x2d37, 420BU-SN248220011)
- find usb device in mac os: `ioreg -irc IOUSBDevice`
- printer status information in mac os (https://ss64.com/mac/lpstat.html): `lpstat -p`
- print files in mac os (https://ss64.com/mac/lpr.html), is part of CUPS (https://www.cups.org/): `lpr`
- command line printing options CUPS: https://www.cups.org/doc/options.html
- lp(r) fit to page params: https://discussions.apple.com/thread/7899241?sortBy=rank
- lp(r) margins and smaller font: https://superuser.com/questions/229480/how-do-you-get-lpr-on-os-x-to-print-with-margins-and-a-smaller-font
