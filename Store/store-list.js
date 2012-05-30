//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
cPage.mHasBought = null;
var vCart = null;
var vItemPriceRoll = null;
var vSaleType = {'pkg': '2', 'wkbk': '1', 'csw': '3', 'bdle' : '4'};
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
      vItemPriceRoll = fInitItemPriceRoll();
      vCart = fInitCart(vThis);
     return;
  		
  	 case 'Start2':
  	  var vStore = fGet("#eNav_Store");
  	  vStore.className = 'current-menu-item';
  	  
  	  if (cSys.gAppVars['cart'] != undefined)
      {
      	vCartItemIds = cSys.gAppVars['cart'];
      }
      
  	  if (cSys.gAppVars['store-lvl'] != undefined)
  	  {
  	  	fChangeSelect('eLvls',cSys.gAppVars['store-lvl']);
  	  }
  	  if (cSys.gAppVars['store-subj'] != undefined)
  	  {
  	  	fChangeSelect('eSubjs',cSys.gAppVars['store-subj']);
  	  }
  	  if (cSys.gAppVars['store-type'] != undefined)
  	  {
  	  	fChangeSelect('eTypes',cSys.gAppVars['store-type']);
  	  }
  	  cSys.fStartRequest(vThis, 'ListBookRet', 'Store/Store.php', 'ListBook', {}, 'Fetching...');
      
      
      return false;
    
     case 'Filter':
  	  var vLvl = fCurrLvl();
  	  var vSubj = fCurrSubj();
  	  var vType = fCurrType();
  	  cSys.gAppVars['store-lvl'] = vLvl;
  	  cSys.gAppVars['store-subj'] = vSubj;
  	  cSys.gAppVars['store-type'] = vType;
  	  if ((vLvl != "0") && (vSubj != "0") && (vType != "0"))
  	  {
  	  	fRefresh(vThis);
  	  }
  	  else
  	  	cSys.fGoto("store.html"); 
  	  return false;
  	  
  	 case 'ListBookRet':
  	  cPage.mHasBought = vData.Data.itemsOwn;
      var vData = vData.Data.books;
         
      for (var i=0; i<vData.length; i++)
      {
        if (vData[i].Level == '34')
      		vData[i].Level = 'Primary 3/4';
      	else if (vData[i].Level == '56')
      		vData[i].Level = 'Primary 5/6';
      	else if (vData[i].Level == '12')
      		vData[i].Level = 'Primary 1/2';
      	else
        	vData[i].Level = 'Primary ' + vData[i].LevelId;
        
       	if (vData[i].Id > 0 && vData[i].Id <= 100)
        	vType = vSaleType.pkg;
        else if ((vData[i].Id > 100 && vData[i].Id <= 9000) || (vData[i].Id >= 100001))
        	vType = vSaleType.csw; 	
       	else
       		vType =  vSaleType.wkbk;
        
        vData[i].Subscription = vData[i].SubscriptionLength;
        vData[i].SubscriptionL = vData[i].SubscriptionLength + ' months';
        
        if ((vData[i].SubscriptionPromotion) && (vData[i].SubscriptionPromotion != "")){
        	vData[i].PromotionL = 'Subscribe between<br />25 May 2012 to 3 June 2012<br />and enjoy additional<br />' + vData[i].SubscriptionPromotion + ' months\' free subscription.';
        	vData[i].Promotion = vData[i].SubscriptionPromotion;
       	}
        else{
        	vData[i].PromotionL = '';
        	vData[i].Promotion = '';
       	}
        var vKey = fConcatKeys({'TypeId': vType, 'SubjectId': vData[i].SubjectId, 'LevelId': vData[i].LevelId});
        vItemPriceRoll.fSetActive(vKey);
        vItemPriceRoll.fAdd(vData[i]);
        
        for (var j=0; j<vCartItemIds.length; j++)
        {
        	if (vData[i].Id == vCartItemIds[j]){
        		
        		if (vData[i].Id > 0 && vData[i].Id <= 100)
            		vType = vSaleType.pkg;
            	else if (vData[i].Id > 100 && vData[i].Id <= 9000)
            		vType = vSaleType.csw; 	
           		else if (vData[i].Id > 9000 && vData[i].Id <= 100000)
           			vType = vSaleType.wkbk;
           		else
           			vType = vSaleType.bdle;
        	
        		var vNew = { 'id': vData[i].Id, 'amt': +vData[i].Price, 'name': vData[i].Title, 'type': vType, 'levelid' : vData[i].LevelId, 'Level': vData[i].Level, 'cover' : 'res/'+vData[i].Cover, 'Publisher': vData[i].Publisher, 'Author': vData[i].Author, 'Subscription': vData[i].Subscription, 'Promotion': vData[i].Promotion};
            	vCart.fAdd(vNew);
            	vCartItemIds.splice(j, 1);
            	break;
            }
        }
        vCart.fRefresh();
        cSys.gAppVars['cart'] = vCart.xIdList;
      }
      
      fRefresh(vThis);
      return;


  } 
  vItemPriceRoll.fSignal( {'signal': vSignal, 'target': vTarget} );
  vCart.fSignal( {'signal': vSignal, 'target': vTarget} );
  return fSuper(arguments);
}
)

