//----------------------------------------------------------------------------------------------------
//	1.Core/Utils.js
//----------------------------------------------------------------------------------------------------

//alert("1.Core/Utils.js");

//----------------------------------------------------------------------------------------------------
//	constants.
//----------------------------------------------------------------------------------------------------
kNavigator = navigator.userAgent.toLowerCase();
kIsFF = /firefox/.test(kNavigator);
kIsOpera = /opera/.test(kNavigator);
kIsChrome = /chrome/.test(kNavigator);
kIsWebKit = /webkit/.test(kNavigator);
kIsSafari = !kIsChrome && /safari/.test(kNavigator);
kIsIE = !kIsOpera && /msie/.test(kNavigator);
kIsIE7 = kIsIE && /msie 7/.test(kNavigator);
kIsIE8 = kIsIE && /msie 8/.test(kNavigator);
kIsIE6 = kIsIE && !kIsIE7 && !kIsIE8;
kIsGecko = !kIsWebKit && /gecko/.test(kNavigator);
kIsDOM2 = kIsGecko | kIsChrome;
kIsSecure = /^https/i.test(window.location.protocol);
kIsWindows = /windows|win32/.test(kNavigator);
kIsMac = /macintosh|mac os x/.test(kNavigator);
kIsLinux = /linux/.test(kNavigator);

//----------------------------------------------------------------------------------------------------
//	output debug message.
//----------------------------------------------------------------------------------------------------
fDbg =
function(									//	(void)
	s										//	(string) debug string
)
{
	if (fDbg.xDbg === undefined)
	{
		fDbg.xDbg = document.getElementById("xDbg");
		if ((fDbg.xDbg != null) && (fDbg.xDbg.getElementsByTagName("EMBED").length > 0))
			fDbg.xDbg = fDbg.xDbg.getElementsByTagName("EMBED")[0];
	}

	if (fDbg.xDbg == null)
		return;

	s = window.location.pathname.toString().split("/").pop() + " " + s;

	if (fDbg.xReady === undefined)
	{
		if (arguments.length > 0)
		{
			if (fDbg.xList === undefined)
				fDbg.xList = [];
			fDbg.xList.push(s);
			return;
		}
		fDbg.xReady = true;
	}

	if (fDbg.xList !== undefined)
	{
		while (fDbg.xList.length > 0)
			fDbg.xDbg.trace(fDbg.xList.shift());
		delete fDbg.xList;
	}

	if (arguments.length > 0)
		fDbg.xDbg.trace(s);
}

//----------------------------------------------------------------------------------------------------
//	throw error message.
//----------------------------------------------------------------------------------------------------
fErr =
function(									//	(void)
	vErrStr									//	(string) error string
)
{
	fDbg("ERROR " + vErrStr);
	throw vErrStr;
}

//----------------------------------------------------------------------------------------------------
//	return string dump of value.
//----------------------------------------------------------------------------------------------------
fDump =
function(									//	(string)
	v,										//	(*) value
	vIndent									//	(string) indentation
)
{
	var s, i, p, pa;

	if (vIndent === undefined)
		vIndent = "";

	if (v === undefined)
		return "undefined";

	if (v === null)
		return "null";

	if (typeof(v) == "string")
		return "\"" + v.split("\\").join("\\\\").split("\n").join("\\n") + "\"";

	if (typeof(v) == "function")
	{
		s = v.toString();
		s = s.substr(s.indexOf(" ") + 1);
		return s.substr(0, s.indexOf("(")) + "()";
	}

	if (v instanceof Array)
	{
		s = "[\n";
		if (v.length > 0)
		{
			for (i = 0; i < v.length - 1; i++)
				s += vIndent + "  " + fDump(v[i], vIndent + "  ") + ",\n";
			s += vIndent + "  " + fDump(v[i], vIndent + "  ") + "\n";
		}
		s += vIndent + "]";
		return s;
	}

	if (typeof(v) == "object")
	{
		if (v.tagName !== undefined)
			return "<" + v.tagName + ((v.id != "") ? ("#" + v.id) : "") +
				((v.className != "") ? ("." + v.className) : "") + ">";

		if ((v.x !== undefined) && (v.y !== undefined))
			return "(" + v.x + "," + v.y + ")";

		if ((v.width !== undefined) && (v.height !== undefined))
			return "(" + v.width + "," + v.height + ")";

		pa = [];
		for (p in v)
			pa.push(p);

		s = "{\n";
		if (pa.length > 0)
		{
			for (i = 0; i < pa.length - 1; i++)
				s += vIndent + "  " + pa[i] + ": " + fDump(v[pa[i]], vIndent + "  ") + ",\n";
			s += vIndent + "  " + pa[i] + ": " + fDump(v[pa[i]], vIndent + "  ") + "\n";
		}
		s += vIndent + "}";
		return s;
	}

	return v;
}

