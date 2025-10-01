#!/usr/bin/env python
import os

command = "lpr"
# command = 'lp'
# printerName = '-P SN_420B_new'
printerName = "-P SN_420B"
layoutOptions = "-o PageSize=Custom.50x30mm -o orientation-requested=3"
# pageOptions = '-o Type=LabelGaps -o PostAction=None'
# textOptions = '-o lpi=10 -o cpi=12'
# marginOptions = '-o fit-to-page -o PageLeft=144 -o PageTop=72'
# fileName = 'test.pdf'
fileName = "output_pdf/2_14.pdf"

# commandToRun = f"{command} {printerName} {layoutOptions} {pageOptions} {textOptions} {marginOptions} {fileName}"
commandToRun = f"{command} {printerName} {layoutOptions} {fileName}"
print(commandToRun)
printer = os.popen(commandToRun, "w")
printer.close()
