//----------------------------------------------------------------------------------------------------
//	1.Core/cPage.js
//----------------------------------------------------------------------------------------------------

//alert("1.Core/cPage.js");

//----------------------------------------------------------------------------------------------------
//	cPage namespace.
//----------------------------------------------------------------------------------------------------
var cPage = {};

//----------------------------------------------------------------------------------------------------
//	layout elements.
//----------------------------------------------------------------------------------------------------
cPage.fLayout =
function(									//	(void)
	vDiv,									//	(element)
	vSize									//	(point)
)
{
//fDbg("cPage.fLayout() " + fDump(vDiv) + ", " + fDump(vSize));
	var vDir, vList, vNFixed, vFixed, vRemain, i;

	vDir = null;
	for (vList = [], i = 0; i < vDiv.childNodes.length; i++)
		if (vDiv.childNodes[i].nodeType == 3)
			;
		else if ((vDiv.childNodes[i].nodeType == 1) && (vDiv.childNodes[i].tagName == "DIV") &&
			fIsPrefix(vDiv.childNodes[i].className, "xLayout"))
		{
			if (vDir == null)
				vDir = vDiv.childNodes[i].className.substr(0, 8);
			if (!fIsPrefix(vDiv.childNodes[i].className, vDir))
				return;
			vList.push(vDiv.childNodes[i]);
		}
		else
			return;
	if (vList.length == 0)
		return;

	switch (vDir)
	{
	case "xLayoutH":
		for (vNFixed = vFixed = i = 0; i < vList.length; i++)
			if (vList[i].className == "xLayoutHFix")
			{
				vNFixed++;
				vFixed += fGetSize(vList[i]).x;
			}
		if (vNFixed < vList.length)
		{
			vRemain = vSize.x - vFixed;
			vFixed = Math.floor(vRemain / (vList.length - vNFixed));
			vRemain -= vFixed * (vList.length - vNFixed - 1);
			for (i = 0; i < vList.length; i++)
				switch(vList[i].className)
				{
				case "xLayoutHFix":
					fSetSize(vList[i], {x: null, y: vSize.y});
					if (fIsElement(vList[i].childNodes[0]) &&
						!fIsPrefix(vList[i].childNodes[0].className, "xLayout"))
						fSetSize(vList[i].childNodes[0], {x: null, y: fGetSize(vList[i], true).y});
					break;
				case "xLayoutHVar":
					fSetSize(vList[i], {x: (++vNFixed < vList.length) ? vFixed : vRemain, y: vSize.y});
					if (fIsElement(vList[i].childNodes[0]) &&
						!fIsPrefix(vList[i].childNodes[0].className, "xLayout"))
						fSetSize(vList[i].childNodes[0], fGetSize(vList[i], true));
					break;
				}
		}
		break;
	
	case "xLayoutV":
		for (vNFixed = vFixed = i = 0; i < vList.length; i++)
			if (vList[i].className == "xLayoutVFix")
			{
				vNFixed++;
				vFixed += fGetSize(vList[i]).y;
			}
		if (vNFixed < vList.length)
		{
			vRemain = vSize.y - vFixed;
			vFixed = Math.floor(vRemain / (vList.length - vNFixed));
			vRemain -= vFixed * (vList.length - vNFixed - 1);
			for (i = 0; i < vList.length; i++)
				switch(vList[i].className)
				{
				case "xLayoutVFix":
					break;
				case "xLayoutVVar":
					fSetSize(vList[i], {x: null, y: (++vNFixed < vList.length) ? vFixed : vRemain});
					if (fIsElement(vList[i].childNodes[0]) &&
						!fIsPrefix(vList[i].childNodes[0].className, "xLayout"))
						fSetSize(vList[i].childNodes[0], {x: null, y: fGetSize(vList[i], true).y});
					break;
				}
		}
		break;
	}

	for (i = 0; i < vList.length; i++)
		cPage.fLayout(vList[i], fGetSize(vList[i], true));
}

