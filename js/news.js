//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;

//----------------------------------------------------------------------------------------------------
//  handle signal.
//  return true to bubble signal to parent, false (default) to stop.
//----------------------------------------------------------------------------------------------------
cPage.fOnSignal = fExtend(cPage.fOnSignal,
function(                 //  (boolean) true if consumed
  vThis,                  //  (element) element processing signal
  vTarget,                //  (element) original target for signal
  vSignal,                //  (string) signal received
  vData                 //  (mixed) extra data along with signal
)
{
  cPage.mThis = vThis;

  switch (vSignal)
  {
  	 case 'Start': 
      console.log('hello');
      return false;
  	
    case 'click':
      switch (vTarget.id)
      {
		case "eNews3":
		  cSys.fGoto("news.html");
		  return false;
		case "ePromotion2":
		  cSys.fGoto("promotions.html");
		  return false;
      }
      break;
  } 

  return fSuper(arguments);
}
)