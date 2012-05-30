//----------------------------------------------------------------------------------------------------
//	1.Core/cSys.js
//
//	dispatch "Init" to elements that are classed on first load.
//	dispatch "Start" to <div class="cPage"> on first load.
//	dispatch "Resume" to <div class="cPage"> on reload.
//----------------------------------------------------------------------------------------------------

//alert("1.Core/cSys.js");

//----------------------------------------------------------------------------------------------------
//	cSys namespace.
//----------------------------------------------------------------------------------------------------
var cSys = {};

//----------------------------------------------------------------------------------------------------
//	constants.
//----------------------------------------------------------------------------------------------------
cSys.kErrUnauthorized = "Unauthorized";
cSys.kErrExpired = "Expired";

cSys.kSeed = "123456789";

//----------------------------------------------------------------------------------------------------
//	global data.
//----------------------------------------------------------------------------------------------------
cSys.gCookies = {};							//	persist across pages and requests to servers
cSys.gAppVars = {};							//	persist across pages
cSys.gPageVars = {};						//	persist within page

//----------------------------------------------------------------------------------------------------
//	private data.
//----------------------------------------------------------------------------------------------------
cSys.xBodyDiv = null;						//	main div of body
cSys.xMouseOver = null;						//	last mouse over
cSys.xModalList = [];						//	modal list

cSys.xSignalList = [];						//	pending signal list
cSys.xSignalTimerId = -1;					//	signal timer

cSys.xRequestList = [];						//	pending requests
cSys.xRequestTimerId = -1;					//	request timer
cSys.xRequest = null;						//	XMLHttpRequest object
cSys.xFormTarget = null;					//	IFrame form target

cSys.xData = null;							//	unserialize data

//----------------------------------------------------------------------------------------------------
//	compute forward hash.
//----------------------------------------------------------------------------------------------------
cSys.fHash =
function(									//	(string)
	vSeed,									//	(int) seed for hash function
	vData									//	(string) data to hash
)
{
	return hex_sha256(vSeed + "," + vData);
}

//----------------------------------------------------------------------------------------------------
//	encrypt data.
//----------------------------------------------------------------------------------------------------
cSys.fEncrypt =
function(									//	(string)
	vSeed,									//	(int) seed for encrypt function
	vData									//	(string) data to encrypt
)
{
	return xxtea_encrypt(vData, vSeed);
}

//----------------------------------------------------------------------------------------------------
//	dispatch signal.
//	target is an element or a function.
//	if a signal is delayed, it is dispatched at the next ms.
//----------------------------------------------------------------------------------------------------
cSys.fDispatch =
function(									//	(void)
	vTarget,								//	(element/function) target for signal
	vSignal,								//	(string) signal to dispatch
	vData,									//	(*) default null; extra data along with signal
	vDelay									//	(boolean) default false; whether delay
)
{
	if (fIsUndefined(vData)) vData = null;
	if (fIsUndefined(vDelay)) vDelay = false;
	if ((vTarget != null) && !fIsElement(vTarget) && !fIsFunction(vTarget)) fErr("cSys.fDispatch() invalid vTarget: " + vTarget);
	if (!fIsString(vSignal)) fErr("cSys.fDispatch() invalid vSignal: " + vSignal);
	
	var vWindow, vElm, vClass, s, i;
	
	if (vTarget == null)
		if (cSys.xModalList.length > 0)
			vTarget = cSys.xModalList[cSys.xModalList.length - 1].Modal;
		else
			vTarget = cSys.xBodyDiv ;

	if (vDelay)
	{
		if (cSys.xSignalTimerId == -1)
			cSys.xSignalTimerId = setTimeout(cSys.xfDoSignal, 1);
		if (vSignal == "change")
			for (i = 0; i < cSys.xSignalList.length; i++)
				if ((cSys.xSignalList[i].Target == vTarget) &&
					(cSys.xSignalList[i].Signal == vSignal))
					return;
		cSys.xSignalList.push({Target: vTarget, Signal: vSignal, Data: vData});
		return;
	}
	
	if (fIsFunction(vTarget))
		return vTarget(vSignal, vData);
	
	vWindow = (kIsIE) ? vTarget.ownerDocument.parentWindow : vTarget.ownerDocument.defaultView;

	for (vElm = vTarget; vElm != null; vElm = vElm.parentNode)
		if (fIsSet(vElm.className) && fIsPrefix(vElm.className, "c") &&
			((vClass = vWindow[fGetPrefix(vElm.className)]) != null) && fIsSet(vClass.fOnSignal))
			if (!vClass.fOnSignal(vElm, vTarget, vSignal, vData))
				return;
}

