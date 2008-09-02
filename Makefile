all: check_depends widget.js 

check_depends:
	python depends.py

widget.js: widget gen_template_js.py
	python2.4 gen_template_js.py widget widget.css-links widget.backwards-compat-prefix

clean:
	rm -f $(shell ls -1 widget.*js*)
	rm -f $(shell ls -1 *.pyc)
