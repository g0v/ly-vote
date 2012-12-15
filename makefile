all:
	jade --pretty index.jade
	livescript -cp index.ls > index.js
	livescript -cp lyvote.ls > lyvote.js