//----------------------------------------------------------------------------------------------------
//	goto to new location.
//	if same html, page is replaced (no history).
//	using ?0 or ?1 to force reloading of same html.
//	using # to pass data.
//----------------------------------------------------------------------------------------------------
cSys.fGoto =
function(									//	(void)
	vUrl,									//	(string) url to go to
	vParams									//	(*) default null; parameters to send
)
{
fDbg("cSys.fGoto() " + vUrl + ", " + fDump(vParams));
	if (fIsUndefined(vParams)) vParams = null;
	if (!fIsString(vUrl)) fErr("cSys.fGoto() invalid vUrl: " + vUrl);

	var vPath, vHash;

	if (/^http:/i.test(vUrl))
	{
		window.location = vUrl;
		return;
	}

	if (vUrl.substr(0, 1) != "/")
	{
		vPath = window.location.pathname.split("/");
		vPath.pop();
		for (; vUrl.substr(0, 3) == "../"; vUrl = vUrl.substr(3))
			if (vPath.length == 1)
				fErr("cSys.fGoto() invalid vUrl");
			else
				vPath.pop();
		vUrl = vPath.join("/") + "/" + vUrl;
	}
	
	vHash = "#" + cSys.xfSerialize({Cookies: cSys.gCookies, AppVars: cSys.gAppVars, Params: vParams});

	if (vUrl != window.location.pathname)
		window.location = vUrl + "?0" + vHash;
	else
		window.location.replace(vUrl + "?" + (1 - parseInt(window.location.search.substr(1,1))) +
			vHash);
}

//----------------------------------------------------------------------------------------------------
//	set/clear message.
//----------------------------------------------------------------------------------------------------
cSys.fSetMessage =
function(									//	(void)
	vMessage								//	(string) default ""; message to show; if "", clear
)
{
	if (fIsUndefined(vMessage)) vMessage = "";
	if (!fIsString(vMessage)) fErr("cSys.fSetMessage() invalid vMessage: " + vMessage);

	var vDiv;

	if (vMessage != "")
	{
		vDiv = document.getElementById("xMask");
		if (vDiv == null)
		{
			vDiv = document.createElement("DIV");
			vDiv.id = "xMask";
			vDiv.style.position = "fixed";
			vDiv.style.top = "0px";
			vDiv.style.left = "0px";
			vDiv.style.width = "100%";
			vDiv.style.height = "100%";
		}
		else
			vDiv.parentNode.removeChild(vDiv);
		cSys.xBodyDiv.appendChild(vDiv);
		
		vDiv = document.getElementById("xMessage");
		if (vDiv == null)
		{
			vDiv = document.createElement("DIV");
			vDiv.id = "xMessage";
			vDiv.style.position = "fixed";
			vDiv.style.top = "0px";
			vDiv.style.left = "0px";
			vDiv.style.width = "100%";
		}
		vDiv.innerHTML = '<img src="1.Core/Images/wait16trans.gif"/>&nbsp;' +
			'<span style="vertical-align: top">' + vMessage + '</span>';
		cSys.xBodyDiv.appendChild(vDiv);
	}
	else
	{
		vDiv = document.getElementById("xMessage");
		if (vDiv != null)
			vDiv.parentNode.removeChild(vDiv);

		vDiv = document.getElementById("xMask");
		if (vDiv != null)
			vDiv.parentNode.removeChild(vDiv);

		if (cSys.xModalList.length > 0)
			cSys.xBodyDiv.insertBefore(vDiv, cSys.xModalList[cSys.xModalList.length - 1].Modal);
	}
}

//----------------------------------------------------------------------------------------------------
//	start modal.
//----------------------------------------------------------------------------------------------------
cSys.fStartModal =
function(									//	(void)
	vTarget,								//	(element/function) target for signal
	vSignal,								//	(string) signal to dispatch on completion
	vModal,									//	(element)
	vParams									//	(object) default {}; parameters
)
{
	if (fIsUndefined(vParams)) vParams = {};
	if (!fIsElement(vTarget) && !fIsFunction(vTarget)) fErr("cSys.fStartModal() invalid vTarget: " + vTarget);
	if (!fIsString(vSignal)) fErr("cSys.fStartModal() invalid vSignal: " + vSignal);
	if (!fIsElement(vModal)) fErr("cSys.fStartModal() invalid vModal");

	var vDiv;

	cSys.xModalList.push({Target: vTarget, Signal: vSignal, Modal: vModal});

	vDiv = document.getElementById("xMask");
	if (vDiv == null)
	{
		vDiv = document.createElement("DIV");
		vDiv.id = "xMask";
		vDiv.style.position = "fixed";
		vDiv.style.top = "0px";
		vDiv.style.left = "0px";
		//vDiv.setAttribute("onclick", "maskClick()");
	}
	else
		vDiv.parentNode.removeChild(vDiv);
	cSys.xBodyDiv.appendChild(vDiv);
	
	cSys.xBodyDiv.appendChild(vModal);

	cSys.fDispatch(null, "Start", vParams);

	cSys.xfOnEvent({type: "resize", srcElement: null, target: null});
}

//----------------------------------------------------------------------------------------------------
//	end modal.
//----------------------------------------------------------------------------------------------------
cSys.fEndModal =
function(									//	(void)
	vResults								//	(*) default null; results to return
)
{
	if (fIsUndefined(vResults)) vResults = null;
	if (cSys.xModalList.length < 1) fErr("cSys.fEndModal() invalid call");

	var vItem, vMask, vDiv;

	vItem = cSys.xModalList.pop();

	vItem.Modal.parentNode.removeChild(vItem.Modal);

	vDiv = document.getElementById("xMask");
	if (vDiv != null)
		vDiv.parentNode.removeChild(vDiv);

	if (cSys.xModalList.length > 0)
		cSys.xBodyDiv.insertBefore(vDiv, cSys.xModalList[cSys.xModalList.length - 1].Modal);

	cSys.fDispatch(vItem.Target, vItem.Signal, vResults);
}

