//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
var vCart = null;
var vSaleType = {'pkg': '2', 'wkbk': '1', 'csw': '3', 'bdle': '4'};
var vCartItemIds = [];

//var vBookSlider;  // textbooks gallery

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
      vCart = fInitCart(vThis);
     return false;
  		
  	 case 'Start2':
  	  var vStore = fGet("#eNav_Store");
  	  vStore.className = 'current-menu-item';
  	  if (cSys.gAppVars['cart'] != undefined)
      {
      	vCartItemIds = cSys.gAppVars['cart'];
      }
      cSys.fStartRequest(vThis, 'ListCartItemsRet', 'Store/Store.php', 'ListCartItems', {'CartItemIds': vCartItemIds}, 'Fetching...');
  	  return false;
      	
      
     case 'ListCartItemsRet':
     	var vCartItems = vData.Data.cartItems;
     	
     	for (var i=0; i<vCartItems.length; i++){
      		if (vCartItems[i].Level == '34')
      			vCartItems[i].Level = 'Primary 3/4';
      		else if (vCartItems[i].Level == '56')
      			vCartItems[i].Level = 'Primary 5/6';
      		else if (vCartItems[i].Level == '12')
      			vCartItems[i].Level = 'Primary 1/2';
      		else
        		vCartItems[i].Level = 'Primary ' + vCartItems[i].LevelId;
      	
      		vPrice1 = vCartItems[i].Price;
      		vName1 = vCartItems[i].Title;
      		vLevelId1 = vCartItems[i].LevelId;
      		vLevel1 = vCartItems[i].Level;
      		vCover1 = "res/" + vCartItems[i].Cover;
      		vPublisher1 = vCartItems[i].Publisher;
      		vSubscription1 = vCartItems[i].SubscriptionLength;
      		vId1 = vCartItems[i].Id;
      	
      		if ((vCartItems[i].Author == undefined) || (vCartItems[i].Author == "")){
      			vAuthor1 = "";
      		}
      		else
      			vAuthor1 = vCartItems[i].Author; 
      		if ((vCartItems[i].SubscriptionPromotion == undefined) || (vCartItems[i].SubscriptionPromotion == "")){
      			vPromotion1 = 0;
      		}
      		else{
      			vPromotion1 = vCartItems[i].SubscriptionPromotion;
      		}
      	
      	
      		if (vId1 > 0 && vId1 <= 100)
            	vType1 = vSaleType.pkg;
        	else if (vId1 > 100 && vId1 <= 9000)
            	vType1 = vSaleType.csw; 
        	else if (vId1 > 9000 && vId1 <= 100000)
           		vType1 =  vSaleType.wkbk;
        	else
        		vType1 =  vSaleType.bdle;
        	
    		var vNew1 = { 'id': vId1, 'amt': +vPrice1, 'name': vName1, 'type': vType1, 'levelid' : vLevelId1, 'Level' : vLevel1, 'cover': vCover1, 'Publisher' : vPublisher1, 'Author': vAuthor1, 'Subscription': vSubscription1, 'Promotion' : vPromotion1};
      		vCart.fAdd(vNew1);
      	}
      	vCart.fRefresh();
     	
     	return false; 
      
     case 'ConfirmPurchase':	
     	if (vCart.fCartItems().length == 0){
     		cSys.fStartModal(vThis, "EmptyCartRet", cMsgBox.fCreate("Checkout","Your Cart is empty!", ["OK"]));
     		return false;	
     	}
     	
      	if (cSys.gCookies["oap_uname"]){
      		if	(cSys.gCookies["Role"] == 1)
      	       cSys.fStartModal(vThis, "Purchase", cMsgBox.fCreate("Checkout","You will be redirected to Paypal!", ["OK", "Cancel"]));
      	    else if (cSys.gCookies["Role"] == 2){
      	    	cSys.gCookies["IdChild"] = cSys.gCookies["IdUser"];
      	    	cSys.fStartModal(vThis, "ChildCheckoutRet", cMsgBox.fCreate("Checkout","Purchases can only be made with Parent accounts. To complete the purchase, please login with your parent’s account!", ["OK", "Cancel"]));
      	    }
      	    else if (cSys.gCookies["Role"] == 3){
      	    	cSys.fStartModal(vThis, "Purchase", cMsgBox.fCreate("Checkout","Are you sure to place order?", ["OK", "Cancel"]));
      	    }
      	    	
       	}
       	else{
       		cSys.gAppVars['guestLogin'] = true;
  	       	cSys.fStartModal(vThis, "Login", cLgInBox.fCreate());
      	}
      	return false;
      	
     case 'Purchase':
        if (vData == "OK")
     		cSys.fStartRequest(cPage.mThis, 'InitBuyRet', 'Store/Store.php', 'InitBuy', {'Cart': vCart.fCartItems()}, '');
     	return false;
     	
    case 'EmptyCartRet':
     	return false;
    
    case 'ChildCheckoutRet':
    	if (vData == "OK")
    		cSys.fStartModal(vThis, "Login", cLgInBox.fCreate());
     	return false;
     	
     case 'InitBuyRet':
     	cSys.gAppVars['TransactId'] = vData.Data.transactId;
      	if (cSys.gCookies['Role'] == 3) // cashier checkout
      	{
      		cSys.fStartModal(cPage.mThis, 'TransactIdDlgRet', 
      			cMsgBox.fCreate('Checkout','Please note down Transaction Id: ' + cSys.gAppVars['TransactId'], ['OK']));
      	}
      	else
      	{
     		vPaypal = 	fInitPaypal(vData.Data.PaypalUrl,vData.Data.PaypalSuccessUrl,vData.Data.PaypalCancelUrl,vData.Data.PaypalEmailAccount,vData.Data.PaypalNotificationUrl);
        	var vList = vCart.fCartItems();
        	for (var i=0; i<vList.length; i++)
          		vPaypal.fAdd(vList[i]);
        	vPaypal.fSubmit();
        }
        return false;	
  	  
  	  case 'TransactIdDlgRet':
  	  	cSys.gAppVars['cart'] = {};
  	  	cSys.fGoto('activation.html');

  } 
  vCart.fSignal( {'signal': vSignal, 'target': vTarget} );
  return fSuper(arguments);
}
)

//----------------------------------------------------------------------------------------------------
function fInitCart(
  vThis
)
{
  var vObj = new cCartFinal();  
  vObj.fInit({
    'tbl': 'eListData',
    'total': 'eTotal',
    'del': function(vId) {
      vCart.fRemove(vId);
      cSys.gAppVars['cart'] = vCart.xIdList;
      fUpdateCart();
    }
  });
  return vObj;
}

//----------------------------------------------------------------------------------------------------
function fInitPaypal(
url,
successurl,
cancelurl,
emailaccount,
notifyurl
)
{
  // actual url
  // url = 'https://www.paypal.com/cgi-bin/webscr';

  var vObj = new cPaypal();
  vObj.fInit({
    'url':  url,
    'successRet': successurl,
    'cancelRet': cancelurl,    
    'email': emailaccount,
    'notifyUrl': notifyurl,
    'custom': cSys.gCookies['IdUser'] + ';' + cSys.gAppVars['TransactId']
  });
  return vObj;
}


//----------------------------------------------------------------------------------------------------
function fScrub(
  vData
)
{ 
  vData.TotalMark = 1;
}