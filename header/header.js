//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
var gToken = null;
cPage.mThis = null;
cPage.mLgInDlg = null;
cPage.mHasBought = null;
cPage.vRole = null;

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
  	  cSys.fStartRequest(vThis, 'Ignore', 'header/header.php', 'CheckSession', {}, 'Checking...');
      var vGreetings = fGet("#eUserName");
            
      fUpdateCart();
      	
      if (cSys.gCookies["oap_uname"])
      {
      	vGreetings.innerHTML = cSys.gCookies["oap_uname"];
      	fShow2('eNav_Logout', true);
      	fShow2('eNav_MyAccount', true);
      	fShow2('eNav_Login', false);
      	fShow2('eNav_Register', false);
      	if(cSys.gCookies["Role"] == '1'){ 
      		fShow2('eNav_Summary',true);
      		fShow2('eNav_Assignment',false);
      		fShow2('eNav_Activation',false);
      		fShow2('eNav_Content',false);
      	} 
      	else if (cSys.gCookies["Role"] == '2'){ 
      		fShow2('eNav_Summary',false);
      		fShow2('eNav_Assignment',true);
      		fShow2('eNav_Activation',false);
      		fShow2('eNav_Content',false);
      	}
      	else if (cSys.gCookies["Role"] == '3'){ 
      		fShow2('eNav_Activation',true);
      		fShow2('eNav_Summary',true);
      		fShow2('eNav_Assignment',false);
      		fShow2('eNav_Content',false);
      	}
      	else if (cSys.gCookies["Role"] == '4'){ 
      		fShow2('eNav_Activation',false);
      		fShow2('eNav_Summary',true);
      		fShow2('eNav_Assignment',false);
      		fShow2('eNav_Content',true);
      	}	
      }
      else
      {
      	vGreetings.innerHTML = 'Guest';
      	fShow2('eNav_Logout', false);
      	fShow2('eNav_MyAccount', false);
      	fShow2('eNav_Login', true);
		fShow2('eNav_Register', true);
      	fShow2('eNav_Summary',false);
      	fShow2('eNav_Assignment',false);
      	fShow2('eNav_Activation',false);
      	fShow2('eNav_Content',false);
      }
      cSys.fDispatch(cPage.mThis, 'Start2', false);	
      return false;
  
	case 'GetTokenDone':
      gToken = vData.Data;
      fLogin(true);
      return false;	
      
    case 'SessionExpired':
      cSys.gCookies = {};	
      cSys.gAppVars = {};
      cSys.fStartModal(cPage.mThis, 'SessionRet', cMsgBoxError.fCreate('Session','Your session is already expired! Please try to login again!', ['OK']));
      return false;
    
    case 'SessionInvalid':
      cSys.gCookies = {};	
      cSys.gAppVars = {};
      cSys.fStartModal(cPage.mThis, 'SessionRet', cMsgBoxError.fCreate('Session','Your session is invalid! Please try to login again!', ['OK']));
      return false;
      
  	case 'SessionRet':
  		cSys.fGoto("index.html");
  		return false;
  		
  	case 'CheckCartRet':
  	  if ((cSys.gAppVars['register'] == undefined || cSys.gAppVars['register'] == false) &&  (cSys.gAppVars['guestLogin'] == undefined || cSys.gAppVars['guestLogin'] == false) && (cSys.gCookies["IdChild"] == undefined))
      {
	      if (cPage.vRole == 1)
	      	cSys.fGoto('my-summary.html');
	      else if (cPage.vRole == 2)
	      	cSys.fGoto('my-assignment.html');
	      else if (cPage.vRole == 3)
	      	cSys.fGoto('activation.html'); 
	      else if (cPage.vRole == 4)
	      	cSys.fGoto('content.html');
	  }
	  else
	  {
	  	cSys.gAppVars['register'] = false;
	  	if (cSys.gAppVars['cart'] == undefined || cSys.gAppVars['cart'].length == 0) 
			cSys.fGoto('store.html');
		else
			cSys.fGoto('store-checkout.html');
	  
	  }
	  return false;
  	
  	
  	case 'LoginDone':
      if (vData.Error == "AlreadyLogin")
      {
        //cSys.fStartModal(vThis, "AlreadyLogin", cMsgBox.fCreate("You are already logged in." +
          //"<br/>If you continue, the other session will be terminated.", ["OK", "Cancel"]));
        return false;
      }
      if (vData.Error != null)
      {
        fGet("#signError").innerHTML = vData.Error;
        fShow2("signError",true);
        return false;
      }
      fShow2("signError",false);
      // actual password never go across the wire
      vPassword = fGet("#ePassword").value;
      vPassword1 = cSys.fHash(cSys.kSeed, vPassword);
      vPassword2 = cSys.fHash(gToken, vPassword1);
      cSys.gAppVars["Password"] = vPassword2;

      // determine landing page
      cPage.mHasBought = vData.Data.itemsOwn;
      cPage.vRole = vData.Data.Role;
	  
	  var n = fCheckCart();
	  if (n>0)
	  	cSys.fStartModal(cPage.mThis, 'CheckCartRet', cMsgBoxError.fCreate('Cart','We have removed '+n+' item(s) from your cart because you already possessed these!', ['OK']));
	  else{
	  	if ((cSys.gAppVars['register'] == undefined || cSys.gAppVars['register'] == false) &&  (cSys.gAppVars['guestLogin'] == undefined || cSys.gAppVars['guestLogin'] == false) && (cSys.gCookies["IdChild"] == undefined))
      	{
	      if (cPage.vRole == 1)
	      	cSys.fGoto('my-summary.html');
	      else if (cPage.vRole == 2)
	      	cSys.fGoto('my-assignment.html');
	      else if (cPage.vRole == 3)
	      	cSys.fGoto('activation.html'); 
	      else if (cPage.vRole == 4)
	      	cSys.fGoto('content.html');
	  	}
	    else
	  	{
	  		cSys.gAppVars['register'] = false;
	  		if (cSys.gAppVars['cart'] == undefined || cSys.gAppVars['cart'].length == 0) 
				cSys.fGoto('store.html');
			else
				cSys.fGoto('store-checkout.html');
	  
	  	}
	  }
  	  return false;
  	
  	case 'Login':
      fLogin(true);
      return false;
  	
  	
  	case 'LogoutDlgRet':
  		if (vData == "OK")
  			cSys.fStartRequest(vThis, "LogoutDone", "Logout/Logout.php", "Logout", {}, "Logout...");
  		return false;
  	
  	case 'LogoutDone':
  		cSys.gAppVars = {};
		cSys.fGoto("index.html");
		return false;
  	
  	case 'GetParentDone':
		var vParent = vData.Data.Parent;
		var vElm = fGet("#eUserId");
		vElm.value = vParent[0].Username;
		vElm.disabled = true;
		return false;
  	
  	
    case 'click':
      switch (vTarget.id)
      {
        case "eLogin":case "eLogin2":
          cSys.fStartModal(vThis, '', cLgInBox.fCreate());
          return false;
        case "eLoginB":
          cSys.fStartModal(vThis, '', cLgInBox.fCreate());
          return false;
       	case "eHome1":
		  cSys.fGoto("index.html");
		  return false;
		case "eHome2":
		  cSys.fGoto("index.html");
		  return false;
		case "eNews1":
		  cSys.fGoto("news.html");
		  return false;
		case "eNews2":
		  cSys.fGoto("news.html");
		  return false;
		case "eNews3":
		  cSys.fGoto("news.html");
		  return false;
		case "eNews4":
		  cSys.fGoto("news.html");
		  return false;
		case "ePromotion":
		  cSys.fGoto("promotions.html");
		  return false;
		case "ePromotion2":
		  cSys.fGoto("promotions.html");
		  return false;
		case "ePromotion3":
		  cSys.fGoto("promotions.html");
		  return false;
		case "eAbout1":
		  cSys.fGoto("about.html");
		  return false;
		case "eAbout2":
		  cSys.fGoto("about.html");
		  return false;
		case "eAbout3":
		  cSys.fGoto("about.html");
		  return false;
		case "eAbout4":
		  cSys.fGoto("about.html");
		  return false;
		case "eFeatures":
		  cSys.fGoto("features.html");
		  return false;
		case "eFeatures2":
		  cSys.fGoto("features.html");
		  return false;
		case "eFeatures3":
		  cSys.fGoto("features.html");
		  return false;
		case "eGettingStarted":
		  cSys.fGoto("getting-started.html");
		  return false;
		case "eGettingStarted2":
		  cSys.fGoto("getting-started.html");
		  return false;
		case "eGettingStarted3":
		  cSys.fGoto("getting-started.html");
		  return false;
		case "eFAQs":
		  cSys.fGoto("faqs.html");
		  return false;
		case "eFAQs2":
		  cSys.fGoto("faqs.html");
		  return false;
		case "eFAQs3":
		  cSys.fGoto("faqs.html");
		  return false;
		case "eContactUs1":
		  cSys.fGoto("contact-us.html");
		  return false;
		case "eContactUs2":
		  cSys.fGoto("contact-us.html");
		  return false;
		case "eContactUs3":
		  cSys.fGoto("contact-us.html");
		  return false;
		case "eContactUs4":
		  cSys.fGoto("contact-us.html");
		  return false;
		case "eTechnicalSupport":
		  cSys.fGoto("technical-support.html");
		  return false;
		case "eTechnicalSupport2":
		  cSys.fGoto("technical-support.html");
		  return false;
		case "eTechnicalSupport3":
		  cSys.fGoto("technical-support.html");
		  return false;
		case "eDisclaimer":
		  cSys.fGoto("disclaimer.html");
		  return false;
		case "eTC":
		  cSys.fGoto("tc.html");
		  return false;
		case "eActivation":
          cSys.fStartModal(vThis, '', cLgInBox.fCreate());
          return false;
        case "eContent":
          cSys.fStartModal(vThis, '', cLgInBox.fCreate());
          return false;
		case "eMySummary":
          cSys.fGoto("my-summary.html");
		  return false;
		case "eMySummary2":
          cSys.fGoto("my-summary.html");
		  return false;
		case "eMySummary3":
          cSys.fGoto("my-summary.html");
		  return false;
		case "eMyAssignment":
          cSys.fGoto("my-assignment.html");
		  return false;
		case "eMyAssignment2":
          cSys.fGoto("my-assignment.html");
		  return false;
		case "eMyAssignment3":
          cSys.fGoto("my-assignment.html");
		  return false;
		  
		case "eStore":
		  if ((cSys.gAppVars['store-lvl'] != "0") && (cSys.gAppVars['store-subj'] != "0") && (cSys.gAppVars['store-type'] != "0")
      && (cSys.gAppVars['store-lvl'] != undefined) && (cSys.gAppVars['store-subj'] != undefined) && (cSys.gAppVars['store-type'] != undefined))
  	  			cSys.fGoto("store-product-list.html");
  	  	  else	
          		cSys.fGoto("store.html");
		  return false;
		  
		case "eStore2":
          if ((cSys.gAppVars['store-lvl'] != "0") && (cSys.gAppVars['store-subj'] != "0") && (cSys.gAppVars['store-type'] != "0")
      && (cSys.gAppVars['store-lvl'] != undefined) && (cSys.gAppVars['store-subj'] != undefined) && (cSys.gAppVars['store-type'] != undefined))
  	  			cSys.fGoto("store-product-list.html");
  	  	  else	
          		cSys.fGoto("store.html");
		  return false;
		  
		case "eStore3":
          if ((cSys.gAppVars['store-lvl'] != "0") && (cSys.gAppVars['store-subj'] != "0") && (cSys.gAppVars['store-type'] != "0")
      && (cSys.gAppVars['store-lvl'] != undefined) && (cSys.gAppVars['store-subj'] != undefined) && (cSys.gAppVars['store-type'] != undefined))
  	  			cSys.fGoto("store-product-list.html");
  	  	  else	
          		cSys.fGoto("store.html");
		  return false;
		  
		case "eLogout":
		  cSys.fStartModal(vThis, "LogoutDlgRet", cMsgBox.fCreate("Logout","Are you sure to logout?", ["OK","Cancel"]));
		  return false;
	    case "eFilter":
		  cSys.fDispatch(cPage.mThis, 'Filter', false);	
      	  return false;
		case "eGoToCart":
		  cSys.fGoto("store-checkout.html");
		  return false;
		case "eCart":
		  cSys.fGoto("store-checkout.html");
		  return false;
		case "eCheckOut":
		   cSys.fDispatch(cPage.mThis, 'ConfirmPurchase', false);
	  	   return false;
	  	case "eBookItem":
		  cSys.fGoto("my-books.html");
		  return false;
		case "eCoursewareItem":
		  cSys.fGoto("my-coursewares.html");
		  return false;
		case "eBookItemChild":
		  cSys.fGoto("my-books-child.html");
		  return false;
		case "eCoursewareItemChild":
		  cSys.fGoto("my-coursewares-child.html");
		  return false;
		case "eSwitch":
		  cSys.fDispatch(cPage.mThis, 'Switch', false);	
      	  return false;
      	case "eSampleIt":
		  cSys.fDispatch(cPage.mThis, 'Preview', false);	
      	  return false;
      	case "eAddToCart":
		  cSys.fDispatch(cPage.mThis, 'AddToCart', false);	
      	  return false;
      	case "eRegister1":case "eRegister2":
      	  cSys.fGoto("register.html");
      	  return false;
      	case "eRegisterTop":
      	  cSys.fGoto("register.html");
      	  return false;
      	case "eCreateAccount":
      	  cSys.fDispatch(cPage.mThis, 'Register', false);	
      	  return false;
      	case "eEditAccount":
      	  if (cSys.gCookies['Role'] == '1')	
      	  	cSys.fGoto("my-account.html");
      	  else if (cSys.gCookies['Role'] == '2')
      	  	cSys.fGoto("my-account-child.html");
      	  return false;
      	case "eMyAccount":
      	  if (cSys.gCookies['Role'] == '1')	
      	  	cSys.fGoto("my-account.html");
      	  else if (cSys.gCookies['Role'] == '2')
      	  	cSys.fGoto("my-account-child.html");
      	  return false;
      	case "eEditChildAccount":
      	  cSys.fGoto("my-child-account.html");
      	  return false;
        case "eCreateChildAccount":
      	  cSys.fGoto("register-child.html");
      	  return false;
		case "eEditChild0": case "eEditChild1": case "eEditChild2": case "eEditChild3": case "eEditChild4":
		  cSys.fDispatch(cPage.mThis, 'Edit', vTarget.getAttribute('data'));	
      	  return false;
		case "eDeleteChild0": case "eDeleteChild1": case "eDeleteChild2": case "eDeleteChild3": case "eDeleteChild4":
      	  cSys.fDispatch(cPage.mThis, 'Delete', vTarget.getAttribute('data'));	
      	  return false;
      	case "eVideo":
      	  cSys.fDispatch(cPage.mThis, 'Video', false);	
      	  return false;
      	case "eFavourite":
      	  cSys.fGoto("my-books-favourite.html");
      	  return false;
      	case "eTest":
      	  if (cSys.gCookies["Role"] == 1)
      	  	cSys.fGoto("my-books.html");
      	  else if (cSys.gCookies["Role"] == 2)
      	    cSys.fGoto("my-books-child.html");	
      	  return false;
      	case "eGenerateTopical":
      	  if (cSys.gCookies["Role"] == 1)
      	  	cSys.fGoto("my-testbanks-topical.html");
      	  else if (cSys.gCookies["Role"] == 2)
      	    cSys.fGoto("my-testbanks-topical-child.html");	
      	  return false;
      	case "eGenerate":
      	  cSys.fDispatch(cPage.mThis, 'Generate', false);	
      	  return false;
      	case "eMyTestbank":
      	  cSys.fGoto("my-testbanks.html");
      	  return false;
      	case "eMyTestbankChild":
      	  cSys.fGoto("my-testbanks-child.html");
      	  return false;	
      	case "eSubscribe":
      	  cSys.fDispatch(cPage.mThis, 'SwitchSubscribe', false);	
      	  return false;
      	case "eForget":case "eForget2":
      	  cSys.fGoto("forgot.html");
      	  return false;
      	case "eResetPass":
      	  cSys.fDispatch(cPage.mThis, 'ResetPassword', false);	
      	  return false;
      	case "eRetrieveUsername":
      	  cSys.fDispatch(cPage.mThis, 'RetrieveUsername', false);	
      	  return false;
      	case "eNewCustomer":
      	  cSys.fDispatch(cPage.mThis, 'CreateNewCustomer', false);	
      	  return false; 
      	case "eActivate":
      	  cSys.fDispatch(cPage.mThis, 'Activate', false);	
      	  return false;
      	case "eRegister":
      	  cSys.fDispatch(cPage.mThis, 'Register', false);	
      	  return false;
      	case "eCoursewareHomePage":
      	  cSys.gAppVars['store-type'] = 3;
		  cSys.fGoto("store.html");
		  return false;
      }
      break;
  } 

  return fSuper(arguments);
}
)