//----------------------------------------------------------------------------------------------------
//	whether is set.
//----------------------------------------------------------------------------------------------------
fIsSet =
function(									//	(boolean)
	v										//	(*)
)
{
	return (v !== undefined);
}

//----------------------------------------------------------------------------------------------------
//	whether undefined.
//----------------------------------------------------------------------------------------------------
fIsUndefined =
function(									//	(boolean)
	v										//	(*)
)
{
	return (v === undefined);
}

//----------------------------------------------------------------------------------------------------
//	whether boolean.
//----------------------------------------------------------------------------------------------------
fIsBoolean =
function(									//	(boolean)
	v										//	(*)
)
{
	return (typeof(v) == "boolean");
}

//----------------------------------------------------------------------------------------------------
//	whether number.
//----------------------------------------------------------------------------------------------------
fIsNumber =
function(									//	(boolean)
	v										//	(*)
)
{
	return (typeof(v) == "number");
}

//----------------------------------------------------------------------------------------------------
//	whether string.
//----------------------------------------------------------------------------------------------------
fIsString =
function(									//	(boolean)
	v										//	(*)
)
{
	return (typeof(v) == "string");
}

//----------------------------------------------------------------------------------------------------
//	whether function.
//----------------------------------------------------------------------------------------------------
fIsFunction =
function(									//	(boolean)
	v										//	(*)
)
{
	return (typeof(v) == "function");
}

//----------------------------------------------------------------------------------------------------
//	whether object.
//----------------------------------------------------------------------------------------------------
fIsObject =
function(									//	(boolean)
	v										//	(*)
)
{
	return ((v != null) && (typeof(v) == "object"));
}

//----------------------------------------------------------------------------------------------------
//	whether array.
//----------------------------------------------------------------------------------------------------
fIsArray =
function(									//	(boolean)
	v										//	(*)
)
{
	return ((v != null) && (typeof(v) == "object") && (Object.prototype.toString.apply(v) ===
		"[object Array]"));
}

//----------------------------------------------------------------------------------------------------
//	whether point. point is of the form {x: <x>, y: <y>}.
//----------------------------------------------------------------------------------------------------
fIsPoint =
function(									//	(boolean)
	v										//	(*)
)
{
	return ((v != null) && (typeof(v) == "object") && (v.x !== undefined) && (v.y !== undefined));
}

//----------------------------------------------------------------------------------------------------
//	whether rect. rect is of the form {x: <x>, y: <y>, w: <w>, h: <h>}.
//----------------------------------------------------------------------------------------------------
fIsRect =
function(									//	(boolean)
	v										//	(*)
)
{
	return ((v != null) && (typeof(v) == "object") && (v.x !== undefined) && (v.y !== undefined) &&
		(v.w !== undefined) && (v.h !== undefined));
}

//----------------------------------------------------------------------------------------------------
//	whether element.
//----------------------------------------------------------------------------------------------------
fIsElement =
function(									//	(boolean)
	v										//	(*)
)
{
	return ((v != null) && (v.nodeType == 1) && (v.tagName !== undefined));
}

//----------------------------------------------------------------------------------------------------
//	whether empty.
//----------------------------------------------------------------------------------------------------
fIsEmpty =
function(									//	(boolean)
	v										//	(*)
)
{
	var p;

	for (p in v)
		return false;
	return true;
}

//----------------------------------------------------------------------------------------------------
//	whether member of array.
//----------------------------------------------------------------------------------------------------
fIsMember =
function(									//	(boolean)
	vArray,									//	(array)
	v										//	(*)
)
{
	if (!fIsArray(vArray)) fErr("fIsMember() invalid vArray: " + vArray);

	var i;
	
	for (i = 0; i < vArray.length; i++)
		if (vArray[i] == v)
			return true;
	return false;
}

//----------------------------------------------------------------------------------------------------
//	whether string has matching prefix.
//----------------------------------------------------------------------------------------------------
fIsPrefix =
function(									//	(boolean)
	vString,								//	(string)
	vPrefix									//	(string)
)
{
	if (!fIsString(vString)) fErr("fIsPrefix() invalid vString: " + vString);

	return (vString.substr(0, vPrefix.length) == vPrefix);
}

