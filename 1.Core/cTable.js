//----------------------------------------------------------------------------------------------------
//	1.Core/cTable.js
//
//	generate signal "change" on selection changes.
//----------------------------------------------------------------------------------------------------

//alert("1.Core/cTable.js");

//----------------------------------------------------------------------------------------------------
//	cTable namespace.
//----------------------------------------------------------------------------------------------------
var cTable = {};

//----------------------------------------------------------------------------------------------------
//	add a row.
//----------------------------------------------------------------------------------------------------
cTable.fAdd =
function(									//	(element) row appended
	vThis,									//	(element/string/array) element selector
	vClassName,								//	(string) classname of template row to use
	vIndex,									//	(int) row index to add to; if -1 at end
	vData									//	(object) row data
)
{
	if (!fIsString(vClassName)) fErr("cTable.fAdd() invalid vClassName: " + vClassName);
	if (!fIsNumber(vIndex)) fErr("cTable.fAdd() invalid vIndex: " + vIndex);
	if (!fIsObject(vData)) fErr("cTable.fAdd() invalid vData: " + vData);

	var vTemplate, vTr, vTd, i;

	vThis = fGet(vThis);
	
	for (i = 0; i < vThis.tFoot.rows.length; i++)
		if (vThis.tFoot.rows[i].className == vClassName)
			break;
	if (i == vThis.tFoot.rows.length) fErr("cTable.fAdd() invalid vClassName: " + vClassName);

	vTr = vThis.tFoot.rows[i].cloneNode(true);

	if ((vIndex >= 0) && (vIndex < vThis.tBodies[0].rows.length))
		vThis.tBodies[0].insertBefore(vTr, vThis.tBodies[0].rows[vIndex]);
	else
		vThis.tBodies[0].appendChild(vTr);

	for (i = 0; i < vTr.cells.length; i++)
		for (vKey in vData)
			vTr.cells[i].innerHTML = unescape(vTr.cells[i].innerHTML).replace(new RegExp("~" + vKey + "\\b", 
				"g"), vData[vKey]);

	return vTr;
}

//----------------------------------------------------------------------------------------------------
//	delete all rows.
//----------------------------------------------------------------------------------------------------
cTable.fDeleteAll =
function(									//	(element) row appended
	vThis									//	(element/string/array) element selector
)
{
	vThis = fGet(vThis);

	while (vThis.tBodies[0].rows.length > 0)
		vThis.tBodies[0].deleteRow(0);
}

//----------------------------------------------------------------------------------------------------
//	delete a row by value.
//----------------------------------------------------------------------------------------------------
cTable.fDelete =
function(									//	(element) row appended
	vThis,									//	(element/string/array) element selector
	vValue									//	(string) value of row
)
{
	var i;
	
	vThis = fGet(vThis);

	for (i = 0; i < vThis.tBodies[0].rows.length; i++)
		if (fGet([vThis.tBodies[0].rows[i].cells[0], "#eSelect"]).getAttribute("data") == vValue)
		vThis.tBodies[0].deleteRow(i--);
}

//----------------------------------------------------------------------------------------------------
//	select a row by value.
//----------------------------------------------------------------------------------------------------
cTable.fSelect =
function(									//	(void)
	vThis,									//	(element/string/array) element selector
	vValue,									//	(string) value of row
	vSelect									//	(boolean) whether selected
)
{
	var i;
	
	vThis = fGet(vThis);
	
	for (i = 0; i < vThis.tBodies[0].rows.length; i++)
		if (fGet([vThis.tBodies[0].rows[i].cells[0], "#eSelect"]).getAttribute("data") == vValue)
			fGet([vThis.tBodies[0].rows[i].cells[0], "#eSelect"]).checked = vSelect;
	cSys.fDispatch(vThis, "change", null, true);
}

//----------------------------------------------------------------------------------------------------
//	get values of all rows.
//----------------------------------------------------------------------------------------------------
cTable.fGetAll =
function(									//	(array)
	vThis									//	(element/string/array) element selector
)
{
	var vList, i;
	
	vThis = fGet(vThis);
	
	vList = [];
	for (i = 0; i < vThis.tBodies[0].rows.length; i++)
		vList.push(fGet([vThis.tBodies[0].rows[i].cells[0], "#eSelect"]).getAttribute("data"));
	return vList;
}

//----------------------------------------------------------------------------------------------------
//	get values of selected rows.
//----------------------------------------------------------------------------------------------------
cTable.fGetSelected =
function(									//	(array)
	vThis									//	(element/string/array) element selector
)
{
	var vList, i;
	
	vThis = fGet(vThis);
	
	vList = [];
	for (i = 0; i < vThis.tBodies[0].rows.length; i++)
		if (fGet([vThis.tBodies[0].rows[i].cells[0], "#eSelect"]).checked)
			vList.push(fGet([vThis.tBodies[0].rows[i].cells[0], "#eSelect"]).getAttribute("data"));
	return vList;
}

//----------------------------------------------------------------------------------------------------
//	handle signal.
//	return true to bubble signal to parent, false (default) to stop.
//----------------------------------------------------------------------------------------------------
cTable.fOnSignal =
function(									//	(boolean) false to stop
	vThis,									//	(element) element processing signal
	vTarget,								//	(element) original target for signal
	vSignal,								//	(string) signal received
	vData									//	(*) extra data along with signal
)
{
	var i;

	switch (vSignal)
	{
	case "change":
		for (i = 0; i < vThis.tBodies[0].rows.length; i++)
			if (!fGet([vThis.tBodies[0].rows[i].cells[0], "#eSelect"]).checked)
				break;
		fGet([vThis.tHead, "#eSelect"]).checked = ((i > 0) && 
			(i == vThis.tBodies[0].rows.length));
		return true;
	
	case "click":
		if (vTarget.id == "eSelect")
		{
			if (fContains(vThis.tHead, vTarget))
				for (i = 0; i < vThis.tBodies[0].rows.length; i++)
					fGet([vThis.tBodies[0].rows[i], "#eSelect"]).checked = vTarget.checked;
			cSys.fDispatch(vThis, "change", null, true);
			return false;
		}
		return true;
	}

	return true;
}
