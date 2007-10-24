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

	# update the progress bar total
	result = in_string.replace("{{total}}", load_total())

	return result

def variable_subst(in_string):

	SUBST_REGEX = r"(.*)(\[\[)([a-z_]+)(\]\])(.*)"

	# do any variable subsitutions
	return re.sub(SUBST_REGEX, '\g<1>" + \g<3> + "\g<5>', in_string)

def jsify(in_string):
	lines = in_string.split('\n')
	if lines[0].startswith('<?xml version='):
		lines = lines[1:]
	for k in range(len(lines)):
		lines[k] = variable_subst(
			"document.write(%s);" % json.write(lines[k].strip())
			)

	return '\n'.join(lines)

def main():

	# Javascript-ify every item passed in
	for filename in sys.argv[1:]:
		try:
			new_contents = jsify(subst_total(file(filename, 'r').read()))
			file('%s.js' % filename, 'w').write(new_contents)
		except Exception, e:
			pass

if __name__ == '__main__':
	main()