//----------------------------------------------------------------------------------------------------
//	start request.
//	if vOp has "Get" prefix, request is sent via url and cacheable.
//----------------------------------------------------------------------------------------------------
cSys.fStartRequest =
function(									//	(void)
	vTarget,								//	(element/function) target for signal
	vSignal,								//	(string) signal to dispatch on completion
	vUrl,									//	(string) url to send request to
	vOp,									//	(string) default ""; operation
	vData,									//	(object/element) default {}; parameters or form
	vMessage								//	(string) default ""; message to show
)
{
fDbg("cSys.fStartRequest() " + vUrl + ", " + vOp);
	if (fIsUndefined(vOp)) vOp = "";
	if (fIsUndefined(vData)) vData = {};
	if (fIsUndefined(vMessage)) vMessage = "";
	if (!fIsElement(vTarget) && !fIsFunction(vTarget)) fErr("cSys.fStartRequest() invalid vTarget: " + vTarget);
	if (!fIsString(vSignal)) fErr("cSys.fStartRequest() invalid vSignal: " + vSignal);
	if (!fIsString(vUrl)) fErr("cSys.fStartRequest() invalid vUrl: " + vUrl);
	if (!fIsString(vOp)) fErr("cSys.fStartRequest() invalid vOp: " + vOp);
	if (!fIsObject(vData) && (!fIsElement(vData) || (vData.tagName != "FORM"))) fErr("cSys.fStartRequest() invalid vData: " + vData);
	if (!fIsString(vMessage)) fErr("cSys.fStartRequest() invalid vMessage: " + vMessage);

	if (fIsElement(vData) && (vData.tagName == "FORM"))
		cSys.xRequestList.push({Target: vTarget, Signal: vSignal, Url: vUrl, Op: vOp, Form: vData,
			Message: vMessage});
	else
		cSys.xRequestList.push({Target: vTarget, Signal: vSignal, Url: vUrl, Op: vOp, Params: vData,
			Message: vMessage});

	if ((cSys.xRequestList.length > 0) && (cSys.xRequestTimerId == -1))
		cSys.xRequestTimerId = setTimeout(cSys.xfDoRequest, 1);
}

//----------------------------------------------------------------------------------------------------
//	end requests.
//----------------------------------------------------------------------------------------------------
cSys.fEndRequest =
function(									//	(void)
	vTarget,								//	(element/function) target for signal
	vSignal									//	(string) default ""; signal to match
)
{
	if (fIsUndefined(vSignal)) vSignal = "";
	if (!fIsElement(vTarget) && !fIsFunction(vTarget)) fErr("cSys.fEndRequest() invalid vTarget: " + vTarget);
	if (!fIsString(vSignal)) fErr("cSys.fEndRequest() invalid vSignal: " + vSignal);
	
	var i;

	if ((cSys.xRequestList.length > 0) && (cSys.xRequestList[0].Target == vTarget) &&
		((vSignal == "") || (cSys.xRequestList[i].Signal == vSignal)))
		if (fIsSet(cSys.xRequestList[i].Params))
			cSys.xRequest.abort();
		else
			; // TODO: abort form submit

	for (i = 0; i < cSys.xRequestList.length; i++)
		if ((cSys.xRequestList[i].Target == vTarget) && ((vSignal == "") ||
			(cSys.xRequestList[i].Signal == vSignal)))
			cSys.xRequestList.splice(i--, 1);
	
	if ((cSys.xRequestList.length > 0) && (cSys.xRequestTimerId == -1))
		cSys.xRequestTimerId = setTimeout(cSys.xfDoRequest, 1);
}