//----------------------------------------------------------------------------------------------------
function fCurrLvl(
)
{
  return fDropListData('eLvls');
}

//----------------------------------------------------------------------------------------------------
function fCurrSubj(
)
{
  return fDropListData('eSubjs');
}

//----------------------------------------------------------------------------------------------------
function fCurrType(
)
{
  return fDropListData('eTypes');
}

//----------------------------------------------------------------------------------------------------
function fChangeSelect(
vId,
v
)
{
	var vElm = fGet('#' + vId);
	for ( var i = 0; i < vElm.options.length; i++ ) {
        if ( vElm.options[i].getAttribute('data') == v ) {
            vElm.options[i].selected = true;
            return;
        }
    }
}

//----------------------------------------------------------------------------------------------------
function fRefresh(
  vThis
)
{
  vSubjId = fCurrSubj();
  vLvlId = fCurrLvl();
  vType = fCurrType();
  	
  var vKey = fConcatKeys({'TypeId': vType, 'SubjectId': vSubjId, 'LevelId': vLvlId});
  vItemPriceRoll.fSetActive(vKey);
  vItemPriceRoll.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  setup item/price/add-to-cart gallery roll.
//----------------------------------------------------------------------------------------------------
function fInitItemPriceRoll(
)
{
  var vObj = new cItemPriceRoll();
  vObj.fInit({
    'rows': 5,
    'ctrls': { 
      'prev': 'ePrev', 
      'next': 'eNext', 
      'cartAdd': 'eCartAdd',
      'line': 'eLine',
      'row': 'eRow',
      'more': 'eMore',
      'less': 'eLess',
      'obj' : 'cItemPriceRoll'
    },
    'fields': {
      'Cover': 'eThumb', 
      'Title': 'eTitle',
      'Publisher': 'ePublisher',
      'Author': 'eAuthor',
      'Level': 'eLevel',
      'Price': 'ePrice',
      'SubscriptionL': 'eSubscription',
      'PromotionL': 'eMessage'
      //'Synopsis': 'eDesc'        
    },
    'fns' : {
      'add': function(vItem) {
            if (vItem.Id > 0 && vItem.Id <= 100)
            	vType = vSaleType.pkg;
            else if (vItem.Id > 100 && vItem.Id <= 9000)
            	vType = vSaleType.csw; 	
           	else if (vItem.Id > 9000 && vItem.Id <= 100000)
           		vType = vSaleType.wkbk;
           	else
           		vType = vSaleType.bdle;		 
            var vNew = { 'id': vItem.Id, 'amt': +vItem.Price, 'name': vItem.Title, 'type': vType, 'levelid' : vItem.LevelId, 'Level': vItem.Level, 'cover' : 'res/'+vItem.Cover, 'Publisher': vItem.Publisher, 'Author': vItem.Author, 'Subscription': vItem.Subscription, 'Promotion': vItem.Promotion};
            
            if (fIsItemInCart(vNew.id))
            	cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBoxError.fCreate('Cart','The item <b>"'+vItem.Title+'"</b> is already in the shopping cart!', ['OK']));
        	else if (fHasBoughtItem(vNew.id))
        		cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBoxError.fCreate('Cart','The item <b>"'+vItem.Title+'"</b> is already subscribed and cannot add to cart!', ['OK']));
        	else 
        	{
        		cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBox.fCreate('Cart','The item <b>"'+vItem.Title+'"</b> has just been added to your shopping cart!', ['OK']));
            	vCart.fAdd(vNew);
            	cSys.gAppVars['cart'] = vCart.xIdList;
            	fUpdateCart();
           	}
            
      },
      'detail': function(vItem) {
          cSys.gAppVars['product-id'] = vItem.Id;
          if (vItem.Id <= 100000)
  		  	cSys.fGoto('store-product-detail.html');
  		  else
  		  	cSys.fGoto('store-bundle-detail.html');
      }
    }
  });
  return vObj;
}

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