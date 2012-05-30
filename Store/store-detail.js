//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
cPage.mHasBought = null;
var vCart = null;
cPage.mQtns = {};
var vSaleType = {'pkg': '2', 'wkbk': '1', 'csw': '3', 'bdle' : '4'};
var vCartItemIds = [];
var vBookSliderRelated;

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
  vBookId = cSys.gAppVars['product-id'];
  
  switch (vSignal)
  {
  	 case 'Init':
      vCart = fInitCart(vThis);
      vBookSliderRelated = fInitBookSlider();
     return;
  		
  	 case 'Start2':
  	  var vStore = fGet("#eNav_Store");
  	  vStore.className = 'current-menu-item';
  	  
  	  if (cSys.gAppVars['cart'] != undefined)
      {
      	vCartItemIds = cSys.gAppVars['cart'];
      }
  	  
  	  cSys.fStartRequest(vThis, 'ListOneBookRet', 'Store/Store.php', 'ListOneBook', {'BookId': vBookId, 'CartItemIds': vCartItemIds}, 'Fetching...');

      return false;
  	  
  	 case 'ListOneBookRet':
  	  cPage.mHasBought = vData.Data.itemsOwn;
      var vRelated = vData.Data.relateds;
      var vCartItems = vData.Data.cartItems;
      var vData = vData.Data.books;
      
      for (var i=0; i<1; i++)
      {
      	if (vData[i].Level == '34')
      		vData[i].Level = 'Primary 3/4';
      	else if (vData[i].Level == '56')
      		vData[i].Level = 'Primary 5/6';
      	else if (vData[i].Level == '12')
      		vData[i].Level = 'Primary 1/2';
      	else
        	vData[i].Level = 'Primary ' + vData[i].LevelId;
        var elm = fGet('#eCover');
      	elm.setAttribute('src', "res/" + vData[i].Cover);
      	elm = fGet('#eTitle');
      	elm.innerHTML = vData[i].Title;
      	elm = fGet('#eLevel');
      	elm.innerHTML = vData[i].Level;
      	elm = fGet('#ePublisher');
      	elm.innerHTML = vData[i].Publisher;
      	elm = fGet('#eAuthor');
      	elm.innerHTML = (vData[i].Author == undefined)?"":vData[i].Author;
      	elm = fGet('#eOverview');
      	elm.innerHTML = (vData[i].Overview == undefined)?"":vData[i].Overview;
        elm = fGet('#ePrice');
      	elm.innerHTML = 'SGD' + parseFloat(vData[i].Price).toFixed(2);
      	elm = fGet('#eSynopsis');
      	elm.innerHTML = vData[i].Synopsis;
      	//elm = fGet('#eOverview');
      	//elm.innerHTML = vData[i].Overview;
      	elm = fGet('#eSubscription');
      	elm.innerHTML = vData[i].SubscriptionLength + ' months';
      	vPrice = vData[i].Price;
      	vName = vData[i].Title;
      	vLevelId = vData[i].LevelId;
      	vLevel = vData[i].Level;
      	vCover = "res/" + vData[i].Cover;
      	vPublisher = vData[i].Publisher;
      	vSubscription = vData[i].SubscriptionLength;
      	
      	if ((vData[i].Overview == undefined) || (vData[i].Overview == "")){
      		fShow2("eOverviewHeader",false);
      		fShow2("eOverview",false);
      		//vAuthor = "";
      	}
      	
      	if ((vData[i].Author == undefined) || (vData[i].Author == "")){
      		fShow2("liAuthor",false);
      		vAuthor = "";
      	}
      	else
      		vAuthor = vData[i].Author; 
      	if ((vData[i].SubscriptionPromotion == undefined) || (vData[i].SubscriptionPromotion == "")){
      		fShow2("eMessage",false);
      		vPromotion = 0;
      	}
      	else{
      		elm = fGet('#eMessage');
      		elm.innerHTML = 'Subscribe between<br />25 May 2012 to 3 June 2012<br />and enjoy additional<br />' + vData[i].SubscriptionPromotion + ' months\' free subscription.';
      		vPromotion = vData[i].SubscriptionPromotion;
      	}
      	
      	
      	if (vData[i].Id>100 && vData[i].Id<=9000){
      		fShow2("eSampleItDiv",false);
      		fShow2("ePreviewCWDiv",true);
      		elm = fGet("#ePreviewCW");
      		elm.setAttribute("href", vData[i].Preview);
      	}
      	else{
      		fShow2("eSampleItDiv",true);
      		fShow2("ePreviewCWDiv",false);
      	}
      	
      	$("#ePreviewCW").fancybox({
				'width'				: 800,
				'height'			: 600,
				'autoScale'			: false,
				'transitionIn'		: 'elastic',
				'transitionOut'		: 'elastic',
				'easingIn'      	: 'easeOutBack',
				'easingOut'     	: 'easeInBack'
		});
      	
      	if (vRelated.length == 0)
				fShow3('eRelated',false);
			else
			{
				for (var i=0; i<vRelated.length; i++)
				{
					if (vRelated[i].Level == '34')
      					vRelated[i].Level = 'Primary 3/4';
      				else if (vRelated[i].Level == '56')
      					vRelated[i].Level = 'Primary 5/6';
      				else if (vRelated[i].Level == '12')
      					vRelated[i].Level = 'Primary 1/2';
      				else
        				vRelated[i].Level = 'Primary ' + vRelated[i].LevelId;
					var vKey = fConcatKeys({'SubjectId': vRelated[i].SubjectId, 'LevelId': vRelated[i].LevelId});
					vBookSliderRelated.fSetActive(vKey);
					vBookSliderRelated.fAdd(vRelated[i]);
				}
				vBookSliderRelated.fDisplayAll('#mycarouselrelated');
				jQuery('#mycarouselrelated').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}
      		 	
      }
      
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
	
	case 'Preview':
        if (cPage.mQtns[vBookId])
          fShowFlash(cPage.mQtns[vBookId]);
        else
          cSys.fStartRequest(vThis, 'FetchSampleQtnsRet', 'Store/Store.php', 'FetchSampleQtns', 
            {'BookId': vBookId}, 'Fetching qtns...');
        return false;
    
    case 'AddToCart':
    	if (vBookId > 0 && vBookId <= 100)
            vType = vSaleType.pkg;
        else if (vBookId > 100 && vBookId <= 9000)
            	vType = vSaleType.csw; 
        else if (vBookId > 9000 && vBookId <= 100000)
           	vType =  vSaleType.wkbk;
        else
        	vType =  vSaleType.bdle;
    	var vNew = { 'id': vBookId, 'amt': +vPrice, 'name': vName, 'type': vType, 'levelid' : vLevelId, 'Level' : vLevel, 'cover': vCover, 'Publisher' : vPublisher, 'Author': vAuthor, 'Subscription': vSubscription, 'Promotion' : vPromotion};
    	if (fIsItemInCart(vNew.id))
            cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBoxError.fCreate('Cart','The item <b>"'+vName+'"</b> is already in the shopping cart!', ['OK']));
        else if (fHasBoughtItem(vNew.id))
        		cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBoxError.fCreate('Cart','The item <b>"'+vName+'"</b> is already subscribed and cannot add to cart!', ['OK']));
        else
        {
        	cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBox.fCreate('Cart','The item <b>"'+vName+'"</b> has just been added to your shopping cart!', ['OK']));
        	vCart.fAdd(vNew);
        	cSys.gAppVars['cart'] = vCart.xIdList;
        	fUpdateCart();
        }
        return false;
        
    case 'FetchSampleQtnsRet':
      var vData = vData.Data;
      cPage.mQtns[vBookId] = [];
      for (var i=0; i<vData.length; i++)
      {
      	vData[i].Path = "res/"+vData[i].Path;
        fScrub(vData[i]);
        cPage.mQtns[vBookId].push(vData[i]);
      }
      fShowFlash(cPage.mQtns[vBookId]);
      return false;

  } 
  vCart.fSignal( {'signal': vSignal, 'target': vTarget} );
  vBookSliderRelated.fSignal( {'signal': vSignal, 'target': vTarget} );
  return fSuper(arguments);
}
)