//----------------------------------------------------------------------------------------------------
//	handle load event.
//----------------------------------------------------------------------------------------------------
cSys.xfOnLoad =
function(									//	(void)
	vEvent									//	(event)
)
{
fDbg("cSys.xfOnLoad " + ((document.getElementById("xSave").value == "") ? "new" : "old"));
	var vHash, vSave, vList, i, j;

	vSave = cSys.xfUnserialize(document.getElementById("xSave").value);
vSave = null;
	
	cSys.xBodyDiv = document.getElementsByTagName("DIV")[0];

	if (vSave == null)
	{
		vList = cSys.xBodyDiv.getElementsByTagName("div");
		for (i = 0; i < vList.length; i++)
			if (vList[i].className.substr(0, 1) == "c")
				cSys.fDispatch(vList[i], "Init");
		if (window.location.hash.length == 0)
			cSys.fDispatch(null, "Start");
		else
		{
			vHash = window.location.hash.substr(1);
			if (kIsSafari)
				vHash = unescape(vHash);
			vHash = cSys.xfUnserialize(vHash);
			cSys.gCookies = vHash.Cookies;
			cSys.gAppVars = vHash.AppVars;
			cSys.fDispatch(null, "Start", vHash.Params);
		}
	}
	else
	{
		cSys.xBodyDiv.innerHTML = vSave.Html;
		vList = cSys.xBodyDiv.getElementsByTagName("*");
		for (i = j = 0; i < vList.length; i++)
			switch (vList[i].tagName)
			{
			case "INPUT":
				if ((vList[i].type == "checkbox") || (vList[i].type == "radio"))
					vList[i].checked = vSave.Values[j++];
				else if (vList[i].type != "password")
					vList[i].value = vSave.Values[j++];
				break;
			case "TEXTAREA":
				vList[i].value = vSave.Values[j++];
				break;
			case "SELECT":
				vList[i].selectedIndex = vSave.Values[j++];
				break;
			}
		cSys.gCookies = vSave.Cookies;
		cSys.gAppVars = vSave.AppVars;
		cSys.gPageVars = vSave.PageVars;
		cSys.fDispatch(null, "Resume");
	}

	cSys.xBodyDiv.style.visibility = "visible";
	cSys.xfOnEvent({type: "resize", srcElement: null, target: null});
	window.focus();

	if (kIsIE)
	{
		window.attachEvent("onbeforeunload", cSys.xfOnUnload);
		window.attachEvent("onresize", cSys.xfOnEvent);
		document.attachEvent("onmouseover", cSys.xfOnEvent);
		document.attachEvent("onmouseout", cSys.xfOnEvent);
		document.attachEvent("onmousedown", cSys.xfOnEvent);
		document.attachEvent("onmousemove", cSys.xfOnEvent);
		document.attachEvent("onmouseup", cSys.xfOnEvent);
		document.attachEvent("onkeypress", cSys.xfOnEvent);
		document.attachEvent("onclick", cSys.xfOnEvent);
		vList = cSys.xBodyDiv.getElementsByTagName("FORM");
		for (i = 0; i < vList.length; i++)
			vList[i].attachEvent("onsubmit", cSys.xfOnEvent);
	}
	else
	{
		window.addEventListener(kIsFF ? "unload" : "beforeunload", cSys.xfOnUnload, false);
		window.addEventListener("resize", cSys.xfOnEvent, false);
		document.addEventListener("mouseover", cSys.xfOnEvent, false);
		document.addEventListener("mouseout", cSys.xfOnEvent, false);
		document.addEventListener("mousedown", cSys.xfOnEvent, false);
		document.addEventListener("mousemove", cSys.xfOnEvent, false);
		document.addEventListener("mouseup", cSys.xfOnEvent, false);
		document.addEventListener("keypress", cSys.xfOnEvent, false);
		document.addEventListener("click", cSys.xfOnEvent, false);
		vList = cSys.xBodyDiv.getElementsByTagName("FORM");
		for (i = 0; i < vList.length; i++)
			vList[i].addEventListener("submit", cSys.xfOnEvent, false);
	}
}

//----------------------------------------------------------------------------------------------------
//	handle unload event.
//----------------------------------------------------------------------------------------------------
cSys.xfOnUnload =
function(									//	(void)
	vEvent									//	(event)
)
{
//fDbg("cSys.xfOnUnload <" + window.location + ">");
	var vSave, vList, i;

	if (cSys.xFormTarget != null)
		if (kIsIE)
			cSys.xFormTarget.detachEvent("onload", cSys.xfOnSubmit);
		else
			cSys.xFormTarget.removeEventListener("load", cSys.xfOnSubmit, false);
	
	if (cSys.xRequest != null)
		if (!kIsIE)
			cSys.xRequest.removeEventListener("readystatechange", cSys.xfOnRequest, false);

	if (kIsIE)
	{
		window.detachEvent("onload", cSys.xfOnLoad);
		window.detachEvent("onbeforeunload", cSys.xfOnUnload);
		window.detachEvent("onresize", cSys.xfOnEvent);
		document.detachEvent("onmouseover", cSys.xfOnEvent);
		document.detachEvent("onmouseout", cSys.xfOnEvent);
		document.detachEvent("onmousedown", cSys.xfOnEvent);
		document.detachEvent("onmousemove", cSys.xfOnEvent);
		document.detachEvent("onmouseup", cSys.xfOnEvent);
		document.detachEvent("onkeypress", cSys.xfOnEvent);
		document.detachEvent("onclick", cSys.xfOnEvent);
		vList = cSys.xBodyDiv.getElementsByTagName("FORM");
		for (i = 0; i < vList.length; i++)
			vList[i].detachEvent("onsubmit", cSys.xfOnEvent);
	}
	else
	{
		window.removeEventListener("load", cSys.xfOnLoad, false);
		window.removeEventListener(kIsFF ? "unload" : "beforeunload", cSys.xfOnUnload, false);
		window.removeEventListener("resize", cSys.xfOnEvent, false);
		document.removeEventListener("mouseover", cSys.xfOnEvent, false);
		document.removeEventListener("mouseout", cSys.xfOnEvent, false);
		document.removeEventListener("mousedown", cSys.xfOnEvent, false);
		document.removeEventListener("mousemove", cSys.xfOnEvent, false);
		document.removeEventListener("mouseup", cSys.xfOnEvent, false);
		document.removeEventListener("keypress", cSys.xfOnEvent, false);
		document.removeEventListener("click", cSys.xfOnEvent, false);
		vList = cSys.xBodyDiv.getElementsByTagName("FORM");
		for (i = 0; i < vList.length; i++)
			vList[i].removeEventListener("submit", cSys.xfOnEvent, false);
	}

	for (; cSys.xMouseOver != null; cSys.xMouseOver = cSys.xfGetTarget(cSys.xMouseOver.parentNode))
		cSys.fDispatch(cSys.xMouseOver, "mouseout");

	cSys.fDispatch(null, "Suspend");

	vSave = {Html: cSys.xBodyDiv.innerHTML, Values: [], Cookies: cSys.gCookies,
		AppVars: cSys.gAppVars, PageVars: cSys.gPageVars};
	vList = cSys.xBodyDiv.getElementsByTagName("*");
	for (i = 0; i < vList.length; i++)
		switch (vList[i].tagName)
		{
		case "INPUT":
			if ((vList[i].type == "checkbox") || (vList[i].type == "radio"))
				vSave.Values.push(vList[i].checked);
			else if (vList[i].type != "password")
				vSave.Values.push(vList[i].value);
			break;
		case "TEXTAREA":
			vSave.Values.push(vList[i].value);
			break;
		case "SELECT":
			vSave.Values.push(vList[i].selectedIndex);
			break;
		}

	document.getElementById("xSave").value = cSys.xfSerialize(vSave);
}

