//----------------------------------------------------------------------------------------------------
//	2.Widgets/cMsgBox.js
//----------------------------------------------------------------------------------------------------

//alert("2.Widgets/cMsgBox.js");

//----------------------------------------------------------------------------------------------------
//	cTab namespace.
//----------------------------------------------------------------------------------------------------
var cMsgBox = {};

//----------------------------------------------------------------------------------------------------
//	create message box.
//----------------------------------------------------------------------------------------------------
cMsgBox.fCreate =
function(
	vHeader,									//	(element) element created
	vMessage,								//	(string)
	vButtonList,							//	(array) default []
	vIcon,									//	(string) default ""
	vId										//	(string) default ""
)
{
	if (fIsUndefined(vButtonList)) vButtonList = [];
	if (fIsUndefined(vIcon)) vIcon = "";
	if (fIsUndefined(vId)) vId = "";
	if (!fIsString(vMessage)) fErr("cMsgBox.fCreate() invalid vMessage: " + vMessage);
	if (!fIsObject(vButtonList)) fErr("cMsgBox.fCreate() invalid vButtonList: " + vButtonList);
	if (!fIsString(vIcon)) fErr("cMsgBox.fCreate() invalid vIcon: " + vIcon);
	if (!fIsString(vId)) fErr("cMsgBox.fCreate() invalid vId: " + vId);
	
	var vThis, s;

	
	
	s = '<div class="msgBox"><div class="box border"><div class="inner"><div class="centeralign">';
	s += '<h3><div>'+vHeader+'</div></h3>';
	s += '<div class="ht20"></div>';
	s += '<div class="infoText"><!--<div id="">aaa</div><span>--><div>'+vMessage+'</div><!--</span><div id="">bbb</div>--></div>';
	s += '<div class="ht20"></div>';
	if (vButtonList.length == 1)
	{
		
		s += '<a id="btnOK" class="button_sml" value="OK"><span>OK</span></a>';
	}
	else if  (vButtonList.length == 2)
	{
		s += '<a id="btnOK" class="button_sml" value="OK"><span>OK</span></a>';
		s += '<a id="btnCancel" class="button_sml" value="Cancel"><span>Cancel</span></a>';
	}
	s += '<div class="clear"></div></div></div></div></div>';

	vThis = document.createElement("div");
	vThis.id = vId;
	vThis.className = "cMsgBox";
	vThis.innerHTML = s;
	
	return vThis;
}

//----------------------------------------------------------------------------------------------------
//	handle signal.
//	return true to bubble signal to parent, false (default) to stop.
//----------------------------------------------------------------------------------------------------
cMsgBox.fOnSignal =
function(									//	(boolean) false to stop
	vThis,									//	(element) element processing signal
	vTarget,								//	(element) original target for signal
	vSignal,								//	(string) signal received
	vData									//	(*) extra data along with signal
)
{
	var vSize;
	
	switch (vSignal)
	{
	case 'Start':
	case 'Suspend':
	case 'Resume':
		return false;

	case "resize":
		vSize = fGetSize(vThis);
		fSetPos(vThis, {x: (vData.x - vSize.x) / 2, y: (vData.y - vSize.y) / 2});
		return false;
		
	case "click":
		if (vTarget.id == "btnOK" || vTarget.id == "btnCancel")
			cSys.fEndModal(vTarget.getAttribute("value"));
		return false;	
	
	}
	
	return false;
}