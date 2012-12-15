all:
	jade --pretty index.jade
	livescript -cp lyvote.ls > lyvote.js
