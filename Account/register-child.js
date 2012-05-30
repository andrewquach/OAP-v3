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
    var vStore = fGet("#eNav_Summary");
  	vStore.className = 'current-menu-item';
  	cSys.fStartRequest(vThis, "FetchSchRet", "Account/Register-Child.php", "FetchSch", {}, "Fetching schools...");
  	$(function() {
		$( "#eChildDoB" ).datepicker({
			changeMonth: true,
			changeYear: true,
			yearRange: "c-100:c",
			dateFormat: "dd-M-yy"
		});
	});
    return false;
  
  case "FetchSchRet":
    vData = vData.Data;
    vOpts = " <select id=\"eChildSchools\" class = \"input\"><option value=\"0\"></option>";
    for (i=0; i<vData.length; i++)
      vOpts += "<option value=\"" + vData[i]["SchoolId"] + "\">"
        + vData[i]["School"] + "</option>"; 
    vOpts += "</select>";
    vElm = fGet("#eSelSchools");
    vElm.innerHTML = vOpts;
    return false;
  
  case 'RegisterSuccessDlgRet':
	cSys.fGoto("my-child-account.html");	
	return false;	

  case "RegisterRet":
    vData = vData.Data;
    if (vData["Success"])
    {
      cSys.fStartModal(cPage.mThis, 'RegisterSuccessDlgRet', cMsgBox.fCreate('Child Registration','You have successfully register a child account!', ['OK']));
    }
    else
      fErr(vData["Err"]);
    return false;

  case "Register":
    
      // get all inputs
      cPage.mProfile["UserId"] = fGet("#eChildUserId").value;
      cPage.mProfile["Password"] = fGet("#eChildPassword").value;
      cPage.mProfile["Confirm"] = fGet("#eChildConfirm").value;
      cPage.mProfile["First"] = fGet("#eChildFirst").value;
      cPage.mProfile["Last"] = fGet("#eChildLast").value;
      cPage.mProfile["Gender"] = fGet("#eChildGender").value;
      cPage.mProfile["DoB"] = fGet("#eChildDoB").value;
      cPage.mProfile["School"] = fGet("#eChildSchools").value;
      // validate inputs
      if (cPage.mProfile["UserId"].length < 5) { fErr("Minimum length for Username is 5 characters.");  return false; }
      if (cPage.mProfile["UserId"].length > 30) { fErr("Maximum length for Username is 30 characters."); return false; }
      if (cPage.mProfile["UserId"].indexOf(" ") != -1) { fErr("Username cannot contain a space.");  return false; }
      if (!cPage.mProfile["Password"]) { fErr("Please provide a password.");  return false; }
      if (!cPage.mProfile["Password"].length > 30) { fErr("Maximum length for password is 30 characters.");  return false; }
      if (cPage.mProfile["Password"] != cPage.mProfile["Confirm"]) { fErr("Passwords do not match.");  return false; }
      if (cPage.mProfile["First"].length==0) { fErr("Please provide child first name.");  return false; }
      if (cPage.mProfile["Last"].length==0) { fErr("Please provide child last name.");  return false; }
      if (cPage.mProfile["Gender"].length==0) { fErr("Please provide your child's gender.");  return false; }
      if (cPage.mProfile["DoB"].length==0) { fErr("Please provide your child's Date of Birth.");  return false; }
      if (!cPage.mProfile["School"] || cPage.mProfile["School"]==0) { fErr("Please select your child's school.");  return false; }
            
      vElm = fGet("#eOops");
  	  vElm.style.display = "none";
      
      /* if (! fGet("#eAgree").checked) { fErr("Terms and Conditions need to be agreed to continue.");  return false; } */
      
      // register user
      cPage.mProfile["Password"] = cSys.fHash(cSys.kSeed, cPage.mProfile["Password"]);
      cPage.mProfile["Confirm"] = "";
      cSys.fStartRequest(vThis, "RegisterRet", "Account/Register-Child.php", "Register", cPage.mProfile, "Registering...");
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
