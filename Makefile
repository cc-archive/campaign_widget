all: up_to_date check_depends template.en_US.js 

check_depends:
	python depends.py

up_to_date:
	svn up > /dev/null

template.en_US.js: template.html gen_template_js.py
	python2.4 gen_template_js.py template.html

clean:
	rm -f $(shell ls -1 template.*js*)
	rm -f $(shell ls -1 *.pyc)