//----------------------------------------------------------------------------------------------------
//	get prefix of string (up to "_"); if no "_", return string.
//----------------------------------------------------------------------------------------------------
fGetPrefix =
function(									//	(string)
	vString									//	(string)
)
{
	if (!fIsString(vString)) fErr("fGetPrefix() invalid vString: " + vString);

	var i;
	
	if ((i = vString.indexOf("_")) == -1)
		return vString;
	return vString.substr(0, i);
}

//----------------------------------------------------------------------------------------------------
//	get suffix of string (after "_"); if no "_", return "".
//----------------------------------------------------------------------------------------------------
fGetSuffix =
function(									//	(string)
	vString									//	(string)
)
{
	if (!fIsString(vString)) fErr("fGetSuffix() invalid vString: " + vString);

	var i;
	
	if ((i = vString.indexOf("_")) == -1)
		return "";
	return vString.substr(i + 1);
}

//----------------------------------------------------------------------------------------------------
//	get time in s.
//----------------------------------------------------------------------------------------------------
fGetTime =
function(									//	(int)
)
{
	return parseInt(new Date().getTime() / 1000);
}

//----------------------------------------------------------------------------------------------------
//	extend a function.
//----------------------------------------------------------------------------------------------------
fExtend =
function(									//	(function)
	vSuper,									//	(function) super method
	vSub									//	(function) sub method
)
{
	if (!fIsFunction(vSuper)) fErr("fExtend() invalid vSuper: " + vSuper);
	if (!fIsFunction(vSub)) fErr("fExtend() invalid vSub: " + vSub);

	vSub.xfSuper = vSuper;
	return vSub;
}

//----------------------------------------------------------------------------------------------------
//	call super function.
//----------------------------------------------------------------------------------------------------
fSuper =
function(									//	(*)
	vArguments								//	(arguments)
)
{
	return vArguments.callee.xfSuper.apply(this, vArguments);
}

//----------------------------------------------------------------------------------------------------
//	get element from selector.
//	selectors take the form of:
//		element
//		string: "<tagName>#<Id>.<className>".
//		array: [element, "<tagName>#<Id>.<className>", <row index>, <cell index>, <child index>, ...]
//----------------------------------------------------------------------------------------------------
fGet =
function(									//	(element)
	vSelector,								//	(element/string/array) element selector
	vErrIfMissing							//	(boolean) default true; whether error if missing
)
{
	if (fIsUndefined(vErrIfMissing)) vErrIfMissing = true;
	if (!fIsElement(vSelector) && !fIsString(vSelector) && !fIsArray(vSelector)) fErr("fGet() invalid vSelector: " + vSelector);
	if (!fIsBoolean(vErrIfMissing)) fErr("fGet() invalid vErrIfMissing: " + vErrIfMissing);

	var vElm, vTagName, vClassName, vId, vList, i, j, k, s;

	if (fIsElement(vSelector))
		return vSelector;

	if (fIsString(vSelector))
		vSelector = [vSelector];

	for (vElm = document, i = 0; (vElm != null) && (i < vSelector.length); i++)
		if (fIsElement(vSelector[i]))
			vElm = vSelector[i];
		else if (fIsNumber(vSelector[i]))
			switch (vElm.tagName)
			{
			case "TABLE":
			case "THEAD":
			case "TBODY":
			case "TFOOT":
				vElm = vElm.rows[vSelector[i]];
				break;
			case "TR":
				vElm = vElm.cells[vSelector[i]];
				break;
			default:
				for (j = k = 0; j < vElm.childNodes.length; j++)
					if (fIsElement(vElm.childNodes[j]))
						if (k == vSelector[i])
							break;
						else
							k++;
				vElm = (j < vElm.childNodes.length) ? vElm.childNodes[j] : null;
				break;
			}
		else if (fIsString(vSelector[i]))
		{
			s = vSelector[i].split("#");
			vId = (s.length == 1) ? "" : s[1];
			s = s[0].split(".");
			vClassName = (s.length == 1) ? "" : s[1];
			vTagName = s[0];
			if ((vElm == document) && (vTagName == "") && (vClassName == "") && (vId != ""))
				vElm = document.getElementById(vId);
			else if (((vTagName == "") || (vElm.tagName == vTagName)) && ((vClassName == "") ||
				(vElm.className == vClassName)) && ((vId == "") || (vElm.id == vId)))
				;
			else
			{
				vList = vElm.getElementsByTagName((vTagName == "") ? "*" : vTagName);
				for (j = 0; j < vList.length; j++)
					if (((vTagName == "") || (vList[j].tagName == vTagName)) && ((vClassName == "") ||
					(vList[j].className == vClassName)) && ((vId == "") || (vList[j].id == vId)))
					break;
				vElm = (j < vList.length) ? vList[j] : null;
			}
		}
		else
			vElm = null;

	if ((vElm == null) && vErrIfMissing) fErr("fGet() missing " + vSelector);

	return vElm;
}

