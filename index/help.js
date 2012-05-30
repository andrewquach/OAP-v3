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
  	 case 'Init':
      return;
  		
  	 case 'Start2':
  	  var vHome = fGet("#eNav_Help");
  	  vHome.className = 'current-menu-item';
      return;
 	
      
  }
  return fSuper(arguments);
}
)