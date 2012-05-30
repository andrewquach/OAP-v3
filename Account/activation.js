//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mProfile = {};
cPage.mThis = null;
cPage.mErr = { 'OK': 0, 'EMPTY_FIELD': 1, 'CURRENCY_ERR': 2 };

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
    var vStore = fGet("#eNav_Activation");
  	vStore.className = 'current-menu-item';
  	cSys.fStartRequest(vThis, "FetchTransactRet", "Account/Activation.php", "FetchTransact", {}, "Fetching transactions…");
    return false;
  
  case 'FetchTransactRet':
  	  var vData = vData.Data;
      // list all pending transactions initiated by this sales rep
      var vTrans = fEncodeTransactions(vData);
      fResetDropList({'div': 'eTransactsDiv', 'id': 'eTransacts'}, vTrans);
      fGet('#eActivatedBy').innerHTML = cSys.gCookies["oap_uname"];
      return;
      
  case 'CreateNewCustomer':
  	  	if (document.eFormActivation.eNewCustomer.checked)
        {
        	fShow2('eFormRegistration', true);
        	document.eFormActivation.eCustUsername.disabled = true;
        	document.getElementById('eActivate').style.visibility='hidden'; // hide 
       	}
        else
        {
        	fShow2('eFormRegistration', false);
        	document.eFormActivation.eCustUsername.disabled = false;
        	document.getElementById('eActivate').style.visibility='visible'; // show 
 		}
 		return;
  
  case 'Activate':
  		var vErr = fValidInputs();
        if (vErr != cPage.mErr.OK)
          fPromptPgErr(vErr);
        else
        {
          //console.log('Transaction Id: ' + fDropListData('eTransacts'));
          cSys.fStartRequest(vThis, 'ActivateRet', 'Account/Activation.php', 'Activate', 
            { 
              'CustUsername': fGet('#eCustUsername').value, 
              'Receipt': fGet('#eReceipt').value, 
              'ReceiptAmt': fGet('#eReceiptAmt').value, 
              'TransactId': fDropListData('eTransacts'),
              'SalesRepUsername': cSys.gCookies["oap_uname"]
            }, 'Activating...');
        }
  
  		return;
  
  
  case 'ActivateRet':
      var vData = vData.Data;
      switch (vData.success)
      {
        case '0':
          cSys.fStartModal(cPage.mThis, "Cancel", cMsgBox.fCreate("Purchase Activation", vData.msg, ["Ok"]));
          break;

        case '1':
          cSys.fStartModal(cPage.mThis, "ActivationSuccessDlgRet", cMsgBox.fCreate("Purchase Activation", "Purchase has been activated successfully in the system. Please assist the customer to login and verify!", ["OK"]));
          break;
      }
      return;
  
  case 'ActivationSuccessDlgRet':
  		cSys.fGoto("activation.html");
  		return;	

  case "RegisterRet":
    vData = vData.Data;
    if (vData["Success"])
    {
      var vErr = fValidInputs();
        if (vErr != cPage.mErr.OK)
          fPromptPgErr(vErr);
        else
        {
          //console.log('Transaction Id: ' + fDropListData('eTransacts'));
          cSys.fStartRequest(vThis, 'ActivateRet', 'Account/Activation.php', 'Activate', 
            { 
              'CustUsername': cPage.mProfile["UserId"], 
              'Receipt': fGet('#eReceipt').value, 
              'ReceiptAmt': fGet('#eReceiptAmt').value, 
              'TransactId': fDropListData('eTransacts'),
              'SalesRepUsername': cSys.gCookies["oap_uname"]
            }, 'Activating...');
        }
    }
    else
      fErr(vData["Err"]);
    return false;

  case "Register":
      var vErr = fValidInputs();
      if (vErr != cPage.mErr.OK)
      {
          fPromptPgErr(vErr);
          return;
      }
      
      // get all inputs
      cPage.mProfile["UserId"] = fGet("#eParentUserId").value;
      cPage.mProfile["Password"] = fGet("#eParentPassword").value;
      cPage.mProfile["Confirm"] = fGet("#eParentConfirm").value;
      cPage.mProfile["ParentFirst"] = fGet("#eParentFirst").value;
      cPage.mProfile["ParentLast"] = fGet("#eParentLast").value;
      cPage.mProfile["ParentEmail"] = fGet("#eParentEmail").value;
      cPage.mProfile["Address"] = "";
      cPage.mProfile["NewsNPromo"] = 1;
      // validate inputs
      if (cPage.mProfile["UserId"].length < 5) { fErr("Minimum length for Username is 5 characters.");  return false; }
      if (cPage.mProfile["UserId"].length > 30) { fErr("Maximum length for Username is 30 characters."); return false; }
      if (cPage.mProfile["UserId"].indexOf(" ") != -1) { fErr("Username cannot contain a space.");  return false; }
      if (!cPage.mProfile["Password"]) { fErr("Please provide a password.");  return false; }
      if (!cPage.mProfile["Password"].length > 30) { fErr("Maximum length for password is 30 characters.");  return false; }
      if (cPage.mProfile["Password"] != cPage.mProfile["Confirm"]) { fErr("Passwords do not match.");  return false; }
      if (cPage.mProfile["ParentFirst"].length==0) { fErr("Please provide account first name.");  return false; }
      if (cPage.mProfile["ParentLast"].length==0) { fErr("Please provide acount last name.");  return false; }      
      if (cPage.mProfile["ParentEmail"].length==0) { fErr("Please provide account email.");  return false; }
      if (cPage.mProfile["ParentEmail"].length && ! fValidEmail(cPage.mProfile["ParentEmail"])) { fErr("Parent's email is invalid.");  return false; }     
      
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