//----------------------------------------------------------------------------------------------------
//	get absolute position of element.
//----------------------------------------------------------------------------------------------------
fGetPos =
function(									//	(point)
	vElm									//	(element/string/array) element selector
)
{
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fGetPos() invalid vElm: " + vElm);

	var vParent, x, y;

	vElm = fGet(vElm);

	for (x = y = 0, vParent = vElm; (vParent = vParent.offsetParent) != null; )
	{
		x += vParent.offsetLeft;
		y += vParent.offsetTop;
	}

	return {x: x + vElm.offsetLeft, y: y + vElm.offsetTop};
}

//----------------------------------------------------------------------------------------------------
//	set absolute position of element.
//	if x or y is null, that part is not set.
//----------------------------------------------------------------------------------------------------
fSetPos =
function(									//	(void)
	vElm,									//	(element/string/array) element selector
	vPos									//	(point) new position
)
{
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fSetPos() invalid vElm: " + vElm);
	if (!fIsPoint(vPos)) fErr("fSetPos() invalid vPos: " + vPos);

	var vParent, x, y;

	vElm = fGet(vElm);

	for (x = y = 0, vParent = vElm; (vParent = vParent.offsetParent) != null; )
	{
		x += vParent.offsetLeft;
		y += vParent.offsetTop;
	}

	if (vPos.x != null)
		vElm.style.left = (vPos.x - x)+'px';
	if (vPos.y != null)
		vElm.style.top = (vPos.y - y)+'px';
}

//----------------------------------------------------------------------------------------------------
//	get size of element; includes paddings, borders and scrollbars unless just inside.
//----------------------------------------------------------------------------------------------------
fGetSize =
function(									//	(point)
	vElm,									//	(element/string/array) element selector
	vInside									//	(boolean) default false; whether just inside size
)
{
	if (fIsUndefined(vInside)) vInside = false;
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fGetSize() invalid vElm: " + vElm);
	if (!fIsBoolean(vInside)) fErr("fGetSize() invalid vInside: " + vInside);

	var vStyle, w, h;
	
	vElm = fGet(vElm);

	if (!vInside)
		return {x: vElm.offsetWidth, y: vElm.offsetHeight}

	if (kIsIE)
		w = h = 0;
	else
	{
		vStyle = document.defaultView.getComputedStyle(vElm, null);
		w = parseInt(vStyle.getPropertyValue("margin-left")) +
			((kIsSafari || kIsChrome) ? 0 : parseInt(vStyle.getPropertyValue("margin-right"))) +
			parseInt(vStyle.getPropertyValue("padding-left")) +
			parseInt(vStyle.getPropertyValue("padding-right")) +
			parseInt(vStyle.getPropertyValue("border-left-width")) +
			parseInt(vStyle.getPropertyValue("border-right-width"));
		h = parseInt(vStyle.getPropertyValue("margin-top")) +
			parseInt(vStyle.getPropertyValue("margin-bottom")) +
			parseInt(vStyle.getPropertyValue("padding-top")) +
			parseInt(vStyle.getPropertyValue("padding-bottom")) +
			parseInt(vStyle.getPropertyValue("border-top-width")) +
			parseInt(vStyle.getPropertyValue("border-bottom-width"));
	}

	return {x: vElm.offsetWidth - w, y: vElm.offsetHeight - h};
}

