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

# http://aspn.activestate.com/ASPN/Cookbook/Python/Recipe/473872
# by Edward Hartfield
def number_format(num, places=0):
   """Format a number with grouped thousands and given decimal places"""

   places = max(0,places)
   tmp = "%.*f" % (places, num)
   point = tmp.find(".")
   integer = (point == -1) and tmp or tmp[:point]
   decimal = (point != -1) and tmp[point:] or ""

   count =  0
   formatted = []
   for i in range(len(integer), 0, -1):
       count += 1
       formatted.append(integer[i - 1])
       if count % 3 == 0 and i - 1:
           formatted.append(",")

   integer = "".join(formatted[::-1])
   return integer+decimal
   

def load_total():
	"""Load the total from the site, return it as a formatted string."""

       	total = urllib2.urlopen(
            'http://creativecommons.org/includes/total.txt').read().strip()
        
        return locale.format('$%s', number_format(locale.atoi(total)), True)


def load_qty():
	"""Load the total number of donors from the site, return it as a 
        formatted string."""

       	total = urllib2.urlopen(
            'http://creativecommons.org/includes/number.txt').read().strip()
        
        return locale.format('%s', number_format(locale.atoi(total)), True)

def subst_total(in_string):
	"""Replace occurences of {{total}} in in_string with the current
	donation total."""

	# update the progress bar total
	result = in_string.replace("{{total}}", load_total())
        result = result.replace("{{num_donors}}", load_qty())

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
   assert len(sys.argv) == 3
   infile = sys.argv[1]
   css_links = sys.argv[2]
   css_links_as_list = open(css_links).read().split()

   template = open('template.js').read()
   escaped = json.write(subst_total(open(infile).read()))
   template = template.replace("'REPLACEME'", escaped)
   template = template.replace('["css_files"]', json.write(css_links_as_list))
   fd = open(infile + '.js', 'w')
   fd.write(template)
   fd.close()

if __name__ == '__main__':
	main()