//----------------------------------------------------------------------------------------------------
//	handle event.
//----------------------------------------------------------------------------------------------------
cSys.xfOnEvent =
function(									//	(void)
	vEvent									//	(event)
)
{
	var vTarget, vRelated, vList, vCommon, vSize, i;

	try
	{
		vTarget = cSys.xfGetTarget(kIsIE ? vEvent.srcElement : vEvent.target);
	}
	catch (e)
	{
		return;
	}

	if ((vTarget != null) && (document != vTarget.ownerDocument))
	{
		if (kIsIE)
			vEvent.returnValue = false;
		else
			vEvent.preventDefault();
		return;
	}

	switch (vEvent.type)
	{
	case "resize":
		vSize = {x: document.body.clientWidth, y: document.body.clientHeight};
		cSys.fDispatch(cSys.xBodyDiv, vEvent.type, vSize);
		for (i = 0; i < cSys.xModalList.length; i++)
			cSys.fDispatch(cSys.xModalList[i].Modal, vEvent.type, vSize);
		break;
		
	case "mouseover":
		cSys.xMouseOver = vTarget;
		vRelated = cSys.xfGetTarget(kIsIE ? vEvent.fromElement : vEvent.relatedTarget);
		for (vList = []; ; vTarget = cSys.xfGetTarget(vTarget.parentNode))
		{
			for (vCommon = vRelated; vCommon != null; vCommon = vCommon.parentNode)
				if (vCommon == vTarget)
					break;
			if (vCommon == vTarget)
				break;
			if (vTarget != null)
				vList.unshift(vTarget);
		}
		for (i = 0; i < vList.length; i++)
			cSys.fDispatch(vList[i], vEvent.type);
		break;

	case "mouseout":
		cSys.xMouseOver = null;
		vRelated = cSys.xfGetTarget(kIsIE ? vEvent.toElement : vEvent.relatedTarget);
		for (vList = []; ; vTarget = cSys.xfGetTarget(vTarget.parentNode))
		{
			for (vCommon = vRelated; vCommon != null; vCommon = vCommon.parentNode)
				if (vCommon == vTarget)
					break;
			if (vCommon == vTarget)
				break;
			if (vTarget != null)
				vList.push(vTarget);
		}
		for (i = 0; i < vList.length; i++)
			cSys.fDispatch(vList[i], vEvent.type);
		break;
		
	case "keypress":
		cSys.fDispatch(vTarget, vEvent.type, vEvent.keyCode);
		return;
		
	case "submit":
		cSys.fDispatch(vTarget, vEvent.type);
		if (kIsIE)
			vEvent.returnValue = false;
		else
			vEvent.preventDefault();
		break;

	default:
		cSys.fDispatch(vTarget, vEvent.type);
		break;
	}
}

//----------------------------------------------------------------------------------------------------
//	get target for element.
//	a target is an element whose className begins with "c" or "x".
//----------------------------------------------------------------------------------------------------
cSys.xfGetTarget =
function(									//	(element)
	vElm									//	(element)
)
{
	try
	{
		for (; vElm != null; vElm = vElm.parentNode)
			if ((vElm.tagName == "INPUT") || (vElm.tagName == "TEXTAREA") ||
				(vElm.tagName == "SELECT") || (vElm.tagName == "BUTTON") ||
				(vElm.tagName == "FORM") || (vElm.tagName == "A") ||
				((vElm.className !== undefined) && ((vElm.className.substr(0, 1) == "c") ||
				(vElm.className.substr(0, 1) == "x"))))
				return vElm;
	}
	catch (e)
	{
	}

	return null;
}

