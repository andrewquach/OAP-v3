//----------------------------------------------------------------------------------------------------
//	2.Widgets/cCalBox.js
//
//----------------------------------------------------------------------------------------------------

//alert("Lib/cCalBox.js");

//----------------------------------------------------------------------------------------------------
//	cCalBox namespace.
//----------------------------------------------------------------------------------------------------
var cCalBox = {};

//----------------------------------------------------------------------------------------------------
//	constants
//----------------------------------------------------------------------------------------------------
cCalBox.kDayName = ["S", "M", "Tu", "W", "Th", "F", "S"];
cCalBox.kMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
cCalBox.kMax = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//----------------------------------------------------------------------------------------------------
//	create message box.
//----------------------------------------------------------------------------------------------------
cCalBox.fCreate =
function(									//	(element) element created
	vDate									//	(date)
)
{
	if (fIsUndefined(vDate)) vDate = null;

	var vTable;
	var vNow;
	var s, i, j;
	
	s = "<tr><td><button class=\"xPrev\">&lt;</button></td><td colspan=\"5\" style=\"text-align: center;\"></td><td><button class=\"xNext\">&gt;</button></td></tr>";
	s += "<tr>";
	for (i = 0; i < 7; i++)
		s += "<td style=\"text-align: center;\">" + cCalBox.kDayName[i] + "</td>";
	s += "</tr>";
	for (i = 0; i < 6; i++)
	{
		s += "<tr>";
		for (j = 0; j < 7; j++)
			s += "<td width=\"20\" style=\"text-align: center;\"></td>";
		s += "</tr>";
	}
	s += "<tr><td colspan=\"7\" class=\"xButtons\"><button class=\"xCancel\">Cancel</button> <button class=\"xApply\">Apply</button></td></tr>";
	s += "</table>";
	
	vNow = new Date();
	if (vDate == null)
		vDate = new Date();
	if (vDate.getTime() < vNow.getTime())
		vDate = vNow;
	
	vTable = document.createElement("table");
	vTable.className = "cCalBox";
	vTable.innerHTML = s;
	cCalBox.xfSelect(vTable, vDate);
	
	return vTable;
}

//----------------------------------------------------------------------------------------------------
//	handle signal.
//	return true to bubble signal to parent, false (default) to stop.
//----------------------------------------------------------------------------------------------------
cCalBox.fOnSignal =
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
	case "Start":
	case "Suspend":
	case "Resume":
		return false;

	case "resize":
		vSize = fGetSize(vThis);
		fSetPos(vThis, {x: (vData.x - vSize.x) / 2, y: (vData.y - vSize.y) / 2});
		return false;

	case "click":
		switch (vTarget.className)
		{
		case "xActive":
		case "xHover":
			vDate = cCalBox.xfGetSelected(vThis);
			vDate.setDate(vTarget.innerHTML);
			cCalBox.xfSelect(vThis, vDate);
			return false;
			
		case "xPrev":
			vDate = cCalBox.xfGetSelected(vThis);
			vDate = new Date(
				(vDate.getMonth() == 0) ? vDate.getFullYear() - 1 : vDate.getFullYear(),
				(vDate.getMonth() - 1) % 12,
				(vDate.getDate() > cCalBox.kMax[(vDate.getMonth() - 1) % 12]) ? cCalBox.kMax[(vDate.getMonth() - 1) % 12] : vDate.getDate());
			cCalBox.xfSelect(vThis, vDate);
			return false;
			
		case "xNext":
			vDate = cCalBox.xfGetSelected(vThis);
			vDate = new Date(
				(vDate.getMonth() == 11) ? vDate.getFullYear() + 1 : vDate.getFullYear(),
				(vDate.getMonth() + 1) % 12,
				(vDate.getDate() > cCalBox.kMax[(vDate.getMonth() + 1) % 12]) ? cCalBox.kMax[(vDate.getMonth() + 1) % 12] : vDate.getDate());
			cCalBox.xfSelect(vThis, vDate);
			break;
			
		case "xApply":
			cSys.fEndModal(cCalBox.xfGetSelected(vThis));
			return false;
			
		case "xCancel":
			cSys.fEndModal();
			return false;
		}
		break;
	}
	return true;
}

//----------------------------------------------------------------------------------------------------
//	select
//----------------------------------------------------------------------------------------------------
cCalBox.xfSelect =
function(
	vThis,									//	(element) element processing signal
	vDate									//	(date)
)
{
	
	var vFirst, vMax;
	var vDay, vRow, vCol;
	var vNow;

	vThis = fGet(vThis);
	
	vNow = new Date();
		
	vThis.rows[0].cells[1].innerHTML = cCalBox.kMonthName[vDate.getMonth()] + ", " + vDate.getFullYear();
	
	vMax = cCalBox.kMax[vDate.getMonth()];
	if (vDate.getMonth() == 1)
		if (vDate.getFullYear() % 400 == 0)
			vMax = 29;
		else if (vDate.getFullYear() % 100 == 0)
			vMax = 28;
		else if (vDate.getFullYear() % 4 == 0)
			vMax = 29;
	vFirst = new Date(vDate.getFullYear(), vDate.getMonth(), 1);
	
	vDay = 1 - vFirst.getDay();
	for (vRow = 2; vRow <= 7; vRow++)
		for (vCol = 0; vCol < 7; vCol++)
		{
			if ((vDay > 0) && (vDay <= vMax))
			{
				vThis.rows[vRow].cells[vCol].innerHTML = vDay;
				if (vDay == vDate.getDate())
					vThis.rows[vRow].cells[vCol].className = "xSelected";
				else if ((vDate.getFullYear() < vNow.getFullYear()) ||
					((vDate.getFullYear() == vNow.getFullYear()) && (vDate.getMonth() < vNow.getMonth())) ||
					((vDate.getFullYear() == vNow.getFullYear()) && (vDate.getMonth() == vNow.getMonth()) && (vDay < vNow.getDate())))
					vThis.rows[vRow].cells[vCol].className = "xDisabled";
				else
					vThis.rows[vRow].cells[vCol].className = "xActive";
			}
			else
			{
				vThis.rows[vRow].cells[vCol].innerHTML = "";
				vThis.rows[vRow].cells[vCol].className = "";
			}
			vDay++;
		}

	fGet([vThis, ".xPrev"]).disabled = (vDate.getFullYear() < vNow.getFullYear()) ||
		((vDate.getFullYear() == vNow.getFullYear()) && (vDate.getMonth() <= vNow.getMonth()));
}

//----------------------------------------------------------------------------------------------------
//	get selected date
//----------------------------------------------------------------------------------------------------
cCalBox.xfGetSelected =
function(									//	(date)
	vThis									//	(element/string/array) element selector
)
{
	var vHeader, vYear, vMonth, vDay;

	vThis = fGet(vThis);
	
	vHeader = vThis.rows[0].cells[1].innerHTML;
	vYear = vHeader.split(/ /)[1];
	vMonth = vHeader.split(/,/)[0];
	for (i = 0; i < cCalBox.kMonthName.length; i++)
		if (vMonth == cCalBox.kMonthName[i])
			vMonth = i;
	vDay = fGet([vThis, ".xSelected"]).innerHTML;
	return new Date(vYear, vMonth, vDay);
}
