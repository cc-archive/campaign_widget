var recurringAmount = 0,
    premiumId = 26,
    q = function (a) {
        return new q.fn.init(a)
    };
q.fn = q.prototype = {
    selector: "",
    init: function (a) {
        this.selector = [];
        if (a) if (typeof a == "object") this.selector.push(a);
        else if (a.match(/^#/)) this.selector.push(document.getElementById(a.substring(1, a.length)));
        else if (a.match(/^\./)) this.selector.push(document.getElementsByClassName(a.substring(1, a.length)));
        else this.selector = a.match(/^name=/) ? document.getElementsByName(a.substring(5, a.length)) : document.getElementsByTagName(a)
    },
    first: function () {
        return new q.fn.init(this.selector[0])
    },
    length: function () {
        return this.selector.length
    },
    nth: function (a) {
        return this.selector[a]
    },
    each: function (a) {
        if (typeof a == "function") {
            l = this.selector.length;
            for (i = 0; i < l; i++) a.call(this.selector[i])
        }
    },
    show: function (a) {
        this.each(function () {
            if (this.style.display != "block") {
                this.style.display = "block";
                a && q(this).fadeIn(300)
            }
        })
    },
    hide: function (a) {
        this.each(function () {
            if (this.style.display != "none") if (a) q(this).fadeOut(300);
            else this.style.display = "none"
        })
    },
    toggle: function () {
        this.each(function () {
            this.style.display = this.style.display == "none" ? "block" : "none"
        })
    },
    checked: function (a) {
        if (!a) return this.selector[0].checked;
        this.each(function () {
            this.checked = a
        })
    },
    html: function (a) {
        if (!a) return this.selector[0].innerHTML;
        this.each(function () {
            this.innerHTML = a
        })
    },
    value: function (a) {
        if (!a) return this.selector[0].value;
        this.each(function () {
            this.value = a
        })
    },
    queryStringBuilder: function (a) {
        var c = [],
            b;
        for (b in a) if (typeof a[b] == "string" || typeof a[b] == "number") {
            c.push(b);
            c.push(a[b])
        }
        a = c.length;
        b = "";
        for (i = 0; i < a; i++) {
            b += escape(c[i]);
            if (i < a - 1) b += i % 2 ? "&" : "="
        }
        return b
    },
    fadeIn: function (a) {
        this._fade(0, 1, a)
    },
    fadeOut: function (a) {
        this._fade(1, 0, a)
    },
    _fade: function (a, c, b) {
        e = this.selector[0];
        e.fadeInterval && clearInterval(e.fadeInterval);
        e.style.opacity = a;
        e.style.filter = "alpha(opacity=" + a * 100 + ")";
        var d = b / 30,
            f = (c - a) / d,
            g = a,
            h = 0;
        e.fadeInterval = setInterval(function () {
            g += f;
            e.style.opacity = g;
            e.style.filter = "alpha(opacity=" + g * 100 + ")";
            h += d;
            if (h > b) {
                clearInterval(e.fadeInterval);
                if (e.style.opacity <= 0) e.style.display = "none"
            }
        }, d)
    }
};
q.fn.init.prototype = q.fn;

function cc_hidePremiums() {
    q("#cc_widget_dialog_tshirtSize").toggle()
}
var cc_d = function () {
        return {
            href: "https://support.creativecommons.org/sites/default/modules/civicrm/bin/OneClick.php?oc_action=donate&&source=Widget+Contribution:+Support+Creative+Commons&",
            premiumId: 26,
            _create: function (a, c, b, d) {
                if (cc_d.dialog) {
                    var f = cc_d.dialog;
                    if (c) f = cc_d.dialog[c];
                    c = "div";
                    if (b) c = b;
                    b = document.createElement(c);
                    b = b.cloneNode(false);
                    if (d) b.type = d;
                    b.id = "cc_widget_dialog_" + a;
                    f.appendChild(b);
                    cc_d.dialog[a] = b
                }
            },
            _showHideGifts: function (a, c) {
                a < 75 ? q("#cc_widget_dialog_noPremiums").show() : q("#cc_widget_dialog_noPremiums").hide();
                a >= 75 ? q("#cc_widget_dialog_premiums").show(c) : q("#cc_widget_dialog_premiums").hide(c);
                a >= 75 ? q("#cc_widget_dialog_giftCheck").value("yes") : q("#cc_widget_dialog_giftCheck").value("no");
                a >= 75 ? q("#cc_widget_dialog_giftCheck").checked(true) : q("#cc_widget_dialog_giftCheck").checked(false);
                a >= 75 ? q("#cc_widget_dialog_tshirtSize").show() : q("#cc_widget_dialog_tshirtSize").hide()
            },
            _prepare: function () {
                cc_d.queryString = {};
                var a = cc_d.queryString.amount = cc_w.widget.donation_amount.value;
                cc_d._showHideGifts(a);
                q("#cc_widget_dialog_recur_annual").checked(false);
                q("#cc_widget_dialog_recur_inf").checked(false);
                q("#cc_widget_dialog_recur_none").checked(true);
                if (a > 5) {
                    recurringAmount = a / 12 < 5 ? a : parseFloat(a / 12).toFixed(2);
                    q("#cc_widget_dialog_recurringAmountMonthly").html(recurringAmount);
                    q("#cc_widget_dialog_recurringAmountInf").html(recurringAmount);
                    q("#cc_widget_dialog_amount").html(a);
                    q("#cc_widget_dialog_recurring").show()
                } else q("#cc_widget_dialog_recurring").hide();
                q("#cc_widget_dialog_shirtError").html("");
                q("#cc_widget_dialog_optout").checked(false)
            },
            _process: function () {
                var a = "";
                q("name=cc_widget_dialog_recur").each(function () {
                    if (this.checked && this.value != "on") a = this.value
                });
                if (a) {
                    console.log(a);
                    cc_d.queryString.recur = a;
                    cc_d.queryString.amount = recurringAmount
                }
                if (q("#cc_widget_dialog_giftCheck").checked() == true && (cc_d.queryString.amount >= 75 || cc_d.queryString.recur && cc_d.queryString.amount * 12 >= 75)) {
                    cc_d.queryString.premium = premiumId;
                    var c = q("name=cc_widget_dialog_size").value();
                    if (c == "") {
                        q("#cc_widget_dialog_shirtError").html("Please select a size!");
                        return -1
                    }
                    cc_d.queryString.size = c
                }
                var b = [];
                q("name=cc_widget_dialog_groups").each(function () {
                    this.checked && b.push(this.value)
                });
                if (b.length) cc_d.queryString.groups = b.join(":");
                if (q("name=cc_widget_dialog_optout").checked()) cc_d.queryString.sloptout = "IChooseToSloptOut"
            },
            init: function (a, c) {
                if (!cc_d.dialog) {
                    cc_d.dialog = document.createElement("div");
                    cc_d.dialog.id = "cc_widget_dialog";
                    cc_d.dialog.style.display = "none";
                    cc_d._create("header");
                    cc_d.dialog.header.innerHTML = "<h2>" + a + "</h2>";
                    cc_d._create("body");
                    cc_d.dialog.body.innerHTML = "<p>" + c + "</p>";
                    cc_d._create("footer");
                    cc_d._create("paypal_button", "footer", "button");
                    cc_d.dialog.paypal_button.innerHTML = "<span>Paypal</span>";
                    cc_d.dialog.paypal_button.onclick = cc_d.paypalClick();
                    cc_d._create("google_button", "footer", "button");
                    cc_d.dialog.google_button.innerHTML = "<span>Google Checkout</span>";
                    cc_d.dialog.google_button.onclick = cc_d.googleClick();
                    cc_d._create("cancel_button", "footer", "button");
                    cc_d.dialog.cancel_button.innerHTML = "I've changed my mind";
                    cc_d.dialog.cancel_button.onclick = function () {
                        cc_d.close()
                    };
                    q("body").nth(0).appendChild(cc_d.dialog);
                    q("#cc_widget_dialog_recur_annual").nth(0).onclick = function () {
                        cc_d.recurCheck(1)
                    };
                    q("#cc_widget_dialog_recur_inf").nth(0).onclick = function () {
                        cc_d.recurCheck(2)
                    };
                    q("#cc_widget_dialog_recur_none").nth(0).onclick = function () {
                        cc_d.recurCheck()
                    }
                }
            },
            paypalClick: function () {
                return function () {
                    if (cc_d._process() == -1) console.log("error");
                    else {
                        cc_d.queryString.pp = "paypal";
                        href = cc_d.href + q(null).queryStringBuilder(cc_d.queryString);
                        cc_d.close();
                        location.href = href
                    }
                }
            },
            googleClick: function () {
                return function () {
                    if (cc_d._process() == -1) console.log("error");
                    else {
                        cc_d.queryString.pp = "gc";
                        href = cc_d.href + q(null).queryStringBuilder(cc_d.queryString);
                        cc_d.close();
                        location.href = href
                    }
                }
            },
            recurCheck: function (a) {
                switch (a) {
                case 1:
                case 2:
                    cc_d._showHideGifts(cc_d.queryString.amount * 12, true);
                    break;
                default:
                    cc_d._showHideGifts(cc_d.queryString.amount, true)
                }
            },
            open: function () {
                if ( isNaN(cc_w.widget.donation_amount.value) ) {
                    alert('The amount you entered is not a number.');
                    return false;
                }
                if (cc_d.dialog) {
                    if (cc_d.dialog.style.display != "block") {
                        cc_d._prepare();
                        cc_d.dialog.style.display = "block";
                        t = document.documentElement.clientHeight / 2 - cc_d.dialog.clientHeight / 2 + document.body.scrollTop;
                        if (t < 0) t = 10;
                        cc_d.dialog.style.top = t + "px";
                        cc_d.dialog.style.left = document.documentElement.clientWidth / 2 - cc_d.dialog.clientWidth / 2 + "px";
                        q(cc_d.dialog).fadeIn(200)
                    }
                } else alert("run cc_w.init method first")
            },
            close: function () {
                q(cc_d.dialog).fadeOut(200)
            },
            toggle: function () {
                cc_d.dialog.style.display == "block" ? cc_d.close() : cc_d.open()
            }
        }
    }(),
    cc_w = function () {
        return {
            _create: function (a, c, b, d) {
                if (cc_w.widget) {
                    var f = cc_w.widget;
                    if (c) f = cc_w.widget[c];
                    c = "div";
                    if (b) c = b;
                    b = document.createElement(c);
                    b = b.cloneNode(false);
                    if (d) b.type = d;
                    b.id = "cc_widget_" + a;
                    f.appendChild(b);
                    cc_w.widget[a] = b
                }
            },
            init: function (a, c, b, d, f) {
                if (c == null) c = "Be a hero and support Creative Commons!";
                if (b == null) b = "25";
                if (f == null) f = "normal";
                if (d == null) d = "Donate";
                cc_w.widget = document.createElement("div");
                cc_w.widget.id = "cc_widget";
                cc_w.widget.className = "cc_widget_size_" + f;
                a.parentNode.insertBefore(cc_w.widget, a.nextSibling);
                cc_w._create("widget_base");
                cc_w._create("widget_title", "widget_base", "h1");
                q("#cc_widget_widget_title").html("<span>Creative Commons</span>");
                cc_w._create("widget_text", "widget_base", "p");
                q("#cc_widget_widget_text").html(c);
                cc_w._create("widget_form", "widget_base", "form");
                q("#cc_widget_widget_form").html("$");
                cc_w._create("donation_amount", "widget_form", "input");
                cc_w.widget.donation_amount.value = b;
                cc_w.widget.donation_amount.size = 6;
                cc_w._create("donation_donate", "widget_form", "input", "submit");
                cc_w.widget.donation_donate.value = d;
                cc_w._create("share", "widget_base");
                q("#cc_widget_share").html('<a href="https://support.creativecommons.org/widget">Share</a>')
            }
        }
    }();
(function () {
    function a() {
        widgetSize = widgetDonateButton = widgetDonate = widgetText = null;
        if (!b.innerHTML.match(/;/)) try {
            eval("json = " + b.innerHTML);
            if (json) {
                if (json.text) widgetText = json.text;
                if (json.d_amt) widgetDonate = json.d_amt;
                if (json.d_btn) widgetDonateButton = json.d_btn;
                if (json.size) widgetSize = json.size
            }
        } catch (d) {}
        cc_d.init("Donate to Creative Commons", '<div id="cc_widget_dialog_moreOptions"><p style="float: right"><img src="https://support.creativecommons.org/sites/default/files/cc-shirt-ft.png" alt="Supporter Shirt"><br><small>Supporter T-Shirt<br>CC-BY <a href="http://www.flickr.com/photos/franktobia/3722933771">Frank Tobia</a></small></p><form name="donateOptions" id="cc_widget_dialog_donateOptions"><div id="cc_widget_dialog_noPremiums" style="display:block;"><p><strong>Note:</strong> You will not receive any premiums, including the campaign t-shirt, at this donation&nbsp;level.</p></div><div id="cc_widget_dialog_recurring" style="display:block;"><h5>Monthly Donation <small>(Optional)</small></h5><p><input type="radio" name="cc_widget_dialog_recur" value="1" id="cc_widget_dialog_recur_annual"> $<span name="cc_widget_dialog_recurringAmount" id="cc_widget_dialog_recurringAmountMonthly"></span> per month <em>for the next year</em>.<br><input type="radio" name="cc_widget_dialog_recur" value="2" id="cc_widget_dialog_recur_inf"> $<span name="cc_widget_dialog_recurringAmount" id="cc_widget_dialog_recurringAmountInf"></span> per month <em>until I choose to cancel</em>.<br><input type="radio" name="cc_widget_dialog_recur" id="cc_widget_dialog_recur_none"> A single donation of $<span id="cc_widget_dialog_amount"></span>.</p></div><div id="cc_widget_dialog_premiums" style="display:block;"><h5>Gift Options</h5><p><input id="cc_widget_dialog_giftCheck" onchange="cc_hidePremiums(this);" name="giftCheck" type="checkbox" checked value="yes" class="cc_widget_dialog_form-checkbox"><label for="giftCheck">I would like to receive a gift for my donation.</label></p><div id="cc_widget_dialog_tshirtSize"><h5>Tshirt Size</h5><select name="cc_widget_dialog_size"><option value="">-- Select Size --</option><option value="Women\'s Medium">Women\'s Medium</option><option value="Adult Small">Adult Small</option><option value="Adult Medium">Adult Medium</option><option value="Adult Large">Adult Large</option><option value="Adult X-Large">Adult X-Large</option><option value="Adult XX-Large">Adult XX-Large</option></select><span id="cc_widget_dialog_shirtError"></span></div></div><h5>Mailing List Opt-in</h5><p><input id="cc_widget_dialog_newsletterGroup" name="cc_widget_dialog_groups" type="checkbox" value="CC Newsletter" class="cc_widget_dialog_form-checkbox"><label for="newsletterGroup">Yes, I would like to receive CC Newsletters.</label><br><input id="cc_widget_dialog_eventsGroup" name="cc_widget_dialog_groups" type="checkbox" value="CC Events" class="cc_widget_dialog_form-checkbox"><label for="eventsGroup">Yes, I would like to be notified about CC events.</label></p><h5>Supporter Listing Opt-out</h5><p><input id="cc_widget_dialog_optout" name="cc_widget_dialog_optout" type="checkbox" value="Supporters" class="cc_widget_dialog_form-checkbox"><label for="optout">Do not include my name in any supporter lists.</label></p><div class="cc_widget_dialog_paymentOptions"><h5>Payment Options</h5><ul><li><strong>PayPal</strong> \u2014 Use your credit card or PayPal account.</li><li><strong>Google Checkout</strong> \u2014 Requires a Checkout account.</li></ul></div></form></div>');
        cc_w.init(b, widgetText, widgetDonate, widgetDonateButton, widgetSize);
        q("#cc_widget_donation_donate").selector[0].onclick = function () {
            cc_d.open();
            return false
        }
    }
    var c = document.getElementsByTagName("script"),
        b = c[c.length - 1];
    (function () {
        var d = q("head").selector[0];
        if (!d) {
            var f = q("body").selector[0];
            d = document.createElement("head");
            f.parentNode.insertBefore(d, f)
        }
        stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.type = "text/css";
        stylesheet.href = "http://creativecommons.org/includes/widget.css?2.0";
        d.appendChild(stylesheet)
    })();
    typeof window.addEventListener !== "undefined" ? window.addEventListener("load", a(), false) : window.attachEvent("onload", a)
})();
