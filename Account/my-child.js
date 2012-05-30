//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
cPage.mProfile = {};
var vChildrens = {};
var vChildId;

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
  		
  	 case 'Start2':
  	  var vMySummary = fGet("#eNav_Summary");
  	  vMySummary.className = 'current-menu-item';
  	  cSys.fStartRequest(vThis, 'ListChildrenRet', 'Account/Account.php', 'ListChildren', {}, 'Fetching...');
      return false;
      
     case 'ListChildrenRet':
      var vName = vData.Data.ParentName;
      var vChildren = vData.Data.Children;
      
	  	
	  	vChildrenPart = fGet("#eChildren");
		var i;
	  	for (i=0; i<vChildren.length; i++)
	  	{
	  		vFullName = vChildren[i].FirstName+" "+vChildren[i].LastName+" ";
	  		vChildrenPart.innerHTML += "<div id=\"childElement"+vChildren[i].Id+"\"><div class=\"manageChild\"><div class=\"childName\"><span><b>"+(i+1)+". "+"</b>" +vFullName+"</span><div class=\"childTool\"><a id=\"eEditChild"+i+"\" data=\""+vChildren[i].Id+"\" class=\"button_sml\"><span>Edit</span></a> <a id=\"eDeleteChild"+i+"\" data=\""+vChildren[i].Id+"\" class=\"button_sml\"><span>Delete</span></a></div><div class=\"clear\"></div></div><div class=\"bookAssigned\"><b>Total of Items Assigned: </b><div id=\"\">"+vChildren[i].NoItemOwn+"</div></div></div><div>";
	  		vChildrens[vChildren[i].Id] = vChildren[i].NoItemOwn;
	  	}
		
	  if (i==5){
		vCreate = fGet("#eCreateChildAccount");
		vCreate.style.display='none';
	  }
		
   
      for (var i=0; i<1; i++){
      	vFullName = vName[i].FirstName+' '+vName[i].LastName;
      	var vParentName = fGet("#ParentName");
      	vParentName.innerHTML = vFullName +" 's Account";
      	vParentName = fGet("#ParentName2");
      	vParentName.innerHTML = vFullName;      	
      	vParentEmail = fGet("#ParentEmail");
      	vParentEmail.innerHTML = vName[i].Email; 
      }
      return false;
	  
    case 'Edit':
		vChildId = vData;
		cSys.fStartRequest(vThis, 'ListChildAccountRet', 'Account/Account.php', 'ListChildAccount', {'childId':vChildId}, 'Fetching...');
		return false;
	
	case 'ListChildAccountRet':
		var vChild = vData.Data.Child;
  	  	vField = fGet("#eUserId");
  	  	vField.value = vChild[0].Username;
  	  	fGet('#childElement'+vChild[0].Id).appendChild(
    		fGet('#eEdit')
  		);
		fShow2('eEdit',true);
		return false;
	
	case 'Delete':
		vChildId = vData;
		if (vChildrens[vChildId] > 0)
			cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBoxError.fCreate('Manage Children Account','You cannot delete this child account whom has some item assigned to!', ['OK']));
		else
			cSys.fStartModal(vThis, 'DeleteOKDlgRet', cMsgBox.fCreate('Manage Children Account','Are you sure to delete the child\'s account?', ["OK","Cancel"]));
		return false;
	
	case 'DeleteOKDlgRet':
		if (vData == "OK")
			cSys.fStartRequest(vThis, 'DeleteChildAccountRet', 'Account/Register-Child.php', 'Delete', {'childId':vChildId}, 'Deleting…');
		return false;
		
	case 'DeleteChildAccountRet':
		cSys.fGoto('my-child-account.html');    
		return;
		
	case "Register":
    
      // get all inputs
      cPage.mProfile["Id"] = vChildId;
      cPage.mProfile["UserId"] = fGet("#eUserId").value;
      cPage.mProfile["Password"] = fGet("#ePassword").value;
      cPage.mProfile["Confirm"] = fGet("#eConfirm").value;
      cPage.mProfile["First"] = fGet("#eUserId").value;
      cPage.mProfile["Last"] = "";
      // validate inputs
      if (cPage.mProfile["UserId"].length < 5) { fErr("Minimum length for Username is 5 characters.");  return false; }
      if (cPage.mProfile["UserId"].length > 30) { fErr("Maximum length for Username is 30 characters."); return false; }
      if (cPage.mProfile["UserId"].indexOf(" ") != -1) { fErr("Username cannot contain a space.");  return false; }
      if (!cPage.mProfile["Password"]) { fErr("Please provide a password.");  return false; }
      if (!cPage.mProfile["Password"].length > 30) { fErr("Maximum length for password is 30 characters.");  return false; }
      if (cPage.mProfile["Password"] != cPage.mProfile["Confirm"]) { fErr("Passwords do not match.");  return false; }            
      vElm = fGet("#eOops");
  	  vElm.style.display = "none";
      
      /* if (! fGet("#eAgree").checked) { fErr("Terms and Conditions need to be agreed to continue.");  return false; } */
      
      // register user
      cPage.mProfile["Password"] = cSys.fHash(cSys.kSeed, cPage.mProfile["Password"]);
      cPage.mProfile["Confirm"] = "";
      cSys.fStartRequest(vThis, "EditRet", "Account/Register-Child.php", "Edit", cPage.mProfile, "Editing...");
      return false;
      
    case "EditRet":
      	vData = vData.Data;
    	if (vData["Success"])
    	{
      		cSys.fStartModal(cPage.mThis, 'EditSuccessDlgRet', cMsgBox.fCreate('Manage Children Account','You have successfully edit a child account!', ['OK']));
    	}
    	else
      		fErr(vData["Err"]);
    	return false;
    
    case "EditSuccessDlgRet":
    	cSys.fGoto('my-child-account.html');    
		return;
		
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