//----------------------------------------------------------------------------------------------------
function fInitCart(
  vThis
)
{
  var vObj = new cCart();  
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
function fShowFlash(
  vData
)
{
  var vFlash = cFlash.fCreate({'Qtns': vData, 'Mode': 'Test', 'Raw': '', 'Target': this});
  if (vFlash)
  {
    cSys.fStartModal(cPage.mThis, '', vFlash);
    fPosFlashWin(vFlash); 
  }
}

//----------------------------------------------------------------------------------------------------
function fFlashRet(
  vObj
)
{
  if (vObj.type != 'Submit')
    return;

  var vQtns = cPage.mQtns[vBookId];
  var vFlash = cFlash.fCreate({'Qtns': vQtns, 'Mode': 'View', 'Raw': vObj.raw, 'Target': this});
  if (vFlash)
  {
    cSys.fStartModal(cPage.mThis, '', vFlash);
    fPosFlashWin(vFlash); 
  }
}

//----------------------------------------------------------------------------------------------------
function fScrub(
  vData
)
{ 
  vData.TotalMark = 1;
}

//----------------------------------------------------------------------------------------------------
//  check for duplicate items in the shopping cart.
//----------------------------------------------------------------------------------------------------
function fIsItemInCart(
  vItemId
)
{
  var vList = vCart.fCartItems();

  for (var i=0; i<vList.length; i++)
    if (vItemId == vList[i].id)
      return true;
  return false;
}

//----------------------------------------------------------------------------------------------------
//  setup book slider
//----------------------------------------------------------------------------------------------------
function fInitBookSlider(
)
{
	var vObj = new cBookSlider();
	return vObj;
}

function mycarousel_initCallback(carousel)
{
	carousel.startAuto(1);
    // Disable autoscrolling if the user clicks the prev or next button.
    carousel.buttonNext.bind('click', function() {
        carousel.startAuto(0);
    });

    carousel.buttonPrev.bind('click', function() {
        carousel.startAuto(0);
    });

    // Pause autoscrolling if the user moves with the cursor over the clip.
    carousel.clip.hover(function() {
        carousel.stopAuto();
    }, function() {
        carousel.startAuto();
    });
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
