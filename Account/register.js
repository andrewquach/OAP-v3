//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mProfile = {};
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
  var i, vUserId, vPassword, vElm, vOpts;
  
  switch (vSignal)
  {
  case "Start2":
    var vStore = fGet("#eNav_Store");
  	vStore.className = 'current-menu-item';
  	$(function() {
		$( "#eParentDoB" ).datepicker({
			changeMonth: true,
			changeYear: true,
			yearRange: "c-100:c",
			dateFormat: "dd-M-yy"
		});
	});
	
    return false;

  case 'RegisterSuccessDlgRet':
  /*
	*/
	cSys.gAppVars['register'] = true; 
	cSys.fStartModal(vThis,'', cLgInBox.fCreate());	
	return false;	

  case "RegisterRet":
    vData = vData.Data;
    if (vData["Success"])
    {
      cSys.fStartModal(cPage.mThis, 'RegisterSuccessDlgRet', cMsgBox.fCreate('Account Registration','You have successfully register an account! Please login!', ['OK']));
    }
    else
      fErr(vData["Err"]);
    return false;

  case "Register":
    
      // get all inputs
      cPage.mProfile["UserId"] = fGet("#eParentUserId").value;
      cPage.mProfile["Password"] = fGet("#eParentPassword").value;
      cPage.mProfile["Confirm"] = fGet("#eParentConfirm").value;
      cPage.mProfile["ParentFirst"] = fGet("#eParentFirst").value;
      cPage.mProfile["ParentLast"] = fGet("#eParentLast").value;
      cPage.mProfile["ParentEmail"] = fGet("#eParentEmail").value;
      cPage.mProfile["ParentGender"] = fGet("#eParentGender").value;
      cPage.mProfile["ParentDoB"] = fGet("#eParentDoB").value;
      cPage.mProfile["Address"] = fGet("#eParentAddress").value;
      cPage.mProfile["NewsNPromo"] = fGet("#eParentNewsNPromo").checked ? 1 : 0;
      // validate inputs
      if (cPage.mProfile["UserId"].length < 5) { fErr("Minimum length for Username is 5 characters.");  return false; }
      if (cPage.mProfile["UserId"].length > 30) { fErr("Maximum length for Username is 30 characters."); return false; }
      if (cPage.mProfile["UserId"].indexOf(" ") != -1) { fErr("Username cannot contain a space.");  return false; }
      if (!cPage.mProfile["Password"]) { fErr("Please provide a password.");  return false; }
      if (!cPage.mProfile["Password"].length > 30) { fErr("Maximum length for password is 30 characters.");  return false; }
      if (cPage.mProfile["Password"] != cPage.mProfile["Confirm"]) { fErr("Passwords do not match.");  return false; }
      if (cPage.mProfile["ParentFirst"].length==0) { fErr("Please provide account first name.");  return false; }
      if (cPage.mProfile["ParentLast"].length==0) { fErr("Please provide account last name.");  return false; }      
      if (cPage.mProfile["ParentEmail"].length==0) { fErr("Please provide account email.");  return false; }
      if (cPage.mProfile["ParentEmail"].length && ! fValidEmail(cPage.mProfile["ParentEmail"])) { fErr("Parent's email is invalid.");  return false; }
      if (cPage.mProfile["ParentGender"].length==0) { fErr("Please provide your gender.");  return false; }
      if (cPage.mProfile["ParentDoB"].length==0) { fErr("Please provide your Date of Birth.");  return false; }    
      
      vElm = fGet("#eOops");
  	  vElm.style.display = "none";
      
      /* if (! fGet("#eAgree").checked) { fErr("Terms and Conditions need to be agreed to continue.");  return false; } */
      
      // register user
      cPage.mProfile["Password"] = cSys.fHash(cSys.kSeed, cPage.mProfile["Password"]);
      cPage.mProfile["Confirm"] = "";
      cSys.fStartRequest(vThis, "RegisterRet", "Account/Register.php", "Register", cPage.mProfile, "Registering...");
      return false;    
  } 

  return fSuper(arguments);
}
)

//----------------------------------------------------------------------------------------------------
function fErr(
  vErr
)
{
  var vElm;
  
  vElm = fGet("#eErr");
  vElm.innerHTML = vErr;
  vElm = fGet("#eOops");
  vElm.style.display = "block";
  //vElm.scrollIntoView(true);
}