//----------------------------------------------------------------------------------------------------
//	set size of element; includes paddings, borders and margins.
//	if x or y is null, that part is not set.
//	BUG: Safari and Chrome return incorrect margin-right.
//----------------------------------------------------------------------------------------------------
fSetSize =
function(									//	(void)
	vElm,									//	(element/string/array) element selector
	vSize									//	(point) new size
)
{
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fSetSize() invalid vElm: " + vElm);
	if (!fIsPoint(vSize)) fErr("fSetSize() invalid vSize: " + vSize);

	var vStyle, w, h;
	
	vElm = fGet(vElm);

	if (kIsIE)
		w = h = 0;
	else
	{
		vStyle = document.defaultView.getComputedStyle(vElm, null);
		w = parseInt(vStyle.getPropertyValue("margin-left")) +
			((kIsSafari || kIsChrome) ? 0 : parseInt(vStyle.getPropertyValue("margin-right"))) +
			parseInt(vStyle.getPropertyValue("padding-left")) +
			parseInt(vStyle.getPropertyValue("padding-right")) +
			parseInt(vStyle.getPropertyValue("border-left-width")) +
			parseInt(vStyle.getPropertyValue("border-right-width"));
		h = parseInt(vStyle.getPropertyValue("margin-top")) +
			parseInt(vStyle.getPropertyValue("margin-bottom")) +
			parseInt(vStyle.getPropertyValue("padding-top")) +
			parseInt(vStyle.getPropertyValue("padding-bottom")) +
			parseInt(vStyle.getPropertyValue("border-top-width")) +
			parseInt(vStyle.getPropertyValue("border-bottom-width"));
	}
	if ((vSize.x != null) && (vSize.x >= w))
		vElm.style.width = (vSize.x - w) + "px";
	if ((vSize.y != null) && (vSize.y >= h))
		vElm.style.height = (vSize.y - h) + "px";
}

//----------------------------------------------------------------------------------------------------
//	get style property of element.
//	BUG: Safari and Chrome return incorrect margin-right.
//----------------------------------------------------------------------------------------------------
fGetStyle =
function(									//	(*)
	vElm,									//	(element/string/array) element selector
	vProp,									//	(string) css syntax; property to get
	vIsInline								//	(boolean) default false; whether inline style
)
{
	if (fIsUndefined(vIsInline)) vIsInline = false;
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fGetStyle() invalid vElm: " + vElm);
	if (!fIsString(vProp)) fErr("fGetStyle() invalid vProp: " + vProp);
	if (!fIsBoolean(vIsInline)) fErr("fGetStyle() invalid vIsInline: " + vIsInline);

	var vStyle;
	
	vElm = fGet(vElm);

	if (kIsIE)
		switch (vProp)
		{
		case "margin-left": vProp = "marginLeft"; break;
		case "margin-top": vProp = "marginTop"; break;
		case "margin-right": vProp = "marginRight"; break;
		case "margin-bottom": vProp = "marginBottom"; break;
		case "padding-left": vProp = "paddingLeft"; break;
		case "padding-top": vProp = "paddingTop"; break;
		case "padding-right": vProp = "paddingRight"; break;
		case "padding-bottom": vProp = "paddingBottom"; break;
		case "border-left-width": vProp = "borderLeftWidth"; break;
		case "border-top-width": vProp = "borderTopWidth"; break;
		case "border-right-width": vProp = "borderRightWidth"; break;
		case "border-bottom-width": vProp = "borderBottomWidth"; break;
		}
	
	if (vIsInline)
		return vElm.style[vProp];

	if (kIsIE)
		return vElm.currentStyle[vProp];
	vStyle = document.defaultView.getComputedStyle(vElm, null);
	return vStyle.getPropertyValue(vProp);
}

//----------------------------------------------------------------------------------------------------
//	enable or disable input elements, including child elements.
//----------------------------------------------------------------------------------------------------
fEnable =
function(									//	(void)
	vElm,									//	(element/string/array) element selector
	vEnable									//	(boolean) true to enable, false to disable
)
{
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fEnable() invalid vElm: " + vElm);
	if (!fIsBoolean(vEnable)) fErr("fEnable() invalid vEnable: " + vEnable);

	var i;

	vElm = fGet(vElm);

	if ((vElm.tagName == "INPUT") || (vElm.tagName == "SELECT") || (vElm.tagName == "TEXTAREA"))
		vElm.disabled = !vEnable;

	for (i = 0; i < vElm.childNodes.length; i++)
		if (fIsElement(vElm.childNodes[i]))
			fEnable(vElm.childNodes[i], vEnable);
}

//----------------------------------------------------------------------------------------------------
//	whether element contains node.
//----------------------------------------------------------------------------------------------------
fContains =
function(									//	(boolean)
	vElm,									//	(element/string/array) element selector
	vNode									//	(node) node to check
)
{
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fContains() invalid vElm: " + vElm);
	if (fIsUndefined(vNode.parentNode)) fErr("fContains() invalid vNode: " + vNode);

	vElm = fGet(vElm);

	for (; (vNode = vNode.parentNode) != null; )
		if (vNode == vElm)
			return true;
	return false;
}
