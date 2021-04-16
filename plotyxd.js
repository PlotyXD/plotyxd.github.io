﻿var cr = {};
cr.plugins_ = {};
cr.behaviors = {};
if (typeof Object.getPrototypeOf !== "function")
{
	if (typeof "test".__proto__ === "object")
	{
		Object.getPrototypeOf = function(object) {
			return object.__proto__;
		};
	}
	else
	{
		Object.getPrototypeOf = function(object) {
			return object.constructor.prototype;
		};
	}
}
(function(){
	cr.logexport = function (msg)
	{
		if (window.console && window.console.log)
			window.console.log(msg);
	};
	cr.logerror = function (msg)
	{
		if (window.console && window.console.error)
			window.console.error(msg);
	};
	cr.seal = function(x)
	{
		return x;
	};
	cr.freeze = function(x)
	{
		return x;
	};
	cr.is_undefined = function (x)
	{
		return typeof x === "undefined";
	};
	cr.is_number = function (x)
	{
		return typeof x === "number";
	};
	cr.is_string = function (x)
	{
		return typeof x === "string";
	};
	cr.isPOT = function (x)
	{
		return x > 0 && ((x - 1) & x) === 0;
	};
	cr.nextHighestPowerOfTwo = function(x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	}
	cr.abs = function (x)
	{
		return (x < 0 ? -x : x);
	};
	cr.max = function (a, b)
	{
		return (a > b ? a : b);
	};
	cr.min = function (a, b)
	{
		return (a < b ? a : b);
	};
	cr.PI = Math.PI;
	cr.round = function (x)
	{
		return (x + 0.5) | 0;
	};
	cr.floor = function (x)
	{
		if (x >= 0)
			return x | 0;
		else
			return (x | 0) - 1;		// correctly round down when negative
	};
	cr.ceil = function (x)
	{
		var f = x | 0;
		return (f === x ? f : f + 1);
	};
	function Vector2(x, y)
	{
		this.x = x;
		this.y = y;
		cr.seal(this);
	};
	Vector2.prototype.offset = function (px, py)
	{
		this.x += px;
		this.y += py;
		return this;
	};
	Vector2.prototype.mul = function (px, py)
	{
		this.x *= px;
		this.y *= py;
		return this;
	};
	cr.vector2 = Vector2;
	cr.segments_intersect = function(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y)
	{
		var max_ax, min_ax, max_ay, min_ay, max_bx, min_bx, max_by, min_by;
		if (a1x < a2x)
		{
			min_ax = a1x;
			max_ax = a2x;
		}
		else
		{
			min_ax = a2x;
			max_ax = a1x;
		}
		if (b1x < b2x)
		{
			min_bx = b1x;
			max_bx = b2x;
		}
		else
		{
			min_bx = b2x;
			max_bx = b1x;
		}
		if (max_ax < min_bx || min_ax > max_bx)
			return false;
		if (a1y < a2y)
		{
			min_ay = a1y;
			max_ay = a2y;
		}
		else
		{
			min_ay = a2y;
			max_ay = a1y;
		}
		if (b1y < b2y)
		{
			min_by = b1y;
			max_by = b2y;
		}
		else
		{
			min_by = b2y;
			max_by = b1y;
		}
		if (max_ay < min_by || min_ay > max_by)
			return false;
		var dpx = b1x - a1x + b2x - a2x;
		var dpy = b1y - a1y + b2y - a2y;
		var qax = a2x - a1x;
		var qay = a2y - a1y;
		var qbx = b2x - b1x;
		var qby = b2y - b1y;
		var d = cr.abs(qay * qbx - qby * qax);
		var la = qbx * dpy - qby * dpx;
		if (cr.abs(la) > d)
			return false;
		var lb = qax * dpy - qay * dpx;
		return cr.abs(lb) <= d;
	};
	function Rect(left, top, right, bottom)
	{
		this.set(left, top, right, bottom);
		cr.seal(this);
	};
	Rect.prototype.set = function (left, top, right, bottom)
	{
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	};
	Rect.prototype.copy = function (r)
	{
		this.left = r.left;
		this.top = r.top;
		this.right = r.right;
		this.bottom = r.bottom;
	};
	Rect.prototype.width = function ()
	{
		return this.right - this.left;
	};
	Rect.prototype.height = function ()
	{
		return this.bottom - this.top;
	};
	Rect.prototype.offset = function (px, py)
	{
		this.left += px;
		this.top += py;
		this.right += px;
		this.bottom += py;
		return this;
	};
	Rect.prototype.normalize = function ()
	{
		var temp = 0;
		if (this.left > this.right)
		{
			temp = this.left;
			this.left = this.right;
			this.right = temp;
		}
		if (this.top > this.bottom)
		{
			temp = this.top;
			this.top = this.bottom;
			this.bottom = temp;
		}
	};
	Rect.prototype.intersects_rect = function (rc)
	{
		return !(rc.right < this.left || rc.bottom < this.top || rc.left > this.right || rc.top > this.bottom);
	};
	Rect.prototype.intersects_rect_off = function (rc, ox, oy)
	{
		return !(rc.right + ox < this.left || rc.bottom + oy < this.top || rc.left + ox > this.right || rc.top + oy > this.bottom);
	};
	Rect.prototype.contains_pt = function (x, y)
	{
		return (x >= this.left && x <= this.right) && (y >= this.top && y <= this.bottom);
	};
	Rect.prototype.equals = function (r)
	{
		return this.left === r.left && this.top === r.top && this.right === r.right && this.bottom === r.bottom;
	};
	cr.rect = Rect;
	function Quad()
	{
		this.tlx = 0;
		this.tly = 0;
		this.trx = 0;
		this.try_ = 0;	// is a keyword otherwise!
		this.brx = 0;
		this.bry = 0;
		this.blx = 0;
		this.bly = 0;
		cr.seal(this);
	};
	Quad.prototype.set_from_rect = function (rc)
	{
		this.tlx = rc.left;
		this.tly = rc.top;
		this.trx = rc.right;
		this.try_ = rc.top;
		this.brx = rc.right;
		this.bry = rc.bottom;
		this.blx = rc.left;
		this.bly = rc.bottom;
	};
	Quad.prototype.set_from_rotated_rect = function (rc, a)
	{
		if (a === 0)
		{
			this.set_from_rect(rc);
		}
		else
		{
			var sin_a = Math.sin(a);
			var cos_a = Math.cos(a);
			var left_sin_a = rc.left * sin_a;
			var top_sin_a = rc.top * sin_a;
			var right_sin_a = rc.right * sin_a;
			var bottom_sin_a = rc.bottom * sin_a;
			var left_cos_a = rc.left * cos_a;
			var top_cos_a = rc.top * cos_a;
			var right_cos_a = rc.right * cos_a;
			var bottom_cos_a = rc.bottom * cos_a;
			this.tlx = left_cos_a - top_sin_a;
			this.tly = top_cos_a + left_sin_a;
			this.trx = right_cos_a - top_sin_a;
			this.try_ = top_cos_a + right_sin_a;
			this.brx = right_cos_a - bottom_sin_a;
			this.bry = bottom_cos_a + right_sin_a;
			this.blx = left_cos_a - bottom_sin_a;
			this.bly = bottom_cos_a + left_sin_a;
		}
	};
	Quad.prototype.offset = function (px, py)
	{
		this.tlx += px;
		this.tly += py;
		this.trx += px;
		this.try_ += py;
		this.brx += px;
		this.bry += py;
		this.blx += px;
		this.bly += py;
		return this;
	};
	var minresult = 0;
	var maxresult = 0;
	function minmax4(a, b, c, d)
	{
		if (a < b)
		{
			if (c < d)
			{
				if (a < c)
					minresult = a;
				else
					minresult = c;
				if (b > d)
					maxresult = b;
				else
					maxresult = d;
			}
			else
			{
				if (a < d)
					minresult = a;
				else
					minresult = d;
				if (b > c)
					maxresult = b;
				else
					maxresult = c;
			}
		}
		else
		{
			if (c < d)
			{
				if (b < c)
					minresult = b;
				else
					minresult = c;
				if (a > d)
					maxresult = a;
				else
					maxresult = d;
			}
			else
			{
				if (b < d)
					minresult = b;
				else
					minresult = d;
				if (a > c)
					maxresult = a;
				else
					maxresult = c;
			}
		}
	};
	Quad.prototype.bounding_box = function (rc)
	{
		minmax4(this.tlx, this.trx, this.brx, this.blx);
		rc.left = minresult;
		rc.right = maxresult;
		minmax4(this.tly, this.try_, this.bry, this.bly);
		rc.top = minresult;
		rc.bottom = maxresult;
	};
	Quad.prototype.contains_pt = function (x, y)
	{
		var tlx = this.tlx;
		var tly = this.tly;
		var v0x = this.trx - tlx;
		var v0y = this.try_ - tly;
		var v1x = this.brx - tlx;
		var v1y = this.bry - tly;
		var v2x = x - tlx;
		var v2y = y - tly;
		var dot00 = v0x * v0x + v0y * v0y
		var dot01 = v0x * v1x + v0y * v1y
		var dot02 = v0x * v2x + v0y * v2y
		var dot11 = v1x * v1x + v1y * v1y
		var dot12 = v1x * v2x + v1y * v2y
		var invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
		var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		if ((u >= 0.0) && (v > 0.0) && (u + v < 1))
			return true;
		v0x = this.blx - tlx;
		v0y = this.bly - tly;
		var dot00 = v0x * v0x + v0y * v0y
		var dot01 = v0x * v1x + v0y * v1y
		var dot02 = v0x * v2x + v0y * v2y
		invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
		u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		return (u >= 0.0) && (v > 0.0) && (u + v < 1);
	};
	Quad.prototype.at = function (i, xory)
	{
		if (xory)
		{
			switch (i)
			{
				case 0: return this.tlx;
				case 1: return this.trx;
				case 2: return this.brx;
				case 3: return this.blx;
				case 4: return this.tlx;
				default: return this.tlx;
			}
		}
		else
		{
			switch (i)
			{
				case 0: return this.tly;
				case 1: return this.try_;
				case 2: return this.bry;
				case 3: return this.bly;
				case 4: return this.tly;
				default: return this.tly;
			}
		}
	};
	Quad.prototype.midX = function ()
	{
		return (this.tlx + this.trx  + this.brx + this.blx) / 4;
	};
	Quad.prototype.midY = function ()
	{
		return (this.tly + this.try_ + this.bry + this.bly) / 4;
	};
	Quad.prototype.intersects_segment = function (x1, y1, x2, y2)
	{
		if (this.contains_pt(x1, y1) || this.contains_pt(x2, y2))
			return true;
		var a1x, a1y, a2x, a2y;
		var i;
		for (i = 0; i < 4; i++)
		{
			a1x = this.at(i, true);
			a1y = this.at(i, false);
			a2x = this.at(i + 1, true);
			a2y = this.at(i + 1, false);
			if (cr.segments_intersect(x1, y1, x2, y2, a1x, a1y, a2x, a2y))
				return true;
		}
		return false;
	};
	Quad.prototype.intersects_quad = function (rhs)
	{
		var midx = rhs.midX();
		var midy = rhs.midY();
		if (this.contains_pt(midx, midy))
			return true;
		midx = this.midX();
		midy = this.midY();
		if (rhs.contains_pt(midx, midy))
			return true;
		var a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
		var i, j;
		for (i = 0; i < 4; i++)
		{
			for (j = 0; j < 4; j++)
			{
				a1x = this.at(i, true);
				a1y = this.at(i, false);
				a2x = this.at(i + 1, true);
				a2y = this.at(i + 1, false);
				b1x = rhs.at(j, true);
				b1y = rhs.at(j, false);
				b2x = rhs.at(j + 1, true);
				b2y = rhs.at(j + 1, false);
				if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
					return true;
			}
		}
		return false;
	};
	cr.quad = Quad;
	cr.RGB = function (red, green, blue)
	{
		return Math.max(Math.min(red, 255), 0)
			 | (Math.max(Math.min(green, 255), 0) << 8)
			 | (Math.max(Math.min(blue, 255), 0) << 16);
	};
	cr.GetRValue = function (rgb)
	{
		return rgb & 0xFF;
	};
	cr.GetGValue = function (rgb)
	{
		return (rgb & 0xFF00) >> 8;
	};
	cr.GetBValue = function (rgb)
	{
		return (rgb & 0xFF0000) >> 16;
	};
	cr.shallowCopy = function (a, b, allowOverwrite)
	{
		var attr;
		for (attr in b)
		{
			if (b.hasOwnProperty(attr))
			{
;
				a[attr] = b[attr];
			}
		}
		return a;
	};
	cr.arrayRemove = function (arr, index)
	{
		var i, len;
		index = cr.floor(index);
		if (index < 0 || index >= arr.length)
			return;							// index out of bounds
		for (i = index, len = arr.length - 1; i < len; i++)
			arr[i] = arr[i + 1];
		cr.truncateArray(arr, len);
	};
	cr.truncateArray = function (arr, index)
	{
		arr.length = index;
	};
	cr.clearArray = function (arr)
	{
		cr.truncateArray(arr, 0);
	};
	cr.shallowAssignArray = function (dest, src)
	{
		cr.clearArray(dest);
		var i, len;
		for (i = 0, len = src.length; i < len; ++i)
			dest[i] = src[i];
	};
	cr.appendArray = function (a, b)
	{
		a.push.apply(a, b);
	};
	cr.fastIndexOf = function (arr, item)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			if (arr[i] === item)
				return i;
		}
		return -1;
	};
	cr.arrayFindRemove = function (arr, item)
	{
		var index = cr.fastIndexOf(arr, item);
		if (index !== -1)
			cr.arrayRemove(arr, index);
	};
	cr.clamp = function(x, a, b)
	{
		if (x < a)
			return a;
		else if (x > b)
			return b;
		else
			return x;
	};
	cr.to_radians = function(x)
	{
		return x / (180.0 / cr.PI);
	};
	cr.to_degrees = function(x)
	{
		return x * (180.0 / cr.PI);
	};
	cr.clamp_angle_degrees = function (a)
	{
		a %= 360;       // now in (-360, 360) range
		if (a < 0)
			a += 360;   // now in [0, 360) range
		return a;
	};
	cr.clamp_angle = function (a)
	{
		a %= 2 * cr.PI;       // now in (-2pi, 2pi) range
		if (a < 0)
			a += 2 * cr.PI;   // now in [0, 2pi) range
		return a;
	};
	cr.to_clamped_degrees = function (x)
	{
		return cr.clamp_angle_degrees(cr.to_degrees(x));
	};
	cr.to_clamped_radians = function (x)
	{
		return cr.clamp_angle(cr.to_radians(x));
	};
	cr.angleTo = function(x1, y1, x2, y2)
	{
		var dx = x2 - x1;
        var dy = y2 - y1;
		return Math.atan2(dy, dx);
	};
	cr.angleDiff = function (a1, a2)
	{
		if (a1 === a2)
			return 0;
		var s1 = Math.sin(a1);
		var c1 = Math.cos(a1);
		var s2 = Math.sin(a2);
		var c2 = Math.cos(a2);
		var n = s1 * s2 + c1 * c2;
		if (n >= 1)
			return 0;
		if (n <= -1)
			return cr.PI;
		return Math.acos(n);
	};
	cr.angleRotate = function (start, end, step)
	{
		var ss = Math.sin(start);
		var cs = Math.cos(start);
		var se = Math.sin(end);
		var ce = Math.cos(end);
		if (Math.acos(ss * se + cs * ce) > step)
		{
			if (cs * se - ss * ce > 0)
				return cr.clamp_angle(start + step);
			else
				return cr.clamp_angle(start - step);
		}
		else
			return cr.clamp_angle(end);
	};
	cr.angleClockwise = function (a1, a2)
	{
		var s1 = Math.sin(a1);
		var c1 = Math.cos(a1);
		var s2 = Math.sin(a2);
		var c2 = Math.cos(a2);
		return c1 * s2 - s1 * c2 <= 0;
	};
	cr.rotatePtAround = function (px, py, a, ox, oy, getx)
	{
		if (a === 0)
			return getx ? px : py;
		var sin_a = Math.sin(a);
		var cos_a = Math.cos(a);
		px -= ox;
		py -= oy;
		var left_sin_a = px * sin_a;
		var top_sin_a = py * sin_a;
		var left_cos_a = px * cos_a;
		var top_cos_a = py * cos_a;
		px = left_cos_a - top_sin_a;
		py = top_cos_a + left_sin_a;
		px += ox;
		py += oy;
		return getx ? px : py;
	}
	cr.distanceTo = function(x1, y1, x2, y2)
	{
		var dx = x2 - x1;
        var dy = y2 - y1;
		return Math.sqrt(dx*dx + dy*dy);
	};
	cr.xor = function (x, y)
	{
		return !x !== !y;
	};
	cr.lerp = function (a, b, x)
	{
		return a + (b - a) * x;
	};
	cr.unlerp = function (a, b, c)
	{
		if (a === b)
			return 0;		// avoid divide by 0
		return (c - a) / (b - a);
	};
	cr.anglelerp = function (a, b, x)
	{
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			return a + diff * x;
		}
		else
		{
			return a - diff * x;
		}
	};
	cr.qarp = function (a, b, c, x)
	{
		return cr.lerp(cr.lerp(a, b, x), cr.lerp(b, c, x), x);
	};
	cr.cubic = function (a, b, c, d, x)
	{
		return cr.lerp(cr.qarp(a, b, c, x), cr.qarp(b, c, d, x), x);
	};
	cr.cosp = function (a, b, x)
	{
		return (a + b + (a - b) * Math.cos(x * Math.PI)) / 2;
	};
	cr.hasAnyOwnProperty = function (o)
	{
		var p;
		for (p in o)
		{
			if (o.hasOwnProperty(p))
				return true;
		}
		return false;
	};
	cr.wipe = function (obj)
	{
		var p;
		for (p in obj)
		{
			if (obj.hasOwnProperty(p))
				delete obj[p];
		}
	};
	var startup_time = +(new Date());
	cr.performance_now = function()
	{
		if (typeof window["performance"] !== "undefined")
		{
			var winperf = window["performance"];
			if (typeof winperf.now !== "undefined")
				return winperf.now();
			else if (typeof winperf["webkitNow"] !== "undefined")
				return winperf["webkitNow"]();
			else if (typeof winperf["mozNow"] !== "undefined")
				return winperf["mozNow"]();
			else if (typeof winperf["msNow"] !== "undefined")
				return winperf["msNow"]();
		}
		return Date.now() - startup_time;
	};
	var isChrome = false;
	var isSafari = false;
	var isiOS = false;
	var isEjecta = false;
	if (typeof window !== "undefined")		// not c2 editor
	{
		isChrome = /chrome/i.test(navigator.userAgent) || /chromium/i.test(navigator.userAgent);
		isSafari = !isChrome && /safari/i.test(navigator.userAgent);
		isiOS = /(iphone|ipod|ipad)/i.test(navigator.userAgent);
		isEjecta = window["c2ejecta"];
	}
	var supports_set = ((!isSafari && !isEjecta && !isiOS) && (typeof Set !== "undefined" && typeof Set.prototype["forEach"] !== "undefined"));
	function ObjectSet_()
	{
		this.s = null;
		this.items = null;			// lazy allocated (hopefully results in better GC performance)
		this.item_count = 0;
		if (supports_set)
		{
			this.s = new Set();
		}
		this.values_cache = [];
		this.cache_valid = true;
		cr.seal(this);
	};
	ObjectSet_.prototype.contains = function (x)
	{
		if (this.isEmpty())
			return false;
		if (supports_set)
			return this.s["has"](x);
		else
			return (this.items && this.items.hasOwnProperty(x));
	};
	ObjectSet_.prototype.add = function (x)
	{
		if (supports_set)
		{
			if (!this.s["has"](x))
			{
				this.s["add"](x);
				this.cache_valid = false;
			}
		}
		else
		{
			var str = x.toString();
			var items = this.items;
			if (!items)
			{
				this.items = {};
				this.items[str] = x;
				this.item_count = 1;
				this.cache_valid = false;
			}
			else if (!items.hasOwnProperty(str))
			{
				items[str] = x;
				this.item_count++;
				this.cache_valid = false;
			}
		}
	};
	ObjectSet_.prototype.remove = function (x)
	{
		if (this.isEmpty())
			return;
		if (supports_set)
		{
			if (this.s["has"](x))
			{
				this.s["delete"](x);
				this.cache_valid = false;
			}
		}
		else if (this.items)
		{
			var str = x.toString();
			var items = this.items;
			if (items.hasOwnProperty(str))
			{
				delete items[str];
				this.item_count--;
				this.cache_valid = false;
			}
		}
	};
	ObjectSet_.prototype.clear = function (/*wipe_*/)
	{
		if (this.isEmpty())
			return;
		if (supports_set)
		{
			this.s["clear"]();			// best!
		}
		else
		{
				this.items = null;		// creates garbage; will lazy allocate on next add()
			this.item_count = 0;
		}
		cr.clearArray(this.values_cache);
		this.cache_valid = true;
	};
	ObjectSet_.prototype.isEmpty = function ()
	{
		return this.count() === 0;
	};
	ObjectSet_.prototype.count = function ()
	{
		if (supports_set)
			return this.s["size"];
		else
			return this.item_count;
	};
	var current_arr = null;
	var current_index = 0;
	function set_append_to_arr(x)
	{
		current_arr[current_index++] = x;
	};
	ObjectSet_.prototype.update_cache = function ()
	{
		if (this.cache_valid)
			return;
		if (supports_set)
		{
			cr.clearArray(this.values_cache);
			current_arr = this.values_cache;
			current_index = 0;
			this.s["forEach"](set_append_to_arr);
;
			current_arr = null;
			current_index = 0;
		}
		else
		{
			var values_cache = this.values_cache;
			cr.clearArray(values_cache);
			var p, n = 0, items = this.items;
			if (items)
			{
				for (p in items)
				{
					if (items.hasOwnProperty(p))
						values_cache[n++] = items[p];
				}
			}
;
		}
		this.cache_valid = true;
	};
	ObjectSet_.prototype.valuesRef = function ()
	{
		this.update_cache();
		return this.values_cache;
	};
	cr.ObjectSet = ObjectSet_;
	var tmpSet = new cr.ObjectSet();
	cr.removeArrayDuplicates = function (arr)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			tmpSet.add(arr[i]);
		}
		cr.shallowAssignArray(arr, tmpSet.valuesRef());
		tmpSet.clear();
	};
	cr.arrayRemoveAllFromObjectSet = function (arr, remset)
	{
		if (supports_set)
			cr.arrayRemoveAll_set(arr, remset.s);
		else
			cr.arrayRemoveAll_arr(arr, remset.valuesRef());
	};
	cr.arrayRemoveAll_set = function (arr, s)
	{
		var i, j, len, item;
		for (i = 0, j = 0, len = arr.length; i < len; ++i)
		{
			item = arr[i];
			if (!s["has"](item))					// not an item to remove
				arr[j++] = item;					// keep it
		}
		cr.truncateArray(arr, j);
	};
	cr.arrayRemoveAll_arr = function (arr, rem)
	{
		var i, j, len, item;
		for (i = 0, j = 0, len = arr.length; i < len; ++i)
		{
			item = arr[i];
			if (cr.fastIndexOf(rem, item) === -1)	// not an item to remove
				arr[j++] = item;					// keep it
		}
		cr.truncateArray(arr, j);
	};
	function KahanAdder_()
	{
		this.c = 0;
        this.y = 0;
        this.t = 0;
        this.sum = 0;
		cr.seal(this);
	};
	KahanAdder_.prototype.add = function (v)
	{
		this.y = v - this.c;
	    this.t = this.sum + this.y;
	    this.c = (this.t - this.sum) - this.y;
	    this.sum = this.t;
	};
    KahanAdder_.prototype.reset = function ()
    {
        this.c = 0;
        this.y = 0;
        this.t = 0;
        this.sum = 0;
    };
	cr.KahanAdder = KahanAdder_;
	cr.regexp_escape = function(text)
	{
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	function CollisionPoly_(pts_array_)
	{
		this.pts_cache = [];
		this.bboxLeft = 0;
		this.bboxTop = 0;
		this.bboxRight = 0;
		this.bboxBottom = 0;
		this.convexpolys = null;		// for physics behavior to cache separated polys
		this.set_pts(pts_array_);
		cr.seal(this);
	};
	CollisionPoly_.prototype.set_pts = function(pts_array_)
	{
		this.pts_array = pts_array_;
		this.pts_count = pts_array_.length / 2;			// x, y, x, y... in array
		this.pts_cache.length = pts_array_.length;
		this.cache_width = -1;
		this.cache_height = -1;
		this.cache_angle = 0;
	};
	CollisionPoly_.prototype.is_empty = function()
	{
		return !this.pts_array.length;
	};
	CollisionPoly_.prototype.update_bbox = function ()
	{
		var myptscache = this.pts_cache;
		var bboxLeft_ = myptscache[0];
		var bboxRight_ = bboxLeft_;
		var bboxTop_ = myptscache[1];
		var bboxBottom_ = bboxTop_;
		var x, y, i = 1, i2, len = this.pts_count;
		for ( ; i < len; ++i)
		{
			i2 = i*2;
			x = myptscache[i2];
			y = myptscache[i2+1];
			if (x < bboxLeft_)
				bboxLeft_ = x;
			if (x > bboxRight_)
				bboxRight_ = x;
			if (y < bboxTop_)
				bboxTop_ = y;
			if (y > bboxBottom_)
				bboxBottom_ = y;
		}
		this.bboxLeft = bboxLeft_;
		this.bboxRight = bboxRight_;
		this.bboxTop = bboxTop_;
		this.bboxBottom = bboxBottom_;
	};
	CollisionPoly_.prototype.set_from_rect = function(rc, offx, offy)
	{
		this.pts_cache.length = 8;
		this.pts_count = 4;
		var myptscache = this.pts_cache;
		myptscache[0] = rc.left - offx;
		myptscache[1] = rc.top - offy;
		myptscache[2] = rc.right - offx;
		myptscache[3] = rc.top - offy;
		myptscache[4] = rc.right - offx;
		myptscache[5] = rc.bottom - offy;
		myptscache[6] = rc.left - offx;
		myptscache[7] = rc.bottom - offy;
		this.cache_width = rc.right - rc.left;
		this.cache_height = rc.bottom - rc.top;
		this.update_bbox();
	};
	CollisionPoly_.prototype.set_from_quad = function(q, offx, offy, w, h)
	{
		this.pts_cache.length = 8;
		this.pts_count = 4;
		var myptscache = this.pts_cache;
		myptscache[0] = q.tlx - offx;
		myptscache[1] = q.tly - offy;
		myptscache[2] = q.trx - offx;
		myptscache[3] = q.try_ - offy;
		myptscache[4] = q.brx - offx;
		myptscache[5] = q.bry - offy;
		myptscache[6] = q.blx - offx;
		myptscache[7] = q.bly - offy;
		this.cache_width = w;
		this.cache_height = h;
		this.update_bbox();
	};
	CollisionPoly_.prototype.set_from_poly = function (r)
	{
		this.pts_count = r.pts_count;
		cr.shallowAssignArray(this.pts_cache, r.pts_cache);
		this.bboxLeft = r.bboxLeft;
		this.bboxTop = r.bboxTop;
		this.bboxRight = r.bboxRight;
		this.bboxBottom = r.bboxBottom;
	};
	CollisionPoly_.prototype.cache_poly = function(w, h, a)
	{
		if (this.cache_width === w && this.cache_height === h && this.cache_angle === a)
			return;		// cache up-to-date
		this.cache_width = w;
		this.cache_height = h;
		this.cache_angle = a;
		var i, i2, i21, len, x, y;
		var sina = 0;
		var cosa = 1;
		var myptsarray = this.pts_array;
		var myptscache = this.pts_cache;
		if (a !== 0)
		{
			sina = Math.sin(a);
			cosa = Math.cos(a);
		}
		for (i = 0, len = this.pts_count; i < len; i++)
		{
			i2 = i*2;
			i21 = i2+1;
			x = myptsarray[i2] * w;
			y = myptsarray[i21] * h;
			myptscache[i2] = (x * cosa) - (y * sina);
			myptscache[i21] = (y * cosa) + (x * sina);
		}
		this.update_bbox();
	};
	CollisionPoly_.prototype.contains_pt = function (a2x, a2y)
	{
		var myptscache = this.pts_cache;
		if (a2x === myptscache[0] && a2y === myptscache[1])
			return true;
		var i, i2, imod, len = this.pts_count;
		var a1x = this.bboxLeft - 110;
		var a1y = this.bboxTop - 101;
		var a3x = this.bboxRight + 131
		var a3y = this.bboxBottom + 120;
		var b1x, b1y, b2x, b2y;
		var count1 = 0, count2 = 0;
		for (i = 0; i < len; i++)
		{
			i2 = i*2;
			imod = ((i+1)%len)*2;
			b1x = myptscache[i2];
			b1y = myptscache[i2+1];
			b2x = myptscache[imod];
			b2y = myptscache[imod+1];
			if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
				count1++;
			if (cr.segments_intersect(a3x, a3y, a2x, a2y, b1x, b1y, b2x, b2y))
				count2++;
		}
		return (count1 % 2 === 1) || (count2 % 2 === 1);
	};
	CollisionPoly_.prototype.intersects_poly = function (rhs, offx, offy)
	{
		var rhspts = rhs.pts_cache;
		var mypts = this.pts_cache;
		if (this.contains_pt(rhspts[0] + offx, rhspts[1] + offy))
			return true;
		if (rhs.contains_pt(mypts[0] - offx, mypts[1] - offy))
			return true;
		var i, i2, imod, leni, j, j2, jmod, lenj;
		var a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
		for (i = 0, leni = this.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			a1x = mypts[i2];
			a1y = mypts[i2+1];
			a2x = mypts[imod];
			a2y = mypts[imod+1];
			for (j = 0, lenj = rhs.pts_count; j < lenj; j++)
			{
				j2 = j*2;
				jmod = ((j+1)%lenj)*2;
				b1x = rhspts[j2] + offx;
				b1y = rhspts[j2+1] + offy;
				b2x = rhspts[jmod] + offx;
				b2y = rhspts[jmod+1] + offy;
				if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
					return true;
			}
		}
		return false;
	};
	CollisionPoly_.prototype.intersects_segment = function (offx, offy, x1, y1, x2, y2)
	{
		var mypts = this.pts_cache;
		if (this.contains_pt(x1 - offx, y1 - offy))
			return true;
		var i, leni, i2, imod;
		var a1x, a1y, a2x, a2y;
		for (i = 0, leni = this.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			a1x = mypts[i2] + offx;
			a1y = mypts[i2+1] + offy;
			a2x = mypts[imod] + offx;
			a2y = mypts[imod+1] + offy;
			if (cr.segments_intersect(x1, y1, x2, y2, a1x, a1y, a2x, a2y))
				return true;
		}
		return false;
	};
	CollisionPoly_.prototype.mirror = function (px)
	{
		var i, leni, i2;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i2 = i*2;
			this.pts_cache[i2] = px * 2 - this.pts_cache[i2];
		}
	};
	CollisionPoly_.prototype.flip = function (py)
	{
		var i, leni, i21;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i21 = i*2+1;
			this.pts_cache[i21] = py * 2 - this.pts_cache[i21];
		}
	};
	CollisionPoly_.prototype.diag = function ()
	{
		var i, leni, i2, i21, temp;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i2 = i*2;
			i21 = i2+1;
			temp = this.pts_cache[i2];
			this.pts_cache[i2] = this.pts_cache[i21];
			this.pts_cache[i21] = temp;
		}
	};
	cr.CollisionPoly = CollisionPoly_;
	function SparseGrid_(cellwidth_, cellheight_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.cells = {};
	};
	SparseGrid_.prototype.totalCellCount = 0;
	SparseGrid_.prototype.getCell = function (x_, y_, create_if_missing)
	{
		var ret;
		var col = this.cells[x_];
		if (!col)
		{
			if (create_if_missing)
			{
				ret = allocGridCell(this, x_, y_);
				this.cells[x_] = {};
				this.cells[x_][y_] = ret;
				return ret;
			}
			else
				return null;
		}
		ret = col[y_];
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocGridCell(this, x_, y_);
			this.cells[x_][y_] = ret;
			return ret;
		}
		else
			return null;
	};
	SparseGrid_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	SparseGrid_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	SparseGrid_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, cell;
		if (oldrange)
		{
			for (x = oldrange.left, lenx = oldrange.right; x <= lenx; ++x)
			{
				for (y = oldrange.top, leny = oldrange.bottom; y <= leny; ++y)
				{
					if (newrange && newrange.contains_pt(x, y))
						continue;	// is still in this cell
					cell = this.getCell(x, y, false);	// don't create if missing
					if (!cell)
						continue;	// cell does not exist yet
					cell.remove(inst);
					if (cell.isEmpty())
					{
						freeGridCell(cell);
						this.cells[x][y] = null;
					}
				}
			}
		}
		if (newrange)
		{
			for (x = newrange.left, lenx = newrange.right; x <= lenx; ++x)
			{
				for (y = newrange.top, leny = newrange.bottom; y <= leny; ++y)
				{
					if (oldrange && oldrange.contains_pt(x, y))
						continue;	// is still in this cell
					this.getCell(x, y, true).insert(inst);
				}
			}
		}
	};
	SparseGrid_.prototype.queryRange = function (rc, result)
	{
		var x, lenx, ystart, y, leny, cell;
		x = this.XToCell(rc.left);
		ystart = this.YToCell(rc.top);
		lenx = this.XToCell(rc.right);
		leny = this.YToCell(rc.bottom);
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.dump(result);
			}
		}
	};
	cr.SparseGrid = SparseGrid_;
	function RenderGrid_(cellwidth_, cellheight_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.cells = {};
	};
	RenderGrid_.prototype.totalCellCount = 0;
	RenderGrid_.prototype.getCell = function (x_, y_, create_if_missing)
	{
		var ret;
		var col = this.cells[x_];
		if (!col)
		{
			if (create_if_missing)
			{
				ret = allocRenderCell(this, x_, y_);
				this.cells[x_] = {};
				this.cells[x_][y_] = ret;
				return ret;
			}
			else
				return null;
		}
		ret = col[y_];
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocRenderCell(this, x_, y_);
			this.cells[x_][y_] = ret;
			return ret;
		}
		else
			return null;
	};
	RenderGrid_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	RenderGrid_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	RenderGrid_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, cell;
		if (oldrange)
		{
			for (x = oldrange.left, lenx = oldrange.right; x <= lenx; ++x)
			{
				for (y = oldrange.top, leny = oldrange.bottom; y <= leny; ++y)
				{
					if (newrange && newrange.contains_pt(x, y))
						continue;	// is still in this cell
					cell = this.getCell(x, y, false);	// don't create if missing
					if (!cell)
						continue;	// cell does not exist yet
					cell.remove(inst);
					if (cell.isEmpty())
					{
						freeRenderCell(cell);
						this.cells[x][y] = null;
					}
				}
			}
		}
		if (newrange)
		{
			for (x = newrange.left, lenx = newrange.right; x <= lenx; ++x)
			{
				for (y = newrange.top, leny = newrange.bottom; y <= leny; ++y)
				{
					if (oldrange && oldrange.contains_pt(x, y))
						continue;	// is still in this cell
					this.getCell(x, y, true).insert(inst);
				}
			}
		}
	};
	RenderGrid_.prototype.queryRange = function (left, top, right, bottom, result)
	{
		var x, lenx, ystart, y, leny, cell;
		x = this.XToCell(left);
		ystart = this.YToCell(top);
		lenx = this.XToCell(right);
		leny = this.YToCell(bottom);
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.dump(result);
			}
		}
	};
	RenderGrid_.prototype.markRangeChanged = function (rc)
	{
		var x, lenx, ystart, y, leny, cell;
		x = rc.left;
		ystart = rc.top;
		lenx = rc.right;
		leny = rc.bottom;
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.is_sorted = false;
			}
		}
	};
	cr.RenderGrid = RenderGrid_;
	var gridcellcache = [];
	function allocGridCell(grid_, x_, y_)
	{
		var ret;
		SparseGrid_.prototype.totalCellCount++;
		if (gridcellcache.length)
		{
			ret = gridcellcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			return ret;
		}
		else
			return new cr.GridCell(grid_, x_, y_);
	};
	function freeGridCell(c)
	{
		SparseGrid_.prototype.totalCellCount--;
		c.objects.clear();
		if (gridcellcache.length < 1000)
			gridcellcache.push(c);
	};
	function GridCell_(grid_, x_, y_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.objects = new cr.ObjectSet();
	};
	GridCell_.prototype.isEmpty = function ()
	{
		return this.objects.isEmpty();
	};
	GridCell_.prototype.insert = function (inst)
	{
		this.objects.add(inst);
	};
	GridCell_.prototype.remove = function (inst)
	{
		this.objects.remove(inst);
	};
	GridCell_.prototype.dump = function (result)
	{
		cr.appendArray(result, this.objects.valuesRef());
	};
	cr.GridCell = GridCell_;
	var rendercellcache = [];
	function allocRenderCell(grid_, x_, y_)
	{
		var ret;
		RenderGrid_.prototype.totalCellCount++;
		if (rendercellcache.length)
		{
			ret = rendercellcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			return ret;
		}
		else
			return new cr.RenderCell(grid_, x_, y_);
	};
	function freeRenderCell(c)
	{
		RenderGrid_.prototype.totalCellCount--;
		c.reset();
		if (rendercellcache.length < 1000)
			rendercellcache.push(c);
	};
	function RenderCell_(grid_, x_, y_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.objects = [];		// array which needs to be sorted by Z order
		this.is_sorted = true;	// whether array is in correct sort order or not
		this.pending_removal = new cr.ObjectSet();
		this.any_pending_removal = false;
	};
	RenderCell_.prototype.isEmpty = function ()
	{
		if (!this.objects.length)
		{
;
;
			return true;
		}
		if (this.objects.length > this.pending_removal.count())
			return false;
;
		this.flush_pending();		// takes fast path and just resets state
		return true;
	};
	RenderCell_.prototype.insert = function (inst)
	{
		if (this.pending_removal.contains(inst))
		{
			this.pending_removal.remove(inst);
			if (this.pending_removal.isEmpty())
				this.any_pending_removal = false;
			return;
		}
		if (this.objects.length)
		{
			var top = this.objects[this.objects.length - 1];
			if (top.get_zindex() > inst.get_zindex())
				this.is_sorted = false;		// 'inst' should be somewhere beneath 'top'
			this.objects.push(inst);
		}
		else
		{
			this.objects.push(inst);
			this.is_sorted = true;
		}
;
	};
	RenderCell_.prototype.remove = function (inst)
	{
		this.pending_removal.add(inst);
		this.any_pending_removal = true;
		if (this.pending_removal.count() >= 30)
			this.flush_pending();
	};
	RenderCell_.prototype.flush_pending = function ()
	{
;
		if (!this.any_pending_removal)
			return;		// not changed
		if (this.pending_removal.count() === this.objects.length)
		{
			this.reset();
			return;
		}
		cr.arrayRemoveAllFromObjectSet(this.objects, this.pending_removal);
		this.pending_removal.clear();
		this.any_pending_removal = false;
	};
	function sortByInstanceZIndex(a, b)
	{
		return a.zindex - b.zindex;
	};
	RenderCell_.prototype.ensure_sorted = function ()
	{
		if (this.is_sorted)
			return;		// already sorted
		this.objects.sort(sortByInstanceZIndex);
		this.is_sorted = true;
	};
	RenderCell_.prototype.reset = function ()
	{
		cr.clearArray(this.objects);
		this.is_sorted = true;
		this.pending_removal.clear();
		this.any_pending_removal = false;
	};
	RenderCell_.prototype.dump = function (result)
	{
		this.flush_pending();
		this.ensure_sorted();
		if (this.objects.length)
			result.push(this.objects);
	};
	cr.RenderCell = RenderCell_;
	var fxNames = [ "lighter",
					"xor",
					"copy",
					"destination-over",
					"source-in",
					"destination-in",
					"source-out",
					"destination-out",
					"source-atop",
					"destination-atop"];
	cr.effectToCompositeOp = function(effect)
	{
		if (effect <= 0 || effect >= 11)
			return "source-over";
		return fxNames[effect - 1];	// not including "none" so offset by 1
	};
	cr.setGLBlend = function(this_, effect, gl)
	{
		if (!gl)
			return;
		this_.srcBlend = gl.ONE;
		this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
		switch (effect) {
		case 1:		// lighter (additive)
			this_.srcBlend = gl.ONE;
			this_.destBlend = gl.ONE;
			break;
		case 2:		// xor
			break;	// todo
		case 3:		// copy
			this_.srcBlend = gl.ONE;
			this_.destBlend = gl.ZERO;
			break;
		case 4:		// destination-over
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.ONE;
			break;
		case 5:		// source-in
			this_.srcBlend = gl.DST_ALPHA;
			this_.destBlend = gl.ZERO;
			break;
		case 6:		// destination-in
			this_.srcBlend = gl.ZERO;
			this_.destBlend = gl.SRC_ALPHA;
			break;
		case 7:		// source-out
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.ZERO;
			break;
		case 8:		// destination-out
			this_.srcBlend = gl.ZERO;
			this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 9:		// source-atop
			this_.srcBlend = gl.DST_ALPHA;
			this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 10:	// destination-atop
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.SRC_ALPHA;
			break;
		}
	};
	cr.round6dp = function (x)
	{
		return Math.round(x * 1000000) / 1000000;
	};
	/*
	var localeCompare_options = {
		"usage": "search",
		"sensitivity": "accent"
	};
	var has_localeCompare = !!"a".localeCompare;
	var localeCompare_works1 = (has_localeCompare && "a".localeCompare("A", undefined, localeCompare_options) === 0);
	var localeCompare_works2 = (has_localeCompare && "a".localeCompare("á", undefined, localeCompare_options) !== 0);
	var supports_localeCompare = (has_localeCompare && localeCompare_works1 && localeCompare_works2);
	*/
	cr.equals_nocase = function (a, b)
	{
		if (typeof a !== "string" || typeof b !== "string")
			return false;
		if (a.length !== b.length)
			return false;
		if (a === b)
			return true;
		/*
		if (supports_localeCompare)
		{
			return (a.localeCompare(b, undefined, localeCompare_options) === 0);
		}
		else
		{
		*/
			return a.toLowerCase() === b.toLowerCase();
	};
	cr.isCanvasInputEvent = function (e)
	{
		var target = e.target;
		if (!target)
			return true;
		if (target === document || target === window)
			return true;
		if (document && document.body && target === document.body)
			return true;
		if (cr.equals_nocase(target.tagName, "canvas"))
			return true;
		return false;
	};
}());
var MatrixArray=typeof Float32Array!=="undefined"?Float32Array:Array,glMatrixArrayType=MatrixArray,vec3={},mat3={},mat4={},quat4={};vec3.create=function(a){var b=new MatrixArray(3);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2]);return b};vec3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b};vec3.add=function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c};
vec3.subtract=function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c};vec3.negate=function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b};vec3.scale=function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c};
vec3.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(g){if(g===1)return b[0]=c,b[1]=d,b[2]=e,b}else return b[0]=0,b[1]=0,b[2]=0,b;g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b};vec3.cross=function(a,b,c){c||(c=a);var d=a[0],e=a[1],a=a[2],g=b[0],f=b[1],b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c};vec3.length=function(a){var b=a[0],c=a[1],a=a[2];return Math.sqrt(b*b+c*c+a*a)};vec3.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};
vec3.direction=function(a,b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1],a=a[2]-b[2],b=Math.sqrt(d*d+e*e+a*a);if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c};vec3.lerp=function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d};vec3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};
mat3.create=function(a){var b=new MatrixArray(9);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8]);return b};mat3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b};mat3.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a};
mat3.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b};mat3.toMat4=function(a,b){b||(b=mat4.create());b[15]=1;b[14]=0;b[13]=0;b[12]=0;b[11]=0;b[10]=a[8];b[9]=a[7];b[8]=a[6];b[7]=0;b[6]=a[5];b[5]=a[4];b[4]=a[3];b[3]=0;b[2]=a[2];b[1]=a[1];b[0]=a[0];return b};
mat3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"};mat4.create=function(a){var b=new MatrixArray(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b};
mat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};mat4.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};
mat4.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b};
mat4.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],n=a[11],o=a[12],m=a[13],p=a[14],a=a[15];return o*k*h*e-j*m*h*e-o*f*l*e+g*m*l*e+j*f*p*e-g*k*p*e-o*k*d*i+j*m*d*i+o*c*l*i-b*m*l*i-j*c*p*i+b*k*p*i+o*f*d*n-g*m*d*n-o*c*h*n+b*m*h*n+g*c*p*n-b*f*p*n-j*f*d*a+g*k*d*a+j*c*h*a-b*k*h*a-g*c*l*a+b*f*l*a};
mat4.inverse=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],i=a[6],j=a[7],k=a[8],l=a[9],n=a[10],o=a[11],m=a[12],p=a[13],r=a[14],s=a[15],A=c*h-d*f,B=c*i-e*f,t=c*j-g*f,u=d*i-e*h,v=d*j-g*h,w=e*j-g*i,x=k*p-l*m,y=k*r-n*m,z=k*s-o*m,C=l*r-n*p,D=l*s-o*p,E=n*s-o*r,q=1/(A*E-B*D+t*C+u*z-v*y+w*x);b[0]=(h*E-i*D+j*C)*q;b[1]=(-d*E+e*D-g*C)*q;b[2]=(p*w-r*v+s*u)*q;b[3]=(-l*w+n*v-o*u)*q;b[4]=(-f*E+i*z-j*y)*q;b[5]=(c*E-e*z+g*y)*q;b[6]=(-m*w+r*t-s*B)*q;b[7]=(k*w-n*t+o*B)*q;b[8]=(f*D-h*z+j*x)*q;
b[9]=(-c*D+d*z-g*x)*q;b[10]=(m*v-p*t+s*A)*q;b[11]=(-k*v+l*t-o*A)*q;b[12]=(-f*C+h*y-i*x)*q;b[13]=(c*C-d*y+e*x)*q;b[14]=(-m*u+p*B-r*A)*q;b[15]=(k*u-l*B+n*A)*q;return b};mat4.toRotationMat=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat4.toMat3=function(a,b){b||(b=mat3.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b};mat4.toInverseMat3=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],i=a[8],j=a[9],k=a[10],l=k*f-h*j,n=-k*g+h*i,o=j*g-f*i,m=c*l+d*n+e*o;if(!m)return null;m=1/m;b||(b=mat3.create());b[0]=l*m;b[1]=(-k*d+e*j)*m;b[2]=(h*d-e*f)*m;b[3]=n*m;b[4]=(k*c-e*i)*m;b[5]=(-h*c+e*g)*m;b[6]=o*m;b[7]=(-j*c+d*i)*m;b[8]=(f*c-d*g)*m;return b};
mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],n=a[9],o=a[10],m=a[11],p=a[12],r=a[13],s=a[14],a=a[15],A=b[0],B=b[1],t=b[2],u=b[3],v=b[4],w=b[5],x=b[6],y=b[7],z=b[8],C=b[9],D=b[10],E=b[11],q=b[12],F=b[13],G=b[14],b=b[15];c[0]=A*d+B*h+t*l+u*p;c[1]=A*e+B*i+t*n+u*r;c[2]=A*g+B*j+t*o+u*s;c[3]=A*f+B*k+t*m+u*a;c[4]=v*d+w*h+x*l+y*p;c[5]=v*e+w*i+x*n+y*r;c[6]=v*g+w*j+x*o+y*s;c[7]=v*f+w*k+x*m+y*a;c[8]=z*d+C*h+D*l+E*p;c[9]=z*e+C*i+D*n+E*r;c[10]=z*g+C*
j+D*o+E*s;c[11]=z*f+C*k+D*m+E*a;c[12]=q*d+F*h+G*l+b*p;c[13]=q*e+F*i+G*n+b*r;c[14]=q*g+F*j+G*o+b*s;c[15]=q*f+F*k+G*m+b*a;return c};mat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c};
mat4.multiplyVec4=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c};
mat4.translate=function(a,b,c){var d=b[0],e=b[1],b=b[2],g,f,h,i,j,k,l,n,o,m,p,r;if(!c||a===c)return a[12]=a[0]*d+a[4]*e+a[8]*b+a[12],a[13]=a[1]*d+a[5]*e+a[9]*b+a[13],a[14]=a[2]*d+a[6]*e+a[10]*b+a[14],a[15]=a[3]*d+a[7]*e+a[11]*b+a[15],a;g=a[0];f=a[1];h=a[2];i=a[3];j=a[4];k=a[5];l=a[6];n=a[7];o=a[8];m=a[9];p=a[10];r=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=i;c[4]=j;c[5]=k;c[6]=l;c[7]=n;c[8]=o;c[9]=m;c[10]=p;c[11]=r;c[12]=g*d+j*e+o*b+a[12];c[13]=f*d+k*e+m*b+a[13];c[14]=h*d+l*e+p*b+a[14];c[15]=i*d+n*e+r*b+a[15];
return c};mat4.scale=function(a,b,c){var d=b[0],e=b[1],b=b[2];if(!c||a===c)return a[0]*=d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=b,a[9]*=b,a[10]*=b,a[11]*=b,a;c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c};
mat4.rotate=function(a,b,c,d){var e=c[0],g=c[1],c=c[2],f=Math.sqrt(e*e+g*g+c*c),h,i,j,k,l,n,o,m,p,r,s,A,B,t,u,v,w,x,y,z;if(!f)return null;f!==1&&(f=1/f,e*=f,g*=f,c*=f);h=Math.sin(b);i=Math.cos(b);j=1-i;b=a[0];f=a[1];k=a[2];l=a[3];n=a[4];o=a[5];m=a[6];p=a[7];r=a[8];s=a[9];A=a[10];B=a[11];t=e*e*j+i;u=g*e*j+c*h;v=c*e*j-g*h;w=e*g*j-c*h;x=g*g*j+i;y=c*g*j+e*h;z=e*c*j+g*h;e=g*c*j-e*h;g=c*c*j+i;d?a!==d&&(d[12]=a[12],d[13]=a[13],d[14]=a[14],d[15]=a[15]):d=a;d[0]=b*t+n*u+r*v;d[1]=f*t+o*u+s*v;d[2]=k*t+m*u+A*
v;d[3]=l*t+p*u+B*v;d[4]=b*w+n*x+r*y;d[5]=f*w+o*x+s*y;d[6]=k*w+m*x+A*y;d[7]=l*w+p*x+B*y;d[8]=b*z+n*e+r*g;d[9]=f*z+o*e+s*g;d[10]=k*z+m*e+A*g;d[11]=l*z+p*e+B*g;return d};mat4.rotateX=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[4],g=a[5],f=a[6],h=a[7],i=a[8],j=a[9],k=a[10],l=a[11];c?a!==c&&(c[0]=a[0],c[1]=a[1],c[2]=a[2],c[3]=a[3],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[4]=e*b+i*d;c[5]=g*b+j*d;c[6]=f*b+k*d;c[7]=h*b+l*d;c[8]=e*-d+i*b;c[9]=g*-d+j*b;c[10]=f*-d+k*b;c[11]=h*-d+l*b;return c};
mat4.rotateY=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],i=a[8],j=a[9],k=a[10],l=a[11];c?a!==c&&(c[4]=a[4],c[5]=a[5],c[6]=a[6],c[7]=a[7],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+i*-d;c[1]=g*b+j*-d;c[2]=f*b+k*-d;c[3]=h*b+l*-d;c[8]=e*d+i*b;c[9]=g*d+j*b;c[10]=f*d+k*b;c[11]=h*d+l*b;return c};
mat4.rotateZ=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],i=a[4],j=a[5],k=a[6],l=a[7];c?a!==c&&(c[8]=a[8],c[9]=a[9],c[10]=a[10],c[11]=a[11],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+i*d;c[1]=g*b+j*d;c[2]=f*b+k*d;c[3]=h*b+l*d;c[4]=e*-d+i*b;c[5]=g*-d+j*b;c[6]=f*-d+k*b;c[7]=h*-d+l*b;return c};
mat4.frustum=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=e*2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=e*2/i;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/i;f[10]=-(g+e)/j;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(g*e*2)/j;f[15]=0;return f};mat4.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b*=a;return mat4.frustum(-b,b,-a,a,c,d,e)};
mat4.ortho=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/i;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/j;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/i;f[14]=-(g+e)/j;f[15]=1;return f};
mat4.lookAt=function(a,b,c,d){d||(d=mat4.create());var e,g,f,h,i,j,k,l,n=a[0],o=a[1],a=a[2];g=c[0];f=c[1];e=c[2];c=b[1];j=b[2];if(n===b[0]&&o===c&&a===j)return mat4.identity(d);c=n-b[0];j=o-b[1];k=a-b[2];l=1/Math.sqrt(c*c+j*j+k*k);c*=l;j*=l;k*=l;b=f*k-e*j;e=e*c-g*k;g=g*j-f*c;(l=Math.sqrt(b*b+e*e+g*g))?(l=1/l,b*=l,e*=l,g*=l):g=e=b=0;f=j*g-k*e;h=k*b-c*g;i=c*e-j*b;(l=Math.sqrt(f*f+h*h+i*i))?(l=1/l,f*=l,h*=l,i*=l):i=h=f=0;d[0]=b;d[1]=f;d[2]=c;d[3]=0;d[4]=e;d[5]=h;d[6]=j;d[7]=0;d[8]=g;d[9]=i;d[10]=k;d[11]=
0;d[12]=-(b*n+e*o+g*a);d[13]=-(f*n+h*o+i*a);d[14]=-(c*n+j*o+k*a);d[15]=1;return d};mat4.fromRotationTranslation=function(a,b,c){c||(c=mat4.create());var d=a[0],e=a[1],g=a[2],f=a[3],h=d+d,i=e+e,j=g+g,a=d*h,k=d*i;d*=j;var l=e*i;e*=j;g*=j;h*=f;i*=f;f*=j;c[0]=1-(l+g);c[1]=k+f;c[2]=d-i;c[3]=0;c[4]=k-f;c[5]=1-(a+g);c[6]=e+h;c[7]=0;c[8]=d+i;c[9]=e-h;c[10]=1-(a+l);c[11]=0;c[12]=b[0];c[13]=b[1];c[14]=b[2];c[15]=1;return c};
mat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"};quat4.create=function(a){var b=new MatrixArray(4);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]);return b};quat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b};
quat4.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a===b)return a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a;b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};quat4.inverse=function(a,b){if(!b||a===b)return a[0]*=-1,a[1]*=-1,a[2]*=-1,a;b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};quat4.length=function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};
quat4.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(f===0)return b[0]=0,b[1]=0,b[2]=0,b[3]=0,b;f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};quat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=b[0],h=b[1],i=b[2],b=b[3];c[0]=d*b+a*f+e*i-g*h;c[1]=e*b+a*h+g*f-d*i;c[2]=g*b+a*i+d*h-e*f;c[3]=a*b-d*f-e*h-g*i;return c};
quat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=a[0],f=a[1],h=a[2],a=a[3],i=a*d+f*g-h*e,j=a*e+h*d-b*g,k=a*g+b*e-f*d,d=-b*d-f*e-h*g;c[0]=i*a+d*-b+j*-h-k*-f;c[1]=j*a+d*-f+k*-b-i*-h;c[2]=k*a+d*-h+i*-f-j*-b;return c};quat4.toMat3=function(a,b){b||(b=mat3.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c*=i;var l=d*h;d*=i;e*=i;f*=g;h*=g;g*=i;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=k-g;b[4]=1-(j+e);b[5]=d+f;b[6]=c+h;b[7]=d-f;b[8]=1-(j+l);return b};
quat4.toMat4=function(a,b){b||(b=mat4.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c*=i;var l=d*h;d*=i;e*=i;f*=g;h*=g;g*=i;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=0;b[4]=k-g;b[5]=1-(j+e);b[6]=d+f;b[7]=0;b[8]=c+h;b[9]=d-f;b[10]=1-(j+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
quat4.slerp=function(a,b,c,d){d||(d=a);var e=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],g,f;if(Math.abs(e)>=1)return d!==a&&(d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=a[3]),d;g=Math.acos(e);f=Math.sqrt(1-e*e);if(Math.abs(f)<0.001)return d[0]=a[0]*0.5+b[0]*0.5,d[1]=a[1]*0.5+b[1]*0.5,d[2]=a[2]*0.5+b[2]*0.5,d[3]=a[3]*0.5+b[3]*0.5,d;e=Math.sin((1-c)*g)/f;c=Math.sin(c*g)/f;d[0]=a[0]*e+b[0]*c;d[1]=a[1]*e+b[1]*c;d[2]=a[2]*e+b[2]*c;d[3]=a[3]*e+b[3]*c;return d};
quat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};
(function()
{
	var MAX_VERTICES = 8000;						// equates to 2500 objects being drawn
	var MAX_INDICES = (MAX_VERTICES / 2) * 3;		// 6 indices for every 4 vertices
	var MAX_POINTS = 8000;
	var MULTI_BUFFERS = 4;							// cycle 4 buffers to try and avoid blocking
	var BATCH_NULL = 0;
	var BATCH_QUAD = 1;
	var BATCH_SETTEXTURE = 2;
	var BATCH_SETOPACITY = 3;
	var BATCH_SETBLEND = 4;
	var BATCH_UPDATEMODELVIEW = 5;
	var BATCH_RENDERTOTEXTURE = 6;
	var BATCH_CLEAR = 7;
	var BATCH_POINTS = 8;
	var BATCH_SETPROGRAM = 9;
	var BATCH_SETPROGRAMPARAMETERS = 10;
	var BATCH_SETTEXTURE1 = 11;
	var BATCH_SETCOLOR = 12;
	var BATCH_SETDEPTHTEST = 13;
	var BATCH_SETEARLYZMODE = 14;
	/*
	var lose_ext = null;
	window.lose_context = function ()
	{
		if (!lose_ext)
		{
			console.log("WEBGL_lose_context not supported");
			return;
		}
		lose_ext.loseContext();
	};
	window.restore_context = function ()
	{
		if (!lose_ext)
		{
			console.log("WEBGL_lose_context not supported");
			return;
		}
		lose_ext.restoreContext();
	};
	*/
	var tempMat4 = mat4.create();
	function GLWrap_(gl, isMobile, enableFrontToBack)
	{
		this.isIE = /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
		this.width = 0;		// not yet known, wait for call to setSize()
		this.height = 0;
		this.enableFrontToBack = !!enableFrontToBack;
		this.isEarlyZPass = false;
		this.isBatchInEarlyZPass = false;
		this.currentZ = 0;
		this.zNear = 1;
		this.zFar = 1000;
		this.zIncrement = ((this.zFar - this.zNear) / 32768);
		this.zA = this.zFar / (this.zFar - this.zNear);
		this.zB = this.zFar * this.zNear / (this.zNear - this.zFar);
		this.kzA = 65536 * this.zA;
		this.kzB = 65536 * this.zB;
		this.cam = vec3.create([0, 0, 100]);			// camera position
		this.look = vec3.create([0, 0, 0]);				// lookat position
		this.up = vec3.create([0, 1, 0]);				// up vector
		this.worldScale = vec3.create([1, 1, 1]);		// world scaling factor
		this.enable_mipmaps = true;
		this.matP = mat4.create();						// perspective matrix
		this.matMV = mat4.create();						// model view matrix
		this.lastMV = mat4.create();
		this.currentMV = mat4.create();
		this.gl = gl;
		this.version = (this.gl.getParameter(this.gl.VERSION).indexOf("WebGL 2") === 0 ? 2 : 1);
		this.initState();
	};
	GLWrap_.prototype.initState = function ()
	{
		var gl = this.gl;
		var i, len;
		this.lastOpacity = 1;
		this.lastTexture0 = null;			// last bound to TEXTURE0
		this.lastTexture1 = null;			// last bound to TEXTURE1
		this.currentOpacity = 1;
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.disable(gl.CULL_FACE);
		gl.disable(gl.STENCIL_TEST);
		gl.disable(gl.DITHER);
		if (this.enableFrontToBack)
		{
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
		}
		else
		{
			gl.disable(gl.DEPTH_TEST);
		}
		this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
		this.lastSrcBlend = gl.ONE;
		this.lastDestBlend = gl.ONE_MINUS_SRC_ALPHA;
		this.vertexData = new Float32Array(MAX_VERTICES * (this.enableFrontToBack ? 3 : 2));
		this.texcoordData = new Float32Array(MAX_VERTICES * 2);
		this.pointData = new Float32Array(MAX_POINTS * 4);
		this.pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.pointData.byteLength, gl.DYNAMIC_DRAW);
		this.vertexBuffers = new Array(MULTI_BUFFERS);
		this.texcoordBuffers = new Array(MULTI_BUFFERS);
		for (i = 0; i < MULTI_BUFFERS; i++)
		{
			this.vertexBuffers[i] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[i]);
			gl.bufferData(gl.ARRAY_BUFFER, this.vertexData.byteLength, gl.DYNAMIC_DRAW);
			this.texcoordBuffers[i] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffers[i]);
			gl.bufferData(gl.ARRAY_BUFFER, this.texcoordData.byteLength, gl.DYNAMIC_DRAW);
		}
		this.curBuffer = 0;
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		var indexData = new Uint16Array(MAX_INDICES);
		i = 0, len = MAX_INDICES;
		var fv = 0;
		while (i < len)
		{
			indexData[i++] = fv;		// top left
			indexData[i++] = fv + 1;	// top right
			indexData[i++] = fv + 2;	// bottom right (first tri)
			indexData[i++] = fv;		// top left
			indexData[i++] = fv + 2;	// bottom right
			indexData[i++] = fv + 3;	// bottom left
			fv += 4;
		}
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
		this.vertexPtr = 0;
		this.texPtr = 0;
		this.pointPtr = 0;
		var fsSource, vsSource;
		this.shaderPrograms = [];
		fsSource = [
			"varying mediump vec2 vTex;",
			"uniform lowp float opacity;",
			"uniform lowp sampler2D samplerFront;",
			"void main(void) {",
			"	gl_FragColor = texture2D(samplerFront, vTex);",
			"	gl_FragColor *= opacity;",
			"}"
		].join("\n");
		if (this.enableFrontToBack)
		{
			vsSource = [
				"attribute highp vec3 aPos;",
				"attribute mediump vec2 aTex;",
				"varying mediump vec2 vTex;",
				"uniform highp mat4 matP;",
				"uniform highp mat4 matMV;",
				"void main(void) {",
				"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, aPos.z, 1.0);",
				"	vTex = aTex;",
				"}"
			].join("\n");
		}
		else
		{
			vsSource = [
				"attribute highp vec2 aPos;",
				"attribute mediump vec2 aTex;",
				"varying mediump vec2 vTex;",
				"uniform highp mat4 matP;",
				"uniform highp mat4 matMV;",
				"void main(void) {",
				"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, 0.0, 1.0);",
				"	vTex = aTex;",
				"}"
			].join("\n");
		}
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<default>");
;
		this.shaderPrograms.push(shaderProg);		// Default shader is always shader 0
		fsSource = [
			"uniform mediump sampler2D samplerFront;",
			"varying lowp float opacity;",
			"void main(void) {",
			"	gl_FragColor = texture2D(samplerFront, gl_PointCoord);",
			"	gl_FragColor *= opacity;",
			"}"
		].join("\n");
		var pointVsSource = [
			"attribute vec4 aPos;",
			"varying float opacity;",
			"uniform mat4 matP;",
			"uniform mat4 matMV;",
			"void main(void) {",
			"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, 0.0, 1.0);",
			"	gl_PointSize = aPos.z;",
			"	opacity = aPos.w;",
			"}"
		].join("\n");
		shaderProg = this.createShaderProgram({src: fsSource}, pointVsSource, "<point>");
;
		this.shaderPrograms.push(shaderProg);		// Point shader is always shader 1
		fsSource = [
			"varying mediump vec2 vTex;",
			"uniform lowp sampler2D samplerFront;",
			"void main(void) {",
			"	if (texture2D(samplerFront, vTex).a < 1.0)",
			"		discard;",						// discarding non-opaque fragments
			"}"
		].join("\n");
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<earlyz>");
;
		this.shaderPrograms.push(shaderProg);		// Early-Z shader is always shader 2
		fsSource = [
			"uniform lowp vec4 colorFill;",
			"void main(void) {",
			"	gl_FragColor = colorFill;",
			"}"
		].join("\n");
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<fill>");
;
		this.shaderPrograms.push(shaderProg);		// Fill-color shader is always shader 3
		for (var shader_name in cr.shaders)
		{
			if (cr.shaders.hasOwnProperty(shader_name))
				this.shaderPrograms.push(this.createShaderProgram(cr.shaders[shader_name], vsSource, shader_name));
		}
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.batch = [];
		this.batchPtr = 0;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.lastProgram = -1;				// start -1 so first switchProgram can do work
		this.currentProgram = -1;			// current program during batch execution
		this.currentShader = null;
		this.fbo = gl.createFramebuffer();
		this.renderToTex = null;
		this.depthBuffer = null;
		this.attachedDepthBuffer = false;	// wait until first size call to attach, otherwise it has no storage
		if (this.enableFrontToBack)
		{
			this.depthBuffer = gl.createRenderbuffer();
		}
		this.tmpVec3 = vec3.create([0, 0, 0]);
;
		var pointsizes = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
		this.minPointSize = pointsizes[0];
		this.maxPointSize = pointsizes[1];
		if (this.maxPointSize > 2048)
			this.maxPointSize = 2048;
;
		this.switchProgram(0);
		cr.seal(this);
	};
	function GLShaderProgram(gl, shaderProgram, name)
	{
		this.gl = gl;
		this.shaderProgram = shaderProgram;
		this.name = name;
		this.locAPos = gl.getAttribLocation(shaderProgram, "aPos");
		this.locATex = gl.getAttribLocation(shaderProgram, "aTex");
		this.locMatP = gl.getUniformLocation(shaderProgram, "matP");
		this.locMatMV = gl.getUniformLocation(shaderProgram, "matMV");
		this.locOpacity = gl.getUniformLocation(shaderProgram, "opacity");
		this.locColorFill = gl.getUniformLocation(shaderProgram, "colorFill");
		this.locSamplerFront = gl.getUniformLocation(shaderProgram, "samplerFront");
		this.locSamplerBack = gl.getUniformLocation(shaderProgram, "samplerBack");
		this.locDestStart = gl.getUniformLocation(shaderProgram, "destStart");
		this.locDestEnd = gl.getUniformLocation(shaderProgram, "destEnd");
		this.locSeconds = gl.getUniformLocation(shaderProgram, "seconds");
		this.locPixelWidth = gl.getUniformLocation(shaderProgram, "pixelWidth");
		this.locPixelHeight = gl.getUniformLocation(shaderProgram, "pixelHeight");
		this.locLayerScale = gl.getUniformLocation(shaderProgram, "layerScale");
		this.locLayerAngle = gl.getUniformLocation(shaderProgram, "layerAngle");
		this.locViewOrigin = gl.getUniformLocation(shaderProgram, "viewOrigin");
		this.locScrollPos = gl.getUniformLocation(shaderProgram, "scrollPos");
		this.hasAnyOptionalUniforms = !!(this.locPixelWidth || this.locPixelHeight || this.locSeconds || this.locSamplerBack || this.locDestStart || this.locDestEnd || this.locLayerScale || this.locLayerAngle || this.locViewOrigin || this.locScrollPos);
		this.lpPixelWidth = -999;		// set to something unlikely so never counts as cached on first set
		this.lpPixelHeight = -999;
		this.lpOpacity = 1;
		this.lpDestStartX = 0.0;
		this.lpDestStartY = 0.0;
		this.lpDestEndX = 1.0;
		this.lpDestEndY = 1.0;
		this.lpLayerScale = 1.0;
		this.lpLayerAngle = 0.0;
		this.lpViewOriginX = 0.0;
		this.lpViewOriginY = 0.0;
		this.lpScrollPosX = 0.0;
		this.lpScrollPosY = 0.0;
		this.lpSeconds = 0.0;
		this.lastCustomParams = [];
		this.lpMatMV = mat4.create();
		if (this.locOpacity)
			gl.uniform1f(this.locOpacity, 1);
		if (this.locColorFill)
			gl.uniform4f(this.locColorFill, 1.0, 1.0, 1.0, 1.0);
		if (this.locSamplerFront)
			gl.uniform1i(this.locSamplerFront, 0);
		if (this.locSamplerBack)
			gl.uniform1i(this.locSamplerBack, 1);
		if (this.locDestStart)
			gl.uniform2f(this.locDestStart, 0.0, 0.0);
		if (this.locDestEnd)
			gl.uniform2f(this.locDestEnd, 1.0, 1.0);
		if (this.locLayerScale)
			gl.uniform1f(this.locLayerScale, 1.0);
		if (this.locLayerAngle)
			gl.uniform1f(this.locLayerAngle, 0.0);
		if (this.locViewOrigin)
			gl.uniform2f(this.locViewOrigin, 0.0, 0.0);
		if (this.locScrollPos)
			gl.uniform2f(this.locScrollPos, 0.0, 0.0);
		if (this.locSeconds)
			gl.uniform1f(this.locSeconds, 0.0);
		this.hasCurrentMatMV = false;		// matMV needs updating
	};
	function areMat4sEqual(a, b)
	{
		return a[0]===b[0]&&a[1]===b[1]&&a[2]===b[2]&&a[3]===b[3]&&
			   a[4]===b[4]&&a[5]===b[5]&&a[6]===b[6]&&a[7]===b[7]&&
			   a[8]===b[8]&&a[9]===b[9]&&a[10]===b[10]&&a[11]===b[11]&&
			   a[12]===b[12]&&a[13]===b[13]&&a[14]===b[14]&&a[15]===b[15];
	};
	GLShaderProgram.prototype.updateMatMV = function (mv)
	{
		if (areMat4sEqual(this.lpMatMV, mv))
			return;		// no change, save the expensive GL call
		mat4.set(mv, this.lpMatMV);
		this.gl.uniformMatrix4fv(this.locMatMV, false, mv);
	};
	GLWrap_.prototype.createShaderProgram = function(shaderEntry, vsSource, name)
	{
		var gl = this.gl;
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, shaderEntry.src);
		gl.compileShader(fragmentShader);
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
		{
			var compilationlog = gl.getShaderInfoLog(fragmentShader);
			gl.deleteShader(fragmentShader);
			throw new Error("error compiling fragment shader: " + compilationlog);
		}
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vsSource);
		gl.compileShader(vertexShader);
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
		{
			var compilationlog = gl.getShaderInfoLog(vertexShader);
			gl.deleteShader(fragmentShader);
			gl.deleteShader(vertexShader);
			throw new Error("error compiling vertex shader: " + compilationlog);
		}
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, fragmentShader);
		gl.attachShader(shaderProgram, vertexShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
		{
			var compilationlog = gl.getProgramInfoLog(shaderProgram);
			gl.deleteShader(fragmentShader);
			gl.deleteShader(vertexShader);
			gl.deleteProgram(shaderProgram);
			throw new Error("error linking shader program: " + compilationlog);
		}
		gl.useProgram(shaderProgram);
		gl.deleteShader(fragmentShader);
		gl.deleteShader(vertexShader);
		var ret = new GLShaderProgram(gl, shaderProgram, name);
		ret.extendBoxHorizontal = shaderEntry.extendBoxHorizontal || 0;
		ret.extendBoxVertical = shaderEntry.extendBoxVertical || 0;
		ret.crossSampling = !!shaderEntry.crossSampling;
		ret.preservesOpaqueness = !!shaderEntry.preservesOpaqueness;
		ret.animated = !!shaderEntry.animated;
		ret.parameters = shaderEntry.parameters || [];
		var i, len;
		for (i = 0, len = ret.parameters.length; i < len; i++)
		{
			ret.parameters[i][1] = gl.getUniformLocation(shaderProgram, ret.parameters[i][0]);
			ret.lastCustomParams.push(0);
			gl.uniform1f(ret.parameters[i][1], 0);
		}
		cr.seal(ret);
		return ret;
	};
	GLWrap_.prototype.getShaderIndex = function(name_)
	{
		var i, len;
		for (i = 0, len = this.shaderPrograms.length; i < len; i++)
		{
			if (this.shaderPrograms[i].name === name_)
				return i;
		}
		return -1;
	};
	GLWrap_.prototype.project = function (x, y, out)
	{
		var mv = this.matMV;
		var proj = this.matP;
		var fTempo = [0, 0, 0, 0, 0, 0, 0, 0];
		fTempo[0] = mv[0]*x+mv[4]*y+mv[12];
		fTempo[1] = mv[1]*x+mv[5]*y+mv[13];
		fTempo[2] = mv[2]*x+mv[6]*y+mv[14];
		fTempo[3] = mv[3]*x+mv[7]*y+mv[15];
		fTempo[4] = proj[0]*fTempo[0]+proj[4]*fTempo[1]+proj[8]*fTempo[2]+proj[12]*fTempo[3];
		fTempo[5] = proj[1]*fTempo[0]+proj[5]*fTempo[1]+proj[9]*fTempo[2]+proj[13]*fTempo[3];
		fTempo[6] = proj[2]*fTempo[0]+proj[6]*fTempo[1]+proj[10]*fTempo[2]+proj[14]*fTempo[3];
		fTempo[7] = -fTempo[2];
		if(fTempo[7]===0.0)	//The w value
			return;
		fTempo[7]=1.0/fTempo[7];
		fTempo[4]*=fTempo[7];
		fTempo[5]*=fTempo[7];
		fTempo[6]*=fTempo[7];
		out[0]=(fTempo[4]*0.5+0.5)*this.width;
		out[1]=(fTempo[5]*0.5+0.5)*this.height;
	};
	GLWrap_.prototype.setSize = function(w, h, force)
	{
		if (this.width === w && this.height === h && !force)
			return;
		this.endBatch();
		var gl = this.gl;
		this.width = w;
		this.height = h;
		gl.viewport(0, 0, w, h);
		mat4.lookAt(this.cam, this.look, this.up, this.matMV);
		if (this.enableFrontToBack)
		{
			mat4.ortho(-w/2, w/2, h/2, -h/2, this.zNear, this.zFar, this.matP);
			this.worldScale[0] = 1;
			this.worldScale[1] = 1;
		}
		else
		{
			mat4.perspective(45, w / h, this.zNear, this.zFar, this.matP);
			var tl = [0, 0];
			var br = [0, 0];
			this.project(0, 0, tl);
			this.project(1, 1, br);
			this.worldScale[0] = 1 / (br[0] - tl[0]);
			this.worldScale[1] = -1 / (br[1] - tl[1]);
		}
		var i, len, s;
		for (i = 0, len = this.shaderPrograms.length; i < len; i++)
		{
			s = this.shaderPrograms[i];
			s.hasCurrentMatMV = false;
			if (s.locMatP)
			{
				gl.useProgram(s.shaderProgram);
				gl.uniformMatrix4fv(s.locMatP, false, this.matP);
			}
		}
		gl.useProgram(this.shaderPrograms[this.lastProgram].shaderProgram);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.activeTexture(gl.TEXTURE0);
		this.lastTexture0 = null;
		this.lastTexture1 = null;
		if (this.depthBuffer)
		{
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
			gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
			if (!this.attachedDepthBuffer)
			{
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
				this.attachedDepthBuffer = true;
			}
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.renderToTex = null;
		}
	};
	GLWrap_.prototype.resetModelView = function ()
	{
		mat4.lookAt(this.cam, this.look, this.up, this.matMV);
		mat4.scale(this.matMV, this.worldScale);
	};
	GLWrap_.prototype.translate = function (x, y)
	{
		if (x === 0 && y === 0)
			return;
		this.tmpVec3[0] = x;// * this.worldScale[0];
		this.tmpVec3[1] = y;// * this.worldScale[1];
		this.tmpVec3[2] = 0;
		mat4.translate(this.matMV, this.tmpVec3);
	};
	GLWrap_.prototype.scale = function (x, y)
	{
		if (x === 1 && y === 1)
			return;
		this.tmpVec3[0] = x;
		this.tmpVec3[1] = y;
		this.tmpVec3[2] = 1;
		mat4.scale(this.matMV, this.tmpVec3);
	};
	GLWrap_.prototype.rotateZ = function (a)
	{
		if (a === 0)
			return;
		mat4.rotateZ(this.matMV, a);
	};
	GLWrap_.prototype.updateModelView = function()
	{
		if (areMat4sEqual(this.lastMV, this.matMV))
			return;
		var b = this.pushBatch();
		b.type = BATCH_UPDATEMODELVIEW;
		if (b.mat4param)
			mat4.set(this.matMV, b.mat4param);
		else
			b.mat4param = mat4.create(this.matMV);
		mat4.set(this.matMV, this.lastMV);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	/*
	var debugBatch = false;
	jQuery(document).mousedown(
		function(info) {
			if (info.which === 2)
				debugBatch = true;
		}
	);
	*/
	GLWrap_.prototype.setEarlyZIndex = function (i)
	{
		if (!this.enableFrontToBack)
			return;
		if (i > 32760)
			i = 32760;
		this.currentZ = this.cam[2] - this.zNear - i * this.zIncrement;
	};
	function GLBatchJob(type_, glwrap_)
	{
		this.type = type_;
		this.glwrap = glwrap_;
		this.gl = glwrap_.gl;
		this.opacityParam = 0;		// for setOpacity()
		this.startIndex = 0;		// for quad()
		this.indexCount = 0;		// "
		this.texParam = null;		// for setTexture()
		this.mat4param = null;		// for updateModelView()
		this.shaderParams = [];		// for user parameters
		cr.seal(this);
	};
	GLBatchJob.prototype.doSetEarlyZPass = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (this.startIndex !== 0)		// enable
		{
			gl.depthMask(true);			// enable depth writes
			gl.colorMask(false, false, false, false);	// disable color writes
			gl.disable(gl.BLEND);		// no color writes so disable blend
			gl.bindFramebuffer(gl.FRAMEBUFFER, glwrap.fbo);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
			gl.clear(gl.DEPTH_BUFFER_BIT);		// auto-clear depth buffer
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			glwrap.isBatchInEarlyZPass = true;
		}
		else
		{
			gl.depthMask(false);		// disable depth writes, only test existing depth values
			gl.colorMask(true, true, true, true);		// enable color writes
			gl.enable(gl.BLEND);		// turn blending back on
			glwrap.isBatchInEarlyZPass = false;
		}
	};
	GLBatchJob.prototype.doSetTexture = function ()
	{
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texParam);
	};
	GLBatchJob.prototype.doSetTexture1 = function ()
	{
		var gl = this.gl;
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.texParam);
		gl.activeTexture(gl.TEXTURE0);
	};
	GLBatchJob.prototype.doSetOpacity = function ()
	{
		var o = this.opacityParam;
		var glwrap = this.glwrap;
		glwrap.currentOpacity = o;
		var curProg = glwrap.currentShader;
		if (curProg.locOpacity && curProg.lpOpacity !== o)
		{
			curProg.lpOpacity = o;
			this.gl.uniform1f(curProg.locOpacity, o);
		}
	};
	GLBatchJob.prototype.doQuad = function ()
	{
		this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, this.startIndex);
	};
	GLBatchJob.prototype.doSetBlend = function ()
	{
		this.gl.blendFunc(this.startIndex, this.indexCount);
	};
	GLBatchJob.prototype.doUpdateModelView = function ()
	{
		var i, len, s, shaderPrograms = this.glwrap.shaderPrograms, currentProgram = this.glwrap.currentProgram;
		for (i = 0, len = shaderPrograms.length; i < len; i++)
		{
			s = shaderPrograms[i];
			if (i === currentProgram && s.locMatMV)
			{
				s.updateMatMV(this.mat4param);
				s.hasCurrentMatMV = true;
			}
			else
				s.hasCurrentMatMV = false;
		}
		mat4.set(this.mat4param, this.glwrap.currentMV);
	};
	GLBatchJob.prototype.doRenderToTexture = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (this.texParam)
		{
			if (glwrap.lastTexture1 === this.texParam)
			{
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, null);
				glwrap.lastTexture1 = null;
				gl.activeTexture(gl.TEXTURE0);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, glwrap.fbo);
			if (!glwrap.isBatchInEarlyZPass)
			{
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParam, 0);
			}
		}
		else
		{
			if (!glwrap.enableFrontToBack)
			{
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	};
	GLBatchJob.prototype.doClear = function ()
	{
		var gl = this.gl;
		var mode = this.startIndex;
		if (mode === 0)			// clear whole surface
		{
			gl.clearColor(this.mat4param[0], this.mat4param[1], this.mat4param[2], this.mat4param[3]);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
		else if (mode === 1)	// clear rectangle
		{
			gl.enable(gl.SCISSOR_TEST);
			gl.scissor(this.mat4param[0], this.mat4param[1], this.mat4param[2], this.mat4param[3]);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.disable(gl.SCISSOR_TEST);
		}
		else					// clear depth
		{
			gl.clear(gl.DEPTH_BUFFER_BIT);
		}
	};
	GLBatchJob.prototype.doSetDepthTestEnabled = function ()
	{
		var gl = this.gl;
		var enable = this.startIndex;
		if (enable !== 0)
		{
			gl.enable(gl.DEPTH_TEST);
		}
		else
		{
			gl.disable(gl.DEPTH_TEST);
		}
	};
	GLBatchJob.prototype.doPoints = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (glwrap.enableFrontToBack)
			gl.disable(gl.DEPTH_TEST);
		var s = glwrap.shaderPrograms[1];
		gl.useProgram(s.shaderProgram);
		if (!s.hasCurrentMatMV && s.locMatMV)
		{
			s.updateMatMV(glwrap.currentMV);
			s.hasCurrentMatMV = true;
		}
		gl.enableVertexAttribArray(s.locAPos);
		gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.pointBuffer);
		gl.vertexAttribPointer(s.locAPos, 4, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.POINTS, this.startIndex / 4, this.indexCount);
		s = glwrap.currentShader;
		gl.useProgram(s.shaderProgram);
		if (s.locAPos >= 0)
		{
			gl.enableVertexAttribArray(s.locAPos);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.vertexBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locAPos, glwrap.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
		}
		if (s.locATex >= 0)
		{
			gl.enableVertexAttribArray(s.locATex);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.texcoordBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
		if (glwrap.enableFrontToBack)
			gl.enable(gl.DEPTH_TEST);
	};
	GLBatchJob.prototype.doSetProgram = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		var s = glwrap.shaderPrograms[this.startIndex];		// recycled param to save memory
		glwrap.currentProgram = this.startIndex;			// current batch program
		glwrap.currentShader = s;
		gl.useProgram(s.shaderProgram);						// switch to
		if (!s.hasCurrentMatMV && s.locMatMV)
		{
			s.updateMatMV(glwrap.currentMV);
			s.hasCurrentMatMV = true;
		}
		if (s.locOpacity && s.lpOpacity !== glwrap.currentOpacity)
		{
			s.lpOpacity = glwrap.currentOpacity;
			gl.uniform1f(s.locOpacity, glwrap.currentOpacity);
		}
		if (s.locAPos >= 0)
		{
			gl.enableVertexAttribArray(s.locAPos);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.vertexBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locAPos, glwrap.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
		}
		if (s.locATex >= 0)
		{
			gl.enableVertexAttribArray(s.locATex);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.texcoordBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
	}
	GLBatchJob.prototype.doSetColor = function ()
	{
		var s = this.glwrap.currentShader;
		var mat4param = this.mat4param;
		this.gl.uniform4f(s.locColorFill, mat4param[0], mat4param[1], mat4param[2], mat4param[3]);
	};
	GLBatchJob.prototype.doSetProgramParameters = function ()
	{
		var i, len, s = this.glwrap.currentShader;
		var gl = this.gl;
		var mat4param = this.mat4param;
		if (s.locSamplerBack && this.glwrap.lastTexture1 !== this.texParam)
		{
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, this.texParam);
			this.glwrap.lastTexture1 = this.texParam;
			gl.activeTexture(gl.TEXTURE0);
		}
		var v = mat4param[0];
		var v2;
		if (s.locPixelWidth && v !== s.lpPixelWidth)
		{
			s.lpPixelWidth = v;
			gl.uniform1f(s.locPixelWidth, v);
		}
		v = mat4param[1];
		if (s.locPixelHeight && v !== s.lpPixelHeight)
		{
			s.lpPixelHeight = v;
			gl.uniform1f(s.locPixelHeight, v);
		}
		v = mat4param[2];
		v2 = mat4param[3];
		if (s.locDestStart && (v !== s.lpDestStartX || v2 !== s.lpDestStartY))
		{
			s.lpDestStartX = v;
			s.lpDestStartY = v2;
			gl.uniform2f(s.locDestStart, v, v2);
		}
		v = mat4param[4];
		v2 = mat4param[5];
		if (s.locDestEnd && (v !== s.lpDestEndX || v2 !== s.lpDestEndY))
		{
			s.lpDestEndX = v;
			s.lpDestEndY = v2;
			gl.uniform2f(s.locDestEnd, v, v2);
		}
		v = mat4param[6];
		if (s.locLayerScale && v !== s.lpLayerScale)
		{
			s.lpLayerScale = v;
			gl.uniform1f(s.locLayerScale, v);
		}
		v = mat4param[7];
		if (s.locLayerAngle && v !== s.lpLayerAngle)
		{
			s.lpLayerAngle = v;
			gl.uniform1f(s.locLayerAngle, v);
		}
		v = mat4param[8];
		v2 = mat4param[9];
		if (s.locViewOrigin && (v !== s.lpViewOriginX || v2 !== s.lpViewOriginY))
		{
			s.lpViewOriginX = v;
			s.lpViewOriginY = v2;
			gl.uniform2f(s.locViewOrigin, v, v2);
		}
		v = mat4param[10];
		v2 = mat4param[11];
		if (s.locScrollPos && (v !== s.lpScrollPosX || v2 !== s.lpScrollPosY))
		{
			s.lpScrollPosX = v;
			s.lpScrollPosY = v2;
			gl.uniform2f(s.locScrollPos, v, v2);
		}
		v = mat4param[12];
		if (s.locSeconds && v !== s.lpSeconds)
		{
			s.lpSeconds = v;
			gl.uniform1f(s.locSeconds, v);
		}
		if (s.parameters.length)
		{
			for (i = 0, len = s.parameters.length; i < len; i++)
			{
				v = this.shaderParams[i];
				if (v !== s.lastCustomParams[i])
				{
					s.lastCustomParams[i] = v;
					gl.uniform1f(s.parameters[i][1], v);
				}
			}
		}
	};
	GLWrap_.prototype.pushBatch = function ()
	{
		if (this.batchPtr === this.batch.length)
			this.batch.push(new GLBatchJob(BATCH_NULL, this));
		return this.batch[this.batchPtr++];
	};
	GLWrap_.prototype.endBatch = function ()
	{
		if (this.batchPtr === 0)
			return;
		if (this.gl.isContextLost())
			return;
		var gl = this.gl;
		if (this.pointPtr > 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.pointData.subarray(0, this.pointPtr));
			if (s && s.locAPos >= 0 && s.name === "<point>")
				gl.vertexAttribPointer(s.locAPos, 4, gl.FLOAT, false, 0, 0);
		}
		if (this.vertexPtr > 0)
		{
			var s = this.currentShader;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[this.curBuffer]);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexData.subarray(0, this.vertexPtr));
			if (s && s.locAPos >= 0 && s.name !== "<point>")
				gl.vertexAttribPointer(s.locAPos, this.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffers[this.curBuffer]);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.texcoordData.subarray(0, this.texPtr));
			if (s && s.locATex >= 0 && s.name !== "<point>")
				gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
		var i, len, b;
		for (i = 0, len = this.batchPtr; i < len; i++)
		{
			b = this.batch[i];
			switch (b.type) {
			case 1:
				b.doQuad();
				break;
			case 2:
				b.doSetTexture();
				break;
			case 3:
				b.doSetOpacity();
				break;
			case 4:
				b.doSetBlend();
				break;
			case 5:
				b.doUpdateModelView();
				break;
			case 6:
				b.doRenderToTexture();
				break;
			case 7:
				b.doClear();
				break;
			case 8:
				b.doPoints();
				break;
			case 9:
				b.doSetProgram();
				break;
			case 10:
				b.doSetProgramParameters();
				break;
			case 11:
				b.doSetTexture1();
				break;
			case 12:
				b.doSetColor();
				break;
			case 13:
				b.doSetDepthTestEnabled();
				break;
			case 14:
				b.doSetEarlyZPass();
				break;
			}
		}
		this.batchPtr = 0;
		this.vertexPtr = 0;
		this.texPtr = 0;
		this.pointPtr = 0;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.isBatchInEarlyZPass = false;
		this.curBuffer++;
		if (this.curBuffer >= MULTI_BUFFERS)
			this.curBuffer = 0;
	};
	GLWrap_.prototype.setOpacity = function (op)
	{
		if (op === this.lastOpacity)
			return;
		if (this.isEarlyZPass)
			return;		// ignore
		var b = this.pushBatch();
		b.type = BATCH_SETOPACITY;
		b.opacityParam = op;
		this.lastOpacity = op;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setTexture = function (tex)
	{
		if (tex === this.lastTexture0)
			return;
;
		var b = this.pushBatch();
		b.type = BATCH_SETTEXTURE;
		b.texParam = tex;
		this.lastTexture0 = tex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setBlend = function (s, d)
	{
		if (s === this.lastSrcBlend && d === this.lastDestBlend)
			return;
		if (this.isEarlyZPass)
			return;		// ignore
		var b = this.pushBatch();
		b.type = BATCH_SETBLEND;
		b.startIndex = s;		// recycle params to save memory
		b.indexCount = d;
		this.lastSrcBlend = s;
		this.lastDestBlend = d;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.isPremultipliedAlphaBlend = function ()
	{
		return (this.lastSrcBlend === this.gl.ONE && this.lastDestBlend === this.gl.ONE_MINUS_SRC_ALPHA);
	};
	GLWrap_.prototype.setAlphaBlend = function ()
	{
		this.setBlend(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
	};
	GLWrap_.prototype.setNoPremultiplyAlphaBlend = function ()
	{
		this.setBlend(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	};
	var LAST_VERTEX = MAX_VERTICES * 2 - 8;
	GLWrap_.prototype.quad = function(tlx, tly, trx, try_, brx, bry, blx, bly)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = 0;
		td[t++] = 0;
		td[t++] = 1;
		td[t++] = 0;
		td[t++] = 1;
		td[t++] = 1;
		td[t++] = 0;
		td[t++] = 1;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.quadTex = function(tlx, tly, trx, try_, brx, bry, blx, bly, rcTex)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		var rc_left = rcTex.left;
		var rc_top = rcTex.top;
		var rc_right = rcTex.right;
		var rc_bottom = rcTex.bottom;
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = rc_left;
		td[t++] = rc_top;
		td[t++] = rc_right;
		td[t++] = rc_top;
		td[t++] = rc_right;
		td[t++] = rc_bottom;
		td[t++] = rc_left;
		td[t++] = rc_bottom;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.quadTexUV = function(tlx, tly, trx, try_, brx, bry, blx, bly, tlu, tlv, tru, trv, bru, brv, blu, blv)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = tlu;
		td[t++] = tlv;
		td[t++] = tru;
		td[t++] = trv;
		td[t++] = bru;
		td[t++] = brv;
		td[t++] = blu;
		td[t++] = blv;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.convexPoly = function(pts)
	{
		var pts_count = pts.length / 2;
;
		var tris = pts_count - 2;	// 3 points = 1 tri, 4 points = 2 tris, 5 points = 3 tris etc.
		var last_tri = tris - 1;
		var p0x = pts[0];
		var p0y = pts[1];
		var i, i2, p1x, p1y, p2x, p2y, p3x, p3y;
		for (i = 0; i < tris; i += 2)		// draw 2 triangles at a time
		{
			i2 = i * 2;
			p1x = pts[i2 + 2];
			p1y = pts[i2 + 3];
			p2x = pts[i2 + 4];
			p2y = pts[i2 + 5];
			if (i === last_tri)
			{
				this.quad(p0x, p0y, p1x, p1y, p2x, p2y, p2x, p2y);
			}
			else
			{
				p3x = pts[i2 + 6];
				p3y = pts[i2 + 7];
				this.quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
			}
		}
	};
	var LAST_POINT = MAX_POINTS - 4;
	GLWrap_.prototype.point = function(x_, y_, size_, opacity_)
	{
		if (this.pointPtr >= LAST_POINT)
			this.endBatch();
		var p = this.pointPtr;			// point cursor
		var pd = this.pointData;		// point data array
		if (this.hasPointBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount++;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_POINTS;
			b.startIndex = p;
			b.indexCount = 1;
			this.hasPointBatchTop = true;
			this.hasQuadBatchTop = false;
		}
		pd[p++] = x_;
		pd[p++] = y_;
		pd[p++] = size_;
		pd[p++] = opacity_;
		this.pointPtr = p;
	};
	GLWrap_.prototype.switchProgram = function (progIndex)
	{
		if (this.lastProgram === progIndex)
			return;			// no change
		var shaderProg = this.shaderPrograms[progIndex];
		if (!shaderProg)
		{
			if (this.lastProgram === 0)
				return;								// already on default shader
			progIndex = 0;
			shaderProg = this.shaderPrograms[0];
		}
		var b = this.pushBatch();
		b.type = BATCH_SETPROGRAM;
		b.startIndex = progIndex;
		this.lastProgram = progIndex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.programUsesDest = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return !!(s.locDestStart || s.locDestEnd);
	};
	GLWrap_.prototype.programUsesCrossSampling = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return !!(s.locDestStart || s.locDestEnd || s.crossSampling);
	};
	GLWrap_.prototype.programPreservesOpaqueness = function (progIndex)
	{
		return this.shaderPrograms[progIndex].preservesOpaqueness;
	};
	GLWrap_.prototype.programExtendsBox = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return s.extendBoxHorizontal !== 0 || s.extendBoxVertical !== 0;
	};
	GLWrap_.prototype.getProgramBoxExtendHorizontal = function (progIndex)
	{
		return this.shaderPrograms[progIndex].extendBoxHorizontal;
	};
	GLWrap_.prototype.getProgramBoxExtendVertical = function (progIndex)
	{
		return this.shaderPrograms[progIndex].extendBoxVertical;
	};
	GLWrap_.prototype.getProgramParameterType = function (progIndex, paramIndex)
	{
		return this.shaderPrograms[progIndex].parameters[paramIndex][2];
	};
	GLWrap_.prototype.programIsAnimated = function (progIndex)
	{
		return this.shaderPrograms[progIndex].animated;
	};
	GLWrap_.prototype.setProgramParameters = function (backTex, pixelWidth, pixelHeight, destStartX, destStartY, destEndX, destEndY, layerScale, layerAngle, viewOriginLeft, viewOriginTop, scrollPosX, scrollPosY, seconds, params)
	{
		var i, len;
		var s = this.shaderPrograms[this.lastProgram];
		var b, mat4param, shaderParams;
		if (s.hasAnyOptionalUniforms || params.length)
		{
			b = this.pushBatch();
			b.type = BATCH_SETPROGRAMPARAMETERS;
			if (b.mat4param)
				mat4.set(this.matMV, b.mat4param);
			else
				b.mat4param = mat4.create();
			mat4param = b.mat4param;
			mat4param[0] = pixelWidth;
			mat4param[1] = pixelHeight;
			mat4param[2] = destStartX;
			mat4param[3] = destStartY;
			mat4param[4] = destEndX;
			mat4param[5] = destEndY;
			mat4param[6] = layerScale;
			mat4param[7] = layerAngle;
			mat4param[8] = viewOriginLeft;
			mat4param[9] = viewOriginTop;
			mat4param[10] = scrollPosX;
			mat4param[11] = scrollPosY;
			mat4param[12] = seconds;
			if (s.locSamplerBack)
			{
;
				b.texParam = backTex;
			}
			else
				b.texParam = null;
			if (params.length)
			{
				shaderParams = b.shaderParams;
				shaderParams.length = params.length;
				for (i = 0, len = params.length; i < len; i++)
					shaderParams[i] = params[i];
			}
			this.hasQuadBatchTop = false;
			this.hasPointBatchTop = false;
		}
	};
	GLWrap_.prototype.clear = function (r, g, b_, a)
	{
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 0;					// clear all mode
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = r;
		b.mat4param[1] = g;
		b.mat4param[2] = b_;
		b.mat4param[3] = a;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.clearRect = function (x, y, w, h)
	{
		if (w < 0 || h < 0)
			return;							// invalid clear area
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 1;					// clear rect mode
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = x;
		b.mat4param[1] = y;
		b.mat4param[2] = w;
		b.mat4param[3] = h;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.clearDepth = function ()
	{
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 2;					// clear depth mode
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setEarlyZPass = function (e)
	{
		if (!this.enableFrontToBack)
			return;		// no depth buffer in use
		e = !!e;
		if (this.isEarlyZPass === e)
			return;		// no change
		var b = this.pushBatch();
		b.type = BATCH_SETEARLYZMODE;
		b.startIndex = (e ? 1 : 0);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.isEarlyZPass = e;
		this.renderToTex = null;
		if (this.isEarlyZPass)
		{
			this.switchProgram(2);		// early Z program
		}
		else
		{
			this.switchProgram(0);		// normal rendering
		}
	};
	GLWrap_.prototype.setDepthTestEnabled = function (e)
	{
		if (!this.enableFrontToBack)
			return;		// no depth buffer in use
		var b = this.pushBatch();
		b.type = BATCH_SETDEPTHTEST;
		b.startIndex = (e ? 1 : 0);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.fullscreenQuad = function ()
	{
		mat4.set(this.lastMV, tempMat4);
		this.resetModelView();
		this.updateModelView();
		var halfw = this.width / 2;
		var halfh = this.height / 2;
		this.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
		mat4.set(tempMat4, this.matMV);
		this.updateModelView();
	};
	GLWrap_.prototype.setColorFillMode = function (r_, g_, b_, a_)
	{
		this.switchProgram(3);
		var b = this.pushBatch();
		b.type = BATCH_SETCOLOR;
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = r_;
		b.mat4param[1] = g_;
		b.mat4param[2] = b_;
		b.mat4param[3] = a_;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setTextureFillMode = function ()
	{
;
		this.switchProgram(0);
	};
	GLWrap_.prototype.restoreEarlyZMode = function ()
	{
;
		this.switchProgram(2);
	};
	GLWrap_.prototype.present = function ()
	{
		this.endBatch();
		this.gl.flush();
		/*
		if (debugBatch)
		{
;
			debugBatch = false;
		}
		*/
	};
	function nextHighestPowerOfTwo(x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	}
	var all_textures = [];
	var textures_by_src = {};
	GLWrap_.prototype.contextLost = function ()
	{
		cr.clearArray(all_textures);
		textures_by_src = {};
	};
	var BF_RGBA8 = 0;
	var BF_RGB8 = 1;
	var BF_RGBA4 = 2;
	var BF_RGB5_A1 = 3;
	var BF_RGB565 = 4;
	GLWrap_.prototype.loadTexture = function (img, tiling, linearsampling, pixelformat, tiletype, nomip)
	{
		tiling = !!tiling;
		linearsampling = !!linearsampling;
		var tex_key = img.src + "," + tiling + "," + linearsampling + (tiling ? ("," + tiletype) : "");
		var webGL_texture = null;
		if (typeof img.src !== "undefined" && textures_by_src.hasOwnProperty(tex_key))
		{
			webGL_texture = textures_by_src[tex_key];
			webGL_texture.c2refcount++;
			return webGL_texture;
		}
		this.endBatch();
;
		var gl = this.gl;
		var isPOT = (cr.isPOT(img.width) && cr.isPOT(img.height));
		webGL_texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, webGL_texture);
		gl.pixelStorei(gl["UNPACK_PREMULTIPLY_ALPHA_WEBGL"], true);
		var internalformat = gl.RGBA;
		var format = gl.RGBA;
		var type = gl.UNSIGNED_BYTE;
		if (pixelformat && !this.isIE)
		{
			switch (pixelformat) {
			case BF_RGB8:
				internalformat = gl.RGB;
				format = gl.RGB;
				break;
			case BF_RGBA4:
				type = gl.UNSIGNED_SHORT_4_4_4_4;
				break;
			case BF_RGB5_A1:
				type = gl.UNSIGNED_SHORT_5_5_5_1;
				break;
			case BF_RGB565:
				internalformat = gl.RGB;
				format = gl.RGB;
				type = gl.UNSIGNED_SHORT_5_6_5;
				break;
			}
		}
		if (this.version === 1 && !isPOT && tiling)
		{
			var canvas = document.createElement("canvas");
			canvas.width = cr.nextHighestPowerOfTwo(img.width);
			canvas.height = cr.nextHighestPowerOfTwo(img.height);
			var ctx = canvas.getContext("2d");
			if (typeof ctx["imageSmoothingEnabled"] !== "undefined")
			{
				ctx["imageSmoothingEnabled"] = linearsampling;
			}
			else
			{
				ctx["webkitImageSmoothingEnabled"] = linearsampling;
				ctx["mozImageSmoothingEnabled"] = linearsampling;
				ctx["msImageSmoothingEnabled"] = linearsampling;
			}
			ctx.drawImage(img,
						  0, 0, img.width, img.height,
						  0, 0, canvas.width, canvas.height);
			gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, canvas);
		}
		else
			gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, img);
		if (tiling)
		{
			if (tiletype === "repeat-x")
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
			else if (tiletype === "repeat-y")
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			}
			else
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			}
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		if (linearsampling)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			if ((isPOT || this.version >= 2) && this.enable_mipmaps && !nomip)
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
				gl.generateMipmap(gl.TEXTURE_2D);
			}
			else
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
		webGL_texture.c2width = img.width;
		webGL_texture.c2height = img.height;
		webGL_texture.c2refcount = 1;
		webGL_texture.c2texkey = tex_key;
		all_textures.push(webGL_texture);
		textures_by_src[tex_key] = webGL_texture;
		return webGL_texture;
	};
	GLWrap_.prototype.createEmptyTexture = function (w, h, linearsampling, _16bit, tiling)
	{
		this.endBatch();
		var gl = this.gl;
		if (this.isIE)
			_16bit = false;
		var webGL_texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, webGL_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, _16bit ? gl.UNSIGNED_SHORT_4_4_4_4 : gl.UNSIGNED_BYTE, null);
		if (tiling)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linearsampling ? gl.LINEAR : gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linearsampling ? gl.LINEAR : gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
		webGL_texture.c2width = w;
		webGL_texture.c2height = h;
		all_textures.push(webGL_texture);
		return webGL_texture;
	};
	GLWrap_.prototype.videoToTexture = function (video_, texture_, _16bit)
	{
		this.endBatch();
		var gl = this.gl;
		if (this.isIE)
			_16bit = false;
		gl.bindTexture(gl.TEXTURE_2D, texture_);
		gl.pixelStorei(gl["UNPACK_PREMULTIPLY_ALPHA_WEBGL"], true);
		try {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, _16bit ? gl.UNSIGNED_SHORT_4_4_4_4 : gl.UNSIGNED_BYTE, video_);
		}
		catch (e)
		{
			if (console && console.error)
				console.error("Error updating WebGL texture: ", e);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
	};
	GLWrap_.prototype.deleteTexture = function (tex)
	{
		if (!tex)
			return;
		if (typeof tex.c2refcount !== "undefined" && tex.c2refcount > 1)
		{
			tex.c2refcount--;
			return;
		}
		this.endBatch();
		if (tex === this.lastTexture0)
		{
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			this.lastTexture0 = null;
		}
		if (tex === this.lastTexture1)
		{
			this.gl.activeTexture(this.gl.TEXTURE1);
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			this.gl.activeTexture(this.gl.TEXTURE0);
			this.lastTexture1 = null;
		}
		cr.arrayFindRemove(all_textures, tex);
		if (typeof tex.c2texkey !== "undefined")
			delete textures_by_src[tex.c2texkey];
		this.gl.deleteTexture(tex);
	};
	GLWrap_.prototype.estimateVRAM = function ()
	{
		var total = this.width * this.height * 4 * 2;
		var i, len, t;
		for (i = 0, len = all_textures.length; i < len; i++)
		{
			t = all_textures[i];
			total += (t.c2width * t.c2height * 4);
		}
		return total;
	};
	GLWrap_.prototype.textureCount = function ()
	{
		return all_textures.length;
	};
	GLWrap_.prototype.setRenderingToTexture = function (tex)
	{
		if (tex === this.renderToTex)
			return;
;
		var b = this.pushBatch();
		b.type = BATCH_RENDERTOTEXTURE;
		b.texParam = tex;
		this.renderToTex = tex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	cr.GLWrap = GLWrap_;
}());
;
(function()
{
	var raf = window["requestAnimationFrame"] ||
	  window["mozRequestAnimationFrame"]    ||
	  window["webkitRequestAnimationFrame"] ||
	  window["msRequestAnimationFrame"]     ||
	  window["oRequestAnimationFrame"];
	function Runtime(canvas)
	{
		if (!canvas || (!canvas.getContext && !canvas["dc"]))
			return;
		if (canvas["c2runtime"])
			return;
		else
			canvas["c2runtime"] = this;
		var self = this;
		this.isCrosswalk = /crosswalk/i.test(navigator.userAgent) || /xwalk/i.test(navigator.userAgent) || !!(typeof window["c2isCrosswalk"] !== "undefined" && window["c2isCrosswalk"]);
		this.isCordova = this.isCrosswalk || (typeof window["device"] !== "undefined" && (typeof window["device"]["cordova"] !== "undefined" || typeof window["device"]["phonegap"] !== "undefined")) || (typeof window["c2iscordova"] !== "undefined" && window["c2iscordova"]);
		this.isPhoneGap = this.isCordova;
		this.isDirectCanvas = !!canvas["dc"];
		this.isAppMobi = (typeof window["AppMobi"] !== "undefined" || this.isDirectCanvas);
		this.isCocoonJs = !!window["c2cocoonjs"];
		this.isEjecta = !!window["c2ejecta"];
		if (this.isCocoonJs)
		{
			CocoonJS["App"]["onSuspended"].addEventListener(function() {
				self["setSuspended"](true);
			});
			CocoonJS["App"]["onActivated"].addEventListener(function () {
				self["setSuspended"](false);
			});
		}
		if (this.isEjecta)
		{
			document.addEventListener("pagehide", function() {
				self["setSuspended"](true);
			});
			document.addEventListener("pageshow", function() {
				self["setSuspended"](false);
			});
			document.addEventListener("resize", function () {
				self["setSize"](window.innerWidth, window.innerHeight);
			});
		}
		this.isDomFree = (this.isDirectCanvas || this.isCocoonJs || this.isEjecta);
		this.isMicrosoftEdge = /edge\//i.test(navigator.userAgent);
		this.isIE = (/msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent) || /iemobile/i.test(navigator.userAgent)) && !this.isMicrosoftEdge;
		this.isTizen = /tizen/i.test(navigator.userAgent);
		this.isAndroid = /android/i.test(navigator.userAgent) && !this.isTizen && !this.isIE && !this.isMicrosoftEdge;		// IE mobile and Tizen masquerade as Android
		this.isiPhone = (/iphone/i.test(navigator.userAgent) || /ipod/i.test(navigator.userAgent)) && !this.isIE && !this.isMicrosoftEdge;	// treat ipod as an iphone; IE mobile masquerades as iPhone
		this.isiPad = /ipad/i.test(navigator.userAgent);
		this.isiOS = this.isiPhone || this.isiPad || this.isEjecta;
		this.isiPhoneiOS6 = (this.isiPhone && /os\s6/i.test(navigator.userAgent));
		this.isChrome = (/chrome/i.test(navigator.userAgent) || /chromium/i.test(navigator.userAgent)) && !this.isIE && !this.isMicrosoftEdge;	// note true on Chromium-based webview on Android 4.4+; IE 'Edge' mode also pretends to be Chrome
		this.isAmazonWebApp = /amazonwebappplatform/i.test(navigator.userAgent);
		this.isFirefox = /firefox/i.test(navigator.userAgent);
		this.isSafari = /safari/i.test(navigator.userAgent) && !this.isChrome && !this.isIE && !this.isMicrosoftEdge;		// Chrome and IE Mobile masquerade as Safari
		this.isWindows = /windows/i.test(navigator.userAgent);
		this.isNWjs = (typeof window["c2nodewebkit"] !== "undefined" || typeof window["c2nwjs"] !== "undefined" || /nodewebkit/i.test(navigator.userAgent) || /nwjs/i.test(navigator.userAgent));
		this.isNodeWebkit = this.isNWjs;		// old name for backwards compat
		this.isArcade = (typeof window["is_scirra_arcade"] !== "undefined");
		this.isWindows8App = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);
		this.isWindows8Capable = !!(typeof window["c2isWindows8Capable"] !== "undefined" && window["c2isWindows8Capable"]);
		this.isWindowsPhone8 = !!(typeof window["c2isWindowsPhone8"] !== "undefined" && window["c2isWindowsPhone8"]);
		this.isWindowsPhone81 = !!(typeof window["c2isWindowsPhone81"] !== "undefined" && window["c2isWindowsPhone81"]);
		this.isWindows10 = !!window["cr_windows10"];
		this.isWinJS = (this.isWindows8App || this.isWindows8Capable || this.isWindowsPhone81 || this.isWindows10);	// note not WP8.0
		this.isBlackberry10 = !!(typeof window["c2isBlackberry10"] !== "undefined" && window["c2isBlackberry10"]);
		this.isAndroidStockBrowser = (this.isAndroid && !this.isChrome && !this.isCrosswalk && !this.isFirefox && !this.isAmazonWebApp && !this.isDomFree);
		this.devicePixelRatio = 1;
		this.isMobile = (this.isCordova || this.isCrosswalk || this.isAppMobi || this.isCocoonJs || this.isAndroid || this.isiOS || this.isWindowsPhone8 || this.isWindowsPhone81 || this.isBlackberry10 || this.isTizen || this.isEjecta);
		if (!this.isMobile)
		{
			this.isMobile = /(blackberry|bb10|playbook|palm|symbian|nokia|windows\s+ce|phone|mobile|tablet|kindle|silk)/i.test(navigator.userAgent);
		}
		this.isWKWebView = !!(this.isiOS && this.isCordova && window["webkit"]);
		if (typeof cr_is_preview !== "undefined" && !this.isNWjs && (window.location.search === "?nw" || /nodewebkit/i.test(navigator.userAgent) || /nwjs/i.test(navigator.userAgent)))
		{
			this.isNWjs = true;
		}
		this.isDebug = (typeof cr_is_preview !== "undefined" && window.location.search.indexOf("debug") > -1);
		this.canvas = canvas;
		this.canvasdiv = document.getElementById("c2canvasdiv");
		this.gl = null;
		this.glwrap = null;
		this.glUnmaskedRenderer = "(unavailable)";
		this.enableFrontToBack = false;
		this.earlyz_index = 0;
		this.ctx = null;
		this.firstInFullscreen = false;
		this.oldWidth = 0;		// for restoring non-fullscreen canvas after fullscreen
		this.oldHeight = 0;
		this.canvas.oncontextmenu = function (e) { if (e.preventDefault) e.preventDefault(); return false; };
		this.canvas.onselectstart = function (e) { if (e.preventDefault) e.preventDefault(); return false; };
		this.canvas.ontouchstart = function (e) { if(e.preventDefault) e.preventDefault(); return false; };
		if (this.isDirectCanvas)
			window["c2runtime"] = this;
		if (this.isNWjs)
		{
			window["ondragover"] = function(e) { e.preventDefault(); return false; };
			window["ondrop"] = function(e) { e.preventDefault(); return false; };
			if (window["nwgui"] && window["nwgui"]["App"]["clearCache"])
				window["nwgui"]["App"]["clearCache"]();
		}
		if (this.isAndroidStockBrowser && typeof jQuery !== "undefined")
		{
			jQuery("canvas").parents("*").css("overflow", "visible");
		}
		this.width = canvas.width;
		this.height = canvas.height;
		this.draw_width = this.width;
		this.draw_height = this.height;
		this.cssWidth = this.width;
		this.cssHeight = this.height;
		this.lastWindowWidth = window.innerWidth;
		this.lastWindowHeight = window.innerHeight;
		this.forceCanvasAlpha = false;		// note: now unused, left for backwards compat since plugins could modify it
		this.redraw = true;
		this.isSuspended = false;
		if (!Date.now) {
		  Date.now = function now() {
			return +new Date();
		  };
		}
		this.plugins = [];
		this.types = {};
		this.types_by_index = [];
		this.behaviors = [];
		this.layouts = {};
		this.layouts_by_index = [];
		this.eventsheets = {};
		this.eventsheets_by_index = [];
		this.wait_for_textures = [];        // for blocking until textures loaded
		this.triggers_to_postinit = [];
		this.all_global_vars = [];
		this.all_local_vars = [];
		this.solidBehavior = null;
		this.jumpthruBehavior = null;
		this.shadowcasterBehavior = null;
		this.deathRow = {};
		this.hasPendingInstances = false;		// true if anything exists in create row or death row
		this.isInClearDeathRow = false;
		this.isInOnDestroy = 0;					// needs to support recursion so increments and decrements and is true if > 0
		this.isRunningEvents = false;
		this.isEndingLayout = false;
		this.createRow = [];
		this.isLoadingState = false;
		this.saveToSlot = "";
		this.loadFromSlot = "";
		this.loadFromJson = null;			// set to string when there is something to try to load
		this.lastSaveJson = "";
		this.signalledContinuousPreview = false;
		this.suspendDrawing = false;		// for hiding display until continuous preview loads
		this.fireOnCreateAfterLoad = [];	// for delaying "On create" triggers until loading complete
		this.dt = 0;
        this.dt1 = 0;
		this.minimumFramerate = 30;
		this.logictime = 0;			// used to calculate CPUUtilisation
		this.cpuutilisation = 0;
        this.timescale = 1.0;
        this.kahanTime = new cr.KahanAdder();
		this.wallTime = new cr.KahanAdder();
		this.last_tick_time = 0;
		this.fps = 0;
		this.last_fps_time = 0;
		this.tickcount = 0;
		this.tickcount_nosave = 0;	// same as tickcount but never saved/loaded
		this.execcount = 0;
		this.framecount = 0;        // for fps
		this.objectcount = 0;
		this.changelayout = null;
		this.destroycallbacks = [];
		this.event_stack = [];
		this.event_stack_index = -1;
		this.localvar_stack = [[]];
		this.localvar_stack_index = 0;
		this.trigger_depth = 0;		// recursion depth for triggers
		this.pushEventStack(null);
		this.loop_stack = [];
		this.loop_stack_index = -1;
		this.next_uid = 0;
		this.next_puid = 0;		// permanent unique ids
		this.layout_first_tick = true;
		this.family_count = 0;
		this.suspend_events = [];
		this.raf_id = -1;
		this.timeout_id = -1;
		this.isloading = true;
		this.loadingprogress = 0;
		this.isNodeFullscreen = false;
		this.stackLocalCount = 0;	// number of stack-based local vars for recursion
		this.audioInstance = null;
		this.had_a_click = false;
		this.isInUserInputEvent = false;
		this.objects_to_pretick = new cr.ObjectSet();
        this.objects_to_tick = new cr.ObjectSet();
		this.objects_to_tick2 = new cr.ObjectSet();
		this.registered_collisions = [];
		this.temp_poly = new cr.CollisionPoly([]);
		this.temp_poly2 = new cr.CollisionPoly([]);
		this.allGroups = [];				// array of all event groups
        this.groups_by_name = {};
		this.cndsBySid = {};
		this.actsBySid = {};
		this.varsBySid = {};
		this.blocksBySid = {};
		this.running_layout = null;			// currently running layout
		this.layer_canvas = null;			// for layers "render-to-texture"
		this.layer_ctx = null;
		this.layer_tex = null;
		this.layout_tex = null;
		this.layout_canvas = null;
		this.layout_ctx = null;
		this.is_WebGL_context_lost = false;
		this.uses_background_blending = false;	// if any shader uses background blending, so entire layout renders to texture
		this.fx_tex = [null, null];
		this.fullscreen_scaling = 0;
		this.files_subfolder = "";			// path with project files
		this.objectsByUid = {};				// maps every in-use UID (as a string) to its instance
		this.loaderlogos = null;
		this.snapshotCanvas = null;
		this.snapshotData = "";
		this.objectRefTable = [];
		this.requestProjectData();
	};
	Runtime.prototype.requestProjectData = function ()
	{
		var self = this;
		if (this.isWKWebView)
		{
			this.fetchLocalFileViaCordovaAsText("data.js", function (str)
			{
				self.loadProject(JSON.parse(str));
			}, function (err)
			{
				alert("Error fetching data.js");
			});
			return;
		}
		var xhr;
		if (this.isWindowsPhone8)
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		else
			xhr = new XMLHttpRequest();
		var datajs_filename = "data.js";
		if (this.isWindows8App || this.isWindowsPhone8 || this.isWindowsPhone81 || this.isWindows10)
			datajs_filename = "data.json";
		xhr.open("GET", datajs_filename, true);
		var supportsJsonResponse = false;
		if (!this.isDomFree && ("response" in xhr) && ("responseType" in xhr))
		{
			try {
				xhr["responseType"] = "json";
				supportsJsonResponse = (xhr["responseType"] === "json");
			}
			catch (e) {
				supportsJsonResponse = false;
			}
		}
		if (!supportsJsonResponse && ("responseType" in xhr))
		{
			try {
				xhr["responseType"] = "text";
			}
			catch (e) {}
		}
		if ("overrideMimeType" in xhr)
		{
			try {
				xhr["overrideMimeType"]("application/json; charset=utf-8");
			}
			catch (e) {}
		}
		if (this.isWindowsPhone8)
		{
			xhr.onreadystatechange = function ()
			{
				if (xhr.readyState !== 4)
					return;
				self.loadProject(JSON.parse(xhr["responseText"]));
			};
		}
		else
		{
			xhr.onload = function ()
			{
				if (supportsJsonResponse)
				{
					self.loadProject(xhr["response"]);					// already parsed by browser
				}
				else
				{
					if (self.isEjecta)
					{
						var str = xhr["responseText"];
						str = str.substr(str.indexOf("{"));		// trim any BOM
						self.loadProject(JSON.parse(str));
					}
					else
					{
						self.loadProject(JSON.parse(xhr["responseText"]));	// forced to sync parse JSON
					}
				}
			};
			xhr.onerror = function (e)
			{
				cr.logerror("Error requesting " + datajs_filename + ":");
				cr.logerror(e);
			};
		}
		xhr.send();
	};
	Runtime.prototype.initRendererAndLoader = function ()
	{
		var self = this;
		var i, len, j, lenj, k, lenk, t, s, l, y;
		this.isRetina = ((!this.isDomFree || this.isEjecta || this.isCordova) && this.useHighDpi && !this.isAndroidStockBrowser);
		if (this.fullscreen_mode === 0 && this.isiOS)
			this.isRetina = false;
		this.devicePixelRatio = (this.isRetina ? (window["devicePixelRatio"] || window["webkitDevicePixelRatio"] || window["mozDevicePixelRatio"] || window["msDevicePixelRatio"] || 1) : 1);
		if (typeof window["StatusBar"] === "object")
			window["StatusBar"]["hide"]();
		this.ClearDeathRow();
		var attribs;
		if (this.fullscreen_mode > 0)
			this["setSize"](window.innerWidth, window.innerHeight, true);
		this.canvas.addEventListener("webglcontextlost", function (ev) {
			ev.preventDefault();
			self.onContextLost();
			cr.logexport("[PlotyXD] WebGL context lost");
			window["cr_setSuspended"](true);		// stop rendering
		}, false);
		this.canvas.addEventListener("webglcontextrestored", function (ev) {
			self.glwrap.initState();
			self.glwrap.setSize(self.glwrap.width, self.glwrap.height, true);
			self.layer_tex = null;
			self.layout_tex = null;
			self.fx_tex[0] = null;
			self.fx_tex[1] = null;
			self.onContextRestored();
			self.redraw = true;
			cr.logexport("[PlotyXD] WebGL context restored");
			window["cr_setSuspended"](false);		// resume rendering
		}, false);
		try {
			if (this.enableWebGL && (this.isCocoonJs || this.isEjecta || !this.isDomFree))
			{
				attribs = {
					"alpha": true,
					"depth": false,
					"antialias": false,
					"powerPreference": "high-performance",
					"failIfMajorPerformanceCaveat": true
				};
				if (!this.isAndroid)
					this.gl = this.canvas.getContext("webgl2", attribs);
				if (!this.gl)
				{
					this.gl = (this.canvas.getContext("webgl", attribs) ||
							   this.canvas.getContext("experimental-webgl", attribs));
				}
			}
		}
		catch (e) {
		}
		if (this.gl)
		{
			var isWebGL2 = (this.gl.getParameter(this.gl.VERSION).indexOf("WebGL 2") === 0);
			var debug_ext = this.gl.getExtension("WEBGL_debug_renderer_info");
			if (debug_ext)
			{
				var unmasked_vendor = this.gl.getParameter(debug_ext.UNMASKED_VENDOR_WEBGL);
				var unmasked_renderer = this.gl.getParameter(debug_ext.UNMASKED_RENDERER_WEBGL);
				this.glUnmaskedRenderer = unmasked_renderer + " [" + unmasked_vendor + "]";
			}
			if (this.enableFrontToBack)
				this.glUnmaskedRenderer += " [front-to-back enabled]";
;
			if (!this.isDomFree)
			{
				this.overlay_canvas = document.createElement("canvas");
				jQuery(this.overlay_canvas).appendTo(this.canvas.parentNode);
				this.overlay_canvas.oncontextmenu = function (e) { return false; };
				this.overlay_canvas.onselectstart = function (e) { return false; };
				this.overlay_canvas.width = Math.round(this.cssWidth * this.devicePixelRatio);
				this.overlay_canvas.height = Math.round(this.cssHeight * this.devicePixelRatio);
				jQuery(this.overlay_canvas).css({"width": this.cssWidth + "px",
												"height": this.cssHeight + "px"});
				this.positionOverlayCanvas();
				this.overlay_ctx = this.overlay_canvas.getContext("2d");
			}
			this.glwrap = new cr.GLWrap(this.gl, this.isMobile, this.enableFrontToBack);
			this.glwrap.setSize(this.canvas.width, this.canvas.height);
			this.glwrap.enable_mipmaps = (this.downscalingQuality !== 0);
			this.ctx = null;
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				for (j = 0, lenj = t.effect_types.length; j < lenj; j++)
				{
					s = t.effect_types[j];
					s.shaderindex = this.glwrap.getShaderIndex(s.id);
					s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
					this.uses_background_blending = this.uses_background_blending || this.glwrap.programUsesDest(s.shaderindex);
				}
			}
			for (i = 0, len = this.layouts_by_index.length; i < len; i++)
			{
				l = this.layouts_by_index[i];
				for (j = 0, lenj = l.effect_types.length; j < lenj; j++)
				{
					s = l.effect_types[j];
					s.shaderindex = this.glwrap.getShaderIndex(s.id);
					s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
				}
				l.updateActiveEffects();		// update preserves opaqueness flag
				for (j = 0, lenj = l.layers.length; j < lenj; j++)
				{
					y = l.layers[j];
					for (k = 0, lenk = y.effect_types.length; k < lenk; k++)
					{
						s = y.effect_types[k];
						s.shaderindex = this.glwrap.getShaderIndex(s.id);
						s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
						this.uses_background_blending = this.uses_background_blending || this.glwrap.programUsesDest(s.shaderindex);
					}
					y.updateActiveEffects();		// update preserves opaqueness flag
				}
			}
		}
		else
		{
			if (this.fullscreen_mode > 0 && this.isDirectCanvas)
			{
;
				this.canvas = null;
				document.oncontextmenu = function (e) { return false; };
				document.onselectstart = function (e) { return false; };
				this.ctx = AppMobi["canvas"]["getContext"]("2d");
				try {
					this.ctx["samplingMode"] = this.linearSampling ? "smooth" : "sharp";
					this.ctx["globalScale"] = 1;
					this.ctx["HTML5CompatibilityMode"] = true;
					this.ctx["imageSmoothingEnabled"] = this.linearSampling;
				} catch(e){}
				if (this.width !== 0 && this.height !== 0)
				{
					this.ctx.width = this.width;
					this.ctx.height = this.height;
				}
			}
			if (!this.ctx)
			{
;
				if (this.isCocoonJs)
				{
					attribs = {
						"antialias": !!this.linearSampling,
						"alpha": true
					};
					this.ctx = this.canvas.getContext("2d", attribs);
				}
				else
				{
					attribs = {
						"alpha": true
					};
					this.ctx = this.canvas.getContext("2d", attribs);
				}
				this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
			}
			this.overlay_canvas = null;
			this.overlay_ctx = null;
		}
		this.tickFunc = function (timestamp) { self.tick(false, timestamp); };
		if (window != window.top && !this.isDomFree && !this.isWinJS && !this.isWindowsPhone8)
		{
			document.addEventListener("mousedown", function () {
				window.focus();
			}, true);
			document.addEventListener("touchstart", function () {
				window.focus();
			}, true);
		}
		if (typeof cr_is_preview !== "undefined")
		{
			if (this.isCocoonJs)
				console.log("[PlotyXD] In preview-over-wifi via CocoonJS mode");
			if (window.location.search.indexOf("continuous") > -1)
			{
				cr.logexport("Reloading for continuous preview");
				this.loadFromSlot = "__c2_continuouspreview";
				this.suspendDrawing = true;
			}
			if (this.pauseOnBlur && !this.isMobile)
			{
				jQuery(window).focus(function ()
				{
					self["setSuspended"](false);
				});
				jQuery(window).blur(function ()
				{
					var parent = window.parent;
					if (!parent || !parent.document.hasFocus())
						self["setSuspended"](true);
				});
			}
		}
		window.addEventListener("blur", function () {
			self.onWindowBlur();
		});
		if (!this.isDomFree)
		{
			var unfocusFormControlFunc = function (e) {
				if (cr.isCanvasInputEvent(e) && document["activeElement"] && document["activeElement"] !== document.getElementsByTagName("body")[0] && document["activeElement"].blur)
				{
					try {
						document["activeElement"].blur();
					}
					catch (e) {}
				}
			}
			if (typeof PointerEvent !== "undefined")
			{
				document.addEventListener("pointerdown", unfocusFormControlFunc);
			}
			else if (window.navigator["msPointerEnabled"])
			{
				document.addEventListener("MSPointerDown", unfocusFormControlFunc);
			}
			else
			{
				document.addEventListener("touchstart", unfocusFormControlFunc);
			}
			document.addEventListener("mousedown", unfocusFormControlFunc);
		}
		if (this.fullscreen_mode === 0 && this.isRetina && this.devicePixelRatio > 1)
		{
			this["setSize"](this.original_width, this.original_height, true);
		}
		this.tryLockOrientation();
		this.getready();	// determine things to preload
		this.go();			// run loading screen
		this.extra = {};
		cr.seal(this);
	};
	var webkitRepaintFlag = false;
	Runtime.prototype["setSize"] = function (w, h, force)
	{
		var offx = 0, offy = 0;
		var neww = 0, newh = 0, intscale = 0;
		if (this.lastWindowWidth === w && this.lastWindowHeight === h && !force)
			return;
		this.lastWindowWidth = w;
		this.lastWindowHeight = h;
		var mode = this.fullscreen_mode;
		var orig_aspect, cur_aspect;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen) && !this.isCordova;
		if (!isfullscreen && this.fullscreen_mode === 0 && !force)
			return;			// ignore size events when not fullscreen and not using a fullscreen-in-browser mode
		if (isfullscreen)
			mode = this.fullscreen_scaling;
		var dpr = this.devicePixelRatio;
		if (mode >= 4)
		{
			if (mode === 5 && dpr !== 1)	// integer scaling
			{
				w += 1;
				h += 1;
			}
			orig_aspect = this.original_width / this.original_height;
			cur_aspect = w / h;
			if (cur_aspect > orig_aspect)
			{
				neww = h * orig_aspect;
				if (mode === 5)	// integer scaling
				{
					intscale = (neww * dpr) / this.original_width;
					if (intscale > 1)
						intscale = Math.floor(intscale);
					else if (intscale < 1)
						intscale = 1 / Math.ceil(1 / intscale);
					neww = this.original_width * intscale / dpr;
					newh = this.original_height * intscale / dpr;
					offx = (w - neww) / 2;
					offy = (h - newh) / 2;
					w = neww;
					h = newh;
				}
				else
				{
					offx = (w - neww) / 2;
					w = neww;
				}
			}
			else
			{
				newh = w / orig_aspect;
				if (mode === 5)	// integer scaling
				{
					intscale = (newh * dpr) / this.original_height;
					if (intscale > 1)
						intscale = Math.floor(intscale);
					else if (intscale < 1)
						intscale = 1 / Math.ceil(1 / intscale);
					neww = this.original_width * intscale / dpr;
					newh = this.original_height * intscale / dpr;
					offx = (w - neww) / 2;
					offy = (h - newh) / 2;
					w = neww;
					h = newh;
				}
				else
				{
					offy = (h - newh) / 2;
					h = newh;
				}
			}
		}
		else if (isfullscreen && mode === 0)
		{
			offx = Math.floor((w - this.original_width) / 2);
			offy = Math.floor((h - this.original_height) / 2);
			w = this.original_width;
			h = this.original_height;
		}
		if (mode < 2)
			this.aspect_scale = dpr;
		this.cssWidth = Math.round(w);
		this.cssHeight = Math.round(h);
		this.width = Math.round(w * dpr);
		this.height = Math.round(h * dpr);
		this.redraw = true;
		if (this.wantFullscreenScalingQuality)
		{
			this.draw_width = this.width;
			this.draw_height = this.height;
			this.fullscreenScalingQuality = true;
		}
		else
		{
			if ((this.width < this.original_width && this.height < this.original_height) || mode === 1)
			{
				this.draw_width = this.width;
				this.draw_height = this.height;
				this.fullscreenScalingQuality = true;
			}
			else
			{
				this.draw_width = this.original_width;
				this.draw_height = this.original_height;
				this.fullscreenScalingQuality = false;
				/*var orig_aspect = this.original_width / this.original_height;
				var cur_aspect = this.width / this.height;
				if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
					this.aspect_scale = this.height / this.original_height;
				else
					this.aspect_scale = this.width / this.original_width;*/
				if (mode === 2)		// scale inner
				{
					orig_aspect = this.original_width / this.original_height;
					cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
					if (cur_aspect < orig_aspect)
						this.draw_width = this.draw_height * cur_aspect;
					else if (cur_aspect > orig_aspect)
						this.draw_height = this.draw_width / cur_aspect;
				}
				else if (mode === 3)
				{
					orig_aspect = this.original_width / this.original_height;
					cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
					if (cur_aspect > orig_aspect)
						this.draw_width = this.draw_height * cur_aspect;
					else if (cur_aspect < orig_aspect)
						this.draw_height = this.draw_width / cur_aspect;
				}
			}
		}
		if (this.canvasdiv && !this.isDomFree)
		{
			jQuery(this.canvasdiv).css({"width": Math.round(w) + "px",
										"height": Math.round(h) + "px",
										"margin-left": Math.floor(offx) + "px",
										"margin-top": Math.floor(offy) + "px"});
			if (typeof cr_is_preview !== "undefined")
			{
				jQuery("#borderwrap").css({"width": Math.round(w) + "px",
											"height": Math.round(h) + "px"});
			}
		}
		if (this.canvas)
		{
			this.canvas.width = Math.round(w * dpr);
			this.canvas.height = Math.round(h * dpr);
			if (this.isEjecta)
			{
				this.canvas.style.left = Math.floor(offx) + "px";
				this.canvas.style.top = Math.floor(offy) + "px";
				this.canvas.style.width = Math.round(w) + "px";
				this.canvas.style.height = Math.round(h) + "px";
			}
			else if (this.isRetina && !this.isDomFree)
			{
				this.canvas.style.width = Math.round(w) + "px";
				this.canvas.style.height = Math.round(h) + "px";
			}
		}
		if (this.overlay_canvas)
		{
			this.overlay_canvas.width = Math.round(w * dpr);
			this.overlay_canvas.height = Math.round(h * dpr);
			this.overlay_canvas.style.width = this.cssWidth + "px";
			this.overlay_canvas.style.height = this.cssHeight + "px";
		}
		if (this.glwrap)
		{
			this.glwrap.setSize(Math.round(w * dpr), Math.round(h * dpr));
		}
		if (this.isDirectCanvas && this.ctx)
		{
			this.ctx.width = Math.round(w);
			this.ctx.height = Math.round(h);
		}
		if (this.ctx)
		{
			this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
		}
		this.tryLockOrientation();
		if (this.isiPhone && !this.isCordova)
		{
			window.scrollTo(0, 0);
		}
	};
	Runtime.prototype.tryLockOrientation = function ()
	{
		if (!this.autoLockOrientation || this.orientations === 0)
			return;
		var orientation = "portrait";
		if (this.orientations === 2)
			orientation = "landscape";
		try {
			if (screen["orientation"] && screen["orientation"]["lock"])
				screen["orientation"]["lock"](orientation).catch(function(){});
			else if (screen["lockOrientation"])
				screen["lockOrientation"](orientation);
			else if (screen["webkitLockOrientation"])
				screen["webkitLockOrientation"](orientation);
			else if (screen["mozLockOrientation"])
				screen["mozLockOrientation"](orientation);
			else if (screen["msLockOrientation"])
				screen["msLockOrientation"](orientation);
		}
		catch (e)
		{
			if (console && console.warn)
				console.warn("Failed to lock orientation: ", e);
		}
	};
	Runtime.prototype.onContextLost = function ()
	{
		this.glwrap.contextLost();
		this.is_WebGL_context_lost = true;
		var i, len, t;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onLostWebGLContext)
				t.onLostWebGLContext();
		}
	};
	Runtime.prototype.onContextRestored = function ()
	{
		this.is_WebGL_context_lost = false;
		var i, len, t;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onRestoreWebGLContext)
				t.onRestoreWebGLContext();
		}
	};
	Runtime.prototype.positionOverlayCanvas = function()
	{
		if (this.isDomFree)
			return;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"] || this.isNodeFullscreen) && !this.isCordova;
		var overlay_position = isfullscreen ? jQuery(this.canvas).offset() : jQuery(this.canvas).position();
		overlay_position.position = "absolute";
		jQuery(this.overlay_canvas).css(overlay_position);
	};
	var caf = window["cancelAnimationFrame"] ||
	  window["mozCancelAnimationFrame"]    ||
	  window["webkitCancelAnimationFrame"] ||
	  window["msCancelAnimationFrame"]     ||
	  window["oCancelAnimationFrame"];
	Runtime.prototype["setSuspended"] = function (s)
	{
		var i, len;
		var self = this;
		if (s && !this.isSuspended)
		{
			cr.logexport("[PlotyXD] Suspending");
			this.isSuspended = true;			// next tick will be last
			if (this.raf_id !== -1 && caf)		// note: CocoonJS does not implement cancelAnimationFrame
				caf(this.raf_id);
			if (this.timeout_id !== -1)
				clearTimeout(this.timeout_id);
			for (i = 0, len = this.suspend_events.length; i < len; i++)
				this.suspend_events[i](true);
		}
		else if (!s && this.isSuspended)
		{
			cr.logexport("[PlotyXD] Resuming");
			this.isSuspended = false;
			this.last_tick_time = cr.performance_now();	// ensure first tick is a zero-dt one
			this.last_fps_time = cr.performance_now();	// reset FPS counter
			this.framecount = 0;
			this.logictime = 0;
			for (i = 0, len = this.suspend_events.length; i < len; i++)
				this.suspend_events[i](false);
			this.tick(false);						// kick off runtime again
		}
	};
	Runtime.prototype.addSuspendCallback = function (f)
	{
		this.suspend_events.push(f);
	};
	Runtime.prototype.GetObjectReference = function (i)
	{
;
		return this.objectRefTable[i];
	};
	Runtime.prototype.loadProject = function (data_response)
	{
;
		if (!data_response || !data_response["project"])
			cr.logerror("Project model unavailable");
		var pm = data_response["project"];
		this.name = pm[0];
		this.first_layout = pm[1];
		this.fullscreen_mode = pm[12];	// 0 = off, 1 = crop, 2 = scale inner, 3 = scale outer, 4 = letterbox scale, 5 = integer letterbox scale
		this.fullscreen_mode_set = pm[12];
		this.original_width = pm[10];
		this.original_height = pm[11];
		this.parallax_x_origin = this.original_width / 2;
		this.parallax_y_origin = this.original_height / 2;
		if (this.isDomFree && !this.isEjecta && (pm[12] >= 4 || pm[12] === 0))
		{
			cr.logexport("[PlotyXD] Letterbox scale fullscreen modes are not supported on this platform - falling back to 'Scale outer'");
			this.fullscreen_mode = 3;
			this.fullscreen_mode_set = 3;
		}
		this.uses_loader_layout = pm[18];
		this.loaderstyle = pm[19];
		if (this.loaderstyle === 0)
		{
			var loaderImage = new Image();
			loaderImage.crossOrigin = "anonymous";
			this.setImageSrc(loaderImage, "loading-logo.png");
			this.loaderlogos = {
				logo: loaderImage
			};
		}
		else if (this.loaderstyle === 4)	// c2 splash
		{
			var loaderC2logo_1024 = new Image();
			loaderC2logo_1024.src = "";
			var loaderC2logo_512 = new Image();
			loaderC2logo_512.src = "";
			var loaderC2logo_256 = new Image();
			loaderC2logo_256.src = "";
			var loaderC2logo_128 = new Image();
			loaderC2logo_128.src = "";
			var loaderPowered_1024 = new Image();
			loaderPowered_1024.src = "";
			var loaderPowered_512 = new Image();
			loaderPowered_512.src = "";
			var loaderPowered_256 = new Image();
			loaderPowered_256.src = "";
			var loaderPowered_128 = new Image();
			loaderPowered_128.src = "";
			var loaderWebsite_1024 = new Image();
			loaderWebsite_1024.src = "";
			var loaderWebsite_512 = new Image();
			loaderWebsite_512.src = "";
			var loaderWebsite_256 = new Image();
			loaderWebsite_256.src = "";
			var loaderWebsite_128 = new Image();
			loaderWebsite_128.src = "";
			this.loaderlogos = {
				logo: [loaderC2logo_1024, loaderC2logo_512, loaderC2logo_256, loaderC2logo_128],
				powered: [loaderPowered_1024, loaderPowered_512, loaderPowered_256, loaderPowered_128],
				website: [loaderWebsite_1024, loaderWebsite_512, loaderWebsite_256, loaderWebsite_128]
			};
		}
		this.next_uid = pm[21];
		this.objectRefTable = cr.getObjectRefTable();
		this.system = new cr.system_object(this);
		var i, len, j, lenj, k, lenk, idstr, m, b, t, f, p;
		var plugin, plugin_ctor;
		for (i = 0, len = pm[2].length; i < len; i++)
		{
			m = pm[2][i];
			p = this.GetObjectReference(m[0]);
;
			cr.add_common_aces(m, p.prototype);
			plugin = new p(this);
			plugin.singleglobal = m[1];
			plugin.is_world = m[2];
			plugin.is_rotatable = m[5];
			plugin.must_predraw = m[9];
			if (plugin.onCreate)
				plugin.onCreate();  // opportunity to override default ACEs
			cr.seal(plugin);
			this.plugins.push(plugin);
		}
		this.objectRefTable = cr.getObjectRefTable();
		for (i = 0, len = pm[3].length; i < len; i++)
		{
			m = pm[3][i];
			plugin_ctor = this.GetObjectReference(m[1]);
;
			plugin = null;
			for (j = 0, lenj = this.plugins.length; j < lenj; j++)
			{
				if (this.plugins[j] instanceof plugin_ctor)
				{
					plugin = this.plugins[j];
					break;
				}
			}
;
;
			var type_inst = new plugin.Type(plugin);
;
			type_inst.name = m[0];
			type_inst.is_family = m[2];
			type_inst.instvar_sids = m[3].slice(0);
			type_inst.vars_count = m[3].length;
			type_inst.behs_count = m[4];
			type_inst.fx_count = m[5];
			type_inst.sid = m[11];
			if (type_inst.is_family)
			{
				type_inst.members = [];				// types in this family
				type_inst.family_index = this.family_count++;
				type_inst.families = null;
			}
			else
			{
				type_inst.members = null;
				type_inst.family_index = -1;
				type_inst.families = [];			// families this type belongs to
			}
			type_inst.family_var_map = null;
			type_inst.family_beh_map = null;
			type_inst.family_fx_map = null;
			type_inst.is_contained = false;
			type_inst.container = null;
			if (m[6])
			{
				type_inst.texture_file = m[6][0];
				type_inst.texture_filesize = m[6][1];
				type_inst.texture_pixelformat = m[6][2];
			}
			else
			{
				type_inst.texture_file = null;
				type_inst.texture_filesize = 0;
				type_inst.texture_pixelformat = 0;		// rgba8
			}
			if (m[7])
			{
				type_inst.animations = m[7];
			}
			else
			{
				type_inst.animations = null;
			}
			type_inst.index = i;                                // save index in to types array in type
			type_inst.instances = [];                           // all instances of this type
			type_inst.deadCache = [];							// destroyed instances to recycle next create
			type_inst.solstack = [new cr.selection(type_inst)]; // initialise SOL stack with one empty SOL
			type_inst.cur_sol = 0;
			type_inst.default_instance = null;
			type_inst.default_layerindex = 0;
			type_inst.stale_iids = true;
			type_inst.updateIIDs = cr.type_updateIIDs;
			type_inst.getFirstPicked = cr.type_getFirstPicked;
			type_inst.getPairedInstance = cr.type_getPairedInstance;
			type_inst.getCurrentSol = cr.type_getCurrentSol;
			type_inst.pushCleanSol = cr.type_pushCleanSol;
			type_inst.pushCopySol = cr.type_pushCopySol;
			type_inst.popSol = cr.type_popSol;
			type_inst.getBehaviorByName = cr.type_getBehaviorByName;
			type_inst.getBehaviorIndexByName = cr.type_getBehaviorIndexByName;
			type_inst.getEffectIndexByName = cr.type_getEffectIndexByName;
			type_inst.applySolToContainer = cr.type_applySolToContainer;
			type_inst.getInstanceByIID = cr.type_getInstanceByIID;
			type_inst.collision_grid = new cr.SparseGrid(this.original_width, this.original_height);
			type_inst.any_cell_changed = true;
			type_inst.any_instance_parallaxed = false;
			type_inst.extra = {};
			type_inst.toString = cr.type_toString;
			type_inst.behaviors = [];
			for (j = 0, lenj = m[8].length; j < lenj; j++)
			{
				b = m[8][j];
				var behavior_ctor = this.GetObjectReference(b[1]);
				var behavior_plugin = null;
				for (k = 0, lenk = this.behaviors.length; k < lenk; k++)
				{
					if (this.behaviors[k] instanceof behavior_ctor)
					{
						behavior_plugin = this.behaviors[k];
						break;
					}
				}
				if (!behavior_plugin)
				{
					behavior_plugin = new behavior_ctor(this);
					behavior_plugin.my_types = [];						// types using this behavior
					behavior_plugin.my_instances = new cr.ObjectSet(); 	// instances of this behavior
					if (behavior_plugin.onCreate)
						behavior_plugin.onCreate();
					cr.seal(behavior_plugin);
					this.behaviors.push(behavior_plugin);
					if (cr.behaviors.solid && behavior_plugin instanceof cr.behaviors.solid)
						this.solidBehavior = behavior_plugin;
					if (cr.behaviors.jumpthru && behavior_plugin instanceof cr.behaviors.jumpthru)
						this.jumpthruBehavior = behavior_plugin;
					if (cr.behaviors.shadowcaster && behavior_plugin instanceof cr.behaviors.shadowcaster)
						this.shadowcasterBehavior = behavior_plugin;
				}
				if (behavior_plugin.my_types.indexOf(type_inst) === -1)
					behavior_plugin.my_types.push(type_inst);
				var behavior_type = new behavior_plugin.Type(behavior_plugin, type_inst);
				behavior_type.name = b[0];
				behavior_type.sid = b[2];
				behavior_type.onCreate();
				cr.seal(behavior_type);
				type_inst.behaviors.push(behavior_type);
			}
			type_inst.global = m[9];
			type_inst.isOnLoaderLayout = m[10];
			type_inst.effect_types = [];
			for (j = 0, lenj = m[12].length; j < lenj; j++)
			{
				type_inst.effect_types.push({
					id: m[12][j][0],
					name: m[12][j][1],
					shaderindex: -1,
					preservesOpaqueness: false,
					active: true,
					index: j
				});
			}
			type_inst.tile_poly_data = m[13];
			if (!this.uses_loader_layout || type_inst.is_family || type_inst.isOnLoaderLayout || !plugin.is_world)
			{
				type_inst.onCreate();
				cr.seal(type_inst);
			}
			if (type_inst.name)
				this.types[type_inst.name] = type_inst;
			this.types_by_index.push(type_inst);
			if (plugin.singleglobal)
			{
				var instance = new plugin.Instance(type_inst);
				instance.uid = this.next_uid++;
				instance.puid = this.next_puid++;
				instance.iid = 0;
				instance.get_iid = cr.inst_get_iid;
				instance.toString = cr.inst_toString;
				instance.properties = m[14];
				instance.onCreate();
				cr.seal(instance);
				type_inst.instances.push(instance);
				this.objectsByUid[instance.uid.toString()] = instance;
			}
		}
		for (i = 0, len = pm[4].length; i < len; i++)
		{
			var familydata = pm[4][i];
			var familytype = this.types_by_index[familydata[0]];
			var familymember;
			for (j = 1, lenj = familydata.length; j < lenj; j++)
			{
				familymember = this.types_by_index[familydata[j]];
				familymember.families.push(familytype);
				familytype.members.push(familymember);
			}
		}
		for (i = 0, len = pm[28].length; i < len; i++)
		{
			var containerdata = pm[28][i];
			var containertypes = [];
			for (j = 0, lenj = containerdata.length; j < lenj; j++)
				containertypes.push(this.types_by_index[containerdata[j]]);
			for (j = 0, lenj = containertypes.length; j < lenj; j++)
			{
				containertypes[j].is_contained = true;
				containertypes[j].container = containertypes;
			}
		}
		if (this.family_count > 0)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				if (t.is_family || !t.families.length)
					continue;
				t.family_var_map = new Array(this.family_count);
				t.family_beh_map = new Array(this.family_count);
				t.family_fx_map = new Array(this.family_count);
				var all_fx = [];
				var varsum = 0;
				var behsum = 0;
				var fxsum = 0;
				for (j = 0, lenj = t.families.length; j < lenj; j++)
				{
					f = t.families[j];
					t.family_var_map[f.family_index] = varsum;
					varsum += f.vars_count;
					t.family_beh_map[f.family_index] = behsum;
					behsum += f.behs_count;
					t.family_fx_map[f.family_index] = fxsum;
					fxsum += f.fx_count;
					for (k = 0, lenk = f.effect_types.length; k < lenk; k++)
						all_fx.push(cr.shallowCopy({}, f.effect_types[k]));
				}
				t.effect_types = all_fx.concat(t.effect_types);
				for (j = 0, lenj = t.effect_types.length; j < lenj; j++)
					t.effect_types[j].index = j;
			}
		}
		for (i = 0, len = pm[5].length; i < len; i++)
		{
			m = pm[5][i];
			var layout = new cr.layout(this, m);
			cr.seal(layout);
			this.layouts[layout.name] = layout;
			this.layouts_by_index.push(layout);
		}
		for (i = 0, len = pm[6].length; i < len; i++)
		{
			m = pm[6][i];
			var sheet = new cr.eventsheet(this, m);
			cr.seal(sheet);
			this.eventsheets[sheet.name] = sheet;
			this.eventsheets_by_index.push(sheet);
		}
		for (i = 0, len = this.eventsheets_by_index.length; i < len; i++)
			this.eventsheets_by_index[i].postInit();
		for (i = 0, len = this.eventsheets_by_index.length; i < len; i++)
			this.eventsheets_by_index[i].updateDeepIncludes();
		for (i = 0, len = this.triggers_to_postinit.length; i < len; i++)
			this.triggers_to_postinit[i].postInit();
		cr.clearArray(this.triggers_to_postinit)
		this.audio_to_preload = pm[7];
		this.files_subfolder = pm[8];
		this.pixel_rounding = pm[9];
		this.aspect_scale = 1.0;
		this.enableWebGL = pm[13];
		this.linearSampling = pm[14];
		this.clearBackground = pm[15];
		this.versionstr = pm[16];
		this.useHighDpi = pm[17];
		this.orientations = pm[20];		// 0 = any, 1 = portrait, 2 = landscape
		this.autoLockOrientation = (this.orientations > 0);
		this.pauseOnBlur = pm[22];
		this.wantFullscreenScalingQuality = pm[23];		// false = low quality, true = high quality
		this.fullscreenScalingQuality = this.wantFullscreenScalingQuality;
		this.downscalingQuality = pm[24];	// 0 = low (mips off), 1 = medium (mips on, dense spritesheet), 2 = high (mips on, sparse spritesheet)
		this.preloadSounds = pm[25];		// 0 = no, 1 = yes
		this.projectName = pm[26];
		this.enableFrontToBack = pm[27] && !this.isIE;		// front-to-back renderer disabled in IE (but not Edge)
		this.start_time = Date.now();
		cr.clearArray(this.objectRefTable);
		this.initRendererAndLoader();
	};
	var anyImageHadError = false;
	var MAX_PARALLEL_IMAGE_LOADS = 100;
	var currentlyActiveImageLoads = 0;
	var imageLoadQueue = [];		// array of [img, srcToSet]
	Runtime.prototype.queueImageLoad = function (img_, src_)
	{
		var self = this;
		var doneFunc = function ()
		{
			currentlyActiveImageLoads--;
			self.maybeLoadNextImages();
		};
		img_.addEventListener("load", doneFunc);
		img_.addEventListener("error", doneFunc);
		imageLoadQueue.push([img_, src_]);
		this.maybeLoadNextImages();
	};
	Runtime.prototype.maybeLoadNextImages = function ()
	{
		var next;
		while (imageLoadQueue.length && currentlyActiveImageLoads < MAX_PARALLEL_IMAGE_LOADS)
		{
			currentlyActiveImageLoads++;
			next = imageLoadQueue.shift();
			this.setImageSrc(next[0], next[1]);
		}
	};
	Runtime.prototype.waitForImageLoad = function (img_, src_)
	{
		img_["cocoonLazyLoad"] = true;
		img_.onerror = function (e)
		{
			img_.c2error = true;
			anyImageHadError = true;
			if (console && console.error)
				console.error("Error loading image '" + img_.src + "': ", e);
		};
		if (this.isEjecta)
		{
			img_.src = src_;
		}
		else if (!img_.src)
		{
			if (typeof XAPKReader !== "undefined")
			{
				XAPKReader.get(src_, function (expanded_url)
				{
					img_.src = expanded_url;
				}, function (e)
				{
					img_.c2error = true;
					anyImageHadError = true;
					if (console && console.error)
						console.error("Error extracting image '" + src_ + "' from expansion file: ", e);
				});
			}
			else
			{
				img_.crossOrigin = "anonymous";			// required for Arcade sandbox compatibility
				this.queueImageLoad(img_, src_);		// use a queue to avoid requesting all images simultaneously
			}
		}
		this.wait_for_textures.push(img_);
	};
	Runtime.prototype.findWaitingTexture = function (src_)
	{
		var i, len;
		for (i = 0, len = this.wait_for_textures.length; i < len; i++)
		{
			if (this.wait_for_textures[i].cr_src === src_)
				return this.wait_for_textures[i];
		}
		return null;
	};
	var audio_preload_totalsize = 0;
	var audio_preload_started = false;
	Runtime.prototype.getready = function ()
	{
		if (!this.audioInstance)
			return;
		audio_preload_totalsize = this.audioInstance.setPreloadList(this.audio_to_preload);
	};
	Runtime.prototype.areAllTexturesAndSoundsLoaded = function ()
	{
		var totalsize = audio_preload_totalsize;
		var completedsize = 0;
		var audiocompletedsize = 0;
		var ret = true;
		var i, len, img;
		for (i = 0, len = this.wait_for_textures.length; i < len; i++)
		{
			img = this.wait_for_textures[i];
			var filesize = img.cr_filesize;
			if (!filesize || filesize <= 0)
				filesize = 50000;
			totalsize += filesize;
			if (!!img.src && (img.complete || img["loaded"]) && !img.c2error)
				completedsize += filesize;
			else
				ret = false;    // not all textures loaded
		}
		if (ret && this.preloadSounds && this.audioInstance)
		{
			if (!audio_preload_started)
			{
				this.audioInstance.startPreloads();
				audio_preload_started = true;
			}
			audiocompletedsize = this.audioInstance.getPreloadedSize();
			completedsize += audiocompletedsize;
			if (audiocompletedsize < audio_preload_totalsize)
				ret = false;		// not done yet
		}
		if (totalsize == 0)
			this.progress = 1;		// indicate to C2 splash loader that it can finish now
		else
			this.progress = (completedsize / totalsize);
		return ret;
	};
	var isC2SplashDone = false;
	Runtime.prototype.go = function ()
	{
		if (!this.ctx && !this.glwrap)
			return;
		var ctx = this.ctx || this.overlay_ctx;
		if (this.overlay_canvas)
			this.positionOverlayCanvas();
		var curwidth = window.innerWidth;
		var curheight = window.innerHeight;
		if (this.lastWindowWidth !== curwidth || this.lastWindowHeight !== curheight)
		{
			this["setSize"](curwidth, curheight);
		}
		this.progress = 0;
		this.last_progress = -1;
		var self = this;
		if (this.areAllTexturesAndSoundsLoaded() && (this.loaderstyle !== 4 || isC2SplashDone))
		{
			this.go_loading_finished();
		}
		else
		{
			var ms_elapsed = Date.now() - this.start_time;
			if (ctx)
			{
				var overlay_width = this.width;
				var overlay_height = this.height;
				var dpr = this.devicePixelRatio;
				if (this.loaderstyle < 3 && (this.isCocoonJs || (ms_elapsed >= 500 && this.last_progress != this.progress)))
				{
					ctx.clearRect(0, 0, overlay_width, overlay_height);
					var mx = overlay_width / 2;
					var my = overlay_height / 2;
					var haslogo = (this.loaderstyle === 0 && this.loaderlogos.logo.complete);
					var hlw = 40 * dpr;
					var hlh = 0;
					var logowidth = 80 * dpr;
					var logoheight;
					if (haslogo)
					{
						var loaderLogoImage = this.loaderlogos.logo;
						logowidth = loaderLogoImage.width * dpr;
						logoheight = loaderLogoImage.height * dpr;
						hlw = logowidth / 2;
						hlh = logoheight / 2;
						ctx.drawImage(loaderLogoImage, cr.floor(mx - hlw), cr.floor(my - hlh), logowidth, logoheight);
					}
					if (this.loaderstyle <= 1)
					{
						my += hlh + (haslogo ? 12 * dpr : 0);
						mx -= hlw;
						mx = cr.floor(mx) + 0.5;
						my = cr.floor(my) + 0.5;
						ctx.fillStyle = anyImageHadError ? "red" : "DodgerBlue";
						ctx.fillRect(mx, my, Math.floor(logowidth * this.progress), 6 * dpr);
						ctx.strokeStyle = "black";
						ctx.strokeRect(mx, my, logowidth, 6 * dpr);
						ctx.strokeStyle = "white";
						ctx.strokeRect(mx - 1 * dpr, my - 1 * dpr, logowidth + 2 * dpr, 8 * dpr);
					}
					else if (this.loaderstyle === 2)
					{
						ctx.font = (this.isEjecta ? "12pt ArialMT" : "12pt Arial");
						ctx.fillStyle = anyImageHadError ? "#f00" : "#999";
						ctx.textBaseLine = "middle";
						var percent_text = Math.round(this.progress * 100) + "%";
						var text_dim = ctx.measureText ? ctx.measureText(percent_text) : null;
						var text_width = text_dim ? text_dim.width : 0;
						ctx.fillText(percent_text, mx - (text_width / 2), my);
					}
					this.last_progress = this.progress;
				}
				else if (this.loaderstyle === 4)
				{
					this.draw_c2_splash_loader(ctx);
					if (raf)
						raf(function() { self.go(); });
					else
						setTimeout(function() { self.go(); }, 16);
					return;
				}
			}
			setTimeout(function() { self.go(); }, (this.isCocoonJs ? 10 : 100));
		}
	};
	var splashStartTime = -1;
	var splashFadeInDuration = 300;
	var splashFadeOutDuration = 300;
	var splashAfterFadeOutWait = (typeof cr_is_preview === "undefined" ? 200 : 0);
	var splashIsFadeIn = true;
	var splashIsFadeOut = false;
	var splashFadeInFinish = 0;
	var splashFadeOutStart = 0;
	var splashMinDisplayTime = (typeof cr_is_preview === "undefined" ? 3000 : 0);
	var renderViaCanvas = null;
	var renderViaCtx = null;
	var splashFrameNumber = 0;
	function maybeCreateRenderViaCanvas(w, h)
	{
		if (!renderViaCanvas || renderViaCanvas.width !== w || renderViaCanvas.height !== h)
		{
			renderViaCanvas = document.createElement("canvas");
			renderViaCanvas.width = w;
			renderViaCanvas.height = h;
			renderViaCtx = renderViaCanvas.getContext("2d");
		}
	};
	function mipImage(arr, size)
	{
		if (size <= 128)
			return arr[3];
		else if (size <= 256)
			return arr[2];
		else if (size <= 512)
			return arr[1];
		else
			return arr[0];
	};
	Runtime.prototype.draw_c2_splash_loader = function(ctx)
	{
		if (isC2SplashDone)
			return;
		var w = Math.ceil(this.width);
		var h = Math.ceil(this.height);
		var dpr = this.devicePixelRatio;
		var logoimages = this.loaderlogos.logo;
		var poweredimages = this.loaderlogos.powered;
		var websiteimages = this.loaderlogos.website;
		for (var i = 0; i < 4; ++i)
		{
			if (!logoimages[i].complete || !poweredimages[i].complete || !websiteimages[i].complete)
				return;
		}
		if (splashFrameNumber === 0)
			splashStartTime = Date.now();
		var nowTime = Date.now();
		var isRenderingVia = false;
		var renderToCtx = ctx;
		var drawW, drawH;
		if (splashIsFadeIn || splashIsFadeOut)
		{
			ctx.clearRect(0, 0, w, h);
			maybeCreateRenderViaCanvas(w, h);
			renderToCtx = renderViaCtx;
			isRenderingVia = true;
			if (splashIsFadeIn && splashFrameNumber === 1)
				splashStartTime = Date.now();
		}
		else
		{
			ctx.globalAlpha = 1;
		}
		renderToCtx.fillStyle = "#333333";
		renderToCtx.fillRect(0, 0, w, h);
		if (this.cssHeight > 256)
		{
			drawW = cr.clamp(h * 0.22, 105, w * 0.6);
			drawH = drawW * 0.25;
			renderToCtx.drawImage(mipImage(poweredimages, drawW), w * 0.5 - drawW/2, h * 0.2 - drawH/2, drawW, drawH);
			drawW = Math.min(h * 0.395, w * 0.95);
			drawH = drawW;
			renderToCtx.drawImage(mipImage(logoimages, drawW), w * 0.5 - drawW/2, h * 0.485 - drawH/2, drawW, drawH);
			drawW = cr.clamp(h * 0.22, 105, w * 0.6);
			drawH = drawW * 0.25;
			renderToCtx.drawImage(mipImage(websiteimages, drawW), w * 0.5 - drawW/2, h * 0.868 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = "#3C3C3C";
			drawW = w;
			drawH = Math.max(h * 0.005, 2);
			renderToCtx.fillRect(0, h * 0.8 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = anyImageHadError ? "red" : "#E0FF65";
			drawW = w * this.progress;
			renderToCtx.fillRect(w * 0.5 - drawW/2, h * 0.8 - drawH/2, drawW, drawH);
		}
		else
		{
			drawW = h * 0.55;
			drawH = drawW;
			renderToCtx.drawImage(mipImage(logoimages, drawW), w * 0.5 - drawW/2, h * 0.45 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = "#3C3C3C";
			drawW = w;
			drawH = Math.max(h * 0.005, 2);
			renderToCtx.fillRect(0, h * 0.85 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = anyImageHadError ? "red" : "#E0FF65";
			drawW = w * this.progress;
			renderToCtx.fillRect(w * 0.5 - drawW/2, h * 0.85 - drawH/2, drawW, drawH);
		}
		if (isRenderingVia)
		{
			if (splashIsFadeIn)
			{
				if (splashFrameNumber === 0)
					ctx.globalAlpha = 0;
				else
					ctx.globalAlpha = Math.min((nowTime - splashStartTime) / splashFadeInDuration, 1);
			}
			else if (splashIsFadeOut)
			{
				ctx.globalAlpha = Math.max(1 - (nowTime - splashFadeOutStart) / splashFadeOutDuration, 0);
			}
			ctx.drawImage(renderViaCanvas, 0, 0, w, h);
		}
		if (splashIsFadeIn && nowTime - splashStartTime >= splashFadeInDuration && splashFrameNumber >= 2)
		{
			splashIsFadeIn = false;
			splashFadeInFinish = nowTime;
		}
		if (!splashIsFadeIn && nowTime - splashFadeInFinish >= splashMinDisplayTime && !splashIsFadeOut && this.progress >= 1)
		{
			splashIsFadeOut = true;
			splashFadeOutStart = nowTime;
		}
		if ((splashIsFadeOut && nowTime - splashFadeOutStart >= splashFadeOutDuration + splashAfterFadeOutWait) ||
			(typeof cr_is_preview !== "undefined" && this.progress >= 1 && Date.now() - splashStartTime < 500))
		{
			isC2SplashDone = true;
			splashIsFadeIn = false;
			splashIsFadeOut = false;
			renderViaCanvas = null;
			renderViaCtx = null;
			this.loaderlogos = null;
		}
		++splashFrameNumber;
	};
	Runtime.prototype.go_loading_finished = function ()
	{
		if (this.overlay_canvas)
		{
			this.canvas.parentNode.removeChild(this.overlay_canvas);
			this.overlay_ctx = null;
			this.overlay_canvas = null;
		}
		this.start_time = Date.now();
		this.last_fps_time = cr.performance_now();       // for counting framerate
		var i, len, t;
		if (this.uses_loader_layout)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				if (!t.is_family && !t.isOnLoaderLayout && t.plugin.is_world)
				{
					t.onCreate();
					cr.seal(t);
				}
			}
		}
		else
			this.isloading = false;
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			this.layouts_by_index[i].createGlobalNonWorlds();
		}
		if (this.fullscreen_mode >= 2)
		{
			var orig_aspect = this.original_width / this.original_height;
			var cur_aspect = this.width / this.height;
			if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
				this.aspect_scale = this.height / this.original_height;
			else
				this.aspect_scale = this.width / this.original_width;
		}
		if (this.first_layout)
			this.layouts[this.first_layout].startRunning();
		else
			this.layouts_by_index[0].startRunning();
;
		if (!this.uses_loader_layout)
		{
			this.loadingprogress = 1;
			this.trigger(cr.system_object.prototype.cnds.OnLoadFinished, null);
			if (window["C2_RegisterSW"])		// note not all platforms use SW
				window["C2_RegisterSW"]();
		}
		if (navigator["splashscreen"] && navigator["splashscreen"]["hide"])
			navigator["splashscreen"]["hide"]();
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onAppBegin)
				t.onAppBegin();
		}
		if (document["hidden"] || document["webkitHidden"] || document["mozHidden"] || document["msHidden"])
		{
			window["cr_setSuspended"](true);		// stop rendering
		}
		else
		{
			this.tick(false);
		}
		if (this.isDirectCanvas)
			AppMobi["webview"]["execute"]("onGameReady();");
	};
	Runtime.prototype.tick = function (background_wake, timestamp, debug_step)
	{
		if (!this.running_layout)
			return;
		var nowtime = cr.performance_now();
		var logic_start = nowtime;
		if (!debug_step && this.isSuspended && !background_wake)
			return;
		if (!background_wake)
		{
			if (raf)
				this.raf_id = raf(this.tickFunc);
			else
			{
				this.timeout_id = setTimeout(this.tickFunc, this.isMobile ? 1 : 16);
			}
		}
		var raf_time = timestamp || nowtime;
		var fsmode = this.fullscreen_mode;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"]) && !this.isCordova;
		if ((isfullscreen || this.isNodeFullscreen) && this.fullscreen_scaling > 0)
			fsmode = this.fullscreen_scaling;
		if (fsmode > 0)	// r222: experimentally enabling this workaround for all platforms
		{
			var curwidth = window.innerWidth;
			var curheight = window.innerHeight;
			if (this.lastWindowWidth !== curwidth || this.lastWindowHeight !== curheight)
			{
				this["setSize"](curwidth, curheight);
			}
		}
		if (!this.isDomFree)
		{
			if (isfullscreen)
			{
				if (!this.firstInFullscreen)
					this.firstInFullscreen = true;
			}
			else
			{
				if (this.firstInFullscreen)
				{
					this.firstInFullscreen = false;
					if (this.fullscreen_mode === 0)
					{
						this["setSize"](Math.round(this.oldWidth / this.devicePixelRatio), Math.round(this.oldHeight / this.devicePixelRatio), true);
					}
				}
				else
				{
					this.oldWidth = this.width;
					this.oldHeight = this.height;
				}
			}
		}
		if (this.isloading)
		{
			var done = this.areAllTexturesAndSoundsLoaded();		// updates this.progress
			this.loadingprogress = this.progress;
			if (done)
			{
				this.isloading = false;
				this.progress = 1;
				this.trigger(cr.system_object.prototype.cnds.OnLoadFinished, null);
				if (window["C2_RegisterSW"])
					window["C2_RegisterSW"]();
			}
		}
		this.logic(raf_time);
		if ((this.redraw || this.isCocoonJs) && !this.is_WebGL_context_lost && !this.suspendDrawing && !background_wake)
		{
			this.redraw = false;
			if (this.glwrap)
				this.drawGL();
			else
				this.draw();
			if (this.snapshotCanvas)
			{
				if (this.canvas && this.canvas.toDataURL)
				{
					this.snapshotData = this.canvas.toDataURL(this.snapshotCanvas[0], this.snapshotCanvas[1]);
					if (window["cr_onSnapshot"])
						window["cr_onSnapshot"](this.snapshotData);
					this.trigger(cr.system_object.prototype.cnds.OnCanvasSnapshot, null);
				}
				this.snapshotCanvas = null;
			}
		}
		if (!this.hit_breakpoint)
		{
			this.tickcount++;
			this.tickcount_nosave++;
			this.execcount++;
			this.framecount++;
		}
		this.logictime += cr.performance_now() - logic_start;
	};
	Runtime.prototype.logic = function (cur_time)
	{
		var i, leni, j, lenj, k, lenk, type, inst, binst;
		if (cur_time - this.last_fps_time >= 1000)  // every 1 second
		{
			this.last_fps_time += 1000;
			if (cur_time - this.last_fps_time >= 1000)
				this.last_fps_time = cur_time;
			this.fps = this.framecount;
			this.framecount = 0;
			this.cpuutilisation = this.logictime;
			this.logictime = 0;
		}
		var wallDt = 0;
		if (this.last_tick_time !== 0)
		{
			var ms_diff = cur_time - this.last_tick_time;
			if (ms_diff < 0)
				ms_diff = 0;
			wallDt = ms_diff / 1000.0; // dt measured in seconds
			this.dt1 = wallDt;
			if (this.dt1 > 0.5)
				this.dt1 = 0;
			else if (this.dt1 > 1 / this.minimumFramerate)
				this.dt1 = 1 / this.minimumFramerate;
		}
		this.last_tick_time = cur_time;
        this.dt = this.dt1 * this.timescale;
        this.kahanTime.add(this.dt);
		this.wallTime.add(wallDt);		// prevent min/max framerate affecting wall clock
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"] || this.isNodeFullscreen) && !this.isCordova;
		if (this.fullscreen_mode >= 2 /* scale */ || (isfullscreen && this.fullscreen_scaling > 0))
		{
			var orig_aspect = this.original_width / this.original_height;
			var cur_aspect = this.width / this.height;
			var mode = this.fullscreen_mode;
			if (isfullscreen && this.fullscreen_scaling > 0)
				mode = this.fullscreen_scaling;
			if ((mode !== 2 && cur_aspect > orig_aspect) || (mode === 2 && cur_aspect < orig_aspect))
			{
				this.aspect_scale = this.height / this.original_height;
			}
			else
			{
				this.aspect_scale = this.width / this.original_width;
			}
			if (this.running_layout)
			{
				this.running_layout.scrollToX(this.running_layout.scrollX);
				this.running_layout.scrollToY(this.running_layout.scrollY);
			}
		}
		else
			this.aspect_scale = (this.isRetina ? this.devicePixelRatio : 1);
		this.ClearDeathRow();
		this.isInOnDestroy++;
		this.system.runWaits();		// prevent instance list changing
		this.isInOnDestroy--;
		this.ClearDeathRow();		// allow instance list changing
		this.isInOnDestroy++;
        var tickarr = this.objects_to_pretick.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].pretick();
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					inst.behavior_insts[k].tick();
				}
			}
		}
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;	// type doesn't have any behaviors
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.posttick)
						binst.posttick();
				}
			}
		}
        tickarr = this.objects_to_tick.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].tick();
		this.isInOnDestroy--;		// end preventing instance lists from being changed
		this.handleSaveLoad();		// save/load now if queued
		i = 0;
		while (this.changelayout && i++ < 10)
		{
			this.doChangeLayout(this.changelayout);
		}
        for (i = 0, leni = this.eventsheets_by_index.length; i < leni; i++)
            this.eventsheets_by_index[i].hasRun = false;
		if (this.running_layout.event_sheet)
			this.running_layout.event_sheet.run();
		cr.clearArray(this.registered_collisions);
		this.layout_first_tick = false;
		this.isInOnDestroy++;		// prevent instance lists from being changed
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;	// type doesn't have any behaviors
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				var inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.tick2)
						binst.tick2();
				}
			}
		}
        tickarr = this.objects_to_tick2.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].tick2();
		this.isInOnDestroy--;		// end preventing instance lists from being changed
	};
	Runtime.prototype.onWindowBlur = function ()
	{
		var i, leni, j, lenj, k, lenk, type, inst, binst;
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (inst.onWindowBlur)
					inst.onWindowBlur();
				if (!inst.behavior_insts)
					continue;	// single-globals don't have behavior_insts
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.onWindowBlur)
						binst.onWindowBlur();
				}
			}
		}
	};
	Runtime.prototype.doChangeLayout = function (changeToLayout)
	{
		var prev_layout = this.running_layout;
		this.running_layout.stopRunning();
		var i, len, j, lenj, k, lenk, type, inst, binst;
		if (this.glwrap)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				type = this.types_by_index[i];
				if (type.is_family)
					continue;
				if (type.unloadTextures && (!type.global || type.instances.length === 0) && changeToLayout.initial_types.indexOf(type) === -1)
				{
					type.unloadTextures();
				}
			}
		}
		if (prev_layout == changeToLayout)
			cr.clearArray(this.system.waits);
		cr.clearArray(this.registered_collisions);
		this.runLayoutChangeMethods(true);
		changeToLayout.startRunning();
		this.runLayoutChangeMethods(false);
		this.redraw = true;
		this.layout_first_tick = true;
		this.ClearDeathRow();
	};
	Runtime.prototype.runLayoutChangeMethods = function (isBeforeChange)
	{
		var i, len, beh, type, j, lenj, inst, k, lenk, binst;
		for (i = 0, len = this.behaviors.length; i < len; i++)
		{
			beh = this.behaviors[i];
			if (isBeforeChange)
			{
				if (beh.onBeforeLayoutChange)
					beh.onBeforeLayoutChange();
			}
			else
			{
				if (beh.onLayoutChange)
					beh.onLayoutChange();
			}
		}
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (!type.global && !type.plugin.singleglobal)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (isBeforeChange)
				{
					if (inst.onBeforeLayoutChange)
						inst.onBeforeLayoutChange();
				}
				else
				{
					if (inst.onLayoutChange)
						inst.onLayoutChange();
				}
				if (inst.behavior_insts)
				{
					for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
					{
						binst = inst.behavior_insts[k];
						if (isBeforeChange)
						{
							if (binst.onBeforeLayoutChange)
								binst.onBeforeLayoutChange();
						}
						else
						{
							if (binst.onLayoutChange)
								binst.onLayoutChange();
						}
					}
				}
			}
		}
	};
	Runtime.prototype.pretickMe = function (inst)
    {
        this.objects_to_pretick.add(inst);
    };
	Runtime.prototype.unpretickMe = function (inst)
	{
		this.objects_to_pretick.remove(inst);
	};
    Runtime.prototype.tickMe = function (inst)
    {
        this.objects_to_tick.add(inst);
    };
	Runtime.prototype.untickMe = function (inst)
	{
		this.objects_to_tick.remove(inst);
	};
	Runtime.prototype.tick2Me = function (inst)
    {
        this.objects_to_tick2.add(inst);
    };
	Runtime.prototype.untick2Me = function (inst)
	{
		this.objects_to_tick2.remove(inst);
	};
    Runtime.prototype.getDt = function (inst)
    {
        if (!inst || inst.my_timescale === -1.0)
            return this.dt;
        return this.dt1 * inst.my_timescale;
    };
	Runtime.prototype.draw = function ()
	{
		this.running_layout.draw(this.ctx);
		if (this.isDirectCanvas)
			this.ctx["present"]();
	};
	Runtime.prototype.drawGL = function ()
	{
		if (this.enableFrontToBack)
		{
			this.earlyz_index = 1;		// start from front, 1-based to avoid exactly equalling near plane Z value
			this.running_layout.drawGL_earlyZPass(this.glwrap);
		}
		this.running_layout.drawGL(this.glwrap);
		this.glwrap.present();
	};
	Runtime.prototype.addDestroyCallback = function (f)
	{
		if (f)
			this.destroycallbacks.push(f);
	};
	Runtime.prototype.removeDestroyCallback = function (f)
	{
		cr.arrayFindRemove(this.destroycallbacks, f);
	};
	Runtime.prototype.getObjectByUID = function (uid_)
	{
;
		var uidstr = uid_.toString();
		if (this.objectsByUid.hasOwnProperty(uidstr))
			return this.objectsByUid[uidstr];
		else
			return null;
	};
	var objectset_cache = [];
	function alloc_objectset()
	{
		if (objectset_cache.length)
			return objectset_cache.pop();
		else
			return new cr.ObjectSet();
	};
	function free_objectset(s)
	{
		s.clear();
		objectset_cache.push(s);
	};
	Runtime.prototype.DestroyInstance = function (inst)
	{
		var i, len;
		var type = inst.type;
		var typename = type.name;
		var has_typename = this.deathRow.hasOwnProperty(typename);
		var obj_set = null;
		if (has_typename)
		{
			obj_set = this.deathRow[typename];
			if (obj_set.contains(inst))
				return;		// already had DestroyInstance called
		}
		else
		{
			obj_set = alloc_objectset();
			this.deathRow[typename] = obj_set;
		}
		obj_set.add(inst);
		this.hasPendingInstances = true;
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				this.DestroyInstance(inst.siblings[i]);
			}
		}
		if (this.isInClearDeathRow)
			obj_set.values_cache.push(inst);
		if (!this.isEndingLayout)
		{
			this.isInOnDestroy++;		// support recursion
			this.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnDestroyed, inst);
			this.isInOnDestroy--;
		}
	};
	Runtime.prototype.ClearDeathRow = function ()
	{
		if (!this.hasPendingInstances)
			return;
		var inst, type, instances;
		var i, j, leni, lenj, obj_set;
		this.isInClearDeathRow = true;
		for (i = 0, leni = this.createRow.length; i < leni; ++i)
		{
			inst = this.createRow[i];
			type = inst.type;
			type.instances.push(inst);
			for (j = 0, lenj = type.families.length; j < lenj; ++j)
			{
				type.families[j].instances.push(inst);
				type.families[j].stale_iids = true;
			}
		}
		cr.clearArray(this.createRow);
		this.IterateDeathRow();		// moved to separate function so for-in performance doesn't hobble entire function
		cr.wipe(this.deathRow);		// all objectsets have already been recycled
		this.isInClearDeathRow = false;
		this.hasPendingInstances = false;
	};
	Runtime.prototype.IterateDeathRow = function ()
	{
		for (var p in this.deathRow)
		{
			if (this.deathRow.hasOwnProperty(p))
			{
				this.ClearDeathRowForType(this.deathRow[p]);
			}
		}
	};
	Runtime.prototype.ClearDeathRowForType = function (obj_set)
	{
		var arr = obj_set.valuesRef();			// get array of items from set
;
		var type = arr[0].type;
;
;
		var i, len, j, lenj, w, f, layer_instances, inst;
		cr.arrayRemoveAllFromObjectSet(type.instances, obj_set);
		type.stale_iids = true;
		if (type.instances.length === 0)
			type.any_instance_parallaxed = false;
		for (i = 0, len = type.families.length; i < len; ++i)
		{
			f = type.families[i];
			cr.arrayRemoveAllFromObjectSet(f.instances, obj_set);
			f.stale_iids = true;
		}
		for (i = 0, len = this.system.waits.length; i < len; ++i)
		{
			w = this.system.waits[i];
			if (w.sols.hasOwnProperty(type.index))
				cr.arrayRemoveAllFromObjectSet(w.sols[type.index].insts, obj_set);
			if (!type.is_family)
			{
				for (j = 0, lenj = type.families.length; j < lenj; ++j)
				{
					f = type.families[j];
					if (w.sols.hasOwnProperty(f.index))
						cr.arrayRemoveAllFromObjectSet(w.sols[f.index].insts, obj_set);
				}
			}
		}
		var first_layer = arr[0].layer;
		if (first_layer)
		{
			if (first_layer.useRenderCells)
			{
				layer_instances = first_layer.instances;
				for (i = 0, len = layer_instances.length; i < len; ++i)
				{
					inst = layer_instances[i];
					if (!obj_set.contains(inst))
						continue;		// not destroying this instance
					inst.update_bbox();
					first_layer.render_grid.update(inst, inst.rendercells, null);
					inst.rendercells.set(0, 0, -1, -1);
				}
			}
			cr.arrayRemoveAllFromObjectSet(first_layer.instances, obj_set);
			first_layer.setZIndicesStaleFrom(0);
		}
		for (i = 0; i < arr.length; ++i)		// check array length every time in case it changes
		{
			this.ClearDeathRowForSingleInstance(arr[i], type);
		}
		free_objectset(obj_set);
		this.redraw = true;
	};
	Runtime.prototype.ClearDeathRowForSingleInstance = function (inst, type)
	{
		var i, len, binst;
		for (i = 0, len = this.destroycallbacks.length; i < len; ++i)
			this.destroycallbacks[i](inst);
		if (inst.collcells)
		{
			type.collision_grid.update(inst, inst.collcells, null);
		}
		var layer = inst.layer;
		if (layer)
		{
			layer.removeFromInstanceList(inst, true);		// remove from both instance list and render grid
		}
		if (inst.behavior_insts)
		{
			for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
			{
				binst = inst.behavior_insts[i];
				if (binst.onDestroy)
					binst.onDestroy();
				binst.behavior.my_instances.remove(inst);
			}
		}
		this.objects_to_pretick.remove(inst);
		this.objects_to_tick.remove(inst);
		this.objects_to_tick2.remove(inst);
		if (inst.onDestroy)
			inst.onDestroy();
		if (this.objectsByUid.hasOwnProperty(inst.uid.toString()))
			delete this.objectsByUid[inst.uid.toString()];
		this.objectcount--;
		if (type.deadCache.length < 100)
			type.deadCache.push(inst);
	};
	Runtime.prototype.createInstance = function (type, layer, sx, sy)
	{
		if (type.is_family)
		{
			var i = cr.floor(Math.random() * type.members.length);
			return this.createInstance(type.members[i], layer, sx, sy);
		}
		if (!type.default_instance)
		{
			return null;
		}
		return this.createInstanceFromInit(type.default_instance, layer, false, sx, sy, false);
	};
	var all_behaviors = [];
	Runtime.prototype.createInstanceFromInit = function (initial_inst, layer, is_startup_instance, sx, sy, skip_siblings)
	{
		var i, len, j, lenj, p, effect_fallback, x, y;
		if (!initial_inst)
			return null;
		var type = this.types_by_index[initial_inst[1]];
;
;
		var is_world = type.plugin.is_world;
;
		if (this.isloading && is_world && !type.isOnLoaderLayout)
			return null;
		if (is_world && !this.glwrap && initial_inst[0][11] === 11)
			return null;
		var original_layer = layer;
		if (!is_world)
			layer = null;
		var inst;
		if (type.deadCache.length)
		{
			inst = type.deadCache.pop();
			inst.recycled = true;
			type.plugin.Instance.call(inst, type);
		}
		else
		{
			inst = new type.plugin.Instance(type);
			inst.recycled = false;
		}
		if (is_startup_instance && !skip_siblings && !this.objectsByUid.hasOwnProperty(initial_inst[2].toString()))
			inst.uid = initial_inst[2];
		else
			inst.uid = this.next_uid++;
		this.objectsByUid[inst.uid.toString()] = inst;
		inst.puid = this.next_puid++;
		inst.iid = type.instances.length;
		for (i = 0, len = this.createRow.length; i < len; ++i)
		{
			if (this.createRow[i].type === type)
				inst.iid++;
		}
		inst.get_iid = cr.inst_get_iid;
		inst.toString = cr.inst_toString;
		var initial_vars = initial_inst[3];
		if (inst.recycled)
		{
			cr.wipe(inst.extra);
		}
		else
		{
			inst.extra = {};
			if (typeof cr_is_preview !== "undefined")
			{
				inst.instance_var_names = [];
				inst.instance_var_names.length = initial_vars.length;
				for (i = 0, len = initial_vars.length; i < len; i++)
					inst.instance_var_names[i] = initial_vars[i][1];
			}
			inst.instance_vars = [];
			inst.instance_vars.length = initial_vars.length;
		}
		for (i = 0, len = initial_vars.length; i < len; i++)
			inst.instance_vars[i] = initial_vars[i][0];
		if (is_world)
		{
			var wm = initial_inst[0];
;
			inst.x = cr.is_undefined(sx) ? wm[0] : sx;
			inst.y = cr.is_undefined(sy) ? wm[1] : sy;
			inst.z = wm[2];
			inst.width = wm[3];
			inst.height = wm[4];
			inst.depth = wm[5];
			inst.angle = wm[6];
			inst.opacity = wm[7];
			inst.hotspotX = wm[8];
			inst.hotspotY = wm[9];
			inst.blend_mode = wm[10];
			effect_fallback = wm[11];
			if (!this.glwrap && type.effect_types.length)	// no WebGL renderer and shaders used
				inst.blend_mode = effect_fallback;			// use fallback blend mode - destroy mode was handled above
			inst.compositeOp = cr.effectToCompositeOp(inst.blend_mode);
			if (this.gl)
				cr.setGLBlend(inst, inst.blend_mode, this.gl);
			if (inst.recycled)
			{
				for (i = 0, len = wm[12].length; i < len; i++)
				{
					for (j = 0, lenj = wm[12][i].length; j < lenj; j++)
						inst.effect_params[i][j] = wm[12][i][j];
				}
				inst.bbox.set(0, 0, 0, 0);
				inst.collcells.set(0, 0, -1, -1);
				inst.rendercells.set(0, 0, -1, -1);
				inst.bquad.set_from_rect(inst.bbox);
				cr.clearArray(inst.bbox_changed_callbacks);
			}
			else
			{
				inst.effect_params = wm[12].slice(0);
				for (i = 0, len = inst.effect_params.length; i < len; i++)
					inst.effect_params[i] = wm[12][i].slice(0);
				inst.active_effect_types = [];
				inst.active_effect_flags = [];
				inst.active_effect_flags.length = type.effect_types.length;
				inst.bbox = new cr.rect(0, 0, 0, 0);
				inst.collcells = new cr.rect(0, 0, -1, -1);
				inst.rendercells = new cr.rect(0, 0, -1, -1);
				inst.bquad = new cr.quad();
				inst.bbox_changed_callbacks = [];
				inst.set_bbox_changed = cr.set_bbox_changed;
				inst.add_bbox_changed_callback = cr.add_bbox_changed_callback;
				inst.contains_pt = cr.inst_contains_pt;
				inst.update_bbox = cr.update_bbox;
				inst.update_render_cell = cr.update_render_cell;
				inst.update_collision_cell = cr.update_collision_cell;
				inst.get_zindex = cr.inst_get_zindex;
			}
			inst.tilemap_exists = false;
			inst.tilemap_width = 0;
			inst.tilemap_height = 0;
			inst.tilemap_data = null;
			if (wm.length === 14)
			{
				inst.tilemap_exists = true;
				inst.tilemap_width = wm[13][0];
				inst.tilemap_height = wm[13][1];
				inst.tilemap_data = wm[13][2];
			}
			for (i = 0, len = type.effect_types.length; i < len; i++)
				inst.active_effect_flags[i] = true;
			inst.shaders_preserve_opaqueness = true;
			inst.updateActiveEffects = cr.inst_updateActiveEffects;
			inst.updateActiveEffects();
			inst.uses_shaders = !!inst.active_effect_types.length;
			inst.bbox_changed = true;
			inst.cell_changed = true;
			type.any_cell_changed = true;
			inst.visible = true;
            inst.my_timescale = -1.0;
			inst.layer = layer;
			inst.zindex = layer.instances.length;	// will be placed at top of current layer
			inst.earlyz_index = 0;
			if (typeof inst.collision_poly === "undefined")
				inst.collision_poly = null;
			inst.collisionsEnabled = true;
			this.redraw = true;
		}
		var initial_props, binst;
		cr.clearArray(all_behaviors);
		for (i = 0, len = type.families.length; i < len; i++)
		{
			all_behaviors.push.apply(all_behaviors, type.families[i].behaviors);
		}
		all_behaviors.push.apply(all_behaviors, type.behaviors);
		if (inst.recycled)
		{
			for (i = 0, len = all_behaviors.length; i < len; i++)
			{
				var btype = all_behaviors[i];
				binst = inst.behavior_insts[i];
				binst.recycled = true;
				btype.behavior.Instance.call(binst, btype, inst);
				initial_props = initial_inst[4][i];
				for (j = 0, lenj = initial_props.length; j < lenj; j++)
					binst.properties[j] = initial_props[j];
				binst.onCreate();
				btype.behavior.my_instances.add(inst);
			}
		}
		else
		{
			inst.behavior_insts = [];
			for (i = 0, len = all_behaviors.length; i < len; i++)
			{
				var btype = all_behaviors[i];
				var binst = new btype.behavior.Instance(btype, inst);
				binst.recycled = false;
				binst.properties = initial_inst[4][i].slice(0);
				binst.onCreate();
				cr.seal(binst);
				inst.behavior_insts.push(binst);
				btype.behavior.my_instances.add(inst);
			}
		}
		initial_props = initial_inst[5];
		if (inst.recycled)
		{
			for (i = 0, len = initial_props.length; i < len; i++)
				inst.properties[i] = initial_props[i];
		}
		else
			inst.properties = initial_props.slice(0);
		this.createRow.push(inst);
		this.hasPendingInstances = true;
		if (layer)
		{
;
			layer.appendToInstanceList(inst, true);
			if (layer.parallaxX !== 1 || layer.parallaxY !== 1)
				type.any_instance_parallaxed = true;
		}
		this.objectcount++;
		if (type.is_contained)
		{
			inst.is_contained = true;
			if (inst.recycled)
				cr.clearArray(inst.siblings);
			else
				inst.siblings = [];			// note: should not include self in siblings
			if (!is_startup_instance && !skip_siblings)	// layout links initial instances
			{
				for (i = 0, len = type.container.length; i < len; i++)
				{
					if (type.container[i] === type)
						continue;
					if (!type.container[i].default_instance)
					{
						return null;
					}
					inst.siblings.push(this.createInstanceFromInit(type.container[i].default_instance, original_layer, false, is_world ? inst.x : sx, is_world ? inst.y : sy, true));
				}
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					inst.siblings[i].siblings.push(inst);
					for (j = 0; j < len; j++)
					{
						if (i !== j)
							inst.siblings[i].siblings.push(inst.siblings[j]);
					}
				}
			}
		}
		else
		{
			inst.is_contained = false;
			inst.siblings = null;
		}
		inst.onCreate();
		if (!inst.recycled)
			cr.seal(inst);
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i].postCreate)
				inst.behavior_insts[i].postCreate();
		}
		return inst;
	};
	Runtime.prototype.getLayerByName = function (layer_name)
	{
		var i, len;
		for (i = 0, len = this.running_layout.layers.length; i < len; i++)
		{
			var layer = this.running_layout.layers[i];
			if (cr.equals_nocase(layer.name, layer_name))
				return layer;
		}
		return null;
	};
	Runtime.prototype.getLayerByNumber = function (index)
	{
		index = cr.floor(index);
		if (index < 0)
			index = 0;
		if (index >= this.running_layout.layers.length)
			index = this.running_layout.layers.length - 1;
		return this.running_layout.layers[index];
	};
	Runtime.prototype.getLayer = function (l)
	{
		if (cr.is_number(l))
			return this.getLayerByNumber(l);
		else
			return this.getLayerByName(l.toString());
	};
	Runtime.prototype.clearSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].getCurrentSol().select_all = true;
		}
	};
	Runtime.prototype.pushCleanSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].pushCleanSol();
		}
	};
	Runtime.prototype.pushCopySol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].pushCopySol();
		}
	};
	Runtime.prototype.popSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].popSol();
		}
	};
	Runtime.prototype.updateAllCells = function (type)
	{
		if (!type.any_cell_changed)
			return;		// all instances must already be up-to-date
		var i, len, instances = type.instances;
		for (i = 0, len = instances.length; i < len; ++i)
		{
			instances[i].update_collision_cell();
		}
		var createRow = this.createRow;
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === type)
				createRow[i].update_collision_cell();
		}
		type.any_cell_changed = false;
	};
	Runtime.prototype.getCollisionCandidates = function (layer, rtype, bbox, candidates)
	{
		var i, len, t;
		var is_parallaxed = (layer ? (layer.parallaxX !== 1 || layer.parallaxY !== 1) : false);
		if (rtype.is_family)
		{
			for (i = 0, len = rtype.members.length; i < len; ++i)
			{
				t = rtype.members[i];
				if (is_parallaxed || t.any_instance_parallaxed)
				{
					cr.appendArray(candidates, t.instances);
				}
				else
				{
					this.updateAllCells(t);
					t.collision_grid.queryRange(bbox, candidates);
				}
			}
		}
		else
		{
			if (is_parallaxed || rtype.any_instance_parallaxed)
			{
				cr.appendArray(candidates, rtype.instances);
			}
			else
			{
				this.updateAllCells(rtype);
				rtype.collision_grid.queryRange(bbox, candidates);
			}
		}
	};
	Runtime.prototype.getTypesCollisionCandidates = function (layer, types, bbox, candidates)
	{
		var i, len;
		for (i = 0, len = types.length; i < len; ++i)
		{
			this.getCollisionCandidates(layer, types[i], bbox, candidates);
		}
	};
	Runtime.prototype.getSolidCollisionCandidates = function (layer, bbox, candidates)
	{
		var solid = this.getSolidBehavior();
		if (!solid)
			return null;
		this.getTypesCollisionCandidates(layer, solid.my_types, bbox, candidates);
	};
	Runtime.prototype.getJumpthruCollisionCandidates = function (layer, bbox, candidates)
	{
		var jumpthru = this.getJumpthruBehavior();
		if (!jumpthru)
			return null;
		this.getTypesCollisionCandidates(layer, jumpthru.my_types, bbox, candidates);
	};
	Runtime.prototype.testAndSelectCanvasPointOverlap = function (type, ptx, pty, inverted)
	{
		var sol = type.getCurrentSol();
		var i, j, inst, len;
		var orblock = this.getCurrentEventStack().current_event.orblock;
		var lx, ly, arr;
		if (sol.select_all)
		{
			if (!inverted)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);   // clear contents
			}
			for (i = 0, len = type.instances.length; i < len; i++)
			{
				inst = type.instances[i];
				inst.update_bbox();
				lx = inst.layer.canvasToLayer(ptx, pty, true);
				ly = inst.layer.canvasToLayer(ptx, pty, false);
				if (inst.contains_pt(lx, ly))
				{
					if (inverted)
						return false;
					else
						sol.instances.push(inst);
				}
				else if (orblock)
					sol.else_instances.push(inst);
			}
		}
		else
		{
			j = 0;
			arr = (orblock ? sol.else_instances : sol.instances);
			for (i = 0, len = arr.length; i < len; i++)
			{
				inst = arr[i];
				inst.update_bbox();
				lx = inst.layer.canvasToLayer(ptx, pty, true);
				ly = inst.layer.canvasToLayer(ptx, pty, false);
				if (inst.contains_pt(lx, ly))
				{
					if (inverted)
						return false;
					else if (orblock)
						sol.instances.push(inst);
					else
					{
						sol.instances[j] = sol.instances[i];
						j++;
					}
				}
			}
			if (!inverted)
				arr.length = j;
		}
		type.applySolToContainer();
		if (inverted)
			return true;		// did not find anything overlapping
		else
			return sol.hasObjects();
	};
	Runtime.prototype.testOverlap = function (a, b)
	{
		if (!a || !b || a === b || !a.collisionsEnabled || !b.collisionsEnabled)
			return false;
		a.update_bbox();
		b.update_bbox();
		var layera = a.layer;
		var layerb = b.layer;
		var different_layers = (layera !== layerb && (layera.parallaxX !== layerb.parallaxX || layerb.parallaxY !== layerb.parallaxY || layera.scale !== layerb.scale || layera.angle !== layerb.angle || layera.zoomRate !== layerb.zoomRate));
		var i, len, i2, i21, x, y, haspolya, haspolyb, polya, polyb;
		if (!different_layers)	// same layers: easy check
		{
			if (!a.bbox.intersects_rect(b.bbox))
				return false;
			if (!a.bquad.intersects_quad(b.bquad))
				return false;
			if (a.tilemap_exists && b.tilemap_exists)
				return false;
			if (a.tilemap_exists)
				return this.testTilemapOverlap(a, b);
			if (b.tilemap_exists)
				return this.testTilemapOverlap(b, a);
			haspolya = (a.collision_poly && !a.collision_poly.is_empty());
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolya && !haspolyb)
				return true;
			if (haspolya)
			{
				a.collision_poly.cache_poly(a.width, a.height, a.angle);
				polya = a.collision_poly;
			}
			else
			{
				this.temp_poly.set_from_quad(a.bquad, a.x, a.y, a.width, a.height);
				polya = this.temp_poly;
			}
			if (haspolyb)
			{
				b.collision_poly.cache_poly(b.width, b.height, b.angle);
				polyb = b.collision_poly;
			}
			else
			{
				this.temp_poly.set_from_quad(b.bquad, b.x, b.y, b.width, b.height);
				polyb = this.temp_poly;
			}
			return polya.intersects_poly(polyb, b.x - a.x, b.y - a.y);
		}
		else	// different layers: need to do full translated check
		{
			haspolya = (a.collision_poly && !a.collision_poly.is_empty());
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (haspolya)
			{
				a.collision_poly.cache_poly(a.width, a.height, a.angle);
				this.temp_poly.set_from_poly(a.collision_poly);
			}
			else
			{
				this.temp_poly.set_from_quad(a.bquad, a.x, a.y, a.width, a.height);
			}
			polya = this.temp_poly;
			if (haspolyb)
			{
				b.collision_poly.cache_poly(b.width, b.height, b.angle);
				this.temp_poly2.set_from_poly(b.collision_poly);
			}
			else
			{
				this.temp_poly2.set_from_quad(b.bquad, b.x, b.y, b.width, b.height);
			}
			polyb = this.temp_poly2;
			for (i = 0, len = polya.pts_count; i < len; i++)
			{
				i2 = i * 2;
				i21 = i2 + 1;
				x = polya.pts_cache[i2];
				y = polya.pts_cache[i21];
				polya.pts_cache[i2] = layera.layerToCanvas(x + a.x, y + a.y, true);
				polya.pts_cache[i21] = layera.layerToCanvas(x + a.x, y + a.y, false);
			}
			polya.update_bbox();
			for (i = 0, len = polyb.pts_count; i < len; i++)
			{
				i2 = i * 2;
				i21 = i2 + 1;
				x = polyb.pts_cache[i2];
				y = polyb.pts_cache[i21];
				polyb.pts_cache[i2] = layerb.layerToCanvas(x + b.x, y + b.y, true);
				polyb.pts_cache[i21] = layerb.layerToCanvas(x + b.x, y + b.y, false);
			}
			polyb.update_bbox();
			return polya.intersects_poly(polyb, 0, 0);
		}
	};
	var tmpQuad = new cr.quad();
	var tmpRect = new cr.rect(0, 0, 0, 0);
	var collrect_candidates = [];
	Runtime.prototype.testTilemapOverlap = function (tm, a)
	{
		var i, len, c, rc;
		var bbox = a.bbox;
		var tmx = tm.x;
		var tmy = tm.y;
		tm.getCollisionRectCandidates(bbox, collrect_candidates);
		var collrects = collrect_candidates;
		var haspolya = (a.collision_poly && !a.collision_poly.is_empty());
		for (i = 0, len = collrects.length; i < len; ++i)
		{
			c = collrects[i];
			rc = c.rc;
			if (bbox.intersects_rect_off(rc, tmx, tmy))
			{
				tmpQuad.set_from_rect(rc);
				tmpQuad.offset(tmx, tmy);
				if (tmpQuad.intersects_quad(a.bquad))
				{
					if (haspolya)
					{
						a.collision_poly.cache_poly(a.width, a.height, a.angle);
						if (c.poly)
						{
							if (c.poly.intersects_poly(a.collision_poly, a.x - (tmx + rc.left), a.y - (tmy + rc.top)))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							this.temp_poly.set_from_quad(tmpQuad, 0, 0, rc.right - rc.left, rc.bottom - rc.top);
							if (this.temp_poly.intersects_poly(a.collision_poly, a.x, a.y))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
					}
					else
					{
						if (c.poly)
						{
							this.temp_poly.set_from_quad(a.bquad, 0, 0, a.width, a.height);
							if (c.poly.intersects_poly(this.temp_poly, -(tmx + rc.left), -(tmy + rc.top)))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
				}
			}
		}
		cr.clearArray(collrect_candidates);
		return false;
	};
	Runtime.prototype.testRectOverlap = function (r, b)
	{
		if (!b || !b.collisionsEnabled)
			return false;
		b.update_bbox();
		var layerb = b.layer;
		var haspolyb, polyb;
		if (!b.bbox.intersects_rect(r))
			return false;
		if (b.tilemap_exists)
		{
			b.getCollisionRectCandidates(r, collrect_candidates);
			var collrects = collrect_candidates;
			var i, len, c, tilerc;
			var tmx = b.x;
			var tmy = b.y;
			for (i = 0, len = collrects.length; i < len; ++i)
			{
				c = collrects[i];
				tilerc = c.rc;
				if (r.intersects_rect_off(tilerc, tmx, tmy))
				{
					if (c.poly)
					{
						this.temp_poly.set_from_rect(r, 0, 0);
						if (c.poly.intersects_poly(this.temp_poly, -(tmx + tilerc.left), -(tmy + tilerc.top)))
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
					else
					{
						cr.clearArray(collrect_candidates);
						return true;
					}
				}
			}
			cr.clearArray(collrect_candidates);
			return false;
		}
		else
		{
			tmpQuad.set_from_rect(r);
			if (!b.bquad.intersects_quad(tmpQuad))
				return false;
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolyb)
				return true;
			b.collision_poly.cache_poly(b.width, b.height, b.angle);
			tmpQuad.offset(-r.left, -r.top);
			this.temp_poly.set_from_quad(tmpQuad, 0, 0, 1, 1);
			return b.collision_poly.intersects_poly(this.temp_poly, r.left - b.x, r.top - b.y);
		}
	};
	Runtime.prototype.testSegmentOverlap = function (x1, y1, x2, y2, b)
	{
		if (!b || !b.collisionsEnabled)
			return false;
		b.update_bbox();
		var layerb = b.layer;
		var haspolyb, polyb;
		tmpRect.set(cr.min(x1, x2), cr.min(y1, y2), cr.max(x1, x2), cr.max(y1, y2));
		if (!b.bbox.intersects_rect(tmpRect))
			return false;
		if (b.tilemap_exists)
		{
			b.getCollisionRectCandidates(tmpRect, collrect_candidates);
			var collrects = collrect_candidates;
			var i, len, c, tilerc;
			var tmx = b.x;
			var tmy = b.y;
			for (i = 0, len = collrects.length; i < len; ++i)
			{
				c = collrects[i];
				tilerc = c.rc;
				if (tmpRect.intersects_rect_off(tilerc, tmx, tmy))
				{
					tmpQuad.set_from_rect(tilerc);
					tmpQuad.offset(tmx, tmy);
					if (tmpQuad.intersects_segment(x1, y1, x2, y2))
					{
						if (c.poly)
						{
							if (c.poly.intersects_segment(tmx + tilerc.left, tmy + tilerc.top, x1, y1, x2, y2))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
				}
			}
			cr.clearArray(collrect_candidates);
			return false;
		}
		else
		{
			if (!b.bquad.intersects_segment(x1, y1, x2, y2))
				return false;
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolyb)
				return true;
			b.collision_poly.cache_poly(b.width, b.height, b.angle);
			return b.collision_poly.intersects_segment(b.x, b.y, x1, y1, x2, y2);
		}
	};
	Runtime.prototype.typeHasBehavior = function (t, b)
	{
		if (!b)
			return false;
		var i, len, j, lenj, f;
		for (i = 0, len = t.behaviors.length; i < len; i++)
		{
			if (t.behaviors[i].behavior instanceof b)
				return true;
		}
		if (!t.is_family)
		{
			for (i = 0, len = t.families.length; i < len; i++)
			{
				f = t.families[i];
				for (j = 0, lenj = f.behaviors.length; j < lenj; j++)
				{
					if (f.behaviors[j].behavior instanceof b)
						return true;
				}
			}
		}
		return false;
	};
	Runtime.prototype.typeHasNoSaveBehavior = function (t)
	{
		return this.typeHasBehavior(t, cr.behaviors.NoSave);
	};
	Runtime.prototype.typeHasPersistBehavior = function (t)
	{
		return this.typeHasBehavior(t, cr.behaviors.Persist);
	};
	Runtime.prototype.getSolidBehavior = function ()
	{
		return this.solidBehavior;
	};
	Runtime.prototype.getJumpthruBehavior = function ()
	{
		return this.jumpthruBehavior;
	};
	var candidates = [];
	Runtime.prototype.testOverlapSolid = function (inst)
	{
		var i, len, s;
		inst.update_bbox();
		this.getSolidCollisionCandidates(inst.layer, inst.bbox, candidates);
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			s = candidates[i];
			if (!s.extra["solidEnabled"])
				continue;
			if (this.testOverlap(inst, s))
			{
				cr.clearArray(candidates);
				return s;
			}
		}
		cr.clearArray(candidates);
		return null;
	};
	Runtime.prototype.testRectOverlapSolid = function (r)
	{
		var i, len, s;
		this.getSolidCollisionCandidates(null, r, candidates);
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			s = candidates[i];
			if (!s.extra["solidEnabled"])
				continue;
			if (this.testRectOverlap(r, s))
			{
				cr.clearArray(candidates);
				return s;
			}
		}
		cr.clearArray(candidates);
		return null;
	};
	var jumpthru_array_ret = [];
	Runtime.prototype.testOverlapJumpThru = function (inst, all)
	{
		var ret = null;
		if (all)
		{
			ret = jumpthru_array_ret;
			cr.clearArray(ret);
		}
		inst.update_bbox();
		this.getJumpthruCollisionCandidates(inst.layer, inst.bbox, candidates);
		var i, len, j;
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			j = candidates[i];
			if (!j.extra["jumpthruEnabled"])
				continue;
			if (this.testOverlap(inst, j))
			{
				if (all)
					ret.push(j);
				else
				{
					cr.clearArray(candidates);
					return j;
				}
			}
		}
		cr.clearArray(candidates);
		return ret;
	};
	Runtime.prototype.pushOutSolid = function (inst, xdir, ydir, dist, include_jumpthrus, specific_jumpthru)
	{
		var push_dist = dist || 50;
		var oldx = inst.x
		var oldy = inst.y;
		var i;
		var last_overlapped = null, secondlast_overlapped = null;
		for (i = 0; i < push_dist; i++)
		{
			inst.x = (oldx + (xdir * i));
			inst.y = (oldy + (ydir * i));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, last_overlapped))
			{
				last_overlapped = this.testOverlapSolid(inst);
				if (last_overlapped)
					secondlast_overlapped = last_overlapped;
				if (!last_overlapped)
				{
					if (include_jumpthrus)
					{
						if (specific_jumpthru)
							last_overlapped = (this.testOverlap(inst, specific_jumpthru) ? specific_jumpthru : null);
						else
							last_overlapped = this.testOverlapJumpThru(inst);
						if (last_overlapped)
							secondlast_overlapped = last_overlapped;
					}
					if (!last_overlapped)
					{
						if (secondlast_overlapped)
							this.pushInFractional(inst, xdir, ydir, secondlast_overlapped, 16);
						return true;
					}
				}
			}
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushOutSolidAxis = function(inst, xdir, ydir, dist)
	{
		dist = dist || 50;
		var oldX = inst.x;
		var oldY = inst.y;
		var lastOverlapped = null;
		var secondLastOverlapped = null;
		var i, which, sign;
		for (i = 0; i < dist; ++i)
		{
			for (which = 0; which < 2; ++which)
			{
				sign = which * 2 - 1;		// -1 or 1
				inst.x = oldX + (xdir * i * sign);
				inst.y = oldY + (ydir * i * sign);
				inst.set_bbox_changed();
				if (!this.testOverlap(inst, lastOverlapped))
				{
					lastOverlapped = this.testOverlapSolid(inst);
					if (lastOverlapped)
					{
						secondLastOverlapped = lastOverlapped;
					}
					else
					{
						if (secondLastOverlapped)
							this.pushInFractional(inst, xdir * sign, ydir * sign, secondLastOverlapped, 16);
						return true;
					}
				}
			}
		}
		inst.x = oldX;
		inst.y = oldY;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushOut = function (inst, xdir, ydir, dist, otherinst)
	{
		var push_dist = dist || 50;
		var oldx = inst.x
		var oldy = inst.y;
		var i;
		for (i = 0; i < push_dist; i++)
		{
			inst.x = (oldx + (xdir * i));
			inst.y = (oldy + (ydir * i));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, otherinst))
				return true;
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushInFractional = function (inst, xdir, ydir, obj, limit)
	{
		var divisor = 2;
		var frac;
		var forward = false;
		var overlapping = false;
		var bestx = inst.x;
		var besty = inst.y;
		while (divisor <= limit)
		{
			frac = 1 / divisor;
			divisor *= 2;
			inst.x += xdir * frac * (forward ? 1 : -1);
			inst.y += ydir * frac * (forward ? 1 : -1);
			inst.set_bbox_changed();
			if (this.testOverlap(inst, obj))
			{
				forward = true;
				overlapping = true;
			}
			else
			{
				forward = false;
				overlapping = false;
				bestx = inst.x;
				besty = inst.y;
			}
		}
		if (overlapping)
		{
			inst.x = bestx;
			inst.y = besty;
			inst.set_bbox_changed();
		}
	};
	Runtime.prototype.pushOutSolidNearest = function (inst, max_dist_)
	{
		var max_dist = (cr.is_undefined(max_dist_) ? 100 : max_dist_);
		var dist = 0;
		var oldx = inst.x
		var oldy = inst.y;
		var dir = 0;
		var dx = 0, dy = 0;
		var last_overlapped = this.testOverlapSolid(inst);
		if (!last_overlapped)
			return true;		// already clear of solids
		while (dist <= max_dist)
		{
			switch (dir) {
			case 0:		dx = 0; dy = -1; dist++; break;
			case 1:		dx = 1; dy = -1; break;
			case 2:		dx = 1; dy = 0; break;
			case 3:		dx = 1; dy = 1; break;
			case 4:		dx = 0; dy = 1; break;
			case 5:		dx = -1; dy = 1; break;
			case 6:		dx = -1; dy = 0; break;
			case 7:		dx = -1; dy = -1; break;
			}
			dir = (dir + 1) % 8;
			inst.x = cr.floor(oldx + (dx * dist));
			inst.y = cr.floor(oldy + (dy * dist));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, last_overlapped))
			{
				last_overlapped = this.testOverlapSolid(inst);
				if (!last_overlapped)
					return true;
			}
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.registerCollision = function (a, b)
	{
		if (!a.collisionsEnabled || !b.collisionsEnabled)
			return;
		this.registered_collisions.push([a, b]);
	};
	Runtime.prototype.addRegisteredCollisionCandidates = function (inst, otherType, arr)
	{
		var i, len, r, otherInst;
		for (i = 0, len = this.registered_collisions.length; i < len; ++i)
		{
			r = this.registered_collisions[i];
			if (r[0] === inst)
				otherInst = r[1];
			else if (r[1] === inst)
				otherInst = r[0];
			else
				continue;
			if (otherType.is_family)
			{
				if (otherType.members.indexOf(otherType) === -1)
					continue;
			}
			else
			{
				if (otherInst.type !== otherType)
					continue;
			}
			if (arr.indexOf(otherInst) === -1)
				arr.push(otherInst);
		}
	};
	Runtime.prototype.checkRegisteredCollision = function (a, b)
	{
		var i, len, x;
		for (i = 0, len = this.registered_collisions.length; i < len; i++)
		{
			x = this.registered_collisions[i];
			if ((x[0] === a && x[1] === b) || (x[0] === b && x[1] === a))
				return true;
		}
		return false;
	};
	Runtime.prototype.calculateSolidBounceAngle = function(inst, startx, starty, obj)
	{
		var objx = inst.x;
		var objy = inst.y;
		var radius = cr.max(10, cr.distanceTo(startx, starty, objx, objy));
		var startangle = cr.angleTo(startx, starty, objx, objy);
		var firstsolid = obj || this.testOverlapSolid(inst);
		if (!firstsolid)
			return cr.clamp_angle(startangle + cr.PI);
		var cursolid = firstsolid;
		var i, curangle, anticlockwise_free_angle, clockwise_free_angle;
		var increment = cr.to_radians(5);	// 5 degree increments
		for (i = 1; i < 36; i++)
		{
			curangle = startangle - i * increment;
			inst.x = startx + Math.cos(curangle) * radius;
			inst.y = starty + Math.sin(curangle) * radius;
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, cursolid))
			{
				cursolid = obj ? null : this.testOverlapSolid(inst);
				if (!cursolid)
				{
					anticlockwise_free_angle = curangle;
					break;
				}
			}
		}
		if (i === 36)
			anticlockwise_free_angle = cr.clamp_angle(startangle + cr.PI);
		var cursolid = firstsolid;
		for (i = 1; i < 36; i++)
		{
			curangle = startangle + i * increment;
			inst.x = startx + Math.cos(curangle) * radius;
			inst.y = starty + Math.sin(curangle) * radius;
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, cursolid))
			{
				cursolid = obj ? null : this.testOverlapSolid(inst);
				if (!cursolid)
				{
					clockwise_free_angle = curangle;
					break;
				}
			}
		}
		if (i === 36)
			clockwise_free_angle = cr.clamp_angle(startangle + cr.PI);
		inst.x = objx;
		inst.y = objy;
		inst.set_bbox_changed();
		if (clockwise_free_angle === anticlockwise_free_angle)
			return clockwise_free_angle;
		var half_diff = cr.angleDiff(clockwise_free_angle, anticlockwise_free_angle) / 2;
		var normal;
		if (cr.angleClockwise(clockwise_free_angle, anticlockwise_free_angle))
		{
			normal = cr.clamp_angle(anticlockwise_free_angle + half_diff + cr.PI);
		}
		else
		{
			normal = cr.clamp_angle(clockwise_free_angle + half_diff);
		}
;
		var vx = Math.cos(startangle);
		var vy = Math.sin(startangle);
		var nx = Math.cos(normal);
		var ny = Math.sin(normal);
		var v_dot_n = vx * nx + vy * ny;
		var rx = vx - 2 * v_dot_n * nx;
		var ry = vy - 2 * v_dot_n * ny;
		return cr.angleTo(0, 0, rx, ry);
	};
	var triggerSheetIndex = -1;
	Runtime.prototype.trigger = function (method, inst, value /* for fast triggers */)
	{
;
		if (!this.running_layout)
			return false;
		var sheet = this.running_layout.event_sheet;
		if (!sheet)
			return false;     // no event sheet active; nothing to trigger
		var ret = false;
		var r, i, len;
		triggerSheetIndex++;
		var deep_includes = sheet.deep_includes;
		for (i = 0, len = deep_includes.length; i < len; ++i)
		{
			r = this.triggerOnSheet(method, inst, deep_includes[i], value);
			ret = ret || r;
		}
		r = this.triggerOnSheet(method, inst, sheet, value);
		ret = ret || r;
		triggerSheetIndex--;
		return ret;
    };
    Runtime.prototype.triggerOnSheet = function (method, inst, sheet, value)
    {
        var ret = false;
		var i, leni, r, families;
		if (!inst)
		{
			r = this.triggerOnSheetForTypeName(method, inst, "system", sheet, value);
			ret = ret || r;
		}
		else
		{
			r = this.triggerOnSheetForTypeName(method, inst, inst.type.name, sheet, value);
			ret = ret || r;
			families = inst.type.families;
			for (i = 0, leni = families.length; i < leni; ++i)
			{
				r = this.triggerOnSheetForTypeName(method, inst, families[i].name, sheet, value);
				ret = ret || r;
			}
		}
		return ret;             // true if anything got triggered
	};
	Runtime.prototype.triggerOnSheetForTypeName = function (method, inst, type_name, sheet, value)
	{
		var i, leni;
		var ret = false, ret2 = false;
		var trig, index;
		var fasttrigger = (typeof value !== "undefined");
		var triggers = (fasttrigger ? sheet.fasttriggers : sheet.triggers);
		var obj_entry = triggers[type_name];
		if (!obj_entry)
			return ret;
		var triggers_list = null;
		for (i = 0, leni = obj_entry.length; i < leni; ++i)
		{
			if (obj_entry[i].method == method)
			{
				triggers_list = obj_entry[i].evs;
				break;
			}
		}
		if (!triggers_list)
			return ret;
		var triggers_to_fire;
		if (fasttrigger)
		{
			triggers_to_fire = triggers_list[value];
		}
		else
		{
			triggers_to_fire = triggers_list;
		}
		if (!triggers_to_fire)
			return null;
		for (i = 0, leni = triggers_to_fire.length; i < leni; i++)
		{
			trig = triggers_to_fire[i][0];
			index = triggers_to_fire[i][1];
			ret2 = this.executeSingleTrigger(inst, type_name, trig, index);
			ret = ret || ret2;
		}
		return ret;
	};
	Runtime.prototype.executeSingleTrigger = function (inst, type_name, trig, index)
	{
		var i, leni;
		var ret = false;
		this.trigger_depth++;
		var current_event = this.getCurrentEventStack().current_event;
		if (current_event)
			this.pushCleanSol(current_event.solModifiersIncludingParents);
		var isrecursive = (this.trigger_depth > 1);		// calling trigger from inside another trigger
		this.pushCleanSol(trig.solModifiersIncludingParents);
		if (isrecursive)
			this.pushLocalVarStack();
		var event_stack = this.pushEventStack(trig);
		event_stack.current_event = trig;
		if (inst)
		{
			var sol = this.types[type_name].getCurrentSol();
			sol.select_all = false;
			cr.clearArray(sol.instances);
			sol.instances[0] = inst;
			this.types[type_name].applySolToContainer();
		}
		var ok_to_run = true;
		if (trig.parent)
		{
			var temp_parents_arr = event_stack.temp_parents_arr;
			var cur_parent = trig.parent;
			while (cur_parent)
			{
				temp_parents_arr.push(cur_parent);
				cur_parent = cur_parent.parent;
			}
			temp_parents_arr.reverse();
			for (i = 0, leni = temp_parents_arr.length; i < leni; i++)
			{
				if (!temp_parents_arr[i].run_pretrigger())   // parent event failed
				{
					ok_to_run = false;
					break;
				}
			}
		}
		if (ok_to_run)
		{
			this.execcount++;
			if (trig.orblock)
				trig.run_orblocktrigger(index);
			else
				trig.run();
			ret = ret || event_stack.last_event_true;
		}
		this.popEventStack();
		if (isrecursive)
			this.popLocalVarStack();
		this.popSol(trig.solModifiersIncludingParents);
		if (current_event)
			this.popSol(current_event.solModifiersIncludingParents);
		if (this.hasPendingInstances && this.isInOnDestroy === 0 && triggerSheetIndex === 0 && !this.isRunningEvents)
		{
			this.ClearDeathRow();
		}
		this.trigger_depth--;
		return ret;
	};
	Runtime.prototype.getCurrentCondition = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.current_event.conditions[evinfo.cndindex];
	};
	Runtime.prototype.getCurrentConditionObjectType = function ()
	{
		var cnd = this.getCurrentCondition();
		return cnd.type;
	};
	Runtime.prototype.isCurrentConditionFirst = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.cndindex === 0;
	};
	Runtime.prototype.getCurrentAction = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.current_event.actions[evinfo.actindex];
	};
	Runtime.prototype.pushLocalVarStack = function ()
	{
		this.localvar_stack_index++;
		if (this.localvar_stack_index >= this.localvar_stack.length)
			this.localvar_stack.push([]);
	};
	Runtime.prototype.popLocalVarStack = function ()
	{
;
		this.localvar_stack_index--;
	};
	Runtime.prototype.getCurrentLocalVarStack = function ()
	{
		return this.localvar_stack[this.localvar_stack_index];
	};
	Runtime.prototype.pushEventStack = function (cur_event)
	{
		this.event_stack_index++;
		if (this.event_stack_index >= this.event_stack.length)
			this.event_stack.push(new cr.eventStackFrame());
		var ret = this.getCurrentEventStack();
		ret.reset(cur_event);
		return ret;
	};
	Runtime.prototype.popEventStack = function ()
	{
;
		this.event_stack_index--;
	};
	Runtime.prototype.getCurrentEventStack = function ()
	{
		return this.event_stack[this.event_stack_index];
	};
	Runtime.prototype.pushLoopStack = function (name_)
	{
		this.loop_stack_index++;
		if (this.loop_stack_index >= this.loop_stack.length)
		{
			this.loop_stack.push(cr.seal({ name: name_, index: 0, stopped: false }));
		}
		var ret = this.getCurrentLoop();
		ret.name = name_;
		ret.index = 0;
		ret.stopped = false;
		return ret;
	};
	Runtime.prototype.popLoopStack = function ()
	{
;
		this.loop_stack_index--;
	};
	Runtime.prototype.getCurrentLoop = function ()
	{
		return this.loop_stack[this.loop_stack_index];
	};
	Runtime.prototype.getEventVariableByName = function (name, scope)
	{
		var i, leni, j, lenj, sheet, e;
		while (scope)
		{
			for (i = 0, leni = scope.subevents.length; i < leni; i++)
			{
				e = scope.subevents[i];
				if (e instanceof cr.eventvariable && cr.equals_nocase(name, e.name))
					return e;
			}
			scope = scope.parent;
		}
		for (i = 0, leni = this.eventsheets_by_index.length; i < leni; i++)
		{
			sheet = this.eventsheets_by_index[i];
			for (j = 0, lenj = sheet.events.length; j < lenj; j++)
			{
				e = sheet.events[j];
				if (e instanceof cr.eventvariable && cr.equals_nocase(name, e.name))
					return e;
			}
		}
		return null;
	};
	Runtime.prototype.getLayoutBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			if (this.layouts_by_index[i].sid === sid_)
				return this.layouts_by_index[i];
		}
		return null;
	};
	Runtime.prototype.getObjectTypeBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			if (this.types_by_index[i].sid === sid_)
				return this.types_by_index[i];
		}
		return null;
	};
	Runtime.prototype.getGroupBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.allGroups.length; i < len; i++)
		{
			if (this.allGroups[i].sid === sid_)
				return this.allGroups[i];
		}
		return null;
	};
	Runtime.prototype.doCanvasSnapshot = function (format_, quality_)
	{
		this.snapshotCanvas = [format_, quality_];
		this.redraw = true;		// force redraw so snapshot is always taken
	};
	function IsIndexedDBAvailable()
	{
		try {
			return !!window.indexedDB;
		}
		catch (e)
		{
			return false;
		}
	};
	function makeSaveDb(e)
	{
		var db = e.target.result;
		db.createObjectStore("saves", { keyPath: "slot" });
	};
	function IndexedDB_WriteSlot(slot_, data_, oncomplete_, onerror_)
	{
		try {
			var request = indexedDB.open("_C2SaveStates");
			request.onupgradeneeded = makeSaveDb;
			request.onerror = onerror_;
			request.onsuccess = function (e)
			{
				var db = e.target.result;
				db.onerror = onerror_;
				var transaction = db.transaction(["saves"], "readwrite");
				var objectStore = transaction.objectStore("saves");
				var putReq = objectStore.put({"slot": slot_, "data": data_ });
				putReq.onsuccess = oncomplete_;
			};
		}
		catch (err)
		{
			onerror_(err);
		}
	};
	function IndexedDB_ReadSlot(slot_, oncomplete_, onerror_)
	{
		try {
			var request = indexedDB.open("_C2SaveStates");
			request.onupgradeneeded = makeSaveDb;
			request.onerror = onerror_;
			request.onsuccess = function (e)
			{
				var db = e.target.result;
				db.onerror = onerror_;
				var transaction = db.transaction(["saves"]);
				var objectStore = transaction.objectStore("saves");
				var readReq = objectStore.get(slot_);
				readReq.onsuccess = function (e)
				{
					if (readReq.result)
						oncomplete_(readReq.result["data"]);
					else
						oncomplete_(null);
				};
			};
		}
		catch (err)
		{
			onerror_(err);
		}
	};
	Runtime.prototype.signalContinuousPreview = function ()
	{
		this.signalledContinuousPreview = true;
	};
	function doContinuousPreviewReload()
	{
		cr.logexport("Reloading for continuous preview");
		if (!!window["c2cocoonjs"])
		{
			CocoonJS["App"]["reload"]();
		}
		else
		{
			if (window.location.search.indexOf("continuous") > -1)
				window.location.reload(true);
			else
				window.location = window.location + "?continuous";
		}
	};
	Runtime.prototype.handleSaveLoad = function ()
	{
		var self = this;
		var savingToSlot = this.saveToSlot;
		var savingJson = this.lastSaveJson;
		var loadingFromSlot = this.loadFromSlot;
		var continuous = false;
		if (this.signalledContinuousPreview)
		{
			continuous = true;
			savingToSlot = "__c2_continuouspreview";
			this.signalledContinuousPreview = false;
		}
		if (savingToSlot.length)
		{
			this.ClearDeathRow();
			savingJson = this.saveToJSONString();
			if (IsIndexedDBAvailable() && !this.isCocoonJs)
			{
				IndexedDB_WriteSlot(savingToSlot, savingJson, function ()
				{
					cr.logexport("Saved state to IndexedDB storage (" + savingJson.length + " bytes)");
					self.lastSaveJson = savingJson;
					self.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
					self.lastSaveJson = "";
					savingJson = "";
					if (continuous)
						doContinuousPreviewReload();
				}, function (e)
				{
					try {
						localStorage.setItem("__c2save_" + savingToSlot, savingJson);
						cr.logexport("Saved state to WebStorage (" + savingJson.length + " bytes)");
						self.lastSaveJson = savingJson;
						self.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
						self.lastSaveJson = "";
						savingJson = "";
						if (continuous)
							doContinuousPreviewReload();
					}
					catch (f)
					{
						cr.logexport("Failed to save game state: " + e + "; " + f);
						self.trigger(cr.system_object.prototype.cnds.OnSaveFailed, null);
					}
				});
			}
			else
			{
				try {
					localStorage.setItem("__c2save_" + savingToSlot, savingJson);
					cr.logexport("Saved state to WebStorage (" + savingJson.length + " bytes)");
					self.lastSaveJson = savingJson;
					this.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
					self.lastSaveJson = "";
					savingJson = "";
					if (continuous)
						doContinuousPreviewReload();
				}
				catch (e)
				{
					cr.logexport("Error saving to WebStorage: " + e);
					self.trigger(cr.system_object.prototype.cnds.OnSaveFailed, null);
				}
			}
			this.saveToSlot = "";
			this.loadFromSlot = "";
			this.loadFromJson = null;
		}
		if (loadingFromSlot.length)
		{
			if (IsIndexedDBAvailable() && !this.isCocoonJs)
			{
				IndexedDB_ReadSlot(loadingFromSlot, function (result_)
				{
					if (result_)
					{
						self.loadFromJson = result_;
						cr.logexport("Loaded state from IndexedDB storage (" + self.loadFromJson.length + " bytes)");
					}
					else
					{
						self.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
						cr.logexport("Loaded state from WebStorage (" + self.loadFromJson.length + " bytes)");
					}
					self.suspendDrawing = false;
					if (!self.loadFromJson)
					{
						self.loadFromJson = null;
						self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
					}
				}, function (e)
				{
					self.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
					cr.logexport("Loaded state from WebStorage (" + self.loadFromJson.length + " bytes)");
					self.suspendDrawing = false;
					if (!self.loadFromJson)
					{
						self.loadFromJson = null;
						self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
					}
				});
			}
			else
			{
				try {
					this.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
					cr.logexport("Loaded state from WebStorage (" + this.loadFromJson.length + " bytes)");
				}
				catch (e)
				{
					this.loadFromJson = null;
				}
				this.suspendDrawing = false;
				if (!self.loadFromJson)
				{
					self.loadFromJson = null;
					self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
				}
			}
			this.loadFromSlot = "";
			this.saveToSlot = "";
		}
		if (this.loadFromJson !== null)
		{
			this.ClearDeathRow();
			var ok = this.loadFromJSONString(this.loadFromJson);
			if (ok)
			{
				this.lastSaveJson = this.loadFromJson;
				this.trigger(cr.system_object.prototype.cnds.OnLoadComplete, null);
				this.lastSaveJson = "";
			}
			else
			{
				self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
			}
			this.loadFromJson = null;
		}
	};
	function CopyExtraObject(extra)
	{
		var p, ret = {};
		for (p in extra)
		{
			if (extra.hasOwnProperty(p))
			{
				if (extra[p] instanceof cr.ObjectSet)
					continue;
				if (extra[p] && typeof extra[p].c2userdata !== "undefined")
					continue;
				if (p === "spriteCreatedDestroyCallback")
					continue;
				ret[p] = extra[p];
			}
		}
		return ret;
	};
	Runtime.prototype.saveToJSONString = function()
	{
		var i, len, j, lenj, type, layout, typeobj, g, c, a, v, p;
		var o = {
			"c2save":				true,
			"version":				1,
			"rt": {
				"time":				this.kahanTime.sum,
				"walltime":			this.wallTime.sum,
				"timescale":		this.timescale,
				"tickcount":		this.tickcount,
				"execcount":		this.execcount,
				"next_uid":			this.next_uid,
				"running_layout":	this.running_layout.sid,
				"start_time_offset": (Date.now() - this.start_time)
			},
			"types": {},
			"layouts": {},
			"events": {
				"groups": {},
				"cnds": {},
				"acts": {},
				"vars": {}
			}
		};
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || this.typeHasNoSaveBehavior(type))
				continue;
			typeobj = {
				"instances": []
			};
			if (cr.hasAnyOwnProperty(type.extra))
				typeobj["ex"] = CopyExtraObject(type.extra);
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				typeobj["instances"].push(this.saveInstanceToJSON(type.instances[j]));
			}
			o["types"][type.sid.toString()] = typeobj;
		}
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			layout = this.layouts_by_index[i];
			o["layouts"][layout.sid.toString()] = layout.saveToJSON();
		}
		var ogroups = o["events"]["groups"];
		for (i = 0, len = this.allGroups.length; i < len; i++)
		{
			g = this.allGroups[i];
			ogroups[g.sid.toString()] = this.groups_by_name[g.group_name].group_active;
		}
		var ocnds = o["events"]["cnds"];
		for (p in this.cndsBySid)
		{
			if (this.cndsBySid.hasOwnProperty(p))
			{
				c = this.cndsBySid[p];
				if (cr.hasAnyOwnProperty(c.extra))
					ocnds[p] = { "ex": CopyExtraObject(c.extra) };
			}
		}
		var oacts = o["events"]["acts"];
		for (p in this.actsBySid)
		{
			if (this.actsBySid.hasOwnProperty(p))
			{
				a = this.actsBySid[p];
				if (cr.hasAnyOwnProperty(a.extra))
					oacts[p] = { "ex": CopyExtraObject(a.extra) };
			}
		}
		var ovars = o["events"]["vars"];
		for (p in this.varsBySid)
		{
			if (this.varsBySid.hasOwnProperty(p))
			{
				v = this.varsBySid[p];
				if (!v.is_constant && (!v.parent || v.is_static))
					ovars[p] = v.data;
			}
		}
		o["system"] = this.system.saveToJSON();
		return JSON.stringify(o);
	};
	Runtime.prototype.refreshUidMap = function ()
	{
		var i, len, type, j, lenj, inst;
		this.objectsByUid = {};
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				this.objectsByUid[inst.uid.toString()] = inst;
			}
		}
	};
	Runtime.prototype.loadFromJSONString = function (str)
	{
		var o;
		try {
			o = JSON.parse(str);
		}
		catch (e) {
			return false;
		}
		if (!o["c2save"])
			return false;		// probably not a c2 save state
		if (o["version"] > 1)
			return false;		// from future version of c2; assume not compatible
		this.isLoadingState = true;
		var rt = o["rt"];
		this.kahanTime.reset();
		this.kahanTime.sum = rt["time"];
		this.wallTime.reset();
		this.wallTime.sum = rt["walltime"] || 0;
		this.timescale = rt["timescale"];
		this.tickcount = rt["tickcount"];
		this.execcount = rt["execcount"];
		this.start_time = Date.now() - rt["start_time_offset"];
		var layout_sid = rt["running_layout"];
		if (layout_sid !== this.running_layout.sid)
		{
			var changeToLayout = this.getLayoutBySid(layout_sid);
			if (changeToLayout)
				this.doChangeLayout(changeToLayout);
			else
				return;		// layout that was saved on has gone missing (deleted?)
		}
		var i, len, j, lenj, k, lenk, p, type, existing_insts, load_insts, inst, binst, layout, layer, g, iid, t;
		var otypes = o["types"];
		for (p in otypes)
		{
			if (otypes.hasOwnProperty(p))
			{
				type = this.getObjectTypeBySid(parseInt(p, 10));
				if (!type || type.is_family || this.typeHasNoSaveBehavior(type))
					continue;
				if (otypes[p]["ex"])
					type.extra = otypes[p]["ex"];
				else
					cr.wipe(type.extra);
				existing_insts = type.instances;
				load_insts = otypes[p]["instances"];
				for (i = 0, len = cr.min(existing_insts.length, load_insts.length); i < len; i++)
				{
					this.loadInstanceFromJSON(existing_insts[i], load_insts[i]);
				}
				for (i = load_insts.length, len = existing_insts.length; i < len; i++)
					this.DestroyInstance(existing_insts[i]);
				for (i = existing_insts.length, len = load_insts.length; i < len; i++)
				{
					layer = null;
					if (type.plugin.is_world)
					{
						layer = this.running_layout.getLayerBySid(load_insts[i]["w"]["l"]);
						if (!layer)
							continue;
					}
					inst = this.createInstanceFromInit(type.default_instance, layer, false, 0, 0, true);
					this.loadInstanceFromJSON(inst, load_insts[i]);
				}
				type.stale_iids = true;
			}
		}
		this.ClearDeathRow();
		this.refreshUidMap();
		var olayouts = o["layouts"];
		for (p in olayouts)
		{
			if (olayouts.hasOwnProperty(p))
			{
				layout = this.getLayoutBySid(parseInt(p, 10));
				if (!layout)
					continue;		// must've gone missing
				layout.loadFromJSON(olayouts[p]);
			}
		}
		var ogroups = o["events"]["groups"];
		for (p in ogroups)
		{
			if (ogroups.hasOwnProperty(p))
			{
				g = this.getGroupBySid(parseInt(p, 10));
				if (g && this.groups_by_name[g.group_name])
					this.groups_by_name[g.group_name].setGroupActive(ogroups[p]);
			}
		}
		var ocnds = o["events"]["cnds"];
		for (p in this.cndsBySid)
		{
			if (this.cndsBySid.hasOwnProperty(p))
			{
				if (ocnds.hasOwnProperty(p))
				{
					this.cndsBySid[p].extra = ocnds[p]["ex"];
				}
				else
				{
					this.cndsBySid[p].extra = {};
				}
			}
		}
		var oacts = o["events"]["acts"];
		for (p in this.actsBySid)
		{
			if (this.actsBySid.hasOwnProperty(p))
			{
				if (oacts.hasOwnProperty(p))
				{
					this.actsBySid[p].extra = oacts[p]["ex"];
				}
				else
				{
					this.actsBySid[p].extra = {};
				}
			}
		}
		var ovars = o["events"]["vars"];
		for (p in ovars)
		{
			if (ovars.hasOwnProperty(p) && this.varsBySid.hasOwnProperty(p))
			{
				this.varsBySid[p].data = ovars[p];
			}
		}
		this.next_uid = rt["next_uid"];
		this.isLoadingState = false;
		for (i = 0, len = this.fireOnCreateAfterLoad.length; i < len; ++i)
		{
			inst = this.fireOnCreateAfterLoad[i];
			this.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
		}
		cr.clearArray(this.fireOnCreateAfterLoad);
		this.system.loadFromJSON(o["system"]);
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || this.typeHasNoSaveBehavior(type))
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (type.is_contained)
				{
					iid = inst.get_iid();
					cr.clearArray(inst.siblings);
					for (k = 0, lenk = type.container.length; k < lenk; k++)
					{
						t = type.container[k];
						if (type === t)
							continue;
;
						inst.siblings.push(t.instances[iid]);
					}
				}
				if (inst.afterLoad)
					inst.afterLoad();
				if (inst.behavior_insts)
				{
					for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
					{
						binst = inst.behavior_insts[k];
						if (binst.afterLoad)
							binst.afterLoad();
					}
				}
			}
		}
		this.redraw = true;
		return true;
	};
	Runtime.prototype.saveInstanceToJSON = function(inst, state_only)
	{
		var i, len, world, behinst, et;
		var type = inst.type;
		var plugin = type.plugin;
		var o = {};
		if (state_only)
			o["c2"] = true;		// mark as known json data from Construct 2
		else
			o["uid"] = inst.uid;
		if (cr.hasAnyOwnProperty(inst.extra))
			o["ex"] = CopyExtraObject(inst.extra);
		if (inst.instance_vars && inst.instance_vars.length)
		{
			o["ivs"] = {};
			for (i = 0, len = inst.instance_vars.length; i < len; i++)
			{
				o["ivs"][inst.type.instvar_sids[i].toString()] = inst.instance_vars[i];
			}
		}
		if (plugin.is_world)
		{
			world = {
				"x": inst.x,
				"y": inst.y,
				"w": inst.width,
				"h": inst.height,
				"l": inst.layer.sid,
				"zi": inst.get_zindex()
			};
			if (inst.angle !== 0)
				world["a"] = inst.angle;
			if (inst.opacity !== 1)
				world["o"] = inst.opacity;
			if (inst.hotspotX !== 0.5)
				world["hX"] = inst.hotspotX;
			if (inst.hotspotY !== 0.5)
				world["hY"] = inst.hotspotY;
			if (inst.blend_mode !== 0)
				world["bm"] = inst.blend_mode;
			if (!inst.visible)
				world["v"] = inst.visible;
			if (!inst.collisionsEnabled)
				world["ce"] = inst.collisionsEnabled;
			if (inst.my_timescale !== -1)
				world["mts"] = inst.my_timescale;
			if (type.effect_types.length)
			{
				world["fx"] = [];
				for (i = 0, len = type.effect_types.length; i < len; i++)
				{
					et = type.effect_types[i];
					world["fx"].push({"name": et.name,
									  "active": inst.active_effect_flags[et.index],
									  "params": inst.effect_params[et.index] });
				}
			}
			o["w"] = world;
		}
		if (inst.behavior_insts && inst.behavior_insts.length)
		{
			o["behs"] = {};
			for (i = 0, len = inst.behavior_insts.length; i < len; i++)
			{
				behinst = inst.behavior_insts[i];
				if (behinst.saveToJSON)
					o["behs"][behinst.type.sid.toString()] = behinst.saveToJSON();
			}
		}
		if (inst.saveToJSON)
			o["data"] = inst.saveToJSON();
		return o;
	};
	Runtime.prototype.getInstanceVarIndexBySid = function (type, sid_)
	{
		var i, len;
		for (i = 0, len = type.instvar_sids.length; i < len; i++)
		{
			if (type.instvar_sids[i] === sid_)
				return i;
		}
		return -1;
	};
	Runtime.prototype.getBehaviorIndexBySid = function (inst, sid_)
	{
		var i, len;
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i].type.sid === sid_)
				return i;
		}
		return -1;
	};
	Runtime.prototype.loadInstanceFromJSON = function(inst, o, state_only)
	{
		var p, i, len, iv, oivs, world, fxindex, obehs, behindex, value;
		var oldlayer;
		var type = inst.type;
		var plugin = type.plugin;
		if (state_only)
		{
			if (!o["c2"])
				return;
		}
		else
			inst.uid = o["uid"];
		if (o["ex"])
			inst.extra = o["ex"];
		else
			cr.wipe(inst.extra);
		oivs = o["ivs"];
		if (oivs)
		{
			for (p in oivs)
			{
				if (oivs.hasOwnProperty(p))
				{
					iv = this.getInstanceVarIndexBySid(type, parseInt(p, 10));
					if (iv < 0 || iv >= inst.instance_vars.length)
						continue;		// must've gone missing
					value = oivs[p];
					if (value === null)
						value = NaN;
					inst.instance_vars[iv] = value;
				}
			}
		}
		if (plugin.is_world)
		{
			world = o["w"];
			if (inst.layer.sid !== world["l"])
			{
				oldlayer = inst.layer;
				inst.layer = this.running_layout.getLayerBySid(world["l"]);
				if (inst.layer)
				{
					oldlayer.removeFromInstanceList(inst, true);
					inst.layer.appendToInstanceList(inst, true);
					inst.set_bbox_changed();
					inst.layer.setZIndicesStaleFrom(0);
				}
				else
				{
					inst.layer = oldlayer;
					if (!state_only)
						this.DestroyInstance(inst);
				}
			}
			inst.x = world["x"];
			inst.y = world["y"];
			inst.width = world["w"];
			inst.height = world["h"];
			inst.zindex = world["zi"];
			inst.angle = world.hasOwnProperty("a") ? world["a"] : 0;
			inst.opacity = world.hasOwnProperty("o") ? world["o"] : 1;
			inst.hotspotX = world.hasOwnProperty("hX") ? world["hX"] : 0.5;
			inst.hotspotY = world.hasOwnProperty("hY") ? world["hY"] : 0.5;
			inst.visible = world.hasOwnProperty("v") ? world["v"] : true;
			inst.collisionsEnabled = world.hasOwnProperty("ce") ? world["ce"] : true;
			inst.my_timescale = world.hasOwnProperty("mts") ? world["mts"] : -1;
			inst.blend_mode = world.hasOwnProperty("bm") ? world["bm"] : 0;;
			inst.compositeOp = cr.effectToCompositeOp(inst.blend_mode);
			if (this.gl)
				cr.setGLBlend(inst, inst.blend_mode, this.gl);
			inst.set_bbox_changed();
			if (world.hasOwnProperty("fx"))
			{
				for (i = 0, len = world["fx"].length; i < len; i++)
				{
					fxindex = type.getEffectIndexByName(world["fx"][i]["name"]);
					if (fxindex < 0)
						continue;		// must've gone missing
					inst.active_effect_flags[fxindex] = world["fx"][i]["active"];
					inst.effect_params[fxindex] = world["fx"][i]["params"];
				}
			}
			inst.updateActiveEffects();
		}
		obehs = o["behs"];
		if (obehs)
		{
			for (p in obehs)
			{
				if (obehs.hasOwnProperty(p))
				{
					behindex = this.getBehaviorIndexBySid(inst, parseInt(p, 10));
					if (behindex < 0)
						continue;		// must've gone missing
					inst.behavior_insts[behindex].loadFromJSON(obehs[p]);
				}
			}
		}
		if (o["data"])
			inst.loadFromJSON(o["data"]);
	};
	Runtime.prototype.fetchLocalFileViaCordova = function (filename, successCallback, errorCallback)
	{
		var path = cordova["file"]["applicationDirectory"] + "www/" + filename;
		window["resolveLocalFileSystemURL"](path, function (entry)
		{
			entry.file(successCallback, errorCallback);
		}, errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsText = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordova(filename, function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				successCallback(e.target.result);
			};
			reader.onerror = errorCallback;
			reader.readAsText(file);
		}, errorCallback);
	};
	var queuedArrayBufferReads = [];
	var activeArrayBufferReads = 0;
	var MAX_ARRAYBUFFER_READS = 8;
	Runtime.prototype.maybeStartNextArrayBufferRead = function()
	{
		if (!queuedArrayBufferReads.length)
			return;		// none left
		if (activeArrayBufferReads >= MAX_ARRAYBUFFER_READS)
			return;		// already got maximum number in-flight
		activeArrayBufferReads++;
		var job = queuedArrayBufferReads.shift();
		this.doFetchLocalFileViaCordovaAsArrayBuffer(job.filename, job.successCallback, job.errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsArrayBuffer = function (filename, successCallback_, errorCallback_)
	{
		var self = this;
		queuedArrayBufferReads.push({
			filename: filename,
			successCallback: function (result)
			{
				activeArrayBufferReads--;
				self.maybeStartNextArrayBufferRead();
				successCallback_(result);
			},
			errorCallback: function (err)
			{
				activeArrayBufferReads--;
				self.maybeStartNextArrayBufferRead();
				errorCallback_(err);
			}
		});
		this.maybeStartNextArrayBufferRead();
	};
	Runtime.prototype.doFetchLocalFileViaCordovaAsArrayBuffer = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordova(filename, function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				successCallback(e.target.result);
			};
			reader.readAsArrayBuffer(file);
		}, errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsURL = function (filename, successCallback, errorCallback)
	{
		var blobType = "";
		var lowername = filename.toLowerCase();
		var ext3 = lowername.substr(lowername.length - 4);
		var ext4 = lowername.substr(lowername.length - 5);
		if (ext3 === ".mp4")
			blobType = "video/mp4";
		else if (ext4 === ".webm")
			blobType = "video/webm";		// use video type but hopefully works with audio too
		else if (ext3 === ".m4a")
			blobType = "audio/mp4";
		else if (ext3 === ".mp3")
			blobType = "audio/mpeg";
		this.fetchLocalFileViaCordovaAsArrayBuffer(filename, function (arrayBuffer)
		{
			var blob = new Blob([arrayBuffer], { type: blobType });
			var url = URL.createObjectURL(blob);
			successCallback(url);
		}, errorCallback);
	};
	Runtime.prototype.isAbsoluteUrl = function (url)
	{
		return /^(?:[a-z]+:)?\/\//.test(url) || url.substr(0, 5) === "data:"  || url.substr(0, 5) === "blob:";
	};
	Runtime.prototype.setImageSrc = function (img, src)
	{
		if (this.isWKWebView && !this.isAbsoluteUrl(src))
		{
			this.fetchLocalFileViaCordovaAsURL(src, function (url)
			{
				img.src = url;
			}, function (err)
			{
				alert("Failed to load image: " + err);
			});
		}
		else
		{
			img.src = src;
		}
	};
	Runtime.prototype.setCtxImageSmoothingEnabled = function (ctx, e)
	{
		if (typeof ctx["imageSmoothingEnabled"] !== "undefined")
		{
			ctx["imageSmoothingEnabled"] = e;
		}
		else
		{
			ctx["webkitImageSmoothingEnabled"] = e;
			ctx["mozImageSmoothingEnabled"] = e;
			ctx["msImageSmoothingEnabled"] = e;
		}
	};
	cr.runtime = Runtime;
	cr.createRuntime = function (canvasid)
	{
		return new Runtime(document.getElementById(canvasid));
	};
	cr.createDCRuntime = function (w, h)
	{
		return new Runtime({ "dc": true, "width": w, "height": h });
	};
	window["cr_createRuntime"] = cr.createRuntime;
	window["cr_createDCRuntime"] = cr.createDCRuntime;
	window["createCocoonJSRuntime"] = function ()
	{
		window["c2cocoonjs"] = true;
		var canvas = document.createElement("screencanvas") || document.createElement("canvas");
		canvas.screencanvas = true;
		document.body.appendChild(canvas);
		var rt = new Runtime(canvas);
		window["c2runtime"] = rt;
		window.addEventListener("orientationchange", function () {
			window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		});
		window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		return rt;
	};
	window["createEjectaRuntime"] = function ()
	{
		var canvas = document.getElementById("canvas");
		var rt = new Runtime(canvas);
		window["c2runtime"] = rt;
		window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		return rt;
	};
}());
window["cr_getC2Runtime"] = function()
{
	var canvas = document.getElementById("c2canvas");
	if (canvas)
		return canvas["c2runtime"];
	else if (window["c2runtime"])
		return window["c2runtime"];
	else
		return null;
}
window["cr_getSnapshot"] = function (format_, quality_)
{
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime.doCanvasSnapshot(format_, quality_);
}
window["cr_sizeCanvas"] = function(w, h)
{
	if (w === 0 || h === 0)
		return;
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime["setSize"](w, h);
}
window["cr_setSuspended"] = function(s)
{
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime["setSuspended"](s);
}
;
(function()
{
	function Layout(runtime, m)
	{
		this.runtime = runtime;
		this.event_sheet = null;
		this.scrollX = (this.runtime.original_width / 2);
		this.scrollY = (this.runtime.original_height / 2);
		this.scale = 1.0;
		this.angle = 0;
		this.first_visit = true;
		this.name = m[0];
		this.originalWidth = m[1];
		this.originalHeight = m[2];
		this.width = m[1];
		this.height = m[2];
		this.unbounded_scrolling = m[3];
		this.sheetname = m[4];
		this.sid = m[5];
		var lm = m[6];
		var i, len;
		this.layers = [];
		this.initial_types = [];
		for (i = 0, len = lm.length; i < len; i++)
		{
			var layer = new cr.layer(this, lm[i]);
			layer.number = i;
			cr.seal(layer);
			this.layers.push(layer);
		}
		var im = m[7];
		this.initial_nonworld = [];
		for (i = 0, len = im.length; i < len; i++)
		{
			var inst = im[i];
			var type = this.runtime.types_by_index[inst[1]];
;
			if (!type.default_instance)
				type.default_instance = inst;
			this.initial_nonworld.push(inst);
			if (this.initial_types.indexOf(type) === -1)
				this.initial_types.push(type);
		}
		this.effect_types = [];
		this.active_effect_types = [];
		this.shaders_preserve_opaqueness = true;
		this.effect_params = [];
		for (i = 0, len = m[8].length; i < len; i++)
		{
			this.effect_types.push({
				id: m[8][i][0],
				name: m[8][i][1],
				shaderindex: -1,
				preservesOpaqueness: false,
				active: true,
				index: i
			});
			this.effect_params.push(m[8][i][2].slice(0));
		}
		this.updateActiveEffects();
		this.rcTex = new cr.rect(0, 0, 1, 1);
		this.rcTex2 = new cr.rect(0, 0, 1, 1);
		this.persist_data = {};
	};
	Layout.prototype.saveObjectToPersist = function (inst)
	{
		var sidStr = inst.type.sid.toString();
		if (!this.persist_data.hasOwnProperty(sidStr))
			this.persist_data[sidStr] = [];
		var type_persist = this.persist_data[sidStr];
		type_persist.push(this.runtime.saveInstanceToJSON(inst));
	};
	Layout.prototype.hasOpaqueBottomLayer = function ()
	{
		var layer = this.layers[0];
		return !layer.transparent && layer.opacity === 1.0 && !layer.forceOwnTexture && layer.visible;
	};
	Layout.prototype.updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		this.shaders_preserve_opaqueness = true;
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.active)
			{
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					this.shaders_preserve_opaqueness = false;
			}
		}
	};
	Layout.prototype.getEffectByName = function (name_)
	{
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.name === name_)
				return et;
		}
		return null;
	};
	var created_instances = [];
	function sort_by_zindex(a, b)
	{
		return a.zindex - b.zindex;
	};
	var first_layout = true;
	Layout.prototype.startRunning = function ()
	{
		if (this.sheetname)
		{
			this.event_sheet = this.runtime.eventsheets[this.sheetname];
;
			this.event_sheet.updateDeepIncludes();
		}
		this.runtime.running_layout = this;
		this.width = this.originalWidth;
		this.height = this.originalHeight;
		this.scrollX = (this.runtime.original_width / 2);
		this.scrollY = (this.runtime.original_height / 2);
		var i, k, len, lenk, type, type_instances, initial_inst, inst, iid, t, s, p, q, type_data, layer;
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			type = this.runtime.types_by_index[i];
			if (type.is_family)
				continue;		// instances are only transferred for their real type
			type_instances = type.instances;
			for (k = 0, lenk = type_instances.length; k < lenk; k++)
			{
				inst = type_instances[k];
				if (inst.layer)
				{
					var num = inst.layer.number;
					if (num >= this.layers.length)
						num = this.layers.length - 1;
					inst.layer = this.layers[num];
					if (inst.layer.instances.indexOf(inst) === -1)
						inst.layer.instances.push(inst);
					inst.layer.zindices_stale = true;
				}
			}
		}
		if (!first_layout)
		{
			for (i = 0, len = this.layers.length; i < len; ++i)
			{
				this.layers[i].instances.sort(sort_by_zindex);
			}
		}
		var layer;
		cr.clearArray(created_instances);
		this.boundScrolling();
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			layer = this.layers[i];
			layer.createInitialInstances();		// fills created_instances
			layer.updateViewport(null);
		}
		var uids_changed = false;
		if (!this.first_visit)
		{
			for (p in this.persist_data)
			{
				if (this.persist_data.hasOwnProperty(p))
				{
					type = this.runtime.getObjectTypeBySid(parseInt(p, 10));
					if (!type || type.is_family || !this.runtime.typeHasPersistBehavior(type))
						continue;
					type_data = this.persist_data[p];
					for (i = 0, len = type_data.length; i < len; i++)
					{
						layer = null;
						if (type.plugin.is_world)
						{
							layer = this.getLayerBySid(type_data[i]["w"]["l"]);
							if (!layer)
								continue;
						}
						inst = this.runtime.createInstanceFromInit(type.default_instance, layer, false, 0, 0, true);
						this.runtime.loadInstanceFromJSON(inst, type_data[i]);
						uids_changed = true;
						created_instances.push(inst);
					}
					cr.clearArray(type_data);
				}
			}
			for (i = 0, len = this.layers.length; i < len; i++)
			{
				this.layers[i].instances.sort(sort_by_zindex);
				this.layers[i].zindices_stale = true;		// in case of duplicates/holes
			}
		}
		if (uids_changed)
		{
			this.runtime.ClearDeathRow();
			this.runtime.refreshUidMap();
		}
		for (i = 0; i < created_instances.length; i++)
		{
			inst = created_instances[i];
			if (!inst.type.is_contained)
				continue;
			iid = inst.get_iid();
			for (k = 0, lenk = inst.type.container.length; k < lenk; k++)
			{
				t = inst.type.container[k];
				if (inst.type === t)
					continue;
				if (t.instances.length > iid)
					inst.siblings.push(t.instances[iid]);
				else
				{
					if (!t.default_instance)
					{
					}
					else
					{
						s = this.runtime.createInstanceFromInit(t.default_instance, inst.layer, true, inst.x, inst.y, true);
						this.runtime.ClearDeathRow();
						t.updateIIDs();
						inst.siblings.push(s);
						created_instances.push(s);		// come back around and link up its own instances too
					}
				}
			}
		}
		for (i = 0, len = this.initial_nonworld.length; i < len; i++)
		{
			initial_inst = this.initial_nonworld[i];
			type = this.runtime.types_by_index[initial_inst[1]];
			if (!type.is_contained)
			{
				inst = this.runtime.createInstanceFromInit(this.initial_nonworld[i], null, true);
			}
;
		}
		this.runtime.changelayout = null;
		this.runtime.ClearDeathRow();
		if (this.runtime.ctx && !this.runtime.isDomFree)
		{
			for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
			{
				t = this.runtime.types_by_index[i];
				if (t.is_family || !t.instances.length || !t.preloadCanvas2D)
					continue;
				t.preloadCanvas2D(this.runtime.ctx);
			}
		}
		/*
		if (this.runtime.glwrap)
		{
			console.log("Estimated VRAM at layout start: " + this.runtime.glwrap.textureCount() + " textures, approx. " + Math.round(this.runtime.glwrap.estimateVRAM() / 1024) + " kb");
		}
		*/
		if (this.runtime.isLoadingState)
		{
			cr.shallowAssignArray(this.runtime.fireOnCreateAfterLoad, created_instances);
		}
		else
		{
			for (i = 0, len = created_instances.length; i < len; i++)
			{
				inst = created_instances[i];
				this.runtime.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
			}
		}
		cr.clearArray(created_instances);
		if (!this.runtime.isLoadingState)
		{
			this.runtime.trigger(cr.system_object.prototype.cnds.OnLayoutStart, null);
		}
		this.first_visit = false;
	};
	Layout.prototype.createGlobalNonWorlds = function ()
	{
		var i, k, len, initial_inst, inst, type;
		for (i = 0, k = 0, len = this.initial_nonworld.length; i < len; i++)
		{
			initial_inst = this.initial_nonworld[i];
			type = this.runtime.types_by_index[initial_inst[1]];
			if (type.global)
			{
				if (!type.is_contained)
				{
					inst = this.runtime.createInstanceFromInit(initial_inst, null, true);
				}
			}
			else
			{
				this.initial_nonworld[k] = initial_inst;
				k++;
			}
		}
		cr.truncateArray(this.initial_nonworld, k);
	};
	Layout.prototype.stopRunning = function ()
	{
;
		/*
		if (this.runtime.glwrap)
		{
			console.log("Estimated VRAM at layout end: " + this.runtime.glwrap.textureCount() + " textures, approx. " + Math.round(this.runtime.glwrap.estimateVRAM() / 1024) + " kb");
		}
		*/
		if (!this.runtime.isLoadingState)
		{
			this.runtime.trigger(cr.system_object.prototype.cnds.OnLayoutEnd, null);
		}
		this.runtime.isEndingLayout = true;
		cr.clearArray(this.runtime.system.waits);
		var i, leni, j, lenj;
		var layer_instances, inst, type;
		if (!this.first_visit)
		{
			for (i = 0, leni = this.layers.length; i < leni; i++)
			{
				this.layers[i].updateZIndices();
				layer_instances = this.layers[i].instances;
				for (j = 0, lenj = layer_instances.length; j < lenj; j++)
				{
					inst = layer_instances[j];
					if (!inst.type.global)
					{
						if (this.runtime.typeHasPersistBehavior(inst.type))
							this.saveObjectToPersist(inst);
					}
				}
			}
		}
		for (i = 0, leni = this.layers.length; i < leni; i++)
		{
			layer_instances = this.layers[i].instances;
			for (j = 0, lenj = layer_instances.length; j < lenj; j++)
			{
				inst = layer_instances[j];
				if (!inst.type.global)
				{
					this.runtime.DestroyInstance(inst);
				}
			}
			this.runtime.ClearDeathRow();
			cr.clearArray(layer_instances);
			this.layers[i].zindices_stale = true;
		}
		for (i = 0, leni = this.runtime.types_by_index.length; i < leni; i++)
		{
			type = this.runtime.types_by_index[i];
			if (type.global || type.plugin.is_world || type.plugin.singleglobal || type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
				this.runtime.DestroyInstance(type.instances[j]);
			this.runtime.ClearDeathRow();
		}
		first_layout = false;
		this.runtime.isEndingLayout = false;
	};
	var temp_rect = new cr.rect(0, 0, 0, 0);
	Layout.prototype.recreateInitialObjects = function (type, x1, y1, x2, y2)
	{
		temp_rect.set(x1, y1, x2, y2);
		var i, len;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			this.layers[i].recreateInitialObjects(type, temp_rect);
		}
	};
	Layout.prototype.draw = function (ctx)
	{
		var layout_canvas;
		var layout_ctx = ctx;
		var ctx_changed = false;
		var render_offscreen = !this.runtime.fullscreenScalingQuality;
		if (render_offscreen)
		{
			if (!this.runtime.layout_canvas)
			{
				this.runtime.layout_canvas = document.createElement("canvas");
				layout_canvas = this.runtime.layout_canvas;
				layout_canvas.width = this.runtime.draw_width;
				layout_canvas.height = this.runtime.draw_height;
				this.runtime.layout_ctx = layout_canvas.getContext("2d");
				ctx_changed = true;
			}
			layout_canvas = this.runtime.layout_canvas;
			layout_ctx = this.runtime.layout_ctx;
			if (layout_canvas.width !== this.runtime.draw_width)
			{
				layout_canvas.width = this.runtime.draw_width;
				ctx_changed = true;
			}
			if (layout_canvas.height !== this.runtime.draw_height)
			{
				layout_canvas.height = this.runtime.draw_height;
				ctx_changed = true;
			}
			if (ctx_changed)
			{
				this.runtime.setCtxImageSmoothingEnabled(layout_ctx, this.runtime.linearSampling);
			}
		}
		layout_ctx.globalAlpha = 1;
		layout_ctx.globalCompositeOperation = "source-over";
		if (this.runtime.clearBackground && !this.hasOpaqueBottomLayer())
			layout_ctx.clearRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		var i, len, l;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.visible && l.opacity > 0 && l.blend_mode !== 11 && (l.instances.length || !l.transparent))
				l.draw(layout_ctx);
			else
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
		}
		if (render_offscreen)
		{
			ctx.drawImage(layout_canvas, 0, 0, this.runtime.width, this.runtime.height);
		}
	};
	Layout.prototype.drawGL_earlyZPass = function (glw)
	{
		glw.setEarlyZPass(true);
		if (!this.runtime.layout_tex)
		{
			this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
		}
		if (this.runtime.layout_tex.c2width !== this.runtime.draw_width || this.runtime.layout_tex.c2height !== this.runtime.draw_height)
		{
			glw.deleteTexture(this.runtime.layout_tex);
			this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
		}
		glw.setRenderingToTexture(this.runtime.layout_tex);
		if (!this.runtime.fullscreenScalingQuality)
		{
			glw.setSize(this.runtime.draw_width, this.runtime.draw_height);
		}
		var i, l;
		for (i = this.layers.length - 1; i >= 0; --i)
		{
			l = this.layers[i];
			if (l.visible && l.opacity === 1 && l.shaders_preserve_opaqueness &&
				l.blend_mode === 0 && (l.instances.length || !l.transparent))
			{
				l.drawGL_earlyZPass(glw);
			}
			else
			{
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
			}
		}
		glw.setEarlyZPass(false);
	};
	Layout.prototype.drawGL = function (glw)
	{
		var render_to_texture = (this.active_effect_types.length > 0 ||
								 this.runtime.uses_background_blending ||
								 !this.runtime.fullscreenScalingQuality ||
								 this.runtime.enableFrontToBack);
		if (render_to_texture)
		{
			if (!this.runtime.layout_tex)
			{
				this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layout_tex.c2width !== this.runtime.draw_width || this.runtime.layout_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layout_tex);
				this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layout_tex);
			if (!this.runtime.fullscreenScalingQuality)
			{
				glw.setSize(this.runtime.draw_width, this.runtime.draw_height);
			}
		}
		else
		{
			if (this.runtime.layout_tex)
			{
				glw.setRenderingToTexture(null);
				glw.deleteTexture(this.runtime.layout_tex);
				this.runtime.layout_tex = null;
			}
		}
		if (this.runtime.clearBackground && !this.hasOpaqueBottomLayer())
			glw.clear(0, 0, 0, 0);
		var i, len, l;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.visible && l.opacity > 0 && (l.instances.length || !l.transparent))
				l.drawGL(glw);
			else
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
		}
		if (render_to_texture)
		{
			if (this.active_effect_types.length === 0 ||
				(this.active_effect_types.length === 1 && this.runtime.fullscreenScalingQuality))
			{
				if (this.active_effect_types.length === 1)
				{
					var etindex = this.active_effect_types[0].index;
					glw.switchProgram(this.active_effect_types[0].shaderindex);
					glw.setProgramParameters(null,								// backTex
											 1.0 / this.runtime.draw_width,		// pixelWidth
											 1.0 / this.runtime.draw_height,	// pixelHeight
											 0.0, 0.0,							// destStart
											 1.0, 1.0,							// destEnd
											 this.scale,						// layerScale
											 this.angle,						// layerAngle
											 0.0, 0.0,							// viewOrigin
											 this.runtime.draw_width / 2, this.runtime.draw_height / 2,	// scrollPos
											 this.runtime.kahanTime.sum,		// seconds
											 this.effect_params[etindex]);		// fx parameters
					if (glw.programIsAnimated(this.active_effect_types[0].shaderindex))
						this.runtime.redraw = true;
				}
				else
					glw.switchProgram(0);
				if (!this.runtime.fullscreenScalingQuality)
				{
					glw.setSize(this.runtime.width, this.runtime.height);
				}
				glw.setRenderingToTexture(null);				// to backbuffer
				glw.setDepthTestEnabled(false);					// ignore depth buffer, copy full texture
				glw.setOpacity(1);
				glw.setTexture(this.runtime.layout_tex);
				glw.setAlphaBlend();
				glw.resetModelView();
				glw.updateModelView();
				var halfw = this.runtime.width / 2;
				var halfh = this.runtime.height / 2;
				glw.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
				glw.setTexture(null);
				glw.setDepthTestEnabled(true);					// turn depth test back on
			}
			else
			{
				this.renderEffectChain(glw, null, null, null);
			}
		}
	};
	Layout.prototype.getRenderTarget = function()
	{
		if (this.active_effect_types.length > 0 ||
				this.runtime.uses_background_blending ||
				!this.runtime.fullscreenScalingQuality ||
				this.runtime.enableFrontToBack)
		{
			return this.runtime.layout_tex;
		}
		else
		{
			return null;
		}
	};
	Layout.prototype.getMinLayerScale = function ()
	{
		var m = this.layers[0].getScale();
		var i, len, l;
		for (i = 1, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.parallaxX === 0 && l.parallaxY === 0)
				continue;
			if (l.getScale() < m)
				m = l.getScale();
		}
		return m;
	};
	Layout.prototype.scrollToX = function (x)
	{
		if (!this.unbounded_scrolling)
		{
			var widthBoundary = (this.runtime.draw_width * (1 / this.getMinLayerScale()) / 2);
			if (x > this.width - widthBoundary)
				x = this.width - widthBoundary;
			if (x < widthBoundary)
				x = widthBoundary;
		}
		if (this.scrollX !== x)
		{
			this.scrollX = x;
			this.runtime.redraw = true;
		}
	};
	Layout.prototype.scrollToY = function (y)
	{
		if (!this.unbounded_scrolling)
		{
			var heightBoundary = (this.runtime.draw_height * (1 / this.getMinLayerScale()) / 2);
			if (y > this.height - heightBoundary)
				y = this.height - heightBoundary;
			if (y < heightBoundary)
				y = heightBoundary;
		}
		if (this.scrollY !== y)
		{
			this.scrollY = y;
			this.runtime.redraw = true;
		}
	};
	Layout.prototype.boundScrolling = function ()
	{
		this.scrollToX(this.scrollX);
		this.scrollToY(this.scrollY);
	};
	Layout.prototype.renderEffectChain = function (glw, layer, inst, rendertarget)
	{
		var active_effect_types = inst ?
							inst.active_effect_types :
							layer ?
								layer.active_effect_types :
								this.active_effect_types;
		var layerScale = 1, layerAngle = 0, viewOriginLeft = 0, viewOriginTop = 0, viewOriginRight = this.runtime.draw_width, viewOriginBottom = this.runtime.draw_height;
		if (inst)
		{
			layerScale = inst.layer.getScale();
			layerAngle = inst.layer.getAngle();
			viewOriginLeft = inst.layer.viewLeft;
			viewOriginTop = inst.layer.viewTop;
			viewOriginRight = inst.layer.viewRight;
			viewOriginBottom = inst.layer.viewBottom;
		}
		else if (layer)
		{
			layerScale = layer.getScale();
			layerAngle = layer.getAngle();
			viewOriginLeft = layer.viewLeft;
			viewOriginTop = layer.viewTop;
			viewOriginRight = layer.viewRight;
			viewOriginBottom = layer.viewBottom;
		}
		var fx_tex = this.runtime.fx_tex;
		var i, len, last, temp, fx_index = 0, other_fx_index = 1;
		var y, h;
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var halfw = windowWidth / 2;
		var halfh = windowHeight / 2;
		var rcTex = layer ? layer.rcTex : this.rcTex;
		var rcTex2 = layer ? layer.rcTex2 : this.rcTex2;
		var screenleft = 0, clearleft = 0;
		var screentop = 0, cleartop = 0;
		var screenright = windowWidth, clearright = windowWidth;
		var screenbottom = windowHeight, clearbottom = windowHeight;
		var boxExtendHorizontal = 0;
		var boxExtendVertical = 0;
		var inst_layer_angle = inst ? inst.layer.getAngle() : 0;
		if (inst)
		{
			for (i = 0, len = active_effect_types.length; i < len; i++)
			{
				boxExtendHorizontal += glw.getProgramBoxExtendHorizontal(active_effect_types[i].shaderindex);
				boxExtendVertical += glw.getProgramBoxExtendVertical(active_effect_types[i].shaderindex);
			}
			var bbox = inst.bbox;
			screenleft = layer.layerToCanvas(bbox.left, bbox.top, true, true);
			screentop = layer.layerToCanvas(bbox.left, bbox.top, false, true);
			screenright = layer.layerToCanvas(bbox.right, bbox.bottom, true, true);
			screenbottom = layer.layerToCanvas(bbox.right, bbox.bottom, false, true);
			if (inst_layer_angle !== 0)
			{
				var screentrx = layer.layerToCanvas(bbox.right, bbox.top, true, true);
				var screentry = layer.layerToCanvas(bbox.right, bbox.top, false, true);
				var screenblx = layer.layerToCanvas(bbox.left, bbox.bottom, true, true);
				var screenbly = layer.layerToCanvas(bbox.left, bbox.bottom, false, true);
				temp = Math.min(screenleft, screenright, screentrx, screenblx);
				screenright = Math.max(screenleft, screenright, screentrx, screenblx);
				screenleft = temp;
				temp = Math.min(screentop, screenbottom, screentry, screenbly);
				screenbottom = Math.max(screentop, screenbottom, screentry, screenbly);
				screentop = temp;
			}
			screenleft -= boxExtendHorizontal;
			screentop -= boxExtendVertical;
			screenright += boxExtendHorizontal;
			screenbottom += boxExtendVertical;
			rcTex2.left = screenleft / windowWidth;
			rcTex2.top = 1 - screentop / windowHeight;
			rcTex2.right = screenright / windowWidth;
			rcTex2.bottom = 1 - screenbottom / windowHeight;
			clearleft = screenleft = cr.floor(screenleft);
			cleartop = screentop = cr.floor(screentop);
			clearright = screenright = cr.ceil(screenright);
			clearbottom = screenbottom = cr.ceil(screenbottom);
			clearleft -= boxExtendHorizontal;
			cleartop -= boxExtendVertical;
			clearright += boxExtendHorizontal;
			clearbottom += boxExtendVertical;
			if (screenleft < 0)					screenleft = 0;
			if (screentop < 0)					screentop = 0;
			if (screenright > windowWidth)		screenright = windowWidth;
			if (screenbottom > windowHeight)	screenbottom = windowHeight;
			if (clearleft < 0)					clearleft = 0;
			if (cleartop < 0)					cleartop = 0;
			if (clearright > windowWidth)		clearright = windowWidth;
			if (clearbottom > windowHeight)		clearbottom = windowHeight;
			rcTex.left = screenleft / windowWidth;
			rcTex.top = 1 - screentop / windowHeight;
			rcTex.right = screenright / windowWidth;
			rcTex.bottom = 1 - screenbottom / windowHeight;
		}
		else
		{
			rcTex.left = rcTex2.left = 0;
			rcTex.top = rcTex2.top = 0;
			rcTex.right = rcTex2.right = 1;
			rcTex.bottom = rcTex2.bottom = 1;
		}
		var pre_draw = (inst && (glw.programUsesDest(active_effect_types[0].shaderindex) || boxExtendHorizontal !== 0 || boxExtendVertical !== 0 || inst.opacity !== 1 || inst.type.plugin.must_predraw)) || (layer && !inst && layer.opacity !== 1);
		glw.setAlphaBlend();
		if (pre_draw)
		{
			if (!fx_tex[fx_index])
			{
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			if (fx_tex[fx_index].c2width !== windowWidth || fx_tex[fx_index].c2height !== windowHeight)
			{
				glw.deleteTexture(fx_tex[fx_index]);
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			glw.switchProgram(0);
			glw.setRenderingToTexture(fx_tex[fx_index]);
			h = clearbottom - cleartop;
			y = (windowHeight - cleartop) - h;
			glw.clearRect(clearleft, y, clearright - clearleft, h);
			if (inst)
			{
				inst.drawGL(glw);
			}
			else
			{
				glw.setTexture(this.runtime.layer_tex);
				glw.setOpacity(layer.opacity);
				glw.resetModelView();
				glw.translate(-halfw, -halfh);
				glw.updateModelView();
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
			}
			rcTex2.left = rcTex2.top = 0;
			rcTex2.right = rcTex2.bottom = 1;
			if (inst)
			{
				temp = rcTex.top;
				rcTex.top = rcTex.bottom;
				rcTex.bottom = temp;
			}
			fx_index = 1;
			other_fx_index = 0;
		}
		glw.setOpacity(1);
		var last = active_effect_types.length - 1;
		var post_draw = glw.programUsesCrossSampling(active_effect_types[last].shaderindex) ||
						(!layer && !inst && !this.runtime.fullscreenScalingQuality);
		var etindex = 0;
		for (i = 0, len = active_effect_types.length; i < len; i++)
		{
			if (!fx_tex[fx_index])
			{
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			if (fx_tex[fx_index].c2width !== windowWidth || fx_tex[fx_index].c2height !== windowHeight)
			{
				glw.deleteTexture(fx_tex[fx_index]);
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			glw.switchProgram(active_effect_types[i].shaderindex);
			etindex = active_effect_types[i].index;
			if (glw.programIsAnimated(active_effect_types[i].shaderindex))
				this.runtime.redraw = true;
			if (i == 0 && !pre_draw)
			{
				glw.setRenderingToTexture(fx_tex[fx_index]);
				h = clearbottom - cleartop;
				y = (windowHeight - cleartop) - h;
				glw.clearRect(clearleft, y, clearright - clearleft, h);
				if (inst)
				{
					var pixelWidth;
					var pixelHeight;
					if (inst.curFrame && inst.curFrame.texture_img)
					{
						var img = inst.curFrame.texture_img;
						pixelWidth = 1.0 / img.width;
						pixelHeight = 1.0 / img.height;
					}
					else
					{
						pixelWidth = 1.0 / inst.width;
						pixelHeight = 1.0 / inst.height;
					}
					glw.setProgramParameters(rendertarget,					// backTex
											 pixelWidth,
											 pixelHeight,
											 rcTex2.left, rcTex2.top,		// destStart
											 rcTex2.right, rcTex2.bottom,	// destEnd
											 layerScale,
											 layerAngle,
											 viewOriginLeft, viewOriginTop,
											 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
											 this.runtime.kahanTime.sum,
											 inst.effect_params[etindex]);	// fx params
					inst.drawGL(glw);
				}
				else
				{
					glw.setProgramParameters(rendertarget,					// backTex
											 1.0 / windowWidth,				// pixelWidth
											 1.0 / windowHeight,			// pixelHeight
											 0.0, 0.0,						// destStart
											 1.0, 1.0,						// destEnd
											 layerScale,
											 layerAngle,
											 viewOriginLeft, viewOriginTop,
											 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
											 this.runtime.kahanTime.sum,
											 layer ?						// fx params
												layer.effect_params[etindex] :
												this.effect_params[etindex]);
					glw.setTexture(layer ? this.runtime.layer_tex : this.runtime.layout_tex);
					glw.resetModelView();
					glw.translate(-halfw, -halfh);
					glw.updateModelView();
					glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
				}
				rcTex2.left = rcTex2.top = 0;
				rcTex2.right = rcTex2.bottom = 1;
				if (inst && !post_draw)
				{
					temp = screenbottom;
					screenbottom = screentop;
					screentop = temp;
				}
			}
			else
			{
				glw.setProgramParameters(rendertarget,						// backTex
										 1.0 / windowWidth,					// pixelWidth
										 1.0 / windowHeight,				// pixelHeight
										 rcTex2.left, rcTex2.top,			// destStart
										 rcTex2.right, rcTex2.bottom,		// destEnd
										 layerScale,
										 layerAngle,
										 viewOriginLeft, viewOriginTop,
										 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
										 this.runtime.kahanTime.sum,
										 inst ?								// fx params
											inst.effect_params[etindex] :
											layer ?
												layer.effect_params[etindex] :
												this.effect_params[etindex]);
				glw.setTexture(null);
				if (i === last && !post_draw)
				{
					if (inst)
						glw.setBlend(inst.srcBlend, inst.destBlend);
					else if (layer)
						glw.setBlend(layer.srcBlend, layer.destBlend);
					glw.setRenderingToTexture(rendertarget);
				}
				else
				{
					glw.setRenderingToTexture(fx_tex[fx_index]);
					h = clearbottom - cleartop;
					y = (windowHeight - cleartop) - h;
					glw.clearRect(clearleft, y, clearright - clearleft, h);
				}
				glw.setTexture(fx_tex[other_fx_index]);
				glw.resetModelView();
				glw.translate(-halfw, -halfh);
				glw.updateModelView();
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
				if (i === last && !post_draw)
					glw.setTexture(null);
			}
			fx_index = (fx_index === 0 ? 1 : 0);
			other_fx_index = (fx_index === 0 ? 1 : 0);		// will be opposite to fx_index since it was just assigned
		}
		if (post_draw)
		{
			glw.switchProgram(0);
			if (inst)
				glw.setBlend(inst.srcBlend, inst.destBlend);
			else if (layer)
				glw.setBlend(layer.srcBlend, layer.destBlend);
			else
			{
				if (!this.runtime.fullscreenScalingQuality)
				{
					glw.setSize(this.runtime.width, this.runtime.height);
					halfw = this.runtime.width / 2;
					halfh = this.runtime.height / 2;
					screenleft = 0;
					screentop = 0;
					screenright = this.runtime.width;
					screenbottom = this.runtime.height;
				}
			}
			glw.setRenderingToTexture(rendertarget);
			glw.setTexture(fx_tex[other_fx_index]);
			glw.resetModelView();
			glw.translate(-halfw, -halfh);
			glw.updateModelView();
			if (inst && active_effect_types.length === 1 && !pre_draw)
				glw.quadTex(screenleft, screentop, screenright, screentop, screenright, screenbottom, screenleft, screenbottom, rcTex);
			else
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
			glw.setTexture(null);
		}
	};
	Layout.prototype.getLayerBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			if (this.layers[i].sid === sid_)
				return this.layers[i];
		}
		return null;
	};
	Layout.prototype.saveToJSON = function ()
	{
		var i, len, layer, et;
		var o = {
			"sx": this.scrollX,
			"sy": this.scrollY,
			"s": this.scale,
			"a": this.angle,
			"w": this.width,
			"h": this.height,
			"fv": this.first_visit,			// added r127
			"persist": this.persist_data,
			"fx": [],
			"layers": {}
		};
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			o["fx"].push({"name": et.name, "active": et.active, "params": this.effect_params[et.index] });
		}
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			layer = this.layers[i];
			o["layers"][layer.sid.toString()] = layer.saveToJSON();
		}
		return o;
	};
	Layout.prototype.loadFromJSON = function (o)
	{
		var i, j, len, fx, p, layer;
		this.scrollX = o["sx"];
		this.scrollY = o["sy"];
		this.scale = o["s"];
		this.angle = o["a"];
		this.width = o["w"];
		this.height = o["h"];
		this.persist_data = o["persist"];
		if (typeof o["fv"] !== "undefined")
			this.first_visit = o["fv"];
		var ofx = o["fx"];
		for (i = 0, len = ofx.length; i < len; i++)
		{
			fx = this.getEffectByName(ofx[i]["name"]);
			if (!fx)
				continue;		// must've gone missing
			fx.active = ofx[i]["active"];
			this.effect_params[fx.index] = ofx[i]["params"];
		}
		this.updateActiveEffects();
		var olayers = o["layers"];
		for (p in olayers)
		{
			if (olayers.hasOwnProperty(p))
			{
				layer = this.getLayerBySid(parseInt(p, 10));
				if (!layer)
					continue;		// must've gone missing
				layer.loadFromJSON(olayers[p]);
			}
		}
	};
	cr.layout = Layout;
	function Layer(layout, m)
	{
		this.layout = layout;
		this.runtime = layout.runtime;
		this.instances = [];        // running instances
		this.scale = 1.0;
		this.angle = 0;
		this.disableAngle = false;
		this.tmprect = new cr.rect(0, 0, 0, 0);
		this.tmpquad = new cr.quad();
		this.viewLeft = 0;
		this.viewRight = 0;
		this.viewTop = 0;
		this.viewBottom = 0;
		this.zindices_stale = false;
		this.zindices_stale_from = -1;		// first index that has changed, or -1 if no bound
		this.clear_earlyz_index = 0;
		this.name = m[0];
		this.index = m[1];
		this.sid = m[2];
		this.visible = m[3];		// initially visible
		this.background_color = m[4];
		this.transparent = m[5];
		this.parallaxX = m[6];
		this.parallaxY = m[7];
		this.opacity = m[8];
		this.forceOwnTexture = m[9];
		this.useRenderCells = m[10];
		this.zoomRate = m[11];
		this.blend_mode = m[12];
		this.effect_fallback = m[13];
		this.compositeOp = "source-over";
		this.srcBlend = 0;
		this.destBlend = 0;
		this.render_grid = null;
		this.last_render_list = alloc_arr();
		this.render_list_stale = true;
		this.last_render_cells = new cr.rect(0, 0, -1, -1);
		this.cur_render_cells = new cr.rect(0, 0, -1, -1);
		if (this.useRenderCells)
		{
			this.render_grid = new cr.RenderGrid(this.runtime.original_width, this.runtime.original_height);
		}
		this.render_offscreen = false;
		var im = m[14];
		var i, len;
		this.startup_initial_instances = [];		// for restoring initial_instances after load
		this.initial_instances = [];
		this.created_globals = [];		// global object UIDs already created - for save/load to avoid recreating
		for (i = 0, len = im.length; i < len; i++)
		{
			var inst = im[i];
			var type = this.runtime.types_by_index[inst[1]];
;
			if (!type.default_instance)
			{
				type.default_instance = inst;
				type.default_layerindex = this.index;
			}
			this.initial_instances.push(inst);
			if (this.layout.initial_types.indexOf(type) === -1)
				this.layout.initial_types.push(type);
		}
		cr.shallowAssignArray(this.startup_initial_instances, this.initial_instances);
		this.effect_types = [];
		this.active_effect_types = [];
		this.shaders_preserve_opaqueness = true;
		this.effect_params = [];
		for (i = 0, len = m[15].length; i < len; i++)
		{
			this.effect_types.push({
				id: m[15][i][0],
				name: m[15][i][1],
				shaderindex: -1,
				preservesOpaqueness: false,
				active: true,
				index: i
			});
			this.effect_params.push(m[15][i][2].slice(0));
		}
		this.updateActiveEffects();
		this.rcTex = new cr.rect(0, 0, 1, 1);
		this.rcTex2 = new cr.rect(0, 0, 1, 1);
	};
	Layer.prototype.updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		this.shaders_preserve_opaqueness = true;
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.active)
			{
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					this.shaders_preserve_opaqueness = false;
			}
		}
	};
	Layer.prototype.getEffectByName = function (name_)
	{
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.name === name_)
				return et;
		}
		return null;
	};
	Layer.prototype.createInitialInstances = function ()
	{
		var i, k, len, inst, initial_inst, type, keep, hasPersistBehavior;
		for (i = 0, k = 0, len = this.initial_instances.length; i < len; i++)
		{
			initial_inst = this.initial_instances[i];
			type = this.runtime.types_by_index[initial_inst[1]];
;
			hasPersistBehavior = this.runtime.typeHasPersistBehavior(type);
			keep = true;
			if (!hasPersistBehavior || this.layout.first_visit)
			{
				inst = this.runtime.createInstanceFromInit(initial_inst, this, true);
				if (!inst)
					continue;		// may have skipped creation due to fallback effect "destroy"
				created_instances.push(inst);
				if (inst.type.global)
				{
					keep = false;
					this.created_globals.push(inst.uid);
				}
			}
			if (keep)
			{
				this.initial_instances[k] = this.initial_instances[i];
				k++;
			}
		}
		this.initial_instances.length = k;
		this.runtime.ClearDeathRow();		// flushes creation row so IIDs will be correct
		if (!this.runtime.glwrap && this.effect_types.length)	// no WebGL renderer and shaders used
			this.blend_mode = this.effect_fallback;				// use fallback blend mode
		this.compositeOp = cr.effectToCompositeOp(this.blend_mode);
		if (this.runtime.gl)
			cr.setGLBlend(this, this.blend_mode, this.runtime.gl);
		this.render_list_stale = true;
	};
	Layer.prototype.recreateInitialObjects = function (only_type, rc)
	{
		var i, len, initial_inst, type, wm, x, y, inst, j, lenj, s;
		var types_by_index = this.runtime.types_by_index;
		var only_type_is_family = only_type.is_family;
		var only_type_members = only_type.members;
		for (i = 0, len = this.initial_instances.length; i < len; ++i)
		{
			initial_inst = this.initial_instances[i];
			wm = initial_inst[0];
			x = wm[0];
			y = wm[1];
			if (!rc.contains_pt(x, y))
				continue;		// not in the given area
			type = types_by_index[initial_inst[1]];
			if (type !== only_type)
			{
				if (only_type_is_family)
				{
					if (only_type_members.indexOf(type) < 0)
						continue;
				}
				else
					continue;		// only_type is not a family, and the initial inst type does not match
			}
			inst = this.runtime.createInstanceFromInit(initial_inst, this, false);
			this.runtime.isInOnDestroy++;
			this.runtime.trigger(Object.getPrototypeOf(type.plugin).cnds.OnCreated, inst);
			if (inst.is_contained)
			{
				for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
				{
					s = inst.siblings[i];
					this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
				}
			}
			this.runtime.isInOnDestroy--;
		}
	};
	Layer.prototype.removeFromInstanceList = function (inst, remove_from_grid)
	{
		var index = cr.fastIndexOf(this.instances, inst);
		if (index < 0)
			return;		// not found
		if (remove_from_grid && this.useRenderCells && inst.rendercells && inst.rendercells.right >= inst.rendercells.left)
		{
			inst.update_bbox();											// make sure actually in its current rendercells
			this.render_grid.update(inst, inst.rendercells, null);		// no new range provided - remove only
			inst.rendercells.set(0, 0, -1, -1);							// set to invalid state to indicate not inserted
		}
		if (index === this.instances.length - 1)
			this.instances.pop();
		else
		{
			cr.arrayRemove(this.instances, index);
			this.setZIndicesStaleFrom(index);
		}
		this.render_list_stale = true;
	};
	Layer.prototype.appendToInstanceList = function (inst, add_to_grid)
	{
;
		inst.zindex = this.instances.length;
		this.instances.push(inst);
		if (add_to_grid && this.useRenderCells && inst.rendercells)
		{
			inst.set_bbox_changed();		// will cause immediate update and new insertion to grid
		}
		this.render_list_stale = true;
	};
	Layer.prototype.prependToInstanceList = function (inst, add_to_grid)
	{
;
		this.instances.unshift(inst);
		this.setZIndicesStaleFrom(0);
		if (add_to_grid && this.useRenderCells && inst.rendercells)
		{
			inst.set_bbox_changed();		// will cause immediate update and new insertion to grid
		}
	};
	Layer.prototype.moveInstanceAdjacent = function (inst, other, isafter)
	{
;
		var myZ = inst.get_zindex();
		var insertZ = other.get_zindex();
		cr.arrayRemove(this.instances, myZ);
		if (myZ < insertZ)
			insertZ--;
		if (isafter)
			insertZ++;
		if (insertZ === this.instances.length)
			this.instances.push(inst);
		else
			this.instances.splice(insertZ, 0, inst);
		this.setZIndicesStaleFrom(myZ < insertZ ? myZ : insertZ);
	};
	Layer.prototype.setZIndicesStaleFrom = function (index)
	{
		if (this.zindices_stale_from === -1)			// not yet set
			this.zindices_stale_from = index;
		else if (index < this.zindices_stale_from)		// determine minimum z index affected
			this.zindices_stale_from = index;
		this.zindices_stale = true;
		this.render_list_stale = true;
	};
	Layer.prototype.updateZIndices = function ()
	{
		if (!this.zindices_stale)
			return;
		if (this.zindices_stale_from === -1)
			this.zindices_stale_from = 0;
		var i, len, inst;
		if (this.useRenderCells)
		{
			for (i = this.zindices_stale_from, len = this.instances.length; i < len; ++i)
			{
				inst = this.instances[i];
				inst.zindex = i;
				this.render_grid.markRangeChanged(inst.rendercells);
			}
		}
		else
		{
			for (i = this.zindices_stale_from, len = this.instances.length; i < len; ++i)
			{
				this.instances[i].zindex = i;
			}
		}
		this.zindices_stale = false;
		this.zindices_stale_from = -1;
	};
	Layer.prototype.getScale = function (include_aspect)
	{
		return this.getNormalScale() * (this.runtime.fullscreenScalingQuality || include_aspect ? this.runtime.aspect_scale : 1);
	};
	Layer.prototype.getNormalScale = function ()
	{
		return ((this.scale * this.layout.scale) - 1) * this.zoomRate + 1;
	};
	Layer.prototype.getAngle = function ()
	{
		if (this.disableAngle)
			return 0;
		return cr.clamp_angle(this.layout.angle + this.angle);
	};
	var arr_cache = [];
	function alloc_arr()
	{
		if (arr_cache.length)
			return arr_cache.pop();
		else
			return [];
	}
	function free_arr(a)
	{
		cr.clearArray(a);
		arr_cache.push(a);
	};
	function mergeSortedZArrays(a, b, out)
	{
		var i = 0, j = 0, k = 0, lena = a.length, lenb = b.length, ai, bj;
		out.length = lena + lenb;
		for ( ; i < lena && j < lenb; ++k)
		{
			ai = a[i];
			bj = b[j];
			if (ai.zindex < bj.zindex)
			{
				out[k] = ai;
				++i;
			}
			else
			{
				out[k] = bj;
				++j;
			}
		}
		for ( ; i < lena; ++i, ++k)
			out[k] = a[i];
		for ( ; j < lenb; ++j, ++k)
			out[k] = b[j];
	};
	var next_arr = [];
	function mergeAllSortedZArrays_pass(arr, first_pass)
	{
		var i, len, arr1, arr2, out;
		for (i = 0, len = arr.length; i < len - 1; i += 2)
		{
			arr1 = arr[i];
			arr2 = arr[i+1];
			out = alloc_arr();
			mergeSortedZArrays(arr1, arr2, out);
			if (!first_pass)
			{
				free_arr(arr1);
				free_arr(arr2);
			}
			next_arr.push(out);
		}
		if (len % 2 === 1)
		{
			if (first_pass)
			{
				arr1 = alloc_arr();
				cr.shallowAssignArray(arr1, arr[len - 1]);
				next_arr.push(arr1);
			}
			else
			{
				next_arr.push(arr[len - 1]);
			}
		}
		cr.shallowAssignArray(arr, next_arr);
		cr.clearArray(next_arr);
	};
	function mergeAllSortedZArrays(arr)
	{
		var first_pass = true;
		while (arr.length > 1)
		{
			mergeAllSortedZArrays_pass(arr, first_pass);
			first_pass = false;
		}
		return arr[0];
	};
	var render_arr = [];
	Layer.prototype.getRenderCellInstancesToDraw = function ()
	{
;
		this.updateZIndices();
		this.render_grid.queryRange(this.viewLeft, this.viewTop, this.viewRight, this.viewBottom, render_arr);
		if (!render_arr.length)
			return alloc_arr();
		if (render_arr.length === 1)
		{
			var a = alloc_arr();
			cr.shallowAssignArray(a, render_arr[0]);
			cr.clearArray(render_arr);
			return a;
		}
		var draw_list = mergeAllSortedZArrays(render_arr);
		cr.clearArray(render_arr);
		return draw_list;
	};
	Layer.prototype.draw = function (ctx)
	{
		this.render_offscreen = (this.forceOwnTexture || this.opacity !== 1.0 || this.blend_mode !== 0);
		var layer_canvas = this.runtime.canvas;
		var layer_ctx = ctx;
		var ctx_changed = false;
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_canvas)
			{
				this.runtime.layer_canvas = document.createElement("canvas");
;
				layer_canvas = this.runtime.layer_canvas;
				layer_canvas.width = this.runtime.draw_width;
				layer_canvas.height = this.runtime.draw_height;
				this.runtime.layer_ctx = layer_canvas.getContext("2d");
;
				ctx_changed = true;
			}
			layer_canvas = this.runtime.layer_canvas;
			layer_ctx = this.runtime.layer_ctx;
			if (layer_canvas.width !== this.runtime.draw_width)
			{
				layer_canvas.width = this.runtime.draw_width;
				ctx_changed = true;
			}
			if (layer_canvas.height !== this.runtime.draw_height)
			{
				layer_canvas.height = this.runtime.draw_height;
				ctx_changed = true;
			}
			if (ctx_changed)
			{
				this.runtime.setCtxImageSmoothingEnabled(layer_ctx, this.runtime.linearSampling);
			}
			if (this.transparent)
				layer_ctx.clearRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		}
		layer_ctx.globalAlpha = 1;
		layer_ctx.globalCompositeOperation = "source-over";
		if (!this.transparent)
		{
			layer_ctx.fillStyle = "rgb(" + this.background_color[0] + "," + this.background_color[1] + "," + this.background_color[2] + ")";
			layer_ctx.fillRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		}
		layer_ctx.save();
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, layer_ctx);
		var myscale = this.getScale();
		layer_ctx.scale(myscale, myscale);
		layer_ctx.translate(-px, -py);
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, len, inst, last_inst = null;
		for (i = 0, len = instances_to_draw.length; i < len; ++i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstance(inst, layer_ctx);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		layer_ctx.restore();
		if (this.render_offscreen)
		{
			ctx.globalCompositeOperation = this.compositeOp;
			ctx.globalAlpha = this.opacity;
			ctx.drawImage(layer_canvas, 0, 0);
		}
	};
	Layer.prototype.drawInstance = function(inst, layer_ctx)
	{
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		layer_ctx.globalCompositeOperation = inst.compositeOp;
		inst.draw(layer_ctx);
	};
	Layer.prototype.updateViewport = function (ctx)
	{
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, ctx);
	};
	Layer.prototype.rotateViewport = function (px, py, ctx)
	{
		var myscale = this.getScale();
		this.viewLeft = px;
		this.viewTop = py;
		this.viewRight = px + (this.runtime.draw_width * (1 / myscale));
		this.viewBottom = py + (this.runtime.draw_height * (1 / myscale));
		var temp;
		if (this.viewLeft > this.viewRight)
		{
			temp = this.viewLeft;
			this.viewLeft = this.viewRight;
			this.viewRight = temp;
		}
		if (this.viewTop > this.viewBottom)
		{
			temp = this.viewTop;
			this.viewTop = this.viewBottom;
			this.viewBottom = temp;
		}
		var myAngle = this.getAngle();
		if (myAngle !== 0)
		{
			if (ctx)
			{
				ctx.translate(this.runtime.draw_width / 2, this.runtime.draw_height / 2);
				ctx.rotate(-myAngle);
				ctx.translate(this.runtime.draw_width / -2, this.runtime.draw_height / -2);
			}
			this.tmprect.set(this.viewLeft, this.viewTop, this.viewRight, this.viewBottom);
			this.tmprect.offset((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
			this.tmpquad.set_from_rotated_rect(this.tmprect, myAngle);
			this.tmpquad.bounding_box(this.tmprect);
			this.tmprect.offset((this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2);
			this.viewLeft = this.tmprect.left;
			this.viewTop = this.tmprect.top;
			this.viewRight = this.tmprect.right;
			this.viewBottom = this.tmprect.bottom;
		}
	}
	Layer.prototype.drawGL_earlyZPass = function (glw)
	{
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var shaderindex = 0;
		var etindex = 0;
		this.render_offscreen = this.forceOwnTexture;
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_tex)
			{
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layer_tex.c2width !== this.runtime.draw_width || this.runtime.layer_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layer_tex);
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layer_tex);
		}
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, null);
		var myscale = this.getScale();
		glw.resetModelView();
		glw.scale(myscale, myscale);
		glw.rotateZ(-this.getAngle());
		glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
		glw.updateModelView();
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, inst, last_inst = null;
		for (i = instances_to_draw.length - 1; i >= 0; --i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstanceGL_earlyZPass(instances_to_draw[i], glw);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		if (!this.transparent)
		{
			this.clear_earlyz_index = this.runtime.earlyz_index++;
			glw.setEarlyZIndex(this.clear_earlyz_index);
			glw.setColorFillMode(1, 1, 1, 1);
			glw.fullscreenQuad();		// fill remaining space in depth buffer with current Z value
			glw.restoreEarlyZMode();
		}
	};
	Layer.prototype.drawGL = function (glw)
	{
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var shaderindex = 0;
		var etindex = 0;
		this.render_offscreen = (this.forceOwnTexture || this.opacity !== 1.0 || this.active_effect_types.length > 0 || this.blend_mode !== 0);
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_tex)
			{
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layer_tex.c2width !== this.runtime.draw_width || this.runtime.layer_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layer_tex);
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layer_tex);
			if (this.transparent)
				glw.clear(0, 0, 0, 0);
		}
		if (!this.transparent)
		{
			if (this.runtime.enableFrontToBack)
			{
				glw.setEarlyZIndex(this.clear_earlyz_index);
				glw.setColorFillMode(this.background_color[0] / 255, this.background_color[1] / 255, this.background_color[2] / 255, 1);
				glw.fullscreenQuad();
				glw.setTextureFillMode();
			}
			else
			{
				glw.clear(this.background_color[0] / 255, this.background_color[1] / 255, this.background_color[2] / 255, 1);
			}
		}
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, null);
		var myscale = this.getScale();
		glw.resetModelView();
		glw.scale(myscale, myscale);
		glw.rotateZ(-this.getAngle());
		glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
		glw.updateModelView();
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, len, inst, last_inst = null;
		for (i = 0, len = instances_to_draw.length; i < len; ++i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstanceGL(instances_to_draw[i], glw);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		if (this.render_offscreen)
		{
			shaderindex = this.active_effect_types.length ? this.active_effect_types[0].shaderindex : 0;
			etindex = this.active_effect_types.length ? this.active_effect_types[0].index : 0;
			if (this.active_effect_types.length === 0 || (this.active_effect_types.length === 1 &&
				!glw.programUsesCrossSampling(shaderindex) && this.opacity === 1))
			{
				if (this.active_effect_types.length === 1)
				{
					glw.switchProgram(shaderindex);
					glw.setProgramParameters(this.layout.getRenderTarget(),		// backTex
											 1.0 / this.runtime.draw_width,		// pixelWidth
											 1.0 / this.runtime.draw_height,	// pixelHeight
											 0.0, 0.0,							// destStart
											 1.0, 1.0,							// destEnd
											 myscale,							// layerScale
											 this.getAngle(),
											 this.viewLeft, this.viewTop,
											 (this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2,
											 this.runtime.kahanTime.sum,
											 this.effect_params[etindex]);		// fx parameters
					if (glw.programIsAnimated(shaderindex))
						this.runtime.redraw = true;
				}
				else
					glw.switchProgram(0);
				glw.setRenderingToTexture(this.layout.getRenderTarget());
				glw.setOpacity(this.opacity);
				glw.setTexture(this.runtime.layer_tex);
				glw.setBlend(this.srcBlend, this.destBlend);
				glw.resetModelView();
				glw.updateModelView();
				var halfw = this.runtime.draw_width / 2;
				var halfh = this.runtime.draw_height / 2;
				glw.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
				glw.setTexture(null);
			}
			else
			{
				this.layout.renderEffectChain(glw, this, null, this.layout.getRenderTarget());
			}
		}
	};
	Layer.prototype.drawInstanceGL = function (inst, glw)
	{
;
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		glw.setEarlyZIndex(inst.earlyz_index);
		if (inst.uses_shaders)
		{
			this.drawInstanceWithShadersGL(inst, glw);
		}
		else
		{
			glw.switchProgram(0);		// un-set any previously set shader
			glw.setBlend(inst.srcBlend, inst.destBlend);
			inst.drawGL(glw);
		}
	};
	Layer.prototype.drawInstanceGL_earlyZPass = function (inst, glw)
	{
;
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		inst.earlyz_index = this.runtime.earlyz_index++;
		if (inst.blend_mode !== 0 || inst.opacity !== 1 || !inst.shaders_preserve_opaqueness || !inst.drawGL_earlyZPass)
			return;
		glw.setEarlyZIndex(inst.earlyz_index);
		inst.drawGL_earlyZPass(glw);
	};
	Layer.prototype.drawInstanceWithShadersGL = function (inst, glw)
	{
		var shaderindex = inst.active_effect_types[0].shaderindex;
		var etindex = inst.active_effect_types[0].index;
		var myscale = this.getScale();
		if (inst.active_effect_types.length === 1 && !glw.programUsesCrossSampling(shaderindex) &&
			!glw.programExtendsBox(shaderindex) && ((!inst.angle && !inst.layer.getAngle()) || !glw.programUsesDest(shaderindex)) &&
			inst.opacity === 1 && !inst.type.plugin.must_predraw)
		{
			glw.switchProgram(shaderindex);
			glw.setBlend(inst.srcBlend, inst.destBlend);
			if (glw.programIsAnimated(shaderindex))
				this.runtime.redraw = true;
			var destStartX = 0, destStartY = 0, destEndX = 0, destEndY = 0;
			if (glw.programUsesDest(shaderindex))
			{
				var bbox = inst.bbox;
				var screenleft = this.layerToCanvas(bbox.left, bbox.top, true, true);
				var screentop = this.layerToCanvas(bbox.left, bbox.top, false, true);
				var screenright = this.layerToCanvas(bbox.right, bbox.bottom, true, true);
				var screenbottom = this.layerToCanvas(bbox.right, bbox.bottom, false, true);
				destStartX = screenleft / windowWidth;
				destStartY = 1 - screentop / windowHeight;
				destEndX = screenright / windowWidth;
				destEndY = 1 - screenbottom / windowHeight;
			}
			var pixelWidth;
			var pixelHeight;
			if (inst.curFrame && inst.curFrame.texture_img)
			{
				var img = inst.curFrame.texture_img;
				pixelWidth = 1.0 / img.width;
				pixelHeight = 1.0 / img.height;
			}
			else
			{
				pixelWidth = 1.0 / inst.width;
				pixelHeight = 1.0 / inst.height;
			}
			glw.setProgramParameters(this.render_offscreen ? this.runtime.layer_tex : this.layout.getRenderTarget(), // backTex
									 pixelWidth,
									 pixelHeight,
									 destStartX, destStartY,
									 destEndX, destEndY,
									 myscale,
									 this.getAngle(),
									 this.viewLeft, this.viewTop,
									 (this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2,
									 this.runtime.kahanTime.sum,
									 inst.effect_params[etindex]);
			inst.drawGL(glw);
		}
		else
		{
			this.layout.renderEffectChain(glw, this, inst, this.render_offscreen ? this.runtime.layer_tex : this.layout.getRenderTarget());
			glw.resetModelView();
			glw.scale(myscale, myscale);
			glw.rotateZ(-this.getAngle());
			glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
			glw.updateModelView();
		}
	};
	Layer.prototype.canvasToLayer = function (ptx, pty, getx, using_draw_area)
	{
		var multiplier = this.runtime.devicePixelRatio;
		if (this.runtime.isRetina)
		{
			ptx *= multiplier;
			pty *= multiplier;
		}
		var ox = this.runtime.parallax_x_origin;
		var oy = this.runtime.parallax_y_origin;
		var par_x = ((this.layout.scrollX - ox) * this.parallaxX) + ox;
		var par_y = ((this.layout.scrollY - oy) * this.parallaxY) + oy;
		var x = par_x;
		var y = par_y;
		var invScale = 1 / this.getScale(!using_draw_area);
		if (using_draw_area)
		{
			x -= (this.runtime.draw_width * invScale) / 2;
			y -= (this.runtime.draw_height * invScale) / 2;
		}
		else
		{
			x -= (this.runtime.width * invScale) / 2;
			y -= (this.runtime.height * invScale) / 2;
		}
		x += ptx * invScale;
		y += pty * invScale;
		var a = this.getAngle();
		if (a !== 0)
		{
			x -= par_x;
			y -= par_y;
			var cosa = Math.cos(a);
			var sina = Math.sin(a);
			var x_temp = (x * cosa) - (y * sina);
			y = (y * cosa) + (x * sina);
			x = x_temp;
			x += par_x;
			y += par_y;
		}
		return getx ? x : y;
	};
	Layer.prototype.layerToCanvas = function (ptx, pty, getx, using_draw_area)
	{
		var ox = this.runtime.parallax_x_origin;
		var oy = this.runtime.parallax_y_origin;
		var par_x = ((this.layout.scrollX - ox) * this.parallaxX) + ox;
		var par_y = ((this.layout.scrollY - oy) * this.parallaxY) + oy;
		var x = par_x;
		var y = par_y;
		var a = this.getAngle();
		if (a !== 0)
		{
			ptx -= par_x;
			pty -= par_y;
			var cosa = Math.cos(-a);
			var sina = Math.sin(-a);
			var x_temp = (ptx * cosa) - (pty * sina);
			pty = (pty * cosa) + (ptx * sina);
			ptx = x_temp;
			ptx += par_x;
			pty += par_y;
		}
		var invScale = 1 / this.getScale(!using_draw_area);
		if (using_draw_area)
		{
			x -= (this.runtime.draw_width * invScale) / 2;
			y -= (this.runtime.draw_height * invScale) / 2;
		}
		else
		{
			x -= (this.runtime.width * invScale) / 2;
			y -= (this.runtime.height * invScale) / 2;
		}
		x = (ptx - x) / invScale;
		y = (pty - y) / invScale;
		var multiplier = this.runtime.devicePixelRatio;
		if (this.runtime.isRetina && !using_draw_area)
		{
			x /= multiplier;
			y /= multiplier;
		}
		return getx ? x : y;
	};
	Layer.prototype.rotatePt = function (x_, y_, getx)
	{
		if (this.getAngle() === 0)
			return getx ? x_ : y_;
		var nx = this.layerToCanvas(x_, y_, true);
		var ny = this.layerToCanvas(x_, y_, false);
		this.disableAngle = true;
		var px = this.canvasToLayer(nx, ny, true);
		var py = this.canvasToLayer(nx, ny, true);
		this.disableAngle = false;
		return getx ? px : py;
	};
	Layer.prototype.saveToJSON = function ()
	{
		var i, len, et;
		var o = {
			"s": this.scale,
			"a": this.angle,
			"vl": this.viewLeft,
			"vt": this.viewTop,
			"vr": this.viewRight,
			"vb": this.viewBottom,
			"v": this.visible,
			"bc": this.background_color,
			"t": this.transparent,
			"px": this.parallaxX,
			"py": this.parallaxY,
			"o": this.opacity,
			"zr": this.zoomRate,
			"fx": [],
			"cg": this.created_globals,		// added r197; list of global UIDs already created
			"instances": []
		};
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			o["fx"].push({"name": et.name, "active": et.active, "params": this.effect_params[et.index] });
		}
		return o;
	};
	Layer.prototype.loadFromJSON = function (o)
	{
		var i, j, len, p, inst, fx;
		this.scale = o["s"];
		this.angle = o["a"];
		this.viewLeft = o["vl"];
		this.viewTop = o["vt"];
		this.viewRight = o["vr"];
		this.viewBottom = o["vb"];
		this.visible = o["v"];
		this.background_color = o["bc"];
		this.transparent = o["t"];
		this.parallaxX = o["px"];
		this.parallaxY = o["py"];
		this.opacity = o["o"];
		this.zoomRate = o["zr"];
		this.created_globals = o["cg"] || [];		// added r197
		cr.shallowAssignArray(this.initial_instances, this.startup_initial_instances);
		var temp_set = new cr.ObjectSet();
		for (i = 0, len = this.created_globals.length; i < len; ++i)
			temp_set.add(this.created_globals[i]);
		for (i = 0, j = 0, len = this.initial_instances.length; i < len; ++i)
		{
			if (!temp_set.contains(this.initial_instances[i][2]))		// UID in element 2
			{
				this.initial_instances[j] = this.initial_instances[i];
				++j;
			}
		}
		cr.truncateArray(this.initial_instances, j);
		var ofx = o["fx"];
		for (i = 0, len = ofx.length; i < len; i++)
		{
			fx = this.getEffectByName(ofx[i]["name"]);
			if (!fx)
				continue;		// must've gone missing
			fx.active = ofx[i]["active"];
			this.effect_params[fx.index] = ofx[i]["params"];
		}
		this.updateActiveEffects();
		this.instances.sort(sort_by_zindex);
		this.zindices_stale = true;
	};
	cr.layer = Layer;
}());
;
(function()
{
	var allUniqueSolModifiers = [];
	function testSolsMatch(arr1, arr2)
	{
		var i, len = arr1.length;
		switch (len) {
		case 0:
			return true;
		case 1:
			return arr1[0] === arr2[0];
		case 2:
			return arr1[0] === arr2[0] && arr1[1] === arr2[1];
		default:
			for (i = 0; i < len; i++)
			{
				if (arr1[i] !== arr2[i])
					return false;
			}
			return true;
		}
	};
	function solArraySorter(t1, t2)
	{
		return t1.index - t2.index;
	};
	function findMatchingSolModifier(arr)
	{
		var i, len, u, temp, subarr;
		if (arr.length === 2)
		{
			if (arr[0].index > arr[1].index)
			{
				temp = arr[0];
				arr[0] = arr[1];
				arr[1] = temp;
			}
		}
		else if (arr.length > 2)
			arr.sort(solArraySorter);		// so testSolsMatch compares in same order
		if (arr.length >= allUniqueSolModifiers.length)
			allUniqueSolModifiers.length = arr.length + 1;
		if (!allUniqueSolModifiers[arr.length])
			allUniqueSolModifiers[arr.length] = [];
		subarr = allUniqueSolModifiers[arr.length];
		for (i = 0, len = subarr.length; i < len; i++)
		{
			u = subarr[i];
			if (testSolsMatch(arr, u))
				return u;
		}
		subarr.push(arr);
		return arr;
	};
	function EventSheet(runtime, m)
	{
		this.runtime = runtime;
		this.triggers = {};
		this.fasttriggers = {};
        this.hasRun = false;
        this.includes = new cr.ObjectSet(); 	// all event sheets included by this sheet, at first-level indirection only
		this.deep_includes = [];				// all includes from this sheet recursively, in trigger order
		this.already_included_sheets = [];		// used while building deep_includes
		this.name = m[0];
		var em = m[1];		// events model
		this.events = [];       // triggers won't make it to this array
		var i, len;
		for (i = 0, len = em.length; i < len; i++)
			this.init_event(em[i], null, this.events);
	};
    EventSheet.prototype.toString = function ()
    {
        return this.name;
    };
	EventSheet.prototype.init_event = function (m, parent, nontriggers)
	{
		switch (m[0]) {
		case 0:	// event block
		{
			var block = new cr.eventblock(this, parent, m);
			cr.seal(block);
			if (block.orblock)
			{
				nontriggers.push(block);
				var i, len;
				for (i = 0, len = block.conditions.length; i < len; i++)
				{
					if (block.conditions[i].trigger)
						this.init_trigger(block, i);
				}
			}
			else
			{
				if (block.is_trigger())
					this.init_trigger(block, 0);
				else
					nontriggers.push(block);
			}
			break;
		}
		case 1: // variable
		{
			var v = new cr.eventvariable(this, parent, m);
			cr.seal(v);
			nontriggers.push(v);
			break;
		}
        case 2:	// include
        {
            var inc = new cr.eventinclude(this, parent, m);
			cr.seal(inc);
            nontriggers.push(inc);
			break;
        }
		default:
;
		}
	};
	EventSheet.prototype.postInit = function ()
	{
		var i, len;
		for (i = 0, len = this.events.length; i < len; i++)
		{
			this.events[i].postInit(i < len - 1 && this.events[i + 1].is_else_block);
		}
	};
	EventSheet.prototype.updateDeepIncludes = function ()
	{
		cr.clearArray(this.deep_includes);
		cr.clearArray(this.already_included_sheets);
		this.addDeepIncludes(this);
		cr.clearArray(this.already_included_sheets);
	};
	EventSheet.prototype.addDeepIncludes = function (root_sheet)
	{
		var i, len, inc, sheet;
		var deep_includes = root_sheet.deep_includes;
		var already_included_sheets = root_sheet.already_included_sheets;
		var arr = this.includes.valuesRef();
		for (i = 0, len = arr.length; i < len; ++i)
		{
			inc = arr[i];
			sheet = inc.include_sheet;
			if (!inc.isActive() || root_sheet === sheet || already_included_sheets.indexOf(sheet) > -1)
				continue;
			already_included_sheets.push(sheet);
			sheet.addDeepIncludes(root_sheet);
			deep_includes.push(sheet);
		}
	};
	EventSheet.prototype.run = function (from_include)
	{
		if (!this.runtime.resuming_breakpoint)
		{
			this.hasRun = true;
			if (!from_include)
				this.runtime.isRunningEvents = true;
		}
		var i, len;
		for (i = 0, len = this.events.length; i < len; i++)
		{
			var ev = this.events[i];
			ev.run();
				this.runtime.clearSol(ev.solModifiers);
				if (this.runtime.hasPendingInstances)
					this.runtime.ClearDeathRow();
		}
			if (!from_include)
				this.runtime.isRunningEvents = false;
	};
	function isPerformanceSensitiveTrigger(method)
	{
		if (cr.plugins_.Sprite && method === cr.plugins_.Sprite.prototype.cnds.OnFrameChanged)
		{
			return true;
		}
		return false;
	};
	EventSheet.prototype.init_trigger = function (trig, index)
	{
		if (!trig.orblock)
			this.runtime.triggers_to_postinit.push(trig);	// needs to be postInit'd later
		var i, len;
		var cnd = trig.conditions[index];
		var type_name;
		if (cnd.type)
			type_name = cnd.type.name;
		else
			type_name = "system";
		var fasttrigger = cnd.fasttrigger;
		var triggers = (fasttrigger ? this.fasttriggers : this.triggers);
		if (!triggers[type_name])
			triggers[type_name] = [];
		var obj_entry = triggers[type_name];
		var method = cnd.func;
		if (fasttrigger)
		{
			if (!cnd.parameters.length)				// no parameters
				return;
			var firstparam = cnd.parameters[0];
			if (firstparam.type !== 1 ||			// not a string param
				firstparam.expression.type !== 2)	// not a string literal node
			{
				return;
			}
			var fastevs;
			var firstvalue = firstparam.expression.value.toLowerCase();
			var i, len;
			for (i = 0, len = obj_entry.length; i < len; i++)
			{
				if (obj_entry[i].method == method)
				{
					fastevs = obj_entry[i].evs;
					if (!fastevs[firstvalue])
						fastevs[firstvalue] = [[trig, index]];
					else
						fastevs[firstvalue].push([trig, index]);
					return;
				}
			}
			fastevs = {};
			fastevs[firstvalue] = [[trig, index]];
			obj_entry.push({ method: method, evs: fastevs });
		}
		else
		{
			for (i = 0, len = obj_entry.length; i < len; i++)
			{
				if (obj_entry[i].method == method)
				{
					obj_entry[i].evs.push([trig, index]);
					return;
				}
			}
			if (isPerformanceSensitiveTrigger(method))
				obj_entry.unshift({ method: method, evs: [[trig, index]]});
			else
				obj_entry.push({ method: method, evs: [[trig, index]]});
		}
	};
	cr.eventsheet = EventSheet;
	function Selection(type)
	{
		this.type = type;
		this.instances = [];        // subset of picked instances
		this.else_instances = [];	// subset of unpicked instances
		this.select_all = true;
	};
	Selection.prototype.hasObjects = function ()
	{
		if (this.select_all)
			return this.type.instances.length;
		else
			return this.instances.length;
	};
	Selection.prototype.getObjects = function ()
	{
		if (this.select_all)
			return this.type.instances;
		else
			return this.instances;
	};
	/*
	Selection.prototype.ensure_picked = function (inst, skip_siblings)
	{
		var i, len;
		var orblock = inst.runtime.getCurrentEventStack().current_event.orblock;
		if (this.select_all)
		{
			this.select_all = false;
			if (orblock)
			{
				cr.shallowAssignArray(this.else_instances, inst.type.instances);
				cr.arrayFindRemove(this.else_instances, inst);
			}
			this.instances.length = 1;
			this.instances[0] = inst;
		}
		else
		{
			if (orblock)
			{
				i = this.else_instances.indexOf(inst);
				if (i !== -1)
				{
					this.instances.push(this.else_instances[i]);
					this.else_instances.splice(i, 1);
				}
			}
			else
			{
				if (this.instances.indexOf(inst) === -1)
					this.instances.push(inst);
			}
		}
		if (!skip_siblings)
		{
		}
	};
	*/
	Selection.prototype.pick_one = function (inst)
	{
		if (!inst)
			return;
		if (inst.runtime.getCurrentEventStack().current_event.orblock)
		{
			if (this.select_all)
			{
				cr.clearArray(this.instances);
				cr.shallowAssignArray(this.else_instances, inst.type.instances);
				this.select_all = false;
			}
			var i = this.else_instances.indexOf(inst);
			if (i !== -1)
			{
				this.instances.push(this.else_instances[i]);
				this.else_instances.splice(i, 1);
			}
		}
		else
		{
			this.select_all = false;
			cr.clearArray(this.instances);
			this.instances[0] = inst;
		}
	};
	cr.selection = Selection;
	function EventBlock(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.solModifiersIncludingParents = [];
		this.solWriterAfterCnds = false;	// block does not change SOL after running its conditions
		this.group = false;					// is group of events
		this.initially_activated = false;	// if a group, is active on startup
		this.toplevelevent = false;			// is an event block parented only by a top-level group
		this.toplevelgroup = false;			// is parented only by other groups or is top-level (i.e. not in a subevent)
		this.has_else_block = false;		// is followed by else
;
		this.conditions = [];
		this.actions = [];
		this.subevents = [];
		this.group_name = "";
		this.group = false;
		this.initially_activated = false;
		this.group_active = false;
		this.contained_includes = null;
        if (m[1])
        {
			this.group_name = m[1][1].toLowerCase();
			this.group = true;
			this.initially_activated = !!m[1][0];
			this.contained_includes = [];
			this.group_active = this.initially_activated;
			this.runtime.allGroups.push(this);
            this.runtime.groups_by_name[this.group_name] = this;
        }
		this.orblock = m[2];
		this.sid = m[4];
		if (!this.group)
			this.runtime.blocksBySid[this.sid.toString()] = this;
		var i, len;
		var cm = m[5];
		for (i = 0, len = cm.length; i < len; i++)
		{
			var cnd = new cr.condition(this, cm[i]);
			cnd.index = i;
			cr.seal(cnd);
			this.conditions.push(cnd);
			/*
			if (cnd.is_logical())
				this.is_logical = true;
			if (cnd.type && !cnd.type.plugin.singleglobal && this.cndReferences.indexOf(cnd.type) === -1)
				this.cndReferences.push(cnd.type);
			*/
			this.addSolModifier(cnd.type);
		}
		var am = m[6];
		for (i = 0, len = am.length; i < len; i++)
		{
			var act = new cr.action(this, am[i]);
			act.index = i;
			cr.seal(act);
			this.actions.push(act);
		}
		if (m.length === 8)
		{
			var em = m[7];
			for (i = 0, len = em.length; i < len; i++)
				this.sheet.init_event(em[i], this, this.subevents);
		}
		this.is_else_block = false;
		if (this.conditions.length)
		{
			this.is_else_block = (this.conditions[0].type == null && this.conditions[0].func == cr.system_object.prototype.cnds.Else);
		}
	};
	window["_c2hh_"] = "3CA03FD8F1E943CBD0DD057CD3815EDA73E907F8";
	EventBlock.prototype.postInit = function (hasElse/*, prevBlock_*/)
	{
		var i, len;
		var p = this.parent;
		if (this.group)
		{
			this.toplevelgroup = true;
			while (p)
			{
				if (!p.group)
				{
					this.toplevelgroup = false;
					break;
				}
				p = p.parent;
			}
		}
		this.toplevelevent = !this.is_trigger() && (!this.parent || (this.parent.group && this.parent.toplevelgroup));
		this.has_else_block = !!hasElse;
		this.solModifiersIncludingParents = this.solModifiers.slice(0);
		p = this.parent;
		while (p)
		{
			for (i = 0, len = p.solModifiers.length; i < len; i++)
				this.addParentSolModifier(p.solModifiers[i]);
			p = p.parent;
		}
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
		this.solModifiersIncludingParents = findMatchingSolModifier(this.solModifiersIncludingParents);
		var i, len/*, s*/;
		for (i = 0, len = this.conditions.length; i < len; i++)
			this.conditions[i].postInit();
		for (i = 0, len = this.actions.length; i < len; i++)
			this.actions[i].postInit();
		for (i = 0, len = this.subevents.length; i < len; i++)
		{
			this.subevents[i].postInit(i < len - 1 && this.subevents[i + 1].is_else_block);
		}
		/*
		if (this.is_else_block && this.prev_block)
		{
			for (i = 0, len = this.prev_block.solModifiers.length; i < len; i++)
			{
				s = this.prev_block.solModifiers[i];
				if (this.solModifiers.indexOf(s) === -1)
					this.solModifiers.push(s);
			}
		}
		*/
	};
	EventBlock.prototype.setGroupActive = function (a)
	{
		if (this.group_active === !!a)
			return;		// same state
		this.group_active = !!a;
		var i, len;
		for (i = 0, len = this.contained_includes.length; i < len; ++i)
		{
			this.contained_includes[i].updateActive();
		}
		if (len > 0 && this.runtime.running_layout.event_sheet)
			this.runtime.running_layout.event_sheet.updateDeepIncludes();
	};
	function addSolModifierToList(type, arr)
	{
		var i, len, t;
		if (!type)
			return;
		if (arr.indexOf(type) === -1)
			arr.push(type);
		if (type.is_contained)
		{
			for (i = 0, len = type.container.length; i < len; i++)
			{
				t = type.container[i];
				if (type === t)
					continue;		// already handled
				if (arr.indexOf(t) === -1)
					arr.push(t);
			}
		}
	};
	EventBlock.prototype.addSolModifier = function (type)
	{
		addSolModifierToList(type, this.solModifiers);
	};
	EventBlock.prototype.addParentSolModifier = function (type)
	{
		addSolModifierToList(type, this.solModifiersIncludingParents);
	};
	EventBlock.prototype.setSolWriterAfterCnds = function ()
	{
		this.solWriterAfterCnds = true;
		if (this.parent)
			this.parent.setSolWriterAfterCnds();
	};
	EventBlock.prototype.is_trigger = function ()
	{
		if (!this.conditions.length)    // no conditions
			return false;
		else
			return this.conditions[0].trigger;
	};
	EventBlock.prototype.run = function ()
	{
		var i, len, c, any_true = false, cnd_result;
		var runtime = this.runtime;
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		var conditions = this.conditions;
			if (!this.is_else_block)
				evinfo.else_branch_ran = false;
		if (this.orblock)
		{
			if (conditions.length === 0)
				any_true = true;		// be sure to run if empty block
				evinfo.cndindex = 0
			for (len = conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				c = conditions[evinfo.cndindex];
				if (c.trigger)		// skip triggers when running OR block
					continue;
				cnd_result = c.run();
				if (cnd_result)			// make sure all conditions run and run if any were true
					any_true = true;
			}
			evinfo.last_event_true = any_true;
			if (any_true)
				this.run_actions_and_subevents();
		}
		else
		{
				evinfo.cndindex = 0
			for (len = conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				cnd_result = conditions[evinfo.cndindex].run();
				if (!cnd_result)    // condition failed
				{
					evinfo.last_event_true = false;
					if (this.toplevelevent && runtime.hasPendingInstances)
						runtime.ClearDeathRow();
					return;		// bail out now
				}
			}
			evinfo.last_event_true = true;
			this.run_actions_and_subevents();
		}
		this.end_run(evinfo);
	};
	EventBlock.prototype.end_run = function (evinfo)
	{
		if (evinfo.last_event_true && this.has_else_block)
			evinfo.else_branch_ran = true;
		if (this.toplevelevent && this.runtime.hasPendingInstances)
			this.runtime.ClearDeathRow();
	};
	EventBlock.prototype.run_orblocktrigger = function (index)
	{
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		if (this.conditions[index].run())
		{
			this.run_actions_and_subevents();
			this.runtime.getCurrentEventStack().last_event_true = true;
		}
	};
	EventBlock.prototype.run_actions_and_subevents = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		var len;
		for (evinfo.actindex = 0, len = this.actions.length; evinfo.actindex < len; evinfo.actindex++)
		{
			if (this.actions[evinfo.actindex].run())
				return;
		}
		this.run_subevents();
	};
	EventBlock.prototype.resume_actions_and_subevents = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		var len;
		for (len = this.actions.length; evinfo.actindex < len; evinfo.actindex++)
		{
			if (this.actions[evinfo.actindex].run())
				return;
		}
		this.run_subevents();
	};
	EventBlock.prototype.run_subevents = function ()
	{
		if (!this.subevents.length)
			return;
		var i, len, subev, pushpop/*, skipped_pop = false, pop_modifiers = null*/;
		var last = this.subevents.length - 1;
			this.runtime.pushEventStack(this);
		if (this.solWriterAfterCnds)
		{
			for (i = 0, len = this.subevents.length; i < len; i++)
			{
				subev = this.subevents[i];
					pushpop = (!this.toplevelgroup || (!this.group && i < last));
					if (pushpop)
						this.runtime.pushCopySol(subev.solModifiers);
				subev.run();
					if (pushpop)
						this.runtime.popSol(subev.solModifiers);
					else
						this.runtime.clearSol(subev.solModifiers);
			}
		}
		else
		{
			for (i = 0, len = this.subevents.length; i < len; i++)
			{
				this.subevents[i].run();
			}
		}
			this.runtime.popEventStack();
	};
	EventBlock.prototype.run_pretrigger = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		var any_true = false;
		var i, len;
		for (evinfo.cndindex = 0, len = this.conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
		{
;
			if (this.conditions[evinfo.cndindex].run())
				any_true = true;
			else if (!this.orblock)			// condition failed (let OR blocks run all conditions anyway)
				return false;               // bail out
		}
		return this.orblock ? any_true : true;
	};
	EventBlock.prototype.retrigger = function ()
	{
		this.runtime.execcount++;
		var prevcndindex = this.runtime.getCurrentEventStack().cndindex;
		var len;
		var evinfo = this.runtime.pushEventStack(this);
		if (!this.orblock)
		{
			for (evinfo.cndindex = prevcndindex + 1, len = this.conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				if (!this.conditions[evinfo.cndindex].run())    // condition failed
				{
					this.runtime.popEventStack();               // moving up level of recursion
					return false;                               // bail out
				}
			}
		}
		this.run_actions_and_subevents();
		this.runtime.popEventStack();
		return true;		// ran an iteration
	};
	EventBlock.prototype.isFirstConditionOfType = function (cnd)
	{
		var cndindex = cnd.index;
		if (cndindex === 0)
			return true;
		--cndindex;
		for ( ; cndindex >= 0; --cndindex)
		{
			if (this.conditions[cndindex].type === cnd.type)
				return false;
		}
		return true;
	};
	cr.eventblock = EventBlock;
	function Condition(block, m)
	{
		this.block = block;
		this.sheet = block.sheet;
		this.runtime = block.runtime;
		this.parameters = [];
		this.results = [];
		this.extra = {};		// for plugins to stow away some custom info
		this.index = -1;
		this.anyParamVariesPerInstance = false;
		this.func = this.runtime.GetObjectReference(m[1]);
;
		this.trigger = (m[3] > 0);
		this.fasttrigger = (m[3] === 2);
		this.looping = m[4];
		this.inverted = m[5];
		this.isstatic = m[6];
		this.sid = m[7];
		this.runtime.cndsBySid[this.sid.toString()] = this;
		if (m[0] === -1)		// system object
		{
			this.type = null;
			this.run = this.run_system;
			this.behaviortype = null;
			this.beh_index = -1;
		}
		else
		{
			this.type = this.runtime.types_by_index[m[0]];
;
			if (this.isstatic)
				this.run = this.run_static;
			else
				this.run = this.run_object;
			if (m[2])
			{
				this.behaviortype = this.type.getBehaviorByName(m[2]);
;
				this.beh_index = this.type.getBehaviorIndexByName(m[2]);
;
			}
			else
			{
				this.behaviortype = null;
				this.beh_index = -1;
			}
			if (this.block.parent)
				this.block.parent.setSolWriterAfterCnds();
		}
		if (this.fasttrigger)
			this.run = this.run_true;
		if (m.length === 10)
		{
			var i, len;
			var em = m[9];
			for (i = 0, len = em.length; i < len; i++)
			{
				var param = new cr.parameter(this, em[i]);
				cr.seal(param);
				this.parameters.push(param);
			}
			this.results.length = em.length;
		}
	};
	Condition.prototype.postInit = function ()
	{
		var i, len, p;
		for (i = 0, len = this.parameters.length; i < len; i++)
		{
			p = this.parameters[i];
			p.postInit();
			if (p.variesPerInstance)
				this.anyParamVariesPerInstance = true;
		}
	};
	/*
	Condition.prototype.is_logical = function ()
	{
		return !this.type || this.type.plugin.singleglobal;
	};
	*/
	Condition.prototype.run_true = function ()
	{
		return true;
	};
	Condition.prototype.run_system = function ()
	{
		var i, len;
		for (i = 0, len = this.parameters.length; i < len; i++)
			this.results[i] = this.parameters[i].get();
		return cr.xor(this.func.apply(this.runtime.system, this.results), this.inverted);
	};
	Condition.prototype.run_static = function ()
	{
		var i, len;
		for (i = 0, len = this.parameters.length; i < len; i++)
			this.results[i] = this.parameters[i].get();
		var ret = this.func.apply(this.behaviortype ? this.behaviortype : this.type, this.results);
		this.type.applySolToContainer();
		return ret;
	};
	Condition.prototype.run_object = function ()
	{
		var i, j, k, leni, lenj, p, ret, met, inst, s, sol2;
		var type = this.type;
		var sol = type.getCurrentSol();
		var is_orblock = this.block.orblock && !this.trigger;		// triggers in OR blocks need to work normally
		var offset = 0;
		var is_contained = type.is_contained;
		var is_family = type.is_family;
		var family_index = type.family_index;
		var beh_index = this.beh_index;
		var is_beh = (beh_index > -1);
		var params_vary = this.anyParamVariesPerInstance;
		var parameters = this.parameters;
		var results = this.results;
		var inverted = this.inverted;
		var func = this.func;
		var arr, container;
		if (params_vary)
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
			{
				p = parameters[j];
				if (!p.variesPerInstance)
					results[j] = p.get(0);
			}
		}
		else
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
				results[j] = parameters[j].get(0);
		}
		if (sol.select_all) {
			cr.clearArray(sol.instances);       // clear contents
			cr.clearArray(sol.else_instances);
			arr = type.instances;
			for (i = 0, leni = arr.length; i < leni; ++i)
			{
				inst = arr[i];
;
				if (params_vary)
				{
					for (j = 0, lenj = parameters.length; j < lenj; ++j)
					{
						p = parameters[j];
						if (p.variesPerInstance)
							results[j] = p.get(i);        // default SOL index is current object
					}
				}
				if (is_beh)
				{
					offset = 0;
					if (is_family)
					{
						offset = inst.type.family_beh_map[family_index];
					}
					ret = func.apply(inst.behavior_insts[beh_index + offset], results);
				}
				else
					ret = func.apply(inst, results);
				met = cr.xor(ret, inverted);
				if (met)
					sol.instances.push(inst);
				else if (is_orblock)					// in OR blocks, keep the instances not meeting the condition for subsequent testing
					sol.else_instances.push(inst);
			}
			if (type.finish)
				type.finish(true);
			sol.select_all = false;
			type.applySolToContainer();
			return sol.hasObjects();
		}
		else {
			k = 0;
			var using_else_instances = (is_orblock && !this.block.isFirstConditionOfType(this));
			arr = (using_else_instances ? sol.else_instances : sol.instances);
			var any_true = false;
			for (i = 0, leni = arr.length; i < leni; ++i)
			{
				inst = arr[i];
;
				if (params_vary)
				{
					for (j = 0, lenj = parameters.length; j < lenj; ++j)
					{
						p = parameters[j];
						if (p.variesPerInstance)
							results[j] = p.get(i);        // default SOL index is current object
					}
				}
				if (is_beh)
				{
					offset = 0;
					if (is_family)
					{
						offset = inst.type.family_beh_map[family_index];
					}
					ret = func.apply(inst.behavior_insts[beh_index + offset], results);
				}
				else
					ret = func.apply(inst, results);
				if (cr.xor(ret, inverted))
				{
					any_true = true;
					if (using_else_instances)
					{
						sol.instances.push(inst);
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().instances.push(s);
							}
						}
					}
					else
					{
						arr[k] = inst;
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().instances[k] = s;
							}
						}
						k++;
					}
				}
				else
				{
					if (using_else_instances)
					{
						arr[k] = inst;
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().else_instances[k] = s;
							}
						}
						k++;
					}
					else if (is_orblock)
					{
						sol.else_instances.push(inst);
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().else_instances.push(s);
							}
						}
					}
				}
			}
			cr.truncateArray(arr, k);
			if (is_contained)
			{
				container = type.container;
				for (i = 0, leni = container.length; i < leni; i++)
				{
					sol2 = container[i].getCurrentSol();
					if (using_else_instances)
						cr.truncateArray(sol2.else_instances, k);
					else
						cr.truncateArray(sol2.instances, k);
				}
			}
			var pick_in_finish = any_true;		// don't pick in finish() if we're only doing the logic test below
			if (using_else_instances && !any_true)
			{
				for (i = 0, leni = sol.instances.length; i < leni; i++)
				{
					inst = sol.instances[i];
					if (params_vary)
					{
						for (j = 0, lenj = parameters.length; j < lenj; j++)
						{
							p = parameters[j];
							if (p.variesPerInstance)
								results[j] = p.get(i);
						}
					}
					if (is_beh)
						ret = func.apply(inst.behavior_insts[beh_index], results);
					else
						ret = func.apply(inst, results);
					if (cr.xor(ret, inverted))
					{
						any_true = true;
						break;		// got our flag, don't need to test any more
					}
				}
			}
			if (type.finish)
				type.finish(pick_in_finish || is_orblock);
			return is_orblock ? any_true : sol.hasObjects();
		}
	};
	cr.condition = Condition;
	function Action(block, m)
	{
		this.block = block;
		this.sheet = block.sheet;
		this.runtime = block.runtime;
		this.parameters = [];
		this.results = [];
		this.extra = {};		// for plugins to stow away some custom info
		this.index = -1;
		this.anyParamVariesPerInstance = false;
		this.func = this.runtime.GetObjectReference(m[1]);
;
		if (m[0] === -1)	// system
		{
			this.type = null;
			this.run = this.run_system;
			this.behaviortype = null;
			this.beh_index = -1;
		}
		else
		{
			this.type = this.runtime.types_by_index[m[0]];
;
			this.run = this.run_object;
			if (m[2])
			{
				this.behaviortype = this.type.getBehaviorByName(m[2]);
;
				this.beh_index = this.type.getBehaviorIndexByName(m[2]);
;
			}
			else
			{
				this.behaviortype = null;
				this.beh_index = -1;
			}
		}
		this.sid = m[3];
		this.runtime.actsBySid[this.sid.toString()] = this;
		if (m.length === 6)
		{
			var i, len;
			var em = m[5];
			for (i = 0, len = em.length; i < len; i++)
			{
				var param = new cr.parameter(this, em[i]);
				cr.seal(param);
				this.parameters.push(param);
			}
			this.results.length = em.length;
		}
	};
	Action.prototype.postInit = function ()
	{
		var i, len, p;
		for (i = 0, len = this.parameters.length; i < len; i++)
		{
			p = this.parameters[i];
			p.postInit();
			if (p.variesPerInstance)
				this.anyParamVariesPerInstance = true;
		}
	};
	Action.prototype.run_system = function ()
	{
		var runtime = this.runtime;
		var i, len;
		var parameters = this.parameters;
		var results = this.results;
		for (i = 0, len = parameters.length; i < len; ++i)
			results[i] = parameters[i].get();
		return this.func.apply(runtime.system, results);
	};
	Action.prototype.run_object = function ()
	{
		var type = this.type;
		var beh_index = this.beh_index;
		var family_index = type.family_index;
		var params_vary = this.anyParamVariesPerInstance;
		var parameters = this.parameters;
		var results = this.results;
		var func = this.func;
		var instances = type.getCurrentSol().getObjects();
		var is_family = type.is_family;
		var is_beh = (beh_index > -1);
		var i, j, leni, lenj, p, inst, offset;
		if (params_vary)
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
			{
				p = parameters[j];
				if (!p.variesPerInstance)
					results[j] = p.get(0);
			}
		}
		else
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
				results[j] = parameters[j].get(0);
		}
		for (i = 0, leni = instances.length; i < leni; ++i)
		{
			inst = instances[i];
			if (params_vary)
			{
				for (j = 0, lenj = parameters.length; j < lenj; ++j)
				{
					p = parameters[j];
					if (p.variesPerInstance)
						results[j] = p.get(i);    // pass i to use as default SOL index
				}
			}
			if (is_beh)
			{
				offset = 0;
				if (is_family)
				{
					offset = inst.type.family_beh_map[family_index];
				}
				func.apply(inst.behavior_insts[beh_index + offset], results);
			}
			else
				func.apply(inst, results);
		}
		return false;
	};
	cr.action = Action;
	var tempValues = [];
	var tempValuesPtr = -1;
	function pushTempValue()
	{
		tempValuesPtr++;
		if (tempValues.length === tempValuesPtr)
			tempValues.push(new cr.expvalue());
		return tempValues[tempValuesPtr];
	};
	function popTempValue()
	{
		tempValuesPtr--;
	};
	function Parameter(owner, m)
	{
		this.owner = owner;
		this.block = owner.block;
		this.sheet = owner.sheet;
		this.runtime = owner.runtime;
		this.type = m[0];
		this.expression = null;
		this.solindex = 0;
		this.get = null;
		this.combosel = 0;
		this.layout = null;
		this.key = 0;
		this.object = null;
		this.index = 0;
		this.varname = null;
		this.eventvar = null;
		this.fileinfo = null;
		this.subparams = null;
		this.variadicret = null;
		this.subparams = null;
		this.variadicret = null;
		this.variesPerInstance = false;
		var i, len, param;
		switch (m[0])
		{
			case 0:		// number
			case 7:		// any
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_exp;
				break;
			case 1:		// string
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_exp_str;
				break;
			case 5:		// layer
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_layer;
				break;
			case 3:		// combo
			case 8:		// cmp
				this.combosel = m[1];
				this.get = this.get_combosel;
				break;
			case 6:		// layout
				this.layout = this.runtime.layouts[m[1]];
;
				this.get = this.get_layout;
				break;
			case 9:		// keyb
				this.key = m[1];
				this.get = this.get_key;
				break;
			case 4:		// object
				this.object = this.runtime.types_by_index[m[1]];
;
				this.get = this.get_object;
				this.block.addSolModifier(this.object);
				if (this.owner instanceof cr.action)
					this.block.setSolWriterAfterCnds();
				else if (this.block.parent)
					this.block.parent.setSolWriterAfterCnds();
				break;
			case 10:	// instvar
				this.index = m[1];
				if (owner.type && owner.type.is_family)
				{
					this.get = this.get_familyvar;
					this.variesPerInstance = true;
				}
				else
					this.get = this.get_instvar;
				break;
			case 11:	// eventvar
				this.varname = m[1];
				this.eventvar = null;
				this.get = this.get_eventvar;
				break;
			case 2:		// audiofile	["name", ismusic]
			case 12:	// fileinfo		"name"
				this.fileinfo = m[1];
				this.get = this.get_audiofile;
				break;
			case 13:	// variadic
				this.get = this.get_variadic;
				this.subparams = [];
				this.variadicret = [];
				for (i = 1, len = m.length; i < len; i++)
				{
					param = new cr.parameter(this.owner, m[i]);
					cr.seal(param);
					this.subparams.push(param);
					this.variadicret.push(0);
				}
				break;
			default:
;
		}
	};
	Parameter.prototype.postInit = function ()
	{
		var i, len;
		if (this.type === 11)		// eventvar
		{
			this.eventvar = this.runtime.getEventVariableByName(this.varname, this.block.parent);
;
		}
		else if (this.type === 13)	// variadic, postInit all sub-params
		{
			for (i = 0, len = this.subparams.length; i < len; i++)
				this.subparams[i].postInit();
		}
		if (this.expression)
			this.expression.postInit();
	};
	Parameter.prototype.maybeVaryForType = function (t)
	{
		if (this.variesPerInstance)
			return;				// already varies per instance, no need to check again
		if (!t)
			return;				// never vary for system type
		if (!t.plugin.singleglobal)
		{
			this.variesPerInstance = true;
			return;
		}
	};
	Parameter.prototype.setVaries = function ()
	{
		this.variesPerInstance = true;
	};
	Parameter.prototype.get_exp = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		return temp.data;      			// return actual JS value, not expvalue
	};
	Parameter.prototype.get_exp_str = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		if (cr.is_string(temp.data))
			return temp.data;
		else
			return "";
	};
	Parameter.prototype.get_object = function ()
	{
		return this.object;
	};
	Parameter.prototype.get_combosel = function ()
	{
		return this.combosel;
	};
	Parameter.prototype.get_layer = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		if (temp.is_number())
			return this.runtime.getLayerByNumber(temp.data);
		else
			return this.runtime.getLayerByName(temp.data);
	}
	Parameter.prototype.get_layout = function ()
	{
		return this.layout;
	};
	Parameter.prototype.get_key = function ()
	{
		return this.key;
	};
	Parameter.prototype.get_instvar = function ()
	{
		return this.index;
	};
	Parameter.prototype.get_familyvar = function (solindex_)
	{
		var solindex = solindex_ || 0;
		var familytype = this.owner.type;
		var realtype = null;
		var sol = familytype.getCurrentSol();
		var objs = sol.getObjects();
		if (objs.length)
			realtype = objs[solindex % objs.length].type;
		else if (sol.else_instances.length)
			realtype = sol.else_instances[solindex % sol.else_instances.length].type;
		else if (familytype.instances.length)
			realtype = familytype.instances[solindex % familytype.instances.length].type;
		else
			return 0;
		return this.index + realtype.family_var_map[familytype.family_index];
	};
	Parameter.prototype.get_eventvar = function ()
	{
		return this.eventvar;
	};
	Parameter.prototype.get_audiofile = function ()
	{
		return this.fileinfo;
	};
	Parameter.prototype.get_variadic = function ()
	{
		var i, len;
		for (i = 0, len = this.subparams.length; i < len; i++)
		{
			this.variadicret[i] = this.subparams[i].get();
		}
		return this.variadicret;
	};
	cr.parameter = Parameter;
	function EventVariable(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.name = m[1];
		this.vartype = m[2];
		this.initial = m[3];
		this.is_static = !!m[4];
		this.is_constant = !!m[5];
		this.sid = m[6];
		this.runtime.varsBySid[this.sid.toString()] = this;
		this.data = this.initial;	// note: also stored in event stack frame for local nonstatic nonconst vars
		if (this.parent)			// local var
		{
			if (this.is_static || this.is_constant)
				this.localIndex = -1;
			else
				this.localIndex = this.runtime.stackLocalCount++;
			this.runtime.all_local_vars.push(this);
		}
		else						// global var
		{
			this.localIndex = -1;
			this.runtime.all_global_vars.push(this);
		}
	};
	EventVariable.prototype.postInit = function ()
	{
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
	};
	EventVariable.prototype.setValue = function (x)
	{
;
		var lvs = this.runtime.getCurrentLocalVarStack();
		if (!this.parent || this.is_static || !lvs)
			this.data = x;
		else	// local nonstatic variable: use event stack to keep value at this level of recursion
		{
			if (this.localIndex >= lvs.length)
				lvs.length = this.localIndex + 1;
			lvs[this.localIndex] = x;
		}
	};
	EventVariable.prototype.getValue = function ()
	{
		var lvs = this.runtime.getCurrentLocalVarStack();
		if (!this.parent || this.is_static || !lvs || this.is_constant)
			return this.data;
		else	// local nonstatic variable
		{
			if (this.localIndex >= lvs.length)
			{
				return this.initial;
			}
			if (typeof lvs[this.localIndex] === "undefined")
			{
				return this.initial;
			}
			return lvs[this.localIndex];
		}
	};
	EventVariable.prototype.run = function ()
	{
			if (this.parent && !this.is_static && !this.is_constant)
				this.setValue(this.initial);
	};
	cr.eventvariable = EventVariable;
	function EventInclude(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.include_sheet = null;		// determined in postInit
		this.include_sheet_name = m[1];
		this.active = true;
	};
	EventInclude.prototype.toString = function ()
	{
		return "include:" + this.include_sheet.toString();
	};
	EventInclude.prototype.postInit = function ()
	{
        this.include_sheet = this.runtime.eventsheets[this.include_sheet_name];
;
;
        this.sheet.includes.add(this);
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
		var p = this.parent;
		while (p)
		{
			if (p.group)
				p.contained_includes.push(this);
			p = p.parent;
		}
		this.updateActive();
	};
	EventInclude.prototype.run = function ()
	{
			if (this.parent)
				this.runtime.pushCleanSol(this.runtime.types_by_index);
        if (!this.include_sheet.hasRun)
            this.include_sheet.run(true);			// from include
			if (this.parent)
				this.runtime.popSol(this.runtime.types_by_index);
	};
	EventInclude.prototype.updateActive = function ()
	{
		var p = this.parent;
		while (p)
		{
			if (p.group && !p.group_active)
			{
				this.active = false;
				return;
			}
			p = p.parent;
		}
		this.active = true;
	};
	EventInclude.prototype.isActive = function ()
	{
		return this.active;
	};
	cr.eventinclude = EventInclude;
	function EventStackFrame()
	{
		this.temp_parents_arr = [];
		this.reset(null);
		cr.seal(this);
	};
	EventStackFrame.prototype.reset = function (cur_event)
	{
		this.current_event = cur_event;
		this.cndindex = 0;
		this.actindex = 0;
		cr.clearArray(this.temp_parents_arr);
		this.last_event_true = false;
		this.else_branch_ran = false;
		this.any_true_state = false;
	};
	EventStackFrame.prototype.isModifierAfterCnds = function ()
	{
		if (this.current_event.solWriterAfterCnds)
			return true;
		if (this.cndindex < this.current_event.conditions.length - 1)
			return !!this.current_event.solModifiers.length;
		return false;
	};
	cr.eventStackFrame = EventStackFrame;
}());
(function()
{
	function ExpNode(owner_, m)
	{
		this.owner = owner_;
		this.runtime = owner_.runtime;
		this.type = m[0];
;
		this.get = [this.eval_int,
					this.eval_float,
					this.eval_string,
					this.eval_unaryminus,
					this.eval_add,
					this.eval_subtract,
					this.eval_multiply,
					this.eval_divide,
					this.eval_mod,
					this.eval_power,
					this.eval_and,
					this.eval_or,
					this.eval_equal,
					this.eval_notequal,
					this.eval_less,
					this.eval_lessequal,
					this.eval_greater,
					this.eval_greaterequal,
					this.eval_conditional,
					this.eval_system_exp,
					this.eval_object_exp,
					this.eval_instvar_exp,
					this.eval_behavior_exp,
					this.eval_eventvar_exp][this.type];
		var paramsModel = null;
		this.value = null;
		this.first = null;
		this.second = null;
		this.third = null;
		this.func = null;
		this.results = null;
		this.parameters = null;
		this.object_type = null;
		this.beh_index = -1;
		this.instance_expr = null;
		this.varindex = -1;
		this.behavior_type = null;
		this.varname = null;
		this.eventvar = null;
		this.return_string = false;
		switch (this.type) {
		case 0:		// int
		case 1:		// float
		case 2:		// string
			this.value = m[1];
			break;
		case 3:		// unaryminus
			this.first = new cr.expNode(owner_, m[1]);
			break;
		case 18:	// conditional
			this.first = new cr.expNode(owner_, m[1]);
			this.second = new cr.expNode(owner_, m[2]);
			this.third = new cr.expNode(owner_, m[3]);
			break;
		case 19:	// system_exp
			this.func = this.runtime.GetObjectReference(m[1]);
;
			if (this.func === cr.system_object.prototype.exps.random
			 || this.func === cr.system_object.prototype.exps.choose)
			{
				this.owner.setVaries();
			}
			this.results = [];
			this.parameters = [];
			if (m.length === 3)
			{
				paramsModel = m[2];
				this.results.length = paramsModel.length + 1;	// must also fit 'ret'
			}
			else
				this.results.length = 1;      // to fit 'ret'
			break;
		case 20:	// object_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.beh_index = -1;
			this.func = this.runtime.GetObjectReference(m[2]);
			this.return_string = m[3];
			if (cr.plugins_.Function && this.func === cr.plugins_.Function.prototype.exps.Call)
			{
				this.owner.setVaries();
			}
			if (m[4])
				this.instance_expr = new cr.expNode(owner_, m[4]);
			else
				this.instance_expr = null;
			this.results = [];
			this.parameters = [];
			if (m.length === 6)
			{
				paramsModel = m[5];
				this.results.length = paramsModel.length + 1;
			}
			else
				this.results.length = 1;	// to fit 'ret'
			break;
		case 21:		// instvar_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.return_string = m[2];
			if (m[3])
				this.instance_expr = new cr.expNode(owner_, m[3]);
			else
				this.instance_expr = null;
			this.varindex = m[4];
			break;
		case 22:		// behavior_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.behavior_type = this.object_type.getBehaviorByName(m[2]);
;
			this.beh_index = this.object_type.getBehaviorIndexByName(m[2]);
			this.func = this.runtime.GetObjectReference(m[3]);
			this.return_string = m[4];
			if (m[5])
				this.instance_expr = new cr.expNode(owner_, m[5]);
			else
				this.instance_expr = null;
			this.results = [];
			this.parameters = [];
			if (m.length === 7)
			{
				paramsModel = m[6];
				this.results.length = paramsModel.length + 1;
			}
			else
				this.results.length = 1;	// to fit 'ret'
			break;
		case 23:		// eventvar_exp
			this.varname = m[1];
			this.eventvar = null;	// assigned in postInit
			break;
		}
		this.owner.maybeVaryForType(this.object_type);
		if (this.type >= 4 && this.type <= 17)
		{
			this.first = new cr.expNode(owner_, m[1]);
			this.second = new cr.expNode(owner_, m[2]);
		}
		if (paramsModel)
		{
			var i, len;
			for (i = 0, len = paramsModel.length; i < len; i++)
				this.parameters.push(new cr.expNode(owner_, paramsModel[i]));
		}
		cr.seal(this);
	};
	ExpNode.prototype.postInit = function ()
	{
		if (this.type === 23)	// eventvar_exp
		{
			this.eventvar = this.owner.runtime.getEventVariableByName(this.varname, this.owner.block.parent);
;
		}
		if (this.first)
			this.first.postInit();
		if (this.second)
			this.second.postInit();
		if (this.third)
			this.third.postInit();
		if (this.instance_expr)
			this.instance_expr.postInit();
		if (this.parameters)
		{
			var i, len;
			for (i = 0, len = this.parameters.length; i < len; i++)
				this.parameters[i].postInit();
		}
	};
	var tempValues = [];
	var tempValuesPtr = -1;
	function pushTempValue()
	{
		++tempValuesPtr;
		if (tempValues.length === tempValuesPtr)
			tempValues.push(new cr.expvalue());
		return tempValues[tempValuesPtr];
	};
	function popTempValue()
	{
		--tempValuesPtr;
	};
	function eval_params(parameters, results, temp)
	{
		var i, len;
		for (i = 0, len = parameters.length; i < len; ++i)
		{
			parameters[i].get(temp);
			results[i + 1] = temp.data;   // passing actual javascript value as argument instead of expvalue
		}
	}
	ExpNode.prototype.eval_system_exp = function (ret)
	{
		var parameters = this.parameters;
		var results = this.results;
		results[0] = ret;
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		popTempValue();
		this.func.apply(this.runtime.system, results);
	};
	ExpNode.prototype.eval_object_exp = function (ret)
	{
		var object_type = this.object_type;
		var results = this.results;
		var parameters = this.parameters;
		var instance_expr = this.instance_expr;
		var func = this.func;
		var index = this.owner.solindex;			// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		results[0] = ret;
		ret.object_class = object_type;		// so expression can access family type if need be
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		if (instance_expr) {
			instance_expr.get(temp);
			if (temp.is_number()) {
				index = temp.data;
				instances = object_type.instances;    // pick from all instances, not SOL
			}
		}
		popTempValue();
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;      // wraparound
		if (index < 0)
			index += len;
		var returned_val = func.apply(instances[index], results);
;
	};
	ExpNode.prototype.eval_behavior_exp = function (ret)
	{
		var object_type = this.object_type;
		var results = this.results;
		var parameters = this.parameters;
		var instance_expr = this.instance_expr;
		var beh_index = this.beh_index;
		var func = this.func;
		var index = this.owner.solindex;			// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		results[0] = ret;
		ret.object_class = object_type;		// so expression can access family type if need be
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		if (instance_expr) {
			instance_expr.get(temp);
			if (temp.is_number()) {
				index = temp.data;
				instances = object_type.instances;    // pick from all instances, not SOL
			}
		}
		popTempValue();
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;      // wraparound
		if (index < 0)
			index += len;
		var inst = instances[index];
		var offset = 0;
		if (object_type.is_family)
		{
			offset = inst.type.family_beh_map[object_type.family_index];
		}
		var returned_val = func.apply(inst.behavior_insts[beh_index + offset], results);
;
	};
	ExpNode.prototype.eval_instvar_exp = function (ret)
	{
		var instance_expr = this.instance_expr;
		var object_type = this.object_type;
		var varindex = this.varindex;
		var index = this.owner.solindex;		// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		var inst;
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		if (instance_expr)
		{
			var temp = pushTempValue();
			instance_expr.get(temp);
			if (temp.is_number())
			{
				index = temp.data;
				var type_instances = object_type.instances;
				if (type_instances.length !== 0)		// avoid NaN result with %
				{
					index %= type_instances.length;     // wraparound
					if (index < 0)                      // offset
						index += type_instances.length;
				}
				inst = object_type.getInstanceByIID(index);
				var to_ret = inst.instance_vars[varindex];
				if (cr.is_string(to_ret))
					ret.set_string(to_ret);
				else
					ret.set_float(to_ret);
				popTempValue();
				return;         // done
			}
			popTempValue();
		}
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;		// wraparound
		if (index < 0)
			index += len;
		inst = instances[index];
		var offset = 0;
		if (object_type.is_family)
		{
			offset = inst.type.family_var_map[object_type.family_index];
		}
		var to_ret = inst.instance_vars[varindex + offset];
		if (cr.is_string(to_ret))
			ret.set_string(to_ret);
		else
			ret.set_float(to_ret);
	};
	ExpNode.prototype.eval_int = function (ret)
	{
		ret.type = cr.exptype.Integer;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_float = function (ret)
	{
		ret.type = cr.exptype.Float;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_string = function (ret)
	{
		ret.type = cr.exptype.String;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_unaryminus = function (ret)
	{
		this.first.get(ret);                // retrieve operand
		if (ret.is_number())
			ret.data = -ret.data;
	};
	ExpNode.prototype.eval_add = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data += temp.data;          // both operands numbers: add
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_subtract = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data -= temp.data;          // both operands numbers: subtract
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_multiply = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data *= temp.data;          // both operands numbers: multiply
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_divide = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data /= temp.data;          // both operands numbers: divide
			ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_mod = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data %= temp.data;          // both operands numbers: modulo
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_power = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data = Math.pow(ret.data, temp.data);   // both operands numbers: raise to power
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_and = function (ret)
	{
		this.first.get(ret);			// left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (temp.is_string() || ret.is_string())
			this.eval_and_stringconcat(ret, temp);
		else
			this.eval_and_logical(ret, temp);
		popTempValue();
	};
	ExpNode.prototype.eval_and_stringconcat = function (ret, temp)
	{
		if (ret.is_string() && temp.is_string())
			this.eval_and_stringconcat_str_str(ret, temp);
		else
			this.eval_and_stringconcat_num(ret, temp);
	};
	ExpNode.prototype.eval_and_stringconcat_str_str = function (ret, temp)
	{
		ret.data += temp.data;
	};
	ExpNode.prototype.eval_and_stringconcat_num = function (ret, temp)
	{
		if (ret.is_string())
		{
			ret.data += (Math.round(temp.data * 1e10) / 1e10).toString();
		}
		else
		{
			ret.set_string(ret.data.toString() + temp.data);
		}
	};
	ExpNode.prototype.eval_and_logical = function (ret, temp)
	{
		ret.set_int(ret.data && temp.data ? 1 : 0);
	};
	ExpNode.prototype.eval_or = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			if (ret.data || temp.data)
				ret.set_int(1);
			else
				ret.set_int(0);
		}
		popTempValue();
	};
	ExpNode.prototype.eval_conditional = function (ret)
	{
		this.first.get(ret);                // condition operand
		if (ret.data)                       // is true
			this.second.get(ret);           // evaluate second operand to ret
		else
			this.third.get(ret);            // evaluate third operand to ret
	};
	ExpNode.prototype.eval_equal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data === temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_notequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data !== temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_less = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data < temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_lessequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data <= temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_greater = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data > temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_greaterequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data >= temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_eventvar_exp = function (ret)
	{
		var val = this.eventvar.getValue();
		if (cr.is_number(val))
			ret.set_float(val);
		else
			ret.set_string(val);
	};
	cr.expNode = ExpNode;
	function ExpValue(type, data)
	{
		this.type = type || cr.exptype.Integer;
		this.data = data || 0;
		this.object_class = null;
;
;
;
		if (this.type == cr.exptype.Integer)
			this.data = Math.floor(this.data);
		cr.seal(this);
	};
	ExpValue.prototype.is_int = function ()
	{
		return this.type === cr.exptype.Integer;
	};
	ExpValue.prototype.is_float = function ()
	{
		return this.type === cr.exptype.Float;
	};
	ExpValue.prototype.is_number = function ()
	{
		return this.type === cr.exptype.Integer || this.type === cr.exptype.Float;
	};
	ExpValue.prototype.is_string = function ()
	{
		return this.type === cr.exptype.String;
	};
	ExpValue.prototype.make_int = function ()
	{
		if (!this.is_int())
		{
			if (this.is_float())
				this.data = Math.floor(this.data);      // truncate float
			else if (this.is_string())
				this.data = parseInt(this.data, 10);
			this.type = cr.exptype.Integer;
		}
	};
	ExpValue.prototype.make_float = function ()
	{
		if (!this.is_float())
		{
			if (this.is_string())
				this.data = parseFloat(this.data);
			this.type = cr.exptype.Float;
		}
	};
	ExpValue.prototype.make_string = function ()
	{
		if (!this.is_string())
		{
			this.data = this.data.toString();
			this.type = cr.exptype.String;
		}
	};
	ExpValue.prototype.set_int = function (val)
	{
;
		this.type = cr.exptype.Integer;
		this.data = Math.floor(val);
	};
	ExpValue.prototype.set_float = function (val)
	{
;
		this.type = cr.exptype.Float;
		this.data = val;
	};
	ExpValue.prototype.set_string = function (val)
	{
;
		this.type = cr.exptype.String;
		this.data = val;
	};
	ExpValue.prototype.set_any = function (val)
	{
		if (cr.is_number(val))
		{
			this.type = cr.exptype.Float;
			this.data = val;
		}
		else if (cr.is_string(val))
		{
			this.type = cr.exptype.String;
			this.data = val.toString();
		}
		else
		{
			this.type = cr.exptype.Integer;
			this.data = 0;
		}
	};
	cr.expvalue = ExpValue;
	cr.exptype = {
		Integer: 0,     // emulated; no native integer support in javascript
		Float: 1,
		String: 2
	};
}());
;
cr.system_object = function (runtime)
{
    this.runtime = runtime;
	this.waits = [];
};
cr.system_object.prototype.saveToJSON = function ()
{
	var o = {};
	var i, len, j, lenj, p, w, t, sobj;
	o["waits"] = [];
	var owaits = o["waits"];
	var waitobj;
	for (i = 0, len = this.waits.length; i < len; i++)
	{
		w = this.waits[i];
		waitobj = {
			"t": w.time,
			"st": w.signaltag,
			"s": w.signalled,
			"ev": w.ev.sid,
			"sm": [],
			"sols": {}
		};
		if (w.ev.actions[w.actindex])
			waitobj["act"] = w.ev.actions[w.actindex].sid;
		for (j = 0, lenj = w.solModifiers.length; j < lenj; j++)
			waitobj["sm"].push(w.solModifiers[j].sid);
		for (p in w.sols)
		{
			if (w.sols.hasOwnProperty(p))
			{
				t = this.runtime.types_by_index[parseInt(p, 10)];
;
				sobj = {
					"sa": w.sols[p].sa,
					"insts": []
				};
				for (j = 0, lenj = w.sols[p].insts.length; j < lenj; j++)
					sobj["insts"].push(w.sols[p].insts[j].uid);
				waitobj["sols"][t.sid.toString()] = sobj;
			}
		}
		owaits.push(waitobj);
	}
	return o;
};
cr.system_object.prototype.loadFromJSON = function (o)
{
	var owaits = o["waits"];
	var i, len, j, lenj, p, w, addWait, e, aindex, t, savedsol, nusol, inst;
	cr.clearArray(this.waits);
	for (i = 0, len = owaits.length; i < len; i++)
	{
		w = owaits[i];
		e = this.runtime.blocksBySid[w["ev"].toString()];
		if (!e)
			continue;	// event must've gone missing
		aindex = -1;
		for (j = 0, lenj = e.actions.length; j < lenj; j++)
		{
			if (e.actions[j].sid === w["act"])
			{
				aindex = j;
				break;
			}
		}
		if (aindex === -1)
			continue;	// action must've gone missing
		addWait = {};
		addWait.sols = {};
		addWait.solModifiers = [];
		addWait.deleteme = false;
		addWait.time = w["t"];
		addWait.signaltag = w["st"] || "";
		addWait.signalled = !!w["s"];
		addWait.ev = e;
		addWait.actindex = aindex;
		for (j = 0, lenj = w["sm"].length; j < lenj; j++)
		{
			t = this.runtime.getObjectTypeBySid(w["sm"][j]);
			if (t)
				addWait.solModifiers.push(t);
		}
		for (p in w["sols"])
		{
			if (w["sols"].hasOwnProperty(p))
			{
				t = this.runtime.getObjectTypeBySid(parseInt(p, 10));
				if (!t)
					continue;		// type must've been deleted
				savedsol = w["sols"][p];
				nusol = {
					sa: savedsol["sa"],
					insts: []
				};
				for (j = 0, lenj = savedsol["insts"].length; j < lenj; j++)
				{
					inst = this.runtime.getObjectByUID(savedsol["insts"][j]);
					if (inst)
						nusol.insts.push(inst);
				}
				addWait.sols[t.index.toString()] = nusol;
			}
		}
		this.waits.push(addWait);
	}
};
(function ()
{
	var sysProto = cr.system_object.prototype;
	function SysCnds() {};
    SysCnds.prototype.EveryTick = function()
    {
        return true;
    };
    SysCnds.prototype.OnLayoutStart = function()
    {
        return true;
    };
    SysCnds.prototype.OnLayoutEnd = function()
    {
        return true;
    };
    SysCnds.prototype.Compare = function(x, cmp, y)
    {
        return cr.do_cmp(x, cmp, y);
    };
    SysCnds.prototype.CompareTime = function (cmp, t)
    {
        var elapsed = this.runtime.kahanTime.sum;
        if (cmp === 0)
        {
            var cnd = this.runtime.getCurrentCondition();
            if (!cnd.extra["CompareTime_executed"])
            {
                if (elapsed >= t)
                {
                    cnd.extra["CompareTime_executed"] = true;
                    return true;
                }
            }
            return false;
        }
        return cr.do_cmp(elapsed, cmp, t);
    };
    SysCnds.prototype.LayerVisible = function (layer)
    {
        if (!layer)
            return false;
        else
            return layer.visible;
    };
	SysCnds.prototype.LayerEmpty = function (layer)
    {
        if (!layer)
            return false;
        else
            return !layer.instances.length;
    };
	SysCnds.prototype.LayerCmpOpacity = function (layer, cmp, opacity_)
	{
		if (!layer)
			return false;
		return cr.do_cmp(layer.opacity * 100, cmp, opacity_);
	};
    SysCnds.prototype.Repeat = function (count)
    {
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i;
		if (solModifierAfterCnds)
		{
			for (i = 0; i < count && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			for (i = 0; i < count && !current_loop.stopped; i++)
			{
				current_loop.index = i;
				current_event.retrigger();
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
	SysCnds.prototype.While = function (count)
    {
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i;
		if (solModifierAfterCnds)
		{
			for (i = 0; !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				current_loop.index = i;
				if (!current_event.retrigger())		// one of the other conditions returned false
					current_loop.stopped = true;	// break
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			for (i = 0; !current_loop.stopped; i++)
			{
				current_loop.index = i;
				if (!current_event.retrigger())
					current_loop.stopped = true;
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
    SysCnds.prototype.For = function (name, start, end)
    {
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack(name);
        var i;
		if (end < start)
		{
			if (solModifierAfterCnds)
			{
				for (i = start; i >= end && !current_loop.stopped; --i)  // inclusive to end
				{
					this.runtime.pushCopySol(current_event.solModifiers);
					current_loop.index = i;
					current_event.retrigger();
					this.runtime.popSol(current_event.solModifiers);
				}
			}
			else
			{
				for (i = start; i >= end && !current_loop.stopped; --i)  // inclusive to end
				{
					current_loop.index = i;
					current_event.retrigger();
				}
			}
		}
		else
		{
			if (solModifierAfterCnds)
			{
				for (i = start; i <= end && !current_loop.stopped; ++i)  // inclusive to end
				{
					this.runtime.pushCopySol(current_event.solModifiers);
					current_loop.index = i;
					current_event.retrigger();
					this.runtime.popSol(current_event.solModifiers);
				}
			}
			else
			{
				for (i = start; i <= end && !current_loop.stopped; ++i)  // inclusive to end
				{
					current_loop.index = i;
					current_event.retrigger();
				}
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
	var foreach_instancestack = [];
	var foreach_instanceptr = -1;
    SysCnds.prototype.ForEach = function (obj)
    {
        var sol = obj.getCurrentSol();
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var instances = foreach_instancestack[foreach_instanceptr];
		cr.shallowAssignArray(instances, sol.getObjects());
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i, len, j, lenj, inst, s, sol2;
		var is_contained = obj.is_contained;
		if (solModifierAfterCnds)
		{
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				inst = instances[i];
				sol = obj.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				inst = instances[i];
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
			}
		}
		cr.clearArray(instances);
        this.runtime.popLoopStack();
		foreach_instanceptr--;
		return false;
    };
	function foreach_sortinstances(a, b)
	{
		var va = a.extra["c2_feo_val"];
		var vb = b.extra["c2_feo_val"];
		if (cr.is_number(va) && cr.is_number(vb))
			return va - vb;
		else
		{
			va = "" + va;
			vb = "" + vb;
			if (va < vb)
				return -1;
			else if (va > vb)
				return 1;
			else
				return 0;
		}
	};
	SysCnds.prototype.ForEachOrdered = function (obj, exp, order)
    {
        var sol = obj.getCurrentSol();
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var instances = foreach_instancestack[foreach_instanceptr];
		cr.shallowAssignArray(instances, sol.getObjects());
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var current_condition = this.runtime.getCurrentCondition();
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
		var i, len, j, lenj, inst, s, sol2;
		for (i = 0, len = instances.length; i < len; i++)
		{
			instances[i].extra["c2_feo_val"] = current_condition.parameters[1].get(i);
		}
		instances.sort(foreach_sortinstances);
		if (order === 1)
			instances.reverse();
		var is_contained = obj.is_contained;
		if (solModifierAfterCnds)
		{
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				inst = instances[i];
				sol = obj.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				inst = instances[i];
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
			}
		}
		cr.clearArray(instances);
        this.runtime.popLoopStack();
		foreach_instanceptr--;
		return false;
    };
	SysCnds.prototype.PickByComparison = function (obj_, exp_, cmp_, val_)
	{
		var i, len, k, inst;
		if (!obj_)
			return;
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var tmp_instances = foreach_instancestack[foreach_instanceptr];
		var sol = obj_.getCurrentSol();
		cr.shallowAssignArray(tmp_instances, sol.getObjects());
		if (sol.select_all)
			cr.clearArray(sol.else_instances);
		var current_condition = this.runtime.getCurrentCondition();
		for (i = 0, k = 0, len = tmp_instances.length; i < len; i++)
		{
			inst = tmp_instances[i];
			tmp_instances[k] = inst;
			exp_ = current_condition.parameters[1].get(i);
			val_ = current_condition.parameters[3].get(i);
			if (cr.do_cmp(exp_, cmp_, val_))
			{
				k++;
			}
			else
			{
				sol.else_instances.push(inst);
			}
		}
		cr.truncateArray(tmp_instances, k);
		sol.select_all = false;
		cr.shallowAssignArray(sol.instances, tmp_instances);
		cr.clearArray(tmp_instances);
		foreach_instanceptr--;
		obj_.applySolToContainer();
		return !!sol.instances.length;
	};
	SysCnds.prototype.PickByEvaluate = function (obj_, exp_)
	{
		var i, len, k, inst;
		if (!obj_)
			return;
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var tmp_instances = foreach_instancestack[foreach_instanceptr];
		var sol = obj_.getCurrentSol();
		cr.shallowAssignArray(tmp_instances, sol.getObjects());
		if (sol.select_all)
			cr.clearArray(sol.else_instances);
		var current_condition = this.runtime.getCurrentCondition();
		for (i = 0, k = 0, len = tmp_instances.length; i < len; i++)
		{
			inst = tmp_instances[i];
			tmp_instances[k] = inst;
			exp_ = current_condition.parameters[1].get(i);
			if (exp_)
			{
				k++;
			}
			else
			{
				sol.else_instances.push(inst);
			}
		}
		cr.truncateArray(tmp_instances, k);
		sol.select_all = false;
		cr.shallowAssignArray(sol.instances, tmp_instances);
		cr.clearArray(tmp_instances);
		foreach_instanceptr--;
		obj_.applySolToContainer();
		return !!sol.instances.length;
	};
    SysCnds.prototype.TriggerOnce = function ()
    {
        var cndextra = this.runtime.getCurrentCondition().extra;
		if (typeof cndextra["TriggerOnce_lastTick"] === "undefined")
			cndextra["TriggerOnce_lastTick"] = -1;
        var last_tick = cndextra["TriggerOnce_lastTick"];
        var cur_tick = this.runtime.tickcount;
        cndextra["TriggerOnce_lastTick"] = cur_tick;
        return this.runtime.layout_first_tick || last_tick !== cur_tick - 1;
    };
    SysCnds.prototype.Every = function (seconds)
    {
        var cnd = this.runtime.getCurrentCondition();
        var last_time = cnd.extra["Every_lastTime"] || 0;
        var cur_time = this.runtime.kahanTime.sum;
		if (typeof cnd.extra["Every_seconds"] === "undefined")
			cnd.extra["Every_seconds"] = seconds;
		var this_seconds = cnd.extra["Every_seconds"];
        if (cur_time >= last_time + this_seconds)
        {
            cnd.extra["Every_lastTime"] = last_time + this_seconds;
			if (cur_time >= cnd.extra["Every_lastTime"] + 0.04)
			{
				cnd.extra["Every_lastTime"] = cur_time;
			}
			cnd.extra["Every_seconds"] = seconds;
            return true;
        }
		else if (cur_time < last_time - 0.1)
		{
			cnd.extra["Every_lastTime"] = cur_time;
		}
		return false;
    };
    SysCnds.prototype.PickNth = function (obj, index)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
		index = cr.floor(index);
        if (index < 0 || index >= instances.length)
            return false;
		var inst = instances[index];
        sol.pick_one(inst);
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.PickRandom = function (obj)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
		var index = cr.floor(Math.random() * instances.length);
        if (index >= instances.length)
            return false;
		var inst = instances[index];
        sol.pick_one(inst);
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.CompareVar = function (v, cmp, val)
    {
        return cr.do_cmp(v.getValue(), cmp, val);
    };
    SysCnds.prototype.IsGroupActive = function (group)
    {
		var g = this.runtime.groups_by_name[group.toLowerCase()];
        return g && g.group_active;
    };
	SysCnds.prototype.IsPreview = function ()
	{
		return typeof cr_is_preview !== "undefined";
	};
	SysCnds.prototype.PickAll = function (obj)
    {
        if (!obj)
            return false;
		if (!obj.instances.length)
			return false;
        var sol = obj.getCurrentSol();
        sol.select_all = true;
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.IsMobile = function ()
	{
		return this.runtime.isMobile;
	};
	SysCnds.prototype.CompareBetween = function (x, a, b)
	{
		return x >= a && x <= b;
	};
	SysCnds.prototype.Else = function ()
	{
		var current_frame = this.runtime.getCurrentEventStack();
		if (current_frame.else_branch_ran)
			return false;		// another event in this else-if chain has run
		else
			return !current_frame.last_event_true;
		/*
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var prev_event = current_event.prev_block;
		if (!prev_event)
			return false;
		if (prev_event.is_logical)
			return !this.runtime.last_event_true;
		var i, len, j, lenj, s, sol, temp, inst, any_picked = false;
		for (i = 0, len = prev_event.cndReferences.length; i < len; i++)
		{
			s = prev_event.cndReferences[i];
			sol = s.getCurrentSol();
			if (sol.select_all || sol.instances.length === s.instances.length)
			{
				sol.select_all = false;
				sol.instances.length = 0;
			}
			else
			{
				if (sol.instances.length === 1 && sol.else_instances.length === 0 && s.instances.length >= 2)
				{
					inst = sol.instances[0];
					sol.instances.length = 0;
					for (j = 0, lenj = s.instances.length; j < lenj; j++)
					{
						if (s.instances[j] != inst)
							sol.instances.push(s.instances[j]);
					}
					any_picked = true;
				}
				else
				{
					temp = sol.instances;
					sol.instances = sol.else_instances;
					sol.else_instances = temp;
					any_picked = true;
				}
			}
		}
		return any_picked;
		*/
	};
	SysCnds.prototype.OnLoadFinished = function ()
	{
		return true;
	};
	SysCnds.prototype.OnCanvasSnapshot = function ()
	{
		return true;
	};
	SysCnds.prototype.EffectsSupported = function ()
	{
		return !!this.runtime.glwrap;
	};
	SysCnds.prototype.OnSaveComplete = function ()
	{
		return true;
	};
	SysCnds.prototype.OnSaveFailed = function ()
	{
		return true;
	};
	SysCnds.prototype.OnLoadComplete = function ()
	{
		return true;
	};
	SysCnds.prototype.OnLoadFailed = function ()
	{
		return true;
	};
	SysCnds.prototype.ObjectUIDExists = function (u)
	{
		return !!this.runtime.getObjectByUID(u);
	};
	SysCnds.prototype.IsOnPlatform = function (p)
	{
		var rt = this.runtime;
		switch (p) {
		case 0:		// HTML5 website
			return !rt.isDomFree && !rt.isNodeWebkit && !rt.isCordova && !rt.isWinJS && !rt.isWindowsPhone8 && !rt.isBlackberry10 && !rt.isAmazonWebApp;
		case 1:		// iOS
			return rt.isiOS;
		case 2:		// Android
			return rt.isAndroid;
		case 3:		// Windows 8
			return rt.isWindows8App;
		case 4:		// Windows Phone 8
			return rt.isWindowsPhone8;
		case 5:		// Blackberry 10
			return rt.isBlackberry10;
		case 6:		// Tizen
			return rt.isTizen;
		case 7:		// CocoonJS
			return rt.isCocoonJs;
		case 8:		// Cordova
			return rt.isCordova;
		case 9:	// Scirra Arcade
			return rt.isArcade;
		case 10:	// node-webkit
			return rt.isNodeWebkit;
		case 11:	// crosswalk
			return rt.isCrosswalk;
		case 12:	// amazon webapp
			return rt.isAmazonWebApp;
		case 13:	// windows 10 app
			return rt.isWindows10;
		default:	// should not be possible
			return false;
		}
	};
	var cacheRegex = null;
	var lastRegex = "";
	var lastFlags = "";
	function getRegex(regex_, flags_)
	{
		if (!cacheRegex || regex_ !== lastRegex || flags_ !== lastFlags)
		{
			cacheRegex = new RegExp(regex_, flags_);
			lastRegex = regex_;
			lastFlags = flags_;
		}
		cacheRegex.lastIndex = 0;		// reset
		return cacheRegex;
	};
	SysCnds.prototype.RegexTest = function (str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		return regex.test(str_);
	};
	var tmp_arr = [];
	SysCnds.prototype.PickOverlappingPoint = function (obj_, x_, y_)
	{
		if (!obj_)
            return false;
        var sol = obj_.getCurrentSol();
        var instances = sol.getObjects();
		var current_event = this.runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		var cnd = this.runtime.getCurrentCondition();
		var i, len, inst, pick;
		if (sol.select_all)
		{
			cr.shallowAssignArray(tmp_arr, instances);
			cr.clearArray(sol.else_instances);
			sol.select_all = false;
			cr.clearArray(sol.instances);
		}
		else
		{
			if (orblock)
			{
				cr.shallowAssignArray(tmp_arr, sol.else_instances);
				cr.clearArray(sol.else_instances);
			}
			else
			{
				cr.shallowAssignArray(tmp_arr, instances);
				cr.clearArray(sol.instances);
			}
		}
		for (i = 0, len = tmp_arr.length; i < len; ++i)
		{
			inst = tmp_arr[i];
			inst.update_bbox();
			pick = cr.xor(inst.contains_pt(x_, y_), cnd.inverted);
			if (pick)
				sol.instances.push(inst);
			else
				sol.else_instances.push(inst);
		}
		obj_.applySolToContainer();
		return cr.xor(!!sol.instances.length, cnd.inverted);
	};
	SysCnds.prototype.IsNaN = function (n)
	{
		return !!isNaN(n);
	};
	SysCnds.prototype.AngleWithin = function (a1, within, a2)
	{
		return cr.angleDiff(cr.to_radians(a1), cr.to_radians(a2)) <= cr.to_radians(within);
	};
	SysCnds.prototype.IsClockwiseFrom = function (a1, a2)
	{
		return cr.angleClockwise(cr.to_radians(a1), cr.to_radians(a2));
	};
	SysCnds.prototype.IsBetweenAngles = function (a, la, ua)
	{
		var angle = cr.to_clamped_radians(a);
		var lower = cr.to_clamped_radians(la);
		var upper = cr.to_clamped_radians(ua);
		var obtuse = (!cr.angleClockwise(upper, lower));
		if (obtuse)
			return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
		else
			return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
	};
	SysCnds.prototype.IsValueType = function (x, t)
	{
		if (typeof x === "number")
			return t === 0;
		else		// string
			return t === 1;
	};
	sysProto.cnds = new SysCnds();
    function SysActs() {};
    SysActs.prototype.GoToLayout = function (to)
    {
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
;
        this.runtime.changelayout = to;
    };
	SysActs.prototype.NextPrevLayout = function (prev)
    {
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
		var index = this.runtime.layouts_by_index.indexOf(this.runtime.running_layout);
		if (prev && index === 0)
			return;		// cannot go to previous layout from first layout
		if (!prev && index === this.runtime.layouts_by_index.length - 1)
			return;		// cannot go to next layout from last layout
		var to = this.runtime.layouts_by_index[index + (prev ? -1 : 1)];
;
        this.runtime.changelayout = to;
    };
    SysActs.prototype.CreateObject = function (obj, layer, x, y)
    {
        if (!layer || !obj)
            return;
        var inst = this.runtime.createInstance(obj, layer, x, y);
		if (!inst)
			return;
		this.runtime.isInOnDestroy++;
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
        var sol = obj.getCurrentSol();
        sol.select_all = false;
		cr.clearArray(sol.instances);
		sol.instances[0] = inst;
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				sol = s.type.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = s;
			}
		}
    };
    SysActs.prototype.SetLayerVisible = function (layer, visible_)
    {
        if (!layer)
            return;
		if (layer.visible !== visible_)
		{
			layer.visible = visible_;
			this.runtime.redraw = true;
		}
    };
	SysActs.prototype.SetLayerOpacity = function (layer, opacity_)
	{
		if (!layer)
			return;
		opacity_ = cr.clamp(opacity_ / 100, 0, 1);
		if (layer.opacity !== opacity_)
		{
			layer.opacity = opacity_;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayerScaleRate = function (layer, sr)
	{
		if (!layer)
			return;
		if (layer.zoomRate !== sr)
		{
			layer.zoomRate = sr;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayerForceOwnTexture = function (layer, f)
	{
		if (!layer)
			return;
		f = !!f;
		if (layer.forceOwnTexture !== f)
		{
			layer.forceOwnTexture = f;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayoutScale = function (s)
	{
		if (!this.runtime.running_layout)
			return;
		if (this.runtime.running_layout.scale !== s)
		{
			this.runtime.running_layout.scale = s;
			this.runtime.running_layout.boundScrolling();
			this.runtime.redraw = true;
		}
	};
    SysActs.prototype.ScrollX = function(x)
    {
        this.runtime.running_layout.scrollToX(x);
    };
    SysActs.prototype.ScrollY = function(y)
    {
        this.runtime.running_layout.scrollToY(y);
    };
    SysActs.prototype.Scroll = function(x, y)
    {
        this.runtime.running_layout.scrollToX(x);
        this.runtime.running_layout.scrollToY(y);
    };
    SysActs.prototype.ScrollToObject = function(obj)
    {
        var inst = obj.getFirstPicked();
        if (inst)
        {
            this.runtime.running_layout.scrollToX(inst.x);
            this.runtime.running_layout.scrollToY(inst.y);
        }
    };
	SysActs.prototype.SetVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(x);
			else
				v.setValue(parseFloat(x));
		}
		else if (v.vartype === 1)
			v.setValue(x.toString());
	};
	SysActs.prototype.AddVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(v.getValue() + x);
			else
				v.setValue(v.getValue() + parseFloat(x));
		}
		else if (v.vartype === 1)
			v.setValue(v.getValue() + x.toString());
	};
	SysActs.prototype.SubVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(v.getValue() - x);
			else
				v.setValue(v.getValue() - parseFloat(x));
		}
	};
    SysActs.prototype.SetGroupActive = function (group, active)
    {
		var g = this.runtime.groups_by_name[group.toLowerCase()];
		if (!g)
			return;
		switch (active) {
		case 0:
			g.setGroupActive(false);
			break;
		case 1:
			g.setGroupActive(true);
			break;
		case 2:
			g.setGroupActive(!g.group_active);
			break;
		}
    };
    SysActs.prototype.SetTimescale = function (ts_)
    {
        var ts = ts_;
        if (ts < 0)
            ts = 0;
        this.runtime.timescale = ts;
    };
    SysActs.prototype.SetObjectTimescale = function (obj, ts_)
    {
        var ts = ts_;
        if (ts < 0)
            ts = 0;
        if (!obj)
            return;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
        var i, len;
        for (i = 0, len = instances.length; i < len; i++)
        {
            instances[i].my_timescale = ts;
        }
    };
    SysActs.prototype.RestoreObjectTimescale = function (obj)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
        var i, len;
        for (i = 0, len = instances.length; i < len; i++)
        {
            instances[i].my_timescale = -1.0;
        }
    };
	var waitobjrecycle = [];
	function allocWaitObject()
	{
		var w;
		if (waitobjrecycle.length)
			w = waitobjrecycle.pop();
		else
		{
			w = {};
			w.sols = {};
			w.solModifiers = [];
		}
		w.deleteme = false;
		return w;
	};
	function freeWaitObject(w)
	{
		cr.wipe(w.sols);
		cr.clearArray(w.solModifiers);
		waitobjrecycle.push(w);
	};
	var solstateobjects = [];
	function allocSolStateObject()
	{
		var s;
		if (solstateobjects.length)
			s = solstateobjects.pop();
		else
		{
			s = {};
			s.insts = [];
		}
		s.sa = false;
		return s;
	};
	function freeSolStateObject(s)
	{
		cr.clearArray(s.insts);
		solstateobjects.push(s);
	};
	SysActs.prototype.Wait = function (seconds)
	{
		if (seconds < 0)
			return;
		var i, len, s, t, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		var waitobj = allocWaitObject();
		waitobj.time = this.runtime.kahanTime.sum + seconds;
		waitobj.signaltag = "";
		waitobj.signalled = false;
		waitobj.ev = evinfo.current_event;
		waitobj.actindex = evinfo.actindex + 1;	// pointing at next action
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			t = this.runtime.types_by_index[i];
			s = t.getCurrentSol();
			if (s.select_all && evinfo.current_event.solModifiers.indexOf(t) === -1)
				continue;
			waitobj.solModifiers.push(t);
			ss = allocSolStateObject();
			ss.sa = s.select_all;
			cr.shallowAssignArray(ss.insts, s.instances);
			waitobj.sols[i.toString()] = ss;
		}
		this.waits.push(waitobj);
		return true;
	};
	SysActs.prototype.WaitForSignal = function (tag)
	{
		var i, len, s, t, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		var waitobj = allocWaitObject();
		waitobj.time = -1;
		waitobj.signaltag = tag.toLowerCase();
		waitobj.signalled = false;
		waitobj.ev = evinfo.current_event;
		waitobj.actindex = evinfo.actindex + 1;	// pointing at next action
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			t = this.runtime.types_by_index[i];
			s = t.getCurrentSol();
			if (s.select_all && evinfo.current_event.solModifiers.indexOf(t) === -1)
				continue;
			waitobj.solModifiers.push(t);
			ss = allocSolStateObject();
			ss.sa = s.select_all;
			cr.shallowAssignArray(ss.insts, s.instances);
			waitobj.sols[i.toString()] = ss;
		}
		this.waits.push(waitobj);
		return true;
	};
	SysActs.prototype.Signal = function (tag)
	{
		var lowertag = tag.toLowerCase();
		var i, len, w;
		for (i = 0, len = this.waits.length; i < len; ++i)
		{
			w = this.waits[i];
			if (w.time !== -1)
				continue;					// timer wait, ignore
			if (w.signaltag === lowertag)	// waiting for this signal
				w.signalled = true;			// will run on next check
		}
	};
	SysActs.prototype.SetLayerScale = function (layer, scale)
    {
        if (!layer)
            return;
		if (layer.scale === scale)
			return;
        layer.scale = scale;
        this.runtime.redraw = true;
    };
	SysActs.prototype.ResetGlobals = function ()
	{
		var i, len, g;
		for (i = 0, len = this.runtime.all_global_vars.length; i < len; i++)
		{
			g = this.runtime.all_global_vars[i];
			g.data = g.initial;
		}
	};
	SysActs.prototype.SetLayoutAngle = function (a)
	{
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (this.runtime.running_layout)
		{
			if (this.runtime.running_layout.angle !== a)
			{
				this.runtime.running_layout.angle = a;
				this.runtime.redraw = true;
			}
		}
	};
	SysActs.prototype.SetLayerAngle = function (layer, a)
    {
        if (!layer)
            return;
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (layer.angle === a)
			return;
        layer.angle = a;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerParallax = function (layer, px, py)
    {
        if (!layer)
            return;
		if (layer.parallaxX === px / 100 && layer.parallaxY === py / 100)
			return;
        layer.parallaxX = px / 100;
		layer.parallaxY = py / 100;
		if (layer.parallaxX !== 1 || layer.parallaxY !== 1)
		{
			var i, len, instances = layer.instances;
			for (i = 0, len = instances.length; i < len; ++i)
			{
				instances[i].type.any_instance_parallaxed = true;
			}
		}
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerBackground = function (layer, c)
    {
        if (!layer)
            return;
		var r = cr.GetRValue(c);
		var g = cr.GetGValue(c);
		var b = cr.GetBValue(c);
		if (layer.background_color[0] === r && layer.background_color[1] === g && layer.background_color[2] === b)
			return;
        layer.background_color[0] = r;
		layer.background_color[1] = g;
		layer.background_color[2] = b;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerTransparent = function (layer, t)
    {
        if (!layer)
            return;
		if (!!t === !!layer.transparent)
			return;
		layer.transparent = !!t;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerBlendMode = function (layer, bm)
    {
        if (!layer)
            return;
		if (layer.blend_mode === bm)
			return;
		layer.blend_mode = bm;
		layer.compositeOp = cr.effectToCompositeOp(layer.blend_mode);
		if (this.runtime.gl)
			cr.setGLBlend(layer, layer.blend_mode, this.runtime.gl);
        this.runtime.redraw = true;
    };
	SysActs.prototype.StopLoop = function ()
	{
		if (this.runtime.loop_stack_index < 0)
			return;		// no loop currently running
		this.runtime.getCurrentLoop().stopped = true;
	};
	SysActs.prototype.GoToLayoutByName = function (layoutname)
	{
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to different layout
;
		var l;
		for (l in this.runtime.layouts)
		{
			if (this.runtime.layouts.hasOwnProperty(l) && cr.equals_nocase(l, layoutname))
			{
				this.runtime.changelayout = this.runtime.layouts[l];
				return;
			}
		}
	};
	SysActs.prototype.RestartLayout = function (layoutname)
	{
		if (this.runtime.isloading)
			return;		// cannot restart loader layouts
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
;
		if (!this.runtime.running_layout)
			return;
		this.runtime.changelayout = this.runtime.running_layout;
		var i, len, g;
		for (i = 0, len = this.runtime.allGroups.length; i < len; i++)
		{
			g = this.runtime.allGroups[i];
			g.setGroupActive(g.initially_activated);
		}
	};
	SysActs.prototype.SnapshotCanvas = function (format_, quality_)
	{
		this.runtime.doCanvasSnapshot(format_ === 0 ? "image/png" : "image/jpeg", quality_ / 100);
	};
	SysActs.prototype.SetCanvasSize = function (w, h)
	{
		if (w <= 0 || h <= 0)
			return;
		var mode = this.runtime.fullscreen_mode;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.runtime.isNodeFullscreen);
		if (isfullscreen && this.runtime.fullscreen_scaling > 0)
			mode = this.runtime.fullscreen_scaling;
		if (mode === 0)
		{
			this.runtime["setSize"](w, h, true);
		}
		else
		{
			this.runtime.original_width = w;
			this.runtime.original_height = h;
			this.runtime["setSize"](this.runtime.lastWindowWidth, this.runtime.lastWindowHeight, true);
		}
	};
	SysActs.prototype.SetLayoutEffectEnabled = function (enable_, effectname_)
	{
		if (!this.runtime.running_layout || !this.runtime.glwrap)
			return;
		var et = this.runtime.running_layout.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var enable = (enable_ === 1);
		if (et.active == enable)
			return;		// no change
		et.active = enable;
		this.runtime.running_layout.updateActiveEffects();
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayerEffectEnabled = function (layer, enable_, effectname_)
	{
		if (!layer || !this.runtime.glwrap)
			return;
		var et = layer.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var enable = (enable_ === 1);
		if (et.active == enable)
			return;		// no change
		et.active = enable;
		layer.updateActiveEffects();
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayoutEffectParam = function (effectname_, index_, value_)
	{
		if (!this.runtime.running_layout || !this.runtime.glwrap)
			return;
		var et = this.runtime.running_layout.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var params = this.runtime.running_layout.effect_params[et.index];
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= params.length)
			return;		// effect index out of bounds
		if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
			value_ /= 100.0;
		if (params[index_] === value_)
			return;		// no change
		params[index_] = value_;
		if (et.active)
			this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayerEffectParam = function (layer, effectname_, index_, value_)
	{
		if (!layer || !this.runtime.glwrap)
			return;
		var et = layer.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var params = layer.effect_params[et.index];
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= params.length)
			return;		// effect index out of bounds
		if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
			value_ /= 100.0;
		if (params[index_] === value_)
			return;		// no change
		params[index_] = value_;
		if (et.active)
			this.runtime.redraw = true;
	};
	SysActs.prototype.SaveState = function (slot_)
	{
		this.runtime.saveToSlot = slot_;
	};
	SysActs.prototype.LoadState = function (slot_)
	{
		this.runtime.loadFromSlot = slot_;
	};
	SysActs.prototype.LoadStateJSON = function (jsonstr_)
	{
		this.runtime.loadFromJson = jsonstr_;
	};
	SysActs.prototype.SetHalfFramerateMode = function (set_)
	{
		this.runtime.halfFramerateMode = (set_ !== 0);
	};
	SysActs.prototype.SetFullscreenQuality = function (q)
	{
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen);
		if (!isfullscreen && this.runtime.fullscreen_mode === 0)
			return;
		this.runtime.wantFullscreenScalingQuality = (q !== 0);
		this.runtime["setSize"](this.runtime.lastWindowWidth, this.runtime.lastWindowHeight, true);
	};
	SysActs.prototype.ResetPersisted = function ()
	{
		var i, len;
		for (i = 0, len = this.runtime.layouts_by_index.length; i < len; ++i)
		{
			this.runtime.layouts_by_index[i].persist_data = {};
			this.runtime.layouts_by_index[i].first_visit = true;
		}
	};
	SysActs.prototype.RecreateInitialObjects = function (obj, x1, y1, x2, y2)
	{
		if (!obj)
			return;
		this.runtime.running_layout.recreateInitialObjects(obj, x1, y1, x2, y2);
	};
	SysActs.prototype.SetPixelRounding = function (m)
	{
		this.runtime.pixel_rounding = (m !== 0);
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetMinimumFramerate = function (f)
	{
		if (f < 1)
			f = 1;
		if (f > 120)
			f = 120;
		this.runtime.minimumFramerate = f;
	};
	function SortZOrderList(a, b)
	{
		var layerA = a[0];
		var layerB = b[0];
		var diff = layerA - layerB;
		if (diff !== 0)
			return diff;
		var indexA = a[1];
		var indexB = b[1];
		return indexA - indexB;
	};
	function SortInstancesByValue(a, b)
	{
		return a[1] - b[1];
	};
	SysActs.prototype.SortZOrderByInstVar = function (obj, iv)
	{
		if (!obj)
			return;
		var i, len, inst, value, r, layer, toZ;
		var sol = obj.getCurrentSol();
		var pickedInstances = sol.getObjects();
		var zOrderList = [];
		var instValues = [];
		var layout = this.runtime.running_layout;
		var isFamily = obj.is_family;
		var familyIndex = obj.family_index;
		for (i = 0, len = pickedInstances.length; i < len; ++i)
		{
			inst = pickedInstances[i];
			if (!inst.layer)
				continue;		// not a world instance
			if (isFamily)
				value = inst.instance_vars[iv + inst.type.family_var_map[familyIndex]];
			else
				value = inst.instance_vars[iv];
			zOrderList.push([
				inst.layer.index,
				inst.get_zindex()
			]);
			instValues.push([
				inst,
				value
			]);
		}
		if (!zOrderList.length)
			return;				// no instances were world instances
		zOrderList.sort(SortZOrderList);
		instValues.sort(SortInstancesByValue);
		for (i = 0, len = zOrderList.length; i < len; ++i)
		{
			inst = instValues[i][0];					// instance in the order we want
			layer = layout.layers[zOrderList[i][0]];	// layer to put it on
			toZ = zOrderList[i][1];						// Z index on that layer to put it
			if (layer.instances[toZ] !== inst)			// not already got this instance there
			{
				layer.instances[toZ] = inst;			// update instance
				inst.layer = layer;						// update instance's layer reference (could have changed)
				layer.setZIndicesStaleFrom(toZ);		// mark Z indices stale from this point since they have changed
			}
		}
	};
	sysProto.acts = new SysActs();
    function SysExps() {};
    SysExps.prototype["int"] = function(ret, x)
    {
        if (cr.is_string(x))
        {
            ret.set_int(parseInt(x, 10));
            if (isNaN(ret.data))
                ret.data = 0;
        }
        else
            ret.set_int(x);
    };
    SysExps.prototype["float"] = function(ret, x)
    {
        if (cr.is_string(x))
        {
            ret.set_float(parseFloat(x));
            if (isNaN(ret.data))
                ret.data = 0;
        }
        else
            ret.set_float(x);
    };
    SysExps.prototype.str = function(ret, x)
    {
        if (cr.is_string(x))
            ret.set_string(x);
        else
            ret.set_string(x.toString());
    };
    SysExps.prototype.len = function(ret, x)
    {
        ret.set_int(x.length || 0);
    };
    SysExps.prototype.random = function (ret, a, b)
    {
        if (b === undefined)
        {
            ret.set_float(Math.random() * a);
        }
        else
        {
            ret.set_float(Math.random() * (b - a) + a);
        }
    };
    SysExps.prototype.sqrt = function(ret, x)
    {
        ret.set_float(Math.sqrt(x));
    };
    SysExps.prototype.abs = function(ret, x)
    {
        ret.set_float(Math.abs(x));
    };
    SysExps.prototype.round = function(ret, x)
    {
        ret.set_int(Math.round(x));
    };
    SysExps.prototype.floor = function(ret, x)
    {
        ret.set_int(Math.floor(x));
    };
    SysExps.prototype.ceil = function(ret, x)
    {
        ret.set_int(Math.ceil(x));
    };
    SysExps.prototype.sin = function(ret, x)
    {
        ret.set_float(Math.sin(cr.to_radians(x)));
    };
    SysExps.prototype.cos = function(ret, x)
    {
        ret.set_float(Math.cos(cr.to_radians(x)));
    };
    SysExps.prototype.tan = function(ret, x)
    {
        ret.set_float(Math.tan(cr.to_radians(x)));
    };
    SysExps.prototype.asin = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.asin(x)));
    };
    SysExps.prototype.acos = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.acos(x)));
    };
    SysExps.prototype.atan = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.atan(x)));
    };
    SysExps.prototype.exp = function(ret, x)
    {
        ret.set_float(Math.exp(x));
    };
    SysExps.prototype.ln = function(ret, x)
    {
        ret.set_float(Math.log(x));
    };
    SysExps.prototype.log10 = function(ret, x)
    {
        ret.set_float(Math.log(x) / Math.LN10);
    };
    SysExps.prototype.max = function(ret)
    {
		var max_ = arguments[1];
		if (typeof max_ !== "number")
			max_ = 0;
		var i, len, a;
		for (i = 2, len = arguments.length; i < len; i++)
		{
			a = arguments[i];
			if (typeof a !== "number")
				continue;		// ignore non-numeric types
			if (max_ < a)
				max_ = a;
		}
		ret.set_float(max_);
    };
    SysExps.prototype.min = function(ret)
    {
        var min_ = arguments[1];
		if (typeof min_ !== "number")
			min_ = 0;
		var i, len, a;
		for (i = 2, len = arguments.length; i < len; i++)
		{
			a = arguments[i];
			if (typeof a !== "number")
				continue;		// ignore non-numeric types
			if (min_ > a)
				min_ = a;
		}
		ret.set_float(min_);
    };
    SysExps.prototype.dt = function(ret)
    {
        ret.set_float(this.runtime.dt);
    };
    SysExps.prototype.timescale = function(ret)
    {
        ret.set_float(this.runtime.timescale);
    };
    SysExps.prototype.wallclocktime = function(ret)
    {
        ret.set_float((Date.now() - this.runtime.start_time) / 1000.0);
    };
    SysExps.prototype.time = function(ret)
    {
        ret.set_float(this.runtime.kahanTime.sum);
    };
    SysExps.prototype.tickcount = function(ret)
    {
        ret.set_int(this.runtime.tickcount);
    };
    SysExps.prototype.objectcount = function(ret)
    {
        ret.set_int(this.runtime.objectcount);
    };
    SysExps.prototype.fps = function(ret)
    {
        ret.set_int(this.runtime.fps);
    };
    SysExps.prototype.loopindex = function(ret, name_)
    {
		var loop, i, len;
        if (!this.runtime.loop_stack.length)
        {
            ret.set_int(0);
            return;
        }
        if (name_)
        {
            for (i = this.runtime.loop_stack_index; i >= 0; --i)
            {
                loop = this.runtime.loop_stack[i];
                if (loop.name === name_)
                {
                    ret.set_int(loop.index);
                    return;
                }
            }
            ret.set_int(0);
        }
        else
        {
			loop = this.runtime.getCurrentLoop();
			ret.set_int(loop ? loop.index : -1);
        }
    };
    SysExps.prototype.distance = function(ret, x1, y1, x2, y2)
    {
        ret.set_float(cr.distanceTo(x1, y1, x2, y2));
    };
    SysExps.prototype.angle = function(ret, x1, y1, x2, y2)
    {
        ret.set_float(cr.to_degrees(cr.angleTo(x1, y1, x2, y2)));
    };
    SysExps.prototype.scrollx = function(ret)
    {
        ret.set_float(this.runtime.running_layout.scrollX);
    };
    SysExps.prototype.scrolly = function(ret)
    {
        ret.set_float(this.runtime.running_layout.scrollY);
    };
    SysExps.prototype.newline = function(ret)
    {
        ret.set_string("\n");
    };
    SysExps.prototype.lerp = function(ret, a, b, x)
    {
        ret.set_float(cr.lerp(a, b, x));
    };
	SysExps.prototype.qarp = function(ret, a, b, c, x)
    {
        ret.set_float(cr.qarp(a, b, c, x));
    };
	SysExps.prototype.cubic = function(ret, a, b, c, d, x)
    {
        ret.set_float(cr.cubic(a, b, c, d, x));
    };
	SysExps.prototype.cosp = function(ret, a, b, x)
    {
        ret.set_float(cr.cosp(a, b, x));
    };
    SysExps.prototype.windowwidth = function(ret)
    {
        ret.set_int(this.runtime.width);
    };
    SysExps.prototype.windowheight = function(ret)
    {
        ret.set_int(this.runtime.height);
    };
	SysExps.prototype.uppercase = function(ret, str)
	{
		ret.set_string(cr.is_string(str) ? str.toUpperCase() : "");
	};
	SysExps.prototype.lowercase = function(ret, str)
	{
		ret.set_string(cr.is_string(str) ? str.toLowerCase() : "");
	};
	SysExps.prototype.clamp = function(ret, x, l, u)
	{
		if (x < l)
			ret.set_float(l);
		else if (x > u)
			ret.set_float(u);
		else
			ret.set_float(x);
	};
	SysExps.prototype.layerscale = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.scale);
	};
	SysExps.prototype.layeropacity = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.opacity * 100);
	};
	SysExps.prototype.layerscalerate = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.zoomRate);
	};
	SysExps.prototype.layerparallaxx = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.parallaxX * 100);
	};
	SysExps.prototype.layerparallaxy = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.parallaxY * 100);
	};
	SysExps.prototype.layerindex = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_int(-1);
		else
			ret.set_int(layer.index);
	};
	SysExps.prototype.layoutscale = function (ret)
	{
		if (this.runtime.running_layout)
			ret.set_float(this.runtime.running_layout.scale);
		else
			ret.set_float(0);
	};
	SysExps.prototype.layoutangle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.runtime.running_layout.angle));
	};
	SysExps.prototype.layerangle = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(cr.to_degrees(layer.angle));
	};
	SysExps.prototype.layoutwidth = function (ret)
	{
		ret.set_int(this.runtime.running_layout.width);
	};
	SysExps.prototype.layoutheight = function (ret)
	{
		ret.set_int(this.runtime.running_layout.height);
	};
	SysExps.prototype.find = function (ret, text, searchstr)
	{
		if (cr.is_string(text) && cr.is_string(searchstr))
			ret.set_int(text.search(new RegExp(cr.regexp_escape(searchstr), "i")));
		else
			ret.set_int(-1);
	};
	SysExps.prototype.findcase = function (ret, text, searchstr)
	{
		if (cr.is_string(text) && cr.is_string(searchstr))
			ret.set_int(text.search(new RegExp(cr.regexp_escape(searchstr), "")));
		else
			ret.set_int(-1);
	};
	SysExps.prototype.left = function (ret, text, n)
	{
		ret.set_string(cr.is_string(text) ? text.substr(0, n) : "");
	};
	SysExps.prototype.right = function (ret, text, n)
	{
		ret.set_string(cr.is_string(text) ? text.substr(text.length - n) : "");
	};
	SysExps.prototype.mid = function (ret, text, index_, length_)
	{
		ret.set_string(cr.is_string(text) ? text.substr(index_, length_) : "");
	};
	SysExps.prototype.tokenat = function (ret, text, index_, sep)
	{
		if (cr.is_string(text) && cr.is_string(sep))
		{
			var arr = text.split(sep);
			var i = cr.floor(index_);
			if (i < 0 || i >= arr.length)
				ret.set_string("");
			else
				ret.set_string(arr[i]);
		}
		else
			ret.set_string("");
	};
	SysExps.prototype.tokencount = function (ret, text, sep)
	{
		if (cr.is_string(text) && text.length)
			ret.set_int(text.split(sep).length);
		else
			ret.set_int(0);
	};
	SysExps.prototype.replace = function (ret, text, find_, replace_)
	{
		if (cr.is_string(text) && cr.is_string(find_) && cr.is_string(replace_))
			ret.set_string(text.replace(new RegExp(cr.regexp_escape(find_), "gi"), replace_));
		else
			ret.set_string(cr.is_string(text) ? text : "");
	};
	SysExps.prototype.trim = function (ret, text)
	{
		ret.set_string(cr.is_string(text) ? text.trim() : "");
	};
	SysExps.prototype.pi = function (ret)
	{
		ret.set_float(cr.PI);
	};
	SysExps.prototype.layoutname = function (ret)
	{
		if (this.runtime.running_layout)
			ret.set_string(this.runtime.running_layout.name);
		else
			ret.set_string("");
	};
	SysExps.prototype.renderer = function (ret)
	{
		ret.set_string(this.runtime.gl ? "webgl" : "canvas2d");
	};
	SysExps.prototype.rendererdetail = function (ret)
	{
		ret.set_string(this.runtime.glUnmaskedRenderer);
	};
	SysExps.prototype.anglediff = function (ret, a, b)
	{
		ret.set_float(cr.to_degrees(cr.angleDiff(cr.to_radians(a), cr.to_radians(b))));
	};
	SysExps.prototype.choose = function (ret)
	{
		var index = cr.floor(Math.random() * (arguments.length - 1));
		ret.set_any(arguments[index + 1]);
	};
	SysExps.prototype.rgb = function (ret, r, g, b)
	{
		ret.set_int(cr.RGB(r, g, b));
	};
	SysExps.prototype.projectversion = function (ret)
	{
		ret.set_string(this.runtime.versionstr);
	};
	SysExps.prototype.projectname = function (ret)
	{
		ret.set_string(this.runtime.projectName);
	};
	SysExps.prototype.anglelerp = function (ret, a, b, x)
	{
		a = cr.to_radians(a);
		b = cr.to_radians(b);
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			ret.set_float(cr.to_clamped_degrees(a + diff * x));
		}
		else
		{
			ret.set_float(cr.to_clamped_degrees(a - diff * x));
		}
	};
	SysExps.prototype.anglerotate = function (ret, a, b, c)
	{
		a = cr.to_radians(a);
		b = cr.to_radians(b);
		c = cr.to_radians(c);
		ret.set_float(cr.to_clamped_degrees(cr.angleRotate(a, b, c)));
	};
	SysExps.prototype.zeropad = function (ret, n, d)
	{
		var s = (n < 0 ? "-" : "");
		if (n < 0) n = -n;
		var zeroes = d - n.toString().length;
		for (var i = 0; i < zeroes; i++)
			s += "0";
		ret.set_string(s + n.toString());
	};
	SysExps.prototype.cpuutilisation = function (ret)
	{
		ret.set_float(this.runtime.cpuutilisation / 1000);
	};
	SysExps.prototype.viewportleft = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewLeft : 0);
	};
	SysExps.prototype.viewporttop = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewTop : 0);
	};
	SysExps.prototype.viewportright = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewRight : 0);
	};
	SysExps.prototype.viewportbottom = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewBottom : 0);
	};
	SysExps.prototype.loadingprogress = function (ret)
	{
		ret.set_float(this.runtime.loadingprogress);
	};
	SysExps.prototype.unlerp = function(ret, a, b, y)
    {
        ret.set_float(cr.unlerp(a, b, y));
    };
	SysExps.prototype.canvassnapshot = function (ret)
	{
		ret.set_string(this.runtime.snapshotData);
	};
	SysExps.prototype.urlencode = function (ret, s)
	{
		ret.set_string(encodeURIComponent(s));
	};
	SysExps.prototype.urldecode = function (ret, s)
	{
		ret.set_string(decodeURIComponent(s));
	};
	SysExps.prototype.canvastolayerx = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.canvasToLayer(x, y, true) : 0);
	};
	SysExps.prototype.canvastolayery = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.canvasToLayer(x, y, false) : 0);
	};
	SysExps.prototype.layertocanvasx = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.layerToCanvas(x, y, true) : 0);
	};
	SysExps.prototype.layertocanvasy = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.layerToCanvas(x, y, false) : 0);
	};
	SysExps.prototype.savestatejson = function (ret)
	{
		ret.set_string(this.runtime.lastSaveJson);
	};
	SysExps.prototype.imagememoryusage = function (ret)
	{
		if (this.runtime.glwrap)
			ret.set_float(Math.round(100 * this.runtime.glwrap.estimateVRAM() / (1024 * 1024)) / 100);
		else
			ret.set_float(0);
	};
	SysExps.prototype.regexsearch = function (ret, str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		ret.set_int(str_ ? str_.search(regex) : -1);
	};
	SysExps.prototype.regexreplace = function (ret, str_, regex_, flags_, replace_)
	{
		var regex = getRegex(regex_, flags_);
		ret.set_string(str_ ? str_.replace(regex, replace_) : "");
	};
	var regexMatches = [];
	var lastMatchesStr = "";
	var lastMatchesRegex = "";
	var lastMatchesFlags = "";
	function updateRegexMatches(str_, regex_, flags_)
	{
		if (str_ === lastMatchesStr && regex_ === lastMatchesRegex && flags_ === lastMatchesFlags)
			return;
		var regex = getRegex(regex_, flags_);
		regexMatches = str_.match(regex);
		lastMatchesStr = str_;
		lastMatchesRegex = regex_;
		lastMatchesFlags = flags_;
	};
	SysExps.prototype.regexmatchcount = function (ret, str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		updateRegexMatches(str_.toString(), regex_, flags_);
		ret.set_int(regexMatches ? regexMatches.length : 0);
	};
	SysExps.prototype.regexmatchat = function (ret, str_, regex_, flags_, index_)
	{
		index_ = Math.floor(index_);
		var regex = getRegex(regex_, flags_);
		updateRegexMatches(str_.toString(), regex_, flags_);
		if (!regexMatches || index_ < 0 || index_ >= regexMatches.length)
			ret.set_string("");
		else
			ret.set_string(regexMatches[index_]);
	};
	SysExps.prototype.infinity = function (ret)
	{
		ret.set_float(Infinity);
	};
	SysExps.prototype.setbit = function (ret, n, b, v)
	{
		n = n | 0;
		b = b | 0;
		v = (v !== 0 ? 1 : 0);
		ret.set_int((n & ~(1 << b)) | (v << b));
	};
	SysExps.prototype.togglebit = function (ret, n, b)
	{
		n = n | 0;
		b = b | 0;
		ret.set_int(n ^ (1 << b));
	};
	SysExps.prototype.getbit = function (ret, n, b)
	{
		n = n | 0;
		b = b | 0;
		ret.set_int((n & (1 << b)) ? 1 : 0);
	};
	SysExps.prototype.originalwindowwidth = function (ret)
	{
		ret.set_int(this.runtime.original_width);
	};
	SysExps.prototype.originalwindowheight = function (ret)
	{
		ret.set_int(this.runtime.original_height);
	};
	sysProto.exps = new SysExps();
	sysProto.runWaits = function ()
	{
		var i, j, len, w, k, s, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		for (i = 0, len = this.waits.length; i < len; i++)
		{
			w = this.waits[i];
			if (w.time === -1)		// signalled wait
			{
				if (!w.signalled)
					continue;		// not yet signalled
			}
			else					// timer wait
			{
				if (w.time > this.runtime.kahanTime.sum)
					continue;		// timer not yet expired
			}
			evinfo.current_event = w.ev;
			evinfo.actindex = w.actindex;
			evinfo.cndindex = 0;
			for (k in w.sols)
			{
				if (w.sols.hasOwnProperty(k))
				{
					s = this.runtime.types_by_index[parseInt(k, 10)].getCurrentSol();
					ss = w.sols[k];
					s.select_all = ss.sa;
					cr.shallowAssignArray(s.instances, ss.insts);
					freeSolStateObject(ss);
				}
			}
			w.ev.resume_actions_and_subevents();
			this.runtime.clearSol(w.solModifiers);
			w.deleteme = true;
		}
		for (i = 0, j = 0, len = this.waits.length; i < len; i++)
		{
			w = this.waits[i];
			this.waits[j] = w;
			if (w.deleteme)
				freeWaitObject(w);
			else
				j++;
		}
		cr.truncateArray(this.waits, j);
	};
}());
;
(function () {
	cr.add_common_aces = function (m, pluginProto)
	{
		var singleglobal_ = m[1];
		var position_aces = m[3];
		var size_aces = m[4];
		var angle_aces = m[5];
		var appearance_aces = m[6];
		var zorder_aces = m[7];
		var effects_aces = m[8];
		if (!pluginProto.cnds)
			pluginProto.cnds = {};
		if (!pluginProto.acts)
			pluginProto.acts = {};
		if (!pluginProto.exps)
			pluginProto.exps = {};
		var cnds = pluginProto.cnds;
		var acts = pluginProto.acts;
		var exps = pluginProto.exps;
		if (position_aces)
		{
			cnds.CompareX = function (cmp, x)
			{
				return cr.do_cmp(this.x, cmp, x);
			};
			cnds.CompareY = function (cmp, y)
			{
				return cr.do_cmp(this.y, cmp, y);
			};
			cnds.IsOnScreen = function ()
			{
				var layer = this.layer;
				this.update_bbox();
				var bbox = this.bbox;
				return !(bbox.right < layer.viewLeft || bbox.bottom < layer.viewTop || bbox.left > layer.viewRight || bbox.top > layer.viewBottom);
			};
			cnds.IsOutsideLayout = function ()
			{
				this.update_bbox();
				var bbox = this.bbox;
				var layout = this.runtime.running_layout;
				return (bbox.right < 0 || bbox.bottom < 0 || bbox.left > layout.width || bbox.top > layout.height);
			};
			cnds.PickDistance = function (which, x, y)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var dist = cr.distanceTo(inst.x, inst.y, x, y);
				var i, len, d;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					d = cr.distanceTo(inst.x, inst.y, x, y);
					if ((which === 0 && d < dist) || (which === 1 && d > dist))
					{
						dist = d;
						pickme = inst;
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			acts.SetX = function (x)
			{
				if (this.x !== x)
				{
					this.x = x;
					this.set_bbox_changed();
				}
			};
			acts.SetY = function (y)
			{
				if (this.y !== y)
				{
					this.y = y;
					this.set_bbox_changed();
				}
			};
			acts.SetPos = function (x, y)
			{
				if (this.x !== x || this.y !== y)
				{
					this.x = x;
					this.y = y;
					this.set_bbox_changed();
				}
			};
			acts.SetPosToObject = function (obj, imgpt)
			{
				var inst = obj.getPairedInstance(this);
				if (!inst)
					return;
				var newx, newy;
				if (inst.getImagePoint)
				{
					newx = inst.getImagePoint(imgpt, true);
					newy = inst.getImagePoint(imgpt, false);
				}
				else
				{
					newx = inst.x;
					newy = inst.y;
				}
				if (this.x !== newx || this.y !== newy)
				{
					this.x = newx;
					this.y = newy;
					this.set_bbox_changed();
				}
			};
			acts.MoveForward = function (dist)
			{
				if (dist !== 0)
				{
					this.x += Math.cos(this.angle) * dist;
					this.y += Math.sin(this.angle) * dist;
					this.set_bbox_changed();
				}
			};
			acts.MoveAtAngle = function (a, dist)
			{
				if (dist !== 0)
				{
					this.x += Math.cos(cr.to_radians(a)) * dist;
					this.y += Math.sin(cr.to_radians(a)) * dist;
					this.set_bbox_changed();
				}
			};
			exps.X = function (ret)
			{
				ret.set_float(this.x);
			};
			exps.Y = function (ret)
			{
				ret.set_float(this.y);
			};
			exps.dt = function (ret)
			{
				ret.set_float(this.runtime.getDt(this));
			};
		}
		if (size_aces)
		{
			cnds.CompareWidth = function (cmp, w)
			{
				return cr.do_cmp(this.width, cmp, w);
			};
			cnds.CompareHeight = function (cmp, h)
			{
				return cr.do_cmp(this.height, cmp, h);
			};
			acts.SetWidth = function (w)
			{
				if (this.width !== w)
				{
					this.width = w;
					this.set_bbox_changed();
				}
			};
			acts.SetHeight = function (h)
			{
				if (this.height !== h)
				{
					this.height = h;
					this.set_bbox_changed();
				}
			};
			acts.SetSize = function (w, h)
			{
				if (this.width !== w || this.height !== h)
				{
					this.width = w;
					this.height = h;
					this.set_bbox_changed();
				}
			};
			exps.Width = function (ret)
			{
				ret.set_float(this.width);
			};
			exps.Height = function (ret)
			{
				ret.set_float(this.height);
			};
			exps.BBoxLeft = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.left);
			};
			exps.BBoxTop = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.top);
			};
			exps.BBoxRight = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.right);
			};
			exps.BBoxBottom = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.bottom);
			};
		}
		if (angle_aces)
		{
			cnds.AngleWithin = function (within, a)
			{
				return cr.angleDiff(this.angle, cr.to_radians(a)) <= cr.to_radians(within);
			};
			cnds.IsClockwiseFrom = function (a)
			{
				return cr.angleClockwise(this.angle, cr.to_radians(a));
			};
			cnds.IsBetweenAngles = function (a, b)
			{
				var lower = cr.to_clamped_radians(a);
				var upper = cr.to_clamped_radians(b);
				var angle = cr.clamp_angle(this.angle);
				var obtuse = (!cr.angleClockwise(upper, lower));
				if (obtuse)
					return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
				else
					return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
			};
			acts.SetAngle = function (a)
			{
				var newangle = cr.to_radians(cr.clamp_angle_degrees(a));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.RotateClockwise = function (a)
			{
				if (a !== 0 && !isNaN(a))
				{
					this.angle += cr.to_radians(a);
					this.angle = cr.clamp_angle(this.angle);
					this.set_bbox_changed();
				}
			};
			acts.RotateCounterclockwise = function (a)
			{
				if (a !== 0 && !isNaN(a))
				{
					this.angle -= cr.to_radians(a);
					this.angle = cr.clamp_angle(this.angle);
					this.set_bbox_changed();
				}
			};
			acts.RotateTowardAngle = function (amt, target)
			{
				var newangle = cr.angleRotate(this.angle, cr.to_radians(target), cr.to_radians(amt));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.RotateTowardPosition = function (amt, x, y)
			{
				var dx = x - this.x;
				var dy = y - this.y;
				var target = Math.atan2(dy, dx);
				var newangle = cr.angleRotate(this.angle, target, cr.to_radians(amt));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.SetTowardPosition = function (x, y)
			{
				var dx = x - this.x;
				var dy = y - this.y;
				var newangle = Math.atan2(dy, dx);
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			exps.Angle = function (ret)
			{
				ret.set_float(cr.to_clamped_degrees(this.angle));
			};
		}
		if (!singleglobal_)
		{
			cnds.CompareInstanceVar = function (iv, cmp, val)
			{
				return cr.do_cmp(this.instance_vars[iv], cmp, val);
			};
			cnds.IsBoolInstanceVarSet = function (iv)
			{
				return this.instance_vars[iv];
			};
			cnds.PickInstVarHiLow = function (which, iv)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var val = inst.instance_vars[iv];
				var i, len, v;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					v = inst.instance_vars[iv];
					if ((which === 0 && v < val) || (which === 1 && v > val))
					{
						val = v;
						pickme = inst;
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			cnds.PickByUID = function (u)
			{
				var i, len, j, inst, families, instances, sol;
				var cnd = this.runtime.getCurrentCondition();
				if (cnd.inverted)
				{
					sol = this.getCurrentSol();
					if (sol.select_all)
					{
						sol.select_all = false;
						cr.clearArray(sol.instances);
						cr.clearArray(sol.else_instances);
						instances = this.instances;
						for (i = 0, len = instances.length; i < len; i++)
						{
							inst = instances[i];
							if (inst.uid === u)
								sol.else_instances.push(inst);
							else
								sol.instances.push(inst);
						}
						this.applySolToContainer();
						return !!sol.instances.length;
					}
					else
					{
						for (i = 0, j = 0, len = sol.instances.length; i < len; i++)
						{
							inst = sol.instances[i];
							sol.instances[j] = inst;
							if (inst.uid === u)
							{
								sol.else_instances.push(inst);
							}
							else
								j++;
						}
						cr.truncateArray(sol.instances, j);
						this.applySolToContainer();
						return !!sol.instances.length;
					}
				}
				else
				{
					inst = this.runtime.getObjectByUID(u);
					if (!inst)
						return false;
					sol = this.getCurrentSol();
					if (!sol.select_all && sol.instances.indexOf(inst) === -1)
						return false;		// not picked
					if (this.is_family)
					{
						families = inst.type.families;
						for (i = 0, len = families.length; i < len; i++)
						{
							if (families[i] === this)
							{
								sol.pick_one(inst);
								this.applySolToContainer();
								return true;
							}
						}
					}
					else if (inst.type === this)
					{
						sol.pick_one(inst);
						this.applySolToContainer();
						return true;
					}
					return false;
				}
			};
			cnds.OnCreated = function ()
			{
				return true;
			};
			cnds.OnDestroyed = function ()
			{
				return true;
			};
			acts.SetInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] = val;
					else
						myinstvars[iv] = parseFloat(val);
				}
				else if (cr.is_string(myinstvars[iv]))
				{
					if (cr.is_string(val))
						myinstvars[iv] = val;
					else
						myinstvars[iv] = val.toString();
				}
				else
;
			};
			acts.AddInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] += val;
					else
						myinstvars[iv] += parseFloat(val);
				}
				else if (cr.is_string(myinstvars[iv]))
				{
					if (cr.is_string(val))
						myinstvars[iv] += val;
					else
						myinstvars[iv] += val.toString();
				}
				else
;
			};
			acts.SubInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] -= val;
					else
						myinstvars[iv] -= parseFloat(val);
				}
				else
;
			};
			acts.SetBoolInstanceVar = function (iv, val)
			{
				this.instance_vars[iv] = val ? 1 : 0;
			};
			acts.ToggleBoolInstanceVar = function (iv)
			{
				this.instance_vars[iv] = 1 - this.instance_vars[iv];
			};
			acts.Destroy = function ()
			{
				this.runtime.DestroyInstance(this);
			};
			if (!acts.LoadFromJsonString)
			{
				acts.LoadFromJsonString = function (str_)
				{
					var o, i, len, binst;
					try {
						o = JSON.parse(str_);
					}
					catch (e) {
						return;
					}
					this.runtime.loadInstanceFromJSON(this, o, true);
					if (this.afterLoad)
						this.afterLoad();
					if (this.behavior_insts)
					{
						for (i = 0, len = this.behavior_insts.length; i < len; ++i)
						{
							binst = this.behavior_insts[i];
							if (binst.afterLoad)
								binst.afterLoad();
						}
					}
				};
			}
			exps.Count = function (ret)
			{
				var count = ret.object_class.instances.length;
				var i, len, inst;
				for (i = 0, len = this.runtime.createRow.length; i < len; i++)
				{
					inst = this.runtime.createRow[i];
					if (ret.object_class.is_family)
					{
						if (inst.type.families.indexOf(ret.object_class) >= 0)
							count++;
					}
					else
					{
						if (inst.type === ret.object_class)
							count++;
					}
				}
				ret.set_int(count);
			};
			exps.PickedCount = function (ret)
			{
				ret.set_int(ret.object_class.getCurrentSol().getObjects().length);
			};
			exps.UID = function (ret)
			{
				ret.set_int(this.uid);
			};
			exps.IID = function (ret)
			{
				ret.set_int(this.get_iid());
			};
			if (!exps.AsJSON)
			{
				exps.AsJSON = function (ret)
				{
					ret.set_string(JSON.stringify(this.runtime.saveInstanceToJSON(this, true)));
				};
			}
		}
		if (appearance_aces)
		{
			cnds.IsVisible = function ()
			{
				return this.visible;
			};
			acts.SetVisible = function (v)
			{
				if (!v !== !this.visible)
				{
					this.visible = !!v;
					this.runtime.redraw = true;
				}
			};
			cnds.CompareOpacity = function (cmp, x)
			{
				return cr.do_cmp(cr.round6dp(this.opacity * 100), cmp, x);
			};
			acts.SetOpacity = function (x)
			{
				var new_opacity = x / 100.0;
				if (new_opacity < 0)
					new_opacity = 0;
				else if (new_opacity > 1)
					new_opacity = 1;
				if (new_opacity !== this.opacity)
				{
					this.opacity = new_opacity;
					this.runtime.redraw = true;
				}
			};
			exps.Opacity = function (ret)
			{
				ret.set_float(cr.round6dp(this.opacity * 100.0));
			};
		}
		if (zorder_aces)
		{
			cnds.IsOnLayer = function (layer_)
			{
				if (!layer_)
					return false;
				return this.layer === layer_;
			};
			cnds.PickTopBottom = function (which_)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var i, len;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					if (which_ === 0)
					{
						if (inst.layer.index > pickme.layer.index || (inst.layer.index === pickme.layer.index && inst.get_zindex() > pickme.get_zindex()))
						{
							pickme = inst;
						}
					}
					else
					{
						if (inst.layer.index < pickme.layer.index || (inst.layer.index === pickme.layer.index && inst.get_zindex() < pickme.get_zindex()))
						{
							pickme = inst;
						}
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			acts.MoveToTop = function ()
			{
				var layer = this.layer;
				var layer_instances = layer.instances;
				if (layer_instances.length && layer_instances[layer_instances.length - 1] === this)
					return;		// is already at top
				layer.removeFromInstanceList(this, false);
				layer.appendToInstanceList(this, false);
				this.runtime.redraw = true;
			};
			acts.MoveToBottom = function ()
			{
				var layer = this.layer;
				var layer_instances = layer.instances;
				if (layer_instances.length && layer_instances[0] === this)
					return;		// is already at bottom
				layer.removeFromInstanceList(this, false);
				layer.prependToInstanceList(this, false);
				this.runtime.redraw = true;
			};
			acts.MoveToLayer = function (layerMove)
			{
				if (!layerMove || layerMove == this.layer)
					return;
				this.layer.removeFromInstanceList(this, true);
				this.layer = layerMove;
				layerMove.appendToInstanceList(this, true);
				this.runtime.redraw = true;
			};
			acts.ZMoveToObject = function (where_, obj_)
			{
				var isafter = (where_ === 0);
				if (!obj_)
					return;
				var other = obj_.getFirstPicked(this);
				if (!other || other.uid === this.uid)
					return;
				if (this.layer.index !== other.layer.index)
				{
					this.layer.removeFromInstanceList(this, true);
					this.layer = other.layer;
					other.layer.appendToInstanceList(this, true);
				}
				this.layer.moveInstanceAdjacent(this, other, isafter);
				this.runtime.redraw = true;
			};
			exps.LayerNumber = function (ret)
			{
				ret.set_int(this.layer.number);
			};
			exps.LayerName = function (ret)
			{
				ret.set_string(this.layer.name);
			};
			exps.ZIndex = function (ret)
			{
				ret.set_int(this.get_zindex());
			};
		}
		if (effects_aces)
		{
			acts.SetEffectEnabled = function (enable_, effectname_)
			{
				if (!this.runtime.glwrap)
					return;
				var i = this.type.getEffectIndexByName(effectname_);
				if (i < 0)
					return;		// effect name not found
				var enable = (enable_ === 1);
				if (this.active_effect_flags[i] === enable)
					return;		// no change
				this.active_effect_flags[i] = enable;
				this.updateActiveEffects();
				this.runtime.redraw = true;
			};
			acts.SetEffectParam = function (effectname_, index_, value_)
			{
				if (!this.runtime.glwrap)
					return;
				var i = this.type.getEffectIndexByName(effectname_);
				if (i < 0)
					return;		// effect name not found
				var et = this.type.effect_types[i];
				var params = this.effect_params[i];
				index_ = Math.floor(index_);
				if (index_ < 0 || index_ >= params.length)
					return;		// effect index out of bounds
				if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
					value_ /= 100.0;
				if (params[index_] === value_)
					return;		// no change
				params[index_] = value_;
				if (et.active)
					this.runtime.redraw = true;
			};
		}
	};
	cr.set_bbox_changed = function ()
	{
		this.bbox_changed = true;      		// will recreate next time box requested
		this.cell_changed = true;
		this.type.any_cell_changed = true;	// avoid unnecessary updateAllBBox() calls
		this.runtime.redraw = true;     	// assume runtime needs to redraw
		var i, len, callbacks = this.bbox_changed_callbacks;
		for (i = 0, len = callbacks.length; i < len; ++i)
		{
			callbacks[i](this);
		}
		if (this.layer.useRenderCells)
			this.update_bbox();
	};
	cr.add_bbox_changed_callback = function (f)
	{
		if (f)
		{
			this.bbox_changed_callbacks.push(f);
		}
	};
	cr.update_bbox = function ()
	{
		if (!this.bbox_changed)
			return;                 // bounding box not changed
		var bbox = this.bbox;
		var bquad = this.bquad;
		bbox.set(this.x, this.y, this.x + this.width, this.y + this.height);
		bbox.offset(-this.hotspotX * this.width, -this.hotspotY * this.height);
		if (!this.angle)
		{
			bquad.set_from_rect(bbox);    // make bounding quad from box
		}
		else
		{
			bbox.offset(-this.x, -this.y);       			// translate to origin
			bquad.set_from_rotated_rect(bbox, this.angle);	// rotate around origin
			bquad.offset(this.x, this.y);      				// translate back to original position
			bquad.bounding_box(bbox);
		}
		bbox.normalize();
		this.bbox_changed = false;  // bounding box up to date
		this.update_render_cell();
	};
	var tmprc = new cr.rect(0, 0, 0, 0);
	cr.update_render_cell = function ()
	{
		if (!this.layer.useRenderCells)
			return;
		var mygrid = this.layer.render_grid;
		var bbox = this.bbox;
		tmprc.set(mygrid.XToCell(bbox.left), mygrid.YToCell(bbox.top), mygrid.XToCell(bbox.right), mygrid.YToCell(bbox.bottom));
		if (this.rendercells.equals(tmprc))
			return;
		if (this.rendercells.right < this.rendercells.left)
			mygrid.update(this, null, tmprc);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, this.rendercells, tmprc);
		this.rendercells.copy(tmprc);
		this.layer.render_list_stale = true;
	};
	cr.update_collision_cell = function ()
	{
		if (!this.cell_changed || !this.collisionsEnabled)
			return;
		this.update_bbox();
		var mygrid = this.type.collision_grid;
		var bbox = this.bbox;
		tmprc.set(mygrid.XToCell(bbox.left), mygrid.YToCell(bbox.top), mygrid.XToCell(bbox.right), mygrid.YToCell(bbox.bottom));
		if (this.collcells.equals(tmprc))
			return;
		if (this.collcells.right < this.collcells.left)
			mygrid.update(this, null, tmprc);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, this.collcells, tmprc);
		this.collcells.copy(tmprc);
		this.cell_changed = false;
	};
	cr.inst_contains_pt = function (x, y)
	{
		if (!this.bbox.contains_pt(x, y))
			return false;
		if (!this.bquad.contains_pt(x, y))
			return false;
		if (this.tilemap_exists)
			return this.testPointOverlapTile(x, y);
		if (this.collision_poly && !this.collision_poly.is_empty())
		{
			this.collision_poly.cache_poly(this.width, this.height, this.angle);
			return this.collision_poly.contains_pt(x - this.x, y - this.y);
		}
		else
			return true;
	};
	cr.inst_get_iid = function ()
	{
		this.type.updateIIDs();
		return this.iid;
	};
	cr.inst_get_zindex = function ()
	{
		this.layer.updateZIndices();
		return this.zindex;
	};
	cr.inst_updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		var i, len, et;
		var preserves_opaqueness = true;
		for (i = 0, len = this.active_effect_flags.length; i < len; i++)
		{
			if (this.active_effect_flags[i])
			{
				et = this.type.effect_types[i];
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					preserves_opaqueness = false;
			}
		}
		this.uses_shaders = !!this.active_effect_types.length;
		this.shaders_preserve_opaqueness = preserves_opaqueness;
	};
	cr.inst_toString = function ()
	{
		return "Inst" + this.puid;
	};
	cr.type_getFirstPicked = function (frominst)
	{
		if (frominst && frominst.is_contained && frominst.type != this)
		{
			var i, len, s;
			for (i = 0, len = frominst.siblings.length; i < len; i++)
			{
				s = frominst.siblings[i];
				if (s.type == this)
					return s;
			}
		}
		var instances = this.getCurrentSol().getObjects();
		if (instances.length)
			return instances[0];
		else
			return null;
	};
	cr.type_getPairedInstance = function (inst)
	{
		var instances = this.getCurrentSol().getObjects();
		if (instances.length)
			return instances[inst.get_iid() % instances.length];
		else
			return null;
	};
	cr.type_updateIIDs = function ()
	{
		if (!this.stale_iids || this.is_family)
			return;		// up to date or is family - don't want family to overwrite IIDs
		var i, len;
		for (i = 0, len = this.instances.length; i < len; i++)
			this.instances[i].iid = i;
		var next_iid = i;
		var createRow = this.runtime.createRow;
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === this)
				createRow[i].iid = next_iid++;
		}
		this.stale_iids = false;
	};
	cr.type_getInstanceByIID = function (i)
	{
		if (i < this.instances.length)
			return this.instances[i];
		i -= this.instances.length;
		var createRow = this.runtime.createRow;
		var j, lenj;
		for (j = 0, lenj = createRow.length; j < lenj; ++j)
		{
			if (createRow[j].type === this)
			{
				if (i === 0)
					return createRow[j];
				--i;
			}
		}
;
		return null;
	};
	cr.type_getCurrentSol = function ()
	{
		return this.solstack[this.cur_sol];
	};
	cr.type_pushCleanSol = function ()
	{
		this.cur_sol++;
		if (this.cur_sol === this.solstack.length)
		{
			this.solstack.push(new cr.selection(this));
		}
		else
		{
			this.solstack[this.cur_sol].select_all = true;  // else clear next SOL
			cr.clearArray(this.solstack[this.cur_sol].else_instances);
		}
	};
	cr.type_pushCopySol = function ()
	{
		this.cur_sol++;
		if (this.cur_sol === this.solstack.length)
			this.solstack.push(new cr.selection(this));
		var clonesol = this.solstack[this.cur_sol];
		var prevsol = this.solstack[this.cur_sol - 1];
		if (prevsol.select_all)
		{
			clonesol.select_all = true;
		}
		else
		{
			clonesol.select_all = false;
			cr.shallowAssignArray(clonesol.instances, prevsol.instances);
		}
		cr.clearArray(clonesol.else_instances);
	};
	cr.type_popSol = function ()
	{
;
		this.cur_sol--;
	};
	cr.type_getBehaviorByName = function (behname)
	{
		var i, len, j, lenj, f, index = 0;
		if (!this.is_family)
		{
			for (i = 0, len = this.families.length; i < len; i++)
			{
				f = this.families[i];
				for (j = 0, lenj = f.behaviors.length; j < lenj; j++)
				{
					if (behname === f.behaviors[j].name)
					{
						this.extra["lastBehIndex"] = index;
						return f.behaviors[j];
					}
					index++;
				}
			}
		}
		for (i = 0, len = this.behaviors.length; i < len; i++) {
			if (behname === this.behaviors[i].name)
			{
				this.extra["lastBehIndex"] = index;
				return this.behaviors[i];
			}
			index++;
		}
		return null;
	};
	cr.type_getBehaviorIndexByName = function (behname)
	{
		var b = this.getBehaviorByName(behname);
		if (b)
			return this.extra["lastBehIndex"];
		else
			return -1;
	};
	cr.type_getEffectIndexByName = function (name_)
	{
		var i, len;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			if (this.effect_types[i].name === name_)
				return i;
		}
		return -1;
	};
	cr.type_applySolToContainer = function ()
	{
		if (!this.is_contained || this.is_family)
			return;
		var i, len, j, lenj, t, sol, sol2;
		this.updateIIDs();
		sol = this.getCurrentSol();
		var select_all = sol.select_all;
		var es = this.runtime.getCurrentEventStack();
		var orblock = es && es.current_event && es.current_event.orblock;
		for (i = 0, len = this.container.length; i < len; i++)
		{
			t = this.container[i];
			if (t === this)
				continue;
			t.updateIIDs();
			sol2 = t.getCurrentSol();
			sol2.select_all = select_all;
			if (!select_all)
			{
				cr.clearArray(sol2.instances);
				for (j = 0, lenj = sol.instances.length; j < lenj; ++j)
					sol2.instances[j] = t.getInstanceByIID(sol.instances[j].iid);
				if (orblock)
				{
					cr.clearArray(sol2.else_instances);
					for (j = 0, lenj = sol.else_instances.length; j < lenj; ++j)
						sol2.else_instances[j] = t.getInstanceByIID(sol.else_instances[j].iid);
				}
			}
		}
	};
	cr.type_toString = function ()
	{
		return "Type" + this.sid;
	};
	cr.do_cmp = function (x, cmp, y)
	{
		if (typeof x === "undefined" || typeof y === "undefined")
			return false;
		switch (cmp)
		{
			case 0:     // equal
				return x === y;
			case 1:     // not equal
				return x !== y;
			case 2:     // less
				return x < y;
			case 3:     // less/equal
				return x <= y;
			case 4:     // greater
				return x > y;
			case 5:     // greater/equal
				return x >= y;
			default:
;
				return false;
		}
	};
})();
cr.shaders = {};
;
;
cr.plugins_.AJAX = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var isNWjs = false;
	var path = null;
	var fs = null;
	var nw_appfolder = "";
	var pluginProto = cr.plugins_.AJAX.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.lastData = "";
		this.curTag = "";
		this.progress = 0;
		this.timeout = -1;
		isNWjs = this.runtime.isNWjs;
		if (isNWjs)
		{
			path = require("path");
			fs = require("fs");
			var process = window["process"] || nw["process"];
			nw_appfolder = path["dirname"](process["execPath"]) + "\\";
		}
	};
	var instanceProto = pluginProto.Instance.prototype;
	var theInstance = null;
	window["C2_AJAX_DCSide"] = function (event_, tag_, param_)
	{
		if (!theInstance)
			return;
		if (event_ === "success")
		{
			theInstance.curTag = tag_;
			theInstance.lastData = param_;
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, theInstance);
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, theInstance);
		}
		else if (event_ === "error")
		{
			theInstance.curTag = tag_;
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, theInstance);
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, theInstance);
		}
		else if (event_ === "progress")
		{
			theInstance.progress = param_;
			theInstance.curTag = tag_;
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnProgress, theInstance);
		}
	};
	instanceProto.onCreate = function()
	{
		theInstance = this;
	};
	instanceProto.saveToJSON = function ()
	{
		return { "lastData": this.lastData };
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.lastData = o["lastData"];
		this.curTag = "";
		this.progress = 0;
	};
	var next_request_headers = {};
	var next_override_mime = "";
	instanceProto.doRequest = function (tag_, url_, method_, data_)
	{
		if (this.runtime.isDirectCanvas)
		{
			AppMobi["webview"]["execute"]('C2_AJAX_WebSide("' + tag_ + '", "' + url_ + '", "' + method_ + '", ' + (data_ ? '"' + data_ + '"' : "null") + ');');
			return;
		}
		var self = this;
		var request = null;
		var doErrorFunc = function ()
		{
			self.curTag = tag_;
			self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, self);
			self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
		};
		var errorFunc = function ()
		{
			if (isNWjs)
			{
				var filepath = nw_appfolder + url_;
				if (fs["existsSync"](filepath))
				{
					fs["readFile"](filepath, {"encoding": "utf8"}, function (err, data) {
						if (err)
						{
							doErrorFunc();
							return;
						}
						self.curTag = tag_;
						self.lastData = data.replace(/\r\n/g, "\n")
						self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, self);
						self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, self);
					});
				}
				else
					doErrorFunc();
			}
			else
				doErrorFunc();
		};
		var progressFunc = function (e)
		{
			if (!e["lengthComputable"])
				return;
			self.progress = e.loaded / e.total;
			self.curTag = tag_;
			self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnProgress, self);
		};
		try
		{
			if (this.runtime.isWindowsPhone8)
				request = new ActiveXObject("Microsoft.XMLHTTP");
			else
				request = new XMLHttpRequest();
			request.onreadystatechange = function()
			{
				if (request.readyState === 4)
				{
					self.curTag = tag_;
					if (request.responseText)
						self.lastData = request.responseText.replace(/\r\n/g, "\n");		// fix windows style line endings
					else
						self.lastData = "";
					if (request.status >= 400)
					{
						self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, self);
						self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
					}
					else
					{
						if ((!isNWjs || self.lastData.length) && !(!isNWjs && request.status === 0 && !self.lastData.length))
						{
							self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, self);
							self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, self);
						}
					}
				}
			};
			if (!this.runtime.isWindowsPhone8)
			{
				request.onerror = errorFunc;
				request.ontimeout = errorFunc;
				request.onabort = errorFunc;
				request["onprogress"] = progressFunc;
			}
			request.open(method_, url_);
			if (!this.runtime.isWindowsPhone8)
			{
				if (this.timeout >= 0 && typeof request["timeout"] !== "undefined")
					request["timeout"] = this.timeout;
			}
			try {
				request.responseType = "text";
			} catch (e) {}
			if (data_)
			{
				if (request["setRequestHeader"] && !next_request_headers.hasOwnProperty("Content-Type"))
				{
					request["setRequestHeader"]("Content-Type", "application/x-www-form-urlencoded");
				}
			}
			if (request["setRequestHeader"])
			{
				var p;
				for (p in next_request_headers)
				{
					if (next_request_headers.hasOwnProperty(p))
					{
						try {
							request["setRequestHeader"](p, next_request_headers[p]);
						}
						catch (e) {}
					}
				}
				next_request_headers = {};
			}
			if (next_override_mime && request["overrideMimeType"])
			{
				try {
					request["overrideMimeType"](next_override_mime);
				}
				catch (e) {}
				next_override_mime = "";
			}
			if (data_)
				request.send(data_);
			else
				request.send();
		}
		catch (e)
		{
			errorFunc();
		}
	};
	function Cnds() {};
	Cnds.prototype.OnComplete = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnAnyComplete = function (tag)
	{
		return true;
	};
	Cnds.prototype.OnError = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnAnyError = function (tag)
	{
		return true;
	};
	Cnds.prototype.OnProgress = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Request = function (tag_, url_)
	{
		var self = this;
		if (this.runtime.isWKWebView && !this.runtime.isAbsoluteUrl(url_))
		{
			this.runtime.fetchLocalFileViaCordovaAsText(url_,
			function (str)
			{
				self.curTag = tag_;
				self.lastData = str.replace(/\r\n/g, "\n");		// fix windows style line endings
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, self);
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, self);
			},
			function (err)
			{
				self.curTag = tag_;
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, self);
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
			});
		}
		else
		{
			this.doRequest(tag_, url_, "GET");
		}
	};
	Acts.prototype.RequestFile = function (tag_, file_)
	{
		var self = this;
		if (this.runtime.isWKWebView)
		{
			this.runtime.fetchLocalFileViaCordovaAsText(file_,
			function (str)
			{
				self.curTag = tag_;
				self.lastData = str.replace(/\r\n/g, "\n");		// fix windows style line endings
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, self);
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, self);
			},
			function (err)
			{
				self.curTag = tag_;
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, self);
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
			});
		}
		else
		{
			this.doRequest(tag_, file_, "GET");
		}
	};
	Acts.prototype.Post = function (tag_, url_, data_, method_)
	{
		this.doRequest(tag_, url_, method_, data_);
	};
	Acts.prototype.SetTimeout = function (t)
	{
		this.timeout = t * 1000;
	};
	Acts.prototype.SetHeader = function (n, v)
	{
		next_request_headers[n] = v;
	};
	Acts.prototype.OverrideMIMEType = function (m)
	{
		next_override_mime = m;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.LastData = function (ret)
	{
		ret.set_string(this.lastData);
	};
	Exps.prototype.Progress = function (ret)
	{
		ret.set_float(this.progress);
	};
	Exps.prototype.Tag = function (ret)
	{
		ret.set_string(this.curTag);
	};
	pluginProto.exps = new Exps();
}());
;
;
if (window) {
	window.alert = function(x) {
		console.log("Alert blocked:",x);
	}
}
cr.plugins_.AlertBlocker = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.AlertBlocker.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
	};
	instanceProto.onDestroy = function ()
	{
	};
	instanceProto.saveToJSON = function ()
	{
		return {
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function (glw)
	{
	};
	function Cnds() {}
	pluginProto.cnds = new Cnds();
	function Acts() {}
	pluginProto.acts = new Acts();
	function Exps() {}
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Arr = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Arr.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var arrCache = [];
	function allocArray()
	{
		if (arrCache.length)
			return arrCache.pop();
		else
			return [];
	};
	if (!Array.isArray)
	{
		Array.isArray = function (vArg) {
			return Object.prototype.toString.call(vArg) === "[object Array]";
		};
	}
	function freeArray(a)
	{
		var i, len;
		for (i = 0, len = a.length; i < len; i++)
		{
			if (Array.isArray(a[i]))
				freeArray(a[i]);
		}
		cr.clearArray(a);
		arrCache.push(a);
	};
	instanceProto.onCreate = function()
	{
		this.cx = this.properties[0];
		this.cy = this.properties[1];
		this.cz = this.properties[2];
		if (!this.recycled)
			this.arr = allocArray();
		var a = this.arr;
		a.length = this.cx;
		var x, y, z;
		for (x = 0; x < this.cx; x++)
		{
			if (!a[x])
				a[x] = allocArray();
			a[x].length = this.cy;
			for (y = 0; y < this.cy; y++)
			{
				if (!a[x][y])
					a[x][y] = allocArray();
				a[x][y].length = this.cz;
				for (z = 0; z < this.cz; z++)
					a[x][y][z] = 0;
			}
		}
		this.forX = [];
		this.forY = [];
		this.forZ = [];
		this.forDepth = -1;
	};
	instanceProto.onDestroy = function ()
	{
		var x;
		for (x = 0; x < this.cx; x++)
			freeArray(this.arr[x]);		// will recurse down and recycle other arrays
		cr.clearArray(this.arr);
	};
	instanceProto.at = function (x, y, z)
	{
		x = Math.floor(x);
		y = Math.floor(y);
		z = Math.floor(z);
		if (isNaN(x) || x < 0 || x > this.cx - 1)
			return 0;
		if (isNaN(y) || y < 0 || y > this.cy - 1)
			return 0;
		if (isNaN(z) || z < 0 || z > this.cz - 1)
			return 0;
		return this.arr[x][y][z];
	};
	instanceProto.set = function (x, y, z, val)
	{
		x = Math.floor(x);
		y = Math.floor(y);
		z = Math.floor(z);
		if (isNaN(x) || x < 0 || x > this.cx - 1)
			return;
		if (isNaN(y) || y < 0 || y > this.cy - 1)
			return;
		if (isNaN(z) || z < 0 || z > this.cz - 1)
			return;
		this.arr[x][y][z] = val;
	};
	instanceProto.getAsJSON = function ()
	{
		return JSON.stringify({
			"c2array": true,
			"size": [this.cx, this.cy, this.cz],
			"data": this.arr
		});
	};
	instanceProto.saveToJSON = function ()
	{
		return {
			"size": [this.cx, this.cy, this.cz],
			"data": this.arr
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
		var sz = o["size"];
		this.cx = sz[0];
		this.cy = sz[1];
		this.cz = sz[2];
		this.arr = o["data"];
	};
	instanceProto.setSize = function (w, h, d)
	{
		if (w < 0) w = 0;
		if (h < 0) h = 0;
		if (d < 0) d = 0;
		if (this.cx === w && this.cy === h && this.cz === d)
			return;		// no change
		this.cx = w;
		this.cy = h;
		this.cz = d;
		var x, y, z;
		var a = this.arr;
		a.length = w;
		for (x = 0; x < this.cx; x++)
		{
			if (cr.is_undefined(a[x]))
				a[x] = allocArray();
			a[x].length = h;
			for (y = 0; y < this.cy; y++)
			{
				if (cr.is_undefined(a[x][y]))
					a[x][y] = allocArray();
				a[x][y].length = d;
				for (z = 0; z < this.cz; z++)
				{
					if (cr.is_undefined(a[x][y][z]))
						a[x][y][z] = 0;
				}
			}
		}
	};
	instanceProto.getForX = function ()
	{
		if (this.forDepth >= 0 && this.forDepth < this.forX.length)
			return this.forX[this.forDepth];
		else
			return 0;
	};
	instanceProto.getForY = function ()
	{
		if (this.forDepth >= 0 && this.forDepth < this.forY.length)
			return this.forY[this.forDepth];
		else
			return 0;
	};
	instanceProto.getForZ = function ()
	{
		if (this.forDepth >= 0 && this.forDepth < this.forZ.length)
			return this.forZ[this.forDepth];
		else
			return 0;
	};
	function Cnds() {};
	Cnds.prototype.CompareX = function (x, cmp, val)
	{
		return cr.do_cmp(this.at(x, 0, 0), cmp, val);
	};
	Cnds.prototype.CompareXY = function (x, y, cmp, val)
	{
		return cr.do_cmp(this.at(x, y, 0), cmp, val);
	};
	Cnds.prototype.CompareXYZ = function (x, y, z, cmp, val)
	{
		return cr.do_cmp(this.at(x, y, z), cmp, val);
	};
	instanceProto.doForEachTrigger = function (current_event)
	{
		this.runtime.pushCopySol(current_event.solModifiers);
		current_event.retrigger();
		this.runtime.popSol(current_event.solModifiers);
	};
	Cnds.prototype.ArrForEach = function (dims)
	{
        var current_event = this.runtime.getCurrentEventStack().current_event;
		this.forDepth++;
		var forDepth = this.forDepth;
		if (forDepth === this.forX.length)
		{
			this.forX.push(0);
			this.forY.push(0);
			this.forZ.push(0);
		}
		else
		{
			this.forX[forDepth] = 0;
			this.forY[forDepth] = 0;
			this.forZ[forDepth] = 0;
		}
		switch (dims) {
		case 0:
			for (this.forX[forDepth] = 0; this.forX[forDepth] < this.cx; this.forX[forDepth]++)
			{
				for (this.forY[forDepth] = 0; this.forY[forDepth] < this.cy; this.forY[forDepth]++)
				{
					for (this.forZ[forDepth] = 0; this.forZ[forDepth] < this.cz; this.forZ[forDepth]++)
					{
						this.doForEachTrigger(current_event);
					}
				}
			}
			break;
		case 1:
			for (this.forX[forDepth] = 0; this.forX[forDepth] < this.cx; this.forX[forDepth]++)
			{
				for (this.forY[forDepth] = 0; this.forY[forDepth] < this.cy; this.forY[forDepth]++)
				{
					this.doForEachTrigger(current_event);
				}
			}
			break;
		case 2:
			for (this.forX[forDepth] = 0; this.forX[forDepth] < this.cx; this.forX[forDepth]++)
			{
				this.doForEachTrigger(current_event);
			}
			break;
		}
		this.forDepth--;
		return false;
	};
	Cnds.prototype.CompareCurrent = function (cmp, val)
	{
		return cr.do_cmp(this.at(this.getForX(), this.getForY(), this.getForZ()), cmp, val);
	};
	Cnds.prototype.Contains = function(val)
	{
		var x, y, z;
		for (x = 0; x < this.cx; x++)
		{
			for (y = 0; y < this.cy; y++)
			{
				for (z = 0; z < this.cz; z++)
				{
					if (this.arr[x][y][z] === val)
						return true;
				}
			}
		}
		return false;
	};
	Cnds.prototype.IsEmpty = function ()
	{
		return this.cx === 0 || this.cy === 0 || this.cz === 0;
	};
	Cnds.prototype.CompareSize = function (axis, cmp, value)
	{
		var s = 0;
		switch (axis) {
		case 0:
			s = this.cx;
			break;
		case 1:
			s = this.cy;
			break;
		case 2:
			s = this.cz;
			break;
		}
		return cr.do_cmp(s, cmp, value);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Clear = function ()
	{
		var x, y, z;
		for (x = 0; x < this.cx; x++)
			for (y = 0; y < this.cy; y++)
				for (z = 0; z < this.cz; z++)
					this.arr[x][y][z] = 0;
	};
	Acts.prototype.SetSize = function (w, h, d)
	{
		this.setSize(w, h, d);
	};
	Acts.prototype.SetX = function (x, val)
	{
		this.set(x, 0, 0, val);
	};
	Acts.prototype.SetXY = function (x, y, val)
	{
		this.set(x, y, 0, val);
	};
	Acts.prototype.SetXYZ = function (x, y, z, val)
	{
		this.set(x, y, z, val);
	};
	Acts.prototype.Push = function (where, value, axis)
	{
		var x = 0, y = 0, z = 0;
		var a = this.arr;
		switch (axis) {
		case 0:	// X axis
			if (where === 0)	// back
			{
				x = a.length;
				a.push(allocArray());
			}
			else				// front
			{
				x = 0;
				a.unshift(allocArray());
			}
			a[x].length = this.cy;
			for ( ; y < this.cy; y++)
			{
				a[x][y] = allocArray();
				a[x][y].length = this.cz;
				for (z = 0; z < this.cz; z++)
					a[x][y][z] = value;
			}
			this.cx++;
			break;
		case 1: // Y axis
			for ( ; x < this.cx; x++)
			{
				if (where === 0)	// back
				{
					y = a[x].length;
					a[x].push(allocArray());
				}
				else				// front
				{
					y = 0;
					a[x].unshift(allocArray());
				}
				a[x][y].length = this.cz;
				for (z = 0; z < this.cz; z++)
					a[x][y][z] = value;
			}
			this.cy++;
			break;
		case 2:	// Z axis
			for ( ; x < this.cx; x++)
			{
				for (y = 0; y < this.cy; y++)
				{
					if (where === 0)	// back
					{
						a[x][y].push(value);
					}
					else				// front
					{
						a[x][y].unshift(value);
					}
				}
			}
			this.cz++;
			break;
		}
	};
	Acts.prototype.Pop = function (where, axis)
	{
		var x = 0, y = 0, z = 0;
		var a = this.arr;
		switch (axis) {
		case 0:	// X axis
			if (this.cx === 0)
				break;
			if (where === 0)	// back
			{
				freeArray(a.pop());
			}
			else				// front
			{
				freeArray(a.shift());
			}
			this.cx--;
			break;
		case 1: // Y axis
			if (this.cy === 0)
				break;
			for ( ; x < this.cx; x++)
			{
				if (where === 0)	// back
				{
					freeArray(a[x].pop());
				}
				else				// front
				{
					freeArray(a[x].shift());
				}
			}
			this.cy--;
			break;
		case 2:	// Z axis
			if (this.cz === 0)
				break;
			for ( ; x < this.cx; x++)
			{
				for (y = 0; y < this.cy; y++)
				{
					if (where === 0)	// back
					{
						a[x][y].pop();
					}
					else				// front
					{
						a[x][y].shift();
					}
				}
			}
			this.cz--;
			break;
		}
	};
	Acts.prototype.Reverse = function (axis)
	{
		var x = 0, y = 0, z = 0;
		var a = this.arr;
		if (this.cx === 0 || this.cy === 0 || this.cz === 0)
			return;		// no point reversing empty array
		switch (axis) {
		case 0:	// X axis
			a.reverse();
			break;
		case 1: // Y axis
			for ( ; x < this.cx; x++)
				a[x].reverse();
			break;
		case 2:	// Z axis
			for ( ; x < this.cx; x++)
				for (y = 0; y < this.cy; y++)
					a[x][y].reverse();
			break;
		}
	};
	function compareValues(va, vb)
	{
		if (cr.is_number(va) && cr.is_number(vb))
			return va - vb;
		else
		{
			var sa = "" + va;
			var sb = "" + vb;
			if (sa < sb)
				return -1;
			else if (sa > sb)
				return 1;
			else
				return 0;
		}
	}
	Acts.prototype.Sort = function (axis)
	{
		var x = 0, y = 0, z = 0;
		var a = this.arr;
		if (this.cx === 0 || this.cy === 0 || this.cz === 0)
			return;		// no point sorting empty array
		switch (axis) {
		case 0:	// X axis
			a.sort(function (a, b) {
				return compareValues(a[0][0], b[0][0]);
			});
			break;
		case 1: // Y axis
			for ( ; x < this.cx; x++)
			{
				a[x].sort(function (a, b) {
					return compareValues(a[0], b[0]);
				});
			}
			break;
		case 2:	// Z axis
			for ( ; x < this.cx; x++)
			{
				for (y = 0; y < this.cy; y++)
				{
					a[x][y].sort(compareValues);
				}
			}
			break;
		}
	};
	Acts.prototype.Delete = function (index, axis)
	{
		var x = 0, y = 0, z = 0;
		index = Math.floor(index);
		var a = this.arr;
		if (index < 0)
			return;
		switch (axis) {
		case 0:	// X axis
			if (index >= this.cx)
				break;
			freeArray(a[index]);
			a.splice(index, 1);
			this.cx--;
			break;
		case 1: // Y axis
			if (index >= this.cy)
				break;
			for ( ; x < this.cx; x++)
			{
				freeArray(a[x][index]);
				a[x].splice(index, 1);
			}
			this.cy--;
			break;
		case 2:	// Z axis
			if (index >= this.cz)
				break;
			for ( ; x < this.cx; x++)
			{
				for (y = 0; y < this.cy; y++)
				{
					a[x][y].splice(index, 1);
				}
			}
			this.cz--;
			break;
		}
	};
	Acts.prototype.Insert = function (value, index, axis)
	{
		var x = 0, y = 0, z = 0;
		index = Math.floor(index);
		var a = this.arr;
		if (index < 0)
			return;
		switch (axis) {
		case 0:	// X axis
			if (index > this.cx)
				return;
			x = index;
			a.splice(x, 0, allocArray());
			a[x].length = this.cy;
			for ( ; y < this.cy; y++)
			{
				a[x][y] = allocArray();
				a[x][y].length = this.cz;
				for (z = 0; z < this.cz; z++)
					a[x][y][z] = value;
			}
			this.cx++;
			break;
		case 1: // Y axis
			if (index > this.cy)
				return;
			for ( ; x < this.cx; x++)
			{
				y = index;
				a[x].splice(y, 0, allocArray());
				a[x][y].length = this.cz;
				for (z = 0; z < this.cz; z++)
					a[x][y][z] = value;
			}
			this.cy++;
			break;
		case 2:	// Z axis
			if (index > this.cz)
				return;
			for ( ; x < this.cx; x++)
			{
				for (y = 0; y < this.cy; y++)
				{
					a[x][y].splice(index, 0, value);
				}
			}
			this.cz++;
			break;
		}
	};
	Acts.prototype.JSONLoad = function (json_)
	{
		var o;
		try {
			o = JSON.parse(json_);
		}
		catch(e) { return; }
		if (!o["c2array"])		// presumably not a c2array object
			return;
		var sz = o["size"];
		this.cx = sz[0];
		this.cy = sz[1];
		this.cz = sz[2];
		this.arr = o["data"];
	};
	Acts.prototype.JSONDownload = function (filename)
	{
		var a = document.createElement("a");
		if (typeof a.download === "undefined")
		{
			var str = 'data:text/html,' + encodeURIComponent("<p><a download='" + filename + "' href=\"data:application/json,"
				+ encodeURIComponent(this.getAsJSON())
				+ "\">Download link</a></p>");
			window.open(str);
		}
		else
		{
			var body = document.getElementsByTagName("body")[0];
			a.textContent = filename;
			a.href = "data:application/json," + encodeURIComponent(this.getAsJSON());
			a.download = filename;
			body.appendChild(a);
			var clickEvent = document.createEvent("MouseEvent");
			clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(clickEvent);
			body.removeChild(a);
		}
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.At = function (ret, x, y_, z_)
	{
		var y = y_ || 0;
		var z = z_ || 0;
		ret.set_any(this.at(x, y, z));
	};
	Exps.prototype.Width = function (ret)
	{
		ret.set_int(this.cx);
	};
	Exps.prototype.Height = function (ret)
	{
		ret.set_int(this.cy);
	};
	Exps.prototype.Depth = function (ret)
	{
		ret.set_int(this.cz);
	};
	Exps.prototype.CurX = function (ret)
	{
		ret.set_int(this.getForX());
	};
	Exps.prototype.CurY = function (ret)
	{
		ret.set_int(this.getForY());
	};
	Exps.prototype.CurZ = function (ret)
	{
		ret.set_int(this.getForZ());
	};
	Exps.prototype.CurValue = function (ret)
	{
		ret.set_any(this.at(this.getForX(), this.getForY(), this.getForZ()));
	};
	Exps.prototype.Front = function (ret)
	{
		ret.set_any(this.at(0, 0, 0));
	};
	Exps.prototype.Back = function (ret)
	{
		ret.set_any(this.at(this.cx - 1, 0, 0));
	};
	Exps.prototype.IndexOf = function (ret, v)
	{
		for (var i = 0; i < this.cx; i++)
		{
			if (this.arr[i][0][0] === v)
			{
				ret.set_int(i);
				return;
			}
		}
		ret.set_int(-1);
	};
	Exps.prototype.LastIndexOf = function (ret, v)
	{
		for (var i = this.cx - 1; i >= 0; i--)
		{
			if (this.arr[i][0][0] === v)
			{
				ret.set_int(i);
				return;
			}
		}
		ret.set_int(-1);
	};
	Exps.prototype.AsJSON = function (ret)
	{
		ret.set_string(this.getAsJSON());
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Browser = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Browser.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	var offlineScriptReady = false;
	var browserPluginReady = false;
	document.addEventListener("DOMContentLoaded", function ()
	{
		if (window["C2_RegisterSW"] && navigator["serviceWorker"])
		{
			var offlineClientScript = document.createElement("script");
			offlineClientScript.onload = function ()
			{
				offlineScriptReady = true;
				checkReady()
			};
			offlineClientScript.src = "offlineClient.js";
			document.head.appendChild(offlineClientScript);
		}
	});
	var browserInstance = null;
	typeProto.onAppBegin = function ()
	{
		browserPluginReady = true;
		checkReady();
	};
	function checkReady()
	{
		if (offlineScriptReady && browserPluginReady && window["OfflineClientInfo"])
		{
			window["OfflineClientInfo"]["SetMessageCallback"](function (e)
			{
				browserInstance.onSWMessage(e);
			});
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		window.addEventListener("resize", function () {
			self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnResize, self);
		});
		browserInstance = this;
		if (typeof navigator.onLine !== "undefined")
		{
			window.addEventListener("online", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnOnline, self);
			});
			window.addEventListener("offline", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnOffline, self);
			});
		}
		if (!this.runtime.isDirectCanvas)
		{
			document.addEventListener("appMobi.device.update.available", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnUpdateReady, self);
			});
			document.addEventListener("backbutton", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnBackButton, self);
			});
			document.addEventListener("menubutton", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnMenuButton, self);
			});
			document.addEventListener("searchbutton", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnSearchButton, self);
			});
			document.addEventListener("tizenhwkey", function (e) {
				var ret;
				switch (e["keyName"]) {
				case "back":
					ret = self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnBackButton, self);
					if (!ret)
					{
						if (window["tizen"])
							window["tizen"]["application"]["getCurrentApplication"]()["exit"]();
					}
					break;
				case "menu":
					ret = self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnMenuButton, self);
					if (!ret)
						e.preventDefault();
					break;
				}
			});
		}
		if (this.runtime.isWindows10 && typeof Windows !== "undefined")
		{
			Windows["UI"]["Core"]["SystemNavigationManager"]["getForCurrentView"]().addEventListener("backrequested", function (e)
			{
				var ret = self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnBackButton, self);
				if (ret)
					e["handled"] = true;
		    });
		}
		else if (this.runtime.isWinJS && WinJS["Application"])
		{
			WinJS["Application"]["onbackclick"] = function (e)
			{
				return !!self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnBackButton, self);
			};
		}
		this.runtime.addSuspendCallback(function(s) {
			if (s)
			{
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnPageHidden, self);
			}
			else
			{
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnPageVisible, self);
			}
		});
		this.is_arcade = (typeof window["is_scirra_arcade"] !== "undefined");
	};
	instanceProto.onSWMessage = function (e)
	{
		var messageType = e["data"]["type"];
		if (messageType === "downloading-update")
			this.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnUpdateFound, this);
		else if (messageType === "update-ready" || messageType === "update-pending")
			this.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnUpdateReady, this);
		else if (messageType === "offline-ready")
			this.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnOfflineReady, this);
	};
	var batteryManager = null;
	var loadedBatteryManager = false;
	function maybeLoadBatteryManager()
	{
		if (loadedBatteryManager)
			return;
		if (!navigator["getBattery"])
			return;
		var promise = navigator["getBattery"]();
		loadedBatteryManager = true;
		if (promise)
		{
			promise.then(function (manager) {
				batteryManager = manager;
			});
		}
	};
	function Cnds() {};
	Cnds.prototype.CookiesEnabled = function()
	{
		return navigator ? navigator.cookieEnabled : false;
	};
	Cnds.prototype.IsOnline = function()
	{
		return navigator ? navigator.onLine : false;
	};
	Cnds.prototype.HasJava = function()
	{
		return navigator ? navigator.javaEnabled() : false;
	};
	Cnds.prototype.OnOnline = function()
	{
		return true;
	};
	Cnds.prototype.OnOffline = function()
	{
		return true;
	};
	Cnds.prototype.IsDownloadingUpdate = function ()
	{
		return false;		// deprecated
	};
	Cnds.prototype.OnUpdateReady = function ()
	{
		return true;
	};
	Cnds.prototype.PageVisible = function ()
	{
		return !this.runtime.isSuspended;
	};
	Cnds.prototype.OnPageVisible = function ()
	{
		return true;
	};
	Cnds.prototype.OnPageHidden = function ()
	{
		return true;
	};
	Cnds.prototype.OnResize = function ()
	{
		return true;
	};
	Cnds.prototype.IsFullscreen = function ()
	{
		return !!(document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || this.runtime.isNodeFullscreen);
	};
	Cnds.prototype.OnBackButton = function ()
	{
		return true;
	};
	Cnds.prototype.OnMenuButton = function ()
	{
		return true;
	};
	Cnds.prototype.OnSearchButton = function ()
	{
		return true;
	};
	Cnds.prototype.IsMetered = function ()
	{
		var connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"];
		if (!connection)
			return false;
		return !!connection["metered"];
	};
	Cnds.prototype.IsCharging = function ()
	{
		var battery = navigator["battery"] || navigator["mozBattery"] || navigator["webkitBattery"];
		if (battery)
		{
			return !!battery["charging"]
		}
		else
		{
			maybeLoadBatteryManager();
			if (batteryManager)
			{
				return !!batteryManager["charging"];
			}
			else
			{
				return true;		// if unknown, default to charging (powered)
			}
		}
	};
	Cnds.prototype.IsPortraitLandscape = function (p)
	{
		var current = (window.innerWidth <= window.innerHeight ? 0 : 1);
		return current === p;
	};
	Cnds.prototype.SupportsFullscreen = function ()
	{
		if (this.runtime.isNodeWebkit)
			return true;
		var elem = this.runtime.canvasdiv || this.runtime.canvas;
		return !!(elem["requestFullscreen"] || elem["mozRequestFullScreen"] || elem["msRequestFullscreen"] || elem["webkitRequestFullScreen"]);
	};
	Cnds.prototype.OnUpdateFound = function ()
	{
		return true;
	};
	Cnds.prototype.OnUpdateReady = function ()
	{
		return true;
	};
	Cnds.prototype.OnOfflineReady = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Alert = function (msg)
	{
		if (!this.runtime.isDomFree)
			alert(msg.toString());
	};
	Acts.prototype.Close = function ()
	{
		if (this.runtime.isCocoonJs)
			CocoonJS["App"]["forceToFinish"]();
		else if (window["tizen"])
			window["tizen"]["application"]["getCurrentApplication"]()["exit"]();
		else if (navigator["app"] && navigator["app"]["exitApp"])
			navigator["app"]["exitApp"]();
		else if (navigator["device"] && navigator["device"]["exitApp"])
			navigator["device"]["exitApp"]();
		else if (!this.is_arcade && !this.runtime.isDomFree)
			window.close();
	};
	Acts.prototype.Focus = function ()
	{
		if (this.runtime.isNodeWebkit)
		{
			var win = window["nwgui"]["Window"]["get"]();
			win["focus"]();
		}
		else if (!this.is_arcade && !this.runtime.isDomFree)
			window.focus();
	};
	Acts.prototype.Blur = function ()
	{
		if (this.runtime.isNodeWebkit)
		{
			var win = window["nwgui"]["Window"]["get"]();
			win["blur"]();
		}
		else if (!this.is_arcade && !this.runtime.isDomFree)
			window.blur();
	};
	Acts.prototype.GoBack = function ()
	{
		if (navigator["app"] && navigator["app"]["backHistory"])
			navigator["app"]["backHistory"]();
		else if (!this.is_arcade && !this.runtime.isDomFree && window.back)
			window.back();
	};
	Acts.prototype.GoForward = function ()
	{
		if (!this.is_arcade && !this.runtime.isDomFree && window.forward)
			window.forward();
	};
	Acts.prototype.GoHome = function ()
	{
		if (!this.is_arcade && !this.runtime.isDomFree && window.home)
			window.home();
	};
	Acts.prototype.GoToURL = function (url, target)
	{
		if (this.runtime.isCocoonJs)
			CocoonJS["App"]["openURL"](url);
		else if (this.runtime.isEjecta)
			ejecta["openURL"](url);
		else if (this.runtime.isWinJS)
			Windows["System"]["Launcher"]["launchUriAsync"](new Windows["Foundation"]["Uri"](url));
		else if (navigator["app"] && navigator["app"]["loadUrl"])
			navigator["app"]["loadUrl"](url, { "openExternal": true });
		else if (self["cordova"] && self["cordova"]["InAppBrowser"])
			self["cordova"]["InAppBrowser"]["open"](url, "_system");
		else if (!this.is_arcade && !this.runtime.isDomFree)
		{
			if (target === 2 && !this.is_arcade)		// top
				window.top.location = url;
			else if (target === 1 && !this.is_arcade)	// parent
				window.parent.location = url;
			else					// self
				window.location = url;
		}
	};
	Acts.prototype.GoToURLWindow = function (url, tag)
	{
		if (this.runtime.isCocoonJs)
			CocoonJS["App"]["openURL"](url);
		else if (this.runtime.isEjecta)
			ejecta["openURL"](url);
		else if (this.runtime.isWinJS)
			Windows["System"]["Launcher"]["launchUriAsync"](new Windows["Foundation"]["Uri"](url));
		else if (navigator["app"] && navigator["app"]["loadUrl"])
			navigator["app"]["loadUrl"](url, { "openExternal": true });
		else if (self["cordova"] && self["cordova"]["InAppBrowser"])
			self["cordova"]["InAppBrowser"]["open"](url, "_system");
		else if (!this.is_arcade && !this.runtime.isDomFree)
			window.open(url, tag);
	};
	Acts.prototype.Reload = function ()
	{
		if (!this.is_arcade && !this.runtime.isDomFree)
			window.location.reload();
	};
	var firstRequestFullscreen = true;
	var crruntime = null;
	function onFullscreenError(e)
	{
		if (console && console.warn)
			console.warn("Fullscreen request failed: ", e);
		crruntime["setSize"](window.innerWidth, window.innerHeight);
	};
	Acts.prototype.RequestFullScreen = function (stretchmode)
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[PlotyXD] Requesting fullscreen is not supported on this platform - the request has been ignored");
			return;
		}
		if (stretchmode >= 2)
			stretchmode += 1;
		if (stretchmode === 6)
			stretchmode = 2;
		if (this.runtime.isNodeWebkit)
		{
			if (this.runtime.isDebug)
			{
				debuggerFullscreen(true);
			}
			else if (!this.runtime.isNodeFullscreen && window["nwgui"])
			{
				window["nwgui"]["Window"]["get"]()["enterFullscreen"]();
				this.runtime.isNodeFullscreen = true;
				this.runtime.fullscreen_scaling = (stretchmode >= 2 ? stretchmode : 0);
			}
		}
		else
		{
			if (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || document["fullScreenElement"])
			{
				return;
			}
			this.runtime.fullscreen_scaling = (stretchmode >= 2 ? stretchmode : 0);
			var elem = document.documentElement;
			if (firstRequestFullscreen)
			{
				firstRequestFullscreen = false;
				crruntime = this.runtime;
				elem.addEventListener("mozfullscreenerror", onFullscreenError);
				elem.addEventListener("webkitfullscreenerror", onFullscreenError);
				elem.addEventListener("MSFullscreenError", onFullscreenError);
				elem.addEventListener("fullscreenerror", onFullscreenError);
			}
			if (elem["requestFullscreen"])
				elem["requestFullscreen"]();
			else if (elem["mozRequestFullScreen"])
				elem["mozRequestFullScreen"]();
			else if (elem["msRequestFullscreen"])
				elem["msRequestFullscreen"]();
			else if (elem["webkitRequestFullScreen"])
			{
				if (typeof Element !== "undefined" && typeof Element["ALLOW_KEYBOARD_INPUT"] !== "undefined")
					elem["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]);
				else
					elem["webkitRequestFullScreen"]();
			}
		}
	};
	Acts.prototype.CancelFullScreen = function ()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[PlotyXD] Exiting fullscreen is not supported on this platform - the request has been ignored");
			return;
		}
		if (this.runtime.isNodeWebkit)
		{
			if (this.runtime.isDebug)
			{
				debuggerFullscreen(false);
			}
			else if (this.runtime.isNodeFullscreen && window["nwgui"])
			{
				window["nwgui"]["Window"]["get"]()["leaveFullscreen"]();
				this.runtime.isNodeFullscreen = false;
			}
		}
		else
		{
			if (document["exitFullscreen"])
				document["exitFullscreen"]();
			else if (document["mozCancelFullScreen"])
				document["mozCancelFullScreen"]();
			else if (document["msExitFullscreen"])
				document["msExitFullscreen"]();
			else if (document["webkitCancelFullScreen"])
				document["webkitCancelFullScreen"]();
		}
	};
	Acts.prototype.Vibrate = function (pattern_)
	{
		try {
			var arr = pattern_.split(",");
			var i, len;
			for (i = 0, len = arr.length; i < len; i++)
			{
				arr[i] = parseInt(arr[i], 10);
			}
			if (navigator["vibrate"])
				navigator["vibrate"](arr);
			else if (navigator["mozVibrate"])
				navigator["mozVibrate"](arr);
			else if (navigator["webkitVibrate"])
				navigator["webkitVibrate"](arr);
			else if (navigator["msVibrate"])
				navigator["msVibrate"](arr);
		}
		catch (e) {}
	};
	Acts.prototype.InvokeDownload = function (url_, filename_)
	{
		var a = document.createElement("a");
		if (typeof a["download"] === "undefined")
		{
			window.open(url_);
		}
		else
		{
			var body = document.getElementsByTagName("body")[0];
			a.textContent = filename_;
			a.href = url_;
			a["download"] = filename_;
			body.appendChild(a);
			var clickEvent = new MouseEvent("click");
			a.dispatchEvent(clickEvent);
			body.removeChild(a);
		}
	};
	Acts.prototype.InvokeDownloadString = function (str_, mimetype_, filename_)
	{
		var datauri = "data:" + mimetype_ + "," + encodeURIComponent(str_);
		var a = document.createElement("a");
		if (typeof a["download"] === "undefined")
		{
			window.open(datauri);
		}
		else
		{
			var body = document.getElementsByTagName("body")[0];
			a.textContent = filename_;
			a.href = datauri;
			a["download"] = filename_;
			body.appendChild(a);
			var clickEvent = new MouseEvent("click");
			a.dispatchEvent(clickEvent);
			body.removeChild(a);
		}
	};
	Acts.prototype.ConsoleLog = function (type_, msg_)
	{
		if (typeof console === "undefined")
			return;
		if (type_ === 0 && console.log)
			console.log(msg_.toString());
		if (type_ === 1 && console.warn)
			console.warn(msg_.toString());
		if (type_ === 2 && console.error)
			console.error(msg_.toString());
	};
	Acts.prototype.ConsoleGroup = function (name_)
	{
		if (console && console.group)
			console.group(name_);
	};
	Acts.prototype.ConsoleGroupEnd = function ()
	{
		if (console && console.groupEnd)
			console.groupEnd();
	};
	Acts.prototype.ExecJs = function (js_)
	{
		try {
			if (eval)
				eval(js_);
		}
		catch (e)
		{
			if (console && console.error)
				console.error("Error executing Javascript: ", e);
		}
	};
	var orientations = [
		"portrait",
		"landscape",
		"portrait-primary",
		"portrait-secondary",
		"landscape-primary",
		"landscape-secondary"
	];
	Acts.prototype.LockOrientation = function (o)
	{
		o = Math.floor(o);
		if (o < 0 || o >= orientations.length)
			return;
		this.runtime.autoLockOrientation = false;
		var orientation = orientations[o];
		if (screen["orientation"] && screen["orientation"]["lock"])
			screen["orientation"]["lock"](orientation);
		else if (screen["lockOrientation"])
			screen["lockOrientation"](orientation);
		else if (screen["webkitLockOrientation"])
			screen["webkitLockOrientation"](orientation);
		else if (screen["mozLockOrientation"])
			screen["mozLockOrientation"](orientation);
		else if (screen["msLockOrientation"])
			screen["msLockOrientation"](orientation);
	};
	Acts.prototype.UnlockOrientation = function ()
	{
		this.runtime.autoLockOrientation = false;
		if (screen["orientation"] && screen["orientation"]["unlock"])
			screen["orientation"]["unlock"]();
		else if (screen["unlockOrientation"])
			screen["unlockOrientation"]();
		else if (screen["webkitUnlockOrientation"])
			screen["webkitUnlockOrientation"]();
		else if (screen["mozUnlockOrientation"])
			screen["mozUnlockOrientation"]();
		else if (screen["msUnlockOrientation"])
			screen["msUnlockOrientation"]();
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.URL = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.toString());
	};
	Exps.prototype.Protocol = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.protocol);
	};
	Exps.prototype.Domain = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.hostname);
	};
	Exps.prototype.PathName = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.pathname);
	};
	Exps.prototype.Hash = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.hash);
	};
	Exps.prototype.Referrer = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : document.referrer);
	};
	Exps.prototype.Title = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : document.title);
	};
	Exps.prototype.Name = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : navigator.appName);
	};
	Exps.prototype.Version = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : navigator.appVersion);
	};
	Exps.prototype.Language = function (ret)
	{
		if (navigator && navigator.language)
			ret.set_string(navigator.language);
		else
			ret.set_string("");
	};
	Exps.prototype.Platform = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : navigator.platform);
	};
	Exps.prototype.Product = function (ret)
	{
		if (navigator && navigator.product)
			ret.set_string(navigator.product);
		else
			ret.set_string("");
	};
	Exps.prototype.Vendor = function (ret)
	{
		if (navigator && navigator.vendor)
			ret.set_string(navigator.vendor);
		else
			ret.set_string("");
	};
	Exps.prototype.UserAgent = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : navigator.userAgent);
	};
	Exps.prototype.QueryString = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.search);
	};
	Exps.prototype.QueryParam = function (ret, paramname)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		var match = RegExp('[?&]' + paramname + '=([^&]*)').exec(window.location.search);
		if (match)
			ret.set_string(decodeURIComponent(match[1].replace(/\+/g, ' ')));
		else
			ret.set_string("");
	};
	Exps.prototype.Bandwidth = function (ret)
	{
		var connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"];
		if (!connection)
			ret.set_float(Number.POSITIVE_INFINITY);
		else
		{
			if (typeof connection["bandwidth"] !== "undefined")
				ret.set_float(connection["bandwidth"]);
			else if (typeof connection["downlinkMax"] !== "undefined")
				ret.set_float(connection["downlinkMax"]);
			else
				ret.set_float(Number.POSITIVE_INFINITY);
		}
	};
	Exps.prototype.ConnectionType = function (ret)
	{
		var connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"];
		if (!connection)
			ret.set_string("unknown");
		else
		{
			ret.set_string(connection["type"] || "unknown");
		}
	};
	Exps.prototype.BatteryLevel = function (ret)
	{
		var battery = navigator["battery"] || navigator["mozBattery"] || navigator["webkitBattery"];
		if (battery)
		{
			ret.set_float(battery["level"]);
		}
		else
		{
			maybeLoadBatteryManager();
			if (batteryManager)
			{
				ret.set_float(batteryManager["level"]);
			}
			else
			{
				ret.set_float(1);		// not supported/unknown: assume charged
			}
		}
	};
	Exps.prototype.BatteryTimeLeft = function (ret)
	{
		var battery = navigator["battery"] || navigator["mozBattery"] || navigator["webkitBattery"];
		if (battery)
		{
			ret.set_float(battery["dischargingTime"]);
		}
		else
		{
			maybeLoadBatteryManager();
			if (batteryManager)
			{
				ret.set_float(batteryManager["dischargingTime"]);
			}
			else
			{
				ret.set_float(Number.POSITIVE_INFINITY);		// not supported/unknown: assume infinite time left
			}
		}
	};
	Exps.prototype.ExecJS = function (ret, js_)
	{
		if (!eval)
		{
			ret.set_any(0);
			return;
		}
		var result = 0;
		try {
			result = eval(js_);
		}
		catch (e)
		{
			if (console && console.error)
				console.error("Error executing Javascript: ", e);
		}
		if (typeof result === "number")
			ret.set_any(result);
		else if (typeof result === "string")
			ret.set_any(result);
		else if (typeof result === "boolean")
			ret.set_any(result ? 1 : 0);
		else
			ret.set_any(0);
	};
	Exps.prototype.ScreenWidth = function (ret)
	{
		ret.set_int(screen.width);
	};
	Exps.prototype.ScreenHeight = function (ret)
	{
		ret.set_int(screen.height);
	};
	Exps.prototype.DevicePixelRatio = function (ret)
	{
		ret.set_float(this.runtime.devicePixelRatio);
	};
	Exps.prototype.WindowInnerWidth = function (ret)
	{
		ret.set_int(window.innerWidth);
	};
	Exps.prototype.WindowInnerHeight = function (ret)
	{
		ret.set_int(window.innerHeight);
	};
	Exps.prototype.WindowOuterWidth = function (ret)
	{
		ret.set_int(window.outerWidth);
	};
	Exps.prototype.WindowOuterHeight = function (ret)
	{
		ret.set_int(window.outerHeight);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.CBhash = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.CBhash.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.lastResult = "";
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
			this.hexcase = 0;
			this.b64pad = " ";
	};
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	cnds.OnHashed = function ()
	{
		return true;
	};
	instanceProto.hex_md5 = function(s)    { return this.rstr2hex(rstr_md5(str2rstr_utf8(s))); }
	instanceProto.b64_md5 = function(s)    { return this.rstr2b64(rstr_md5(str2rstr_utf8(s))); }
	instanceProto.any_md5 = function(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
	instanceProto.hex_hmac_md5 = function(k, d)  { return this.rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
	instanceProto.b64_hmac_md5 = function(k, d)  { return this.rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
	instanceProto.any_hmac_md5= function(k, d, e)  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }
	instanceProto.hex_sha1 = function(s)    { return this.rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
	instanceProto.b64_sha1 = function(s)    { return this.rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
	instanceProto.any_sha1 = function(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
	instanceProto.hex_hmac_sha1 = function(k, d)  { return this.rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
	instanceProto.b64_hmac_sha1 = function(k, d)  { return this.rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
	instanceProto.any_hmac_sha1 = function(k, d, e)  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }
	instanceProto.hex_sha256 = function(s)    { return this.rstr2hex(rstr_sha256(str2rstr_utf8(s))); }
	instanceProto.b64_sha256 = function(s)    { return this.rstr2b64(rstr_sha256(str2rstr_utf8(s))); }
	instanceProto.any_sha256 = function(s, e) { return rstr2any(rstr_sha256(str2rstr_utf8(s)), e); }
	instanceProto.hex_hmac_sha256 = function(k, d)  { return this.rstr2hex(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d))); }
	instanceProto.b64_hmac_sha256 = function(k, d)  { return this.rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d))); }
	instanceProto.any_hmac_sha256 = function(k, d, e)  { return rstr2any(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)), e); }
	/*
	* Convert a raw string to a hex string
	*/
	instanceProto.rstr2hex = function(input)
	{
		try { this.hexcase } catch(e) { this.hexcase = 0; }
		var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var output = "";
		var x;
		for(var i = 0; i < input.length; i++)
		{
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
		}
	return output;
	}
	/*
	* Convert a raw string to a base-64 string
	*/
	instanceProto.rstr2b64 = function(input)
	{
	try { this.b64pad } catch(e) { this.b64pad=''; }
	var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var output = "";
	var len = input.length;
	for(var i = 0; i < len; i += 3)
		{
		var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
		for(var j = 0; j < 4; j++)
			{
				if(i * 8 + j * 6 > input.length * 8) output += this.b64pad;
				else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
			}
		}
	return output;
	}
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	acts.set_hexoutput = function (format)
	{
		if (format == 0)
			this.hexcase = 0;
		else
			this.hexcase = 1;
	};
	acts.set_bpad = function (charac)
	{
		this.b64pad = charac;
	};
	acts.MD5_hash = function (string, format)
	{
		var outF = format;
		if (outF == 0)
			this.lastResult = this.hex_md5(string);
		else
			this.lastResult = this.b64_md5(string);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.MD5_pass = function (string, encoding)
	{
		this.lastResult = this.any_md5(string, encoding);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.HMAC_hash = function (key, data, Format)
	{
		if (Format == 0)
			this.lastResult = this.hex_hmac_md5(key, data);
		else
			this.lastResult = this.b64_hmac_md5(key, data);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.HMAC_pass = function (key, data, charString)
	{
		this.lastResult = this.any_hmac_md5(key, data, charString);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.SHA1_hash = function (string, format)
	{
		var outF = format;
		if (outF == 0)
			this.lastResult = this.hex_sha1(string);
		else
			this.lastResult = this.b64_sha1(string);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.SHA1_pass = function (string, encoding)
	{
		this.lastResult = this.any_sha1(string, encoding);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.HMACSHA1_hash = function (key, data, Format)
	{
		if (Format == 0)
			this.lastResult = this.hex_hmac_sha1(key, data);
		else
			this.lastResult = this.b64_hmac_sha1(key, data);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.HMACSHA1_pass = function (key, data, charString)
	{
		this.lastResult = this.any_hmac_sha1(key, data, charString);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.SHA256_hash = function (string, format)
	{
		var outF = format;
		if (outF == 0)
			this.lastResult = this.hex_sha256(string);
		else
			this.lastResult = this.b64_sha256(string);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.SHA256_pass = function (string, encoding)
	{
		this.lastResult = this.any_sha256(string, encoding);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.HMACSHA256_hash = function (key, data, Format)
	{
		if (Format == 0)
			this.lastResult = this.hex_hmac_sha256(key, data);
		else
			this.lastResult = this.b64_hmac_sha256(key, data);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	acts.HMACSHA256_pass = function (key, data, charString)
	{
		this.lastResult = this.any_hmac_sha256(key, data, charString);
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	exps.get_lastResult = function (ret)
	{
		ret.set_string(this.lastResult);
	};
	exps.MD5 = function (ret, data)
	{
		ret.set_string(this.hex_md5(data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.MD5B = function (ret, data)
	{
		ret.set_string(this.b64_md5(data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.MD5pass = function (ret, data, charstring)
	{
		ret.set_string(this.any_md5(data, charstring));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACMD5 = function (ret, key, data)
	{
		ret.set_string(this.hex_hmac_md5(key, data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACMD5B = function (ret, key, data)
	{
		ret.set_string(this.b64_hmac_md5(key, data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACMD5pass = function (ret, key, data, charstring)
	{
		ret.set_string(this.any_hmac_md5(key, data, charstring));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.SHA1 = function (ret, data)
	{
		ret.set_string(this.hex_sha1(data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.SHA1B = function (ret, data)
	{
		ret.set_string(this.b64_sha1(data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.SHA1pass = function (ret, data, charstring)
	{
		ret.set_string(this.any_sha1(data, charstring));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACSHA1 = function (ret, key, data)
	{
		ret.set_string(this.hex_hmac_sha1(key, data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACSHA1B = function (ret, key, data)
	{
		ret.set_string(this.b64_hmac_sha1(key, data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACSHA1pass = function (ret, key, data, charstring)
	{
		ret.set_string(this.any_hmac_sha1(key, data, charstring));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.SHA256 = function (ret, data)
	{
		ret.set_string(this.hex_sha256(data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.SHA256B = function (ret, data)
	{
		ret.set_string(this.b64_sha256(data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.SHA256pass = function (ret, data, charstring)
	{
		ret.set_string(this.any_sha256(data, charstring));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACSHA256 = function (ret, key, data)
	{
		ret.set_string(this.hex_hmac_sha256(key, data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACSHA256B = function (ret, key, data)
	{
		ret.set_string(this.b64_hmac_sha256(key, data));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
	exps.HMACSHA256pass = function (ret, key, data, charstring)
	{
		ret.set_string(this.any_hmac_sha256(key, data, charstring));
		this.runtime.trigger(cr.plugins_.CBhash.prototype.cnds.OnHashed, this);
	};
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * The JavaScript code implementing the algorithm is derived from the C code in RFC 1321 and is covered by the following copyright:
 * License to copy and use this software is granted provided that it is identified as the "RSA Data Security, Inc. MD5 Message-Digest Algorithm" in all material mentioning or referencing this software or this function.
 * License is also granted to make and use derivative works provided that such works are identified as "derived from the RSA Data Security, Inc. MD5 Message-Digest Algorithm" in all material mentioning or referencing the derived work.
 * RSA Data Security, Inc. makes no representations concerning either the merchantability of this software or the suitability of this software for any particular purpose. It is provided "as is" without express or implied warranty of any kind.
 * These notices must be retained in any copies of any part of this documentation and/or software.
 * This copyright does not prohibit distribution of the JavaScript MD5 code under the BSD license.
 */
/*
 * Calculate the MD5 of a raw string
 */
function rstr_md5(s)
{
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}
/*
 * Calculate the HMAC-MD5, of a key and some data (raw strings)
 */
function rstr_hmac_md5(key, data)
{
  var bkey = rstr2binl(key);
  if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);
  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }
  var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}
/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var i, j, q, x, quotient;
  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }
  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. All remainders are stored for later
   * use.
   */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)));
  var remainders = Array(full_length);
  for(j = 0; j < full_length; j++)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[j] = x;
    dividend = quotient;
  }
  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);
  return output;
}
/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;
  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }
    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}
/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}
function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}
/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
  return output;
}
/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
  return output;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
function binl_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
	/*
	* Calculate the SHA1 of a raw string
	*/
	function rstr_sha1(s)
	{
		return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
	}
	/*
	* Calculate the HMAC-SHA1 of a key and some data (raw strings)
	*/
	function rstr_hmac_sha1(key, data)
	{
		var bkey = rstr2binb(key);
		if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);
		var ipad = Array(16), opad = Array(16);
		for(var i = 0; i < 16; i++)
		{
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
		return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
	}
/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}
/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;
  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;
  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;
    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://anmar.eu.org/projects/jssha2/
 */
 /*
 * Calculate the sha256 of a raw string
 */
function rstr_sha256(s)
{
  return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
}
/*
 * Calculate the HMAC-sha256 of a key and some data (raw strings)
 */
function rstr_hmac_sha256(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha256(bkey, key.length * 8);
  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }
  var hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha256(opad.concat(hash), 512 + 256));
}
/*
 * Main sha256 function, with its support functions
 */
function sha256_S (X, n) {return ( X >>> n ) | (X << (32 - n));}
function sha256_R (X, n) {return ( X >>> n );}
function sha256_Ch(x, y, z) {return ((x & y) ^ ((~x) & z));}
function sha256_Maj(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}
function sha256_Sigma0256(x) {return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22));}
function sha256_Sigma1256(x) {return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25));}
function sha256_Gamma0256(x) {return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3));}
function sha256_Gamma1256(x) {return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10));}
function sha256_Sigma0512(x) {return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39));}
function sha256_Sigma1512(x) {return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41));}
function sha256_Gamma0512(x) {return (sha256_S(x, 1)  ^ sha256_S(x, 8) ^ sha256_R(x, 7));}
function sha256_Gamma1512(x) {return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6));}
var sha256_K = new Array
(
  1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
  -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
  1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
  264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
  -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
  113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
  1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
  -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
  430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
  1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
  -1866530822, -1538233109, -1090935817, -965641998
);
function binb_sha256(m, l)
{
  var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534,
                       1359893119, -1694144372, 528734635, 1541459225);
  var W = new Array(64);
  var a, b, c, d, e, f, g, h;
  var i, j, T1, T2;
  /* append padding */
  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;
  for(i = 0; i < m.length; i += 16)
  {
    a = HASH[0];
    b = HASH[1];
    c = HASH[2];
    d = HASH[3];
    e = HASH[4];
    f = HASH[5];
    g = HASH[6];
    h = HASH[7];
    for(j = 0; j < 64; j++)
    {
      if (j < 16) W[j] = m[j + i];
      else W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                                            sha256_Gamma0256(W[j - 15])), W[j - 16]);
      T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
                                                          sha256_K[j]), W[j]);
      T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
      h = g;
      g = f;
      f = e;
      e = safe_add(d, T1);
      d = c;
      c = b;
      b = a;
      a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]);
    HASH[1] = safe_add(b, HASH[1]);
    HASH[2] = safe_add(c, HASH[2]);
    HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]);
    HASH[5] = safe_add(f, HASH[5]);
    HASH[6] = safe_add(g, HASH[6]);
    HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
}
}());
;
;
cr.plugins_.Dictionary = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Dictionary.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.dictionary = {};
		this.cur_key = "";		// current key in for-each loop
		this.key_count = 0;
	};
	instanceProto.saveToJSON = function ()
	{
		return this.dictionary;
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.dictionary = o;
		this.key_count = 0;
		for (var p in this.dictionary)
		{
			if (this.dictionary.hasOwnProperty(p))
				this.key_count++;
		}
	};
	function Cnds() {};
	Cnds.prototype.CompareValue = function (key_, cmp_, value_)
	{
		return cr.do_cmp(this.dictionary[key_], cmp_, value_);
	};
	Cnds.prototype.ForEachKey = function ()
	{
		var current_event = this.runtime.getCurrentEventStack().current_event;
		for (var p in this.dictionary)
		{
			if (this.dictionary.hasOwnProperty(p))
			{
				this.cur_key = p;
				this.runtime.pushCopySol(current_event.solModifiers);
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		this.cur_key = "";
		return false;
	};
	Cnds.prototype.CompareCurrentValue = function (cmp_, value_)
	{
		return cr.do_cmp(this.dictionary[this.cur_key], cmp_, value_);
	};
	Cnds.prototype.HasKey = function (key_)
	{
		return this.dictionary.hasOwnProperty(key_);
	};
	Cnds.prototype.IsEmpty = function ()
	{
		return this.key_count === 0;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.AddKey = function (key_, value_)
	{
		if (!this.dictionary.hasOwnProperty(key_))
			this.key_count++;
		this.dictionary[key_] = value_;
	};
	Acts.prototype.SetKey = function (key_, value_)
	{
		if (this.dictionary.hasOwnProperty(key_))
			this.dictionary[key_] = value_;
	};
	Acts.prototype.DeleteKey = function (key_)
	{
		if (this.dictionary.hasOwnProperty(key_))
		{
			delete this.dictionary[key_];
			this.key_count--;
		}
	};
	Acts.prototype.Clear = function ()
	{
		cr.wipe(this.dictionary);		// avoid garbaging
		this.key_count = 0;
	};
	Acts.prototype.JSONLoad = function (json_)
	{
		var o;
		try {
			o = JSON.parse(json_);
		}
		catch(e) { return; }
		if (!o["c2dictionary"])		// presumably not a c2dictionary object
			return;
		this.dictionary = o["data"];
		this.key_count = 0;
		for (var p in this.dictionary)
		{
			if (this.dictionary.hasOwnProperty(p))
				this.key_count++;
		}
	};
	Acts.prototype.JSONDownload = function (filename)
	{
		var a = document.createElement("a");
		if (typeof a.download === "undefined")
		{
			var str = 'data:text/html,' + encodeURIComponent("<p><a download='data.json' href=\"data:application/json,"
				+ encodeURIComponent(JSON.stringify({
						"c2dictionary": true,
						"data": this.dictionary
					}))
				+ "\">Download link</a></p>");
			window.open(str);
		}
		else
		{
			var body = document.getElementsByTagName("body")[0];
			a.textContent = filename;
			a.href = "data:application/json," + encodeURIComponent(JSON.stringify({
						"c2dictionary": true,
						"data": this.dictionary
					}));
			a.download = filename;
			body.appendChild(a);
			var clickEvent = document.createEvent("MouseEvent");
			clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(clickEvent);
			body.removeChild(a);
		}
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Get = function (ret, key_)
	{
		if (this.dictionary.hasOwnProperty(key_))
			ret.set_any(this.dictionary[key_]);
		else
			ret.set_int(0);
	};
	Exps.prototype.KeyCount = function (ret)
	{
		ret.set_int(this.key_count);
	};
	Exps.prototype.CurrentKey = function (ret)
	{
		ret.set_string(this.cur_key);
	};
	Exps.prototype.CurrentValue = function (ret)
	{
		if (this.dictionary.hasOwnProperty(this.cur_key))
			ret.set_any(this.dictionary[this.cur_key]);
		else
			ret.set_int(0);
	};
	Exps.prototype.AsJSON = function (ret)
	{
		ret.set_string(JSON.stringify({
			"c2dictionary": true,
			"data": this.dictionary
		}));
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Function = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Function.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var funcStack = [];
	var funcStackPtr = -1;
	var isInPreview = false;	// set in onCreate
	function FuncStackEntry()
	{
		this.name = "";
		this.retVal = 0;
		this.params = [];
	};
	function pushFuncStack()
	{
		funcStackPtr++;
		if (funcStackPtr === funcStack.length)
			funcStack.push(new FuncStackEntry());
		return funcStack[funcStackPtr];
	};
	function getCurrentFuncStack()
	{
		if (funcStackPtr < 0)
			return null;
		return funcStack[funcStackPtr];
	};
	function getOneAboveFuncStack()
	{
		if (!funcStack.length)
			return null;
		var i = funcStackPtr + 1;
		if (i >= funcStack.length)
			i = funcStack.length - 1;
		return funcStack[i];
	};
	function popFuncStack()
	{
;
		funcStackPtr--;
	};
	instanceProto.onCreate = function()
	{
		isInPreview = (typeof cr_is_preview !== "undefined");
		var self = this;
		window["c2_callFunction"] = function (name_, params_)
		{
			var i, len, v;
			var fs = pushFuncStack();
			fs.name = name_.toLowerCase();
			fs.retVal = 0;
			if (params_)
			{
				fs.params.length = params_.length;
				for (i = 0, len = params_.length; i < len; ++i)
				{
					v = params_[i];
					if (typeof v === "number" || typeof v === "string")
						fs.params[i] = v;
					else if (typeof v === "boolean")
						fs.params[i] = (v ? 1 : 0);
					else
						fs.params[i] = 0;
				}
			}
			else
			{
				cr.clearArray(fs.params);
			}
			self.runtime.trigger(cr.plugins_.Function.prototype.cnds.OnFunction, self, fs.name);
			popFuncStack();
			return fs.retVal;
		};
	};
	function Cnds() {};
	Cnds.prototype.OnFunction = function (name_)
	{
		var fs = getCurrentFuncStack();
		if (!fs)
			return false;
		return cr.equals_nocase(name_, fs.name);
	};
	Cnds.prototype.CompareParam = function (index_, cmp_, value_)
	{
		var fs = getCurrentFuncStack();
		if (!fs)
			return false;
		index_ = cr.floor(index_);
		if (index_ < 0 || index_ >= fs.params.length)
			return false;
		return cr.do_cmp(fs.params[index_], cmp_, value_);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.CallFunction = function (name_, params_)
	{
		var fs = pushFuncStack();
		fs.name = name_.toLowerCase();
		fs.retVal = 0;
		cr.shallowAssignArray(fs.params, params_);
		var ran = this.runtime.trigger(cr.plugins_.Function.prototype.cnds.OnFunction, this, fs.name);
		if (isInPreview && !ran)
		{
;
		}
		popFuncStack();
	};
	Acts.prototype.SetReturnValue = function (value_)
	{
		var fs = getCurrentFuncStack();
		if (fs)
			fs.retVal = value_;
		else
;
	};
	Acts.prototype.CallExpression = function (unused)
	{
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ReturnValue = function (ret)
	{
		var fs = getOneAboveFuncStack();
		if (fs)
			ret.set_any(fs.retVal);
		else
			ret.set_int(0);
	};
	Exps.prototype.ParamCount = function (ret)
	{
		var fs = getCurrentFuncStack();
		if (fs)
			ret.set_int(fs.params.length);
		else
		{
;
			ret.set_int(0);
		}
	};
	Exps.prototype.Param = function (ret, index_)
	{
		index_ = cr.floor(index_);
		var fs = getCurrentFuncStack();
		if (fs)
		{
			if (index_ >= 0 && index_ < fs.params.length)
			{
				ret.set_any(fs.params[index_]);
			}
			else
			{
;
				ret.set_int(0);
			}
		}
		else
		{
;
			ret.set_int(0);
		}
	};
	Exps.prototype.Call = function (ret, name_)
	{
		var fs = pushFuncStack();
		fs.name = name_.toLowerCase();
		fs.retVal = 0;
		cr.clearArray(fs.params);
		var i, len;
		for (i = 2, len = arguments.length; i < len; i++)
			fs.params.push(arguments[i]);
		var ran = this.runtime.trigger(cr.plugins_.Function.prototype.cnds.OnFunction, this, fs.name);
		if (isInPreview && !ran)
		{
;
		}
		popFuncStack();
		ret.set_any(fs.retVal);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.JSON = function(runtime)
{
    this.runtime = runtime;
    this.references = {};
};
(function ()
{
    /*! (C) WebReflection Mit Style License */
    var CircularJSON=function(e,t){function l(e,t,o){var u=[],f=[e],l=[e],c=[o?n:"[Circular]"],h=e,p=1,d;return function(e,v){return t&&(v=t.call(this,e,v)),e!==""&&(h!==this&&(d=p-a.call(f,this)-1,p-=d,f.splice(p,f.length),u.splice(p-1,u.length),h=this),typeof v=="object"&&v?(a.call(f,v)<0&&f.push(h=v),p=f.length,d=a.call(l,v),d<0?(d=l.push(v)-1,o?(u.push((""+e).replace(s,r)),c[d]=n+u.join(n)):c[d]=c[0]):v=c[d]):typeof v=="string"&&o&&(v=v.replace(r,i).replace(n,r))),v}}function c(e,t){for(var r=0,i=t.length;r<i;e=e[t[r++].replace(o,n)]);return e}function h(e){return function(t,s){var o=typeof s=="string";return o&&s.charAt(0)===n?new f(s.slice(1)):(t===""&&(s=v(s,s,{})),o&&(s=s.replace(u,"$1"+n).replace(i,r)),e?e.call(this,t,s):s)}}function p(e,t,n){for(var r=0,i=t.length;r<i;r++)t[r]=v(e,t[r],n);return t}function d(e,t,n){for(var r in t)t.hasOwnProperty(r)&&(t[r]=v(e,t[r],n));return t}function v(e,t,r){return t instanceof Array?p(e,t,r):t instanceof f?t.length?r.hasOwnProperty(t)?r[t]:r[t]=c(e,t.split(n)):e:t instanceof Object?d(e,t,r):t}function m(t,n,r,i){return e.stringify(t,l(t,n,!i),r)}function g(t,n){return e.parse(t,h(n))}var n="~",r="\\x"+("0"+n.charCodeAt(0).toString(16)).slice(-2),i="\\"+r,s=new t(r,"g"),o=new t(i,"g"),u=new t("(?:^|([^\\\\]))"+i),a=[].indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},f=String;return{stringify:m,parse:g}}(JSON,RegExp);
    var pluginProto = cr.plugins_.JSON.prototype;
    pluginProto.Type = function(plugin)
    {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };
    var typeProto = pluginProto.Type.prototype;
    typeProto.onCreate = function()
    {
    };
    pluginProto.Instance = function(type)
    {
        this.type = type;
        this.runtime = type.runtime;
    };
    var instanceProto = pluginProto.Instance.prototype;
    var ROOT_KEY = "root";
    instanceProto.onCreate = function()
    {
        this.data = {};
        this.curKey = "";
        this.curValue = undefined;
        this.curPath = [];
    };
    instanceProto.onDestroy = function ()
    {
        this.data     = null;
        this.curKey   = null;
        this.curPath  = null;
        this.curValue = null;
        var ref = this.type.plugin.references;
        for (var name in ref) {
            if (Object.prototype.hasOwnProperty.call(ref,name) &&
                ref[name].origin === this) {
                delete ref[name];
            }
        }
    };
    instanceProto.saveToJSON = function ()
    {
        return this.data[ROOT_KEY];
    };
    instanceProto.loadFromJSON = function (o)
    {
        this.data[ROOT_KEY] = o;
    };
    function logInvalidPath(path) {}
    /**helper functions**/
    instanceProto.getValueFromPath = function(from_current, path) {
        if (from_current) {
            return this.getValueFromPath(
                    false,
                    this.curPath.concat(path)
                );
        } else {
            var path_ = [ROOT_KEY].concat(path);
            var value = this.data;
            for (var i = 0; i < path_.length; i++) {
                if (value === undefined) {
                    logInvalidPath(path);
                    break;
                } else if (value === null) {
                    if (i < path_.length - 1) {
                        logInvalidPath(path);
                        value = undefined;
                    }
                    break;
                } else {
                    value = value[path_[i]];
                }
            }
            return value;
        }
    };
    instanceProto.setValueFromPath = function(from_current, path, value) {
        if (from_current) {
            value = this.setValueFromPath(
                        false,
                        this.curPath.concat(path),
                        value
                    );
        } else {
            var path_ = [ROOT_KEY].concat(path);
            var obj   = this.data;
            for (var i = 0; i < path_.length; i++) {
                if (isCollection(obj)) {
                    if(i < path_.length-1) {
                        obj = obj[path_[i]];   // moving along
                    } else {
                        obj[path_[i]] = value; // silently create a new property if doesn't exist yet
                    }
                } else {
                    logInvalidPath(path);
                    return;
                }
            }
        }
    };
    function isCollection(obj) {
      return type(obj) === "array" || type(obj) === "object";
    }
    function type(value) {
        if (value === undefined) {
            return "undefined";
        } else if (value === null) {
            return "null";
        } else if (value === !!value) {
            return "boolean";
        } else if (Object.prototype.toString.call(value) === "[object Number]") {
            return "number";
        } else if (Object.prototype.toString.call(value) === "[object String]") {
            return "string";
        } else if (Object.prototype.toString.call(value) === "[object Array]") {
            return "array";
        } else if (Object.prototype.toString.call(value) === "[object Object]") {
            return "object";
        }
    }
    function Cnds() {}
    Cnds.prototype.OnJSONParseError = function ()
    {
        return true;
    };
    Cnds.prototype.IsObject = function (from_current,path)
    {
        var value = this.getValueFromPath(from_current === 1, path);
        return type(value) === "object";
    };
    Cnds.prototype.IsArray = function (from_current,path)
    {
        var value = this.getValueFromPath(from_current === 1, path);
        return type(value) === "array";
    };
    Cnds.prototype.IsBoolean = function (from_current,path)
    {
        var value = this.getValueFromPath(from_current === 1, path);
        return type(value) === "boolean";
    };
    Cnds.prototype.IsNumber = function (from_current,path)
    {
        var value = this.getValueFromPath(from_current === 1, path);
        return type(value) === "number";
    };
    Cnds.prototype.IsString = function (from_current,path)
    {
        var value = this.getValueFromPath(from_current === 1, path);
        return type(value) === "string";
    };
    Cnds.prototype.IsNull = function (from_current,path)
    {
        var value = this.getValueFromPath(from_current === 1, path);
        return type(value) === "null";
    };
    Cnds.prototype.IsUndefined = function (from_current,path)
    {
        var value = this.getValueFromPath(from_current === 1, path);
        return value === undefined;
    };
    Cnds.prototype.IsEmpty = function (from_current,path)
    {
        var value = this.getValueFromPath(from_current === 1, path);
        var t = type(value);
        if (t === "array") {
            return value.length === 0;
        } else if (t === "object") {
            for (var p in value){
                if (Object.prototype.hasOwnProperty.call(value,p)) {
                    return false;
                }
            }
            return true;
        } else {
            return value === undefined; // any value other than undefined is considered not empty
        }
    };
    Cnds.prototype.ForEachProperty = function (from_current,path)
    {
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
        var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var lastPath = this.curPath; // keep a reference to the original Current Path
        var path_;
        if(from_current === 1 ) {
            path_ = this.curPath.concat(path);
        } else {
            path_ = path;
        }
        var obj = this.getValueFromPath(false,path_);
        var p;
        if (solModifierAfterCnds) {
            for (p in obj) {
                if (Object.prototype.hasOwnProperty.call(obj,p)) {
                    this.curPath = path_.concat(p);
                    this.curKey = p;
                    this.curValue = obj[p];
                    this.runtime.pushCopySol(current_event.solModifiers);
                    current_event.retrigger();
                    this.runtime.popSol(current_event.solModifiers);
                    if (current_loop.stopped) {
                        break;
                    }
                }
            }
        } else {
            for (p in obj) {
                if (Object.prototype.hasOwnProperty.call(obj,p)) {
                    this.curPath = path_.concat(p);
                    this.curKey = p;
                    this.curValue = obj[p];
                    current_event.retrigger();
                    if (current_loop.stopped) {
                        break;
                    }
                }
            }
        }
        this.curPath  = lastPath;
        this.curKey   = "";
        this.curValue = undefined;
        this.runtime.popLoopStack();
        return false;
    };
    Cnds.prototype.ReferenceExists = function (name)
    {
      return name in this.type.plugin.references;
    };
    pluginProto.cnds = new Cnds();
    function Acts() {}
    Acts.prototype.NewObject = function (from_current,path)
    {
        this.setValueFromPath(from_current,path,{});
    };
    Acts.prototype.NewArray = function (from_current,path)
    {
        this.setValueFromPath(from_current,path,[]);
    };
    Acts.prototype.SetValue = function (value,from_current,path)
    {
        this.setValueFromPath(from_current,path,value);
    };
    Acts.prototype.SetBoolean = function (value,from_current,path)
    {
        this.setValueFromPath(from_current,path,value === 0);
    };
    Acts.prototype.SetNull = function (from_current,path)
    {
        this.setValueFromPath(from_current,path,null);
    };
    Acts.prototype.Delete = function (from_current,path)
    {
        var path_;
        if(from_current) {
            path_ = this.curPath.concat(path);
        } else {
            path_ = path;
        }
        function deleteIfValid(obj,prop) {
            if ( obj !== undefined && obj !== null) {
                if (type(obj) === "object" && obj[prop] !== undefined){
                    delete obj[prop];
                } else if (type(obj) === "array" && type(prop) === "number") {
                    obj.splice(Math.floor(prop),1);
                }
            } else {
                logInvalidPath(path_);
            }
        }
        if (path_.length === 0) {
            deleteIfValid(this.data,ROOT_KEY);
        } else {
            deleteIfValid(
                this.getValueFromPath(
                    false,
                    path_.slice(0,path_.length-1) // go through all property but the last one
                ),
                path_[path_.length-1]
            );
        }
    };
    Acts.prototype.Clear = function (from_current,path)
    {
        var path_;
        if(from_current) {
            path_ = this.curPath.concat(path);
        } else {
            path_ = path;
        }
        function clearIfValid(obj,prop) {
            if ( obj !== undefined && obj !== null &&
                 (typeof obj === "object")){
                var t = type(obj[prop]);
                if(t === "array") {
                    obj[prop].length = 0;
                } else if (t === "object") {
                    for (var p in obj[prop]){
                        if (Object.prototype.hasOwnProperty.call(obj[prop],p)) {
                            delete obj[prop][p];
                        }
                    }
                } else {
                    delete obj[prop]; // in this case it's working like Delete
                }
            } else {
                logInvalidPath(path_);
            }
        }
        if (path_.length === 0) {
            clearIfValid(this.data,ROOT_KEY);
        } else {
            clearIfValid(
                this.getValueFromPath(
                    false,
                    path_.slice(0,path_.length-1) // go through all property but the last one
                ),
                path_[path_.length-1]
            );
        }
    };
    instanceProto.LoadJSON = function(json,from_current,path) {
        try {
            this.setValueFromPath(from_current,path,CircularJSON.parse(json));
        } catch (e) {
            console.warn("LoadJSON error:",e);
            this.runtime.trigger(cr.plugins_.JSON.prototype.cnds.OnJSONParseError, this);
        }
    };
    Acts.prototype.LoadJSON = function (json,from_current,path)
    {
        this.LoadJSON(json,from_current,path);
    };
    Acts.prototype.LogData = function ()
    {
        var grouping = console.groupCollapsed !== undefined && console.groupEnd !== undefined;
        if(grouping) {
            console.groupCollapsed(ROOT_KEY+":");
            console.log(CircularJSON.stringify(this.data[ROOT_KEY],null,2));
            console.groupEnd();
        } else {
            console.log(ROOT_KEY+":",CircularJSON.stringify(this.data[ROOT_KEY],null,2));
        }
        console.log("Current Path:", CircularJSON.stringify(this.curPath));
        if (grouping) {
            console.group("References:");
        } else {
            console.log("References:");
        }
        var ref = this.type.plugin.references;
        for (var name in ref) {
            if (Object.prototype.hasOwnProperty.call(ref,name)) {
                if(grouping) {
                    console.groupCollapsed(name);
                    console.log(CircularJSON.stringify(ref[name].value,null,2));
                    console.groupEnd();
                } else {
                    console.log("["+name+"]",CircularJSON.stringify(ref[name].value,null,2));
                }
            }
        }
        if (grouping) {
            console.groupEnd();
        }
        console.log(""); // just a blank line for clarity
    };
    Acts.prototype.SetCurrentPath = function(from_current,path) {
        if(from_current) {
            this.curPath = this.curPath.concat(path);
        } else {
            this.curPath = path.slice();
        }
    };
    Acts.prototype.PushPathNode = function(node) {
        this.curPath.push(node);
    };
    Acts.prototype.PopPathNode = function() {
        this.curPath.pop();
    };
    Acts.prototype.SaveReference = function(name,from_current,path) {
        this.type.plugin.references[name] = {
            value: this.getValueFromPath(from_current===1, path),
            origin: this
        };
    };
    Acts.prototype.LoadReference = function(name,from_current,path) {
        this.setValueFromPath(from_current===1,path,this.type.plugin.references[name].value);
    };
    Acts.prototype.DeleteReference = function(name) {
        delete this.type.plugin.references[name];
    };
    Acts.prototype.DeleteAllReferences = function(name) {
        this.type.plugin.references = {};
    };
    pluginProto.acts = new Acts();
    function Exps() {}
    Exps.prototype.Size = function (ret)
    {
        var path = Array.prototype.slice.call(arguments);
        path.shift(); // ret
        var from_current = path.shift();
        var value = this.getValueFromPath(from_current===1,path);
        var t = type(value);
        if (t === "array") {
            ret.set_int(value.length);
        } else if (t === "object") {
            var size = 0;
            for (var p in value)
            {
                if (Object.prototype.hasOwnProperty.call(value,p)) {
                    size++;
                }
            }
            ret.set_int(size);
        } else {
            ret.set_int(-1);
        }
    };
    Exps.prototype.Length = Exps.prototype.Size; // deprecated
    Exps.prototype.Value = function (ret)
    {
        var path = Array.prototype.slice.call(arguments);
        path.shift();
        var from_current = path.shift();
        var value = this.getValueFromPath(from_current===1,path);
        var t = type(value);
        if (t === "number" || t === "string") {
            ret.set_any(value);
        } else if (t === "boolean") {
            ret.set_any((value) ? 1 : 0);
        } else {
            ret.set_any(t);
        }
    };
    Exps.prototype.AsJson = function (ret)
    {
        var path = Array.prototype.slice.call(arguments);
        path.shift();
        var from_current = path.shift();
        var value = this.getValueFromPath(from_current===1,path);
        var t = type(value);
        if(t === "undefined") {
            ret.set_string(t);
        } else {
            ret.set_string(CircularJSON.stringify(value));
        }
    };
    Exps.prototype.ToJson = Exps.prototype.AsJson; // deprecated
    Exps.prototype.TypeOf = function (ret)
    {
        var path = Array.prototype.slice.call(arguments);
        path.shift();
        var from_current = path.shift();
        var value = this.getValueFromPath(from_current===1,path);
        ret.set_string(type(value));
    };
    Exps.prototype.CurrentKey = function (ret)
    {
        ret.set_string(this.curKey);
    };
    Exps.prototype.CurrentValue = function (ret)
    {
        var value = this.curValue;
        var t = type(value);
        if (t === "number" || t === "string") {
            ret.set_any(value);
        } else if (t === "boolean") {
            ret.set_any((value) ? 1 : 0);
        } else {
            ret.set_any(t);
        }
    };
    pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Keyboard = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Keyboard.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.keyMap = new Array(256);	// stores key up/down state
		this.usedKeys = new Array(256);
		this.triggerKey = 0;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		if (!this.runtime.isDomFree)
		{
			jQuery(document).keydown(
				function(info) {
					self.onKeyDown(info);
				}
			);
			jQuery(document).keyup(
				function(info) {
					self.onKeyUp(info);
				}
			);
		}
	};
	var keysToBlockWhenFramed = [32, 33, 34, 35, 36, 37, 38, 39, 40, 44];
	instanceProto.onKeyDown = function (info)
	{
		var alreadyPreventedDefault = false;
		if (window != window.top && keysToBlockWhenFramed.indexOf(info.which) > -1)
		{
			info.preventDefault();
			alreadyPreventedDefault = true;
			info.stopPropagation();
		}
		if (this.keyMap[info.which])
		{
			if (this.usedKeys[info.which] && !alreadyPreventedDefault)
				info.preventDefault();
			return;
		}
		this.keyMap[info.which] = true;
		this.triggerKey = info.which;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKey, this);
		var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKey, this);
		var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCode, this);
		this.runtime.isInUserInputEvent = false;
		if (eventRan || eventRan2)
		{
			this.usedKeys[info.which] = true;
			if (!alreadyPreventedDefault)
				info.preventDefault();
		}
	};
	instanceProto.onKeyUp = function (info)
	{
		this.keyMap[info.which] = false;
		this.triggerKey = info.which;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKeyReleased, this);
		var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyReleased, this);
		var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCodeReleased, this);
		this.runtime.isInUserInputEvent = false;
		if (eventRan || eventRan2 || this.usedKeys[info.which])
		{
			this.usedKeys[info.which] = true;
			info.preventDefault();
		}
	};
	instanceProto.onWindowBlur = function ()
	{
		var i;
		for (i = 0; i < 256; ++i)
		{
			if (!this.keyMap[i])
				continue;		// key already up
			this.keyMap[i] = false;
			this.triggerKey = i;
			this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKeyReleased, this);
			var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyReleased, this);
			var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCodeReleased, this);
			if (eventRan || eventRan2)
				this.usedKeys[i] = true;
		}
	};
	instanceProto.saveToJSON = function ()
	{
		return { "triggerKey": this.triggerKey };
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.triggerKey = o["triggerKey"];
	};
	function Cnds() {};
	Cnds.prototype.IsKeyDown = function(key)
	{
		return this.keyMap[key];
	};
	Cnds.prototype.OnKey = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.OnAnyKey = function(key)
	{
		return true;
	};
	Cnds.prototype.OnAnyKeyReleased = function(key)
	{
		return true;
	};
	Cnds.prototype.OnKeyReleased = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.IsKeyCodeDown = function(key)
	{
		key = Math.floor(key);
		if (key < 0 || key >= this.keyMap.length)
			return false;
		return this.keyMap[key];
	};
	Cnds.prototype.OnKeyCode = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.OnKeyCodeReleased = function(key)
	{
		return (key === this.triggerKey);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.LastKeyCode = function (ret)
	{
		ret.set_int(this.triggerKey);
	};
	function fixedStringFromCharCode(kc)
	{
		kc = Math.floor(kc);
		switch (kc) {
		case 8:		return "backspace";
		case 9:		return "tab";
		case 13:	return "enter";
		case 16:	return "shift";
		case 17:	return "control";
		case 18:	return "alt";
		case 19:	return "pause";
		case 20:	return "capslock";
		case 27:	return "esc";
		case 33:	return "pageup";
		case 34:	return "pagedown";
		case 35:	return "end";
		case 36:	return "home";
		case 37:	return "←";
		case 38:	return "↑";
		case 39:	return "→";
		case 40:	return "↓";
		case 45:	return "insert";
		case 46:	return "del";
		case 91:	return "left window key";
		case 92:	return "right window key";
		case 93:	return "select";
		case 96:	return "numpad 0";
		case 97:	return "numpad 1";
		case 98:	return "numpad 2";
		case 99:	return "numpad 3";
		case 100:	return "numpad 4";
		case 101:	return "numpad 5";
		case 102:	return "numpad 6";
		case 103:	return "numpad 7";
		case 104:	return "numpad 8";
		case 105:	return "numpad 9";
		case 106:	return "numpad *";
		case 107:	return "numpad +";
		case 109:	return "numpad -";
		case 110:	return "numpad .";
		case 111:	return "numpad /";
		case 112:	return "F1";
		case 113:	return "F2";
		case 114:	return "F3";
		case 115:	return "F4";
		case 116:	return "F5";
		case 117:	return "F6";
		case 118:	return "F7";
		case 119:	return "F8";
		case 120:	return "F9";
		case 121:	return "F10";
		case 122:	return "F11";
		case 123:	return "F12";
		case 144:	return "numlock";
		case 145:	return "scroll lock";
		case 186:	return ";";
		case 187:	return "=";
		case 188:	return ",";
		case 189:	return "-";
		case 190:	return ".";
		case 191:	return "/";
		case 192:	return "'";
		case 219:	return "[";
		case 220:	return "\\";
		case 221:	return "]";
		case 222:	return "#";
		case 223:	return "`";
		default:	return String.fromCharCode(kc);
		}
	};
	Exps.prototype.StringFromKeyCode = function (ret, kc)
	{
		ret.set_string(fixedStringFromCharCode(kc));
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.List = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.List.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[PlotyXD] List plugin not supported on this platform - the object will not be created");
			return;
		}
		this.elem = document.createElement("select");
		this.elem.id = this.properties[7];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		this.elem.title = this.properties[1];
		this.elem.disabled = (this.properties[3] === 0);
		if (this.properties[4] === 0)
			this.elem.size = 2;
		this.elem["multiple"] = (this.properties[5] !== 0);
		this.autoFontSize = (this.properties[6] !== 0);
		if (this.properties[2] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
		}
		if (this.properties[0])
		{
			var itemsArr = this.properties[0].split(";");
			var i, len, o;
			for (i = 0, len = itemsArr.length; i < len; i++)
			{
				o = document.createElement("option");
				o.text = itemsArr[i];
				this.elem.add(o);
			}
		}
		var self = this;
		this.elem.onchange = function() {
				self.runtime.trigger(cr.plugins_.List.prototype.cnds.OnSelectionChanged, self);
			};
		this.elem.onclick = function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.List.prototype.cnds.OnClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		this.elem.ondblclick = function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.List.prototype.cnds.OnDoubleClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		this.isVisible = true;
		this.updatePosition(true);
		this.runtime.tickMe(this);
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"tooltip": this.elem.title,
			"disabled": !!this.elem.disabled,
			"items": [],
			"sel": []
		};
		var i, len;
		var itemsarr = o["items"];
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			itemsarr.push(this.elem.options[i].text);
		}
		var selarr = o["sel"];
		if (this.elem["multiple"])
		{
			for (i = 0, len = this.elem.length; i < len; i++)
			{
				if (this.elem.options[i].selected)
					selarr.push(i);
			}
		}
		else
		{
			selarr.push(this.elem["selectedIndex"]);
		}
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.title = o["tooltip"];
		this.elem.disabled = o["disabled"];
		var itemsarr = o["items"];
		while (this.elem.length)
			this.elem.remove(this.elem.length - 1);
		var i, len, opt;
		for (i = 0, len = itemsarr.length; i < len; i++)
		{
			opt = document.createElement("option");
			opt.text = itemsarr[i];
			this.elem.add(opt);
		}
		var selarr = o["sel"];
		if (this.elem["multiple"])
		{
			for (i = 0, len = selarr.length; i < len; i++)
			{
				if (selarr[i] < this.elem.length)
					this.elem.options[selarr[i]].selected = true;
			}
		}
		else if (selarr.length >= 1)
		{
			this.elem["selectedIndex"] = selarr[0];
		}
	};
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
				return;
		jQuery(this.elem).remove();
		this.elem = null;
	};
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		var rightEdge = this.runtime.width / this.runtime.devicePixelRatio;
		var bottomEdge = this.runtime.height / this.runtime.devicePixelRatio;
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= rightEdge || top >= bottomEdge)
		{
			if (this.isVisible)
				jQuery(this.elem).hide();
			this.isVisible = false;
			return;
		}
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= rightEdge)
			right = rightEdge - 1;
		if (bottom >= bottomEdge)
			bottom = bottomEdge - 1;
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (!this.isVisible)
			{
				jQuery(this.elem).show();
				this.isVisible = true;
			}
			return;
		}
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		if (!this.isVisible)
		{
			jQuery(this.elem).show();
			this.isVisible = true;
		}
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
		if (this.autoFontSize)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function(glw)
	{
	};
	function Cnds() {};
	Cnds.prototype.CompareSelection = function (cmp_, x_)
	{
		return cr.do_cmp(this.elem["selectedIndex"], cmp_, x_);
	};
	Cnds.prototype.OnSelectionChanged = function ()
	{
		return true;
	};
	Cnds.prototype.OnClicked = function ()
	{
		return true;
	};
	Cnds.prototype.OnDoubleClicked = function ()
	{
		return true;
	};
	Cnds.prototype.CompareSelectedText = function (x_, case_)
	{
		var selected_text = "";
		var i = this.elem["selectedIndex"];
		if (i < 0 || i >= this.elem.length)
			return false;
		selected_text = this.elem.options[i].text;
		if (case_)
			return selected_text == x_;
		else
			return cr.equals_nocase(selected_text, x_);
	};
	Cnds.prototype.CompareTextAt = function (i_, x_, case_)
	{
		var text = "";
		var i = Math.floor(i_);
		if (i < 0 || i >= this.elem.length)
			return false;
		text = this.elem.options[i].text;
		if (case_)
			return text == x_;
		else
			return cr.equals_nocase(text,x_);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Select = function (i)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem["selectedIndex"] = i;
	};
	Acts.prototype.SetTooltip = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.title = text;
	};
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		this.visible = (vis !== 0);
	};
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.disabled = (en === 0);
	};
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.focus();
	};
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.blur();
	};
	Acts.prototype.SetCSSStyle = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
		jQuery(this.elem).css(p, v);
	};
	Acts.prototype.AddItem = function (text_)
	{
		if (this.runtime.isDomFree)
			return;
		var o = document.createElement("option");
		o.text = text_;
		this.elem.add(o);
	};
	Acts.prototype.AddItemAt = function (index_, text_)
	{
		if (this.runtime.isDomFree)
			return;
		index_ = Math.floor(index_);
		if (index_ < 0)
			index_ = 0;
		var o = document.createElement("option");
		o.text = text_;
		if (index_ >= this.elem.length)
			this.elem.add(o);
		else
		{
			this.elem.add(o, this.elem.options[index_]);
		}
	};
	Acts.prototype.Remove = function (index_)
	{
		if (this.runtime.isDomFree)
			return;
		index_ = Math.floor(index_);
		this.elem.remove(index_);
	};
	Acts.prototype.SetItemText = function (index_, text_)
	{
		if (this.runtime.isDomFree)
			return;
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= this.elem.length)
			return;
		this.elem.options[index_].text = text_;
	};
	Acts.prototype.Clear = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.innerHTML = "";
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ItemCount = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		ret.set_int(this.elem.length);
	};
	Exps.prototype.ItemTextAt = function (ret, i)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		i = Math.floor(i);
		if (i < 0 || i >= this.elem.length)
		{
			ret.set_string("");
			return;
		}
		ret.set_string(this.elem.options[i].text);
	};
	Exps.prototype.SelectedIndex = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		ret.set_int(this.elem["selectedIndex"]);
	};
	Exps.prototype.SelectedText = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		var i = this.elem["selectedIndex"];
		if (i < 0 || i >= this.elem.length)
		{
			ret.set_string("");
			return;
		}
		ret.set_string(this.elem.options[i].text);
	};
	Exps.prototype.SelectedCount = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		var i, len, count = 0;
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			if (this.elem.options[i].selected)
				count++;
		}
		ret.set_int(count);
	};
	Exps.prototype.SelectedIndexAt = function (ret, index_)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		index_ = Math.floor(index_);
		var i, len, count = 0, result = 0;
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			if (this.elem.options[i].selected)
			{
				if (count === index_)
				{
					result = i;
					break;
				}
				count++;
			}
		}
		ret.set_int(result);
	};
	Exps.prototype.SelectedTextAt = function (ret, index_)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		index_ = Math.floor(index_);
		var i, len, count = 0, result = "";
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			if (this.elem.options[i].selected)
			{
				if (count === index_)
				{
					result = this.elem.options[i].text;
					break;
				}
				count++;
			}
		}
		ret.set_string(result);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Mouse = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Mouse.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.buttonMap = new Array(4);		// mouse down states
		this.mouseXcanvas = 0;				// mouse position relative to canvas
		this.mouseYcanvas = 0;
		this.triggerButton = 0;
		this.triggerType = 0;
		this.triggerDir = 0;
		this.handled = false;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		if (!this.runtime.isDomFree)
		{
			jQuery(document).mousemove(
				function(info) {
					self.onMouseMove(info);
				}
			);
			jQuery(document).mousedown(
				function(info) {
					self.onMouseDown(info);
				}
			);
			jQuery(document).mouseup(
				function(info) {
					self.onMouseUp(info);
				}
			);
			jQuery(document).dblclick(
				function(info) {
					self.onDoubleClick(info);
				}
			);
			var wheelevent = function(info) {
								self.onWheel(info);
							};
			document.addEventListener("mousewheel", wheelevent, false);
			document.addEventListener("DOMMouseScroll", wheelevent, false);
		}
	};
	var dummyoffset = {left: 0, top: 0};
	instanceProto.onMouseMove = function(info)
	{
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		this.mouseXcanvas = info.pageX - offset.left;
		this.mouseYcanvas = info.pageY - offset.top;
	};
	instanceProto.mouseInGame = function ()
	{
		if (this.runtime.fullscreen_mode > 0)
			return true;
		return this.mouseXcanvas >= 0 && this.mouseYcanvas >= 0
		    && this.mouseXcanvas < this.runtime.width && this.mouseYcanvas < this.runtime.height;
	};
	instanceProto.onMouseDown = function(info)
	{
		if (!this.mouseInGame())
			return;
		this.buttonMap[info.which] = true;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnAnyClick, this);
		this.triggerButton = info.which - 1;	// 1-based
		this.triggerType = 0;					// single click
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnClick, this);
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnObjectClicked, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onMouseUp = function(info)
	{
		if (!this.buttonMap[info.which])
			return;
		if (this.runtime.had_a_click && !this.runtime.isMobile)
			info.preventDefault();
		this.runtime.had_a_click = true;
		this.buttonMap[info.which] = false;
		this.runtime.isInUserInputEvent = true;
		this.triggerButton = info.which - 1;	// 1-based
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnRelease, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onDoubleClick = function(info)
	{
		if (!this.mouseInGame())
			return;
		info.preventDefault();
		this.runtime.isInUserInputEvent = true;
		this.triggerButton = info.which - 1;	// 1-based
		this.triggerType = 1;					// double click
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnClick, this);
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnObjectClicked, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onWheel = function (info)
	{
		var delta = info.wheelDelta ? info.wheelDelta : info.detail ? -info.detail : 0;
		this.triggerDir = (delta < 0 ? 0 : 1);
		this.handled = false;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnWheel, this);
		this.runtime.isInUserInputEvent = false;
		if (this.handled && cr.isCanvasInputEvent(info))
			info.preventDefault();
	};
	instanceProto.onWindowBlur = function ()
	{
		var i, len;
		for (i = 0, len = this.buttonMap.length; i < len; ++i)
		{
			if (!this.buttonMap[i])
				continue;
			this.buttonMap[i] = false;
			this.triggerButton = i - 1;
			this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnRelease, this);
		}
	};
	function Cnds() {};
	Cnds.prototype.OnClick = function (button, type)
	{
		return button === this.triggerButton && type === this.triggerType;
	};
	Cnds.prototype.OnAnyClick = function ()
	{
		return true;
	};
	Cnds.prototype.IsButtonDown = function (button)
	{
		return this.buttonMap[button + 1];	// jQuery uses 1-based buttons for some reason
	};
	Cnds.prototype.OnRelease = function (button)
	{
		return button === this.triggerButton;
	};
	Cnds.prototype.IsOverObject = function (obj)
	{
		var cnd = this.runtime.getCurrentCondition();
		var mx = this.mouseXcanvas;
		var my = this.mouseYcanvas;
		return cr.xor(this.runtime.testAndSelectCanvasPointOverlap(obj, mx, my, cnd.inverted), cnd.inverted);
	};
	Cnds.prototype.OnObjectClicked = function (button, type, obj)
	{
		if (button !== this.triggerButton || type !== this.triggerType)
			return false;	// wrong click type
		return this.runtime.testAndSelectCanvasPointOverlap(obj, this.mouseXcanvas, this.mouseYcanvas, false);
	};
	Cnds.prototype.OnWheel = function (dir)
	{
		this.handled = true;
		return dir === this.triggerDir;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	var lastSetCursor = null;
	Acts.prototype.SetCursor = function (c)
	{
		if (this.runtime.isDomFree)
			return;
		var cursor_style = ["auto", "pointer", "text", "crosshair", "move", "help", "wait", "none"][c];
		if (lastSetCursor === cursor_style)
			return;		// redundant
		lastSetCursor = cursor_style;
		document.body.style.cursor = cursor_style;
	};
	Acts.prototype.SetCursorSprite = function (obj)
	{
		if (this.runtime.isDomFree || this.runtime.isMobile || !obj)
			return;
		var inst = obj.getFirstPicked();
		if (!inst || !inst.curFrame)
			return;
		var frame = inst.curFrame;
		if (lastSetCursor === frame)
			return;		// already set this frame
		lastSetCursor = frame;
		var datauri = frame.getDataUri();
		var cursor_style = "url(" + datauri + ") " + Math.round(frame.hotspotX * frame.width) + " " + Math.round(frame.hotspotY * frame.height) + ", auto";
		document.body.style.cursor = "";
		document.body.style.cursor = cursor_style;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.X = function (ret, layerparam)
	{
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.Y = function (ret, layerparam)
	{
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.AbsoluteX = function (ret)
	{
		ret.set_float(this.mouseXcanvas);
	};
	Exps.prototype.AbsoluteY = function (ret)
	{
		ret.set_float(this.mouseYcanvas);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.NinePatch = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.NinePatch.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		this.texture_img = new Image();
		this.texture_img.cr_filesize = this.texture_filesize;
		this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
		this.fillPattern = null;
		this.leftPattern = null;
		this.rightPattern = null;
		this.topPattern = null;
		this.bottomPattern = null;
		this.webGL_texture = null;
		this.webGL_fillTexture = null;
		this.webGL_leftTexture = null;
		this.webGL_rightTexture = null;
		this.webGL_topTexture = null;
		this.webGL_bottomTexture = null;
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		this.webGL_texture = null;
		this.webGL_fillTexture = null;
		this.webGL_leftTexture = null;
		this.webGL_rightTexture = null;
		this.webGL_topTexture = null;
		this.webGL_bottomTexture = null;
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		if (!this.webGL_texture)
		{
			this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		}
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length)
			return;
		if (this.runtime.glwrap)
		{
			this.runtime.glwrap.deleteTexture(this.webGL_texture);
			this.runtime.glwrap.deleteTexture(this.webGL_fillTexture);
			this.runtime.glwrap.deleteTexture(this.webGL_leftTexture);
			this.runtime.glwrap.deleteTexture(this.webGL_rightTexture);
			this.runtime.glwrap.deleteTexture(this.webGL_topTexture);
			this.runtime.glwrap.deleteTexture(this.webGL_bottomTexture);
			this.webGL_texture = null;
			this.webGL_fillTexture = null;
			this.webGL_leftTexture = null;
			this.webGL_rightTexture = null;
			this.webGL_topTexture = null;
			this.webGL_bottomTexture = null;
		}
	};
	typeProto.slicePatch = function (x1, y1, x2, y2)
	{
		var tmpcanvas = document.createElement("canvas");
		var w = x2 - x1;
		var h = y2 - y1;
		tmpcanvas.width = w;
		tmpcanvas.height = h;
		var tmpctx = tmpcanvas.getContext("2d");
		tmpctx.drawImage(this.texture_img, x1, y1, w, h, 0, 0, w, h);
		return tmpcanvas;
	};
	typeProto.createPatch = function (lm, rm, tm, bm)
	{
		var iw = this.texture_img.width;
		var ih = this.texture_img.height;
		var re = iw - rm;
		var be = ih - bm;
		if (this.runtime.glwrap)
		{
			if (this.webGL_fillTexture)
				return;		// already created
			var glwrap = this.runtime.glwrap;
			var ls = this.runtime.linearSampling;
			var tf = this.texture_pixelformat;
			if (re > lm && be > tm)
				this.webGL_fillTexture = glwrap.loadTexture(this.slicePatch(lm, tm, re, be), true, ls, tf);
			if (lm > 0 && be > tm)
				this.webGL_leftTexture = glwrap.loadTexture(this.slicePatch(0, tm, lm, be), true, ls, tf, "repeat-y");
			if (rm > 0 && be > tm)
				this.webGL_rightTexture = glwrap.loadTexture(this.slicePatch(re, tm, iw, be), true, ls, tf, "repeat-y");
			if (tm > 0 && re > lm)
				this.webGL_topTexture = glwrap.loadTexture(this.slicePatch(lm, 0, re, tm), true, ls, tf, "repeat-x");
			if (bm > 0 && re > lm)
				this.webGL_bottomTexture = glwrap.loadTexture(this.slicePatch(lm, be, re, ih), true, ls, tf, "repeat-x");
		}
		else
		{
			if (this.fillPattern)
				return;		// already created
			var ctx = this.runtime.ctx;
			if (re > lm && be > tm)
				this.fillPattern = ctx.createPattern(this.slicePatch(lm, tm, re, be), "repeat");
			if (lm > 0 && be > tm)
				this.leftPattern = ctx.createPattern(this.slicePatch(0, tm, lm, be), "repeat");
			if (rm > 0 && be > tm)
				this.rightPattern = ctx.createPattern(this.slicePatch(re, tm, iw, be), "repeat");
			if (tm > 0 && re > lm)
				this.topPattern = ctx.createPattern(this.slicePatch(lm, 0, re, tm), "repeat");
			if (bm > 0 && re > lm)
				this.bottomPattern = ctx.createPattern(this.slicePatch(lm, be, re, ih), "repeat");
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.leftMargin = this.properties[0];
		this.rightMargin = this.properties[1];
		this.topMargin = this.properties[2];
		this.bottomMargin = this.properties[3];
		this.edges = this.properties[4];					// 0=tile, 1=stretch
		this.fill = this.properties[5];						// 0=tile, 1=stretch, 2=transparent
		this.visible = (this.properties[6] === 0);			// 0=visible, 1=invisible
		this.seamless = (this.properties[8] !== 0);			// 1px overdraw to hide seams
		if (this.recycled)
			this.rcTex.set(0, 0, 0, 0);
		else
			this.rcTex = new cr.rect(0, 0, 0, 0);
		if (this.runtime.glwrap)
		{
			if (!this.type.webGL_texture)
			{
				this.type.webGL_texture = this.runtime.glwrap.loadTexture(this.type.texture_img, false, this.runtime.linearSampling, this.type.texture_pixelformat);
			}
		}
		this.type.createPatch(this.leftMargin, this.rightMargin, this.topMargin, this.bottomMargin);
	};
	function drawPatternProperly(ctx, pattern, pw, ph, drawX, drawY, w, h, ox, oy)
	{
		ctx.save();
		ctx.fillStyle = pattern;
		var offX = drawX % pw;
		var offY = drawY % ph;
		if (offX < 0)
			offX += pw;
		if (offY < 0)
			offY += ph;
		ctx.translate(offX + ox, offY + oy);
		ctx.fillRect(drawX - offX - ox, drawY - offY - oy, w, h);
		ctx.restore();
	};
	instanceProto.draw = function(ctx)
	{
		var img = this.type.texture_img;
		var lm = this.leftMargin;
		var rm = this.rightMargin;
		var tm = this.topMargin;
		var bm = this.bottomMargin;
		var iw = img.width;
		var ih = img.height;
		var re = iw - rm;
		var be = ih - bm;
		ctx.globalAlpha = this.opacity;
		ctx.save();
		var myx = this.x;
		var myy = this.y;
		var myw = this.width;
		var myh = this.height;
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		var drawX = -(this.hotspotX * this.width);
		var drawY = -(this.hotspotY * this.height);
		var offX = drawX % iw;
		var offY = drawY % ih;
		if (offX < 0)
			offX += iw;
		if (offY < 0)
			offY += ih;
		ctx.translate(myx + offX, myy + offY);
		var x = drawX - offX;
		var y = drawY - offY;
		var s = (this.seamless ? 1 : 0);
		if (lm > 0 && tm > 0)
			ctx.drawImage(img, 0, 0, lm + s, tm + s, x, y, lm + s, tm + s);
		if (rm > 0 && tm > 0)
			ctx.drawImage(img, re - s, 0, rm + s, tm + s, x + myw - rm - s, y, rm + s, tm + s);
		if (rm > 0 && bm > 0)
			ctx.drawImage(img, re - s, be - s, rm + s, bm + s, x + myw - rm - s, y + myh - bm - s, rm + s, bm + s);
		if (lm > 0 && bm > 0)
			ctx.drawImage(img, 0, be - s, lm + s, bm + s, x, y + myh - bm - s, lm + s, bm + s);
		if (this.edges === 0)		// tile edges
		{
			var off = (this.fill === 2 ? 0 : s);
			if (lm > 0 && be > tm)
				drawPatternProperly(ctx, this.type.leftPattern, lm, be - tm, x, y + tm, lm + off, myh - tm - bm, 0, 0);
			if (rm > 0 && be > tm)
				drawPatternProperly(ctx, this.type.rightPattern, rm, be - tm, x + myw - rm - off, y + tm, rm + off, myh - tm - bm, off, 0);
			if (tm > 0 && re > lm)
				drawPatternProperly(ctx, this.type.topPattern, re - lm, tm, x + lm, y, myw - lm - rm, tm + off, 0, 0);
			if (bm > 0 && re > lm)
				drawPatternProperly(ctx, this.type.bottomPattern, re - lm, bm, x + lm, y + myh - bm - off, myw - lm - rm, bm + off, 0, off);
		}
		else if (this.edges === 1)	// stretch edges
		{
			if (lm > 0 && be > tm && myh - tm - bm > 0)
				ctx.drawImage(img, 0, tm, lm, be - tm, x, y + tm, lm, myh - tm - bm);
			if (rm > 0 && be > tm && myh - tm - bm > 0)
				ctx.drawImage(img, re, tm, rm, be - tm, x + myw - rm, y + tm, rm, myh - tm - bm);
			if (tm > 0 && re > lm && myw - lm - rm > 0)
				ctx.drawImage(img, lm, 0, re - lm, tm, x + lm, y, myw - lm - rm, tm);
			if (bm > 0 && re > lm && myw - lm - rm > 0)
				ctx.drawImage(img, lm, be, re - lm, bm, x + lm, y + myh - bm, myw - lm - rm, bm);
		}
		if (be > tm && re > lm)
		{
			if (this.fill === 0)		// tile fill
			{
				drawPatternProperly(ctx, this.type.fillPattern, re - lm, be - tm, x + lm, y + tm, myw - lm - rm, myh - tm - bm, 0, 0);
			}
			else if (this.fill === 1)	// stretch fill
			{
				if (myw - lm - rm > 0 && myh - tm - bm > 0)
				{
					ctx.drawImage(img, lm, tm, re - lm, be - tm, x + lm, y + tm, myw - lm - rm, myh - tm - bm);
				}
			}
		}
		ctx.restore();
	};
	instanceProto.drawPatch = function(glw, tex, sx, sy, sw, sh, dx, dy, dw, dh)
	{
		glw.setTexture(tex);
		var rcTex = this.rcTex;
		rcTex.left = sx / tex.c2width;
		rcTex.top = sy / tex.c2height;
		rcTex.right = (sx + sw) / tex.c2width;
		rcTex.bottom = (sy + sh) / tex.c2height;
		glw.quadTex(dx, dy, dx + dw, dy, dx + dw, dy + dh, dx, dy + dh, rcTex);
	};
	instanceProto.tilePatch = function(glw, tex, dx, dy, dw, dh, ox, oy)
	{
		glw.setTexture(tex);
		var rcTex = this.rcTex;
		rcTex.left = -ox / tex.c2width;
		rcTex.top = -oy / tex.c2height;
		rcTex.right = (dw - ox) / tex.c2width;
		rcTex.bottom = (dh - oy) / tex.c2height;
		glw.quadTex(dx, dy, dx + dw, dy, dx + dw, dy + dh, dx, dy + dh, rcTex);
	};
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	instanceProto.drawGL = function(glw)
	{
		var lm = this.leftMargin;
		var rm = this.rightMargin;
		var tm = this.topMargin;
		var bm = this.bottomMargin;
		var iw = this.type.texture_img.width;
		var ih = this.type.texture_img.height;
		var re = iw - rm;
		var be = ih - bm;
		glw.setOpacity(this.opacity);
		var rcTex = this.rcTex;
		var q = this.bquad;
		var myx = q.tlx;
		var myy = q.tly;
		var myw = this.width;
		var myh = this.height;
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		var s = (this.seamless ? 1 : 0);
		if (lm > 0 && tm > 0)
			this.drawPatch(glw, this.type.webGL_texture, 0, 0, lm + s, tm + s, myx, myy, lm + s, tm + s);
		if (rm > 0 && tm > 0)
			this.drawPatch(glw, this.type.webGL_texture, re - s, 0, rm + s, tm + s, myx + myw - rm - s, myy, rm + s, tm + s);
		if (rm > 0 && bm > 0)
			this.drawPatch(glw, this.type.webGL_texture, re - s, be - s, rm + s, bm + s, myx + myw - rm - s, myy + myh - bm - s, rm + s, bm + s);
		if (lm > 0 && bm > 0)
			this.drawPatch(glw, this.type.webGL_texture, 0, be - s, lm + s, bm + s, myx, myy + myh - bm - s, lm + s, bm + s);
		if (this.edges === 0)		// tile edges
		{
			var off = (this.fill === 2 ? 0 : s);
			if (lm > 0 && be > tm)
				this.tilePatch(glw, this.type.webGL_leftTexture, myx, myy + tm, lm + off, myh - tm - bm, 0, 0);
			if (rm > 0 && be > tm)
				this.tilePatch(glw, this.type.webGL_rightTexture, myx + myw - rm - off, myy + tm, rm + off, myh - tm - bm, off, 0);
			if (tm > 0 && re > lm)
				this.tilePatch(glw, this.type.webGL_topTexture, myx + lm, myy, myw - lm - rm, tm + off, 0, 0);
			if (bm > 0 && re > lm)
				this.tilePatch(glw, this.type.webGL_bottomTexture, myx + lm, myy + myh - bm - off, myw - lm - rm, bm + off, 0, off);
		}
		else if (this.edges === 1)	// stretch edges
		{
			if (lm > 0 && be > tm)
				this.drawPatch(glw, this.type.webGL_texture, 0, tm, lm, be - tm, myx, myy + tm, lm, myh - tm - bm);
			if (rm > 0 && be > tm)
				this.drawPatch(glw, this.type.webGL_texture, re, tm, rm, be - tm, myx + myw - rm, myy + tm, rm, myh - tm - bm);
			if (tm > 0 && re > lm)
				this.drawPatch(glw, this.type.webGL_texture, lm, 0, re - lm, tm, myx + lm, myy, myw - lm - rm, tm);
			if (bm > 0 && re > lm)
				this.drawPatch(glw, this.type.webGL_texture, lm, be, re - lm, bm, myx + lm, myy + myh - bm, myw - lm - rm, bm);
		}
		if (be > tm && re > lm)
		{
			if (this.fill === 0)		// tile fill
			{
				this.tilePatch(glw, this.type.webGL_fillTexture, myx + lm, myy + tm, myw - lm - rm, myh - tm - bm, 0, 0);
			}
			else if (this.fill === 1)	// stretch fill
			{
				this.drawPatch(glw, this.type.webGL_texture, lm, tm, re - lm, be - tm, myx + lm, myy + tm, myw - lm - rm, myh - tm - bm);
			}
		}
	};
	function Cnds() {};
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Particles = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Particles.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		this.texture_img = new Image();
		this.texture_img.cr_filesize = this.texture_filesize;
		this.webGL_texture = null;
		this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		this.webGL_texture = null;
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		if (!this.webGL_texture)
		{
			this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		}
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.webGL_texture || !this.runtime.glwrap)
			return;
		this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.webGL_texture)
			return;
		this.runtime.glwrap.deleteTexture(this.webGL_texture);
		this.webGL_texture = null;
	};
	typeProto.preloadCanvas2D = function (ctx)
	{
		ctx.drawImage(this.texture_img, 0, 0);
	};
	function Particle(owner)
	{
		this.owner = owner;
		this.active = false;
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.angle = 0;
		this.opacity = 1;
		this.grow = 0;
		this.size = 0;
		this.gs = 0;			// gravity speed
		this.age = 0;
		cr.seal(this);
	};
	Particle.prototype.init = function ()
	{
		var owner = this.owner;
		this.x = owner.x - (owner.xrandom / 2) + (Math.random() * owner.xrandom);
		this.y = owner.y - (owner.yrandom / 2) + (Math.random() * owner.yrandom);
		this.speed = owner.initspeed - (owner.speedrandom / 2) + (Math.random() * owner.speedrandom);
		this.angle = owner.angle - (owner.spraycone / 2) + (Math.random() * owner.spraycone);
		this.opacity = owner.initopacity;
		this.size = owner.initsize - (owner.sizerandom / 2) + (Math.random() * owner.sizerandom);
		this.grow = owner.growrate - (owner.growrandom / 2) + (Math.random() * owner.growrandom);
		this.gs = 0;
		this.age = 0;
	};
	Particle.prototype.tick = function (dt)
	{
		var owner = this.owner;
		this.x += Math.cos(this.angle) * this.speed * dt;
		this.y += Math.sin(this.angle) * this.speed * dt;
		this.y += this.gs * dt;
		this.speed += owner.acc * dt;
		this.size += this.grow * dt;
		this.gs += owner.g * dt;
		this.age += dt;
		if (this.size < 1)
		{
			this.active = false;
			return;
		}
		if (owner.lifeanglerandom !== 0)
			this.angle += (Math.random() * owner.lifeanglerandom * dt) - (owner.lifeanglerandom * dt / 2);
		if (owner.lifespeedrandom !== 0)
			this.speed += (Math.random() * owner.lifespeedrandom * dt) - (owner.lifespeedrandom * dt / 2);
		if (owner.lifeopacityrandom !== 0)
		{
			this.opacity += (Math.random() * owner.lifeopacityrandom * dt) - (owner.lifeopacityrandom * dt / 2);
			if (this.opacity < 0)
				this.opacity = 0;
			else if (this.opacity > 1)
				this.opacity = 1;
		}
		if (owner.destroymode <= 1 && this.age >= owner.timeout)
		{
			this.active = false;
		}
		if (owner.destroymode === 2 && this.speed <= 0)
		{
			this.active = false;
		}
	};
	Particle.prototype.draw = function (ctx)
	{
		var curopacity = this.owner.opacity * this.opacity;
		if (curopacity === 0)
			return;
		if (this.owner.destroymode === 0)
			curopacity *= 1 - (this.age / this.owner.timeout);
		ctx.globalAlpha = curopacity;
		var drawx = this.x - this.size / 2;
		var drawy = this.y - this.size / 2;
		if (this.owner.runtime.pixel_rounding)
		{
			drawx = (drawx + 0.5) | 0;
			drawy = (drawy + 0.5) | 0;
		}
		ctx.drawImage(this.owner.type.texture_img, drawx, drawy, this.size, this.size);
	};
	Particle.prototype.drawGL = function (glw)
	{
		var curopacity = this.owner.opacity * this.opacity;
		if (this.owner.destroymode === 0)
			curopacity *= 1 - (this.age / this.owner.timeout);
		var drawsize = this.size;
		var scaleddrawsize = drawsize * this.owner.particlescale;
		var drawx = this.x - drawsize / 2;
		var drawy = this.y - drawsize / 2;
		if (this.owner.runtime.pixel_rounding)
		{
			drawx = (drawx + 0.5) | 0;
			drawy = (drawy + 0.5) | 0;
		}
		if (scaleddrawsize < 1 || curopacity === 0)
			return;
		if (scaleddrawsize < glw.minPointSize || scaleddrawsize > glw.maxPointSize)
		{
			glw.setOpacity(curopacity);
			glw.quad(drawx, drawy, drawx + drawsize, drawy, drawx + drawsize, drawy + drawsize, drawx, drawy + drawsize);
		}
		else
			glw.point(this.x, this.y, scaleddrawsize, curopacity);
	};
	Particle.prototype.left = function ()
	{
		return this.x - this.size / 2;
	};
	Particle.prototype.right = function ()
	{
		return this.x + this.size / 2;
	};
	Particle.prototype.top = function ()
	{
		return this.y - this.size / 2;
	};
	Particle.prototype.bottom = function ()
	{
		return this.y + this.size / 2;
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var deadparticles = [];
	instanceProto.onCreate = function()
	{
		var props = this.properties;
		this.rate = props[0];
		this.spraycone = cr.to_radians(props[1]);
		this.spraytype = props[2];			// 0 = continuous, 1 = one-shot
		this.spraying = true;				// for continuous mode only
		this.initspeed = props[3];
		this.initsize = props[4];
		this.initopacity = props[5] / 100.0;
		this.growrate = props[6];
		this.xrandom = props[7];
		this.yrandom = props[8];
		this.speedrandom = props[9];
		this.sizerandom = props[10];
		this.growrandom = props[11];
		this.acc = props[12];
		this.g = props[13];
		this.lifeanglerandom = props[14];
		this.lifespeedrandom = props[15];
		this.lifeopacityrandom = props[16];
		this.destroymode = props[17];		// 0 = fade, 1 = timeout, 2 = stopped
		this.timeout = props[18];
		this.particleCreateCounter = 0;
		this.particlescale = 1;
		this.particleBoxLeft = this.x;
		this.particleBoxTop = this.y;
		this.particleBoxRight = this.x;
		this.particleBoxBottom = this.y;
		this.add_bbox_changed_callback(function (self) {
			self.bbox.set(self.particleBoxLeft, self.particleBoxTop, self.particleBoxRight, self.particleBoxBottom);
			self.bquad.set_from_rect(self.bbox);
			self.bbox_changed = false;
			self.update_collision_cell();
			self.update_render_cell();
		});
		if (!this.recycled)
			this.particles = [];
		this.runtime.tickMe(this);
		this.type.loadTextures();
		if (this.spraytype === 1)
		{
			for (var i = 0; i < this.rate; i++)
				this.allocateParticle().opacity = 0;
		}
		this.first_tick = true;		// for re-init'ing one-shot particles on first tick so they assume any new angle/position
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"r": this.rate,
			"sc": this.spraycone,
			"st": this.spraytype,
			"s": this.spraying,
			"isp": this.initspeed,
			"isz": this.initsize,
			"io": this.initopacity,
			"gr": this.growrate,
			"xr": this.xrandom,
			"yr": this.yrandom,
			"spr": this.speedrandom,
			"szr": this.sizerandom,
			"grnd": this.growrandom,
			"acc": this.acc,
			"g": this.g,
			"lar": this.lifeanglerandom,
			"lsr": this.lifespeedrandom,
			"lor": this.lifeopacityrandom,
			"dm": this.destroymode,
			"to": this.timeout,
			"pcc": this.particleCreateCounter,
			"ft": this.first_tick,
			"p": []
		};
		var i, len, p;
		var arr = o["p"];
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			arr.push([p.x, p.y, p.speed, p.angle, p.opacity, p.grow, p.size, p.gs, p.age]);
		}
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.rate = o["r"];
		this.spraycone = o["sc"];
		this.spraytype = o["st"];
		this.spraying = o["s"];
		this.initspeed = o["isp"];
		this.initsize = o["isz"];
		this.initopacity = o["io"];
		this.growrate = o["gr"];
		this.xrandom = o["xr"];
		this.yrandom = o["yr"];
		this.speedrandom = o["spr"];
		this.sizerandom = o["szr"];
		this.growrandom = o["grnd"];
		this.acc = o["acc"];
		this.g = o["g"];
		this.lifeanglerandom = o["lar"];
		this.lifespeedrandom = o["lsr"];
		this.lifeopacityrandom = o["lor"];
		this.destroymode = o["dm"];
		this.timeout = o["to"];
		this.particleCreateCounter = o["pcc"];
		this.first_tick = o["ft"];
		deadparticles.push.apply(deadparticles, this.particles);
		cr.clearArray(this.particles);
		var i, len, p, d;
		var arr = o["p"];
		for (i = 0, len = arr.length; i < len; i++)
		{
			p = this.allocateParticle();
			d = arr[i];
			p.x = d[0];
			p.y = d[1];
			p.speed = d[2];
			p.angle = d[3];
			p.opacity = d[4];
			p.grow = d[5];
			p.size = d[6];
			p.gs = d[7];
			p.age = d[8];
		}
	};
	instanceProto.onDestroy = function ()
	{
		deadparticles.push.apply(deadparticles, this.particles);
		cr.clearArray(this.particles);
	};
	instanceProto.allocateParticle = function ()
	{
		var p;
		if (deadparticles.length)
		{
			p = deadparticles.pop();
			p.owner = this;
		}
		else
			p = new Particle(this);
		this.particles.push(p);
		p.active = true;
		return p;
	};
	instanceProto.tick = function()
	{
		var dt = this.runtime.getDt(this);
		var i, len, p, n, j;
		if (this.spraytype === 0 && this.spraying)
		{
			this.particleCreateCounter += dt * this.rate;
			n = cr.floor(this.particleCreateCounter);
			this.particleCreateCounter -= n;
			for (i = 0; i < n; i++)
			{
				p = this.allocateParticle();
				p.init();
			}
		}
		this.particleBoxLeft = this.x;
		this.particleBoxTop = this.y;
		this.particleBoxRight = this.x;
		this.particleBoxBottom = this.y;
		for (i = 0, j = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			this.particles[j] = p;
			this.runtime.redraw = true;
			if (this.spraytype === 1 && this.first_tick)
				p.init();
			p.tick(dt);
			if (!p.active)
			{
				deadparticles.push(p);
				continue;
			}
			if (p.left() < this.particleBoxLeft)
				this.particleBoxLeft = p.left();
			if (p.right() > this.particleBoxRight)
				this.particleBoxRight = p.right();
			if (p.top() < this.particleBoxTop)
				this.particleBoxTop = p.top();
			if (p.bottom() > this.particleBoxBottom)
				this.particleBoxBottom = p.bottom();
			j++;
		}
		cr.truncateArray(this.particles, j);
		this.set_bbox_changed();
		this.first_tick = false;
		if (this.spraytype === 1 && this.particles.length === 0)
			this.runtime.DestroyInstance(this);
	};
	instanceProto.draw = function (ctx)
	{
		var i, len, p, layer = this.layer;
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			if (p.right() >= layer.viewLeft && p.bottom() >= layer.viewTop && p.left() <= layer.viewRight && p.top() <= layer.viewBottom)
			{
				p.draw(ctx);
			}
		}
	};
	instanceProto.drawGL = function (glw)
	{
		this.particlescale = this.layer.getScale();
		glw.setTexture(this.type.webGL_texture);
		var i, len, p, layer = this.layer;
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			if (p.right() >= layer.viewLeft && p.bottom() >= layer.viewTop && p.left() <= layer.viewRight && p.top() <= layer.viewBottom)
			{
				p.drawGL(glw);
			}
		}
	};
	function Cnds() {};
	Cnds.prototype.IsSpraying = function ()
	{
		return this.spraying;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetSpraying = function (set_)
	{
		this.spraying = (set_ !== 0);
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.SetRate = function (x)
	{
		this.rate = x;
		var diff, i;
		if (this.spraytype === 1 && this.first_tick)
		{
			if (x < this.particles.length)
			{
				diff = this.particles.length - x;
				for (i = 0; i < diff; i++)
					deadparticles.push(this.particles.pop());
			}
			else if (x > this.particles.length)
			{
				diff = x - this.particles.length;
				for (i = 0; i < diff; i++)
					this.allocateParticle().opacity = 0;
			}
		}
	};
	Acts.prototype.SetSprayCone = function (x)
	{
		this.spraycone = cr.to_radians(x);
	};
	Acts.prototype.SetInitSpeed = function (x)
	{
		this.initspeed = x;
	};
	Acts.prototype.SetInitSize = function (x)
	{
		this.initsize = x;
	};
	Acts.prototype.SetInitOpacity = function (x)
	{
		this.initopacity = x / 100;
	};
	Acts.prototype.SetGrowRate = function (x)
	{
		this.growrate = x;
	};
	Acts.prototype.SetXRandomiser = function (x)
	{
		this.xrandom = x;
	};
	Acts.prototype.SetYRandomiser = function (x)
	{
		this.yrandom = x;
	};
	Acts.prototype.SetSpeedRandomiser = function (x)
	{
		this.speedrandom = x;
	};
	Acts.prototype.SetSizeRandomiser = function (x)
	{
		this.sizerandom = x;
	};
	Acts.prototype.SetGrowRateRandomiser = function (x)
	{
		this.growrandom = x;
	};
	Acts.prototype.SetParticleAcc = function (x)
	{
		this.acc = x;
	};
	Acts.prototype.SetGravity = function (x)
	{
		this.g = x;
	};
	Acts.prototype.SetAngleRandomiser = function (x)
	{
		this.lifeanglerandom = x;
	};
	Acts.prototype.SetLifeSpeedRandomiser = function (x)
	{
		this.lifespeedrandom = x;
	};
	Acts.prototype.SetOpacityRandomiser = function (x)
	{
		this.lifeopacityrandom = x;
	};
	Acts.prototype.SetTimeout = function (x)
	{
		this.timeout = x;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ParticleCount = function (ret)
	{
		ret.set_int(this.particles.length);
	};
	Exps.prototype.Rate = function (ret)
	{
		ret.set_float(this.rate);
	};
	Exps.prototype.SprayCone = function (ret)
	{
		ret.set_float(cr.to_degrees(this.spraycone));
	};
	Exps.prototype.InitSpeed = function (ret)
	{
		ret.set_float(this.initspeed);
	};
	Exps.prototype.InitSize = function (ret)
	{
		ret.set_float(this.initsize);
	};
	Exps.prototype.InitOpacity = function (ret)
	{
		ret.set_float(this.initopacity * 100);
	};
	Exps.prototype.InitGrowRate = function (ret)
	{
		ret.set_float(this.growrate);
	};
	Exps.prototype.XRandom = function (ret)
	{
		ret.set_float(this.xrandom);
	};
	Exps.prototype.YRandom = function (ret)
	{
		ret.set_float(this.yrandom);
	};
	Exps.prototype.InitSpeedRandom = function (ret)
	{
		ret.set_float(this.speedrandom);
	};
	Exps.prototype.InitSizeRandom = function (ret)
	{
		ret.set_float(this.sizerandom);
	};
	Exps.prototype.InitGrowRandom = function (ret)
	{
		ret.set_float(this.growrandom);
	};
	Exps.prototype.ParticleAcceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Gravity = function (ret)
	{
		ret.set_float(this.g);
	};
	Exps.prototype.ParticleAngleRandom = function (ret)
	{
		ret.set_float(this.lifeanglerandom);
	};
	Exps.prototype.ParticleSpeedRandom = function (ret)
	{
		ret.set_float(this.lifespeedrandom);
	};
	Exps.prototype.ParticleOpacityRandom = function (ret)
	{
		ret.set_float(this.lifeopacityrandom);
	};
	Exps.prototype.Timeout = function (ret)
	{
		ret.set_float(this.timeout);
	};
	pluginProto.exps = new Exps();
}());
;
;
var Photon = this["Photon"];
var Exitgames = this["Exitgames"];
cr.plugins_.Photon = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Photon.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.createLBC = function()
	{
		Photon["LoadBalancing"]["LoadBalancingClient"].prototype["roomFactory"] = function(name) {
			var r = new Photon["LoadBalancing"]["Room"](name);
			r["onPropertiesChange"] = function (changedCustomProps, byClient) {
				self.changedPropertiesNames = [];
				for(var i in changedCustomProps) {
					self.changedPropertiesNames.push(i);
				}
			};
			return r;
		};
		Photon["LoadBalancing"]["LoadBalancingClient"].prototype["actorFactory"] = function(name, actorNr, isLocal) {
			var a = new Photon["LoadBalancing"]["Actor"](name, actorNr, isLocal);
			a["onPropertiesChange"] = function (changedCustomProps, byClient) {
				self.changedPropertiesNames = [];
				for(var i in changedCustomProps) {
					self.changedPropertiesNames.push(i);
				}
			};
			return a;
		};
		Exitgames["Common"]["Logger"]["setExceptionHandler"](function(code, message) {
			self.errorCode = code;
			self.errorMsg = message;
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onError, self);
			return false;
		});
		this.lbc = new Photon["LoadBalancing"]["LoadBalancingClient"](this.Protocol, this.AppId, this.AppVersion);
		var self = this;
		this.lbc["setLogLevel"](this.LogLevel);
		this.lbc["onError"] = function(errorCode, errorMsg) {
			self.errorCode = errorCode;
			self.errorMsg = errorMsg;
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onError, self);
		};
		this.lbc["onStateChange"] = function(state) {
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onStateChange, self);
			var LBC = Photon["LoadBalancing"]["LoadBalancingClient"];
			switch (state) {
				case LBC["State"]["JoinedLobby"]:
					self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onJoinedLobby, self);
					break;
				case LBC["State"]["Disconnected"]:
					self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onDisconnected, self);
					break;
				default:
					break;
			}
		};
		this.lbc["onOperationResponse"] = function (errorCode, errorMsg, code, content) {
			if (errorCode) {
				switch (code) {
					case Photon["LoadBalancing"]["Constants"]["OperationCode"]["JoinRandomGame"]:
						switch (errorCode) {
							case Photon["LoadBalancing"]["Constants"]["ErrorCode"]["NoRandomMatchFound"]:
								self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onJoinRandomRoomNoMatchFound, self);
								break;
							default:
								break;
						}
						break;
					default:
						self.errorCode = errorCode;
						self.errorMsg = errorMsg;
						self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onError, self);
						break;
				}
			}
		};
		this.lbc["onEvent"] = function (code, data, actorNr) {
			self.eventCode = code;
			self.eventData = data;
			self.actorNr = actorNr;
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onEvent, self);
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onAnyEvent, self);
        };
		this.lbc["onRoomList"] = function (rooms){
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onRoomList, self);
		};
        this.lbc["onRoomListUpdate"] = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) {
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onRoomListUpdate, self);
		};
        this.lbc["onMyRoomPropertiesChange"] = function () {
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onMyRoomPropertiesChange, self);
		};
        this.lbc["onActorPropertiesChange"] = function (actor) {
			self.actorNr = actor["actorNr"];
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onActorPropertiesChange, self);
		};
		this.lbc["onJoinRoom"] = function (createdByMe) {
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onJoinRoom, self);
		};
		this.lbc["onActorJoin"] = function (actor) {
			self.actorNr = actor["actorNr"];
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onActorJoin, self);
		};
		this.lbc["onActorLeave"] = function (actor) {
			self.actorNr = actor["actorNr"];
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onActorLeave, self);
        };
		this.lbc["onActorSuspend"] = function (actor) {
			self.actorNr = actor["actorNr"];
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onActorSuspend, self);
        };
		this.lbc["onWebRpcResult"] = function (errorCode, errorMsg, uriPath, resultCode, data) {
			self.errorCode = errorCode;
			self.errorMsg = errorMsg;
			self.webRpcUriPath = uriPath;
			self.webRpcResultCode = resultCode;
			self.webRpcData = data;
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onWebRpcResult, self);
        };
		this.lbc["onFindFriendsResult"] = function (errorCode, errorMsg, friends) {
			self.errorCode = errorCode;
			self.errorMsg = errorMsg;
			self.friends = friends;
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onFindFriendsResult, self);
        };
		this.lbc["onLobbyStats"] = function (errorCode, errorMsg, lobbies) {
			self.errorCode = errorCode;
			self.errorMsg = errorMsg;
			self.lobbyStats = lobbies;
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onLobbyStats, self);
        };
		this.lbc["onAppStats"] = function (errorCode, errorMsg, stats) {
			self.errorCode = errorCode;
			self.errorMsg = errorMsg;
			self.appStats = stats;
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onAppStats, self);
        };
    };
	instanceProto.onCreate = function()
	{
		this.AppId = this.properties[0];
		this.AppVersion = this.properties[1];
		this.Protocol = ["ws", "wss"][this.properties[2]] == "wss" ? this.Protocol = Photon["ConnectionProtocol"]["Wss"] : Photon["ConnectionProtocol"]["Ws"];
		this.Region = ["eu", "us", "asia", "jp", "au", "usw", "sa", "cae", "kr", "in", "cn", "ru", "rue"][this.properties[3]];
		this.SelfHosted = this.properties[4] == 1;
		this.SelfHostedAddress = this.properties[5];
		this.LogLevel = this.properties[6] + Exitgames["Common"]["Logger"]["Level"]["DEBUG"]; // list starts from DEBUG = 1
		this.createLBC();
	}
	instanceProto.onDestroy = function ()
	{
	};
	instanceProto.saveToJSON = function ()
	{
		return {
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function (glw)
	{
	};
	function Cnds() {}
	Cnds.prototype.onError 					= function() { return true; };
	Cnds.prototype.onStateChange 			= function() { return true; };
	Cnds.prototype.onEvent 					= function(code) { return this.eventCode == code; };
	Cnds.prototype.onAnyEvent 				= function() { return true; };
	Cnds.prototype.onRoomList 				= function() { return true; };
	Cnds.prototype.onRoomListUpdate 		= function() { return true; };
	Cnds.prototype.onActorPropertiesChange 	= function() { return true; };
	Cnds.prototype.onMyRoomPropertiesChange = function() { return true; };
	Cnds.prototype.onJoinRoom 				= function() { return true; };
	Cnds.prototype.onActorJoin 				= function() { return true; };
	Cnds.prototype.onActorLeave 			= function() { return true; };
	Cnds.prototype.onActorSuspend 			= function() { return true; };
	Cnds.prototype.onWebRpcResult 			= function() { return true; };
	Cnds.prototype.onFindFriendsResult 		= function() { return true; };
	Cnds.prototype.onLobbyStats 			= function() { return true; };
	Cnds.prototype.onAppStats 				= function() { return true; };
	Cnds.prototype.onJoinedLobby 	 = function() { return true; };
	Cnds.prototype.onJoinRandomRoomNoMatchFound  = function() { return true; };
	Cnds.prototype.onDisconnected  = function() { return true; };
	Cnds.prototype.isConnectedToNameServer = function ()
	{
		return this.lbc["isConnectedToNameServer"]();
	};
	Cnds.prototype.isConnectedToMaster = function ()
	{
		return this.lbc["isConnectedToMaster"]();
	};
	Cnds.prototype.isInLobby = function ()
	{
		return this.lbc["isInLobby"]();
	};
	Cnds.prototype.isJoinedToRoom = function ()
	{
		return this.lbc["isJoinedToRoom"]();
	};
	pluginProto.cnds = new Cnds();
	function Acts() {}
	Acts.prototype.setUserId = function (userId)
	{
		this.lbc["setUserId"](userId);
	};
	Acts.prototype.setCustomAuthentication = function (authParameters, authType)
	{
		this.lbc["setCustomAuthentication"](authParameters, authType);
	};
	Acts.prototype.setHostingType = function (hostType)
	{
		this.SelfHosted = hostType == 1;
	};
	Acts.prototype.setSelfHostedAddress = function (address)
	{
		this.SelfHostedAddress = address;
	};
	Acts.prototype.setRegion = function (region)
	{
		this.Region = region;
	};
	Acts.prototype.setAppId = function (appId)
	{
		this.AppId = appId;
	};
	Acts.prototype.setAppVersion = function (version)
	{
		this.AppVersion = version;
	};
	Acts.prototype.connect = function ()
	{
		if (this.SelfHosted) {
			this.lbc["setMasterServerAddress"](this.SelfHostedAddress);
			this.lbc["connect"]();
		}
		else {
			if (this.Region)
				this.lbc["connectToRegionMaster"](this.Region);
			else
				this.lbc["connectToNameServer"]();
		}
	};
	Acts.prototype.createRoom = function (name, lobbyName, lobbyType)
	{
		if (lobbyType == 1)  {
			lobbyType = Photon["LoadBalancing"]["Constants"]["LobbyType"]["SqlLobby"]; // 2
		}
		var options = {
			"lobbyName": lobbyName,
			"lobbyType": lobbyType
		};
		this.lbc["createRoomFromMy"](name, options);
	};
	Acts.prototype.joinRoom = function (name, rejoin, createIfNotExists, lobbyName, lobbyType)
	{
		if (lobbyType == 1)  {
			lobbyType = Photon["LoadBalancing"]["Constants"]["LobbyType"]["SqlLobby"]; // 2
		}
		var joinOptions = {
			"rejoin": rejoin && true,
			"createIfNotExists": createIfNotExists && true,
			"lobbyName": lobbyName,
			"lobbyType": lobbyType
		};
		var createOptions = {
			"lobbyName": lobbyName,
			"lobbyType": lobbyType
		};
		createOptions = this.lbc["copyCreateOptionsFromMyRoom"](createOptions);
		this.lbc["joinRoom"](name, joinOptions, createOptions);
	};
	Acts.prototype.joinRandomRoom = function (matchMyRoom, matchmakingMode, lobbyName, lobbyType, sqlLobbyFilter)
	{
		if (lobbyType == 1)  {
			lobbyType = Photon["LoadBalancing"]["Constants"]["LobbyType"]["SqlLobby"]; // 2
		}
		var options = {
			"matchmakingMode": matchmakingMode,
			"lobbyName": lobbyName,
			"lobbyType": lobbyType,
			"sqlLobbyFilter": sqlLobbyFilter
		};
		if (matchMyRoom) {
			options.expectedCustomRoomProperties = this.lbc["myRoom"]()["_customProperties"];
			options.expectedMaxPlayers = this.lbc["myRoom"]()["maxPlayers"];
		}
		this.lbc["joinRandomRoom"](options);
	};
	Acts.prototype.disconnect = function ()
	{
		this.lbc["disconnect"]();
	};
	Acts.prototype.suspendRoom = function ()
	{
		this.lbc["suspendRoom"]();
	};
	Acts.prototype.leaveRoom = function ()
	{
		this.lbc["leaveRoom"]();
	};
	Acts.prototype.raiseEvent = function (eventCode, data, interestGroup, cache, receivers, targetActors, webForward)
	{
		var opt = {
			"interestGroup": interestGroup,
			"cache": cache,
			"receivers": receivers,
			"webForward": webForward
		};
		if(typeof(targetActors) === "string" && targetActors) {
			opt["targetActors"] = targetActors.split(",").map(function(x) { return parseInt(x); } );
		}
		this.lbc["raiseEvent"](eventCode, data, opt);
	};
	Acts.prototype.changeGroups = function (action, group)
	{
		switch (action) {
			case 0: // Add
				this.lbc["changeGroups"](null, [group]);
				break;
			case 1: // Add all current
				this.lbc["changeGroups"](null ,[]);
				break;
			case 2: // Remove
				this.lbc["changeGroups"]([group], null);
				break;
			case 3: // Remove all
				this.lbc["changeGroups"]([], null);
				break;
		}
	};
	Acts.prototype.webRpc = function (uriPath, parameters, parametersType)
	{
		this.lbc["webRpc"](uriPath, parametersType ? JSON.parse(parameters) : parameters);
	};
	Acts.prototype.findFriends = function (friends)
	{
		this.lbc["findFriends"](friends.split(","));
	};
	Acts.prototype.requestLobbyStats = function ()
	{
		this.lbc["requestLobbyStats"]();
	};
	Acts.prototype.setMyActorName = function (name)
	{
		this.lbc["myActor"]()["setName"](name);
	};
	Acts.prototype.setPropertyOfActorByNr = function (nr, propName, propValue, webForward, checkAndSet, expectedValue)
	{
		this.lbc["myRoomActors"]()[nr]["setCustomProperty"](propName, propValue, webForward, checkAndSet ? expectedValue : undefined);
	};
	Acts.prototype.setPropertyOfMyRoom = function (propName, propValue, webForward, checkAndSet, expectedValue)
	{
		this.lbc["myRoom"]()["setCustomProperty"](propName, propValue, webForward, checkAndSet ? expectedValue : undefined);
	};
	Acts.prototype.setPropsListedInLobby = function (propNames)
	{
		this.lbc["myRoom"]()["setPropsListedInLobby"](propNames.split(","));
	};
	Acts.prototype.setMyRoomIsVisible = function (isVisisble)
	{
		this.lbc["myRoom"]()["setIsVisible"](isVisisble ? true : false);
	};
	Acts.prototype.setMyRoomIsOpen = function (isOpen)
	{
		this.lbc["myRoom"]()["setIsOpen"](isOpen ? true : false);
	};
	Acts.prototype.setMyRoomMaxPlayers = function (maxPlayers)
	{
		this.lbc["myRoom"]()["setMaxPlayers"](maxPlayers);
	};
	Acts.prototype.setEmptyRoomLiveTime = function (emptyRoomLiveTime)
	{
		this.lbc["myRoom"]()["setEmptyRoomLiveTime"](emptyRoomLiveTime);
	};
	Acts.prototype.setSuspendedPlayerLiveTime = function (suspendedPlayerLiveTime)
	{
		this.lbc["myRoom"]()["setSuspendedPlayerLiveTime"](suspendedPlayerLiveTime);
	};
	Acts.prototype.setUniqueUserId = function (unique)
	{
		this.lbc.logger.error("'Set unique userid check' action is deprecated. Please remove it from project. Rooms always created with 'unique userid check' set to true.");
	};
	Acts.prototype.reset = function ()
	{
		this.lbc["disconnect"]();
		this.createLBC();
		this.lbc["logger"]["info"]("Photon client reset.");
	};
	pluginProto.acts = new Acts();
	function Exps() {}
	Exps.prototype.ErrorCode = function (ret)
	{
		ret.set_int(this.errorCode || 0);
	};
	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(this.errorMsg || "");
	};
	Exps.prototype.State = function (ret)
	{
		ret.set_int(this.lbc["state"]);
	};
	Exps.prototype.StateString = function (ret)
	{
		ret.set_string(Photon["LoadBalancing"]["LoadBalancingClient"]["StateToName"](this.lbc["state"]));
	};
	Exps.prototype.UserId = function (ret)
	{
		ret.set_string(this.lbc["getUserId"]() || "");
	};
	Exps.prototype.MyActorNr = function (ret)
	{
		ret.set_int(this.lbc["myActor"]()["actorNr"]);
	};
	Exps.prototype.ActorNr = function (ret)
	{
		ret.set_int(this.actorNr || 0);
	};
	Exps.prototype.MyRoomName = function (ret)
	{
		ret.set_string(this.lbc["myRoom"]()["name"] || "");
	};
	Exps.prototype.EventCode = function (ret)
	{
		ret.set_int(this.eventCode || 0);
	};
	Exps.prototype.EventData = function (ret)
	{
		ret.set_any(this.eventData);
	};
	Exps.prototype.RoomCount = function (ret)
	{
		ret.set_int(this.lbc["availableRooms"]().length);
	};
	Exps.prototype.RoomNameAt = function (ret, i)
	{
		ret.set_string(this.lbc["availableRooms"]()[i]["name"] || "");
	};
	Exps.prototype.RoomMaxPlayers = function (ret, name)
	{
		var r = this.lbc["roomInfosDict"][name];
		ret.set_int(r && r["maxPlayers"] || 0);
	};
	Exps.prototype.RoomIsOpen = function (ret, name)
	{
		var r = this.lbc["roomInfosDict"][name];
		ret.set_int(r && r["isOpen"] ? 1 : 0);
	};
	Exps.prototype.RoomPlayerCount = function (ret, name)
	{
		var r = this.lbc["roomInfosDict"][name];
		ret.set_int(r && r["playerCount"]);
	};
	Exps.prototype.RoomProperty = function (ret, name, propName)
	{
		var r = this.lbc["roomInfosDict"][name];
		ret.set_any(r && r["getCustomProperty"](propName));
	};
	Exps.prototype.PropertyOfMyRoom = function (ret, propName)
	{
		var r = this.lbc["myRoom"]();
		ret.set_any(r && r["getCustomProperty"](propName));
	};
	Exps.prototype.ActorCount = function (ret)
	{
		ret.set_int(this.lbc["myRoomActorsArray"]().length);
	};
	Exps.prototype.ActorNrAt = function (ret, i)
	{
		var a = this.lbc["myRoomActorsArray"]()[i];
		ret.set_int(a && a["actorNr"] || -i);
	};
	Exps.prototype.ActorNameByNr = function (ret, nr)
	{
		var a = this.lbc["myRoomActors"]()[nr];
		ret.set_string(a && a["name"] || "-- not found acorNr " + nr);
	};
	Exps.prototype.PropertyOfActorByNr = function (ret, nr, propName)
	{
		var a = this.lbc["myRoomActors"]()[nr];
		ret.set_any(a && a["getCustomProperty"](propName));
	};
	Exps.prototype.ChangedPropertiesCount = function (ret)
	{
		ret.set_int(this.changedPropertiesNames && this.changedPropertiesNames.length || 0);
	};
	Exps.prototype.ChangedPropertyNameAt = function (ret, i)
	{
		ret.set_any(this.changedPropertiesNames && this.changedPropertiesNames[i]);
	};
	Exps.prototype.MasterActorNr = function (ret, i)
	{
		ret.set_int(this.lbc["myRoomMasterActorNr"]());
	};
	Exps.prototype.WebRpcUriPath = function (ret)
	{
		ret.set_string(this.webRpcUriPath || "");
	};
	Exps.prototype.WebRpcResultCode = function (ret)
	{
		ret.set_int(this.webRpcResultCode || 0);
	};
	Exps.prototype.WebRpcData = function (ret)
	{
		ret.set_any(this.webRpcData);
	};
	Exps.prototype.FriendOnline = function (ret, name)
	{
		ret.set_int(this.friends && this.friends[name] && this.friends[name]["online"] ? 1 : 0);
	};
	Exps.prototype.FriendRoom = function (ret, name)
	{
		ret.set_string(this.friends && this.friends[name] ? this.friends[name]["roomId"] : "");
	};
	Exps.prototype.LobbyStatsCount = function (ret)
	{
		ret.set_int(this.lobbyStats ? this.lobbyStats.length : 0);
	};
	Exps.prototype.LobbyStatsNameAt = function (ret, i)
	{
		ret.set_string(this.lobbyStats && this.lobbyStats[i] ? this.lobbyStats[i]["lobbyName"] : "");
	};
	Exps.prototype.LobbyStatsTypeAt = function (ret, i)
	{
		ret.set_int(this.lobbyStats && this.lobbyStats[i] ? this.lobbyStats[i]["lobbyType"] : 0);
	};
	Exps.prototype.LobbyStatsPeerCountAt = function (ret, i)
	{
		ret.set_int(this.lobbyStats && this.lobbyStats[i] ? this.lobbyStats[i]["peerCount"] : 0);
	};
	Exps.prototype.LobbyStatsGameCountAt = function (ret, i)
	{
		ret.set_int(this.lobbyStats && this.lobbyStats[i] ? this.lobbyStats[i]["gameCount"] : 0);
	};
	Exps.prototype.AppStatsPeerCount = function (ret, i)
	{
		ret.set_int(this.appStats ? this.appStats["peerCount"] : 0);
	};
	Exps.prototype.AppStatsMasterPeerCount = function (ret, i)
	{
		ret.set_int(this.appStats ? this.appStats["masterPeerCount"] : 0);
	};
	Exps.prototype.AppStatsGameCount = function (ret, i)
	{
		ret.set_int(this.appStats ? this.appStats["gameCount"] : 0);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Rex_Firebase = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Rex_Firebase.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var EVENTTYPEMAP = ["value", "child_added", "child_changed", "child_removed","child_moved"];
	instanceProto.onCreate = function()
	{
        this.rootpath = this.properties[0] + "/";
		this.lastPushRef = "";
		this.onTransaction = {};
        this.onTransaction.cb = null;
        this.onTransaction.input = null;
        this.onTransaction.output = null;
        this.onTransaction.completedCB = null;
        this.onTransaction.committedValue = null;
        this.onCompleteCb = null;
        this.error = null;
        if (!this.recycled)
            this.callbackMap = new window.FirebaseCallbackMapKlass();
        else
            this.callbackMap.Reset();
        this.onReadCb = null;
        this.snapshot = null;
		this.prevChildName = null;
        this.exp_LastGeneratedKey = "";
        this.exp_ServerTimeOffset = 0;
        this.isConnected = false;
        var self=this;
        var setupFn = function ()
        {
            if (self.properties[1] === 1)
                self.connectionDetectingStart();
            if (self.properties[2] === 1)
                self.serverTimeOffsetDetectingStart();
        }
        window.FirebaseAddAfterInitializeHandler(setupFn);
	};
	instanceProto.onDestroy = function ()
	{
	     this.callbackMap.Remove();
	};
	var isFirebase3x = function()
	{
        return (window["FirebaseV3x"] === true);
    };
    var isFullPath = function (p)
    {
        return (p.substring(0,8) === "https://");
    };
	instanceProto.getRef = function(k)
	{
        if (k == null)
	        k = "";
	    var path;
	    if (isFullPath(k))
	        path = k;
	    else
	        path = this.rootpath + k + "/";
        if (!isFirebase3x())
        {
            return new window["Firebase"](path);
        }
        else
        {
            var fnName = (isFullPath(path))? "refFromURL":"ref";
            return window["Firebase"]["database"]()[fnName](path);
        }
	};
    var getKey = function (obj)
    {
        return (!isFirebase3x())?  obj["key"]() : obj["key"];
    };
    var getRefPath = function (obj)
    {
        return (!isFirebase3x())?  obj["ref"]() : obj["ref"];
    };
    var getRoot = function (obj)
    {
        return (!isFirebase3x())?  obj["root"]() : obj["root"];
    };
    var serverTimeStamp = function ()
    {
        if (!isFirebase3x())
            return window["Firebase"]["ServerValue"]["TIMESTAMP"];
        else
            return window["Firebase"]["database"]["ServerValue"];
    };
    var getTimestamp = function (obj)
    {
        return (!isFirebase3x())?  obj : obj["TIMESTAMP"];
    };
    instanceProto.addCallback = function (query, type_, cbName)
	{
	    var eventType = EVENTTYPEMAP[type_];
	    var self = this;
        var reading_handler = function (snapshot, prevChildName)
        {
            self.onReadCb = cbName;
            self.snapshot = snapshot;
			self.prevChildName = prevChildName;
            self.runtime.trigger(cr.plugins_.Rex_Firebase.prototype.cnds.OnReading, self);
            self.onReadCb = null;
        };
        this.callbackMap.Add(query, eventType, cbName, reading_handler);
	};
    instanceProto.addCallbackOnce = function (refObj, type_, cb)
	{
	    var eventType = EVENTTYPEMAP[type_];
	    var self = this;
        var reading_handler = function (snapshot, prevChildName)
        {
            self.onReadCb = cb;
            self.snapshot = snapshot;
            self.prevChildName = prevChildName;
            self.runtime.trigger(cr.plugins_.Rex_Firebase.prototype.cnds.OnReading, self);
            self.onReadCb = null;
        };
	    refObj["once"](eventType, reading_handler);
	};
	instanceProto.connectionDetectingStart = function ()
	{
        var self = this;
        var onValueChanged = function (snap)
        {
            var trig;
            var isConnected = !!snap["val"]();
            if ( isConnected )
                trig = cr.plugins_.Rex_Firebase.prototype.cnds.OnConnected;
            else if (self.isConnected && !isConnected)   // disconnected after connected
                trig = cr.plugins_.Rex_Firebase.prototype.cnds.OnDisconnected;
            self.isConnected = isConnected;
            self.runtime.trigger(trig, self);
        };
        var p = getRoot(this.getRef()) + "/.info/connected";
        var ref = this.getRef(p);
        ref.on("value", onValueChanged);
	};
	instanceProto.serverTimeOffsetDetectingStart = function ()
	{
        var self = this;
        var onValueChanged = function (snap)
        {
            self.exp_ServerTimeOffset = snap["val"]() || 0;
        };
        var p = getRoot(this.getRef()) + "/.info/serverTimeOffset";
        var ref = this.getRef(p);
        ref.on("value", onValueChanged);
	};
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	Cnds.prototype.OnTransaction = function (cb)
	{
	    return cr.equals_nocase(cb, this.onTransaction.cb);
	};
	Cnds.prototype.OnReading = function (cb)
	{
	    return cr.equals_nocase(cb, this.onReadCb);
	};
	Cnds.prototype.OnComplete = function (cb)
	{
	    return cr.equals_nocase(cb, this.onCompleteCb);
	};
	Cnds.prototype.OnError = function (cb)
	{
	    return cr.equals_nocase(cb, this.onCompleteCb);
	};
	Cnds.prototype.LastDataIsNull = function ()
	{
        var data =(this.snapshot === null)? null: this.snapshot["val"]();
	    return (data === null);
	};
	Cnds.prototype.TransactionInIsNull = function ()
	{
        var data =(this.onTransaction.input === null)? null: this.onTransaction.input;
	    return (data === null);
	};
	Cnds.prototype.IsTransactionAborted = function () { return false; };
	Cnds.prototype.OnTransactionComplete = function (cb)
	{
	    return cr.equals_nocase(cb, this.onTransaction.completedCB);
	};
	Cnds.prototype.OnTransactionError = function (cb)
	{
	    return cr.equals_nocase(cb, this.onTransaction.completedCB);
	};
	Cnds.prototype.OnTransactionAbort = function (cb)
	{
	    return cr.equals_nocase(cb, this.onTransaction.completedCB);
	};
	Cnds.prototype.OnConnected = function ()
	{
	    return true;
	};
	Cnds.prototype.OnDisconnected = function ()
	{
	    return true;
	};
	Cnds.prototype.IsConnected = function ()
	{
	    return this.isConnected;
	};
	function Acts() {};
	pluginProto.acts = new Acts();
    Acts.prototype.SetDomainRef = function (ref)
	{
	    this.rootpath = ref + "/";
	};
	var getOnCompleteHandler = function (self, onCompleteCb)
	{
	    if ((onCompleteCb === null) || (onCompleteCb === ""))
	        return;
	    var handler = function(error)
	    {
	        self.onCompleteCb = onCompleteCb;
	        self.error = error;
	        var trig = (error)? cr.plugins_.Rex_Firebase.prototype.cnds.OnError:
	                            cr.plugins_.Rex_Firebase.prototype.cnds.OnComplete;
	        self.runtime.trigger(trig, self);
	        self.onCompleteCb = null;
        };
        return handler;
	};
    Acts.prototype.SetValue = function (k, v, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    this.getRef(k)["set"](v, handler);
	};
    Acts.prototype.SetJSON = function (k, v, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    this.getRef(k)["set"](JSON.parse(v), handler);
	};
    Acts.prototype.UpdateJSON = function (k, v, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    this.getRef(k)["update"](JSON.parse(v), handler);
	};
    Acts.prototype.PushValue = function (k, v, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    var ref = this.getRef(k)["push"](v, handler);
		this.lastPushRef = k + "/" +  getKey(ref);
	};
    Acts.prototype.PushJSON = function (k, v, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    var ref = this.getRef(k)["push"](JSON.parse(v), handler);
		this.lastPushRef = k + "/" + getKey(ref);
	};
    Acts.prototype.Transaction = function (k, onTransactionCb, onCompleteCb)
	{
        var self = this;
	    var _onComplete = function(error, committed, snapshot)
	    {
	        self.onTransaction.completedCB = onCompleteCb;
	        self.error = error;
            self.onTransaction.committedValue = snapshot["val"]();
            var cnds = cr.plugins_.Rex_Firebase.prototype.cnds;
	        var trig = (error)? cnds.OnTransactionError:
                           (!committed)? cnds.OnTransactionAbort:
	                           cnds.OnTransactionComplete;
	        self.runtime.trigger(trig, self);
	        self.onTransaction.completedCB = null;
        };
        var _onTransaction = function(current_value)
        {
            self.onTransaction.cb = onTransactionCb;
            self.onTransaction.input = current_value;
            self.onTransaction.output = null;
            self.runtime.trigger(cr.plugins_.Rex_Firebase.prototype.cnds.OnTransaction, self);
            self.onTransaction.cb = null;
            if (self.onTransaction.output === null)
                return;
            else
                return self.onTransaction.output;
        };
	    this.getRef(k)["transaction"](_onTransaction, _onComplete);
	};
    Acts.prototype.ReturnTransactionValue = function (v)
	{
	    this.onTransaction.output = v;
	};
    Acts.prototype.ReturnTransactionJSON = function (v)
	{
	    this.onTransaction.output = JSON.parse(v);
	};
    Acts.prototype.Remove = function (k, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    this.getRef(k)["remove"](handler);
	};
    Acts.prototype.SetBooleanValue = function (k, b, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    this.getRef(k)["set"]((b===1), handler);
	};
    Acts.prototype.PushBooleanValue = function (k, b, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    var ref = this.getRef(k)["push"]((b===1), handler);
		this.lastPushRef = k + "/" +  getKey(ref);
	};
    Acts.prototype.SetServerTimestamp = function (k, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    this.getRef(k)["set"](serverTimeStamp(), handler);
	};
    Acts.prototype.PushServerTimestamp = function (k, onCompleteCb)
	{
	    var handler = getOnCompleteHandler(this, onCompleteCb);
	    var ref = this.getRef(k)["push"](serverTimeStamp(), handler);
		this.lastPushRef = k + "/" +  getKey(ref);
	};
    Acts.prototype.AddReadingCallback = function (k, type_, cbName)
	{
	    this.addCallback(this.getRef(k), type_, cbName);
	};
    Acts.prototype.RemoveReadingCallback = function (k, type_, cbName)
	{
        var absRef = (k != null)? this.getRef(k)["toString"](): null;
        var eventType = (type_ != null)? EVENTTYPEMAP[type_]: null;
        this.callbackMap.Remove(absRef, eventType, cbName);
	};
    Acts.prototype.AddReadingCallbackOnce = function (k, type_, cbName)
	{
	    this.addCallbackOnce(this.getRef(k), type_, cbName);
	};
    Acts.prototype.RemoveRefOnDisconnect = function (k)
	{
	    this.getRef(k)["onDisconnect"]()["remove"]();
	};
    Acts.prototype.SetValueOnDisconnect = function (k, v)
	{
	    this.getRef(k)["onDisconnect"]()["set"](v);
	};
    Acts.prototype.UpdateJSONOnDisconnect = function (k, v)
	{
	    this.getRef(k)["onDisconnect"]()["update"](JSON.parse(v));
	};
    Acts.prototype.CancelOnDisconnect = function (k)
	{
	    this.getRef(k)["onDisconnect"]()["cancel"]();
	};
    var get_query = function (queryObjs)
    {
	    if (queryObjs == null)
	        return null;
        var query = queryObjs.getFirstPicked();
        if (query == null)
            return null;
        return query.GetQuery();
    };
    Acts.prototype.AddQueryCallback = function (queryObjs, type_, cbName)
	{
        var refObj = get_query(queryObjs);
        if (refObj == null)
            return;
        this.addCallback(refObj, type_, cbName);
	};
    Acts.prototype.AddQueryCallbackOnce = function (queryObjs, type_, cbName)
	{
        var refObj = get_query(queryObjs);
        if (refObj == null)
            return;
	   this.addCallbackOnce(refObj, type_, cbName);
	};
    Acts.prototype.GoOffline = function ()
	{
        if (!isFirebase3x())
        {
	        window["Firebase"]["goOffline"]();
        }
        else
        {
            window["Firebase"]["database"]()["goOffline"]();
        }
	};
    Acts.prototype.GoOnline = function ()
	{
        if (!isFirebase3x())
        {
	        window["Firebase"]["goOnline"]();
        }
        else
        {
            window["Firebase"]["database"]()["goOnline"]();
        }
	};
	function Exps() {};
	pluginProto.exps = new Exps();
	Exps.prototype.Domain = function (ret)
	{
		ret.set_string(this.rootpath);
	};
	Exps.prototype.TransactionIn = function (ret, default_value)
	{
		ret.set_any(window.FirebaseGetValueByKeyPath(this.onTransaction.input, null, default_value));
	};
	Exps.prototype.LastData = function (ret, default_value)
	{
        var data =(this.snapshot === null)? null: this.snapshot["val"]();
		ret.set_any(window.FirebaseGetValueByKeyPath(data, null, default_value));
	};
	Exps.prototype.LastKey = function (ret, default_value)
	{
        var key =(this.snapshot === null)? null: getKey(this.snapshot);
		ret.set_any(window.FirebaseGetValueByKeyPath(key, null, default_value));
	};
	Exps.prototype.PrevChildName = function (ret, default_value)
	{
		ret.set_any(window.FirebaseGetValueByKeyPath(this.prevChildName, null, default_value));
	};
	Exps.prototype.TransactionResult = function (ret, default_value)
	{
		ret.set_any(window.FirebaseGetValueByKeyPath(this.onTransaction.committedValue, null, default_value));
	};
	Exps.prototype.LastPushRef = function (ret)
	{
		ret.set_string(this.lastPushRef);
	};
  	Exps.prototype.GenerateKey = function (ret)
	{
	    var ref = this.getRef()["push"]();
        this.exp_LastGeneratedKey = getKey(ref);
		ret.set_string(this.exp_LastGeneratedKey);
	};
	Exps.prototype.LastGeneratedKey = function (ret)
	{
	    ret.set_string(this.exp_LastGeneratedKey);
	};
	Exps.prototype.ServerTimeOffset = function (ret)
	{
	    ret.set_int(this.exp_ServerTimeOffset);
	};
	Exps.prototype.EstimatedTime = function (ret)
	{
	    ret.set_int(new Date().getTime() + this.exp_ServerTimeOffset);
	};
	Exps.prototype.LastErrorCode = function (ret)
	{
        var code;
	    if (this.error)
            code = this.error["code"];
		ret.set_string(code || "");
	};
	Exps.prototype.LastErrorMessage = function (ret)
	{
        var s;
	    if (this.error)
            s = this.error["serverResponse"];
		ret.set_string(s || "");
	};
}());
;
;
window["Firebase"] = window["firebase"];
window["FirebaseV3x"] = true;
cr.plugins_.Rex_FirebaseAPIV3 = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Rex_FirebaseAPIV3.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
        window["Firebase"]["database"]["enableLogging"](this.properties[4] === 1);
        if (this.properties[0] !== "")
        {
            this.initializeApp(this.properties[0], this.properties[1], this.properties[2], this.properties[3]);
        }
	};
	instanceProto.onDestroy = function ()
	{
	};
	instanceProto.initializeApp = function (apiKey, authDomain, databaseURL, storageBucket)
	{
        var config = {
            "apiKey": apiKey,
            "authDomain": authDomain,
            "databaseURL": databaseURL,
            "storageBucket": storageBucket,
        };
        window["Firebase"]["initializeApp"](config);
        runAfterInitializeHandlers();
	};
	var isFirebase3x = function()
	{
        return (window["FirebaseV3x"] === true);
    };
    var isFullPath = function (p)
    {
        return (p.substring(0,8) === "https://");
    };
	var getRef = function(path)
	{
        if (!isFirebase3x())
        {
            return new window["Firebase"](path);
        }
        else
        {
            var fnName = (isFullPath(path))? "refFromURL":"ref";
            return window["Firebase"]["database"]()[fnName](path);
        }
	};
	instanceProto.getRef = function(k)
	{
        if (k == null)
	        k = "";
	    var path;
	    if (isFullPath(k))
	        path = k;
	    else
	        path = this.rootpath + k + "/";
        return getRef(path);
	};
    var getKey = function (obj)
    {
        return (!isFirebase3x())?  obj["key"]() : obj["key"];
    };
    var getRefPath = function (obj)
    {
        return (!isFirebase3x())?  obj["ref"]() : obj["ref"];
    };
    var getRoot = function (obj)
    {
        return (!isFirebase3x())?  obj["root"]() : obj["root"];
    };
    var serverTimeStamp = function ()
    {
        if (!isFirebase3x())
            return window["Firebase"]["ServerValue"]["TIMESTAMP"];
        else
            return window["Firebase"]["database"]["ServerValue"];
    };
    var getTimestamp = function (obj)
    {
        return (!isFirebase3x())?  obj : obj["TIMESTAMP"];
    };
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	pluginProto.acts = new Acts();
	Acts.prototype.initializeApp = function (apiKey, authDomain, databaseURL, storageBucket)
	{
        this.initializeApp(apiKey, authDomain, databaseURL, storageBucket);
	};
	function Exps() {};
	pluginProto.exps = new Exps();
    var __afterInitialHandler = [];
    var addAfterInitialHandler = function(callback)
    {
        if (__afterInitialHandler === null)
            callback()
        else
            __afterInitialHandler.push(callback);
    };
    var runAfterInitializeHandlers = function()
    {
        var i, cnt=__afterInitialHandler.length;
        for(i=0; i<cnt; i++)
        {
            __afterInitialHandler[i]();
        }
        __afterInitialHandler = null;
    };
	window.FirebaseAddAfterInitializeHandler = addAfterInitialHandler;
    var ItemListKlass = function ()
    {
        this.updateMode = 1;                  // AUTOCHILDUPDATE
        this.keyItemID = "__itemID__";
        this.snapshot2Item = null;
        this.onItemAdd = null;
        this.onItemRemove = null;
        this.onItemChange = null;
        this.onItemsFetch = null;
        this.onGetIterItem = null;
        this.extra = {};
        this.query = null;
        this.items = [];
        this.itemID2Index = {};
        this.onAddChildCb = null;
        this.onRemoveChildCb = null;
        this.onChangeChildCb = null;
        this.onItemsFetchCb = null;
    };
    var ItemListKlassProto = ItemListKlass.prototype;
    ItemListKlassProto.MANUALUPDATE = 0;
    ItemListKlassProto.AUTOCHILDUPDATE = 1;
    ItemListKlassProto.AUTOALLUPDATE = 2;
    ItemListKlassProto.GetItems = function ()
    {
        return this.items;
    };
    ItemListKlassProto.GetItemIndexByID = function (itemID)
    {
        return this.itemID2Index[itemID];
    };
    ItemListKlassProto.GetItemByID = function (itemID)
    {
        var i = this.GetItemIndexByID(itemID);
        if (i == null)
            return null;
        return this.items[i];
    };
    ItemListKlassProto.Clean = function ()
    {
        this.items.length = 0;
        cleanTable(this.itemID2Index);
    };
    ItemListKlassProto.StartUpdate = function (query)
    {
        this.StopUpdate();
        this.Clean();
        if (this.updateMode === this.MANUALUPDATE)
            this.manualUpdate(query);
        else if (this.updateMode === this.AUTOCHILDUPDATE)
            this.startUpdateChild(query);
        else if (this.updateMode === this.AUTOALLUPDATE)
            this.startUpdateAll(query);
    };
    ItemListKlassProto.StopUpdate = function ()
	{
        if (this.updateMode === this.AUTOCHILDUPDATE)
            this.stopUpdateChild();
        else if (this.updateMode === this.AUTOALLUPDATE)
            this.stopUpdateAll();
	};
	ItemListKlassProto.ForEachItem = function (runtime, start, end)
	{
	    if ((start == null) || (start < 0))
	        start = 0;
	    if ((end == null) || (end > this.items.length - 1))
	        end = this.items.length - 1;
        var current_frame = runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
		var i;
		for(i=start; i<=end; i++)
		{
            if (solModifierAfterCnds)
            {
                runtime.pushCopySol(current_event.solModifiers);
            }
            if (this.onGetIterItem)
                this.onGetIterItem(this.items[i], i);
            current_event.retrigger();
		    if (solModifierAfterCnds)
		    {
		        runtime.popSol(current_event.solModifiers);
		    }
		}
		return false;
	};
    ItemListKlassProto.addItem = function(snapshot, prevName, force_push)
	{
	    var item;
	    if (this.snapshot2Item)
	        item = this.snapshot2Item(snapshot);
	    else
	    {
	        var k = getKey(snapshot);
	        item = snapshot["val"]();
	        item[this.keyItemID] = k;
	    }
        if (force_push === true)
        {
            this.items.push(item);
            return;
        }
	    if (prevName == null)
	    {
            this.items.unshift(item);
        }
        else
        {
            var i = this.itemID2Index[prevName];
            if (i == this.items.length-1)
                this.items.push(item);
            else
                this.items.splice(i+1, 0, item);
        }
        return item;
	};
	ItemListKlassProto.removeItem = function(snapshot)
	{
	    var k = getKey(snapshot);
	    var i = this.itemID2Index[k];
	    var item = this.items[i];
	    cr.arrayRemove(this.items, i);
	    return item;
	};
	ItemListKlassProto.updateItemID2Index = function()
	{
	    cleanTable(this.itemID2Index);
	    var i,cnt = this.items.length;
	    for (i=0; i<cnt; i++)
	    {
	        this.itemID2Index[this.items[i][this.keyItemID]] = i;
	    }
	};
    ItemListKlassProto.manualUpdate = function(query)
    {
        var self=this;
        var onReadItem = function(childSnapshot)
        {
            self.addItem(childSnapshot, null, true);
        };
        var handler = function (snapshot)
        {
            snapshot["forEach"](onReadItem);
            self.updateItemID2Index();
            if (self.onItemsFetch)
                self.onItemsFetch(self.items)
        };
        query["once"]("value", handler);
    };
    ItemListKlassProto.startUpdateChild = function(query)
    {
        var self = this;
	    var onAddChildCb = function (newSnapshot, prevName)
	    {
	        var item = self.addItem(newSnapshot, prevName);
	        self.updateItemID2Index();
	        if (self.onItemAdd)
	            self.onItemAdd(item);
	    };
	    var onRemoveChildCb = function (snapshot)
	    {
	        var item = self.removeItem(snapshot);
	        self.updateItemID2Index();
	        if (self.onItemRemove)
	            self.onItemRemove(item);
	    };
	    var onChangeChildCb = function (snapshot, prevName)
	    {
	        var item = self.removeItem(snapshot);
	        self.updateItemID2Index();
	        self.addItem(snapshot, prevName);
	        self.updateItemID2Index();
	        if (self.onItemChange)
	            self.onItemChange(item);
	    };
	    this.query = query;
        this.onAddChildCb = onAddChildCb;
        this.onRemoveChildCb = onRemoveChildCb;
        this.onChangeChildCb = onChangeChildCb;
	    query["on"]("child_added", onAddChildCb);
	    query["on"]("child_removed", onRemoveChildCb);
	    query["on"]("child_moved", onChangeChildCb);
	    query["on"]("child_changed", onChangeChildCb);
    };
    ItemListKlassProto.stopUpdateChild = function ()
	{
        if (!this.query)
            return;
        this.query["off"]("child_added", this.onAddChildCb);
	    this.query["off"]("child_removed", this.onRemoveChildCb);
	    this.query["off"]("child_moved", this.onChangeChildCb);
	    this.query["off"]("child_changed", this.onChangeChildCb);
        this.onAddChildCb = null;
        this.onRemoveChildCb = null;
        this.onChangeChildCb = null;
        this.query = null;
	};
    ItemListKlassProto.startUpdateAll = function(query)
    {
        var self=this;
        var onReadItem = function(childSnapshot)
        {
            self.addItem(childSnapshot, null, true);
        };
        var onItemsFetchCb = function (snapshot)
        {
            self.Clean();
            snapshot["forEach"](onReadItem);
            self.updateItemID2Index();
            if (self.onItemsFetch)
                self.onItemsFetch(self.items)
        };
        this.query = query;
        this.onItemsFetchCb = onItemsFetchCb;
        query["on"]("value", onItemsFetchCb);
    };
    ItemListKlassProto.stopUpdateAll = function ()
	{
        if (!this.query)
            return;
        this.query["off"]("value", this.onItemsFetchCb);
        this.onItemsFetchCb = null;
        this.query = null;
	};
	var cleanTable = function (o)
	{
	    var k;
	    for (k in o)
	        delete o[k];
	};
	window.FirebaseItemListKlass = ItemListKlass;
    var CallbackMapKlass = function ()
    {
        this.map = {};
    };
    var CallbackMapKlassProto = CallbackMapKlass.prototype;
	CallbackMapKlassProto.Reset = function(k)
	{
        for (var k in this.map)
            delete this.map[k];
	};
	CallbackMapKlassProto.get_callback = function(absRef, eventType, cbName)
	{
        if (!this.IsExisted(absRef, eventType, cbName))
            return null;
        return this.map[absRef][eventType][cbName];
	};
    CallbackMapKlassProto.IsExisted = function (absRef, eventType, cbName)
    {
        if (!this.map.hasOwnProperty(absRef))
            return false;
        if (!eventType)  // don't check event type
            return true;
        var eventMap = this.map[absRef];
        if (!eventMap.hasOwnProperty(eventType))
            return false;
        if (!cbName)  // don't check callback name
            return true;
        var cbMap = eventMap[eventType];
        if (!cbMap.hasOwnProperty(cbName))
            return false;
        return true;
    };
	CallbackMapKlassProto.Add = function(query, eventType, cbName, cb)
	{
	    var absRef = query["toString"]();
        if (this.IsExisted(absRef, eventType, cbName))
            return;
        if (!this.map.hasOwnProperty(absRef))
            this.map[absRef] = {};
        var eventMap = this.map[absRef];
        if (!eventMap.hasOwnProperty(eventType))
            eventMap[eventType] = {};
        var cbMap = eventMap[eventType];
        cbMap[cbName] = cb;
	    query["on"](eventType, cb);
	};
	CallbackMapKlassProto.Remove = function(absRef, eventType, cbName)
	{
	    if ((absRef != null) && (typeof(absRef) == "object"))
	        absRef = absRef["toString"]();
        if (absRef && eventType && cbName)
        {
            var cb = this.get_callback(absRef, eventType, cbName);
            if (cb == null)
                return;
            getRef(absRef)["off"](eventType, cb);
            delete this.map[absRef][eventType][cbName];
        }
        else if (absRef && eventType && !cbName)
        {
            var eventMap = this.map[absRef];
            if (!eventMap)
                return;
            var cbMap = eventMap[eventType];
            if (!cbMap)
                return;
            getRef(absRef)["off"](eventType);
            delete this.map[absRef][eventType];
        }
        else if (absRef && !eventType && !cbName)
        {
            var eventMap = this.map[absRef];
            if (!eventMap)
                return;
            getRef(absRef)["off"]();
            delete this.map[absRef];
        }
        else if (!absRef && !eventType && !cbName)
        {
            for (var r in this.map)
            {
                getRef(r)["off"]();
                delete this.map[r];
            }
        }
	};
	CallbackMapKlassProto.RemoveAllCB = function(absRef)
	{
	    if (absRef)
	    {
            var eventMap = this.map[absRef];
            for (var e in eventMap)
            {
                var cbMap = eventMap[e];
                for (var cbName in cbMap)
                {
                    getRef(absRef)["off"](e, cbMap[cbName]);
                }
            }
            delete this.map[absRef];
	    }
	    else if (!absRef)
	    {
            for (var r in this.map)
            {
                var eventMap = this.map[r];
                for (var e in eventMap)
                {
                    var cbMap = eventMap[e];
                    for (var cbName in cbMap)
                    {
                        getRef(r)["off"](e, cbMap[cbName]);
                    }
                }
                delete this.map[r];
            }
        }
	};
    CallbackMapKlassProto.getDebuggerValues = function (propsections)
    {
        var r, eventMap, e, cbMap, cn, display;
        for (r in this.map)
        {
            eventMap = this.map[r];
            for (e in eventMap)
            {
                cbMap = eventMap[e];
                for (cn in cbMap)
                {
                    display = cn+":"+e+"-"+r;
                    propsections.push({"name": display, "value": ""});
                }
            }
        }
    };
    CallbackMapKlassProto.GetRefMap = function ()
    {
        return this.map;
    };
	window.FirebaseCallbackMapKlass = CallbackMapKlass;
    var getValueByKeyPath = function (item, k, default_value)
    {
        var v;
        if (item == null)
            v = null;
        else if ((k == null) || (k === ""))
            v = item;
        else if (typeof(item) !== "object")
            v = null;
        else if (k.indexOf(".") === -1)
            v = item[k];
        else
        {
            v = item;
            var keys = k.split(".");
            var i, cnt=keys.length;
            for(i=0; i<cnt; i++)
            {
                v = v[ keys[i] ];
                if (v == null)
                    break;
            }
        }
        return din(v, default_value);
    }
    var din = function (d, default_value)
    {
        var o;
	    if (d === true)
	        o = 1;
	    else if (d === false)
	        o = 0;
        else if (d == null)
        {
            if (default_value != null)
                o = default_value;
            else
                o = 0;
        }
        else if (typeof(d) == "object")
            o = JSON.stringify(d);
        else
            o = d;
	    return o;
    };
	window.FirebaseGetValueByKeyPath = getValueByKeyPath;
}());
/*
<itemID>\
    <Key> : <value>
*/
;
;
cr.plugins_.Rex_Firebase_ItemTable = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Rex_Firebase_ItemTable.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
	    this.rootpath = this.properties[0] + "/" + this.properties[1] + "/";
        this.save_item = {};
	    if (!this.recycled)
	    {
            this.disconnectRemove_absRefs = {};
            this.load_request_itemIDs = {};
            this.load_items = {};
            this.load_items_cnt = null;
        }
        else
        {
            clean_table( this.disconnectRemove_absRefs );
            clean_table( this.load_request_itemIDs );
            this.clean_load_items();
        }
        this.trig_tag = null;
        this.exp_CurItemID = "";
        this.exp_CurItemContent = null;
        this.exp_CurKey = "";
        this.exp_CurValue = 0;
        this.exp_LastItemID = "";
        this.exp_LastGeneratedKey = "";
	};
	instanceProto.onDestroy = function ()
	{
	    this.CancelOnDisconnected();
        this.save_item = {};
        clean_table( this.disconnectRemove_absRefs );
        clean_table( this.load_request_itemIDs );
        this.clean_load_items();
	};
	instanceProto.clean_load_items = function ()
	{
        clean_table( this.load_items );
        this.load_items_cnt = null;
	};
	var isFirebase3x = function()
	{
        return (window["FirebaseV3x"] === true);
    };
    var isFullPath = function (p)
    {
        return (p.substring(0,8) === "https://");
    };
	instanceProto.get_ref = function(k)
	{
        if (k == null)
	        k = "";
	    var path;
	    if (isFullPath(k))
	        path = k;
	    else
	        path = this.rootpath + k + "/";
        if (!isFirebase3x())
        {
            return new window["Firebase"](path);
        }
        else
        {
            var fnName = (isFullPath(path))? "refFromURL":"ref";
            return window["Firebase"]["database"]()[fnName](path);
        }
	};
    var get_key = function (obj)
    {
        return (!isFirebase3x())?  obj["key"]() : obj["key"];
    };
    var get_refPath = function (obj)
    {
        return (!isFirebase3x())?  obj["ref"]() : obj["ref"];
    };
    var get_root = function (obj)
    {
        return (!isFirebase3x())?  obj["root"]() : obj["root"];
    };
    var serverTimeStamp = function ()
    {
        if (!isFirebase3x())
            return window["Firebase"]["ServerValue"]["TIMESTAMP"];
        else
            return window["Firebase"]["database"]["ServerValue"];
    };
    var get_timestamp = function (obj)
    {
        return (!isFirebase3x())?  obj : obj["TIMESTAMP"];
    };
	instanceProto.ForEachItemID = function (itemIDList, items)
	{
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
		var i, cnt=itemIDList.length;
		for(i=0; i<cnt; i++)
		{
            if (solModifierAfterCnds)
            {
                this.runtime.pushCopySol(current_event.solModifiers);
            }
            this.exp_CurItemID = itemIDList[i];
            this.exp_CurItemContent = items[this.exp_CurItemID];
            current_event.retrigger();
		    if (solModifierAfterCnds)
		    {
		        this.runtime.popSol(current_event.solModifiers);
		    }
		}
		return false;
	};
    instanceProto.Save = function (itemID, save_item, set_mode, tag_)
	{
	    if (itemID === "")
	    {
	        var ref = this.get_ref()["push"]();
	   	    itemID = get_key(ref);
	    }
	    else
	    {
	        var ref = this.get_ref(itemID);
	    }
	    var self = this;
	    var on_save = function (error)
	    {
		    var trig = (!error)? cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnSaveComplete:
		                         cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnSaveError;
            self.trig_tag = tag_;
            self.exp_CurItemID = itemID;
		    self.runtime.trigger(trig, self);
		    self.trig_tag = null;
		    self.exp_CurItemID = "";
	    };
	    this.exp_LastItemID = itemID;
	    var is_empty = is_empty_table(save_item);
	    var save_data = (is_empty)? true: save_item;
	    var op = (set_mode == 1)? "set":"update";
	    ref[op](save_data, on_save);
	};
    instanceProto.Remove = function (itemID, tag_)
	{
	    var self = this;
	    var on_remove = function (error)
	    {
		    var trig = (!error)? cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnRemoveComplete:
		                         cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnRemoveError;
            self.trig_tag = tag_;
            self.exp_CurItemID = itemID;
		    self.runtime.trigger(trig, self);
		    self.trig_tag = null;
		    self.exp_CurItemID = "";
	    };
	    this.get_ref(itemID)["remove"](on_remove);
	};
    instanceProto.At = function (itemID, key_, default_value)
	{
	    var v;
        if (!this.load_items.hasOwnProperty(itemID))
            v = null;
        else
            v = this.load_items[itemID][key_];
        v = din(v, default_value);
		return v;
	};
    instanceProto.CancelOnDisconnected = function ()
	{
	    for(var r in this.disconnectRemove_absRefs)
	    {
	        this.get_ref(r)["onDisconnect"]()["cancel"]();
	        delete this.disconnectRemove_absRefs[r];
	    }
	};
    var getFullKey = function (prefix, itemID, key)
    {
        var k = prefix;
        if (itemID != null)
            k +=  "/" + itemID;
        if (key != null)
        {
            key = key.replace(/\./g, "/");
            k += "/" + key;
        }
        return k;
    }
	var clean_table = function (o)
	{
		for (var k in o)
		    delete o[k];
	};
	var is_empty_table = function (o)
	{
		for (var k in o)
		    return false;
		return true;
	};
    var din = function (d, default_value)
    {
        var o;
	    if (d === true)
	        o = 1;
	    else if (d === false)
	        o = 0;
        else if (d == null)
        {
            if (default_value != null)
                o = default_value;
            else
                o = 0;
        }
        else if (typeof(d) == "object")
            o = JSON.stringify(d);
        else
            o = d;
	    return o;
    };
    var dout = function (d)
    {
        var o;
        if (typeof(d) == "string")
        {
            try
            {
	            o = JSON.parse(d)
            }
            catch(err)
            {
                o = d;
            }
        }
        else
        {
            o = d;
        }
        return o;
    };
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	Cnds.prototype.OnSaveComplete = function (tag_)
	{
	    return cr.equals_nocase(tag_, this.trig_tag);
	};
	Cnds.prototype.OnSaveError = function (tag_)
	{
	    return cr.equals_nocase(tag_, this.trig_tag);
	};
	Cnds.prototype.OnRemoveComplete = function (tag_)
	{
	    return cr.equals_nocase(tag_, this.trig_tag);
	};
	Cnds.prototype.OnRemoveError = function (tag_)
	{
	    return cr.equals_nocase(tag_, this.trig_tag);
	};
	Cnds.prototype.OnLoadComplete = function (tag_)
	{
	    return cr.equals_nocase(tag_, this.trig_tag);
	};
    var inc = function(a, b)
    {
        return (a > b)?  1:
               (a == b)? 0:
                         (-1);
    };
    var dec = function(a, b)
    {
        return (a < b)?  1:
               (a == b)? 0:
                         (-1);
    };
	Cnds.prototype.ForEachItemID = function (order)
	{
	    var itemIDList = Object.keys(this.load_items);
	    var sort_fn = (order === 0)? inc:dec;
	    itemIDList.sort(sort_fn);
	    return this.ForEachItemID(itemIDList, this.load_items);
	};
	Cnds.prototype.ForEachKey = function (itemID)
	{
	    var item_props = this.load_items[itemID];
	    if (item_props == null)
	        return false;
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
		var k, o=item_props;
		for(k in o)
		{
            if (solModifierAfterCnds)
            {
                this.runtime.pushCopySol(current_event.solModifiers);
            }
            this.exp_CurKey = k;
            this.exp_CurValue = o[k];
            current_event.retrigger();
		    if (solModifierAfterCnds)
		    {
		        this.runtime.popSol(current_event.solModifiers);
		    }
		}
		return false;
	};
	Cnds.prototype.OnCleanAllComplete = function ()
	{
	    return true;
	};
	Cnds.prototype.OnCleanAllError = function ()
	{
	    return true;
	};
	function Acts() {};
	pluginProto.acts = new Acts();
    Acts.prototype.SetDomainRef = function (domain_ref, sub_domain_ref)
	{
		this.rootpath = domain_ref + "/" + sub_domain_ref + "/";
		this.clean_load_items();
	};
    Acts.prototype.SetValue = function (key_, value_)
	{
		this.save_item[key_] = dout(value_);
	};
    Acts.prototype.SetBooleanValue = function (key_, is_true)
	{
		this.save_item[key_] = (is_true == 1);
	};
    Acts.prototype.RemoveKey = function (key_)
	{
		this.save_item[key_] = null;
	};
    Acts.prototype.Save = function (itemID, set_mode, tag_)
	{
	    this.Save(itemID, this.save_item, set_mode, tag_);
        this.save_item = {};
	};
    Acts.prototype.Push = function (tag_)
	{
	    this.Save("", this.save_item, 1, tag_);
        this.save_item = {};
	};
    Acts.prototype.Remove = function (itemID, tag_)
	{
	    this.Remove(itemID, tag_);
	};
    Acts.prototype.GenerateKey = function ()
	{
	    var ref = this.get_ref()["push"]();
        this.exp_LastGeneratedKey = get_key(ref);
	};
    Acts.prototype.SetPosValue = function (x, y)
	{
		this.save_item["pos"] = {"x":x, "y":y};
	};
    Acts.prototype.SetServerTimestampValue = function (key_)
	{
		this.save_item[key_] = serverTimeStamp();
	};
    Acts.prototype.AddLoadRequestItemID = function (itemID)
	{
	    if (itemID == "")
	        return;
		this.load_request_itemIDs[itemID] = true;
	};
    Acts.prototype.LoadItems = function (tag_)
	{
	    this.clean_load_items();
        var self = this;
        var wait_events = 0;
	    var isDone_handler = function()
	    {
	        wait_events -= 1;
	        if (wait_events == 0)
	        {
                self.trig_tag = tag_;
                var trig = cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnLoadComplete;
				self.runtime.trigger(trig, self);
				self.trig_tag = null;
	        }
	    };
	    var on_read = function (snapshot)
	    {
	        var itemID = get_key(snapshot);
	        var content = snapshot["val"]();
	        self.load_items[itemID] = content;
	        isDone_handler();
	    };
        var itemID, item_ref;
		for(itemID in this.load_request_itemIDs)
		{
		    wait_events += 1;
		    item_ref = this.get_ref(itemID)["once"]("value", on_read);
		    delete this.load_request_itemIDs[itemID];
		}
	};
    Acts.prototype.LoadAllItems = function (tag_)
	{
	    clean_table(this.load_items);
        var self = this;
        var wait_events = 0;
	    var isDone_handler = function()
	    {
	        wait_events -= 1;
	        if (wait_events == 0)
	        {
                self.trig_tag = tag_;
                var trig = cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnLoadComplete;
				self.runtime.trigger(trig, self);
				self.trig_tag = null;
	        }
	    };
        var read_item = function(childSnapshot)
        {
            var key = get_key(childSnapshot);
            var childData = childSnapshot["val"]();
            self.load_items[key] = childData;
        };
	    var on_read = function (snapshot)
	    {
            snapshot["forEach"](read_item);
            isDone_handler();
	    };
        wait_events += 1;
        this.get_ref()["once"]("value", on_read);
	};
    Acts.prototype.CancelOnDisconnected = function ()
	{
	    this.CancelOnDisconnected();
	};
    Acts.prototype.RemoveOnDisconnected = function (itemID)
	{
	    if (itemID == "")
	        return;
        var ref = this.get_ref(itemID);
        ref["onDisconnect"]()["remove"]();
	    this.disconnectRemove_absRefs[ref["toString"]()] = true;
	};
    Acts.prototype.CleanAll = function ()
	{
        var self=this;
        var onComplete = function(error)
        {
	        var trig = (!error)? cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnCleanAllComplete:
	                                    cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnCleanAllError;
	        self.runtime.trigger(trig, self);
        };
	    var ref = this.get_ref();
        ref["remove"](onComplete);
	};
	function Exps() {};
	pluginProto.exps = new Exps();
    Exps.prototype.CurItemID = function (ret)
	{
		ret.set_string(this.exp_CurItemID);
	};
	Exps.prototype.LoadResultToJSON = function (ret)
	{
		ret.set_string(JSON.stringify(this.load_items));
	};
    Exps.prototype.CurKey = function (ret)
	{
		ret.set_string(this.exp_CurKey);
	};
    Exps.prototype.CurValue = function (ret)
	{
	    var v = this.exp_CurValue;
	    v = din(v);
		ret.set_any(v);
	};
    Exps.prototype.At = function (ret, itemID, key_, default_value)
	{
	    var v;
        if (!this.load_items.hasOwnProperty(itemID))
            v = null;
        else
            v = this.load_items[itemID][key_];
        v = din(v, default_value);
		ret.set_any(v);
	};
	Exps.prototype.LastItemID = function (ret)
	{
		ret.set_string(this.exp_LastItemID);
	};
    Exps.prototype.CurItemContent = function (ret, key_, default_value)
	{
	    var v;
        if (key_ == null)
            v = din(this.exp_CurItemContent);
        else
            v = din(this.exp_CurItemContent[key_], default_value);
		ret.set_any(v);
	};
	Exps.prototype.ItemsCount = function (ret)
	{
        if (this.load_items_cnt === null)
        {
            this.load_items_cnt = 0;
            for (var k in this.load_items)
                this.load_items_cnt += 1;
        }
		ret.set_int(this.load_items_cnt);
	};
	Exps.prototype.GenerateKey = function (ret)
	{
	    var ref = this.get_ref()["push"]();
        this.exp_LastGeneratedKey = get_key(ref);
		ret.set_string(this.exp_LastGeneratedKey);
	};
	Exps.prototype.LastGeneratedKey = function (ret)
	{
	    ret.set_string(this.exp_LastGeneratedKey);
	};
    Exps.prototype.Ref = function (ret, itemID_, key_)
	{
        var path = this.rootpath + getFullKey("", itemID_, key_);
		ret.set_string(path);
	};
}());
;
;
cr.plugins_.Rex_GoogleWebFontLoader = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Rex_GoogleWebFontLoader.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
        this.timeout = Math.floor(this.properties[0]*1000);
        this.isLocalAPI = (this.properties[0] ===0);
        this.isLoaded = false;
        this.exp_LastFamilyName = "";
        var self=this;
        var cnds = cr.plugins_.Rex_GoogleWebFontLoader.prototype.cnds;
        window["WebFontConfig"] = {
            "loading": function() {self.runtime.trigger(cnds.OnLoading, self);},
            "active": function() {self.runtime.trigger(cnds.OnActive, self);},
            "inactive": function() {self.runtime.trigger(cnds.OnInactive, self);},
            "fontloading": function(familyName, fvd) { self.exp_LastFamilyName=familyName; self.runtime.trigger(cnds.OnFontloading, self);},
            "fontactive": function(familyName, fvd) { self.exp_LastFamilyName=familyName; self.runtime.trigger(cnds.OnFontactive, self);},
            "fontinactive": function(familyName, fvd) { self.exp_LastFamilyName=familyName; self.runtime.trigger(cnds.OnFontinactive, self);},
            "timeout": this.timeout,
        };
	};
	instanceProto.onDestroy = function ()
	{
	};
    instanceProto.LoadAPI = function(file_name, onload_, onerror_)
	{
	    var scripts=document.getElementsByTagName("script");
	    var exist=false;
	    for(var i=0;i<scripts.length;i++)
	    {
	    	if(scripts[i].src.indexOf(file_name) != -1)
	    	{
	    		exist=true;
	    		break;
	    	}
	    }
	    if(!exist)
	    {
	    	var newScriptTag=document.createElement("script");
            newScriptTag["type"] = "text/javascript";
            newScriptTag["src"] = file_name;
            var self=this;
            var onLoad = function()
            {
                self.isLoaded = true;
                if (onload_)
                    onload_();
            };
            var onError = function()
            {
                if (onerror_)
                    onerror_();
            };
            newScriptTag["onload"] = onLoad;
            newScriptTag["onerror"] = onError;
	    	document.getElementsByTagName("head")[0].appendChild(newScriptTag);
	    }
	};
    var getAPISrc = function (isLocalAPI)
    {
        var url;
        if (isLocalAPI)
        {
            url = "webfont.js";
        }
        else
        {
            var protocol = ('https:' == document.location.protocol ? 'https' : 'http');
            url = protocol + "://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js";
        }
        return url;
    };
    var isCSSFile = function (url_)
    {
        var s = url_.split(".");
        var ext = s[ s.length-1 ];
        return (ext === "css");
    }
    var insertCss = function ( code )
    {
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet)
        {
            style.styleSheet.cssText = code;
        }
        else
        {
            style.innerHTML = code;
        }
        document.getElementsByTagName("head")[0].appendChild( style );
    };
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	Cnds.prototype.OnLoading = function ()
	{
	    return true;
	};
	Cnds.prototype.OnActive = function ()
	{
	    return true;
	};
	Cnds.prototype.OnInactive = function ()
	{
	    return true;
	};
	Cnds.prototype.OnFontloading = function ()
	{
	    return true;
	};
	Cnds.prototype.OnFontactive = function ()
	{
	    return true;
	};
	Cnds.prototype.OnFontinactive = function ()
	{
	    return true;
	};
	Cnds.prototype.OnLoadAPIError = function ()
	{
	    return true;
	};
	function Acts() {};
	pluginProto.acts = new Acts();
	Acts.prototype.Load = function()
	{
        if (this.isLoaded)
        {
            return;
        }
        else
        {
            var self=this;
            var on_error = function()
            {
                self.runtime.trigger(cr.plugins_.Rex_GoogleWebFontLoader.prototype.cnds.OnLoadAPIError, self);
            };
            this.LoadAPI(getAPISrc(this.isLocalAPI), null, on_error);
        }
	};
	Acts.prototype.AddGoogleFont = function(name)
	{
        var fontsCfg = window["WebFontConfig"];
        if (!fontsCfg.hasOwnProperty("google"))
        {
            fontsCfg["google"] = { "families":[] };
        }
        var  families = fontsCfg["google"]["families"];
        if (cr.fastIndexOf(families, name) === -1)
            families.push(name);
	};
	Acts.prototype.AddTypekitFont = function(id, api)
	{
        var fontsCfg = window["WebFontConfig"];
        fontsCfg["typekit"] = {
            "id": id,
            "api": api,
        }
	};
	Acts.prototype.AddFontsCom = function(projectId, version, loadAllFonts)
	{
        var fontsCfg = window["WebFontConfig"];
        fontsCfg["monotype"] = {
            "projectId": projectId,
            "version": version,
            "loadAllFonts": (loadAllFonts===1),
        }
	};
	Acts.prototype.AddCustomFont = function(name, url)
	{
        var fontsCfg = window["WebFontConfig"];
        if (!fontsCfg.hasOwnProperty("custom"))
        {
            fontsCfg["custom"] = { "families":[] };
        }
        var  families = fontsCfg["custom"]["families"];
        if (cr.fastIndexOf(families, name) === -1)
            families.push(name);
        if (isCSSFile(url))
        {
            if (!fontsCfg["custom"].hasOwnProperty("urls"))
            {
                fontsCfg["custom"]["urls"] = [];
            }
            var urls = fontsCfg["custom"]["urls"];
            if (cr.fastIndexOf(urls, url) === -1)
                urls.push(url);
        }
        else
        {
            var cssCode = "@font-face { font-family: '" + name + "'; src: url('" + url + "'); }";
            insertCss(cssCode);
        }
	};
	function Exps() {};
	pluginProto.exps = new Exps();
	Exps.prototype.LastFamilyName = function (ret)
	{
		ret.set_string(this.exp_LastFamilyName);
	}
}());
;
;
cr.plugins_.Rex_Nickname = function (runtime) {
	this.runtime = runtime;
};
(function () {
	var pluginProto = cr.plugins_.Rex_Nickname.prototype;
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function () {};
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function () {
		this.nickname2objtype = {}; // {sid:_sid, index:types_by_index[_index
		this.sid2nickname = {}; // {sid:nickname}
		this.exp_LastCreatedInstUID = -1;
		window.RexC2NicknameObj = this;
	};
	instanceProto.AddNickname = function (nickname, objtype) {
		this.nickname2objtype[nickname] = {
			sid: objtype.sid,
			index: -1
		};
		this.sid2nickname[objtype.sid.toString()] = nickname;
	};
	instanceProto.Nickname2Type = function (nickname) {
		var sidInfo = this.nickname2objtype[nickname];
		if (sidInfo == null)
			return null;
		var sid = sidInfo.sid;
		var objtypes = this.runtime.types_by_index;
		var t = objtypes[sidInfo.index];
		if ((t != null) && (t.sid === sid))
			return t;
		var i, len = objtypes.length;
		for (i = 0; i < len; i++) {
			t = objtypes[i];
			if (t.sid === sid) {
				sidInfo.index = i;
				return t;
			}
		}
		return null;
	};
	instanceProto.CreateInst = function (nickname, x, y, layer, callback, ignore_picking) {
		var objtype = (typeof (nickname) == "string") ? this.Nickname2Type(nickname) :
			nickname;
		if (objtype == null)
			return null;
		var inst = window.RexC2CreateObject.call(this, objtype, layer, x, y, callback, ignore_picking);
		return inst;
	};
	var has_objtype = function (objfamily, objb) {
		if ((!objfamily) || (!objb))
			return false;
		else if (objfamily.is_family) // family contain this objtype
			return (objfamily.members.indexOf(objb) != -1);
		else // objtype is equal
			return (objfamily === objb);
	};
	var clean_sol = function (objtype) {
		var sol = objtype.getCurrentSol();
		sol.select_all = false;
		sol.instances.length = 0; // clear contents
	};
	var extend_sol = function (objtype, insts) {
		var sol = objtype.getCurrentSol();
		var sol_insts = sol.instances;
		sol_insts.push.apply(sol_insts, insts);
		sol.select_all = false;
	};
	var has_any_picked_inst = function (objtype) {
		return (objtype.getCurrentSol().instances.length > 0);
	};
	instanceProto.PickAll = function (nickname, family_objtype) {
		var objtype = this.Nickname2Type(nickname);
		if (!has_objtype(family_objtype, objtype)) {
			clean_sol(family_objtype);
		} else if (family_objtype.is_family) {
			var sol = objtype.getCurrentSol();
			var sol_save = sol.select_all;
			sol.select_all = true;
			clean_sol(family_objtype);
			extend_sol(family_objtype, sol.getObjects());
			sol.select_all = sol_save;
		} else {
			var sol = family_objtype.getCurrentSol();
			sol.select_all = true;
		}
		return has_any_picked_inst(family_objtype);
	};
	instanceProto.PickMatched = function (_substring, family_objtype) {
		if (family_objtype.is_family) {
			clean_sol(family_objtype);
			var nickname;
			var objtype, sol, sol_save;
			for (nickname in this.nickname2objtype) {
				if (nickname.match(_substring) == null)
					continue;
				objtype = this.Nickname2Type(nickname);
				if (!has_objtype(family_objtype, objtype))
					continue;
				sol = objtype.getCurrentSol();
				sol_save = sol.select_all;
				sol.select_all = true;
				extend_sol(family_objtype, sol.getObjects());
				sol.select_all = sol_save;
			}
		} else {
			var nickname = this.sid2nickname[family_objtype.sid];
			if ((nickname != null) && (nickname.match(_substring) != null)) {
				var sol = family_objtype.getCurrentSol();
				sol.select_all = true;
			} else {
				clean_sol(family_objtype);
			}
		}
		return has_any_picked_inst(family_objtype);
	};
	instanceProto.saveToJSON = function () {
		return {
			"sid2name": this.sid2nickname,
		};
	};
	instanceProto.loadFromJSON = function (o) {
		var sid2name = o["sid2name"];
		this.sid2nickname = sid2name;
		var sid, name, objtype;
		for (sid in sid2name) {
			name = sid2name[sid];
			this.nickname2objtype[name] = {
				sid: parseInt(sid, 10),
				index: -1
			};
		}
	};
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	Cnds.prototype.IsNicknameValid = function (nickname) {
		return (this.nickname2objtype[nickname] != null);
	};
	Cnds.prototype.Pick = function (nickname, family_objtype) {
		return this.PickAll(nickname, family_objtype);
	};
	Cnds.prototype.PickMatched = function (_substring, family_objtype) {
		return this.PickMatched(_substring, family_objtype);
	};
	function Acts() {};
	pluginProto.acts = new Acts();
	Acts.prototype.AssignNickname = function (nickname, objtype) {
		if (objtype == null)
			return;
		this.AddNickname(nickname, objtype);
	};
	Acts.prototype.CreateInst = function (nickname, x, y, _layer, family_objtype) {
		var inst = this.CreateInst(nickname, x, y, _layer, null, true);
		4
		this.exp_LastCreatedInstUID = (inst) ? inst.uid : (-1);
		if (!family_objtype)
			return;
		if ((inst == null) ||
			(!has_objtype(family_objtype, inst.type))) {
			clean_sol(family_objtype);
		} else {
			family_objtype.getCurrentSol().pick_one(inst);
			family_objtype.applySolToContainer();
		}
	};
	Acts.prototype.Pick = function (nickname, family_objtype) {
		this.PickAll(nickname, family_objtype);
	};
	Acts.prototype.PickMatched = function (_substring, family_objtype) {
		this.PickMatched(_substring, family_objtype);
	};
	function Exps() {};
	pluginProto.exps = new Exps();
	Exps.prototype.LastCreatedInstUID = function (ret) {
		ret.set_int(this.exp_LastCreatedInstUID);
	};
}());
(function () {
	if (window.RexC2CreateObject != null)
		return;
	var CreateObject = function (obj, layer, x, y, callback, ignore_picking) {
		if (!layer || !obj)
			return;
		var inst = this.runtime.createInstance(obj, layer, x, y);
		if (!inst)
			return;
		this.runtime.isInOnDestroy++;
		if (callback)
			callback(inst);
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained) {
			for (i = 0, len = inst.siblings.length; i < len; i++) {
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
		if (ignore_picking !== true) {
			var sol = obj.getCurrentSol();
			sol.select_all = false;
			sol.instances.length = 1;
			sol.instances[0] = inst;
			if (inst.is_contained) {
				for (i = 0, len = inst.siblings.length; i < len; i++) {
					s = inst.siblings[i];
					sol = s.type.getCurrentSol();
					sol.select_all = false;
					sol.instances.length = 1;
					sol.instances[0] = s;
				}
			}
		}
		return inst;
	};
	window.RexC2CreateObject = CreateObject;
}());
;
;
cr.plugins_.Sprite = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Sprite.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	function frame_getDataUri()
	{
		if (this.datauri.length === 0)
		{
			var tmpcanvas = document.createElement("canvas");
			tmpcanvas.width = this.width;
			tmpcanvas.height = this.height;
			var tmpctx = tmpcanvas.getContext("2d");
			if (this.spritesheeted)
			{
				tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
										 0, 0, this.width, this.height);
			}
			else
			{
				tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
			}
			this.datauri = tmpcanvas.toDataURL("image/png");
		}
		return this.datauri;
	};
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		var i, leni, j, lenj;
		var anim, frame, animobj, frameobj, wt, uv;
		this.all_frames = [];
		this.has_loaded_textures = false;
		for (i = 0, leni = this.animations.length; i < leni; i++)
		{
			anim = this.animations[i];
			animobj = {};
			animobj.name = anim[0];
			animobj.speed = anim[1];
			animobj.loop = anim[2];
			animobj.repeatcount = anim[3];
			animobj.repeatto = anim[4];
			animobj.pingpong = anim[5];
			animobj.sid = anim[6];
			animobj.frames = [];
			for (j = 0, lenj = anim[7].length; j < lenj; j++)
			{
				frame = anim[7][j];
				frameobj = {};
				frameobj.texture_file = frame[0];
				frameobj.texture_filesize = frame[1];
				frameobj.offx = frame[2];
				frameobj.offy = frame[3];
				frameobj.width = frame[4];
				frameobj.height = frame[5];
				frameobj.duration = frame[6];
				frameobj.hotspotX = frame[7];
				frameobj.hotspotY = frame[8];
				frameobj.image_points = frame[9];
				frameobj.poly_pts = frame[10];
				frameobj.pixelformat = frame[11];
				frameobj.spritesheeted = (frameobj.width !== 0);
				frameobj.datauri = "";		// generated on demand and cached
				frameobj.getDataUri = frame_getDataUri;
				uv = {};
				uv.left = 0;
				uv.top = 0;
				uv.right = 1;
				uv.bottom = 1;
				frameobj.sheetTex = uv;
				frameobj.webGL_texture = null;
				wt = this.runtime.findWaitingTexture(frame[0]);
				if (wt)
				{
					frameobj.texture_img = wt;
				}
				else
				{
					frameobj.texture_img = new Image();
					frameobj.texture_img.cr_src = frame[0];
					frameobj.texture_img.cr_filesize = frame[1];
					frameobj.texture_img.c2webGL_texture = null;
					this.runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
				}
				cr.seal(frameobj);
				animobj.frames.push(frameobj);
				this.all_frames.push(frameobj);
			}
			cr.seal(animobj);
			this.animations[i] = animobj;		// swap array data for object
		}
	};
	typeProto.updateAllCurrentTexture = function ()
	{
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.curWebGLTexture = inst.curFrame.webGL_texture;
		}
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.texture_img.c2webGL_texture = null;
			frame.webGL_texture = null;
		}
		this.has_loaded_textures = false;
		this.updateAllCurrentTexture();
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		this.updateAllCurrentTexture();
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.has_loaded_textures || !this.runtime.glwrap)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		this.has_loaded_textures = true;
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.has_loaded_textures)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			this.runtime.glwrap.deleteTexture(frame.webGL_texture);
			frame.webGL_texture = null;
		}
		this.has_loaded_textures = false;
	};
	var already_drawn_images = [];
	typeProto.preloadCanvas2D = function (ctx)
	{
		var i, len, frameimg;
		cr.clearArray(already_drawn_images);
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frameimg = this.all_frames[i].texture_img;
			if (already_drawn_images.indexOf(frameimg) !== -1)
					continue;
			ctx.drawImage(frameimg, 0, 0);
			already_drawn_images.push(frameimg);
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		var poly_pts = this.type.animations[0].frames[0].poly_pts;
		if (this.recycled)
			this.collision_poly.set_pts(poly_pts);
		else
			this.collision_poly = new cr.CollisionPoly(poly_pts);
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);	// 0=visible, 1=invisible
		this.isTicking = false;
		this.inAnimTrigger = false;
		this.collisionsEnabled = (this.properties[3] !== 0);
		this.cur_animation = this.getAnimationByName(this.properties[1]) || this.type.animations[0];
		this.cur_frame = this.properties[2];
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		var curanimframe = this.cur_animation.frames[this.cur_frame];
		this.collision_poly.set_pts(curanimframe.poly_pts);
		this.hotspotX = curanimframe.hotspotX;
		this.hotspotY = curanimframe.hotspotY;
		this.cur_anim_speed = this.cur_animation.speed;
		this.cur_anim_repeatto = this.cur_animation.repeatto;
		if (!(this.type.animations.length === 1 && this.type.animations[0].frames.length === 1) && this.cur_anim_speed !== 0)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (this.recycled)
			this.animTimer.reset();
		else
			this.animTimer = new cr.KahanAdder();
		this.frameStart = this.getNowTime();
		this.animPlaying = true;
		this.animRepeats = 0;
		this.animForwards = true;
		this.animTriggerName = "";
		this.changeAnimName = "";
		this.changeAnimFrom = 0;
		this.changeAnimFrame = -1;
		this.type.loadTextures();
		var i, leni, j, lenj;
		var anim, frame, uv, maintex;
		for (i = 0, leni = this.type.animations.length; i < leni; i++)
		{
			anim = this.type.animations[i];
			for (j = 0, lenj = anim.frames.length; j < lenj; j++)
			{
				frame = anim.frames[j];
				if (frame.width === 0)
				{
					frame.width = frame.texture_img.width;
					frame.height = frame.texture_img.height;
				}
				if (frame.spritesheeted)
				{
					maintex = frame.texture_img;
					uv = frame.sheetTex;
					uv.left = frame.offx / maintex.width;
					uv.top = frame.offy / maintex.height;
					uv.right = (frame.offx + frame.width) / maintex.width;
					uv.bottom = (frame.offy + frame.height) / maintex.height;
					if (frame.offx === 0 && frame.offy === 0 && frame.width === maintex.width && frame.height === maintex.height)
					{
						frame.spritesheeted = false;
					}
				}
			}
		}
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"a": this.cur_animation.sid,
			"f": this.cur_frame,
			"cas": this.cur_anim_speed,
			"fs": this.frameStart,
			"ar": this.animRepeats,
			"at": this.animTimer.sum,
			"rt": this.cur_anim_repeatto
		};
		if (!this.animPlaying)
			o["ap"] = this.animPlaying;
		if (!this.animForwards)
			o["af"] = this.animForwards;
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		var anim = this.getAnimationBySid(o["a"]);
		if (anim)
			this.cur_animation = anim;
		this.cur_frame = o["f"];
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		this.cur_anim_speed = o["cas"];
		this.frameStart = o["fs"];
		this.animRepeats = o["ar"];
		this.animTimer.reset();
		this.animTimer.sum = o["at"];
		this.animPlaying = o.hasOwnProperty("ap") ? o["ap"] : true;
		this.animForwards = o.hasOwnProperty("af") ? o["af"] : true;
		if (o.hasOwnProperty("rt"))
			this.cur_anim_repeatto = o["rt"];
		else
			this.cur_anim_repeatto = this.cur_animation.repeatto;
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
		this.collision_poly.set_pts(this.curFrame.poly_pts);
		this.hotspotX = this.curFrame.hotspotX;
		this.hotspotY = this.curFrame.hotspotY;
	};
	instanceProto.animationFinish = function (reverse)
	{
		this.cur_frame = reverse ? 0 : this.cur_animation.frames.length - 1;
		this.animPlaying = false;
		this.animTriggerName = this.cur_animation.name;
		this.inAnimTrigger = true;
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnAnyAnimFinished, this);
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnAnimFinished, this);
		this.inAnimTrigger = false;
		this.animRepeats = 0;
	};
	instanceProto.getNowTime = function()
	{
		return this.animTimer.sum;
	};
	instanceProto.tick = function()
	{
		this.animTimer.add(this.runtime.getDt(this));
		if (this.changeAnimName.length)
			this.doChangeAnim();
		if (this.changeAnimFrame >= 0)
			this.doChangeAnimFrame();
		var now = this.getNowTime();
		var cur_animation = this.cur_animation;
		var prev_frame = cur_animation.frames[this.cur_frame];
		var next_frame;
		var cur_frame_time = prev_frame.duration / this.cur_anim_speed;
		if (this.animPlaying && now >= this.frameStart + cur_frame_time)
		{
			if (this.animForwards)
			{
				this.cur_frame++;
			}
			else
			{
				this.cur_frame--;
			}
			this.frameStart += cur_frame_time;
			if (this.cur_frame >= cur_animation.frames.length)
			{
				if (cur_animation.pingpong)
				{
					this.animForwards = false;
					this.cur_frame = cur_animation.frames.length - 2;
				}
				else if (cur_animation.loop)
				{
					this.cur_frame = this.cur_anim_repeatto;
				}
				else
				{
					this.animRepeats++;
					if (this.animRepeats >= cur_animation.repeatcount)
					{
						this.animationFinish(false);
					}
					else
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
				}
			}
			if (this.cur_frame < 0)
			{
				if (cur_animation.pingpong)
				{
					this.cur_frame = 1;
					this.animForwards = true;
					if (!cur_animation.loop)
					{
						this.animRepeats++;
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
					}
				}
				else
				{
					if (cur_animation.loop)
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
					else
					{
						this.animRepeats++;
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
						else
						{
							this.cur_frame = this.cur_anim_repeatto;
						}
					}
				}
			}
			if (this.cur_frame < 0)
				this.cur_frame = 0;
			else if (this.cur_frame >= cur_animation.frames.length)
				this.cur_frame = cur_animation.frames.length - 1;
			if (now > this.frameStart + (cur_animation.frames[this.cur_frame].duration / this.cur_anim_speed))
			{
				this.frameStart = now;
			}
			next_frame = cur_animation.frames[this.cur_frame];
			this.OnFrameChanged(prev_frame, next_frame);
			this.runtime.redraw = true;
		}
	};
	instanceProto.getAnimationByName = function (name_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			if (cr.equals_nocase(a.name, name_))
				return a;
		}
		return null;
	};
	instanceProto.getAnimationBySid = function (sid_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			if (a.sid === sid_)
				return a;
		}
		return null;
	};
	instanceProto.doChangeAnim = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var anim = this.getAnimationByName(this.changeAnimName);
		this.changeAnimName = "";
		if (!anim)
			return;
		if (cr.equals_nocase(anim.name, this.cur_animation.name) && this.animPlaying)
			return;
		this.cur_animation = anim;
		this.cur_anim_speed = anim.speed;
		this.cur_anim_repeatto = anim.repeatto;
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		if (this.changeAnimFrom === 1)
			this.cur_frame = 0;
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		this.animForwards = true;
		this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
		this.runtime.redraw = true;
	};
	instanceProto.doChangeAnimFrame = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var prev_frame_number = this.cur_frame;
		this.cur_frame = cr.floor(this.changeAnimFrame);
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		if (prev_frame_number !== this.cur_frame)
		{
			this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
			this.frameStart = this.getNowTime();
			this.runtime.redraw = true;
		}
		this.changeAnimFrame = -1;
	};
	instanceProto.OnFrameChanged = function (prev_frame, next_frame)
	{
		var oldw = prev_frame.width;
		var oldh = prev_frame.height;
		var neww = next_frame.width;
		var newh = next_frame.height;
		if (oldw != neww)
			this.width *= (neww / oldw);
		if (oldh != newh)
			this.height *= (newh / oldh);
		this.hotspotX = next_frame.hotspotX;
		this.hotspotY = next_frame.hotspotY;
		this.collision_poly.set_pts(next_frame.poly_pts);
		this.set_bbox_changed();
		this.curFrame = next_frame;
		this.curWebGLTexture = next_frame.webGL_texture;
		var i, len, b;
		for (i = 0, len = this.behavior_insts.length; i < len; i++)
		{
			b = this.behavior_insts[i];
			if (b.onSpriteFrameChanged)
				b.onSpriteFrameChanged(prev_frame, next_frame);
		}
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnFrameChanged, this);
	};
	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
		var cur_frame = this.curFrame;
		var spritesheeted = cur_frame.spritesheeted;
		var cur_image = cur_frame.texture_img;
		var myx = this.x;
		var myy = this.y;
		var w = this.width;
		var h = this.height;
		if (this.angle === 0 && w >= 0 && h >= 0)
		{
			myx -= this.hotspotX * w;
			myy -= this.hotspotY * h;
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 myx, myy, w, h);
			}
			else
			{
				ctx.drawImage(cur_image, myx, myy, w, h);
			}
		}
		else
		{
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			ctx.save();
			var widthfactor = w > 0 ? 1 : -1;
			var heightfactor = h > 0 ? 1 : -1;
			ctx.translate(myx, myy);
			if (widthfactor !== 1 || heightfactor !== 1)
				ctx.scale(widthfactor, heightfactor);
			ctx.rotate(this.angle * widthfactor * heightfactor);
			var drawx = 0 - (this.hotspotX * cr.abs(w))
			var drawy = 0 - (this.hotspotY * cr.abs(h));
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 drawx, drawy, cr.abs(w), cr.abs(h));
			}
			else
			{
				ctx.drawImage(cur_image, drawx, drawy, cr.abs(w), cr.abs(h));
			}
			ctx.restore();
		}
		/*
		ctx.strokeStyle = "#f00";
		ctx.lineWidth = 3;
		ctx.beginPath();
		this.collision_poly.cache_poly(this.width, this.height, this.angle);
		var i, len, ax, ay, bx, by;
		for (i = 0, len = this.collision_poly.pts_count; i < len; i++)
		{
			ax = this.collision_poly.pts_cache[i*2] + this.x;
			ay = this.collision_poly.pts_cache[i*2+1] + this.y;
			bx = this.collision_poly.pts_cache[((i+1)%len)*2] + this.x;
			by = this.collision_poly.pts_cache[((i+1)%len)*2+1] + this.y;
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
		}
		ctx.stroke();
		ctx.closePath();
		*/
		/*
		if (this.behavior_insts.length >= 1 && this.behavior_insts[0].draw)
		{
			this.behavior_insts[0].draw(ctx);
		}
		*/
	};
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.curWebGLTexture);
		glw.setOpacity(this.opacity);
		var cur_frame = this.curFrame;
		var q = this.bquad;
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, cur_frame.sheetTex);
			else
				glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
		{
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, cur_frame.sheetTex);
			else
				glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}
	};
	instanceProto.getImagePointIndexByName = function(name_)
	{
		var cur_frame = this.curFrame;
		var i, len;
		for (i = 0, len = cur_frame.image_points.length; i < len; i++)
		{
			if (cr.equals_nocase(name_, cur_frame.image_points[i][0]))
				return i;
		}
		return -1;
	};
	instanceProto.getImagePoint = function(imgpt, getX)
	{
		var cur_frame = this.curFrame;
		var image_points = cur_frame.image_points;
		var index;
		if (cr.is_string(imgpt))
			index = this.getImagePointIndexByName(imgpt);
		else
			index = imgpt - 1;	// 0 is origin
		index = cr.floor(index);
		if (index < 0 || index >= image_points.length)
			return getX ? this.x : this.y;	// return origin
		var x = (image_points[index][1] - cur_frame.hotspotX) * this.width;
		var y = image_points[index][2];
		y = (y - cur_frame.hotspotY) * this.height;
		var cosa = Math.cos(this.angle);
		var sina = Math.sin(this.angle);
		var x_temp = (x * cosa) - (y * sina);
		y = (y * cosa) + (x * sina);
		x = x_temp;
		x += this.x;
		y += this.y;
		return getX ? x : y;
	};
	function Cnds() {};
	var arrCache = [];
	function allocArr()
	{
		if (arrCache.length)
			return arrCache.pop();
		else
			return [0, 0, 0];
	};
	function freeArr(a)
	{
		a[0] = 0;
		a[1] = 0;
		a[2] = 0;
		arrCache.push(a);
	};
	function makeCollKey(a, b)
	{
		if (a < b)
			return "" + a + "," + b;
		else
			return "" + b + "," + a;
	};
	function collmemory_add(collmemory, a, b, tickcount)
	{
		var a_uid = a.uid;
		var b_uid = b.uid;
		var key = makeCollKey(a_uid, b_uid);
		if (collmemory.hasOwnProperty(key))
		{
			collmemory[key][2] = tickcount;
			return;
		}
		var arr = allocArr();
		arr[0] = a_uid;
		arr[1] = b_uid;
		arr[2] = tickcount;
		collmemory[key] = arr;
	};
	function collmemory_remove(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		if (collmemory.hasOwnProperty(key))
		{
			freeArr(collmemory[key]);
			delete collmemory[key];
		}
	};
	function collmemory_removeInstance(collmemory, inst)
	{
		var uid = inst.uid;
		var p, entry;
		for (p in collmemory)
		{
			if (collmemory.hasOwnProperty(p))
			{
				entry = collmemory[p];
				if (entry[0] === uid || entry[1] === uid)
				{
					freeArr(collmemory[p]);
					delete collmemory[p];
				}
			}
		}
	};
	var last_coll_tickcount = -2;
	function collmemory_has(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		if (collmemory.hasOwnProperty(key))
		{
			last_coll_tickcount = collmemory[key][2];
			return true;
		}
		else
		{
			last_coll_tickcount = -2;
			return false;
		}
	};
	var candidates1 = [];
	Cnds.prototype.OnCollision = function (rtype)
	{
		if (!rtype)
			return false;
		var runtime = this.runtime;
		var cnd = runtime.getCurrentCondition();
		var ltype = cnd.type;
		var collmemory = null;
		if (cnd.extra["collmemory"])
		{
			collmemory = cnd.extra["collmemory"];
		}
		else
		{
			collmemory = {};
			cnd.extra["collmemory"] = collmemory;
		}
		if (!cnd.extra["spriteCreatedDestroyCallback"])
		{
			cnd.extra["spriteCreatedDestroyCallback"] = true;
			runtime.addDestroyCallback(function(inst) {
				collmemory_removeInstance(cnd.extra["collmemory"], inst);
			});
		}
		var lsol = ltype.getCurrentSol();
		var rsol = rtype.getCurrentSol();
		var linstances = lsol.getObjects();
		var rinstances;
		var registeredInstances;
		var l, linst, r, rinst;
		var curlsol, currsol;
		var tickcount = this.runtime.tickcount;
		var lasttickcount = tickcount - 1;
		var exists, run;
		var current_event = runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		for (l = 0; l < linstances.length; l++)
		{
			linst = linstances[l];
			if (rsol.select_all)
			{
				linst.update_bbox();
				this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates1);
				rinstances = candidates1;
				this.runtime.addRegisteredCollisionCandidates(linst, rtype, rinstances);
			}
			else
			{
				rinstances = rsol.getObjects();
			}
			for (r = 0; r < rinstances.length; r++)
			{
				rinst = rinstances[r];
				if (runtime.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					exists = collmemory_has(collmemory, linst, rinst);
					run = (!exists || (last_coll_tickcount < lasttickcount));
					collmemory_add(collmemory, linst, rinst, tickcount);
					if (run)
					{
						runtime.pushCopySol(current_event.solModifiers);
						curlsol = ltype.getCurrentSol();
						currsol = rtype.getCurrentSol();
						curlsol.select_all = false;
						currsol.select_all = false;
						if (ltype === rtype)
						{
							curlsol.instances.length = 2;	// just use lsol, is same reference as rsol
							curlsol.instances[0] = linst;
							curlsol.instances[1] = rinst;
							ltype.applySolToContainer();
						}
						else
						{
							curlsol.instances.length = 1;
							currsol.instances.length = 1;
							curlsol.instances[0] = linst;
							currsol.instances[0] = rinst;
							ltype.applySolToContainer();
							rtype.applySolToContainer();
						}
						current_event.retrigger();
						runtime.popSol(current_event.solModifiers);
					}
				}
				else
				{
					collmemory_remove(collmemory, linst, rinst);
				}
			}
			cr.clearArray(candidates1);
		}
		return false;
	};
	var rpicktype = null;
	var rtopick = new cr.ObjectSet();
	var needscollisionfinish = false;
	var candidates2 = [];
	var temp_bbox = new cr.rect(0, 0, 0, 0);
	function DoOverlapCondition(rtype, offx, offy)
	{
		if (!rtype)
			return false;
		var do_offset = (offx !== 0 || offy !== 0);
		var oldx, oldy, ret = false, r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;
		if (rsol.select_all)
		{
			this.update_bbox();
			temp_bbox.copy(this.bbox);
			temp_bbox.offset(offx, offy);
			this.runtime.getCollisionCandidates(this.layer, rtype, temp_bbox, candidates2);
			rinstances = candidates2;
		}
		else if (orblock)
		{
			if (this.runtime.isCurrentConditionFirst() && !rsol.else_instances.length && rsol.instances.length)
				rinstances = rsol.instances;
			else
				rinstances = rsol.else_instances;
		}
		else
		{
			rinstances = rsol.instances;
		}
		rpicktype = rtype;
		needscollisionfinish = (ltype !== rtype && !inverted);
		if (do_offset)
		{
			oldx = this.x;
			oldy = this.y;
			this.x += offx;
			this.y += offy;
			this.set_bbox_changed();
		}
		for (r = 0, lenr = rinstances.length; r < lenr; r++)
		{
			rinst = rinstances[r];
			if (this.runtime.testOverlap(this, rinst))
			{
				ret = true;
				if (inverted)
					break;
				if (ltype !== rtype)
					rtopick.add(rinst);
			}
		}
		if (do_offset)
		{
			this.x = oldx;
			this.y = oldy;
			this.set_bbox_changed();
		}
		cr.clearArray(candidates2);
		return ret;
	};
	typeProto.finish = function (do_pick)
	{
		if (!needscollisionfinish)
			return;
		if (do_pick)
		{
			var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
			var sol = rpicktype.getCurrentSol();
			var topick = rtopick.valuesRef();
			var i, len, inst;
			if (sol.select_all)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);
				for (i = 0, len = topick.length; i < len; ++i)
				{
					sol.instances[i] = topick[i];
				}
				if (orblock)
				{
					cr.clearArray(sol.else_instances);
					for (i = 0, len = rpicktype.instances.length; i < len; ++i)
					{
						inst = rpicktype.instances[i];
						if (!rtopick.contains(inst))
							sol.else_instances.push(inst);
					}
				}
			}
			else
			{
				if (orblock)
				{
					var initsize = sol.instances.length;
					for (i = 0, len = topick.length; i < len; ++i)
					{
						sol.instances[initsize + i] = topick[i];
						cr.arrayFindRemove(sol.else_instances, topick[i]);
					}
				}
				else
				{
					cr.shallowAssignArray(sol.instances, topick);
				}
			}
			rpicktype.applySolToContainer();
		}
		rtopick.clear();
		needscollisionfinish = false;
	};
	Cnds.prototype.IsOverlapping = function (rtype)
	{
		return DoOverlapCondition.call(this, rtype, 0, 0);
	};
	Cnds.prototype.IsOverlappingOffset = function (rtype, offx, offy)
	{
		return DoOverlapCondition.call(this, rtype, offx, offy);
	};
	Cnds.prototype.IsAnimPlaying = function (animname)
	{
		if (this.changeAnimName.length)
			return cr.equals_nocase(this.changeAnimName, animname);
		else
			return cr.equals_nocase(this.cur_animation.name, animname);
	};
	Cnds.prototype.CompareFrame = function (cmp, framenum)
	{
		return cr.do_cmp(this.cur_frame, cmp, framenum);
	};
	Cnds.prototype.CompareAnimSpeed = function (cmp, x)
	{
		var s = (this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
		return cr.do_cmp(s, cmp, x);
	};
	Cnds.prototype.OnAnimFinished = function (animname)
	{
		return cr.equals_nocase(this.animTriggerName, animname);
	};
	Cnds.prototype.OnAnyAnimFinished = function ()
	{
		return true;
	};
	Cnds.prototype.OnFrameChanged = function ()
	{
		return true;
	};
	Cnds.prototype.IsMirrored = function ()
	{
		return this.width < 0;
	};
	Cnds.prototype.IsFlipped = function ()
	{
		return this.height < 0;
	};
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.IsCollisionEnabled = function ()
	{
		return this.collisionsEnabled;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Spawn = function (obj, layer, imgpt)
	{
		if (!obj || !layer)
			return;
		var inst = this.runtime.createInstance(obj, layer, this.getImagePoint(imgpt, true), this.getImagePoint(imgpt, false));
		if (!inst)
			return;
		if (typeof inst.angle !== "undefined")
		{
			inst.angle = this.angle;
			inst.set_bbox_changed();
		}
		this.runtime.isInOnDestroy++;
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
		var cur_act = this.runtime.getCurrentAction();
		var reset_sol = false;
		if (cr.is_undefined(cur_act.extra["Spawn_LastExec"]) || cur_act.extra["Spawn_LastExec"] < this.runtime.execcount)
		{
			reset_sol = true;
			cur_act.extra["Spawn_LastExec"] = this.runtime.execcount;
		}
		var sol;
		if (obj != this.type)
		{
			sol = obj.getCurrentSol();
			sol.select_all = false;
			if (reset_sol)
			{
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
			}
			else
				sol.instances.push(inst);
			if (inst.is_contained)
			{
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					s = inst.siblings[i];
					sol = s.type.getCurrentSol();
					sol.select_all = false;
					if (reset_sol)
					{
						cr.clearArray(sol.instances);
						sol.instances[0] = s;
					}
					else
						sol.instances.push(s);
				}
			}
		}
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.StopAnim = function ()
	{
		this.animPlaying = false;
	};
	Acts.prototype.StartAnim = function (from)
	{
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		if (from === 1 && this.cur_frame !== 0)
		{
			this.changeAnimFrame = 0;
			if (!this.inAnimTrigger)
				this.doChangeAnimFrame();
		}
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	Acts.prototype.SetAnim = function (animname, from)
	{
		this.changeAnimName = animname;
		this.changeAnimFrom = from;
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (!this.inAnimTrigger)
			this.doChangeAnim();
	};
	Acts.prototype.SetAnimFrame = function (framenumber)
	{
		this.changeAnimFrame = framenumber;
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (!this.inAnimTrigger)
			this.doChangeAnimFrame();
	};
	Acts.prototype.SetAnimSpeed = function (s)
	{
		this.cur_anim_speed = cr.abs(s);
		this.animForwards = (s >= 0);
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	Acts.prototype.SetAnimRepeatToFrame = function (s)
	{
		s = Math.floor(s);
		if (s < 0)
			s = 0;
		if (s >= this.cur_animation.frames.length)
			s = this.cur_animation.frames.length - 1;
		this.cur_anim_repeatto = s;
	};
	Acts.prototype.SetMirrored = function (m)
	{
		var neww = cr.abs(this.width) * (m === 0 ? -1 : 1);
		if (this.width === neww)
			return;
		this.width = neww;
		this.set_bbox_changed();
	};
	Acts.prototype.SetFlipped = function (f)
	{
		var newh = cr.abs(this.height) * (f === 0 ? -1 : 1);
		if (this.height === newh)
			return;
		this.height = newh;
		this.set_bbox_changed();
	};
	Acts.prototype.SetScale = function (s)
	{
		var cur_frame = this.curFrame;
		var mirror_factor = (this.width < 0 ? -1 : 1);
		var flip_factor = (this.height < 0 ? -1 : 1);
		var new_width = cur_frame.width * s * mirror_factor;
		var new_height = cur_frame.height * s * flip_factor;
		if (this.width !== new_width || this.height !== new_height)
		{
			this.width = new_width;
			this.height = new_height;
			this.set_bbox_changed();
		}
	};
	Acts.prototype.LoadURL = function (url_, resize_, crossOrigin_)
	{
		var img = new Image();
		var self = this;
		var curFrame_ = this.curFrame;
		img.onload = function ()
		{
			if (curFrame_.texture_img.src === img.src)
			{
				if (self.runtime.glwrap && self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				if (resize_ === 0)		// resize to image size
				{
					self.width = img.width;
					self.height = img.height;
					self.set_bbox_changed();
				}
				self.runtime.redraw = true;
				self.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnURLLoaded, self);
				return;
			}
			curFrame_.texture_img = img;
			curFrame_.offx = 0;
			curFrame_.offy = 0;
			curFrame_.width = img.width;
			curFrame_.height = img.height;
			curFrame_.spritesheeted = false;
			curFrame_.datauri = "";
			curFrame_.pixelformat = 0;	// reset to RGBA, since we don't know what type of image will have come in
			if (self.runtime.glwrap)
			{
				if (curFrame_.webGL_texture)
					self.runtime.glwrap.deleteTexture(curFrame_.webGL_texture);
				curFrame_.webGL_texture = self.runtime.glwrap.loadTexture(img, false, self.runtime.linearSampling);
				if (self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				self.type.updateAllCurrentTexture();
			}
			if (resize_ === 0)		// resize to image size
			{
				self.width = img.width;
				self.height = img.height;
				self.set_bbox_changed();
			}
			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnURLLoaded, self);
		};
		if (url_.substr(0, 5) !== "data:" && crossOrigin_ === 0)
			img["crossOrigin"] = "anonymous";
		this.runtime.setImageSrc(img, url_);
	};
	Acts.prototype.SetCollisions = function (set_)
	{
		if (this.collisionsEnabled === (set_ !== 0))
			return;		// no change
		this.collisionsEnabled = (set_ !== 0);
		if (this.collisionsEnabled)
			this.set_bbox_changed();		// needs to be added back to cells
		else
		{
			if (this.collcells.right >= this.collcells.left)
				this.type.collision_grid.update(this, this.collcells, null);
			this.collcells.set(0, 0, -1, -1);
		}
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.AnimationFrame = function (ret)
	{
		ret.set_int(this.cur_frame);
	};
	Exps.prototype.AnimationFrameCount = function (ret)
	{
		ret.set_int(this.cur_animation.frames.length);
	};
	Exps.prototype.AnimationName = function (ret)
	{
		ret.set_string(this.cur_animation.name);
	};
	Exps.prototype.AnimationSpeed = function (ret)
	{
		ret.set_float(this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
	};
	Exps.prototype.ImagePointX = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, true));
	};
	Exps.prototype.ImagePointY = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, false));
	};
	Exps.prototype.ImagePointCount = function (ret)
	{
		ret.set_int(this.curFrame.image_points.length);
	};
	Exps.prototype.ImageWidth = function (ret)
	{
		ret.set_float(this.curFrame.width);
	};
	Exps.prototype.ImageHeight = function (ret)
	{
		ret.set_float(this.curFrame.height);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Text = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Text.prototype;
	pluginProto.onCreate = function ()
	{
		pluginProto.acts.SetWidth = function (w)
		{
			if (this.width !== w)
			{
				this.width = w;
				this.text_changed = true;	// also recalculate text wrapping
				this.set_bbox_changed();
			}
		};
	};
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.mycanvas = null;
			inst.myctx = null;
			inst.mytex = null;
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		if (this.recycled)
			cr.clearArray(this.lines);
		else
			this.lines = [];		// for word wrapping
		this.text_changed = true;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var requestedWebFonts = {};		// already requested web fonts have an entry here
	instanceProto.onCreate = function()
	{
		this.text = this.properties[0];
		this.visible = (this.properties[1] === 0);		// 0=visible, 1=invisible
		this.font = this.properties[2];
		this.color = this.properties[3];
		this.halign = this.properties[4];				// 0=left, 1=center, 2=right
		this.valign = this.properties[5];				// 0=top, 1=center, 2=bottom
		this.wrapbyword = (this.properties[7] === 0);	// 0=word, 1=character
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
		this.line_height_offset = this.properties[8];
		this.facename = "";
		this.fontstyle = "";
		this.ptSize = 0;
		this.textWidth = 0;
		this.textHeight = 0;
		this.parseFont();
		this.mycanvas = null;
		this.myctx = null;
		this.mytex = null;
		this.need_text_redraw = false;
		this.last_render_tick = this.runtime.tickcount;
		if (this.recycled)
			this.rcTex.set(0, 0, 1, 1);
		else
			this.rcTex = new cr.rect(0, 0, 1, 1);
		if (this.runtime.glwrap)
			this.runtime.tickMe(this);
;
	};
	instanceProto.parseFont = function ()
	{
		var arr = this.font.split(" ");
		var i;
		for (i = 0; i < arr.length; i++)
		{
			if (arr[i].substr(arr[i].length - 2, 2) === "pt")
			{
				this.ptSize = parseInt(arr[i].substr(0, arr[i].length - 2));
				this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
				if (i > 0)
					this.fontstyle = arr[i - 1];
				this.facename = arr[i + 1];
				for (i = i + 2; i < arr.length; i++)
					this.facename += " " + arr[i];
				break;
			}
		}
	};
	instanceProto.saveToJSON = function ()
	{
		return {
			"t": this.text,
			"f": this.font,
			"c": this.color,
			"ha": this.halign,
			"va": this.valign,
			"wr": this.wrapbyword,
			"lho": this.line_height_offset,
			"fn": this.facename,
			"fs": this.fontstyle,
			"ps": this.ptSize,
			"pxh": this.pxHeight,
			"tw": this.textWidth,
			"th": this.textHeight,
			"lrt": this.last_render_tick
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.text = o["t"];
		this.font = o["f"];
		this.color = o["c"];
		this.halign = o["ha"];
		this.valign = o["va"];
		this.wrapbyword = o["wr"];
		this.line_height_offset = o["lho"];
		this.facename = o["fn"];
		this.fontstyle = o["fs"];
		this.ptSize = o["ps"];
		this.pxHeight = o["pxh"];
		this.textWidth = o["tw"];
		this.textHeight = o["th"];
		this.last_render_tick = o["lrt"];
		this.text_changed = true;
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
	};
	instanceProto.tick = function ()
	{
		if (this.runtime.glwrap && this.mytex && (this.runtime.tickcount - this.last_render_tick >= 300))
		{
			var layer = this.layer;
            this.update_bbox();
            var bbox = this.bbox;
            if (bbox.right < layer.viewLeft || bbox.bottom < layer.viewTop || bbox.left > layer.viewRight || bbox.top > layer.viewBottom)
			{
				this.runtime.glwrap.deleteTexture(this.mytex);
				this.mytex = null;
				this.myctx = null;
				this.mycanvas = null;
			}
		}
	};
	instanceProto.onDestroy = function ()
	{
		this.myctx = null;
		this.mycanvas = null;
		if (this.runtime.glwrap && this.mytex)
			this.runtime.glwrap.deleteTexture(this.mytex);
		this.mytex = null;
	};
	instanceProto.updateFont = function ()
	{
		this.font = this.fontstyle + " " + this.ptSize.toString() + "pt " + this.facename;
		this.text_changed = true;
		this.runtime.redraw = true;
	};
	instanceProto.draw = function(ctx, glmode)
	{
		ctx.font = this.font;
		ctx.textBaseline = "top";
		ctx.fillStyle = this.color;
		ctx.globalAlpha = glmode ? 1 : this.opacity;
		var myscale = 1;
		if (glmode)
		{
			myscale = Math.abs(this.layer.getScale());
			ctx.save();
			ctx.scale(myscale, myscale);
		}
		if (this.text_changed || this.width !== this.lastwrapwidth)
		{
			this.type.plugin.WordWrap(this.text, this.lines, ctx, this.width, this.wrapbyword);
			this.text_changed = false;
			this.lastwrapwidth = this.width;
		}
		this.update_bbox();
		var penX = glmode ? 0 : this.bquad.tlx;
		var penY = glmode ? 0 : this.bquad.tly;
		if (this.runtime.pixel_rounding)
		{
			penX = (penX + 0.5) | 0;
			penY = (penY + 0.5) | 0;
		}
		if (this.angle !== 0 && !glmode)
		{
			ctx.save();
			ctx.translate(penX, penY);
			ctx.rotate(this.angle);
			penX = 0;
			penY = 0;
		}
		var endY = penY + this.height;
		var line_height = this.pxHeight;
		line_height += this.line_height_offset;
		var drawX;
		var i;
		if (this.valign === 1)		// center
			penY += Math.max(this.height / 2 - (this.lines.length * line_height) / 2, 0);
		else if (this.valign === 2)	// bottom
			penY += Math.max(this.height - (this.lines.length * line_height) - 2, 0);
		for (i = 0; i < this.lines.length; i++)
		{
			drawX = penX;
			if (this.halign === 1)		// center
				drawX = penX + (this.width - this.lines[i].width) / 2;
			else if (this.halign === 2)	// right
				drawX = penX + (this.width - this.lines[i].width);
			ctx.fillText(this.lines[i].text, drawX, penY);
			penY += line_height;
			if (penY >= endY - line_height)
				break;
		}
		if (this.angle !== 0 || glmode)
			ctx.restore();
		this.last_render_tick = this.runtime.tickcount;
	};
	instanceProto.drawGL = function(glw)
	{
		if (this.width < 1 || this.height < 1)
			return;
		var need_redraw = this.text_changed || this.need_text_redraw;
		this.need_text_redraw = false;
		var layer_scale = this.layer.getScale();
		var layer_angle = this.layer.getAngle();
		var rcTex = this.rcTex;
		var floatscaledwidth = layer_scale * this.width;
		var floatscaledheight = layer_scale * this.height;
		var scaledwidth = Math.ceil(floatscaledwidth);
		var scaledheight = Math.ceil(floatscaledheight);
		var absscaledwidth = Math.abs(scaledwidth);
		var absscaledheight = Math.abs(scaledheight);
		var halfw = this.runtime.draw_width / 2;
		var halfh = this.runtime.draw_height / 2;
		if (!this.myctx)
		{
			this.mycanvas = document.createElement("canvas");
			this.mycanvas.width = absscaledwidth;
			this.mycanvas.height = absscaledheight;
			this.lastwidth = absscaledwidth;
			this.lastheight = absscaledheight;
			need_redraw = true;
			this.myctx = this.mycanvas.getContext("2d");
		}
		if (absscaledwidth !== this.lastwidth || absscaledheight !== this.lastheight)
		{
			this.mycanvas.width = absscaledwidth;
			this.mycanvas.height = absscaledheight;
			if (this.mytex)
			{
				glw.deleteTexture(this.mytex);
				this.mytex = null;
			}
			need_redraw = true;
		}
		if (need_redraw)
		{
			this.myctx.clearRect(0, 0, absscaledwidth, absscaledheight);
			this.draw(this.myctx, true);
			if (!this.mytex)
				this.mytex = glw.createEmptyTexture(absscaledwidth, absscaledheight, this.runtime.linearSampling, this.runtime.isMobile);
			glw.videoToTexture(this.mycanvas, this.mytex, this.runtime.isMobile);
		}
		this.lastwidth = absscaledwidth;
		this.lastheight = absscaledheight;
		glw.setTexture(this.mytex);
		glw.setOpacity(this.opacity);
		glw.resetModelView();
		glw.translate(-halfw, -halfh);
		glw.updateModelView();
		var q = this.bquad;
		var tlx = this.layer.layerToCanvas(q.tlx, q.tly, true, true);
		var tly = this.layer.layerToCanvas(q.tlx, q.tly, false, true);
		var trx = this.layer.layerToCanvas(q.trx, q.try_, true, true);
		var try_ = this.layer.layerToCanvas(q.trx, q.try_, false, true);
		var brx = this.layer.layerToCanvas(q.brx, q.bry, true, true);
		var bry = this.layer.layerToCanvas(q.brx, q.bry, false, true);
		var blx = this.layer.layerToCanvas(q.blx, q.bly, true, true);
		var bly = this.layer.layerToCanvas(q.blx, q.bly, false, true);
		if (this.runtime.pixel_rounding || (this.angle === 0 && layer_angle === 0))
		{
			var ox = ((tlx + 0.5) | 0) - tlx;
			var oy = ((tly + 0.5) | 0) - tly
			tlx += ox;
			tly += oy;
			trx += ox;
			try_ += oy;
			brx += ox;
			bry += oy;
			blx += ox;
			bly += oy;
		}
		if (this.angle === 0 && layer_angle === 0)
		{
			trx = tlx + scaledwidth;
			try_ = tly;
			brx = trx;
			bry = tly + scaledheight;
			blx = tlx;
			bly = bry;
			rcTex.right = 1;
			rcTex.bottom = 1;
		}
		else
		{
			rcTex.right = floatscaledwidth / scaledwidth;
			rcTex.bottom = floatscaledheight / scaledheight;
		}
		glw.quadTex(tlx, tly, trx, try_, brx, bry, blx, bly, rcTex);
		glw.resetModelView();
		glw.scale(layer_scale, layer_scale);
		glw.rotateZ(-this.layer.getAngle());
		glw.translate((this.layer.viewLeft + this.layer.viewRight) / -2, (this.layer.viewTop + this.layer.viewBottom) / -2);
		glw.updateModelView();
		this.last_render_tick = this.runtime.tickcount;
	};
	var wordsCache = [];
	pluginProto.TokeniseWords = function (text)
	{
		cr.clearArray(wordsCache);
		var cur_word = "";
		var ch;
		var i = 0;
		while (i < text.length)
		{
			ch = text.charAt(i);
			if (ch === "\n")
			{
				if (cur_word.length)
				{
					wordsCache.push(cur_word);
					cur_word = "";
				}
				wordsCache.push("\n");
				++i;
			}
			else if (ch === " " || ch === "\t" || ch === "-")
			{
				do {
					cur_word += text.charAt(i);
					i++;
				}
				while (i < text.length && (text.charAt(i) === " " || text.charAt(i) === "\t"));
				wordsCache.push(cur_word);
				cur_word = "";
			}
			else if (i < text.length)
			{
				cur_word += ch;
				i++;
			}
		}
		if (cur_word.length)
			wordsCache.push(cur_word);
	};
	var linesCache = [];
	function allocLine()
	{
		if (linesCache.length)
			return linesCache.pop();
		else
			return {};
	};
	function freeLine(l)
	{
		linesCache.push(l);
	};
	function freeAllLines(arr)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; i++)
		{
			freeLine(arr[i]);
		}
		cr.clearArray(arr);
	};
	pluginProto.WordWrap = function (text, lines, ctx, width, wrapbyword)
	{
		if (!text || !text.length)
		{
			freeAllLines(lines);
			return;
		}
		if (width <= 2.0)
		{
			freeAllLines(lines);
			return;
		}
		if (text.length <= 100 && text.indexOf("\n") === -1)
		{
			var all_width = ctx.measureText(text).width;
			if (all_width <= width)
			{
				freeAllLines(lines);
				lines.push(allocLine());
				lines[0].text = text;
				lines[0].width = all_width;
				return;
			}
		}
		this.WrapText(text, lines, ctx, width, wrapbyword);
	};
	function trimSingleSpaceRight(str)
	{
		if (!str.length || str.charAt(str.length - 1) !== " ")
			return str;
		return str.substring(0, str.length - 1);
	};
	pluginProto.WrapText = function (text, lines, ctx, width, wrapbyword)
	{
		var wordArray;
		if (wrapbyword)
		{
			this.TokeniseWords(text);	// writes to wordsCache
			wordArray = wordsCache;
		}
		else
			wordArray = text;
		var cur_line = "";
		var prev_line;
		var line_width;
		var i;
		var lineIndex = 0;
		var line;
		for (i = 0; i < wordArray.length; i++)
		{
			if (wordArray[i] === "\n")
			{
				if (lineIndex >= lines.length)
					lines.push(allocLine());
				cur_line = trimSingleSpaceRight(cur_line);		// for correct center/right alignment
				line = lines[lineIndex];
				line.text = cur_line;
				line.width = ctx.measureText(cur_line).width;
				lineIndex++;
				cur_line = "";
				continue;
			}
			prev_line = cur_line;
			cur_line += wordArray[i];
			line_width = ctx.measureText(cur_line).width;
			if (line_width >= width)
			{
				if (lineIndex >= lines.length)
					lines.push(allocLine());
				prev_line = trimSingleSpaceRight(prev_line);
				line = lines[lineIndex];
				line.text = prev_line;
				line.width = ctx.measureText(prev_line).width;
				lineIndex++;
				cur_line = wordArray[i];
				if (!wrapbyword && cur_line === " ")
					cur_line = "";
			}
		}
		if (cur_line.length)
		{
			if (lineIndex >= lines.length)
				lines.push(allocLine());
			cur_line = trimSingleSpaceRight(cur_line);
			line = lines[lineIndex];
			line.text = cur_line;
			line.width = ctx.measureText(cur_line).width;
			lineIndex++;
		}
		for (i = lineIndex; i < lines.length; i++)
			freeLine(lines[i]);
		lines.length = lineIndex;
	};
	function Cnds() {};
	Cnds.prototype.CompareText = function(text_to_compare, case_sensitive)
	{
		if (case_sensitive)
			return this.text == text_to_compare;
		else
			return cr.equals_nocase(this.text, text_to_compare);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetText = function(param)
	{
		if (cr.is_number(param) && param < 1e9)
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		var text_to_set = param.toString();
		if (this.text !== text_to_set)
		{
			this.text = text_to_set;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	Acts.prototype.AppendText = function(param)
	{
		if (cr.is_number(param))
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		var text_to_append = param.toString();
		if (text_to_append)	// not empty
		{
			this.text += text_to_append;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	Acts.prototype.SetFontFace = function (face_, style_)
	{
		var newstyle = "";
		switch (style_) {
		case 1: newstyle = "bold"; break;
		case 2: newstyle = "italic"; break;
		case 3: newstyle = "bold italic"; break;
		}
		if (face_ === this.facename && newstyle === this.fontstyle)
			return;		// no change
		this.facename = face_;
		this.fontstyle = newstyle;
		this.updateFont();
	};
	Acts.prototype.SetFontSize = function (size_)
	{
		if (this.ptSize === size_)
			return;
		this.ptSize = size_;
		this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
		this.updateFont();
	};
	Acts.prototype.SetFontColor = function (rgb)
	{
		var newcolor = "rgb(" + cr.GetRValue(rgb).toString() + "," + cr.GetGValue(rgb).toString() + "," + cr.GetBValue(rgb).toString() + ")";
		if (newcolor === this.color)
			return;
		this.color = newcolor;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	};
	Acts.prototype.SetWebFont = function (familyname_, cssurl_)
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[PlotyXD] Text plugin: 'Set web font' not supported on this platform - the action has been ignored");
			return;		// DC todo
		}
		var self = this;
		var refreshFunc = (function () {
							self.runtime.redraw = true;
							self.text_changed = true;
						});
		if (requestedWebFonts.hasOwnProperty(cssurl_))
		{
			var newfacename = "'" + familyname_ + "'";
			if (this.facename === newfacename)
				return;	// no change
			this.facename = newfacename;
			this.updateFont();
			for (var i = 1; i < 10; i++)
			{
				setTimeout(refreshFunc, i * 100);
				setTimeout(refreshFunc, i * 1000);
			}
			return;
		}
		var wf = document.createElement("link");
		wf.href = cssurl_;
		wf.rel = "stylesheet";
		wf.type = "text/css";
		wf.onload = refreshFunc;
		document.getElementsByTagName('head')[0].appendChild(wf);
		requestedWebFonts[cssurl_] = true;
		this.facename = "'" + familyname_ + "'";
		this.updateFont();
		for (var i = 1; i < 10; i++)
		{
			setTimeout(refreshFunc, i * 100);
			setTimeout(refreshFunc, i * 1000);
		}
;
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Text = function(ret)
	{
		ret.set_string(this.text);
	};
	Exps.prototype.FaceName = function (ret)
	{
		ret.set_string(this.facename);
	};
	Exps.prototype.FaceSize = function (ret)
	{
		ret.set_int(this.ptSize);
	};
	Exps.prototype.TextWidth = function (ret)
	{
		var w = 0;
		var i, len, x;
		for (i = 0, len = this.lines.length; i < len; i++)
		{
			x = this.lines[i].width;
			if (w < x)
				w = x;
		}
		ret.set_int(w);
	};
	Exps.prototype.TextHeight = function (ret)
	{
		ret.set_int(this.lines.length * (this.pxHeight + this.line_height_offset) - this.line_height_offset);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.TextBox = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.TextBox.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var elemTypes = ["text", "password", "email", "number", "tel", "url"];
	if (navigator.userAgent.indexOf("MSIE 9") > -1)
	{
		elemTypes[2] = "text";
		elemTypes[3] = "text";
		elemTypes[4] = "text";
		elemTypes[5] = "text";
	}
	instanceProto.onCreate = function()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[PlotyXD] Textbox plugin not supported on this platform - the object will not be created");
			return;
		}
		if (this.properties[7] === 6)	// textarea
		{
			this.elem = document.createElement("textarea");
			jQuery(this.elem).css("resize", "none");
		}
		else
		{
			this.elem = document.createElement("input");
			this.elem.type = elemTypes[this.properties[7]];
		}
		this.elem.id = this.properties[9];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		this.elem["autocomplete"] = "off";
		this.elem.value = this.properties[0];
		this.elem["placeholder"] = this.properties[1];
		this.elem.title = this.properties[2];
		this.elem.disabled = (this.properties[4] === 0);
		this.elem["readOnly"] = (this.properties[5] === 1);
		this.elem["spellcheck"] = (this.properties[6] === 1);
		this.autoFontSize = (this.properties[8] !== 0);
		this.element_hidden = false;
		if (this.properties[3] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
			this.element_hidden = true;
		}
		var onchangetrigger = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.TextBox.prototype.cnds.OnTextChanged, self);
			};
		})(this);
		this.elem["oninput"] = onchangetrigger;
		if (navigator.userAgent.indexOf("MSIE") !== -1)
			this.elem["oncut"] = onchangetrigger;
		this.elem.onclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.TextBox.prototype.cnds.OnClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);
		this.elem.ondblclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.TextBox.prototype.cnds.OnDoubleClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).keydown(function (e) {
			if (e.which !== 13 && e.which != 27)	// allow enter and escape
				e.stopPropagation();
		});
		jQuery(this.elem).keyup(function (e) {
			if (e.which !== 13 && e.which != 27)	// allow enter and escape
				e.stopPropagation();
		});
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		this.updatePosition(true);
		this.runtime.tickMe(this);
	};
	instanceProto.saveToJSON = function ()
	{
		return {
			"text": this.elem.value,
			"placeholder": this.elem.placeholder,
			"tooltip": this.elem.title,
			"disabled": !!this.elem.disabled,
			"readonly": !!this.elem.readOnly,
			"spellcheck": !!this.elem["spellcheck"]
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.value = o["text"];
		this.elem.placeholder = o["placeholder"];
		this.elem.title = o["tooltip"];
		this.elem.disabled = o["disabled"];
		this.elem.readOnly = o["readonly"];
		this.elem["spellcheck"] = o["spellcheck"];
	};
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
				return;
		jQuery(this.elem).remove();
		this.elem = null;
	};
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		var rightEdge = this.runtime.width / this.runtime.devicePixelRatio;
		var bottomEdge = this.runtime.height / this.runtime.devicePixelRatio;
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= rightEdge || top >= bottomEdge)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
			this.element_hidden = true;
			return;
		}
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= rightEdge)
			right = rightEdge - 1;
		if (bottom >= bottomEdge)
			bottom = bottomEdge - 1;
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.element_hidden)
			{
				jQuery(this.elem).show();
				this.element_hidden = false;
			}
			return;
		}
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		if (this.element_hidden)
		{
			jQuery(this.elem).show();
			this.element_hidden = false;
		}
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
		if (this.autoFontSize)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function(glw)
	{
	};
	function Cnds() {};
	Cnds.prototype.CompareText = function (text, case_)
	{
		if (this.runtime.isDomFree)
			return false;
		if (case_ === 0)	// insensitive
			return cr.equals_nocase(this.elem.value, text);
		else
			return this.elem.value === text;
	};
	Cnds.prototype.OnTextChanged = function ()
	{
		return true;
	};
	Cnds.prototype.OnClicked = function ()
	{
		return true;
	};
	Cnds.prototype.OnDoubleClicked = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.value = text;
	};
	Acts.prototype.SetPlaceholder = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.placeholder = text;
	};
	Acts.prototype.SetTooltip = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.title = text;
	};
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		this.visible = (vis !== 0);
	};
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.disabled = (en === 0);
	};
	Acts.prototype.SetReadOnly = function (ro)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.readOnly = (ro === 0);
	};
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.focus();
	};
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.blur();
	};
	Acts.prototype.SetCSSStyle = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
		jQuery(this.elem).css(p, v);
	};
	Acts.prototype.ScrollToBottom = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.scrollTop = this.elem.scrollHeight;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Text = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		ret.set_string(this.elem.value);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.TiledBg = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.TiledBg.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		this.texture_img = new Image();
		this.texture_img.cr_filesize = this.texture_filesize;
		this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
		this.pattern = null;
		this.webGL_texture = null;
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		this.webGL_texture = null;
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		if (!this.webGL_texture)
		{
			this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		}
		var i, len;
		for (i = 0, len = this.instances.length; i < len; i++)
			this.instances[i].webGL_texture = this.webGL_texture;
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.webGL_texture || !this.runtime.glwrap)
			return;
		this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.webGL_texture)
			return;
		this.runtime.glwrap.deleteTexture(this.webGL_texture);
		this.webGL_texture = null;
	};
	typeProto.preloadCanvas2D = function (ctx)
	{
		ctx.drawImage(this.texture_img, 0, 0);
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);							// 0=visible, 1=invisible
		this.rcTex = new cr.rect(0, 0, 0, 0);
		this.has_own_texture = false;										// true if a texture loaded in from URL
		this.texture_img = this.type.texture_img;
		if (this.runtime.glwrap)
		{
			this.type.loadTextures();
			this.webGL_texture = this.type.webGL_texture;
		}
		else
		{
			if (!this.type.pattern)
				this.type.pattern = this.runtime.ctx.createPattern(this.type.texture_img, "repeat");
			this.pattern = this.type.pattern;
		}
	};
	instanceProto.afterLoad = function ()
	{
		this.has_own_texture = false;
		this.texture_img = this.type.texture_img;
	};
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.glwrap && this.has_own_texture && this.webGL_texture)
		{
			this.runtime.glwrap.deleteTexture(this.webGL_texture);
			this.webGL_texture = null;
		}
	};
	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
		ctx.save();
		ctx.fillStyle = this.pattern;
		var myx = this.x;
		var myy = this.y;
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		var drawX = -(this.hotspotX * this.width);
		var drawY = -(this.hotspotY * this.height);
		var offX = drawX % this.texture_img.width;
		var offY = drawY % this.texture_img.height;
		if (offX < 0)
			offX += this.texture_img.width;
		if (offY < 0)
			offY += this.texture_img.height;
		ctx.translate(myx, myy);
		ctx.rotate(this.angle);
		ctx.translate(offX, offY);
		ctx.fillRect(drawX - offX,
					 drawY - offY,
					 this.width,
					 this.height);
		ctx.restore();
	};
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.webGL_texture);
		glw.setOpacity(this.opacity);
		var rcTex = this.rcTex;
		rcTex.right = this.width / this.texture_img.width;
		rcTex.bottom = this.height / this.texture_img.height;
		var q = this.bquad;
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, rcTex);
		}
		else
			glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, rcTex);
	};
	function Cnds() {};
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.LoadURL = function (url_, crossOrigin_)
	{
		var img = new Image();
		var self = this;
		img.onload = function ()
		{
			self.texture_img = img;
			if (self.runtime.glwrap)
			{
				if (self.has_own_texture && self.webGL_texture)
					self.runtime.glwrap.deleteTexture(self.webGL_texture);
				self.webGL_texture = self.runtime.glwrap.loadTexture(img, true, self.runtime.linearSampling);
			}
			else
			{
				self.pattern = self.runtime.ctx.createPattern(img, "repeat");
			}
			self.has_own_texture = true;
			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.TiledBg.prototype.cnds.OnURLLoaded, self);
		};
		if (url_.substr(0, 5) !== "data:" && crossOrigin_ === 0)
			img.crossOrigin = "anonymous";
		this.runtime.setImageSrc(img, url_);
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ImageWidth = function (ret)
	{
		ret.set_float(this.texture_img.width);
	};
	Exps.prototype.ImageHeight = function (ret)
	{
		ret.set_float(this.texture_img.height);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Touch = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Touch.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.touches = [];
		this.mouseDown = false;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var dummyoffset = {left: 0, top: 0};
	instanceProto.findTouch = function (id)
	{
		var i, len;
		for (i = 0, len = this.touches.length; i < len; i++)
		{
			if (this.touches[i]["id"] === id)
				return i;
		}
		return -1;
	};
	var appmobi_accx = 0;
	var appmobi_accy = 0;
	var appmobi_accz = 0;
	function AppMobiGetAcceleration(evt)
	{
		appmobi_accx = evt.x;
		appmobi_accy = evt.y;
		appmobi_accz = evt.z;
	};
	var pg_accx = 0;
	var pg_accy = 0;
	var pg_accz = 0;
	function PhoneGapGetAcceleration(evt)
	{
		pg_accx = evt.x;
		pg_accy = evt.y;
		pg_accz = evt.z;
	};
	var theInstance = null;
	var touchinfo_cache = [];
	function AllocTouchInfo(x, y, id, index)
	{
		var ret;
		if (touchinfo_cache.length)
			ret = touchinfo_cache.pop();
		else
			ret = new TouchInfo();
		ret.init(x, y, id, index);
		return ret;
	};
	function ReleaseTouchInfo(ti)
	{
		if (touchinfo_cache.length < 100)
			touchinfo_cache.push(ti);
	};
	var GESTURE_HOLD_THRESHOLD = 15;		// max px motion for hold gesture to register
	var GESTURE_HOLD_TIMEOUT = 500;			// time for hold gesture to register
	var GESTURE_TAP_TIMEOUT = 333;			// time for tap gesture to register
	var GESTURE_DOUBLETAP_THRESHOLD = 25;	// max distance apart for taps to be
	function TouchInfo()
	{
		this.starttime = 0;
		this.time = 0;
		this.lasttime = 0;
		this.startx = 0;
		this.starty = 0;
		this.x = 0;
		this.y = 0;
		this.lastx = 0;
		this.lasty = 0;
		this["id"] = 0;
		this.startindex = 0;
		this.triggeredHold = false;
		this.tooFarForHold = false;
	};
	TouchInfo.prototype.init = function (x, y, id, index)
	{
		var nowtime = cr.performance_now();
		this.time = nowtime;
		this.lasttime = nowtime;
		this.starttime = nowtime;
		this.startx = x;
		this.starty = y;
		this.x = x;
		this.y = y;
		this.lastx = x;
		this.lasty = y;
		this.width = 0;
		this.height = 0;
		this.pressure = 0;
		this["id"] = id;
		this.startindex = index;
		this.triggeredHold = false;
		this.tooFarForHold = false;
	};
	TouchInfo.prototype.update = function (nowtime, x, y, width, height, pressure)
	{
		this.lasttime = this.time;
		this.time = nowtime;
		this.lastx = this.x;
		this.lasty = this.y;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.pressure = pressure;
		if (!this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) >= GESTURE_HOLD_THRESHOLD)
		{
			this.tooFarForHold = true;
		}
	};
	TouchInfo.prototype.maybeTriggerHold = function (inst, index)
	{
		if (this.triggeredHold)
			return;		// already triggered this gesture
		var nowtime = cr.performance_now();
		if (nowtime - this.starttime >= GESTURE_HOLD_TIMEOUT && !this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) < GESTURE_HOLD_THRESHOLD)
		{
			this.triggeredHold = true;
			inst.trigger_index = this.startindex;
			inst.trigger_id = this["id"];
			inst.getTouchIndex = index;
			inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnHoldGesture, inst);
			inst.curTouchX = this.x;
			inst.curTouchY = this.y;
			inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnHoldGestureObject, inst);
			inst.getTouchIndex = 0;
		}
	};
	var lastTapX = -1000;
	var lastTapY = -1000;
	var lastTapTime = -10000;
	TouchInfo.prototype.maybeTriggerTap = function (inst, index)
	{
		if (this.triggeredHold)
			return;
		var nowtime = cr.performance_now();
		if (nowtime - this.starttime <= GESTURE_TAP_TIMEOUT && !this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) < GESTURE_HOLD_THRESHOLD)
		{
			inst.trigger_index = this.startindex;
			inst.trigger_id = this["id"];
			inst.getTouchIndex = index;
			if ((nowtime - lastTapTime <= GESTURE_TAP_TIMEOUT * 2) && cr.distanceTo(lastTapX, lastTapY, this.x, this.y) < GESTURE_DOUBLETAP_THRESHOLD)
			{
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnDoubleTapGesture, inst);
				inst.curTouchX = this.x;
				inst.curTouchY = this.y;
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnDoubleTapGestureObject, inst);
				lastTapX = -1000;
				lastTapY = -1000;
				lastTapTime = -10000;
			}
			else
			{
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTapGesture, inst);
				inst.curTouchX = this.x;
				inst.curTouchY = this.y;
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTapGestureObject, inst);
				lastTapX = this.x;
				lastTapY = this.y;
				lastTapTime = nowtime;
			}
			inst.getTouchIndex = 0;
		}
	};
	instanceProto.onCreate = function()
	{
		theInstance = this;
		this.isWindows8 = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);
		this.orient_alpha = 0;
		this.orient_beta = 0;
		this.orient_gamma = 0;
		this.acc_g_x = 0;
		this.acc_g_y = 0;
		this.acc_g_z = 0;
		this.acc_x = 0;
		this.acc_y = 0;
		this.acc_z = 0;
		this.curTouchX = 0;
		this.curTouchY = 0;
		this.trigger_index = 0;
		this.trigger_id = 0;
		this.trigger_permission = 0;
		this.getTouchIndex = 0;
		this.useMouseInput = (this.properties[0] !== 0);
		var elem = (this.runtime.fullscreen_mode > 0) ? document : this.runtime.canvas;
		var elem2 = document;
		if (this.runtime.isDirectCanvas)
			elem2 = elem = window["Canvas"];
		else if (this.runtime.isCocoonJs)
			elem2 = elem = window;
		var self = this;
		if (typeof PointerEvent !== "undefined")
		{
			elem.addEventListener("pointerdown",
				function(info) {
					self.onPointerStart(info);
				},
				false
			);
			elem.addEventListener("pointermove",
				function(info) {
					self.onPointerMove(info);
				},
				false
			);
			elem2.addEventListener("pointerup",
				function(info) {
					self.onPointerEnd(info, false);
				},
				false
			);
			elem2.addEventListener("pointercancel",
				function(info) {
					self.onPointerEnd(info, true);
				},
				false
			);
			if (this.runtime.canvas)
			{
				this.runtime.canvas.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				this.runtime.canvas.addEventListener("gesturehold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("gesturehold", function(e) {
					e.preventDefault();
				}, false);
			}
		}
		else if (window.navigator["msPointerEnabled"])
		{
			elem.addEventListener("MSPointerDown",
				function(info) {
					self.onPointerStart(info);
				},
				false
			);
			elem.addEventListener("MSPointerMove",
				function(info) {
					self.onPointerMove(info);
				},
				false
			);
			elem2.addEventListener("MSPointerUp",
				function(info) {
					self.onPointerEnd(info, false);
				},
				false
			);
			elem2.addEventListener("MSPointerCancel",
				function(info) {
					self.onPointerEnd(info, true);
				},
				false
			);
			if (this.runtime.canvas)
			{
				this.runtime.canvas.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
			}
		}
		else
		{
			elem.addEventListener("touchstart",
				function(info) {
					self.onTouchStart(info);
				},
				false
			);
			elem.addEventListener("touchmove",
				function(info) {
					self.onTouchMove(info);
				},
				false
			);
			elem2.addEventListener("touchend",
				function(info) {
					self.onTouchEnd(info, false);
				},
				false
			);
			elem2.addEventListener("touchcancel",
				function(info) {
					self.onTouchEnd(info, true);
				},
				false
			);
		}
		if (this.isWindows8)
		{
			var win8accelerometerFn = function(e) {
					var reading = e["reading"];
					self.acc_x = reading["accelerationX"];
					self.acc_y = reading["accelerationY"];
					self.acc_z = reading["accelerationZ"];
				};
			var win8inclinometerFn = function(e) {
					var reading = e["reading"];
					self.orient_alpha = reading["yawDegrees"];
					self.orient_beta = reading["pitchDegrees"];
					self.orient_gamma = reading["rollDegrees"];
				};
			var accelerometer = Windows["Devices"]["Sensors"]["Accelerometer"]["getDefault"]();
            if (accelerometer)
			{
                accelerometer["reportInterval"] = Math.max(accelerometer["minimumReportInterval"], 16);
				accelerometer.addEventListener("readingchanged", win8accelerometerFn);
            }
			var inclinometer = Windows["Devices"]["Sensors"]["Inclinometer"]["getDefault"]();
			if (inclinometer)
			{
				inclinometer["reportInterval"] = Math.max(inclinometer["minimumReportInterval"], 16);
				inclinometer.addEventListener("readingchanged", win8inclinometerFn);
			}
			document.addEventListener("visibilitychange", function(e) {
				if (document["hidden"] || document["msHidden"])
				{
					if (accelerometer)
						accelerometer.removeEventListener("readingchanged", win8accelerometerFn);
					if (inclinometer)
						inclinometer.removeEventListener("readingchanged", win8inclinometerFn);
				}
				else
				{
					if (accelerometer)
						accelerometer.addEventListener("readingchanged", win8accelerometerFn);
					if (inclinometer)
						inclinometer.addEventListener("readingchanged", win8inclinometerFn);
				}
			}, false);
		}
		else
		{
			window.addEventListener("deviceorientation", function (eventData) {
				self.orient_alpha = eventData["alpha"] || 0;
				self.orient_beta = eventData["beta"] || 0;
				self.orient_gamma = eventData["gamma"] || 0;
			}, false);
			window.addEventListener("devicemotion", function (eventData) {
				if (eventData["accelerationIncludingGravity"])
				{
					self.acc_g_x = eventData["accelerationIncludingGravity"]["x"] || 0;
					self.acc_g_y = eventData["accelerationIncludingGravity"]["y"] || 0;
					self.acc_g_z = eventData["accelerationIncludingGravity"]["z"] || 0;
				}
				if (eventData["acceleration"])
				{
					self.acc_x = eventData["acceleration"]["x"] || 0;
					self.acc_y = eventData["acceleration"]["y"] || 0;
					self.acc_z = eventData["acceleration"]["z"] || 0;
				}
			}, false);
		}
		if (this.useMouseInput && !this.runtime.isDomFree)
		{
			jQuery(document).mousemove(
				function(info) {
					self.onMouseMove(info);
				}
			);
			jQuery(document).mousedown(
				function(info) {
					self.onMouseDown(info);
				}
			);
			jQuery(document).mouseup(
				function(info) {
					self.onMouseUp(info);
				}
			);
		}
		if (!this.runtime.isiOS && this.runtime.isCordova && navigator["accelerometer"] && navigator["accelerometer"]["watchAcceleration"])
		{
			navigator["accelerometer"]["watchAcceleration"](PhoneGapGetAcceleration, null, { "frequency": 40 });
		}
		this.runtime.tick2Me(this);
	};
	instanceProto.onPointerMove = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault)
			info.preventDefault();
		var i = this.findTouch(info["pointerId"]);
		var nowtime = cr.performance_now();
		if (i >= 0)
		{
			var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
			var t = this.touches[i];
			if (nowtime - t.time < 2)
				return;
			t.update(nowtime, info.pageX - offset.left, info.pageY - offset.top, info.width || 0, info.height || 0, info.pressure || 0);
		}
	};
	instanceProto.onPointerStart = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var touchx = info.pageX - offset.left;
		var touchy = info.pageY - offset.top;
		var nowtime = cr.performance_now();
		this.trigger_index = this.touches.length;
		this.trigger_id = info["pointerId"];
		this.touches.push(AllocTouchInfo(touchx, touchy, info["pointerId"], this.trigger_index));
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchStart, this);
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchStart, this);
		this.curTouchX = touchx;
		this.curTouchY = touchy;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchObject, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onPointerEnd = function (info, isCancel)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var i = this.findTouch(info["pointerId"]);
		this.trigger_index = (i >= 0 ? this.touches[i].startindex : -1);
		this.trigger_id = (i >= 0 ? this.touches[i]["id"] : -1);
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchEnd, this);
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchEnd, this);
		if (i >= 0)
		{
			if (!isCancel)
				this.touches[i].maybeTriggerTap(this, i);
			ReleaseTouchInfo(this.touches[i]);
			this.touches.splice(i, 1);
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onTouchMove = function (info)
	{
		if (info.preventDefault)
			info.preventDefault();
		var nowtime = cr.performance_now();
		var i, len, t, u;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			var j = this.findTouch(t["identifier"]);
			if (j >= 0)
			{
				var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
				u = this.touches[j];
				if (nowtime - u.time < 2)
					continue;
				var touchWidth = (t.radiusX || t.webkitRadiusX || t.mozRadiusX || t.msRadiusX || 0) * 2;
				var touchHeight = (t.radiusY || t.webkitRadiusY || t.mozRadiusY || t.msRadiusY || 0) * 2;
				var touchForce = t.force || t.webkitForce || t.mozForce || t.msForce || 0;
				u.update(nowtime, t.pageX - offset.left, t.pageY - offset.top, touchWidth, touchHeight, touchForce);
			}
		}
	};
	instanceProto.onTouchStart = function (info)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var nowtime = cr.performance_now();
		this.runtime.isInUserInputEvent = true;
		var i, len, t, j;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			j = this.findTouch(t["identifier"]);
			if (j !== -1)
				continue;
			var touchx = t.pageX - offset.left;
			var touchy = t.pageY - offset.top;
			this.trigger_index = this.touches.length;
			this.trigger_id = t["identifier"];
			this.touches.push(AllocTouchInfo(touchx, touchy, t["identifier"], this.trigger_index));
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchStart, this);
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchStart, this);
			this.curTouchX = touchx;
			this.curTouchY = touchy;
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchObject, this);
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onTouchEnd = function (info, isCancel)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		this.runtime.isInUserInputEvent = true;
		var i, len, t, j;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			j = this.findTouch(t["identifier"]);
			if (j >= 0)
			{
				this.trigger_index = this.touches[j].startindex;
				this.trigger_id = this.touches[j]["id"];
				this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchEnd, this);
				this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchEnd, this);
				if (!isCancel)
					this.touches[j].maybeTriggerTap(this, j);
				ReleaseTouchInfo(this.touches[j]);
				this.touches.splice(j, 1);
			}
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.getAlpha = function ()
	{
		if (this.runtime.isCordova && this.orient_alpha === 0 && pg_accz !== 0)
			return pg_accz * 90;
		else
			return this.orient_alpha;
	};
	instanceProto.getBeta = function ()
	{
		if (this.runtime.isCordova && this.orient_beta === 0 && pg_accy !== 0)
			return pg_accy * 90;
		else
			return this.orient_beta;
	};
	instanceProto.getGamma = function ()
	{
		if (this.runtime.isCordova && this.orient_gamma === 0 && pg_accx !== 0)
			return pg_accx * 90;
		else
			return this.orient_gamma;
	};
	var noop_func = function(){};
	function isCompatibilityMouseEvent(e)
	{
		return (e["sourceCapabilities"] && e["sourceCapabilities"]["firesTouchEvents"]) ||
				(e.originalEvent && e.originalEvent["sourceCapabilities"] && e.originalEvent["sourceCapabilities"]["firesTouchEvents"]);
	};
	instanceProto.onMouseDown = function(info)
	{
		if (isCompatibilityMouseEvent(info))
			return;
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchStart(fakeinfo);
		this.mouseDown = true;
	};
	instanceProto.onMouseMove = function(info)
	{
		if (!this.mouseDown)
			return;
		if (isCompatibilityMouseEvent(info))
			return;
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchMove(fakeinfo);
	};
	instanceProto.onMouseUp = function(info)
	{
		if (info.preventDefault && this.runtime.had_a_click && !this.runtime.isMobile)
			info.preventDefault();
		this.runtime.had_a_click = true;
		if (isCompatibilityMouseEvent(info))
			return;
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchEnd(fakeinfo);
		this.mouseDown = false;
	};
	instanceProto.tick2 = function()
	{
		var i, len, t;
		var nowtime = cr.performance_now();
		for (i = 0, len = this.touches.length; i < len; ++i)
		{
			t = this.touches[i];
			if (t.time <= nowtime - 50)
				t.lasttime = nowtime;
			t.maybeTriggerHold(this, i);
		}
	};
	function Cnds() {};
	Cnds.prototype.OnTouchStart = function ()
	{
		return true;
	};
	Cnds.prototype.OnTouchEnd = function ()
	{
		return true;
	};
	Cnds.prototype.IsInTouch = function ()
	{
		return this.touches.length;
	};
	Cnds.prototype.OnTouchObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	var touching = [];
	Cnds.prototype.IsTouchingObject = function (type)
	{
		if (!type)
			return false;
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();
		var px, py;
		var i, leni, j, lenj;
		for (i = 0, leni = instances.length; i < leni; i++)
		{
			var inst = instances[i];
			inst.update_bbox();
			for (j = 0, lenj = this.touches.length; j < lenj; j++)
			{
				var touch = this.touches[j];
				px = inst.layer.canvasToLayer(touch.x, touch.y, true);
				py = inst.layer.canvasToLayer(touch.x, touch.y, false);
				if (inst.contains_pt(px, py))
				{
					touching.push(inst);
					break;
				}
			}
		}
		if (touching.length)
		{
			sol.select_all = false;
			cr.shallowAssignArray(sol.instances, touching);
			type.applySolToContainer();
			cr.clearArray(touching);
			return true;
		}
		else
			return false;
	};
	Cnds.prototype.CompareTouchSpeed = function (index, cmp, s)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
			return false;
		var t = this.touches[index];
		var dist = cr.distanceTo(t.x, t.y, t.lastx, t.lasty);
		var timediff = (t.time - t.lasttime) / 1000;
		var speed = 0;
		if (timediff > 0)
			speed = dist / timediff;
		return cr.do_cmp(speed, cmp, s);
	};
	Cnds.prototype.OrientationSupported = function ()
	{
		return typeof window["DeviceOrientationEvent"] !== "undefined";
	};
	Cnds.prototype.MotionSupported = function ()
	{
		return typeof window["DeviceMotionEvent"] !== "undefined";
	};
	Cnds.prototype.CompareOrientation = function (orientation_, cmp_, angle_)
	{
		var v = 0;
		if (orientation_ === 0)
			v = this.getAlpha();
		else if (orientation_ === 1)
			v = this.getBeta();
		else
			v = this.getGamma();
		return cr.do_cmp(v, cmp_, angle_);
	};
	Cnds.prototype.CompareAcceleration = function (acceleration_, cmp_, angle_)
	{
		var v = 0;
		if (acceleration_ === 0)
			v = this.acc_g_x;
		else if (acceleration_ === 1)
			v = this.acc_g_y;
		else if (acceleration_ === 2)
			v = this.acc_g_z;
		else if (acceleration_ === 3)
			v = this.acc_x;
		else if (acceleration_ === 4)
			v = this.acc_y;
		else if (acceleration_ === 5)
			v = this.acc_z;
		return cr.do_cmp(v, cmp_, angle_);
	};
	Cnds.prototype.OnNthTouchStart = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return touch_ === this.trigger_index;
	};
	Cnds.prototype.OnNthTouchEnd = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return touch_ === this.trigger_index;
	};
	Cnds.prototype.HasNthTouch = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return this.touches.length >= touch_ + 1;
	};
	Cnds.prototype.OnHoldGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnTapGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnDoubleTapGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnHoldGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	Cnds.prototype.OnTapGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	Cnds.prototype.OnDoubleTapGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	Cnds.prototype.OnPermissionGranted = function (type)
	{
		return this.trigger_permission === type;
	};
	Cnds.prototype.OnPermissionDenied = function (type)
	{
		return this.trigger_permission === type;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.RequestPermission = function (type)
	{
		var self = this;
		var promise = Promise.resolve(true);
		if (type === 0)		// orientation
		{
			if (window["DeviceOrientationEvent"] && window["DeviceOrientationEvent"]["requestPermission"])
			{
				promise = window["DeviceOrientationEvent"]["requestPermission"]()
				.then(function (state)
				{
					return state === "granted";
				});
			}
		}
		else				// motion
		{
			if (window["DeviceMotionEvent"] && window["DeviceMotionEvent"]["requestPermission"])
			{
				promise = window["DeviceMotionEvent"]["requestPermission"]()
				.then(function (state)
				{
					return state === "granted";
				});
			}
		}
		promise.then(function (result)
		{
			self.trigger_permission = type;
			if (result)
				self.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnPermissionGranted, self);
			else
				self.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnPermissionDenied, self);
		});
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.TouchCount = function (ret)
	{
		ret.set_int(this.touches.length);
	};
	Exps.prototype.X = function (ret, layerparam)
	{
		var index = this.getTouchIndex;
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.XAt = function (ret, index, layerparam)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.XForID = function (ret, id, layerparam)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(touch.x, touch.y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(touch.x, touch.y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.Y = function (ret, layerparam)
	{
		var index = this.getTouchIndex;
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.YAt = function (ret, index, layerparam)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.YForID = function (ret, id, layerparam)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(touch.x, touch.y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(touch.x, touch.y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.AbsoluteX = function (ret)
	{
		if (this.touches.length)
			ret.set_float(this.touches[0].x);
		else
			ret.set_float(0);
	};
	Exps.prototype.AbsoluteXAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		ret.set_float(this.touches[index].x);
	};
	Exps.prototype.AbsoluteXForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.x);
	};
	Exps.prototype.AbsoluteY = function (ret)
	{
		if (this.touches.length)
			ret.set_float(this.touches[0].y);
		else
			ret.set_float(0);
	};
	Exps.prototype.AbsoluteYAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		ret.set_float(this.touches[index].y);
	};
	Exps.prototype.AbsoluteYForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.y);
	};
	Exps.prototype.SpeedAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var t = this.touches[index];
		var dist = cr.distanceTo(t.x, t.y, t.lastx, t.lasty);
		var timediff = (t.time - t.lasttime) / 1000;
		if (timediff <= 0)
			ret.set_float(0);
		else
			ret.set_float(dist / timediff);
	};
	Exps.prototype.SpeedForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var dist = cr.distanceTo(touch.x, touch.y, touch.lastx, touch.lasty);
		var timediff = (touch.time - touch.lasttime) / 1000;
		if (timediff <= 0)
			ret.set_float(0);
		else
			ret.set_float(dist / timediff);
	};
	Exps.prototype.AngleAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var t = this.touches[index];
		ret.set_float(cr.to_degrees(cr.angleTo(t.lastx, t.lasty, t.x, t.y)));
	};
	Exps.prototype.AngleForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(cr.to_degrees(cr.angleTo(touch.lastx, touch.lasty, touch.x, touch.y)));
	};
	Exps.prototype.Alpha = function (ret)
	{
		ret.set_float(this.getAlpha());
	};
	Exps.prototype.Beta = function (ret)
	{
		ret.set_float(this.getBeta());
	};
	Exps.prototype.Gamma = function (ret)
	{
		ret.set_float(this.getGamma());
	};
	Exps.prototype.AccelerationXWithG = function (ret)
	{
		ret.set_float(this.acc_g_x);
	};
	Exps.prototype.AccelerationYWithG = function (ret)
	{
		ret.set_float(this.acc_g_y);
	};
	Exps.prototype.AccelerationZWithG = function (ret)
	{
		ret.set_float(this.acc_g_z);
	};
	Exps.prototype.AccelerationX = function (ret)
	{
		ret.set_float(this.acc_x);
	};
	Exps.prototype.AccelerationY = function (ret)
	{
		ret.set_float(this.acc_y);
	};
	Exps.prototype.AccelerationZ = function (ret)
	{
		ret.set_float(this.acc_z);
	};
	Exps.prototype.TouchIndex = function (ret)
	{
		ret.set_int(this.trigger_index);
	};
	Exps.prototype.TouchID = function (ret)
	{
		ret.set_float(this.trigger_id);
	};
	Exps.prototype.WidthForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.width);
	};
	Exps.prototype.HeightForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.height);
	};
	Exps.prototype.PressureForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.pressure);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.behaviors.Fade = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Fade.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.activeAtStart = this.properties[0] === 1;
		this.setMaxOpacity = false;					// used to retrieve maxOpacity once in first 'Start fade' action if initially inactive
		this.fadeInTime = this.properties[1];
		this.waitTime = this.properties[2];
		this.fadeOutTime = this.properties[3];
		this.destroy = this.properties[4];			// 0 = no, 1 = after fade out
		this.stage = this.activeAtStart ? 0 : 3;		// 0 = fade in, 1 = wait, 2 = fade out, 3 = done
		if (this.recycled)
			this.stageTime.reset();
		else
			this.stageTime = new cr.KahanAdder();
		this.maxOpacity = (this.inst.opacity ? this.inst.opacity : 1.0);
		if (this.activeAtStart)
		{
			if (this.fadeInTime === 0)
			{
				this.stage = 1;
				if (this.waitTime === 0)
					this.stage = 2;
			}
			else
			{
				this.inst.opacity = 0;
				this.runtime.redraw = true;
			}
		}
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"fit": this.fadeInTime,
			"wt": this.waitTime,
			"fot": this.fadeOutTime,
			"s": this.stage,
			"st": this.stageTime.sum,
			"mo": this.maxOpacity,
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.fadeInTime = o["fit"];
		this.waitTime = o["wt"];
		this.fadeOutTime = o["fot"];
		this.stage = o["s"];
		this.stageTime.reset();
		this.stageTime.sum = o["st"];
		this.maxOpacity = o["mo"];
	};
	behinstProto.tick = function ()
	{
		this.stageTime.add(this.runtime.getDt(this.inst));
		if (this.stage === 0)
		{
			this.inst.opacity = (this.stageTime.sum / this.fadeInTime) * this.maxOpacity;
			this.runtime.redraw = true;
			if (this.inst.opacity >= this.maxOpacity)
			{
				this.inst.opacity = this.maxOpacity;
				this.stage = 1;	// wait stage
				this.stageTime.reset();
				this.runtime.trigger(cr.behaviors.Fade.prototype.cnds.OnFadeInEnd, this.inst);
			}
		}
		if (this.stage === 1)
		{
			if (this.stageTime.sum >= this.waitTime)
			{
				this.stage = 2;	// fade out stage
				this.stageTime.reset();
				this.runtime.trigger(cr.behaviors.Fade.prototype.cnds.OnWaitEnd, this.inst);
			}
		}
		if (this.stage === 2)
		{
			if (this.fadeOutTime !== 0)
			{
				this.inst.opacity = this.maxOpacity - ((this.stageTime.sum / this.fadeOutTime) * this.maxOpacity);
				this.runtime.redraw = true;
				if (this.inst.opacity < 0)
				{
					this.inst.opacity = 0;
					this.stage = 3;	// done
					this.stageTime.reset();
					this.runtime.trigger(cr.behaviors.Fade.prototype.cnds.OnFadeOutEnd, this.inst);
					if (this.destroy === 1)
						this.runtime.DestroyInstance(this.inst);
				}
			}
		}
	};
	behinstProto.doStart = function ()
	{
		this.stage = 0;
		this.stageTime.reset();
		if (this.fadeInTime === 0)
		{
			this.stage = 1;
			if (this.waitTime === 0)
				this.stage = 2;
		}
		else
		{
			this.inst.opacity = 0;
			this.runtime.redraw = true;
		}
	};
	function Cnds() {};
	Cnds.prototype.OnFadeOutEnd = function ()
	{
		return true;
	};
	Cnds.prototype.OnFadeInEnd = function ()
	{
		return true;
	};
	Cnds.prototype.OnWaitEnd = function ()
	{
		return true;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.StartFade = function ()
	{
		if (!this.activeAtStart && !this.setMaxOpacity)
		{
			this.maxOpacity = (this.inst.opacity ? this.inst.opacity : 1.0);
			this.setMaxOpacity = true;
		}
		if (this.stage === 3)
			this.doStart();
	};
	Acts.prototype.RestartFade = function ()
	{
		this.doStart();
	};
	Acts.prototype.SetFadeInTime = function (t)
	{
		if (t < 0)
			t = 0;
		this.fadeInTime = t;
	};
	Acts.prototype.SetWaitTime = function (t)
	{
		if (t < 0)
			t = 0;
		this.waitTime = t;
	};
	Acts.prototype.SetFadeOutTime = function (t)
	{
		if (t < 0)
			t = 0;
		this.fadeOutTime = t;
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.FadeInTime = function (ret)
	{
		ret.set_float(this.fadeInTime);
	};
	Exps.prototype.WaitTime = function (ret)
	{
		ret.set_float(this.waitTime);
	};
	Exps.prototype.FadeOutTime = function (ret)
	{
		ret.set_float(this.fadeOutTime);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Pin = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Pin.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.pinObject = null;
		this.pinObjectUid = -1;		// for loading
		this.pinAngle = 0;
		this.pinDist = 0;
		this.myStartAngle = 0;
		this.theirStartAngle = 0;
		this.lastKnownAngle = 0;
		this.mode = 0;				// 0 = position & angle; 1 = position; 2 = angle; 3 = rope; 4 = bar
		var self = this;
		if (!this.recycled)
		{
			this.myDestroyCallback = (function(inst) {
													self.onInstanceDestroyed(inst);
												});
		}
		this.runtime.addDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"uid": this.pinObject ? this.pinObject.uid : -1,
			"pa": this.pinAngle,
			"pd": this.pinDist,
			"msa": this.myStartAngle,
			"tsa": this.theirStartAngle,
			"lka": this.lastKnownAngle,
			"m": this.mode
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.pinObjectUid = o["uid"];		// wait until afterLoad to look up
		this.pinAngle = o["pa"];
		this.pinDist = o["pd"];
		this.myStartAngle = o["msa"];
		this.theirStartAngle = o["tsa"];
		this.lastKnownAngle = o["lka"];
		this.mode = o["m"];
	};
	behinstProto.afterLoad = function ()
	{
		if (this.pinObjectUid === -1)
			this.pinObject = null;
		else
		{
			this.pinObject = this.runtime.getObjectByUID(this.pinObjectUid);
;
		}
		this.pinObjectUid = -1;
	};
	behinstProto.onInstanceDestroyed = function (inst)
	{
		if (this.pinObject == inst)
			this.pinObject = null;
	};
	behinstProto.onDestroy = function()
	{
		this.pinObject = null;
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.tick = function ()
	{
	};
	behinstProto.tick2 = function ()
	{
		if (!this.pinObject)
			return;
		if (this.lastKnownAngle !== this.inst.angle)
			this.myStartAngle = cr.clamp_angle(this.myStartAngle + (this.inst.angle - this.lastKnownAngle));
		var newx = this.inst.x;
		var newy = this.inst.y;
		if (this.mode === 3 || this.mode === 4)		// rope mode or bar mode
		{
			var dist = cr.distanceTo(this.inst.x, this.inst.y, this.pinObject.x, this.pinObject.y);
			if ((dist > this.pinDist) || (this.mode === 4 && dist < this.pinDist))
			{
				var a = cr.angleTo(this.pinObject.x, this.pinObject.y, this.inst.x, this.inst.y);
				newx = this.pinObject.x + Math.cos(a) * this.pinDist;
				newy = this.pinObject.y + Math.sin(a) * this.pinDist;
			}
		}
		else
		{
			newx = this.pinObject.x + Math.cos(this.pinObject.angle + this.pinAngle) * this.pinDist;
			newy = this.pinObject.y + Math.sin(this.pinObject.angle + this.pinAngle) * this.pinDist;
		}
		var newangle = cr.clamp_angle(this.myStartAngle + (this.pinObject.angle - this.theirStartAngle));
		this.lastKnownAngle = newangle;
		if ((this.mode === 0 || this.mode === 1 || this.mode === 3 || this.mode === 4)
			&& (this.inst.x !== newx || this.inst.y !== newy))
		{
			this.inst.x = newx;
			this.inst.y = newy;
			this.inst.set_bbox_changed();
		}
		if ((this.mode === 0 || this.mode === 2) && (this.inst.angle !== newangle))
		{
			this.inst.angle = newangle;
			this.inst.set_bbox_changed();
		}
	};
	function Cnds() {};
	Cnds.prototype.IsPinned = function ()
	{
		return !!this.pinObject;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Pin = function (obj, mode_)
	{
		if (!obj)
			return;
		var otherinst = obj.getFirstPicked(this.inst);
		if (!otherinst)
			return;
		this.pinObject = otherinst;
		this.pinAngle = cr.angleTo(otherinst.x, otherinst.y, this.inst.x, this.inst.y) - otherinst.angle;
		this.pinDist = cr.distanceTo(otherinst.x, otherinst.y, this.inst.x, this.inst.y);
		this.myStartAngle = this.inst.angle;
		this.lastKnownAngle = this.inst.angle;
		this.theirStartAngle = otherinst.angle;
		this.mode = mode_;
	};
	Acts.prototype.Unpin = function ()
	{
		this.pinObject = null;
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.PinnedUID = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinObject.uid : -1);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Platform = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Platform.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	var ANIMMODE_STOPPED = 0;
	var ANIMMODE_MOVING = 1;
	var ANIMMODE_JUMPING = 2;
	var ANIMMODE_FALLING = 3;
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
		this.jumped = false;			// prevent bunnyhopping
		this.doubleJumped = false;
		this.canDoubleJump = false;
		this.ignoreInput = false;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		this.lastFloorObject = null;
		this.loadFloorObject = -1;
		this.lastFloorX = 0;
		this.lastFloorY = 0;
		this.floorIsJumpthru = false;
		this.animMode = ANIMMODE_STOPPED;
		this.fallthrough = 0;			// fall through jump-thru.  >0 to disable, lasts a few ticks
		this.firstTick = true;
		this.dx = 0;
		this.dy = 0;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.updateGravity = function()
	{
		this.downx = Math.cos(this.ga);
		this.downy = Math.sin(this.ga);
		this.rightx = Math.cos(this.ga - Math.PI / 2);
		this.righty = Math.sin(this.ga - Math.PI / 2);
		this.downx = cr.round6dp(this.downx);
		this.downy = cr.round6dp(this.downy);
		this.rightx = cr.round6dp(this.rightx);
		this.righty = cr.round6dp(this.righty);
		this.g1 = this.g;
		if (this.g < 0)
		{
			this.downx *= -1;
			this.downy *= -1;
			this.g = Math.abs(this.g);
		}
	};
	behinstProto.onCreate = function()
	{
		this.maxspeed = this.properties[0];
		this.acc = this.properties[1];
		this.dec = this.properties[2];
		this.jumpStrength = this.properties[3];
		this.g = this.properties[4];
		this.g1 = this.g;
		this.maxFall = this.properties[5];
		this.enableDoubleJump = (this.properties[6] !== 0);	// 0=disabled, 1=enabled
		this.jumpSustain = (this.properties[7] / 1000);		// convert ms to s
		this.defaultControls = (this.properties[8] === 1);	// 0=no, 1=yes
		this.enabled = (this.properties[9] !== 0);
		this.wasOnFloor = false;
		this.wasOverJumpthru = this.runtime.testOverlapJumpThru(this.inst);
		this.loadOverJumpthru = -1;
		this.sustainTime = 0;				// time of jump sustain remaining
		this.ga = cr.to_radians(90);
		this.updateGravity();
		var self = this;
		if (this.defaultControls && !this.runtime.isDomFree)
		{
			jQuery(document).keydown(function(info) {
						self.onKeyDown(info);
					});
			jQuery(document).keyup(function(info) {
						self.onKeyUp(info);
					});
		}
		if (!this.recycled)
		{
			this.myDestroyCallback = function(inst) {
										self.onInstanceDestroyed(inst);
									};
		}
		this.runtime.addDestroyCallback(this.myDestroyCallback);
		this.inst.extra["isPlatformBehavior"] = true;
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"ii": this.ignoreInput,
			"lfx": this.lastFloorX,
			"lfy": this.lastFloorY,
			"lfo": (this.lastFloorObject ? this.lastFloorObject.uid : -1),
			"am": this.animMode,
			"en": this.enabled,
			"fall": this.fallthrough,
			"ft": this.firstTick,
			"dx": this.dx,
			"dy": this.dy,
			"ms": this.maxspeed,
			"acc": this.acc,
			"dec": this.dec,
			"js": this.jumpStrength,
			"g": this.g,
			"g1": this.g1,
			"mf": this.maxFall,
			"wof": this.wasOnFloor,
			"woj": (this.wasOverJumpthru ? this.wasOverJumpthru.uid : -1),
			"ga": this.ga,
			"edj": this.enableDoubleJump,
			"cdj": this.canDoubleJump,
			"dj": this.doubleJumped,
			"sus": this.jumpSustain
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.ignoreInput = o["ii"];
		this.lastFloorX = o["lfx"];
		this.lastFloorY = o["lfy"];
		this.loadFloorObject = o["lfo"];
		this.animMode = o["am"];
		this.enabled = o["en"];
		this.fallthrough = o["fall"];
		this.firstTick = o["ft"];
		this.dx = o["dx"];
		this.dy = o["dy"];
		this.maxspeed = o["ms"];
		this.acc = o["acc"];
		this.dec = o["dec"];
		this.jumpStrength = o["js"];
		this.g = o["g"];
		this.g1 = o["g1"];
		this.maxFall = o["mf"];
		this.wasOnFloor = o["wof"];
		this.loadOverJumpthru = o["woj"];
		this.ga = o["ga"];
		this.enableDoubleJump = o["edj"];
		this.canDoubleJump = o["cdj"];
		this.doubleJumped = o["dj"];
		this.jumpSustain = o["sus"];
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
		this.jumped = false;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		this.sustainTime = 0;
		this.updateGravity();
	};
	behinstProto.afterLoad = function ()
	{
		if (this.loadFloorObject === -1)
			this.lastFloorObject = null;
		else
			this.lastFloorObject = this.runtime.getObjectByUID(this.loadFloorObject);
		if (this.loadOverJumpthru === -1)
			this.wasOverJumpthru = null;
		else
			this.wasOverJumpthru = this.runtime.getObjectByUID(this.loadOverJumpthru);
	};
	behinstProto.onInstanceDestroyed = function (inst)
	{
		if (this.lastFloorObject == inst)
			this.lastFloorObject = null;
	};
	behinstProto.onDestroy = function ()
	{
		this.lastFloorObject = null;
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.onKeyDown = function (info)
	{
		switch (info.which) {
		case 38:	// up
			info.preventDefault();
			this.jumpkey = true;
			break;
		case 37:	// left
			info.preventDefault();
			this.leftkey = true;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = true;
			break;
		}
	};
	behinstProto.onKeyUp = function (info)
	{
		switch (info.which) {
		case 38:	// up
			info.preventDefault();
			this.jumpkey = false;
			this.jumped = false;
			break;
		case 37:	// left
			info.preventDefault();
			this.leftkey = false;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = false;
			break;
		}
	};
	behinstProto.onWindowBlur = function ()
	{
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
	};
	behinstProto.getGDir = function ()
	{
		if (this.g < 0)
			return -1;
		else
			return 1;
	};
	behinstProto.isOnFloor = function ()
	{
		var ret = null;
		var ret2 = null;
		var i, len, j;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		if (this.lastFloorObject && this.runtime.testOverlap(this.inst, this.lastFloorObject) &&
			(!this.runtime.typeHasBehavior(this.lastFloorObject.type, cr.behaviors.solid) || this.lastFloorObject.extra["solidEnabled"]))
		{
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			return this.lastFloorObject;
		}
		else
		{
			ret = this.runtime.testOverlapSolid(this.inst);
			if (!ret && this.fallthrough === 0)
				ret2 = this.runtime.testOverlapJumpThru(this.inst, true);
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			if (ret)		// was overlapping solid
			{
				if (this.runtime.testOverlap(this.inst, ret))
					return null;
				else
				{
					this.floorIsJumpthru = false;
					return ret;
				}
			}
			if (ret2 && ret2.length)
			{
				for (i = 0, j = 0, len = ret2.length; i < len; i++)
				{
					ret2[j] = ret2[i];
					if (!this.runtime.testOverlap(this.inst, ret2[i]))
						j++;
				}
				if (j >= 1)
				{
					this.floorIsJumpthru = true;
					return ret2[0];
				}
			}
			return null;
		}
	};
	behinstProto.tick = function ()
	{
	};
	behinstProto.posttick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		var mx, my, obstacle, mag, allover, i, len, j, oldx, oldy;
		if (!this.jumpkey && !this.simjump)
			this.jumped = false;
		var left = this.leftkey || this.simleft;
		var right = this.rightkey || this.simright;
		var jumpkey = (this.jumpkey || this.simjump);
		var jump = jumpkey && !this.jumped;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		if (!this.enabled)
			return;
		if (this.ignoreInput)
		{
			left = false;
			right = false;
			jumpkey = false;
			jump = false;
		}
		if (!jumpkey)
			this.sustainTime = 0;
		var lastFloor = this.lastFloorObject;
		var floor_moved = false;
		if (this.firstTick)
		{
			if (this.runtime.testOverlapSolid(this.inst) || this.runtime.testOverlapJumpThru(this.inst))
			{
				this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 4, true);
			}
			this.firstTick = false;
		}
		if (lastFloor && this.dy === 0 && (lastFloor.y !== this.lastFloorY || lastFloor.x !== this.lastFloorX))
		{
			mx = (lastFloor.x - this.lastFloorX);
			my = (lastFloor.y - this.lastFloorY);
			this.inst.x += mx;
			this.inst.y += my;
			this.inst.set_bbox_changed();
			this.lastFloorX = lastFloor.x;
			this.lastFloorY = lastFloor.y;
			floor_moved = true;
			if (this.runtime.testOverlapSolid(this.inst))
			{
				this.runtime.pushOutSolid(this.inst, -mx, -my, Math.sqrt(mx * mx + my * my) * 2.5);
			}
		}
		var floor_ = this.isOnFloor();
		var collobj = this.runtime.testOverlapSolid(this.inst);
		if (collobj)
		{
			var instWidth = Math.abs(this.inst.width);
			var instHeight = Math.abs(this.inst.height);
			if (this.inst.extra["inputPredicted"])
			{
				this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 10, false);
			}
			else if (this.runtime.pushOutSolidAxis(this.inst, -this.downx, -this.downy, instHeight / 8))
			{
				this.runtime.registerCollision(this.inst, collobj);
			}
			else if (this.runtime.pushOutSolidAxis(this.inst, this.rightx, this.righty, instWidth / 2))
			{
				this.runtime.registerCollision(this.inst, collobj);
			}
			else if (this.runtime.pushOutSolidAxis(this.inst, this.downx, this.downy, instHeight / 2))
			{
				this.runtime.registerCollision(this.inst, collobj);
			}
			else if (this.runtime.pushOutSolidNearest(this.inst, Math.max(instWidth, instHeight) / 2))
			{
				this.runtime.registerCollision(this.inst, collobj);
			}
			else
				return;
		}
		if (floor_)
		{
			this.doubleJumped = false;		// reset double jump flags for next jump
			this.canDoubleJump = false;
			if (this.dy > 0)
			{
				if (!this.wasOnFloor)
				{
					this.runtime.pushInFractional(this.inst, -this.downx, -this.downy, floor_, 16);
					this.wasOnFloor = true;
				}
				this.dy = 0;
			}
			if (lastFloor != floor_)
			{
				this.lastFloorObject = floor_;
				this.lastFloorX = floor_.x;
				this.lastFloorY = floor_.y;
				this.runtime.registerCollision(this.inst, floor_);
			}
			else if (floor_moved)
			{
				collobj = this.runtime.testOverlapSolid(this.inst);
				if (collobj)
				{
					this.runtime.registerCollision(this.inst, collobj);
					if (mx !== 0)
					{
						if (mx > 0)
							this.runtime.pushOutSolid(this.inst, -this.rightx, -this.righty);
						else
							this.runtime.pushOutSolid(this.inst, this.rightx, this.righty);
					}
					this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy);
				}
			}
		}
		else
		{
			if (!jumpkey)
				this.canDoubleJump = true;
		}
		if ((floor_ && jump) || (!floor_ && this.enableDoubleJump && jumpkey && this.canDoubleJump && !this.doubleJumped))
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			this.inst.x -= this.downx;
			this.inst.y -= this.downy;
			this.inst.set_bbox_changed();
			if (!this.runtime.testOverlapSolid(this.inst))
			{
				this.sustainTime = this.jumpSustain;
				this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnJump, this.inst);
				this.animMode = ANIMMODE_JUMPING;
				this.dy = -this.jumpStrength;
				jump = true;		// set in case is double jump
				if (floor_)
					this.jumped = true;
				else
					this.doubleJumped = true;
			}
			else
				jump = false;
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
		}
		if (!floor_)
		{
			if (jumpkey && this.sustainTime > 0)
			{
				this.dy = -this.jumpStrength;
				this.sustainTime -= dt;
			}
			else
			{
				this.lastFloorObject = null;
				this.dy += this.g * dt;
				if (this.dy > this.maxFall)
					this.dy = this.maxFall;
			}
			if (jump)
				this.jumped = true;
		}
		this.wasOnFloor = !!floor_;
		if (left == right)	// both up or both down
		{
			if (this.dx < 0)
			{
				this.dx += this.dec * dt;
				if (this.dx > 0)
					this.dx = 0;
			}
			else if (this.dx > 0)
			{
				this.dx -= this.dec * dt;
				if (this.dx < 0)
					this.dx = 0;
			}
		}
		if (left && !right)
		{
			if (this.dx > 0)
				this.dx -= (this.acc + this.dec) * dt;
			else
				this.dx -= this.acc * dt;
		}
		if (right && !left)
		{
			if (this.dx < 0)
				this.dx += (this.acc + this.dec) * dt;
			else
				this.dx += this.acc * dt;
		}
		if (this.dx > this.maxspeed)
			this.dx = this.maxspeed;
		else if (this.dx < -this.maxspeed)
			this.dx = -this.maxspeed;
		var landed = false;
		if (this.dx !== 0)
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			mx = this.dx * dt * this.rightx;
			my = this.dx * dt * this.righty;
			this.inst.x += this.rightx * (this.dx > 1 ? 1 : -1) - this.downx;
			this.inst.y += this.righty * (this.dx > 1 ? 1 : -1) - this.downy;
			this.inst.set_bbox_changed();
			var is_jumpthru = false;
			var slope_too_steep = this.runtime.testOverlapSolid(this.inst);
			/*
			if (!slope_too_steep && floor_)
			{
				slope_too_steep = this.runtime.testOverlapJumpThru(this.inst);
				is_jumpthru = true;
				if (slope_too_steep)
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlap(this.inst, slope_too_steep))
					{
						slope_too_steep = null;
						is_jumpthru = false;
					}
				}
			}
			*/
			this.inst.x = oldx + mx;
			this.inst.y = oldy + my;
			this.inst.set_bbox_changed();
			obstacle = this.runtime.testOverlapSolid(this.inst);
			if (!obstacle && floor_)
			{
				obstacle = this.runtime.testOverlapJumpThru(this.inst);
				if (obstacle)
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlap(this.inst, obstacle))
					{
						obstacle = null;
						is_jumpthru = false;
					}
					else
						is_jumpthru = true;
					this.inst.x = oldx + mx;
					this.inst.y = oldy + my;
					this.inst.set_bbox_changed();
				}
			}
			if (obstacle)
			{
				var push_dist = Math.abs(this.dx * dt) + 2;
				if (slope_too_steep || !this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, push_dist, is_jumpthru, obstacle))
				{
					this.runtime.registerCollision(this.inst, obstacle);
					push_dist = Math.max(Math.abs(this.dx * dt * 2.5), 30);
					if (!this.runtime.pushOutSolid(this.inst, this.rightx * (this.dx < 0 ? 1 : -1), this.righty * (this.dx < 0 ? 1 : -1), push_dist, false))
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
					}
					else if (floor_ && !is_jumpthru && !this.floorIsJumpthru)
					{
						oldx = this.inst.x;
						oldy = this.inst.y;
						this.inst.x += this.downx;
						this.inst.y += this.downy;
						if (this.runtime.testOverlapSolid(this.inst))
						{
							if (!this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 3, false))
							{
								this.inst.x = oldx;
								this.inst.y = oldy;
								this.inst.set_bbox_changed();
							}
						}
						else
						{
							this.inst.x = oldx;
							this.inst.y = oldy;
							this.inst.set_bbox_changed();
						}
					}
					if (!is_jumpthru)
						this.dx = 0;	// stop
				}
				else if (!slope_too_steep && !jump && (Math.abs(this.dy) < Math.abs(this.jumpStrength / 4)))
				{
					this.dy = 0;
					if (!floor_)
						landed = true;
				}
			}
			else
			{
				var newfloor = this.isOnFloor();
				if (floor_ && !newfloor)
				{
					mag = Math.ceil(Math.abs(this.dx * dt)) + 2;
					oldx = this.inst.x;
					oldy = this.inst.y;
					this.inst.x += this.downx * mag;
					this.inst.y += this.downy * mag;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlapSolid(this.inst) || this.runtime.testOverlapJumpThru(this.inst))
						this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, mag + 2, true);
					else
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
					}
				}
				else if (newfloor)
				{
					if (!floor_ && this.floorIsJumpthru)
					{
						this.lastFloorObject = newfloor;
						this.lastFloorX = newfloor.x;
						this.lastFloorY = newfloor.y;
						this.dy = 0;
						landed = true;
					}
					if (this.dy === 0)
					{
						this.runtime.pushInFractional(this.inst, -this.downx, -this.downy, newfloor, 16);
					}
				}
			}
		}
		if (this.dy !== 0)
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			this.inst.x += this.dy * dt * this.downx;
			this.inst.y += this.dy * dt * this.downy;
			var newx = this.inst.x;
			var newy = this.inst.y;
			this.inst.set_bbox_changed();
			collobj = this.runtime.testOverlapSolid(this.inst);
			var fell_on_jumpthru = false;
			if (!collobj && (this.dy > 0) && !floor_)
			{
				allover = this.fallthrough > 0 ? null : this.runtime.testOverlapJumpThru(this.inst, true);
				if (allover && allover.length)
				{
					if (this.wasOverJumpthru)
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
						for (i = 0, j = 0, len = allover.length; i < len; i++)
						{
							allover[j] = allover[i];
							if (!this.runtime.testOverlap(this.inst, allover[i]))
								j++;
						}
						allover.length = j;
						this.inst.x = newx;
						this.inst.y = newy;
						this.inst.set_bbox_changed();
					}
					if (allover.length >= 1)
						collobj = allover[0];
				}
				fell_on_jumpthru = !!collobj;
			}
			if (collobj)
			{
				this.runtime.registerCollision(this.inst, collobj);
				this.sustainTime = 0;
				var push_dist = (fell_on_jumpthru ? Math.abs(this.dy * dt * 2.5 + 10) : Math.max(Math.abs(this.dy * dt * 2.5 + 10), 30));
				if (!this.runtime.pushOutSolid(this.inst, this.downx * (this.dy < 0 ? 1 : -1), this.downy * (this.dy < 0 ? 1 : -1), push_dist, fell_on_jumpthru, collobj))
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					this.wasOnFloor = true;		// prevent adjustment for unexpected floor landings
					if (!fell_on_jumpthru)
						this.dy = 0;	// stop
				}
				else
				{
					this.lastFloorObject = collobj;
					this.lastFloorX = collobj.x;
					this.lastFloorY = collobj.y;
					this.floorIsJumpthru = fell_on_jumpthru;
					if (fell_on_jumpthru)
						landed = true;
					this.dy = 0;	// stop
				}
			}
		}
		if (this.animMode !== ANIMMODE_FALLING && this.dy > 0 && !floor_)
		{
			this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnFall, this.inst);
			this.animMode = ANIMMODE_FALLING;
		}
		if ((floor_ || landed) && this.dy >= 0)
		{
			if (this.animMode === ANIMMODE_FALLING || landed || (jump && this.dy === 0))
			{
				this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnLand, this.inst);
				if (this.dx === 0 && this.dy === 0)
					this.animMode = ANIMMODE_STOPPED;
				else
					this.animMode = ANIMMODE_MOVING;
			}
			else
			{
				if (this.animMode !== ANIMMODE_STOPPED && this.dx === 0 && this.dy === 0)
				{
					this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnStop, this.inst);
					this.animMode = ANIMMODE_STOPPED;
				}
				if (this.animMode !== ANIMMODE_MOVING && (this.dx !== 0 || this.dy !== 0) && !jump)
				{
					this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnMove, this.inst);
					this.animMode = ANIMMODE_MOVING;
				}
			}
		}
		if (this.fallthrough > 0)
			this.fallthrough--;
		this.wasOverJumpthru = this.runtime.testOverlapJumpThru(this.inst);
	};
	function Cnds() {};
	Cnds.prototype.IsMoving = function ()
	{
		return this.dx !== 0 || this.dy !== 0;
	};
	Cnds.prototype.CompareSpeed = function (cmp, s)
	{
		var speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
		return cr.do_cmp(speed, cmp, s);
	};
	Cnds.prototype.IsOnFloor = function ()
	{
		if (this.dy !== 0)
			return false;
		var ret = null;
		var ret2 = null;
		var i, len, j;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		ret = this.runtime.testOverlapSolid(this.inst);
		if (!ret && this.fallthrough === 0)
			ret2 = this.runtime.testOverlapJumpThru(this.inst, true);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		if (ret)		// was overlapping solid
		{
			return !this.runtime.testOverlap(this.inst, ret);
		}
		if (ret2 && ret2.length)
		{
			for (i = 0, j = 0, len = ret2.length; i < len; i++)
			{
				ret2[j] = ret2[i];
				if (!this.runtime.testOverlap(this.inst, ret2[i]))
					j++;
			}
			if (j >= 1)
				return true;
		}
		return false;
	};
	Cnds.prototype.IsByWall = function (side)
	{
		var ret = false;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		if (side === 0)		// left
		{
			this.inst.x -= this.rightx * 2;
			this.inst.y -= this.righty * 2;
		}
		else
		{
			this.inst.x += this.rightx * 2;
			this.inst.y += this.righty * 2;
		}
		this.inst.set_bbox_changed();
		if (!this.runtime.testOverlapSolid(this.inst))
		{
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			return false;
		}
		this.inst.x -= this.downx * 3;
		this.inst.y -= this.downy * 3;
		this.inst.set_bbox_changed();
		ret = this.runtime.testOverlapSolid(this.inst);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		return ret;
	};
	Cnds.prototype.IsJumping = function ()
	{
		return this.dy < 0;
	};
	Cnds.prototype.IsFalling = function ()
	{
		return this.dy > 0;
	};
	Cnds.prototype.OnJump = function ()
	{
		return true;
	};
	Cnds.prototype.OnFall = function ()
	{
		return true;
	};
	Cnds.prototype.OnStop = function ()
	{
		return true;
	};
	Cnds.prototype.OnMove = function ()
	{
		return true;
	};
	Cnds.prototype.OnLand = function ()
	{
		return true;
	};
	Cnds.prototype.IsDoubleJumpEnabled = function ()
	{
		return this.enableDoubleJump;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetIgnoreInput = function (ignoring)
	{
		this.ignoreInput = ignoring;
	};
	Acts.prototype.SetMaxSpeed = function (maxspeed)
	{
		this.maxspeed = maxspeed;
		if (this.maxspeed < 0)
			this.maxspeed = 0;
	};
	Acts.prototype.SetAcceleration = function (acc)
	{
		this.acc = acc;
		if (this.acc < 0)
			this.acc = 0;
	};
	Acts.prototype.SetDeceleration = function (dec)
	{
		this.dec = dec;
		if (this.dec < 0)
			this.dec = 0;
	};
	Acts.prototype.SetJumpStrength = function (js)
	{
		this.jumpStrength = js;
		if (this.jumpStrength < 0)
			this.jumpStrength = 0;
	};
	Acts.prototype.SetGravity = function (grav)
	{
		if (this.g1 === grav)
			return;		// no change
		this.g = grav;
		this.updateGravity();
		if (this.runtime.testOverlapSolid(this.inst))
		{
			this.runtime.pushOutSolid(this.inst, this.downx, this.downy, 10);
			this.inst.x += this.downx * 2;
			this.inst.y += this.downy * 2;
			this.inst.set_bbox_changed();
		}
		this.lastFloorObject = null;
	};
	Acts.prototype.SetMaxFallSpeed = function (mfs)
	{
		this.maxFall = mfs;
		if (this.maxFall < 0)
			this.maxFall = 0;
	};
	Acts.prototype.SimulateControl = function (ctrl)
	{
		switch (ctrl) {
		case 0:		this.simleft = true;	break;
		case 1:		this.simright = true;	break;
		case 2:		this.simjump = true;	break;
		}
	};
	Acts.prototype.SetVectorX = function (vx)
	{
		this.dx = vx;
	};
	Acts.prototype.SetVectorY = function (vy)
	{
		this.dy = vy;
	};
	Acts.prototype.SetGravityAngle = function (a)
	{
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (this.ga === a)
			return;		// no change
		this.ga = a;
		this.updateGravity();
		this.lastFloorObject = null;
	};
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.enabled !== (en === 1))
		{
			this.enabled = (en === 1);
			if (!this.enabled)
				this.lastFloorObject = null;
		}
	};
	Acts.prototype.FallThrough = function ()
	{
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		var overlaps = this.runtime.testOverlapJumpThru(this.inst, false);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		if (!overlaps)
			return;
		this.fallthrough = 3;			// disable jumpthrus for 3 ticks (1 doesn't do it, 2 does, 3 to be on safe side)
		this.lastFloorObject = null;
	};
	Acts.prototype.SetDoubleJumpEnabled = function (e)
	{
		this.enableDoubleJump = (e !== 0);
	};
	Acts.prototype.SetJumpSustain = function (s)
	{
		this.jumpSustain = s / 1000;		// convert to ms
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(Math.sqrt(this.dx * this.dx + this.dy * this.dy));
	};
	Exps.prototype.MaxSpeed = function (ret)
	{
		ret.set_float(this.maxspeed);
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Deceleration = function (ret)
	{
		ret.set_float(this.dec);
	};
	Exps.prototype.JumpStrength = function (ret)
	{
		ret.set_float(this.jumpStrength);
	};
	Exps.prototype.Gravity = function (ret)
	{
		ret.set_float(this.g);
	};
	Exps.prototype.GravityAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.ga));
	};
	Exps.prototype.MaxFallSpeed = function (ret)
	{
		ret.set_float(this.maxFall);
	};
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(Math.atan2(this.dy, this.dx)));
	};
	Exps.prototype.VectorX = function (ret)
	{
		ret.set_float(this.dx);
	};
	Exps.prototype.VectorY = function (ret)
	{
		ret.set_float(this.dy);
	};
	Exps.prototype.JumpSustain = function (ret)
	{
		ret.set_float(this.jumpSustain * 1000);		// convert back to ms
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Rex_bNickname = function (runtime) {
	this.runtime = runtime;
};
(function () {
	var behaviorProto = cr.behaviors.Rex_bNickname.prototype;
	behaviorProto.Type = function (behavior, objtype) {
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function () {};
	behaviorProto.Instance = function (type, inst) {
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function () {
		this.setNickname(this.properties[0], this.properties[1]);
	};
	behinstProto.tick = function () {};
	behinstProto.setNickname = function (name, m) {
		var nicknameObj = window.RexC2NicknameObj;
		if (nicknameObj == null)
			return;
		var nickname = (m == 1) ? this.inst.type.sid.toString() : name;
		var savedNickname = nicknameObj.sid2nickname[this.inst.type.sid.toString()]; // try to get nickname from nickname plugin
		if (nickname == "") {
			this.nickname = savedNickname || "";
		} else {
			this.nickname = nickname;
			if (nickname !== savedNickname) {
				nicknameObj.AddNickname(nickname, this.inst.type);
			}
		}
	};
	function Cnds() {};
	behaviorProto.cnds = new Cnds();
	Cnds.prototype.IsNicknameMatched = function (name) {
		return (this.nickname === name);
	};
	function Acts() {};
	behaviorProto.acts = new Acts();
	function Exps() {};
	behaviorProto.exps = new Exps();
	Exps.prototype.Nickname = function (ret) {
		ret.set_any(this.nickname);
	};
}());
;
;
cr.behaviors.Textbox_Plus = function(runtime) {
	this.runtime = runtime;
};
(function () {
	var behaviorProto = cr.behaviors.Textbox_Plus.prototype;
	behaviorProto.Type = function(behavior, objtype) {
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function() {};
	behaviorProto.Instance = function(type, inst)
	{
		this.inst = inst;
		this.type = type;
		this.behavior = type.behavior;
		this.runtime = type.runtime;
		this.trigger_once = true;
		this.autoFontSize = 0;
		this.class = "";
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function() {};
	behinstProto.Style = function() {
		var textbox = this.inst;
		this.inst.elem.addEventListener("focus", function (e) {
			setTimeout(function() {
				e.stopPropagation();
				textbox.runtime.trigger(cr.behaviors.Textbox_Plus.prototype.cnds.OnFocus, textbox);
			}, 0);
		}, false);
		this.inst.elem.addEventListener("blur", function (e) {
    		setTimeout(function() {
        		e.stopPropagation();
				textbox.runtime.trigger(cr.behaviors.Textbox_Plus.prototype.cnds.OnBlur, textbox);
    		}, 0);
		}, false);
		this.inst.elem.maxLength = this.properties[14] > 0 ? this.properties[14] : 1000000;
		this.inst.elem.style.textAlign = ["left","center","right"][this.properties[5]];
		this.inst.elem.style.background = this.properties[7] ? this.properties[17] : "none";
		this.inst.elem.style.border = this.properties[8] ? this.properties[18] : "none";
		this.inst.elem.style.textDecoration = ["no","underline","line-through","overline"][this.properties[11]];
		this.inst.elem.style.textTransform = ["no","capitalize","lowercase","uppercase"][this.properties[13]];
		this.inst.elem.style.borderRadius = (this.properties[19]);
		this.inst.elem.style.outline = (this.properties[20]);
		this.inst.elem.style.padding = (this.properties[21]);
		this.inst.elem.style.textShadow = (this.properties[22]);
		this.inst.elem.style.boxShadow = (this.properties[23]);
		var loop = this.properties[0].split(" ");
		for (var i = 0; i < loop.length; i++) {
			if (!this.class.match(loop[i]))
				this.class += (this.class.length) ? " "+loop[i] : loop[i];
		};
		this.inst.elem.setAttribute("class", this.class);
		var r = (this.properties[4])&0xFF;
		var g = (this.properties[4]>>8)&0xFF;
		var b = (this.properties[4]>>16)&0xFF;
		this.inst.elem.style.color = "rgb("+r+","+g+","+b+")";
		if(!this.properties[10]) {
			this.inst.elem.disabled = true;
			$(this.inst.elem).css("user-select", "none");
			$(this.inst.elem).css("cursor", "default");
		};
		if (!this.properties[9]) {
			this.inst.elem.disabled = false;
			$(this.inst.elem).bind("contextmenu", function(event) { event.preventDefault(); return false; });
		};
		if(this.properties[12])
			this.inst.elem.setAttribute("onkeypress", "return cr.behaviors.Textbox_Plus.prototype.fncs.OnKey(this, event, "+this.properties[12]+", '"+this.properties[24]+"')");
		if(this.inst.elem.type === "textarea") {
			var vertical = [0,2,1.01][this.properties[6]];
			if(vertical) {
				var height = this.inst.elem.offsetHeight;
				this.inst.elem.style.height = 0;
				var padding = Math.max(0, height/vertical - this.inst.elem.scrollHeight/vertical);
				this.inst.elem.style.paddingTop = padding +"px";
				this.inst.elem.style.height = height - padding +"px";
			};
		};
		if (this.properties[15])
		{
			var webfont = document.createElement("link");
			webfont.href = this.properties[15];
			webfont.rel = "stylesheet";
			webfont.type = "text/css";
			if (typeof webfont != "undefined") {
				document.getElementsByTagName("head")[0].appendChild(webfont);
				this.inst.elem.style.fontFamily = this.properties[16] || "PlayLive";
			};
		} else {
			this.inst.elem.style.fontFamily = this.properties[2] || "Arial";
			this.inst.elem.style.fontWeight = this.properties[3] == 1 || this.properties[3] == 3 ? "bold" : "none";
			this.inst.elem.style.fontStyle = this.properties[3] > 1 ? "italic" : "none";
		};
		switch(this.properties[1]) {
			case 0:
				this.autoFontSize = -1;
				break;
			case 1:
				this.autoFontSize = 0.2;
				break;
			case 2:
				this.autoFontSize = 0.4;
				break;
			case 3:
				this.autoFontSize = 0.1;
				break;
			case 4:
				this.autoFontSize = 0;
				break;
			case 5:
				this.autoFontSize = 0.5;
				break;
		};
		this.updatePosition();
	};
	behinstProto.onDestroy = function () {};
	behinstProto.saveToJSON = function () { return {}; };
	behinstProto.loadFromJSON = function (get) {};
	behinstProto.tick = function () {
		var dt = this.runtime.getDt(this.inst);
		if (this.trigger_once) {
			this.trigger_once = false;
			this.Style();
		};
	};
	behinstProto.updatePosition = function () {
		if (this.autoFontSize == 0.5)
			jQuery(this.inst.elem).css("font-size", ((this.inst.layer.getScale(true) / this.runtime.devicePixelRatio) + this.autoFontSize) + "em");
		else if (this.autoFontSize != -1)
			jQuery(this.inst.elem).css("font-size", ((this.inst.layer.getScale(true) / this.runtime.devicePixelRatio) - this.autoFontSize) + "em");
	};
	function Fncs() {};
	Fncs.prototype.OnKey = function (obj, evt, type, dictionary) {
		var key = (evt.which) ? evt.which : evt.keyCode;
		var custom = (dictionary.indexOf(String.fromCharCode(key)) != -1) || (key == 13 && dictionary.indexOf("  ") != -1) ? true : false;
		if(type == 1) {
			if(custom || key > 64 && key < 91 || key > 96 && key < 123)
				return true;
			else
				return false;
		};
		if(type == 2) {
		    if(custom || key > 47 && key < 58)
		    	return true;
			else
				return false;
		};
		if(type == 3) {
		    if(custom || key > 47 && key < 58 || key > 64 && key < 91 || key > 96 && key < 123)
		    	return true;
			else
				return false;
		};
		if(type == 4) {
			if(custom)
		    	return true;
			else
				return false;
		};
	};
	behaviorProto.fncs = new Fncs();
	function Cnds() {};
	Cnds.prototype.OnFocus = function () {
		return true;
	};
	Cnds.prototype.OnBlur = function () {
		return true;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.AddClass = function (class_) {
		if (this.runtime.isDomFree)
			return false;
		var loop = class_.split(" ");
		for (var i = 0; i < loop.length; i++) {
			if (!this.class.match(loop[i]))
				this.class += (this.class.length) ? " "+loop[i] : loop[i];
		};
		this.inst.elem.setAttribute("class", this.class);
	};
	Acts.prototype.RemClass = function (class_) {
		if (this.runtime.isDomFree)
			return false;
		var loop = class_.split(" ");
		for (var i = 0; i < loop.length; i++) {
			this.class = this.class.replace(loop[i], "").replace("  ", " ").trim();
		};
		this.inst.elem.setAttribute("class", this.class);
	};
	Acts.prototype.AppendText = function (text_) {
		if (this.runtime.isDomFree)
			return false;
		this.inst.elem.value += text_;
		this.inst.runtime.trigger(cr.plugins_.TextBox.prototype.cnds.OnTextChanged, this.inst);
	};
/*
	Acts.prototype.ContextMenu = function (enable_) {
		if (this.runtime.isDomFree)
			return false;
		enable_ = (enable_ == 1);
		$(this.inst.elem).bind("contextmenu", function(e) { return enable_; });
	};
*/
	Acts.prototype.Selectable = function (selectable_)
	{
		if (this.runtime.isDomFree)
			return;
		this.inst.elem.disabled = selectable_ ? false : true;
		$(this.frame).css("user-select", selectable_ ? "auto" : "none");
		$(this.frame).css("cursor", selectable_ ? "auto" : "default");
	};
	Acts.prototype.SelectAll = function ()
	{
		if (this.runtime.isDomFree)
			return;
        this.inst.elem.select();
	};
	Acts.prototype.ScrollTop = function ()
	{
		if (this.runtime.isDomFree)
			return;
        this.inst.elem.scrollTop = 0;
	};
	Acts.prototype.ScrollBottom = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.inst.elem.scrollTop = this.elem.scrollHeight;
	};
	Acts.prototype.ScrollTo = function (to_) {
		if (this.runtime.isDomFree)
			return;
		to_ /= 100;
		this.frame.scrollTop = this.frame.scrollHeight;
		this.frame.scrollTop *= to_;
	};
	Acts.prototype.ScrollToPosition = function (to_) {
		if (this.runtime.isDomFree)
			return;
		this.frame.scrollTop = to_;
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ID = function (ret) {
		ret.set_string(this.inst.elem.id);
	};
	Exps.prototype.Class = function (ret) {
		ret.set_string(this.class);
	};
	Exps.prototype.ScrollHeight = function (ret)
	{
		ret.set_float(this.inst.elem.scrollHeight);
	};
	Exps.prototype.ScrollPosition = function (ret)
	{
		ret.set_float(this.inst.elem.scrollTop);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.scrollto = function(runtime)
{
	this.runtime = runtime;
	this.shakeMag = 0;
	this.shakeStart = 0;
	this.shakeEnd = 0;
	this.shakeMode = 0;
};
(function ()
{
	var behaviorProto = cr.behaviors.scrollto.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.enabled = (this.properties[0] !== 0);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"smg": this.behavior.shakeMag,
			"ss": this.behavior.shakeStart,
			"se": this.behavior.shakeEnd,
			"smd": this.behavior.shakeMode
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.behavior.shakeMag = o["smg"];
		this.behavior.shakeStart = o["ss"];
		this.behavior.shakeEnd = o["se"];
		this.behavior.shakeMode = o["smd"];
	};
	behinstProto.tick = function ()
	{
	};
	function getScrollToBehavior(inst)
	{
		var i, len, binst;
		for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
		{
			binst = inst.behavior_insts[i];
			if (binst.behavior instanceof cr.behaviors.scrollto)
				return binst;
		}
		return null;
	};
	behinstProto.tick2 = function ()
	{
		if (!this.enabled)
			return;
		var all = this.behavior.my_instances.valuesRef();
		var sumx = 0, sumy = 0;
		var i, len, binst, count = 0;
		for (i = 0, len = all.length; i < len; i++)
		{
			binst = getScrollToBehavior(all[i]);
			if (!binst || !binst.enabled)
				continue;
			sumx += all[i].x;
			sumy += all[i].y;
			++count;
		}
		var layout = this.inst.layer.layout;
		var now = this.runtime.kahanTime.sum;
		var offx = 0, offy = 0;
		if (now >= this.behavior.shakeStart && now < this.behavior.shakeEnd)
		{
			var mag = this.behavior.shakeMag * Math.min(this.runtime.timescale, 1);
			if (this.behavior.shakeMode === 0)
				mag *= 1 - (now - this.behavior.shakeStart) / (this.behavior.shakeEnd - this.behavior.shakeStart);
			var a = Math.random() * Math.PI * 2;
			var d = Math.random() * mag;
			offx = Math.cos(a) * d;
			offy = Math.sin(a) * d;
		}
		layout.scrollToX(sumx / count + offx);
		layout.scrollToY(sumy / count + offy);
	};
	function Acts() {};
	Acts.prototype.Shake = function (mag, dur, mode)
	{
		this.behavior.shakeMag = mag;
		this.behavior.shakeStart = this.runtime.kahanTime.sum;
		this.behavior.shakeEnd = this.behavior.shakeStart + dur;
		this.behavior.shakeMode = mode;
	};
	Acts.prototype.SetEnabled = function (e)
	{
		this.enabled = (e !== 0);
	};
	behaviorProto.acts = new Acts();
}());
;
;
cr.behaviors.solid = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.solid.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.inst.extra["solidEnabled"] = (this.properties[0] !== 0);
	};
	behinstProto.tick = function ()
	{
	};
	function Cnds() {};
	Cnds.prototype.IsEnabled = function ()
	{
		return this.inst.extra["solidEnabled"];
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEnabled = function (e)
	{
		this.inst.extra["solidEnabled"] = !!e;
	};
	behaviorProto.acts = new Acts();
}());
cr.getObjectRefTable = function () { return [
	cr.plugins_.NinePatch,
	cr.plugins_.CBhash,
	cr.plugins_.AJAX,
	cr.plugins_.Arr,
	cr.plugins_.Browser,
	cr.plugins_.Dictionary,
	cr.plugins_.Function,
	cr.plugins_.Keyboard,
	cr.plugins_.List,
	cr.plugins_.Mouse,
	cr.plugins_.JSON,
	cr.plugins_.Text,
	cr.plugins_.Rex_Firebase,
	cr.plugins_.Rex_GoogleWebFontLoader,
	cr.plugins_.AlertBlocker,
	cr.plugins_.Rex_FirebaseAPIV3,
	cr.plugins_.Touch,
	cr.plugins_.Particles,
	cr.plugins_.Sprite,
	cr.plugins_.Rex_Nickname,
	cr.plugins_.TiledBg,
	cr.plugins_.Rex_Firebase_ItemTable,
	cr.plugins_.Photon,
	cr.plugins_.TextBox,
	cr.behaviors.Pin,
	cr.behaviors.scrollto,
	cr.behaviors.solid,
	cr.behaviors.Textbox_Plus,
	cr.behaviors.Platform,
	cr.behaviors.Rex_bNickname,
	cr.behaviors.Fade,
	cr.system_object.prototype.cnds.OnLayoutStart,
	cr.plugins_.Rex_Firebase.prototype.acts.RemoveReadingCallback,
	cr.system_object.prototype.acts.Wait,
	cr.plugins_.Rex_Firebase.prototype.acts.AddReadingCallback,
	cr.plugins_.Rex_Firebase.prototype.cnds.OnReading,
	cr.plugins_.JSON.prototype.acts.LoadJSON,
	cr.plugins_.Rex_Firebase.prototype.exps.LastData,
	cr.plugins_.Rex_Nickname.prototype.acts.CreateInst,
	cr.plugins_.JSON.prototype.exps.Value,
	cr.plugins_.Sprite.prototype.acts.SetInstanceVar,
	cr.plugins_.Rex_Firebase.prototype.exps.LastKey,
	cr.plugins_.Dictionary.prototype.acts.AddKey,
	cr.plugins_.Sprite.prototype.exps.UID,
	cr.plugins_.JSON.prototype.acts.Clear,
	cr.plugins_.Touch.prototype.cnds.OnTapGestureObject,
	cr.system_object.prototype.cnds.CompareVar,
	cr.plugins_.Sprite.prototype.cnds.IsVisible,
	cr.plugins_.Sprite.prototype.cnds.CompareInstanceVar,
	cr.system_object.prototype.acts.SetVar,
	cr.plugins_.Sprite.prototype.acts.SetOpacity,
	cr.plugins_.Touch.prototype.cnds.OnTapGesture,
	cr.system_object.prototype.cnds.Compare,
	cr.plugins_.Rex_Firebase_ItemTable.prototype.exps.At,
	cr.plugins_.JSON.prototype.acts.NewObject,
	cr.plugins_.JSON.prototype.acts.SetValue,
	cr.system_object.prototype.exps.round,
	cr.plugins_.Touch.prototype.exps.X,
	cr.plugins_.Touch.prototype.exps.Y,
	cr.plugins_.Rex_Firebase.prototype.acts.PushJSON,
	cr.plugins_.JSON.prototype.exps.AsJson,
	cr.plugins_.Rex_Firebase_ItemTable.prototype.acts.LoadAllItems,
	cr.plugins_.Mouse.prototype.acts.SetCursor,
	cr.plugins_.Sprite.prototype.cnds.CompareOpacity,
	cr.system_object.prototype.cnds.EveryTick,
	cr.plugins_.Sprite.prototype.acts.SetPos,
	cr.plugins_.Mouse.prototype.exps.X,
	cr.plugins_.Mouse.prototype.exps.Y,
	cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnLoadComplete,
	cr.plugins_.Rex_Firebase_ItemTable.prototype.acts.SetValue,
	cr.plugins_.Rex_Firebase_ItemTable.prototype.acts.Save,
	cr.plugins_.Sprite.prototype.acts.Destroy,
	cr.system_object.prototype.cnds.IsGroupActive,
	cr.plugins_.Touch.prototype.cnds.IsTouchingObject,
	cr.plugins_.Function.prototype.acts.CallFunction,
	cr.system_object.prototype.acts.CreateObject,
	cr.plugins_.Sprite.prototype.exps.X,
	cr.plugins_.Sprite.prototype.exps.Y,
	cr.plugins_.Sprite.prototype.cnds.PickByUID,
	cr.plugins_.Dictionary.prototype.exps.Get,
	cr.plugins_.Dictionary.prototype.acts.DeleteKey,
	cr.behaviors.Fade.prototype.acts.StartFade,
	cr.plugins_.Function.prototype.cnds.OnFunction,
	cr.plugins_.Function.prototype.exps.Param,
	cr.plugins_.Rex_Firebase.prototype.acts.Remove,
	cr.system_object.prototype.exps.floor,
	cr.system_object.prototype.exps.random,
	cr.behaviors.Rex_bNickname.prototype.cnds.IsNicknameMatched,
	cr.system_object.prototype.exps["int"],
	cr.plugins_.Rex_Firebase_ItemTable.prototype.acts.AddLoadRequestItemID,
	cr.plugins_.Rex_Firebase_ItemTable.prototype.acts.LoadItems,
	cr.system_object.prototype.cnds.For,
	cr.system_object.prototype.exps.loopindex,
	cr.behaviors.Rex_bNickname.prototype.exps.Nickname,
	cr.system_object.prototype.acts.StopLoop,
	cr.plugins_.Text.prototype.acts.SetText,
	cr.plugins_.Rex_Firebase_ItemTable.prototype.cnds.OnSaveComplete,
	cr.plugins_.Mouse.prototype.cnds.IsOverObject,
	cr.plugins_.Text.prototype.cnds.CompareInstanceVar,
	cr.plugins_.Text.prototype.acts.SetFontColor,
	cr.system_object.prototype.exps.rgb,
	cr.system_object.prototype.acts.SetGroupActive,
	cr.plugins_.Text.prototype.acts.SetVisible,
	cr.plugins_.Sprite.prototype.acts.SetVisible,
	cr.system_object.prototype.exps.str,
	cr.plugins_.Text.prototype.acts.MoveToTop,
	cr.plugins_.Text.prototype.acts.SetPos,
	cr.plugins_.Mouse.prototype.exps.AbsoluteX,
	cr.plugins_.Mouse.prototype.exps.AbsoluteY,
	cr.system_object.prototype.exps.newline,
	cr.plugins_.Text.prototype.cnds.IsVisible,
	cr.plugins_.Arr.prototype.acts.SetX,
	cr.plugins_.Text.prototype.acts.AppendText,
	cr.plugins_.Arr.prototype.exps.At,
	cr.plugins_.Photon.prototype.cnds.onEvent,
	cr.plugins_.Photon.prototype.exps.ActorNr,
	cr.plugins_.Arr.prototype.acts.Push,
	cr.plugins_.Photon.prototype.exps.EventData,
	cr.plugins_.Text.prototype.acts.SetInstanceVar,
	cr.plugins_.TextBox.prototype.cnds.CompareText,
	cr.system_object.prototype.exps.len,
	cr.plugins_.TextBox.prototype.exps.Text,
	cr.plugins_.Photon.prototype.acts.raiseEvent,
	cr.plugins_.TextBox.prototype.acts.SetText,
	cr.plugins_.TextBox.prototype.acts.SetVisible,
	cr.plugins_.Text.prototype.acts.AddInstanceVar,
	cr.plugins_.Text.prototype.acts.SubInstanceVar,
	cr.system_object.prototype.exps.clamp,
	cr.plugins_.Arr.prototype.exps.Width,
	cr.plugins_.Function.prototype.acts.SetReturnValue,
	cr.system_object.prototype.exps.projectversion,
	cr.plugins_.TextBox.prototype.acts.SetCSSStyle,
	cr.plugins_.NinePatch.prototype.acts.Destroy,
	cr.plugins_.Text.prototype.acts.Destroy,
	cr.plugins_.Rex_Firebase.prototype.acts.GoOnline,
	cr.plugins_.Photon.prototype.acts.connect,
	cr.plugins_.Rex_Firebase.prototype.cnds.OnConnected,
	cr.system_object.prototype.cnds.LayerVisible,
	cr.plugins_.Browser.prototype.acts.ConsoleLog,
	cr.system_object.prototype.acts.SetLayerVisible,
	cr.plugins_.Text.prototype.acts.SetFontFace,
	cr.plugins_.AJAX.prototype.cnds.OnError,
	cr.plugins_.AJAX.prototype.cnds.OnComplete,
	cr.plugins_.AJAX.prototype.exps.LastData,
	cr.system_object.prototype.exps.lowercase,
	cr.plugins_.AJAX.prototype.acts.Request,
	cr.behaviors.Textbox_Plus.prototype.cnds.OnFocus,
	cr.plugins_.CBhash.prototype.exps.SHA1,
	cr.plugins_.Photon.prototype.acts.setMyActorName,
	cr.plugins_.Rex_Firebase_ItemTable.prototype.acts.SetDomainRef,
	cr.plugins_.TextBox.prototype.acts.SetEnabled,
	cr.plugins_.Photon.prototype.acts.disconnect,
	cr.system_object.prototype.acts.GoToLayout,
	cr.plugins_.Touch.prototype.cnds.OnTouchObject,
	cr.plugins_.Photon.prototype.exps.RoomNameAt,
	cr.plugins_.Photon.prototype.cnds.onJoinedLobby,
	cr.plugins_.Photon.prototype.acts.requestLobbyStats,
	cr.plugins_.Photon.prototype.cnds.onLobbyStats,
	cr.plugins_.Photon.prototype.exps.RoomCount,
	cr.plugins_.Photon.prototype.exps.RoomPlayerCount,
	cr.plugins_.NinePatch.prototype.acts.SetInstanceVar,
	cr.plugins_.Text.prototype.cnds.CompareText,
	cr.plugins_.Rex_GoogleWebFontLoader.prototype.acts.AddGoogleFont,
	cr.plugins_.Rex_GoogleWebFontLoader.prototype.acts.Load,
	cr.plugins_.Rex_GoogleWebFontLoader.prototype.cnds.OnActive,
	cr.plugins_.Photon.prototype.acts.joinRoom,
	cr.plugins_.Photon.prototype.cnds.onJoinRoom,
	cr.plugins_.Photon.prototype.cnds.onActorLeave,
	cr.system_object.prototype.cnds.PickByComparison,
	cr.behaviors.Pin.prototype.exps.PinnedUID,
	cr.plugins_.Photon.prototype.exps.MyActorNr,
	cr.plugins_.Sprite.prototype.exps.AnimationName,
	cr.plugins_.Sprite.prototype.exps.AnimationFrame,
	cr.system_object.prototype.exps.tokenat,
	cr.behaviors.Platform.prototype.acts.SetEnabled,
	cr.behaviors.scrollto.prototype.acts.SetEnabled,
	cr.plugins_.Sprite.prototype.cnds.OnCreated,
	cr.plugins_.Sprite.prototype.acts.Spawn,
	cr.plugins_.Photon.prototype.exps.ActorNameByNr,
	cr.behaviors.Pin.prototype.acts.Pin,
	cr.plugins_.Touch.prototype.cnds.OnDoubleTapGestureObject,
	cr.plugins_.Photon.prototype.cnds.onActorJoin,
	cr.plugins_.Keyboard.prototype.cnds.IsKeyDown,
	cr.plugins_.Keyboard.prototype.cnds.OnKey,
	cr.behaviors.Platform.prototype.cnds.IsOnFloor,
	cr.behaviors.Platform.prototype.acts.SetVectorY,
	cr.behaviors.Platform.prototype.exps.VectorY,
	cr.behaviors.Platform.prototype.acts.SimulateControl,
	cr.plugins_.Sprite.prototype.acts.SetAngle,
	cr.system_object.prototype.cnds.IsOnPlatform,
	cr.system_object.prototype.cnds.Every,
	cr.plugins_.Sprite.prototype.cnds.OnCollision,
	cr.plugins_.Sprite.prototype.acts.AddInstanceVar,
	cr.behaviors.scrollto.prototype.acts.Shake,
	cr.system_object.prototype.cnds.ForEach,
	cr.plugins_.Sprite.prototype.cnds.IsOutsideLayout
];};
