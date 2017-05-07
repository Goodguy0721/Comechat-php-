var MigratoryDataClient = {};
MigratoryDataClient.a = function() {
	return navigator.userAgent && navigator.userAgent.indexOf("ANTGalio") !== -1 ? "Opera" : navigator.userAgent && navigator.userAgent.indexOf("Chrome") !== -1 && navigator.userAgent.indexOf("WebKit") !== -1 ? "WebKit Chrome" : navigator.userAgent && navigator.userAgent.indexOf("Android") !== -1 ? "WebKit Android" : navigator.userAgent && navigator.userAgent.indexOf("iPhone") !== -1 ? "WebKit iPhone" : navigator.userAgent && navigator.userAgent.indexOf("WebKit") !== -1 ? "WebKit" : navigator.userAgent && navigator.userAgent.indexOf("MSIE") !== -1 ? "IE" : navigator.userAgent && navigator.userAgent.indexOf("Gecko") !== -1 ? "Gecko" : navigator.userAgent && navigator.userAgent.indexOf("Opera Mobi") !== -1 ? "Opera Mobile" : navigator.userAgent && navigator.userAgent.indexOf("Opera Mini") !== -1 ? "unknown" : window.opera ? "Opera" : "unknown"
};
MigratoryDataClient.b = function(a) {
	if (!document.body) throw "Error: The document doesn't have a body!";
	var b = true;
	if (this.c === "unknown") {
		b = false;
		if (a) if (this.d === null) throw "Error: Browser not supported!";
		else this.d(this.ERROR_UNSUPPORTED_BROWSER)
	}
	return b
};
MigratoryDataClient.e = function() {
	if (document.readyState === "complete") this.f();
	else if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", this.f, false);
		window.addEventListener("load", this.f, false)
	} else if (document.attachEvent) {
		document.attachEvent("onreadystatechange", this.f);
		window.attachEvent("onload", this.f);
		var a = false;
		try {
			a = window.frameElement == null
		} catch (b) {}
		document.documentElement.doScroll && a && this.g()
	}
};
MigratoryDataClient.g = function() {
	if (!MigratoryDataClient.h) {
		try {
			document.documentElement.doScroll("left")
		} catch (a) {
			setTimeout(MigratoryDataClient.g, 1);
			return
		}
		MigratoryDataClient.f()
	}
};
MigratoryDataClient.i = function(a) {
	this.h ? a() : this.j.push(a)
};
MigratoryDataClient.f = function() {
	if (!MigratoryDataClient.h) if (document.body) {
		MigratoryDataClient.h = true;
		for (var a = 0; a < MigratoryDataClient.j.length; a++) MigratoryDataClient.j[a]();
		MigratoryDataClient.j = null
	} else setTimeout(MigratoryDataClient.f, 13)
};
MigratoryDataClient.k = function(a) {
	var b = window.location.protocol,
		c = window.location.host,
		d = window.location.port;
	if (c.indexOf("localhost") === 0) return {
		l: "localhost:80",
		m: a + "/"
	};
	if (d.length > 0 && c.lastIndexOf(":") !== -1) c = c.substring(0, c.lastIndexOf(":"));
	var e = a.indexOf("//");
	if (e === -1) return null;
	var f = a.substring(0, e);
	if (b !== f) return null;
	a = a.substring(f.length + 2);
	e = a.indexOf("/");
	if (e !== -1) a = a.substring(0, e);
	e = a.lastIndexOf(":");
	b = "";
	if (e !== -1) {
		b = a.substring(e + 1);
		a = a.substring(0, e)
	}
	if (navigator.userAgent && navigator.userAgent.indexOf("ANTGalio") !== -1) {
		e = 80;
		if (f === "https:") e = 443;
		if (b !== "" && b !== e && d !== e) if (b !== d) return null
	} else if (b !== d) return null;
	if (a.length < 4) return null;
	var g = -1;
	e = a.length - 1;
	for (var i = c.length - 1; e >= 0 && i >= 0; e--, i--) if (a.charAt(e) !== c.charAt(i)) {
		g = e;
		break
	}
	d = "";
	if (g === -1) if (e === -1 && i === -1) {
		e = a.indexOf(".");
		d = a.substring(e + 1)
	} else if (e === -1) if (c.charAt(i - 1) === ".") d = a;
	else {
		e = a.indexOf(".");
		if (e === -1) return null;
		d = a.substring(e + 1)
	} else {
		if (i === -1) if (a.charAt(e - 1) === ".") d = c;
		else {
			e = c.indexOf(".");
			if (e === -1) return null;
			d = c.substring(e + 1)
		}
	} else {
		e = a.indexOf(".", g + 1);
		if (e === -1) return null;
		d = a.substring(e + 1)
	}
	if (d.length < 4 || d.indexOf(".") === -1) return null;
	d += b.length > 0 ? ":" + b : "";
	a = f + "//" + a + (b.length > 0 ? ":" + b : "") + "/";
	if (this.n >= 2) {
		c = d.split(".");
		if (c.length >= this.n) d = c.slice(-1 * this.n).join(".")
	}
	return {
		l: d,
		m: a
	}
};
MigratoryDataClient.o = function(a) {
	return this.k(a) === null
};
MigratoryDataClient.p = function(a, b) {
	if (a.name) a = a.name;
	else {
		var c = a.toString();
		a = c.substring(c.indexOf("function") + 8, c.indexOf("("));
		a = a.replace(/^\s+|\s+$/g, "");
		if (a.length === 0) a = "anonymous";
		if (a === "anonymous" && typeof b === "object") for (var d = 0; d < b.length; d++) for (var e in b[d]) if (b[d].hasOwnProperty(e) && typeof b[d][e] === "function") if (b[d][e].toString() === c) return e
	}
	return a
};
MigratoryDataClient.q = function(a) {
	if (a === null || a === undefined || typeof a === "number" || typeof a === "boolean") return a;
	else if (typeof a === "string") return '"' + a + '"';
	else if (typeof a === "function") return this.p(a, this) + "()";
	else if (a instanceof Array) return this.r(a);
	var b = "{",
		c = 0;
	for (var d in a) {
		if (c > 0) b += ", ";
		if (a.hasOwnProperty(d)) b += d + ":" + this.q(a[d]);
		c++
	}
	b += "}";
	return b
};
MigratoryDataClient.s = function(a, b) {
	for (var c = 0; c < a.length; c++) if (a[c] === b) return c;
	return -1
};
MigratoryDataClient.t = function(a) {
	for (var b = [], c = 0; c < a.length; c++) b.push(a[c]);
	return b
};
MigratoryDataClient.u = function(a, b) {
	for (var c = [], d = 0; d < a.length; d++) this.s(b, a[d]) === -1 && c.push(a[d]);
	return c
};
MigratoryDataClient.v = function(a, b) {
	for (var c = [], d = 0; d < a.length; d++) this.s(b, a[d]) !== -1 && c.push(a[d]);
	return c
};
MigratoryDataClient.w = function(a, b) {
	for (var c = this.t(a), d = 0; d < b.length; d++) this.s(a, b[d]) === -1 && c.push(b[d]);
	return c
};
MigratoryDataClient.x = function(a, b, c, d, e) {
	var f = this.p(arguments.callee.caller, this);
	if (typeof a !== "object" || typeof a.length !== "number") throw "Error: " + f + ". The argument should be a list!";
	if (c !== null && a.length < c) throw "Error: " + f + ". The list argument should have at minimum " + c + " elements!";
	if (b !== null) for (var g = 0; g < a.length; g++) if (typeof a[g] !== b) throw "Error: " + f + ". The list argument should contain only '" + b + "' elements, the " + g + "-th element is not of type '" + b + "'!";
	if (typeof d === "object" && typeof d.test === "function") for (g = 0; g < a.length; g++) if (!d.test(a[g])) throw "Error: " + f + ". " + e + ". The " + g + "-th element is the cause of the error!";
};
MigratoryDataClient.r = function(a) {
	for (var b = "[", c = 0; c < a.length; c++) {
		if (c > 0) b += ", ";
		b += this.q(a[c])
	}
	b += "]";
	return b
};
MigratoryDataClient.y = function(a, b) {
	if (a === this.z.a0) this.a1(b);
	else if (a === this.z.a2) this.a3(b);
	else if (this.a4 !== null) if (this.a4.a5 === this.a6 && a === this.z.a6) this.a7(b);
	else this.a4.a5 === this.a8 && a === this.z.a8 && this.a9(b)
};
MigratoryDataClient.a7 = function(a) {
	var b = a[this.z.aa];
	if (b !== undefined) this.ab(this.ac, this.ad.ae[b]);
	else {
		if (this.af !== this.ag) {
			a = a[this.z.ah];
			if (a === undefined) {
				MigratoryDataClient.ab(this.ac, "server subscribe response is missing the session id");
				return
			}
			this.ai = a;
			a = this.af;
			this.af = this.ag;
			this.aj = 0;
			this.ak();
			if (a !== this.al) {
				this.am.an[this.ao].ap++;
				if (a === null || this.aq) this.ar({
					type: this.NOTIFY_SERVER_UP,
					info: ""
				})
			} else this.am.an[this.ao].as++;
			this.aq = false
		}
		this.at()
	}
};
MigratoryDataClient.a9 = function(a) {
	a = a[this.z.aa];
	a !== undefined ? this.ab(this.ac, this.ad.ae[a]) : this.at()
};
MigratoryDataClient.a1 = function(a) {
	for (var b = [], c = 0, d = 0; d < a.length; d++) {
		var e = a[d],
			f = this.z.au,
			g = this.z.av,
			i = this.z.aw,
			k = this.z.ax,
			l = this.z.ay;
		if (e[f] === undefined || e[g] === undefined) return;
		var j = false;
		if (e[l] !== undefined) if (e[l] == this.az) j = true;
		l = [];
		i = e[i];
		k = e[k];
		if (i !== undefined && k != undefined) if (i instanceof Array) for (var m = 0; m < i.length; m++) l[m] = {
			name: i[m],
			value: k[m]
		};
		else l[0] = {
			name: i,
			value: k
		};
		f = {
			subject: e[f],
			data: e[g],
			fields: l,
			isSnapshot: j
		};
		g = this.z.b0;
		if (e[g] !== undefined) {
			g = ((new Date).getTime() & 16777215) - e[g];
			if (g > -14400000) f.latency = g
		}
		if (MigratoryDataClient.b1 == true && this.b2[f.subject] === undefined) {
			g = parseInt(e[this.z.b3]);
			e = parseInt(e[this.z.b4]);
			j = this.b5[f.subject];
			if (j === undefined) {
				this.b5[f.subject] = {
					seqid: 7E4,
					seq: 0,
					recovery: false
				};
				j = this.b5[f.subject]
			} else j.seq++;
			if (j.seqid !== g) {
				j.seqid = g;
				j.seq = e;
				j.recovery = false
			} else if (j.seq !== e) if (j.recovery == false) {
				j.seq--;
				if (e <= j.seq) continue;
				MigratoryDataClient.b6();
				return
			} else {
				j.recovery = false;
				if (e > j.seq) {
					g = {
						type: this.NOTIFY_DATA_LOSS,
						info: f.subject
					};
					this.ar(g)
				} else continue;
				j.seq = e;
				g = {
					type: this.NOTIFY_DATA_SYNC,
					info: f.subject
				};
				this.ar(g)
			} else if (j.recovery == true) j.recovery = false
		}
		b[c] = f;
		c++
	}
	if (c > 0) {
		this.am.an[this.ao].b7++;
		this.ar(b)
	}
};
MigratoryDataClient.ab = function(a, b) {
	a = a + ", " + b;
	b = this.am.an[this.ao].ae;
	if (b[a] === undefined) b[a] = 1;
	else b[a]++;
	this.b6()
};
MigratoryDataClient.a3 = function(a) {
	var b = this.z.b8,
		c = this.z.au;
	if (!(a[b] === undefined || a[c] === undefined)) switch (a[b]) {
	case "a":
		a = {
			type: this.ENTITLEMENT_ALLOW,
			info: a[c]
		};
		this.ar(a);
		break;
	case "d":
		a = {
			type: this.ENTITLEMENT_DENY,
			info: a[c]
		};
		this.ar(a);
		break
	}
};
MigratoryDataClient.ar = function(a) {
	this.b9.push(a);
	setTimeout(function() {
		var b = MigratoryDataClient.b9.shift();
		if (b && b instanceof Array) MigratoryDataClient.ba.call(window, b);
		else MigratoryDataClient.d !== null && MigratoryDataClient.d.call(window, b)
	}, 0)
};
MigratoryDataClient.bb = function() {
	this.am.bc = (new Date).getTime();
	this.am.an[this.ao].bd++;
	this.be !== null && this.ak();
	this.a4 !== null && this.a4.a5 === this.bf && this.at();
	var a = (new Date).getTime();
	if (a - this.bg >= this.bh) {
		this.bg = a;
		a = {};
		a.a5 = this.bf;
		this.bi(a)
	}
};
MigratoryDataClient.ak = function() {
	this.be !== null && clearTimeout(this.be);
	this.be = setTimeout(function() {
		MigratoryDataClient.b6()
	}, this.bj)
};
MigratoryDataClient.b6 = function() {
	this.am.an[this.ao].bk++;
	if (this.a4 !== null) {
		this.a4.a5 === this.bl && this.at();
		this.at()
	}
	this.bm();
	if (this.af !== null) this.af = this.bn;
	this.bo.push(this.bp[this.ao]);
	this.ai = this.ao = null;
	this.aj++;
	if (this.be !== null) {
		clearTimeout(this.be);
		this.be = null
	}
	if (!this.aq && (this.aj === this.bq || this.aj === this.bp.length)) {
		this.aq = true;
		var a = {
			type: this.NOTIFY_SERVER_DOWN,
			info: ""
		};
		MigratoryDataClient.d !== null && MigratoryDataClient.d.call(window, a)
	}
	a = false;
	if (MigratoryDataClient.b1 == true) {
		a = true;
		for (var b in this.b5) {
			var c = this.b5[b];
			if (c.seqid != 7E4) if (c.recovery == true) a = false;
			else c.recovery = true
		}
	}
	if (MigratoryDataClient.br) if (this.bp.length > 0) {
		b = {};
		b.a5 = this.bl;
		this.bi(b)
	}
	MigratoryDataClient.bs = false;
	if (this.bt.length > 0) {
		b = {};
		b.a5 = this.a6;
		if (a == true) b.bu = true;
		b.bt = this.bt;
		this.bi(b)
	}
};
MigratoryDataClient.bv = function() {
	this.bw();
	var a = this.bp[this.ao].m;
	if (MigratoryDataClient.br) {
		encoding = this.bx;
		transport = this.by
	}
	if ("/" !== a.substring(a.length - 1, a.length)) a += "/";
	this.bz = setTimeout(function() {
		MigratoryDataClient.bz = null;
		MigratoryDataClient.ab(MigratoryDataClient.c0, MigratoryDataClient.a4.a5)
	}, this.c1);
	transport.call(this, a, this.ao, null)
};
MigratoryDataClient.c2 = function() {
	this.bw();
	var a = false,
		b = this.bp[this.ao].m,
		c = this.o(b),
		d = null;
	if (!MigratoryDataClient.bs && MigratoryDataClient.c3 !== "") d = MigratoryDataClient.c3;
	if (!MigratoryDataClient.br) {
		if (!this.c4 || !c) b = this.c5(b);
		if (!c && !this.c6(b, this.ao)) return
	}
	this.bt = this.w(this.bt, this.a4.bt);
	var e = c && !this.c7 ? this.c8 : null,
		f = null,
		g = null,
		i = this.c9,
		k = this.z,
		l = null,
		j = null;
	if (MigratoryDataClient.br) {
		i = this.ca;
		e = this.bx
	} else if (this.c === "IE" && c && MigratoryDataClient.cb) {
		i = this.cc;
		k = this.cd;
		e = this.ce
	}
	if (this.af !== this.ag) {
		if (!MigratoryDataClient.br) if (this.c === "IE" && !c) if (this.cf) {
			e = this.cg;
			i = this.ch
		} else {
			e = this.ci;
			f = "MigratoryDataClient0.cj";
			g = this.ck;
			i = this.cl;
			k = this.cd
		} else if (this.c === "IE" && MigratoryDataClient.cb && this.cf) {
			a = true;
			e = this.cg;
			i = this.cm;
			k = this.cd
		} else {
			e = this.cn;
			if (this.c === "WebKit Android") e = this.co;
			e = c && !this.c7 ? this.c8 : e;
			i = this.cp
		}
		l = navigator.userAgent;
		j = this.cq
	}
	c = "";
	for (var m = false, h = null, n = 0; n < this.a4.bt.length; n++) {
		if (n > 0) g = f = null;
		if (!MigratoryDataClient.bs) MigratoryDataClient.bs = true;
		if (m === false && this.a4.bu !== undefined && this.a4.bu === true) {
			h = MigratoryDataClient.getInfo();
			m = true
		}
		c += this.cr(this.a4.bt[n], e, f, g, this.ai, k, this.a4.bu, d, a, l, j, h);
		h = j = l = null
	}
	if ("/" !== b.substring(b.length - 1, b.length)) b += "/";
	this.bz = setTimeout(function() {
		MigratoryDataClient.bz = null;
		MigratoryDataClient.ab(MigratoryDataClient.c0, MigratoryDataClient.a4.a5)
	}, this.c1);
	i.call(this, b, this.ao, c)
};
MigratoryDataClient.cs = function() {
	this.bw();
	var a = this.bp[this.ao].m,
		b = this.o(a);
	if (!MigratoryDataClient.br) {
		if (!this.c4 || !b) a = this.c5(a);
		if (!b && !this.c6(a, this.ao)) return
	}
	this.bt = this.u(this.bt, this.a4.bt);
	if (this.af !== this.ag) {
		this.at();
		for (b = 0; b < this.a4.bt.length; b++) delete this.b2[this.a4.bt[b]]
	} else {
		var c = b && !this.c7 ? this.c8 : null,
			d = this.c9,
			e = this.z;
		if (MigratoryDataClient.br) {
			c = this.bx;
			d = this.ca
		} else if (this.c === "IE" && b && MigratoryDataClient.cb && this.cf) {
			d = this.cc;
			e = this.cd;
			c = this.ce;
			if ("/" !== a.substring(a.length - 1, a.length)) a += "/"
		}
		var f = "";
		for (b = 0; b < this.a4.bt.length; b++) {
			f += this.ct(this.a4.bt[b], c, this.ai, e);
			delete this.b2[this.a4.bt[b]]
		}
		this.bz = setTimeout(function() {
			MigratoryDataClient.bz = null;
			MigratoryDataClient.ab(MigratoryDataClient.c0, MigratoryDataClient.a4.a5)
		}, this.c1);
		d.call(this, a, this.ao, f)
	}
};
MigratoryDataClient.cu = function() {
	this.bw();
	var a = this.bp[this.ao].m,
		b = this.o(a);
	if (!MigratoryDataClient.br) {
		if (!this.c4 || !b) a = this.c5(a);
		if (!b && !this.c6(a, this.ao)) return
	}
	if (this.af !== this.ag) this.at();
	else {
		var c = b && !this.c7 ? this.c8 : null,
			d = this.c9,
			e = this.z;
		if (MigratoryDataClient.br) {
			c = this.bx;
			d = this.ca
		} else if (this.c === "IE" && b && MigratoryDataClient.cb && this.cf) {
			d = this.cc;
			e = this.cd;
			c = this.ce;
			if ("/" !== a.substring(a.length - 1, a.length)) a += "/"
		}
		b = MigratoryDataClient.cv(this.ai, e, c);
		this.bz = setTimeout(function() {
			MigratoryDataClient.bz = null;
			MigratoryDataClient.ab(MigratoryDataClient.c0, MigratoryDataClient.a4.a5)
		}, this.c1);
		d.call(this, a, this.ao, b)
	}
};
MigratoryDataClient.at = function() {
	if (this.cw.length !== 0) {
		this.cw.shift();
		this.cx();
		this.cy(false)
	}
};
MigratoryDataClient.bi = function(a) {
	this.cw.push(a);
	this.cz(false)
};
MigratoryDataClient.cy = function(a) {
	this.cw.length !== 0 && setTimeout(function() {
		MigratoryDataClient.cz(a)
	}, 0)
};
MigratoryDataClient.cz = function(a) {
	if (this.d0) if (this.b(true)) if (!(!a && (this.a4 !== null || this.cw.length === 0))) {
		this.a4 = this.cw[0];
		switch (this.a4.a5) {
		case this.a6:
			this.c2();
			break;
		case this.a8:
			this.cs();
			break;
		case this.bf:
			this.cu();
			break;
		case this.bl:
			this.bv();
			break
		}
	}
};
MigratoryDataClient.d1 = function() {
	this.d0 = true;
	this.cy(false)
};
MigratoryDataClient.cx = function() {
	this.a4 = null;
	if (this.bz !== null) {
		clearTimeout(this.bz);
		this.bz = null
	}
	if (this.d2 !== null && this.d2.readyState && this.d2.readyState !== 4) {
		if (typeof XMLHttpRequest !== "undefined") this.d2.aborted = true;
		this.d2.abort()
	}
	this.d2 !== null && delete this.d2;
	this.d2 = null
};
MigratoryDataClient.bm = function() {
	if (this.d3 !== null) {
		clearTimeout(this.d3);
		this.d3 = null
	}
	if (this.d4 !== null) if (this.d4.d5 !== "HTML5") if (this.d4.d5 === "XDR_HTML5") {
		var a = document.getElementById("MigratoryDataClient1");
		a !== null && a.contentWindow.postMessage("disconnect", "*")
	} else if (this.d4.getElementById) {
		a = this.d4.getElementById("d6");
		if (a !== null) {
			a.src = "";
			this.d4.body.removeChild(a);
			delete a
		}
		delete this.d4;
		this.d4 = null;
		CollectGarbage()
	} else {
		if (MigratoryDataClient.br) this.d4.close();
		else {
			if (this.d4.d7 !== undefined) {
				clearTimeout(this.d4.d7);
				this.d4.d7 = undefined
			}
			this.d4.readyState && this.d4.readyState !== 4 && this.d4.abort();
			this.d4.d5 === "XDR_STREAM" && this.d4.abort()
		}
		delete this.d4;
		this.d4 = null
	}
};
MigratoryDataClient.d8 = function() {
	this.cx();
	this.bm();
	this.ao = null;
	this.bp = [];
	this.am.an = [];
	this.af = null;
	this.bt = [];
	this.b2 = {};
	this.ai = null;
	this.bo = [];
	this.aj = 0;
	this.aq = false;
	this.cw = [];
	if (this.be !== null) {
		clearTimeout(this.be);
		this.be = null
	}
};
MigratoryDataClient.d9 = function() {
	if (this.o(this.bp[this.ao].m) && !this.c7) {
		if (this.d3 !== null) {
			clearTimeout(this.d3);
			this.d3 = null
		}
		if (this.d4 !== null) {
			this.d4.responseText = "";
			this.d4.da = 0
		}
	} else {
		this.af = this.al;
		this.bm();
		this.ai = null;
		MigratoryDataClient.bs = false;
		if (this.bt.length > 0) {
			var a = {};
			a.a5 = this.a6;
			if (MigratoryDataClient.b1 == true) a.bu = true;
			a.bt = this.bt;
			this.bi(a)
		}
	}
};
MigratoryDataClient.bw = function() {
	if (this.ao === null) this.ao = this.db()
};
MigratoryDataClient.db = function() {
	var a = this.u(this.bp, this.bo);
	if (a.length === 0) {
		this.bo = [];
		a = this.bp
	}
	if (a.length === 0) throw "Error: db() No available servers!";
	for (var b = 0, c = 0; c < a.length; c++) b += a[c].dc;
	var d;
	if (b === 0) d = Math.floor(a.length * Math.random());
	else {
		var e = Math.floor(b * Math.random());
		for (c = b = 0; c < a.length; c++) {
			b += a[c].dc;
			if (b > e) {
				d = c;
				break
			}
		}
	}
	return this.s(this.bp, a[d])
};
MigratoryDataClient.c5 = function(a) {
	var b = this.k(a);
	if (b === null || this.ck !== null && b.l !== this.ck) throw "Error: Invalid common parent domain of the servers! Cause server is '" + a + "'.";
	if (this.ck === null) {
		this.ck = b.l;
		if (b.l.indexOf(":") === -1) document.domain = b.l
	}
	return b.m
};
MigratoryDataClient.c6 = function(a, b) {
	var c = "MigratoryDataClient2" + b;
	if (window.frames[c] === undefined || window.frames[c].dd === undefined) {
		this.de(a, b);
		return false
	}
	return true
};
MigratoryDataClient.de = function(a, b) {
	b = "MigratoryDataClient2" + b;
	var c = document.getElementById(b);
	if (!c) {
		c = document.createElement("iframe");
		c.name = b;
		c.id = b;
		c.style.display = "none";
		document.body.appendChild(c)
	}
	this.bz = setTimeout(function() {
		MigratoryDataClient.bz = null;
		c.src = "";
		c.parentNode.removeChild(c);
		MigratoryDataClient.ab(MigratoryDataClient.c0, "iframe")
	}, this.c1);
	if ("/" !== a.substring(a.length - 1, a.length)) a += "/";
	c.src = a + "_" + this.df(this.ck, "dd", "MigratoryDataClient.dg")
};
MigratoryDataClient.dg = function() {
	clearTimeout(this.bz);
	this.bz = null;
	this.cy(true)
};
MigratoryDataClient.dh = function(a) {
	return this.c7 ? new XMLHttpRequest : this.di(a)
};
MigratoryDataClient.di = function(a) {
	if (a) {
		if (this.dj) this.dj.responseText = "";
		else this.dj = {
			open: function(b, c) {
				b = MigratoryDataClient.dk(c);
				MigratoryDataClient.dl.connect("0", b.host, b.port, "MigratoryDataClient.dm")
			},
			setRequestHeader: function() {},
			send: function(b) {
				MigratoryDataClient.dl.write("0", "POST / HTTP/1.1\r\nContent-Length: " + b.length + "\r\n\r\n" + b)
			},
			readyState: 4,
			status: 200,
			responseText: "",
			abort: function() {
				this.responseText = "";
				MigratoryDataClient.dl.close("0")
			}
		};
		return this.dj
	}
	if (this.dn) this.dn.responseText = "";
	else this.dn = {
		open: function(b, c) {
			b = MigratoryDataClient.dk(c);
			MigratoryDataClient.dl.connect("1", b.host, 80, "MigratoryDataClient.dp")
		},
		setRequestHeader: function() {},
		send: function(b) {
			MigratoryDataClient.dl.write("1", "POST / HTTP/1.1\r\nContent-Length: " + b.length + "\r\n\r\n" + b)
		},
		readyState: 4,
		status: 200,
		responseText: "",
		abort: function() {
			this.responseText = "";
			MigratoryDataClient.dl.close("1")
		}
	};
	return this.dn
};
MigratoryDataClient.dk = function(a) {
	var b, c;
	b = a.indexOf("https://") == 0 ? "https://" : "http://";
	a = a.substring(b.length);
	var d = a.indexOf("/");
	if (d != -1) {
		c = a.substring(0, d);
		a.substring(d)
	} else c = a;
	d = c.lastIndexOf(":");
	if (d != -1) {
		a = c.substring(d + 1);
		c = c.substring(0, d)
	} else a = b == "https://" ? "443" : "80";
	return {
		host: c,
		port: a
	}
};
MigratoryDataClient.dp = function(a) {
	if (this.d2) {
		this.d2.responseText += a;
		this.dq()
	}
};
MigratoryDataClient.dm = function(a) {
	if (this.d4) {
		this.d4.responseText += a;
		this.dr()
	}
};
MigratoryDataClient.ds = function() {
	this.b(false);
	var a = document.createElement("div");
	document.body.appendChild(a);
	var b = document.createElement("div");
	b.id = "MigratoryDataClient3";
	a.appendChild(b);
	setTimeout(function() {
		var c = "flash-transport.swf";
		if (typeof MigratoryDataClientFlashTransport === "string") c = MigratoryDataClientFlashTransport;
		swfobject.embedSWF(c, "MigratoryDataClient3", "0", "0", "9", false, {
			readyCallback: "MigratoryDataClient.dt"
		}, {
			allowFullScreen: false,
			allowScriptAccess: "always"
		}, {
			id: "MigratoryDataClient4",
			name: "MigratoryDataClient4"
		})
	}, 0)
};
MigratoryDataClient.dt = function() {
	MigratoryDataClient.dl = document.getElementById("MigratoryDataClient4");
	if (!MigratoryDataClient.dl) throw "Error: Could not get the reference of the flash-transport.swf!";
	MigratoryDataClient.d1()
};
MigratoryDataClient.cc = function(a, b, c) {
	b = document.getElementById("MigratoryDataClient5");
	if (b === null) {
		b = document.createElement("iframe");
		b.id = "MigratoryDataClient5";
		b.style.display = "none";
		document.body.appendChild(b)
	}
	var d = (new Date).getTime();
	b.src = a + "_" + c + d
};
MigratoryDataClient.cl = function(a, b, c) {
	this.d4 = new ActiveXObject("htmlfile");
	this.d4.open();
	MigratoryDataClient.ck.indexOf(":") === -1 ? this.d4.write("<html><head><script>document.domain='" + MigratoryDataClient.ck + "';<\/script></head><body></body></html>") : this.d4.write("<html><head></head><body></body></html>");
	this.d4.close();
	this.d4.parentWindow.MigratoryDataClient0 = this;
	b = this.d4.createElement("iframe");
	b.id = "d6";
	this.d4.body.appendChild(b);
	this.d4.du = 0;
	b.src = a + "_" + c
};
MigratoryDataClient.cj = function(a) {
	MigratoryDataClient.dv(a);
	MigratoryDataClient.d4.du += a.length;
	MigratoryDataClient.d4.du >= MigratoryDataClient.dw && MigratoryDataClient.a4 === null && MigratoryDataClient.af !== MigratoryDataClient.al && MigratoryDataClient.d9()
};
MigratoryDataClient.cm = function(a, b, c) {
	this.d4 = {};
	this.d4.d5 = "XDR_HTML5";
	MigratoryDataClient.du = 0;
	b = document.getElementById("MigratoryDataClient1");
	if (b === null) {
		b = document.createElement("iframe");
		b.id = "MigratoryDataClient1";
		b.style.display = "none";
		document.body.appendChild(b)
	}
	var d = (new Date).getTime();
	b.src = a + "_" + c + d
};
MigratoryDataClient.dx = function(a) {
	if (a.data.indexOf(MigratoryDataClient.z.dy) !== -1) {
		MigratoryDataClient.dv(a.data);
		MigratoryDataClient.du += a.data.length;
		MigratoryDataClient.du >= MigratoryDataClient.dw && MigratoryDataClient.a4 === null && MigratoryDataClient.af !== MigratoryDataClient.al && MigratoryDataClient.d9()
	}
};
MigratoryDataClient.ch = function(a, b, c) {
	window.frames["MigratoryDataClient2" + b].dd("window.parent.MigratoryDataClient.d4 = new XDomainRequest();");
	this.d4.da = 0;
	this.d4.d5 = "XDR_STREAM";
	this.d4.onload = function() {
		MigratoryDataClient.dz()
	};
	this.d4.onprogress = function() {
		MigratoryDataClient.dz()
	};
	this.d4.onerror = function() {};
	this.d4.ontimeout = function() {};
	try {
		this.d4.open("POST", a);
		this.d4.send(c)
	} catch (d) {}
};
MigratoryDataClient.dz = function() {
	var a = this.d4;
	if (a.responseText) {
		for (var b = a.responseText.substring(a.da), c = b.indexOf(this.z.e0); c !== -1;) {
			b = b.substring(0, c);
			this.dv(b);
			a.da += c + 1;
			b = a.responseText.substring(a.da);
			c = b.indexOf(this.z.e0)
		}
		a.da >= this.dw && this.a4 === null && this.af !== this.al && this.d9()
	}
};
MigratoryDataClient.cp = function(a, b, c) {
	var d = this.o(a);
	if (d) this.d4 = this.dh(true);
	else window.frames["MigratoryDataClient2" + b].dd("window.parent.MigratoryDataClient.d4 = new XMLHttpRequest();");
	this.d4.da = 0;
	this.d4.onreadystatechange = function() {
		MigratoryDataClient.dr()
	};
	this.d4.open("POST", a, true);
	d && this.c.indexOf("WebKit") === 0 && this.d4.setRequestHeader("Content-Type", "text/plain");
	this.d4.send(c)
};
MigratoryDataClient.dr = function() {
	var a = this.d4;
	if (!(a === null || a.readyState !== 3 && a.readyState !== 4 || a.status !== 200)) {
		if (this.c.indexOf("Opera") !== -1) {
			this.d4.d7 !== undefined && clearTimeout(this.d4.d7);
			this.d4.d7 = setTimeout(function() {
				MigratoryDataClient.d4.d7 = undefined;
				MigratoryDataClient.dr()
			}, this.e1)
		}
		if (a.responseText) {
			for (var b = a.responseText.substring(a.da), c = b.indexOf(this.z.e0); c !== -1;) {
				b = b.substring(0, c);
				this.dv(b);
				a.da += c + 1;
				b = a.responseText.substring(a.da);
				c = b.indexOf(this.z.e0)
			}
			a.da >= this.dw && this.a4 === null && this.af !== this.al && this.d9()
		}
	}
};
MigratoryDataClient.e2 = function() {
	if (typeof XMLHttpRequest === "undefined") {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.6.0")
		} catch (a) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.3.0")
		} catch (b) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP")
		} catch (c) {}
		throw "Error: The browser does not support XMLHttpRequest!";
	} else return new XMLHttpRequest
};
MigratoryDataClient.c9 = function(a, b, c) {
	var d = this.o(a);
	if (d) this.d2 = this.dh(false);
	else window.frames["MigratoryDataClient2" + b].dd("window.parent.MigratoryDataClient.d2 = (" + this.e2.toString() + ")();");
	this.d2.onreadystatechange = function() {
		MigratoryDataClient.dq()
	};
	this.d2.open("POST", a, true);
	d && this.c.indexOf("WebKit") === 0 && this.d2.setRequestHeader("Content-Type", "text/plain");
	if (this.c.indexOf("IE") === 0) {
		this.d2.setRequestHeader("Content-Type", "text/plain");
		this.d2.setRequestHeader("Connection", "close")
	}
	this.d2.send(c)
};
MigratoryDataClient.dq = function() {
	var a = this.d2;
	a === null || typeof XMLHttpRequest !== "undefined" && typeof a.aborted !== "undefined" && a.aborted !== null && a.aborted == true || a === null || a.readyState !== 4 || a.status !== 200 || a.responseText && this.dv(a.responseText)
};
MigratoryDataClient.by = function(a) {
	a = a.substring(0, a.indexOf("://")) === "http" ? "ws://" + a.substring(a.indexOf("://") + 3) + "WebSocketConnection" : "wss://" + a.substring(a.indexOf("://") + 3) + "WebSocketConnection-Secure";
	this.d4 = MigratoryDataClient.e3(a);
	this.d4.onmessage = function(b) {
		MigratoryDataClient.e4(b.data)
	};
	this.d4.onopen = function() {
		MigratoryDataClient.at()
	}
};
MigratoryDataClient.e3 = function(a) {
	if (window.WebSocket) return new WebSocket(a);
	else if (window.MozWebSocket) return new MozWebSocket(a);
	return null
};
MigratoryDataClient.ca = function(a, b, c) {
	this.d4 != null && this.d4.readyState === 1 && this.d4.send(c)
};
MigratoryDataClient.e4 = function(a) {
	var b = MigratoryDataClient.d4;
	if (!(b === null || b.readyState !== 1)) if (a) {
		b = a;
		for (var c = b.indexOf(MigratoryDataClient.z.e0); c !== -1;) {
			b = b.substring(0, c);
			MigratoryDataClient.dv(b);
			b = a.substring(c + 1);
			c = b.indexOf(MigratoryDataClient.z.e0)
		}
	}
};
MigratoryDataClient.dv = function(a) {
	for (var b = 0, c = [], d = "\u0000", e = {}, f = 0;;) {
		var g = a.indexOf(this.z.dy, b);
		if (g === -1) break;
		if (g - b > 0) {
			b = a.substring(b, g);
			d = b.charAt(0);
			e = this.e5(b);
			if (d === this.z.a0) {
				c[f] = e;
				f++
			} else this.y(d, e)
		}
		b = g + 1
	}
	f > 0 && d !== "\u0000" && this.y(d, c);
	this.bb()
};
MigratoryDataClient.e5 = function(a) {
	if (this.z.e6[a.charAt(0)] !== undefined) {
		for (var b = 1, c = {};;) {
			if (b >= a.length) break;
			var d = a.charAt(b),
				e = a.indexOf(this.z.e7, b + 1);
			if (e === -1) return c;
			if (this.z.e8[d] !== undefined) {
				b++;
				var f = "";
				switch (this.z.e9[d]) {
				case this.ad.ea:
					f = this.eb(this.z, a.substring(b, e));
					break;
				case this.ad.ec:
					f = MigratoryDataClient.ed(this.z, a.substring(b, e));
					break
				}
				b = c[d];
				if (b === undefined) c[d] = f;
				else if (c[d] instanceof Array) c[d][c[d].length] = f;
				else {
					c[d] = [];
					c[d][0] = b;
					c[d][1] = f
				}
			}
			b = e + 1
		}
		return c
	}
};
MigratoryDataClient.df = function(a, b, c) {
	var d = "";
	d += this.cd.ee;
	d += this.cd.ef;
	d += this.eg(this.cd, a);
	d += this.cd.e7;
	d += this.cd.eh;
	d += this.eg(this.cd, b);
	d += this.cd.e7;
	d += this.cd.ei;
	d += this.eg(this.cd, c);
	d += this.cd.e7;
	d += this.cd.dy;
	return d
};
MigratoryDataClient.cr = function(a, b, c, d, e, f, g, i, k, l, j, m) {
	var h = "";
	h += k ? f.ej : f.a6;
	h += f.au;
	h += this.eg(f, a);
	h += f.e7;
	if (b !== null) {
		h += f.ek;
		h += this.el(f, b);
		h += f.e7;
		if (this.c.indexOf("Opera") !== -1) {
			h += f.em;
			h += this.el(f, 1);
			h += f.e7
		}
	}
	if (this.b2[a] !== undefined) {
		h += f.en;
		h += this.el(f, this.b2[a]);
		h += f.e7
	}
	if (c !== null) {
		h += f.ei;
		h += this.eg(f, c);
		h += f.e7
	}
	if (i !== null) {
		h += f.eo;
		h += this.eg(f, i);
		h += f.e7
	}
	if (d !== null) {
		h += f.ef;
		h += this.eg(f, d);
		h += f.e7
	}
	if (e !== null) {
		h += f.ah;
		h += this.el(f, e);
		h += f.e7
	}
	if (g !== undefined) if (this.b5[a].seqid !== 7E4) {
		h += f.b3;
		h += this.el(f, this.b5[a].seqid);
		h += f.e7;
		h += f.b4;
		h += this.el(f, this.b5[a].seq + 1);
		h += f.e7
	}
	if (l !== null) {
		h += f.ep;
		h += this.eg(f, l);
		h += f.e7
	}
	if (j !== null) {
		h += f.eq;
		h += this.el(f, j);
		h += f.e7
	}
	if (m !== null) {
		h += f.er;
		h += this.eg(f, m);
		h += f.e7
	}
	h += f.dy;
	return h
};
MigratoryDataClient.ct = function(a, b, c, d) {
	var e = "";
	e += d.a8;
	e += d.au;
	e += this.eg(d, a);
	e += d.e7;
	if (this.b2[a] !== undefined) {
		e += d.en;
		e += this.el(d, this.b2[a]);
		e += d.e7
	}
	if (c !== null) {
		e += d.ah;
		e += this.el(d, c);
		e += d.e7
	}
	if (b !== null) {
		e += d.ek;
		e += this.el(d, b);
		e += d.e7
	}
	e += d.dy;
	return e
};
MigratoryDataClient.cv = function(a, b, c) {
	var d = "";
	d += b.bf;
	d += b.ah;
	d += this.el(b, a);
	d += b.e7;
	if (c !== null) {
		d += b.ek;
		d += this.el(b, c);
		d += b.e7
	}
	d += b.dy;
	return d
};
MigratoryDataClient.cd = {};
MigratoryDataClient.cd.dy = "!";
MigratoryDataClient.cd.e0 = "&";
MigratoryDataClient.cd.e7 = "$";
MigratoryDataClient.cd.es = "~";
MigratoryDataClient.cd.et = " ";
MigratoryDataClient.cd.eu = '"';
MigratoryDataClient.cd.ev = "#";
MigratoryDataClient.cd.ew = "%";
MigratoryDataClient.cd.ex = "'";
MigratoryDataClient.cd.ey = "/";
MigratoryDataClient.cd.ez = "<";
MigratoryDataClient.cd.f0 = ">";
MigratoryDataClient.cd.f1 = "[";
MigratoryDataClient.cd.f2 = "\\";
MigratoryDataClient.cd.f3 = "]";
MigratoryDataClient.cd.f4 = "^";
MigratoryDataClient.cd.f5 = "`";
MigratoryDataClient.cd.f6 = "{";
MigratoryDataClient.cd.f7 = "|";
MigratoryDataClient.cd.f8 = "}";
MigratoryDataClient.cd.f9 = "";
MigratoryDataClient.cd.a6 = "&";
MigratoryDataClient.cd.a8 = "(";
MigratoryDataClient.cd.a0 = ")";
MigratoryDataClient.cd.bf = "*";
MigratoryDataClient.cd.ee = "+";
MigratoryDataClient.cd.fa = ",";
MigratoryDataClient.cd.a2 = "0";
MigratoryDataClient.cd.ej = "2";
MigratoryDataClient.cd.au = "&";
MigratoryDataClient.cd.av = "(";
MigratoryDataClient.cd.b4 = ")";
MigratoryDataClient.cd.b3 = "*";
MigratoryDataClient.cd.ek = "+";
MigratoryDataClient.cd.ah = ",";
MigratoryDataClient.cd.ef = "-";
MigratoryDataClient.cd.ei = ".";
MigratoryDataClient.cd.eh = "?";
MigratoryDataClient.cd.aa = "0";
MigratoryDataClient.cd.fb = "1";
MigratoryDataClient.cd.b0 = "2";
MigratoryDataClient.cd.em = "3";
MigratoryDataClient.cd.fc = "4";
MigratoryDataClient.cd.fd = "5";
MigratoryDataClient.cd.eo = "7";
MigratoryDataClient.cd.b8 = "8";
MigratoryDataClient.cd.fe = "9";
MigratoryDataClient.cd.aw = "D";
MigratoryDataClient.cd.ax = "E";
MigratoryDataClient.cd.en = "G";
MigratoryDataClient.cd.ay = "J";
MigratoryDataClient.cd.ep = "K";
MigratoryDataClient.cd.eq = "L";
MigratoryDataClient.cd.er = "M";
MigratoryDataClient.cd.ff = {};
(function(a) {
	var b = a.ff;
	b["\u0000"] = "y";
	for (var c = 1; c < 8; c++) b[String.fromCharCode(c)] = String.fromCharCode(c + 39);
	b["\u0008"] = "x";
	for (c = 9; c < 21; c++) b[String.fromCharCode(c)] = String.fromCharCode(c + 39);
	b["\u0015"] = "=";
	for (c = 22; c < 32; c++) b[String.fromCharCode(c)] = String.fromCharCode(c + 41);
	b[a.dy] = "I";
	b[a.e0] = "z";
	b[a.e7] = "J";
	b[a.es] = "K";
	b[a.et] = "L";
	b[a.eu] = "M";
	b[a.ev] = "N";
	b[a.ew] = "O";
	b[a.ex] = "P";
	b[a.ey] = "_";
	b[a.ez] = "Q";
	b[a.f0] = "R";
	b[a.f1] = "S";
	b[a.f2] = "T";
	b[a.f3] = "U";
	b[a.f4] = "V";
	b[a.f5] = "W";
	b[a.f6] = "X";
	b[a.f7] = "Y";
	b[a.f8] = "Z";
	b[a.f9] = "v"
})(MigratoryDataClient.cd);
MigratoryDataClient.cd.fg = {};
(function(a) {
	for (var b in a.ff) if (a.ff.hasOwnProperty(b)) a.fg[a.ff[b]] = b
})(MigratoryDataClient.cd);
MigratoryDataClient.z = {};
MigratoryDataClient.z.dy = "";
MigratoryDataClient.z.e0 = "\u0019";
MigratoryDataClient.z.e7 = "\u001e";
MigratoryDataClient.z.es = "\u001f";
MigratoryDataClient.z.fh = "\u0000";
MigratoryDataClient.z.fi = "\n";
MigratoryDataClient.z.fj = "\r";
MigratoryDataClient.z.eu = '"';
MigratoryDataClient.z.f2 = "\\";
MigratoryDataClient.z.a6 = "\u0001";
MigratoryDataClient.z.a8 = "\u0002";
MigratoryDataClient.z.a0 = "\u0003";
MigratoryDataClient.z.bf = "\u0004";
MigratoryDataClient.z.ee = "\u0005";
MigratoryDataClient.z.fa = "\u0006";
MigratoryDataClient.z.a2 = "\t";
MigratoryDataClient.z.ej = "\u000c";
MigratoryDataClient.z.au = "\u0001";
MigratoryDataClient.z.av = "\u0002";
MigratoryDataClient.z.b4 = "\u0003";
MigratoryDataClient.z.b3 = "\u0004";
MigratoryDataClient.z.ek = "\u0005";
MigratoryDataClient.z.ah = "\u0006";
MigratoryDataClient.z.ef = "\u0007";
MigratoryDataClient.z.ei = "\u0008";
MigratoryDataClient.z.eh = "\t";
MigratoryDataClient.z.aa = "\u000b";
MigratoryDataClient.z.fb = "\u000c";
MigratoryDataClient.z.b0 = "\u000e";
MigratoryDataClient.z.em = "\u000f";
MigratoryDataClient.z.fc = "\u0010";
MigratoryDataClient.z.fd = "\u0011";
MigratoryDataClient.z.eo = "\u0013";
MigratoryDataClient.z.b8 = "\u0014";
MigratoryDataClient.z.fe = "\u0015";
MigratoryDataClient.z.aw = "\u001b";
MigratoryDataClient.z.ax = "\u001c";
MigratoryDataClient.z.en = "\u001e";
MigratoryDataClient.z.ay = "!";
MigratoryDataClient.z.ep = "#";
MigratoryDataClient.z.eq = "$";
MigratoryDataClient.z.er = "%";
MigratoryDataClient.z.ff = {};
(function(a) {
	var b = a.ff;
	b[a.dy] = "\u0001";
	b[a.e7] = "\u0002";
	b[a.es] = "\u0003";
	b[a.fh] = "\u0004";
	b[a.fi] = "\u0005";
	b[a.fj] = "\u0006";
	b[a.eu] = "\u0007";
	b[a.f2] = "\u0008";
	b[MigratoryDataClient.cd.dy] = "\t";
	b[a.e0] = "\u000b"
})(MigratoryDataClient.z);
MigratoryDataClient.z.fg = {};
(function(a) {
	for (var b in a.ff) if (a.ff.hasOwnProperty(b)) a.fg[a.ff[b]] = b
})(MigratoryDataClient.z);
MigratoryDataClient.z.e6 = {};
(function(a) {
	a.e6[a.a6] = true;
	a.e6[a.a8] = true;
	a.e6[a.a0] = true;
	a.e6[a.bf] = true;
	a.e6[a.ee] = true;
	a.e6[a.fa] = true;
	a.e6[a.a2] = true;
	a.e6[a.ej] = true
})(MigratoryDataClient.z);
MigratoryDataClient.z.e8 = {};
(function(a) {
	a.e8[a.au] = true;
	a.e8[a.av] = true;
	a.e8[a.b4] = true;
	a.e8[a.b3] = true;
	a.e8[a.ek] = true;
	a.e8[a.ah] = true;
	a.e8[a.ef] = true;
	a.e8[a.ei] = true;
	a.e8[a.eh] = true;
	a.e8[a.aa] = true;
	a.e8[a.fb] = true;
	a.e8[a.b0] = true;
	a.e8[a.em] = true;
	a.e8[a.fc] = true;
	a.e8[a.fd] = true;
	a.e8[a.eo] = true;
	a.e8[a.b8] = true;
	a.e8[a.fe] = true;
	a.e8[a.aw] = true;
	a.e8[a.ax] = true;
	a.e8[a.en] = true;
	a.e8[a.ay] = true;
	a.e8[a.ep] = true;
	a.e8[a.eq] = true;
	a.e8[a.er] = true
})(MigratoryDataClient.z);
MigratoryDataClient.ad = {};
MigratoryDataClient.ad.fk = 1;
MigratoryDataClient.ad.fl = 2;
MigratoryDataClient.ad.ec = 3;
MigratoryDataClient.ad.ea = 4;
MigratoryDataClient.ad.fm = {};
(function(a) {
	var b = a.fm;
	b.au = a.ec;
	b.av = a.ec;
	b.fd = a.ec;
	b.b4 = a.ea;
	b.b3 = a.ea;
	b.ek = a.ea;
	b.fc = a.ec;
	b.ah = a.ea;
	b.ef = a.ec;
	b.ei = a.ec;
	b.eh = a.ec;
	b.aa = a.ea;
	b.fb = a.ec;
	b.b0 = a.ea;
	b.em = a.ea;
	b.eo = a.ec;
	b.b8 = a.ec;
	b.fe = a.ea;
	b.aw = a.ec;
	b.ax = a.ec;
	b.ay = a.ec;
	b.ep = a.ec;
	b.eq = a.ea;
	b.er = a.ec
})(MigratoryDataClient.ad);
MigratoryDataClient.z.e9 = {};
MigratoryDataClient.cd.e9 = {};
(function() {
	for (var a in MigratoryDataClient.ad.fm) if (MigratoryDataClient.ad.fm.hasOwnProperty(a)) {
		MigratoryDataClient.z.e9[MigratoryDataClient.z[a]] = MigratoryDataClient.ad.fm[a];
		MigratoryDataClient.cd.e9[MigratoryDataClient.cd[a]] = MigratoryDataClient.ad.fm[a]
	}
})();
MigratoryDataClient.ad.ae = {};
MigratoryDataClient.ad.ae[0] = "UNKNOWN_SESSION_ID";
MigratoryDataClient.eg = function(a, b) {
	for (var c = "", d = 0; d < b.length; d++) {
		var e = a.ff[b.charAt(d)];
		if (e !== undefined) {
			c += a.es;
			c += e
		} else c += b.charAt(d)
	}
	return c
};
MigratoryDataClient.ed = function(a, b) {
	for (var c = "", d = 0; d < b.length; d++) {
		var e = b.charAt(d);
		if (e === a.es) {
			if (d + 1 >= b.length || a.fg[b.charAt(d + 1)] === undefined) throw "Error: ed() Illegal argument '" + b + "'!";
			e = a.fg[b.charAt(d + 1)];
			d++
		}
		c += e
	}
	return c
};
MigratoryDataClient.el = function(a, b) {
	if ((b & 4294967168) === 0) {
		var c = String.fromCharCode(b),
			d = a.ff[c];
		return d === undefined ? c : a.es + d
	}
	var e;
	e = (b & 4278190080) !== 0 ? 24 : (b & 16711680) !== 0 ? 16 : 8;
	c = [];
	for (d = 0; d < 10; d++) c.push(0);
	for (var f = 0, g = 0; e >= 0;) {
		var i = b >> e & 255;
		g++;
		c[f] |= i >> g;
		d = a.ff[String.fromCharCode(c[f])];
		if (d !== undefined) {
			c[f] = a.es.charCodeAt(0);
			c[f + 1] = d.charCodeAt(0);
			f++
		}
		f++;
		c[f] |= i << 7 - g & 127;
		e -= 8
	}
	d = a.ff[String.fromCharCode(c[f])];
	if (d !== undefined) {
		c[f] = a.es.charCodeAt(0);
		c[f + 1] = d.charCodeAt(0);
		f++
	}
	f++;
	a = "";
	for (d = 0; d < f; d++) a += String.fromCharCode(c[d]);
	return a
};
MigratoryDataClient.eb = function(a, b) {
	var c = "Error: eb() Illegal argument '" + b + "'!",
		d = 0,
		e = -1,
		f = 0,
		g, i = b.length,
		k = 0;
	if (i === 1) return b.charCodeAt(0);
	else if (i === 2 && b.charAt(0) === a.es) {
		g = a.fg[b.charAt(1)];
		if (g !== undefined) return g.charCodeAt(0);
		else throw c;
	}
	for (; i > 0; i--) {
		g = b.charAt(k);
		k++;
		if (g === a.es) {
			if (i - 1 < 0) throw c;
			i--;
			g = b.charAt(k);
			k++;
			g = a.fg[g];
			if (g === undefined) throw c;
		} else g = g;
		if (e > 0) {
			f |= g.charCodeAt(0) >> e;
			d = d << 8 | f;
			f = g.charCodeAt(0) << 8 - e
		} else f = g.charCodeAt(0) << -e;
		e = (e + 7) % 8
	}
	return d
};
MigratoryDataClient.NOTIFY_SERVER_DOWN = "NOTIFY_SERVER_DOWN";
MigratoryDataClient.NOTIFY_SERVER_UP = "NOTIFY_SERVER_UP";
MigratoryDataClient.ERROR_UNSUPPORTED_BROWSER = "ERROR_UNSUPPORTED_BROWSER";
MigratoryDataClient.NOTIFY_DATA_LOSS = "NOTIFY_DATA_LOSS";
MigratoryDataClient.NOTIFY_DATA_SYNC = "NOTIFY_DATA_SYNC";
MigratoryDataClient.ENTITLEMENT_ALLOW = "ENTITLEMENT_ALLOW";
MigratoryDataClient.ENTITLEMENT_DENY = "ENTITLEMENT_DENY";
MigratoryDataClient.setServersDownBeforeNotify = function(a) {
	if (typeof a !== "number" || a < 1) throw "Error: setServersDownBeforeNotify() should have a positive number as an argument!";
	this.bq = a
};
MigratoryDataClient.setServers = function(a) {
	this.x(a, "string", 1, /^(\d+)?\s*https?:\/\/(\w|-)+(\.(\w|-)+)*(:\d+)?$/i, "The list argument should contain full URLs, optionally preceded by a priority.");
	for (var b = [], c = 0, d = 0; d < a.length; d++) {
		var e = /https?:\/\/(\w|-)+(\.(\w|-)+)*(:\d+)?$/i.exec(a[d])[0],
			f = /^\d+/.exec(a[d]);
		if (f === null) f = 100;
		else {
			f = parseInt(f[0]);
			if (f > 100) throw "Error: connect() The priority value needs to be an integer between 0 and 100!";
		}
		this.c4 || this.c5(e);
		b.push({
			m: e,
			dc: f
		});
		c += f
	}
	this.bp = b;
	this.am.an = [];
	for (d = 0; d < a.length; d++) {
		this.am.an[d] = {};
		this.am.an[d].ap = 0;
		this.am.an[d].bk = 0;
		this.am.an[d].as = 0;
		this.am.an[d].bd = 0;
		this.am.an[d].b7 = 0;
		this.am.an[d].ae = {}
	}
	if (MigratoryDataClient.br) {
		a = {};
		a.a5 = this.bl;
		this.bi(a)
	}
};
MigratoryDataClient.getSubjects = function() {
	return this.t(this.bt)
};
MigratoryDataClient.setMessageHandler = function(a) {
	if (typeof a !== "function") throw "Error: setMessageHandler() should have a function as an argument!";
	this.ba = a
};
MigratoryDataClient.setStatusHandler = function(a) {
	if (typeof a !== "function") throw "Error: setStatusHandler() should have a function as an argument!";
	this.d = a
};
MigratoryDataClient.setCertifiedDelivery = function(a) {
	if (this.bt.length === 0) {
		if (a == true) MigratoryDataClient.b1 = true
	} else throw "Error: setCertifiedDelivery() Unable to change the delivery type when there are running subject subscriptions!";
};
MigratoryDataClient.subscribe = function(a) {
	MigratoryDataClient.subscribeWithConflation(a, 0)
};
MigratoryDataClient.setNumberOfSubdomainLevels = function(a) {
	if (typeof a !== "number" || a < 2) throw "Error: setNumberOfSubdomainLevels() should have a positive number larger or equal to 2 as an argument!";
	if (this.bp.length > 0) throw "Error: Error: setNumberOfSubdomainLevels() Unable to set the number of subdomain levels when servers are already configured - use the api call setNumberOfSubdomainLevels() before the api call setServers()!";
	this.n = a
};
MigratoryDataClient.subscribeWithConflation = function(a, b) {
	this.x(a, "string", 1, /^\/[^\/*]+\/([^\/*]+\/)*([^\/*]+|\*)$/, "The subject is invalid");
	if (this.bp.length === 0) throw "Error: subscribe() The servers are not configured!";
	if (this.ba === null) throw "Error: subscribe() The message handler is not configured!";
	a = this.u(a, this.bt);
	if (a.length !== 0) {
		if (b !== undefined && b !== null) if (b >= 100) {
			b = Math.floor(b / 100) * 100;
			for (var c = 0; c < a.length; c++) this.b2[a[c]] = b
		}
		for (c = 0; c < a.length; c++) this.b5[a[c]] = {
			seqid: 7E4,
			seq: 0,
			recovery: false
		};
		if (MigratoryDataClient.br) this.bt = this.w(this.bt, a);
		b = {};
		b.a5 = this.a6;
		b.bt = a;
		this.bi(b)
	}
};
MigratoryDataClient.unsubscribe = function(a) {
	this.x(a, "string", 1, /^\/[^\/*]+\/([^\/*]+\/)*([^\/*]+|\*)$/, "The subject is invalid");
	a = this.v(a, this.bt);
	if (a.length !== 0) {
		var b = {};
		b.a5 = this.a8;
		b.bt = a;
		this.bi(b)
	}
};
MigratoryDataClient.disconnect = function() {
	this.b(false) && this.d8()
};
MigratoryDataClient.setEntitlementToken = function(a) {
	if (this.bt.length === 0) {
		this.c3 = a;
		this.bs = false
	} else throw "Error: setEntitlementToken() Unable to set the entitlement information when there are running subject subscriptions!";
};
MigratoryDataClient.getInfo = function() {
	s = "Date: " + (new Date).toString() + "\n";
	s += "Uptime: " + ((new Date).getTime() - this.am.fn) + " ms\n";
	s += "window.location: " + window.location + "\n";
	s += "document.domain: " + document.domain + "\n";
	s += "User-agent: " + navigator.userAgent + "\n";
	s += "Detected browser: " + this.c + "\n";
	s += "Servers: ";
	for (var a = 0; a < this.bp.length; a++) {
		if (a > 0) s += ", ";
		s += this.bp[a].dc + " " + this.bp[a].m
	}
	s += "\nSubjects: " + this.bt.toString() + "\n";
	s += "Connection status [" + (this.ao === null ? null : this.bp[this.ao].m) + "]: " + this.af + "\n";
	s += "Time from last server activity: " + (this.am.bc !== null ? (new Date).getTime() - this.am.bc : null) + " ms\n";
	s += "Servers down before notify: " + this.bq + "\n";
	s += "Consecutive server down count: " + this.aj + " times\n";
	for (a = 0; a < this.am.an.length; a++) {
		s += "\nServer up [" + this.bp[a].m + "]: " + this.am.an[a].ap + " times\n";
		s += "Server down [" + this.bp[a].m + "]: " + this.am.an[a].bk + " times\n";
		s += "Server connection recycled [" + this.bp[a].m + "]: " + this.am.an[a].as + " times\n";
		s += "Received server events [" + this.bp[a].m + "]: " + this.am.an[a].bd + "\n";
		s += "Received messages [" + this.bp[a].m + "]: " + this.am.an[a].b7 + "\n";
		for (var b in this.am.an[a].ae) if (this.am.an[a].ae.hasOwnProperty(b)) s += "Error [" + this.bp[a].m + "] x" + this.am.an[a].ae[b] + " times : " + b + "\n"
	}
	return s
};
MigratoryDataClient.c4 = false;
MigratoryDataClient.c7 = false;
MigratoryDataClient.cb = false;
MigratoryDataClient.bh = 9E5;
MigratoryDataClient.bj = 3E4 + Math.floor(Math.random() * 1E4);
MigratoryDataClient.c1 = 1E4;
MigratoryDataClient.e1 = 100;
MigratoryDataClient.dw = 524288;
MigratoryDataClient.bq = 1;
MigratoryDataClient.n = 0;
MigratoryDataClient.b1 = false;
MigratoryDataClient.bs = false;
MigratoryDataClient.c3 = "";
MigratoryDataClient.a6 = "SUBSCRIBE";
MigratoryDataClient.a8 = "UNSUBSCRIBE";
MigratoryDataClient.bf = "PING";
MigratoryDataClient.bl = "CONNECT";
MigratoryDataClient.fo = 0;
MigratoryDataClient.ci = 1;
MigratoryDataClient.cn = 2;
MigratoryDataClient.c8 = 3;
MigratoryDataClient.fp = 4;
MigratoryDataClient.co = 5;
MigratoryDataClient.fq = 6;
MigratoryDataClient.fr = 7;
MigratoryDataClient.bx = 8;
MigratoryDataClient.cg = 9;
MigratoryDataClient.ce = 10;
MigratoryDataClient.ag = "SERVER_UP";
MigratoryDataClient.bn = "SERVER_DOWN";
MigratoryDataClient.al = "SERVER_RECYCLE";
MigratoryDataClient.az = "1";
MigratoryDataClient.fs = "2";
MigratoryDataClient.ft = "3";
MigratoryDataClient.cq = 1;
MigratoryDataClient.c0 = "ERROR_TIMEOUT";
MigratoryDataClient.fu = "ERROR_HTTP";
MigratoryDataClient.ac = "ERROR_SERVER";
MigratoryDataClient.c = MigratoryDataClient.a();
MigratoryDataClient.ck = null;
MigratoryDataClient.bp = [];
MigratoryDataClient.ba = null;
MigratoryDataClient.d = null;
MigratoryDataClient.b9 = [];
MigratoryDataClient.d0 = false;
MigratoryDataClient.j = [];
MigratoryDataClient.h = false;
MigratoryDataClient.ao = null;
MigratoryDataClient.af = null;
MigratoryDataClient.bt = [];
MigratoryDataClient.b2 = {};
MigratoryDataClient.b5 = {};
MigratoryDataClient.ai = null;
MigratoryDataClient.d4 = null;
MigratoryDataClient.bg = (new Date).getTime();
MigratoryDataClient.be = null;
MigratoryDataClient.bo = [];
MigratoryDataClient.aj = 0;
MigratoryDataClient.aq = false;
MigratoryDataClient.cw = [];
MigratoryDataClient.a4 = null;
MigratoryDataClient.d2 = null;
MigratoryDataClient.bz = null;
MigratoryDataClient.am = {};
MigratoryDataClient.am.fn = (new Date).getTime();
MigratoryDataClient.am.bc = null;
MigratoryDataClient.am.an = [];
MigratoryDataClient.br = false;
MigratoryDataClient.cf = false;
if (window.WebSocket) MigratoryDataClient.br = true;
else if (window.MozWebSocket) MigratoryDataClient.br = true;
if (typeof MigratoryDataClient_Disable_WebSocket_Transport !== "undefined" && MigratoryDataClient_Disable_WebSocket_Transport == true) MigratoryDataClient.br = false;
if (MigratoryDataClient.br == false) if (window.XDomainRequest) {
	var xdrTest = new XDomainRequest;
	try {
		xdrTest.open("GET", window.location.protocol + "//127.0.0.1");
		xdrTest.send();
		MigratoryDataClient.cf = true;
		xdrTest.abort()
	} catch (e$$6) {
		xdrTest.abort();
		MigratoryDataClient.cf = false
	}
} else MigratoryDataClient.cf = false;
MigratoryDataClient.c === "IE" ? window.attachEvent("onunload", function() {
	MigratoryDataClient.d8()
}) : window.addEventListener("unload", function() {
	MigratoryDataClient.d8()
}, false);
MigratoryDataClient.e();
if (MigratoryDataClient.c === "WebKit iPhone") MigratoryDataClient.dw = 65536;
else if (MigratoryDataClient.c === "Opera Mobile") {
	MigratoryDataClient.dw = 32768;
	MigratoryDataClient.e1 = 500
}
if (MigratoryDataClient.br == true) {
	MigratoryDataClient.c4 = true;
	MigratoryDataClient.c7 = true;
	MigratoryDataClient.cb = true
} else if (MigratoryDataClient.cf && window.postMessage) {
	MigratoryDataClient.c4 = true;
	MigratoryDataClient.c7 = true;
	MigratoryDataClient.cb = true;
	window.attachEvent("onmessage", MigratoryDataClient.dx)
} else if (this.XMLHttpRequest && (new XMLHttpRequest).withCredentials !== undefined) {
	MigratoryDataClient.c4 = true;
	MigratoryDataClient.c7 = true
} else if (this.swfobject && swfobject.hasFlashPlayerVersion("9") && (typeof MigratoryDataClient_Allow_Flash_Transport === "undefined" || MigratoryDataClient_Allow_Flash_Transport == true)) {
	MigratoryDataClient.c4 = true;
	MigratoryDataClient.i(function() {
		MigratoryDataClient.ds()
	})
}
if (!MigratoryDataClient.c4 || MigratoryDataClient.c7) MigratoryDataClient.i(function() {
	MigratoryDataClient.d1()
});