//----------------------------------------------------------------------------------------------------
//	do pending signals.
//----------------------------------------------------------------------------------------------------
cSys.xfDoSignal =
function(									//	(void)
)
{
	var vItem;
	
	clearTimeout(cSys.xSignalTimerId);
	cSys.xSignalTimerId = -1;

	for (; cSys.xSignalList.length > 0; )
	{
		vItem = cSys.xSignalList.shift();
		cSys.fDispatch(vItem.Target, vItem.Signal, vItem.Data);
	}
}

//----------------------------------------------------------------------------------------------------
//	do pending requests.
//----------------------------------------------------------------------------------------------------
cSys.xfDoRequest =
function(									//	(void)
)
{
	var vItem, vTime, vCheckSum, vQuery, vElm;

	clearTimeout(cSys.xRequestTimerId);
	cSys.xRequestTimerId = -1;

	vItem = cSys.xRequestList[0];

	if (fIsSet(vItem.Params))
	{
		if (cSys.xRequest == null)
			if (fIsSet(window.XMLHttpRequest))
			{
				cSys.xRequest = new XMLHttpRequest();
				if (!kIsIE)
					cSys.xRequest.addEventListener("readystatechange", cSys.xfOnRequest, false);
			}
			else if ((cSys.xRequest = new ActiveXObject("MSXML2.XMLHTTP.3.0")) != null)
				;
			else if ((cSys.xRequest = new ActiveXObject("MSXML2.XMLHTTP")) != null)
				;
			else if ((cSys.xRequest = new ActiveXObject("Microsoft.XMLHTTP")) != null)
				;
		if ((cSys.xRequest.readyState != 0) && (cSys.xRequest.readyState != 4))
			return;
	}
	else
		if (cSys.xFormTarget == null)
		{
			vElm = document.createElement("DIV");
			vElm.style.display = "none";
			vElm.innerHTML = '<iframe name="xFormTarget"></iframe>';
			document.body.insertBefore(vElm, cSys.xBodyDiv);
			cSys.xFormTarget = vElm.childNodes[0];
			if (kIsIE)
				cSys.xFormTarget.attachEvent("onload", cSys.xfOnSubmit);
			else
				cSys.xFormTarget.addEventListener("load", cSys.xfOnSubmit, false);
		}

	cSys.fSetMessage(vItem.Message);

	if (fIsUndefined(cSys.gCookies["xIdSession"]))
	{
		vTime = fGetTime();
		vCheckSum = 0;
	}
	else
	{
		vTime = fGetTime() - cSys.gCookies["xDeltaTime"];
		vCheckSum = cSys.fHash(vTime, cSys.gAppVars["Password"]);
	}

	if (fIsSet(vItem.Params))
	{
		vQuery = cSys.xfSerialize({Time: vTime, CheckSum: vCheckSum, Cookies: cSys.gCookies,
			Op: vItem.Op, Params: vItem.Params});
		if (vItem.Op.substr(0, 3) == "Get")
		{
			cSys.xRequest.open("GET", vItem.Url + "?" + vQuery, true);
			if (kIsIE)
				cSys.xRequest.onreadystatechange = cSys.xfOnRequest;
			cSys.xRequest.send(null);
		}
		else
		{
			cSys.xRequest.open("POST", vItem.Url, true);
			if (kIsIE)
				cSys.xRequest.onreadystatechange = cSys.xfOnRequest;
			cSys.xRequest.send(vQuery);
		}
	}
	else
	{
		vItem.Submit = document.createElement("INPUT");
		vItem.Submit.type = "hidden";
		vItem.Submit.name = "xSubmit";
		vItem.Submit.value = cSys.xfSerialize({Time: vTime, CheckSum: vCheckSum,
			Cookies: cSys.gCookies, Op: vItem.Op});
		vItem.Form.insertBefore(vItem.Submit, vItem.Form.childNodes[0]);
		vItem.Form.action = vItem.Url;
		vItem.Form.method = "post";
		if (kIsIE)
			vItem.Form.encoding = "Multipart/form-data";
		else
			vItem.Form.enctype = "Multipart/form-data";
		vItem.Form.target = cSys.xFormTarget.name;
		vItem.Form.submit();
	}
}