//----------------------------------------------------------------------------------------------------
//	fill data.
//----------------------------------------------------------------------------------------------------
cPage.fFill =
function(									//	(void)
	vElm,									//	(element/string/array) element selector
	vData									//	(*) data to fill with
)
{
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fFill() invalid vElm: " + vElm);
	if (!fIsObject(vData)) fErr("fFill() invalid vData: " + vData);

	var vList, vKey, i;

	vElm = fGet(vElm);

	for (vList = vElm.getElementsByTagName("*"), i = 0; i < vList.length; i++)
		if (vList[i].id.length > 0)
		{
			vKey = vList[i].id.substr(1);
			if (fIsSet(vData[vKey]))
				switch (vList[i].tagName)
				{
				case "INPUT":
					if (vList[i].type == "checkbox")
						if (fIsArray(vData[vKey]))
							vList[i].checked = fIsArrayMember(vData[vKey], vList[i].value);
						else
							vList[i].checked = (vData[vKey] == 1) || (vData[vKey] == true);
					else if (vList[i].type == "radio")
						vList[i].checked = (vList[i].value = vData[vKey]);
					else
						vList[i].value = vData[vKey];
					break;
				case "TEXTAREA":
				case "SELECT":
					vList[i].value = vData[vKey];
					break;
				case "SPAN":
					vList[i].innerHTML = vData[vKey];
					break;
				}
		}
}

//----------------------------------------------------------------------------------------------------
//	grab to data.
//----------------------------------------------------------------------------------------------------
cPage.fGrab =
function(									//	(void)
	vElm,									//	(element/string/array) element selector
	vData									//	(*) data to fill to
)
{
	if (!fIsElement(vElm) && !fIsString(vElm) && !fIsArray(vElm)) fErr("fGrab() invalid vElm: " + vElm);
	if (!fIsObject(vData)) fErr("fGrab() invalid vData: " + vData);

	var vList, vKey, i;

	vElm = fGet(vElm);

	for (vList = vElm.getElementsByTagName("*"), i = 0; i < vList.length; i++)
		if (vList[i].id.length > 0)
		{
			vKey = vList[i].id.substr(1);
			if (fIsSet(vData[vKey]))
				switch (vList[i].tagName)
				{
				case "INPUT":
					if (vList[i].type == "checkbox")
						if (fIsArray(vData[vKey]))
						{
							if (vList[i].checked)
								vData[vKey].push(vList[i].value);
						}
						else
							vData[vKey] = vList[i].checked ? 1 : 0;
					else if (vList[i].type == "radio")
					{
						if (vList[i].checked)
							vData[vKey] = vList[i].value;
					}
					else
						vData[vKey] = vList[i].value;
					break;
				case "TEXTAREA":
				case "SELECT":
					vData[vKey] = vList[i].value;
					break;
				case "SPAN":
					vData[vKey] = vList[i].innerHTML;
					break;
				}
		}
}

//----------------------------------------------------------------------------------------------------
//	handle signal.
//	return true to bubble signal to parent, false (default) to stop.
//----------------------------------------------------------------------------------------------------
cPage.fOnSignal =
function(									//	(boolean) true if consumed
	vThis,									//	(element) element processing signal
	vTarget,								//	(element) original target for signal
	vSignal,								//	(string) signal received
	vData									//	(mixed) extra data along with signal
)
{
	switch (vSignal)
	{
	case "Start":
	case "Suspend":
	case "Resume":
		return false;

	case "resize":
		cPage.fLayout(vThis, vData);
		return false;
	
	case "mouseover":
		switch (vTarget.className)
		{
		case "xActive":
			vTarget.className = "xHover";
			return false;
		case "xHover":
		case "xSelected":
		case "xDisabled":
			return false;
		}
		return false;
			
	case "mouseout":
		switch (vTarget.className)
		{
		case "xHover":
			vTarget.className = "xActive";
			return false;
		case "xActive":
		case "xSelected":
		case "xDisabled":
			return false;
		}
		return false;

	case "click":
		if (fIsPrefix(vTarget.id, "eNav_"))
		{
			if (vTarget.className == "xDisabled")
				return false;
			vPath = vTarget.id.substr(5);
			if (fGetSuffix(vPath) != "")
				cSys.fGoto("../" + fGetPrefix(vPath) + "/" + fGetSuffix(vPath) + ".html");
			else
				cSys.fGoto("../" + vPath + "/" + vPath + ".html");
			return false;
		}
		return false;
	}

	return false;
}
