//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
var vBookSlider;  // textbooks gallery
var vItemPriceRollBook = null;
var vItemPriceRollTestbank = null;
var vItemPriceRollCourseware = null;

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
      vBookSlider = fInitBookSlider();
      vItemPriceRollBook = fInitItemPriceRollBook();
      vItemPriceRollTestbank = fInitItemPriceRollTestbank();
      vItemPriceRollCourseware = fInitItemPriceRollCourseware();
      return;
  		
  	 case 'Start2':
  	  var vHome = fGet("#eNav_Home");
  	  vHome.className = 'current-menu-item'; 
      if (cSys.gCookies["oap_uname"])
      	fShow2('eLoginBar',false); 
	  else
	  	fShow2('eLoginBar',true);
	  cSys.fStartRequest(vThis, 'ListBookRet', 'index/index.php', 'ListBook', {}, 'Fetching...');
      return false;
      
     case 'ListBookRet':
      var vBook = vData.Data.book;
      var vTestBank = vData.Data.testbank;
      var vCourseWare = vData.Data.courseware;
      	
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
        	
        var vKey = fConcatKeys({'SubjectId': vData[i].SubjectId, 'LevelId': vData[i].LevelId});
        vBookSlider.fSetActive(vKey);
        vBookSlider.fAdd(vData[i]);
      }
      
      	  for (var i=0; i<3; i++)
	      { 	
	       	if (vBook[i].Level == '34')
      			vBook[i].Level = 'Primary 3/4';
      		else if (vBook[i].Level == '56')
      			vBook[i].Level = 'Primary 5/6';
      		else if (vBook[i].Level == '12')
      			vBook[i].Level = 'Primary 1/2';
      		else
        		vBook[i].Level = 'Primary ' + vBook[i].LevelId;
        	
	        var vKey = 1;
	        vItemPriceRollBook.fSetActive(vKey);
	        vItemPriceRollBook.fAdd(vBook[i]);
	      }
	      fRefreshBook(vThis);
	      
	      for (var i=0; i<3; i++)
	      {
	      	if (vTestBank[i].Level == '34')
      			vTestBank[i].Level = 'Primary 3/4';
      		else if (vTestBank[i].Level == '56')
      			vTestBank[i].Level = 'Primary 5/6';
      		else if (vTestBank[i].Level == '12')
      			vTestBank[i].Level = 'Primary 1/2';
      		else
        		vTestBank[i].Level = 'Primary ' + vTestBank[i].LevelId;
        		
	        var vKey = 1;
	        vItemPriceRollTestbank.fSetActive(vKey);
	        vItemPriceRollTestbank.fAdd(vTestBank[i]);
	      }
	      fRefreshTestBank(vThis);
	      
	      for (var i=0; i<3; i++)
	      {
	      	if (vCourseWare[i].Level == '34')
      			vCourseWare[i].Level = 'Primary 3/4';
      		else if (vCourseWare[i].Level == '56')
      			vCourseWare[i].Level = 'Primary 5/6';
      		else if (vCourseWare[i].Level == '12')
      			vCourseWare[i].Level = 'Primary 1/2';
      		else
        		vCourseWare[i].Level = 'Primary ' + vCourseWare[i].LevelId;
        		
	        var vKey = 1;
	        vItemPriceRollCourseware.fSetActive(vKey);
	        vItemPriceRollCourseware.fAdd(vCourseWare[i]);
	      }
	      fRefreshCourseWare(vThis);
      
      vBookSlider.fDisplayAll('#mycarousel');
      jQuery('#mycarousel').jcarousel({
        auto: 1,
        wrap: 'last',
		scroll: 1,
		initCallback: mycarousel_initCallback
      });
      return;
 
      
  } 
  vBookSlider.fSignal( {'signal': vSignal, 'target': vTarget} );
  vItemPriceRollBook.fSignal( {'signal': vSignal, 'target': vTarget} );
  vItemPriceRollTestbank.fSignal( {'signal': vSignal, 'target': vTarget} );
  vItemPriceRollCourseware.fSignal( {'signal': vSignal, 'target': vTarget} );
  return fSuper(arguments);
}
)

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
//  setup my Books
//----------------------------------------------------------------------------------------------------
function fInitItemPriceRollBook(
)
{
  var vObj = new cItemPriceRoll();
  vObj.fInit({
    'rows': 3,
    'ctrls': { 
      'prev': 'ePrevBook', 
      'next': 'eNextBook',
      'line': 'eLine',
      'row': 'eRowBook',
      'more': 'eMore',
      'less': 'eLess',
      'obj': 'cItemPriceRollBook'
    },
    'fields': {
      'Cover': 'eThumbBook', 
      'Title': 'eTitleBook',
      //'Publisher': 'ePublisherBook',
      //'Author': 'eAuthorBook',
      'Level': 'eLevelBook'     
    },
    'fns' : {
      'detail': function(vItem) {
          cSys.gAppVars['product-id'] = vItem.Id;
  		  cSys.fGoto('store-product-detail.html');
      }
    }
  });
  return vObj;
}

