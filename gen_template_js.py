#!/usr/bin/env python2.4
# This takes template.html and makes a document.write() for it.
# Later, it could take template.html and make DOM objects instead.

import re
import glob
import json
import os

import sys
import urllib2
import locale

def load_total():
	"""Load the total from the site, return it as a formatted string."""

       	total = urllib2.urlopen(
            'http://creativecommons.org/includes/total.txt').read().strip()
        
        return locale.format('$ %d', locale.atoi(total), True)

def subst_total(in_string):
	"""Replace occurences of {{total}} in in_string with the current
	donation total."""

	return in_string.replace("{{total}}", load_total())
	
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
	    		 jsify(subst_total(file(filename, 'r').read()))
			 )

if __name__ == '__main__':
	main()
