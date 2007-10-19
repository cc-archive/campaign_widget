#!/usr/bin/python
# This takes template.html and makes a document.write() for it.
# Later, it could take template.html and make DOM objects instead.

import re
import glob
import json
import os

import sys

def jsify(in_string):
	lines = in_string.split('\n')
	if lines[0].startswith('<?xml version='):
		lines = lines[1:]
	for k in range(len(lines)):
		lines[k] = "document.write(%s);" % json.write(lines[k].strip())
	return '\n'.join(lines)

def main():

	# Javascript-ify every item passed in
	for filename in sys.argv[1:]:
	    file('%s.js' % filename, 'w').write(
	    		 jsify(file(filename, 'r').read())
			 )

if __name__ == '__main__':
	main()
