//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------

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
  var vElm, vUserId, vEmail;
  cPage.mThis = vThis;
  
  switch (vSignal)
  {
  case "Start2":
  	var vStore = fGet("#eNav_Store");
  	vStore.className = 'current-menu-item';
    return false;
    
  case "ResetPasswdRet":
    vData = vData.Data;
    if (! vData["Success"])
    {
      cSys.fStartModal(vThis, "", cMsgBoxError.fCreate("Sign-In Problem",vData["Err"], ["OK"]));
      return false;
    }
    fNotify("Your password has been reset.  An email containing <br>your new password has been sent to you.");
    return false;
    
  case "RetrieveUserIdRet":
    vData = vData.Data;
    if (! vData["Success"])
    {
      cSys.fStartModal(vThis, "", cMsgBoxError.fCreate("Sign-In Problem",vData["Err"], ["OK"]));     
      return false;
    }
    fNotify("Your User ID has been sent to <br>" + fGet("#eEmail").value);
    return false;

  	case "ResetPassword":
      vUserId = fTrim(fGet("#eUserId2").value);
      if (vUserId.length == 0)
      {
        cSys.fStartModal(vThis, "", cMsgBoxError.fCreate("Sign-In Problem","Please provide a valid User ID.", ["OK"]));
        return false;
      }
      cSys.fStartRequest(vThis, "ResetPasswdRet", "Account/Forgot.php", "ResetPasswd", 
          {"Username": vUserId}, "Resetting Password...");
      return false;
  
 	case "RetrieveUsername":
      vEmail = fTrim(fGet("#eEmail").value);
      if (vEmail.length == 0 || !fValidEmail(vEmail))
      {
        cSys.fStartModal(vThis, "", cMsgBoxError.fCreate("Sign-In Problem","Please provide a valid Email.", ["OK"]));
        return false;
      }
      cSys.fStartRequest(vThis, "RetrieveUserIdRet", "Account/Forgot.php", "RetrieveUserId", 
          {"Email": vEmail}, "Retrieving User ID...");
      return false; 
    break;
  } 

  return fSuper(arguments);
}
)

//----------------------------------------------------------------------------------------------------
function fNotify(
  vMsg
)
{
  fGet("#eErr").innerHTML = vMsg;
  fGet("#eMsg").style.display = "block";
  fGet("#eForgot").style.display = "none";
}
