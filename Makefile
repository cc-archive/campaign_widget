all: up_to_date check_depends template.en_US.js 

check_depends:
	python depends.py

up_to_date:
	svn up > /dev/null

template.en_US.js: widget gen_template_js.py
	python2.4 gen_template_js.py widget

clean:
	rm -f $(shell ls -1 widget.*js*)
	rm -f $(shell ls -1 *.pyc)
