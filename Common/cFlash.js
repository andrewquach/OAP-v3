//----------------------------------------------------------------------------------------------------
//  cFlash.js
//
//----------------------------------------------------------------------------------------------------

//alert("cFlash.js");

//----------------------------------------------------------------------------------------------------
//  cTab namespace.
//----------------------------------------------------------------------------------------------------
var cFlash = {};


//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
var mAnchor, mResult = {};

//----------------------------------------------------------------------------------------------------
//  create message box.
//----------------------------------------------------------------------------------------------------
cFlash.fCreate =
function(                 //  (element) element created
  vData
)
{
  var vTag;
  
  vTag = "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" codebase=\"http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0\" id=\"eFlash\" width=\"800\" height=\"600\">";
  vTag += "<param name=\"movie\" value=\"FTPlayer.swf\">";
  vTag += "<param name=\"myFlash\" value=\"FTPlayer.swf\">";
  vTag += "<param name=\"allowScriptAccess\" value=\"always\">";
  vTag += "<param name=\"wmode\" value=\"transparent\"/>";
  vTag += "<embed src=\"FTPlayer.swf\" name=\"myFlash\" allowScriptAccess=\"always\" width=\"800\" height=\"600\" wmode=\"transparent\"/>";
  vTag += "</object>";
  
  // need this 'conversion' as the framework modified the 
  // original form it's being stored when called
  // mResult['Results'] = [];

  mResult['Mode'] = vData['Mode'];
  mResult['Raw'] = vData['Raw'];
  mResult['Qtns'] = [];
  mResult['Target'] = vData['Target'];
  mResult['Start'] = new Date();

  // check if there are any qtns
  if (! vData['Qtns'] || vData['Qtns'].length == 0)
    return false;

  // set the marks for all qtns to be 1.
  for (var i=0; i<vData['Qtns'].length; i++)
  {
    vData['Qtns'][i]['TotalMark'] = 1;
    mResult['Qtns'].push(vData['Qtns'][i]);
  }
  
  // dynamically create html element
  mAnchor = document.createElement('DIV');
  mAnchor.className = 'cFlash';
  mAnchor.id = 'eFlashDiv';
  mAnchor.innerHTML = vTag;
  
  return mAnchor;
}

//----------------------------------------------------------------------------------------------------
//  handle signal.
//  return true to bubble signal to parent, false (default) to stop.
//----------------------------------------------------------------------------------------------------
cFlash.fOnSignal =
function(                 //  (boolean) false to stop
  vThis,                  //  (element) element processing signal
  vTarget,                //  (element) original target for signal
  vSignal,                //  (string) signal received
  vData                 //  (*) extra data along with signal
)
{
  var vElm;
  var vSize;
  
  switch (vSignal)
  {
  case "Start":
  case "Suspend":
  case "Resume":
    return false;

  case "OnCloseFlashWnd":
    cSys.fEndModal(mResult);
    return false;
    
  case "click":
    switch (vTarget.id)
    {
    case "eClose":
      vElm = window.document["myFlash"];
      vElm.fClose();
      return false;
    }
    break;
  }
  return true;
}

//----------------------------------------------------------------------------------------------------
function fOnCloseFlashWnd(
)
{
  //console.log("fOnCloseFlashWnd:  Flash called us to close.");
  cSys.fDispatch(mAnchor, "OnCloseFlashWnd", null);
}


//----------------------------------------------------------------------------------------------------
function fFlashUser(
)
{	
	 if (cSys.gCookies["oap_uname"])
     {
     	if	(cSys.gCookies["Role"] == 1)
     		return "Parent";
     	else if (cSys.gCookies["Role"] == 2)
     		return "Student";
     }

	 return "Student";
} 

//----------------------------------------------------------------------------------------------------
function fDataReceived(
  vData
)
{
  //console.log("fDataReceived = " + fDump(vData));
}

//----------------------------------------------------------------------------------------------------
function fSubmitResult(
  vData
)
{
  if (vData.mode)
    vData.Mode = vData.mode;

  switch (vData.Mode)
  {
    case 'Meta':  // 'favorite'
      mResult['Target'].fFlashRet({
        'type': 'Meta',
        'data': vData['Qtns']
      });
      break;

    case 'Submit':
    case 'Save':
        cSys.fEndModal();
      for (var i=0; i<vData['Qtns'].length; i++)
        vData['Qtns'][i].Order = +i + 1;
      mResult['Target'].fFlashRet({
        'data': vData['Qtns'], 
        'type': (vData.Mode == 'Submit') ? 'Submit': 'SaveToResume',
        'start': mResult['Start'],
        'end': new Date(),
        'raw': vData['Raw']
      });
      break;

    case 'Redo':
      cSys.fEndModal();
      mResult['Target'].fFlashRet({
        'type': 'Redo'
      });      
      break;
  }
}

//----------------------------------------------------------------------------------------------------
function fSubmitMeta(
  vData
)
{
  mResult['Target'].fFlashRet({'data': vData, 'type': 'meta'});
  // mResult["Meta"] = vData;
}

//----------------------------------------------------------------------------------------------------
function fFlashReady(
)
{
  return { "Qtns": mResult["Qtns"],  "Instruction":"", "ShowResult":1, 
    "TimeLimit":60, "Mode":mResult["Mode"], "Raw":mResult["Raw"] };
}