//----------------------------------------------------------------------------------------------------
//  encode transaction-ids into a dropdown list.
//----------------------------------------------------------------------------------------------------
function fEncodeTransactions(
  vList
)
{
  var vRet = [];

  for (var i=0; i<vList.length; i++)
  {
    var vItem = [];
    vItem.data = vList[i].TransactId;
    vItem.text = vList[i].TransactId;
    vRet.push(vItem);
  }

  return vRet;
}

//----------------------------------------------------------------------------------------------------
//  noop for selection.
//----------------------------------------------------------------------------------------------------
function fOnDropListChg(
  vElm
)
{
	return false;
}

//----------------------------------------------------------------------------------------------------
//  checks if string is a currency.
//----------------------------------------------------------------------------------------------------
function fIsCurrency(
  vStr
)
{
  var reg = /^\s*(\+|-)?((\d+(\.\d)?)|(\.\d)|(\d+(\.\d\d)?)|(\.\d\d))\s*$/;
  return (String(vStr).search(reg) != -1);
}

//----------------------------------------------------------------------------------------------------
//  valid inputs.
//----------------------------------------------------------------------------------------------------
function fValidInputs(
)
{
  // check that all fields are filled
  if (fTrim(fGet('#eReceipt').value) == '' ||
    fTrim(fGet('#eReceiptAmt').value) == '' ||
    (fTrim(fGet('#eCustUsername').value) == '' && !document.eFormActivation.eNewCustomer.checked))
    return cPage.mErr.EMPTY_FIELD;

  // check if currency is valid
  if (! fIsCurrency(fGet('#eReceiptAmt').value))
    return cPage.mErr.CURRENCY_ERR;

  // inputs are valid
  return cPage.mErr.OK;  
}

//----------------------------------------------------------------------------------------------------
//  reports page error.
//----------------------------------------------------------------------------------------------------
function fPromptPgErr(
  vErr
)
{
  switch (vErr)
  {
    case cPage.mErr.EMPTY_FIELD:
      cSys.fStartModal(cPage.mThis, "Cancel", cMsgBox.fCreate("Purchase Activation","Please fill up all fields!", ["OK"]));
      break;

    case cPage.mErr.CURRENCY_ERR:
      cSys.fStartModal(cPage.mThis, "Cancel", cMsgBox.fCreate("Purchase Activation","Receipt Amt is invalid!", ["OK"]));
      break;
  }
}