//----------------------------------------------------------------------------------------------------
//	handle XMLHttpRequest event.
//----------------------------------------------------------------------------------------------------
cSys.xfOnRequest =
function(									//	(void)
	vEvent									//	(event)
)
{
	var vItem, vResponse;

	switch (cSys.xRequest.readyState)
	{
	case 4:
		cSys.fSetMessage();
		switch (cSys.xRequest.status)
		{
		case 0: // abort
			break;
			
		case 200:
			vItem = cSys.xRequestList.shift();
			vResponse = cSys.xRequest.responseText;
			if ((vResponse.indexOf("error</") != -1) || (vResponse.indexOf("Warning</") != -1))
			{
				alert(vResponse);
				return;
			}
			vResponse = cSys.xfUnserialize(vResponse);
      cSys.gCookies = vResponse["Cookies"];
      delete vResponse["Cookies"];
      		if (vResponse["Error"] == cSys.kErrExpired){
				cSys.fDispatch(vItem.Target, 'SessionExpired', vResponse);
				return;
			}
			
			if (vResponse["Error"] == cSys.kErrUnauthorized)
			{
				cSys.fDispatch(vItem.Target, 'SessionInvalid', vResponse);
				return;
			}
			cSys.fDispatch(vItem.Target, vItem.Signal, vResponse);
			break;
			
		default:
			vItem = cSys.xRequestList.shift();
			alert("ERROR: " + cSys.xRequest.status + "\n" + vItem.Url + "\n" +
				cSys.xRequest.responseText);
			vResponse = {Error: cSys.xRequest.status, Data: null};
			cSys.fDispatch(vItem.Target, vItem.Signal, vResponse);
			break;
		}

		if ((cSys.xRequestList.length > 0) && (cSys.xRequestTimerId == -1))
			cSys.xRequestTimerId = setTimeout(cSys.xfDoRequest, 1);
		break;
	}
}

//----------------------------------------------------------------------------------------------------
//	handle submit event.
//----------------------------------------------------------------------------------------------------
cSys.xfOnSubmit =
function(									//	(void)
	vEvent									//	(event)
)
{
fDbg("cSys.xfOnSubmit() " + vEvent);
	var vItem, vResponse;

	cSys.fSetMessage();

	vItem = cSys.xRequestList.shift();

	vItem.Form.removeChild(vItem.Submit);

	vResponse = cSys.xFormTarget.contentWindow.document.body.innerHTML;
	if ((vResponse.indexOf("error</") != -1) || (vResponse.indexOf("warning</") != -1))
	{
		alert(vResponse);
		return;
	}

	vResponse = cSys.xfUnserialize(vResponse);
	cSys.gCookies = vResponse["Cookies"];
	delete vResponse["Cookies"];
	if ((vResponse["Error"] == cSys.kErrUnauthorized) ||
		(vResponse["Error"] == cSys.kErrExpired))
	{
		cSys.fGoto("../Error/" + vResponse["Error"] + ".html");
		return;
	}
	cSys.fDispatch(vItem.Target, vItem.Signal, vResponse);

	if ((cSys.xRequestList.length > 0) && (cSys.xRequestTimerId == -1))
		cSys.xRequestTimerId = setTimeout(cSys.xfDoRequest, 1);
}

//----------------------------------------------------------------------------------------------------
//	return serialized string from value in php format.
//----------------------------------------------------------------------------------------------------
cSys.xfSerialize =
function(									//	(string)
	v										//	(*) value to serialize
)
{
	var s, n, p;

	switch (typeof(v))
	{
	case "boolean":
		return "b:" + (v ? 1 : 0) + ";";

	case "number":
		if (parseInt(v) == v)
			return "i:" + v + ";";
		else
			return "d:" + v + ";";

	case "string":
		return "s:" + cSys.xfByteLengthOfString(v) + ':"' + v + '";';

	case "object":
		if (v === null)
			return "N;";
		s = "";
		n = 0;
		for (p in v)
			if ((v[p] === null) || (v[p] !== undefined))
			{
				if (parseInt(p) == p)
					s += cSys.xfSerialize(parseInt(p));
				else
					s += cSys.xfSerialize(p);
				s += cSys.xfSerialize(v[p]);
				n++;
			}
		return "a:" + n + ":{" + s + "}";
	}
}

//----------------------------------------------------------------------------------------------------
//	return unserialized value from string in php format.
//	support recordset format {Fields: {...}, Rows: {...}}.
//----------------------------------------------------------------------------------------------------
cSys.xfUnserialize =
function(									//	(*)
	v										//	(string) string to unserialize
)
{
	var vName, vValue, vFields, vRows, vRow, n, i;

	if (v !== undefined)
	{
		if (v == "")
			return null;
		cSys.xData = v;
	}

	switch (cSys.xData.substr(0, 1))
	{
	case "N":
		cSys.xData = cSys.xData.substr(cSys.xData.indexOf(";") + 1);
		return null;

	case "b":
		v = (cSys.xData.substr(2, 1) == "1");
		cSys.xData = cSys.xData.substr(cSys.xData.indexOf(";") + 1);
		return v;

	case "i":
		v = parseInt(cSys.xData.substr(2));
		cSys.xData = cSys.xData.substr(cSys.xData.indexOf(";") + 1);
		return v;

	case "d":
		v = parseFloat(cSys.xData.substr(2));
		cSys.xData = cSys.xData.substr(cSys.xData.indexOf(";") + 1);
		return v;

	case "s":
		n = parseInt(cSys.xData.substr(2));
		cSys.xData = cSys.xData.substr(cSys.xData.indexOf('"') + 1);
		v = cSys.xfSubstringByByteLength(cSys.xData, n);
		cSys.xData = cSys.xData.substr(v.length + 2);
		return v;

	case "a":
		n = parseInt(cSys.xData.substr(2));
		cSys.xData = cSys.xData.substr(cSys.xData.indexOf("{") + 1);
		v = ((n == 0) || (cSys.xData.substr(0, 1) == 'i')) ? [] : {};
		for (; n > 0; n--)
		{
			vName = cSys.xfUnserialize();
			vValue = cSys.xfUnserialize();
			v[vName] = vValue;
		}
		if ((v.Fields !== undefined) && (v.Rows !== undefined))
		{
			vFields = v.Fields;
			vRows = v.Rows;
			for (v = [], i = 0; i < vRows.length; i++, v.push(vRow))
				for (vRow = {}, j = 0; j < vFields.length; j++)
					vRow[vFields[j]] = vRows[i][j];
		}
		cSys.xData = cSys.xData.substr(cSys.xData.indexOf("}") + 1);
		return v;
	}
}






