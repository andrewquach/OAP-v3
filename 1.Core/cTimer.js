//----------------------------------------------------------------------------------------------------
//	1.Core/cTimer.js
//----------------------------------------------------------------------------------------------------

//alert("1.Core/cTimer.js");

//----------------------------------------------------------------------------------------------------
//	cTimer namespace.
//----------------------------------------------------------------------------------------------------
var cTimer = {};

//----------------------------------------------------------------------------------------------------
//	private data.
//----------------------------------------------------------------------------------------------------
cTimer.xList = [];							//	pending requests
cTimer.xTimerId = -1;						//	timer id from setInterval()

//----------------------------------------------------------------------------------------------------
//	start timer.
//----------------------------------------------------------------------------------------------------
cTimer.fStart =
function(									//	(void)
	vTarget,								//	(element/function) target for signal
	vSignal,								//	(string) signal to dispatch on completion
	vDelay,									//	(int) in ms; delay
	vCount									//	(int) default 1; count to trigger; if 0 infinite
)
{
	if (fIsUndefined(vCount)) vCount = 1;
	if (!fIsElement(vTarget) && !fIsFunction(vTarget)) fErr("cTimer.fStart() invalid vTarget: " + vTarget);
	if (!fIsString(vSignal)) fErr("cTimer.fStart() invalid vSignal: " + vSignal);
	if (!fIsNumber(vDelay)) fErr("cTimer.fStart() invalid vDelay: " + vDelay);
	if (!fIsNumber(vCount)) fErr("cTimer.fStart() invalid vCount: " + vCount);

	var vItem;

	vItem = {Target: vTarget, Signal: vSignal, Delay: vDelay, Count: vCount,
		Start: cSys.fGetClientTime()};
	vItem.Last = vItem.Start;

	for (i = 0; i < cTimer.xList.length; i++)
		if ((cTimer.xList[i].Target == vTarget) && (cTimer.xList[i].Signal == vSignal))
			break;
	if (i < cTimer.xList.length)
		cTimer.xList[i] = vItem;
	else
		cTimer.xList.push(vItem);

	if (cTimer.xTimerId == -1)
		cTimer.xTimerId = setInterval("cTimer.xfOnInterval()", 50);
}

//----------------------------------------------------------------------------------------------------
//	end timer.
//----------------------------------------------------------------------------------------------------
cTimer.fEnd =
function(									//	(void)
	vTarget,								//	(element/function) target for signal
	vSignal									//	(string) default ""; signal to match
)
{
	if (fIsUndefined(vSignal)) vSignal = "";
	if (!fIsElement(vTarget) && !fIsFunction(vTarget)) fErr("cTimer.fEnd() invalid vTarget: " + vTarget);
	if (!fIsString(vSignal)) fErr("cTimer.fEnd() invalid vSignal: " + vSignal);

	var i;

	for (i = 0; i < cTimer.xList.length; i++)
		if ((cTimer.xList[i].Target == vTarget) && ((vSignal == "") ||
			(cTimer.xList[i].Signal == vSignal)))
			cTimer.xList.splice(i--, 1);

	if (cTimer.xList.length == 0)
	{
		clearInterval(cTimer.xTimerId);
		cTimer.xTimerId = -1;
	}
}

//----------------------------------------------------------------------------------------------------
//	handle startInterval().
//----------------------------------------------------------------------------------------------------
cTimer.xfOnInterval =
function(									//	(void)
)
{
	var vNow, vList, vItem, i;

	vNow = cSys.fGetClientTime();

	for (vList = [], i = 0; i < cTimer.xList.length; i++)
	{
		vItem = cTimer.xList[i];
		if (vNow - vItem.Last >= vItem.Delay)
		{
			vItem.Last += vItem.Delay;
			vList.push(vItem);
		}
	}

	for (; vList.length > 0; )
	{
		vItem = vList.shift();
		for (i = 0; i < cTimer.xList.length; i++)
			if (cTimer.xList[i] == vItem)
				break;
		if (i < cTimer.xList.length)
		{
			if (vItem.Count > 1)
				vItem.Count--;
			else if (vItem.Count == 1)
				cTimer.xList.splice(i, 1);
			cSys.fDispatch(vItem.Target, vItem.Signal);
		}
	}

	if (cTimer.xList.length == 0)
	{
		clearInterval(cTimer.xTimerId);
		cTimer.xTimerId = -1;
	}
}
