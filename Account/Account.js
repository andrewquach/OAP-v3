
//----------------------------------------------------------------------------------------------------
//  globals.
//----------------------------------------------------------------------------------------------------

cPage.mAboutMe = new cDataList;
cPage.mUpload = false;
cPage.mExt = '';
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
    case "Start2": 
      var vMySummary = fGet("#eNav_Summary");
  	  vMySummary.className = 'current-menu-item';
  	  var vMySummary = fGet("#eNav_Assignment");
  	  vMySummary.className = 'current-menu-item';
      cSys.fStartRequest(vThis, "ListAccountRet", "Account/Account.php", "ListAccount", {}, "Fetching account...");
     	
      cPage.mAboutMe.fInit({
        'tbl': 'eListAboutMe',
        'core': new cAboutMeList,
        'this': this
      });
      
      return false;

    case 'UpdateNameRet':
    case 'UpdateEmailRet':
    case 'UpdatePasswordRet':
    case 'UpdateAddressRet':
      cSys.fStartRequest(vThis, "ListAccountRet", "Account/Account.php", "ListAccount", {}, "Fetching account...");       
      return false;

    case 'ListAccountRet':    
      var vData = vData.Data;
      var vChildren = vData.Children;
      fInitAboutMe(vData.me);
      if (vChildren.length == 0)
      {
      	if (cSys.gCookies["Role"] != '2'){
      		vChildrenPart = fGet("#eChildren");
      		vChildrenPart.innerHTML = "You have not added any child account";
      	}
      }
      else
      {
      	if (cSys.gCookies["Role"] != '2'){	
      		vChildrenPart = fGet("#eChildren");
      		vChildrenPart.innerHTML = '';
      		for (var i=0; i<vChildren.length; i++)
      		{
      			vFullName = vChildren[i].FirstName+" "+vChildren[i].LastName;
      			vChildrenPart.innerHTML += "<li><span>Child "+(i+1)+":</span><div>"+vFullName+"</div></li>";      	
      		}
      	}
      }
      return false;

    case 'UploadPic':
        var vIframe = fGet('#eIframe');
        var vHtml = vIframe.contentDocument || vIframe.contentWindow.document;
        var vUserId = vHtml.getElementById('eUserId');
        vUserId.setAttribute('value', cSys.gCookies['IdUser']);
        var vFile = vHtml.getElementById('eFile');
        vFile.click();
        return false;
        
      break;
  }

  if (cPage.mAboutMe.fIsReady())
    cPage.mAboutMe.fSignal({'signal': vSignal, 'target': vTarget});
  

  return fSuper(arguments);
}
)

//----------------------------------------------------------------------------------------------------
function fRefresh(
  vThis
)
{
  // noop
}

//----------------------------------------------------------------------------------------------------
//  perform network requests on behalf of 'subordinate' classes.
//----------------------------------------------------------------------------------------------------
function fCmd(
  vCmd,
  vHash
)
{
  cSys.fStartRequest(cPage.mThis, vCmd + 'Ret', "Account/Account.php", vCmd, vHash, 'Updating account...');  
}

//----------------------------------------------------------------------------------------------------
//  transform stats so that we can display it in a row-base format easily.
//----------------------------------------------------------------------------------------------------
function fTransformInfo(
  vInfo
)
{
  var vRows = [];
  
  vRows.push({'Field': 'Name', 'Info': vInfo.FirstName + ' ' + vInfo.LastName});
  vRows.push({'Field': 'Email', 'Info': vInfo.Email});
  vRows.push({'Field': 'Address', 'Info': vInfo.Address});
  vRows.push({'Field': 'Password', 'Info': 'xxxxxxxxxx'});
  var vAccountName = fGet("#AccountName");
  vAccountName.innerHTML = vInfo.FirstName + ' ' + vInfo.LastName + '\'s Account';
  return vRows;
}

//----------------------------------------------------------------------------------------------------
function fInitAboutMe(
  vMe
)
{
  var vInfo = fTransformInfo(vMe)

  // table display
  cPage.mAboutMe.fForgetAll();
  cPage.mAboutMe.fSetActive(1);
  for (var i=0; i<vInfo.length; i++)
    cPage.mAboutMe.fAdd(vInfo[i]);
  cPage.mAboutMe.fRefresh();

  // profile pic
  if (vMe.ProfilePic)
    fGet('#ePic').setAttribute('src', '../photos/' + vMe.ProfilePic);
}


//----------------------------------------------------------------------------------------------------
function fOnInitUploadImage(
)
{
  if (cPage.mUpload)
  {
    var rand = (new Date()).getTime();
    fGet('#ePic').setAttribute('src', '../photos/' + cSys.gCookies['IdUser'] + '.' + cPage.mExt + '?v=' + rand);
    cPage.mUpload = false;
  }
}

//----------------------------------------------------------------------------------------------------
function fOnUploadImage(
  vExt
)
{
  cPage.mExt = vExt;
  cPage.mUpload = true;
}
