//----------------------------------------------------------------------------------------------------
//  setup my Books
//----------------------------------------------------------------------------------------------------
function fInitItemPriceRollTestbank(
)
{
  var vObj = new cItemPriceRoll();
  vObj.fInit({
    'rows': 3,
    'ctrls': { 
      'prev': 'ePrevTestbank', 
      'next': 'eNextTestbank',
      'line': 'eLine',
      'row': 'eRowTestbank',
      'more': 'eMore',
      'less': 'eLess',
      'obj': 'cItemPriceRollTestbank'
    },
    'fields': {
      'Cover': 'eThumbTestbank', 
      'Title': 'eTitleTestbank',
      //'Publisher': 'ePublisherTestBank',
      //'Author': 'eAuthorTestBank',
      'Level': 'eLevelTestbank',
      'ChildName' : 'eChildTestbank'      
    },
    'fns' : {
      'detail': function(vItem) {
          cSys.gAppVars['product-id'] = vItem.Id;
  		  cSys.fGoto('store-product-detail.html');
      }
    }
  });
  return vObj;
}


//----------------------------------------------------------------------------------------------------
//  setup my Books
//----------------------------------------------------------------------------------------------------
function fInitItemPriceRollCourseware(
)
{
  var vObj = new cItemPriceRoll();
  vObj.fInit({
    'rows': 3,
    'ctrls': { 
      'prev': 'ePrevCourseware', 
      'next': 'eNextCourseware',
      'line': 'eLine',
      'row': 'eRowCourseware',
      'more': 'eMore',
      'less': 'eLess',
      'obj': 'cItemPriceRollCourseware'
    },
    'fields': {
      'Cover': 'eThumbCourseware', 
      'Title': 'eTitleCourseware',
      //'Publisher': 'ePublisherCourseWare',
      //'Author': 'eAuthorCourseWare',
      'Level': 'eLevelCourseware',
      'ChildName' : 'eChildCourseware'      
    },
    'fns' : {
      'detail': function(vItem) {
          cSys.gAppVars['product-id'] = vItem.Id;
  		  cSys.fGoto('store-product-detail.html');
      }
    }
  });
  return vObj;
}

//----------------------------------------------------------------------------------------------------
function fRefreshBook(
  vThis
)
{
  vItemPriceRollBook.fSetActive(1);
  vItemPriceRollBook.fRefresh();
}

//----------------------------------------------------------------------------------------------------
function fRefreshTestBank(
  vThis
)
{
  vItemPriceRollTestbank.fSetActive(1);
  vItemPriceRollTestbank.fRefresh();
}

//----------------------------------------------------------------------------------------------------
function fRefreshCourseWare(
  vThis
)
{
  vItemPriceRollCourseware.fSetActive(1);
  vItemPriceRollCourseware.fRefresh();
}