/*
function maskClick()
{
	cSys.fEndModal();
}
*/

//----------------------------------------------------------------------------------------------------
function fCheckCart(
)
{
	var n = 0;
	if (cSys.gAppVars['cart'] == undefined || cSys.gAppVars['cart'].length == 0)
      	return 0;
  	else{
  		vCartItemIds = cSys.gAppVars['cart'];
  		for (var i=0; i<vCartItemIds.length; i++)
        {
        	if (fHasBoughtItem(vCartItemIds[i])){
        		n++;
        		vCartItemIds.splice(i, 1);
      			cSys.gAppVars['cart'] = vCartItemIds;
      			fUpdateCart();
            }
        }
        return n;
  	}
}

//----------------------------------------------------------------------------------------------------
function fLogin(
  vData
)
{
  vTime = fGetTime();
  vUserId = fGet("#eUserId").value;
  vPassword = fGet("#ePassword").value;
  vPassword1 = cSys.fHash(cSys.kSeed, vPassword);
  vPassword2 = cSys.fHash(gToken, vPassword1);
  vPassword3 = cSys.fHash(vTime, vPassword2);
  
  cSys.fStartRequest(cPage.mThis, "LoginDone", "Login/Login.php", "Login", {Token: gToken, Time: vTime,
      UserId: vUserId, Password: vPassword3, Force: vData}, "Login...");
}


//----------------------------------------------------------------------------------------------------
function fUpdateCart(
)
{
  var vCart = fGet("#eCart");

  if (cSys.gAppVars['cart'] == undefined || cSys.gAppVars['cart'].length == 0)
      	vCart.innerHTML = 'Cart';
  else if (cSys.gAppVars['cart'].length == 1)
    vCart.innerHTML = 'Cart (1 item)';
  else
  	vCart.innerHTML = 'Cart ('+cSys.gAppVars['cart'].length+' items)';
}

//----------------------------------------------------------------------------------------------------
//  has user bought this item?
//----------------------------------------------------------------------------------------------------
function fHasBoughtItem(
  vBookId
)
{
	// quick hack
	if (cSys.gAppVars['Role'] == "3")
		return false;

  var vBooks = cPage.mHasBought;

  for (var i=0; i<vBooks.length; i++)
    if (vBookId == vBooks[i].ItemId)
      return true;
  return false;
}