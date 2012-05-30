//----------------------------------------------------------------------------------------------------
//	2.Widgets/cMenu.js
//----------------------------------------------------------------------------------------------------

//alert("2.Widgets/cMenu.js");

//----------------------------------------------------------------------------------------------------
//	cMenu namespace.
//----------------------------------------------------------------------------------------------------
var cMenu = {};

//----------------------------------------------------------------------------------------------------
//	handle signal.
//	return true to bubble signal to parent, false (default) to stop.
//----------------------------------------------------------------------------------------------------
cMenu.fOnSignal =
function(									//	(boolean) false to stop
	vThis,									//	(element) element processing signal
	vTarget,								//	(element) original target for signal
	vSignal,								//	(string) signal received
	vData									//	(*) extra data along with signal
)
{
	var vPanel, vPos, vList, i;

	switch (vSignal)
	{
	case "Init":
fDbg("cMenu.fOnSignal() " + vSignal + ", " + fDump(vThis) + ", " + fDump(fGetSize(vThis)));
		return false;
		
	case "mouseover":
		switch (vTarget.className)
		{
		case "xActive":
			vTarget.className = "xHover";
			vPos = fGetPos(vTarget);
			vPanel = fGet([vTarget, ".xPanel"], false);
			if (vPanel != null)
			{
				vPanel.style.visibility = "visible";
				fSetPos(vPanel, {x: vPos.x, y: vPos.y + fGetSize(vTarget).y});
			}
			return false;
		}
		break;

	case "mouseout":
		switch (vTarget.className)
		{
		case "xHover":
			vTarget.className = "xActive";
			vPanel = fGet([vTarget, ".xPanel"], false);
			if (vPanel != null)
				vPanel.style.visibility = "hidden";
			break;
		}
		return false;

	case "click":
		if (vTarget.className == "xDisabled")
			return false;
		for (; vTarget != vThis; vTarget = vTarget.parentNode)
			if (vTarget.className == "xHover")
				vTarget.className = "xActive";
			else if (vTarget.className == "xPanel")
				vTarget.style.visibility = "hidden";
		return true;
	}
	return true;
}