//----------------------------------------------------------------------------------------------------
/* A JavaScript implementation of the Secure Hash Algorithm, SHA-256
 * Version 0.3 Copyright Angel Marin 2003-2004 - http://anmar.eu.org/
 * Distributed under the BSD License
 * Some bits taken from Paul Johnston's SHA-1 implementation
 */
var chrsz = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode  */
function safe_add (x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}
function S (X, n) {return ( X >>> n ) | (X << (32 - n));}
function R (X, n) {return ( X >>> n );}
function Ch(x, y, z) {return ((x & y) ^ ((~x) & z));}
function Maj(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}
function Sigma0256(x) {return (S(x, 2) ^ S(x, 13) ^ S(x, 22));}
function Sigma1256(x) {return (S(x, 6) ^ S(x, 11) ^ S(x, 25));}
function Gamma0256(x) {return (S(x, 7) ^ S(x, 18) ^ R(x, 3));}
function Gamma1256(x) {return (S(x, 17) ^ S(x, 19) ^ R(x, 10));}
function core_sha256 (m, l) {
    var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    /* append padding */
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;
    for ( var i = 0; i<m.length; i+=16 ) {
        a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
        for ( var j = 0; j<64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
            T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
            T2 = safe_add(Sigma0256(a), Maj(a, b, c));
            h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
        }
        HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]); HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
}
function str2binb (str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
  return bin;
}
function binb2hex (binarray) {
  var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}
function hex_sha256(s){return binb2hex(core_sha256(str2binb(s),s.length * chrsz));}

//----------------------------------------------------------------------------------------------------
/* xxtea.js
*
* Author:       Ma Bingyao <andot@ujn.edu.cn>
* Copyright:    CoolCode.CN
* Version:      1.1
* LastModified: 2006-03-07
* This library is free.  You can redistribute it and/or modify it.
* http://www.coolcode.cn/?p=128
*/
 
function str2long(s, w) {
    var len = s.length;
    var v = [];
    for (var i = 0; i < len; i += 4)
    {
        v[i >> 2] = s.charCodeAt(i)
                  | s.charCodeAt(i + 1) << 8
                  | s.charCodeAt(i + 2) << 16
                  | s.charCodeAt(i + 3) << 24;
    }
    if (w) {
        v[v.length] = len;
    }
    return v;
}

function xxtea_encrypt(str, key) {
    if (str == "") {
        return "";
    }
    var v = str2long(str, true);
    var k = str2long(key, false);
    var n = v.length;
 
    var z = v[n - 1], y = v[0], delta = 0x9E3779B9;
    var mx, e, q = Math.floor(6 + 52 / n), sum = 0;
    while (q-- > 0) {
        sum = sum + delta & 0xffffffff;
        e = sum >>> 2 & 3;
        for (var p = 0; p < n - 1; p++) {
            y = v[p + 1];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            z = v[p] = v[p] + mx & 0xffffffff;
        }
        y = v[0];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
        z = v[n - 1] = v[n - 1] + mx & 0xffffffff;
    }
    return v.toString();
}

//----------------------------------------------------------------------------------------------------
cSys.xfByteLengthOfString =
function(
	vData
)
{
	var vLength, c, i;
	
	vLength = 0;
	for (i = 0; i < vData.length; i++)
	{
		c = vData.charCodeAt(i);
		if (c < 128)
			vLength++;
		else if ((c > 127) && (c < 2048))
			vLength += 2;
		else
			vLength += 3;
	}
	return vLength;
}

//----------------------------------------------------------------------------------------------------
cSys.xfSubstringByByteLength =
function(
	vData,
	vLength
)
{
	var vResult;
	var i, c, n;
	
	vResult = "";
	n = 0;
	for (i = 0; (i < vData.length) && (n < vLength); i++)
	{
		c = vData.charCodeAt(i);
		vResult += vData.charAt(i);
		if (c < 128)
			n++;
		else if ((c > 127) && (c < 2048))
			n += 2;
		else
			n += 3;
	}
	return vResult;
}

//----------------------------------------------------------------------------------------------------
if (kIsIE){	
	window.attachEvent("onload", cSys.xfOnLoad);
}
else{
	window.addEventListener("load", cSys.xfOnLoad, false);
}
