/************************************************
	LAB JS BASE APP
************************************************/

INCLUDED LIBRARIES
- jquery
	
// WHAT THIS APP SHOULD DO

Move an amazing div across the screen. The div is placed in
html + styled 

// KNOWN ISSUES

1)
LAB.require is blocking, which is nice... HOWEVER: errors in 
your included .js files WILL NOT show up at the correct line
number in the chrome debugger. If you are getting errors and
can't figure them out, include the offending JS file in your 
HTML.

2) 
because of Chrome security issues, LAB.require needs either a 
hosted file, or be launched with the Chrome dev flag --allow-file-access-from-files
e.g. /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files