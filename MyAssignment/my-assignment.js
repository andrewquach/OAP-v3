//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
var vItemPriceRollBook = null;
var vItemPriceRollTestBank = null;
var vItemPriceRollCourseWare = null;
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
      vItemPriceRollBook = fInitItemPriceRollBook();
      vItemPriceRollTestBank = fInitItemPriceRollTestBank();
      vItemPriceRollCourseWare = fInitItemPriceRollCourseWare();
      return;
  		
  	 case 'Start2':
  	  var vMySummary = fGet("#eNav_Assignment");
  	  vMySummary.className = 'current-menu-item';
  	  cSys.fStartRequest(vThis, 'ListContentRet', 'MyAssignment/MyAssignment.php', 'ListContent', {}, 'Fetching...');
      return false;
      
     case 'ListContentRet':
      var vName = vData.Data.Name;
      var vBook = vData.Data.book;
      var vTestBank = vData.Data.testBank;
      var vCourseWare = vData.Data.courseWare;
  	  
      
      for (var i=0; i<1; i++){
      	vFullName = vName[i].FirstName+' '+vName[i].LastName;
      	var vParentName = fGet("#ParentName");
      	vParentName.innerHTML = vFullName +" 's Account";
      	vParentName = fGet("#ParentName2");
      	vParentName.innerHTML = vFullName;
      }
      
      if ((vBook.length + vTestBank.length + vCourseWare.length) == 0)
      	fShow2('eNoContent',true);
      else
      	fShow2('eNoContent',false);
      	
      if (vBook.length == 0){
      	fShow2('eMyBook',false)
      }
      
      else
      {      
	      for (var i=0; i<vBook.length; i++)
	      {
	        if (vBook[i].Level == '34')
      			vBook[i].Level = 'Primary 3/4';
      		else if (vBook[i].Level == '56')
      			vBook[i].Level = 'Primary 5/6';
      		else if (vBook[i].Level == '12')
      			vBook[i].Level = 'Primary 1/2';
      		else
        		vBook[i].Level = 'Primary ' + vBook[i].LevelId;
        		    
	        vBook[i].ChildName = trim(vBook[i].FirstName + ' ' + vBook[i].LastName);
	        var vKey = 1;
	        vItemPriceRollBook.fSetActive(vKey);
	        vItemPriceRollBook.fAdd(vBook[i]);
	      }
	      fRefreshBook(vThis);
	  }
	  
	  if (vTestBank.length == 0){
      	fShow2('eMyTestBank',false)
      }
      
      else
      {      
	      for (var i=0; i<vTestBank.length; i++)
	      {
	        if (vTestBank[i].Level == '34')
      			vTestBank[i].Level = 'Primary 3/4';
      		else if (vTestBank[i].Level == '56')
      			vTestBank[i].Level = 'Primary 5/6';
      		else if (vTestBank[i].Level == '12')
      			vTestBank[i].Level = 'Primary 1/2';
      		else
        		vTestBank[i].Level = 'Primary ' + vTestBank[i].LevelId;
        		    
	        vTestBank[i].ChildName = trim(vTestBank[i].FirstName + ' ' + vTestBank[i].LastName);
	        var vKey = 1;
	        vItemPriceRollTestBank.fSetActive(vKey);
	        vItemPriceRollTestBank.fAdd(vTestBank[i]);
	      }
	      fRefreshTestBank(vThis);
	  }
	  
	  if (vCourseWare.length == 0){
      	fShow2('eMyCourseWare',false)
      }
      
      else
      {      
	      for (var i=0; i<vCourseWare.length; i++)
	      {
	         if (vCourseWare[i].Level == '34')
      			vCourseWare[i].Level = 'Primary 3/4';
      		else if (vCourseWare[i].Level == '56')
      			vCourseWare[i].Level = 'Primary 5/6';
      		else if (vCourseWare[i].Level == '12')
      			vCourseWare[i].Level = 'Primary 1/2';
      		else
        		vCourseWare[i].Level = 'Primary ' + vCourseWare[i].LevelId;
        		    
	        vCourseWare[i].ChildName = trim(vCourseWare[i].FirstName + ' ' + vCourseWare[i].LastName);
	        var vKey = 1;
	        vItemPriceRollCourseWare.fSetActive(vKey);
	        vItemPriceRollCourseWare.fAdd(vCourseWare[i]);
	      }
	      fRefreshCourseWare(vThis);
	  }
      return false;
	  
      
     case 'Filter':
  	  var vChild = fCurrChild();
  	  return false;
  } 
  vItemPriceRollBook.fSignal( {'signal': vSignal, 'target': vTarget} );
  vItemPriceRollTestBank.fSignal( {'signal': vSignal, 'target': vTarget} );
  vItemPriceRollCourseWare.fSignal( {'signal': vSignal, 'target': vTarget} );
  return fSuper(arguments);
}
)


//----------------------------------------------------------------------------------------------------
//  setup my Books
//----------------------------------------------------------------------------------------------------
function fInitItemPriceRollBook(
)
{
  var vObj = new cItemPriceRoll();
  vObj.fInit({
    'rows': 4,
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
          cSys.gAppVars['item-id'] = vItem.Id;
  		  cSys.fGoto('my-books-child.html');
      }
    }
  });
  return vObj;
}

//----------------------------------------------------------------------------------------------------
//  setup my Books
//----------------------------------------------------------------------------------------------------
function fInitItemPriceRollTestBank(
)
{
  var vObj = new cItemPriceRoll();
  vObj.fInit({
    'rows': 4,
    'ctrls': { 
      'prev': 'ePrevTestBank', 
      'next': 'eNextTestBank',
      'line': 'eLine',
      'row': 'eRowTestBank',
      'more': 'eMore',
      'less': 'eLess',
      'obj': 'cItemPriceRollTestBank'
    },
    'fields': {
      'Cover': 'eThumbTestBank', 
      'Title': 'eTitleTestBank',
      //'Publisher': 'ePublisherTestBank',
      //'Author': 'eAuthorTestBank',
      'Level': 'eLevelTestBank'      
    },
    'fns' : {
      'detail': function(vItem) {
          cSys.gAppVars['item-id'] = vItem.Id;
  		  cSys.fGoto('my-testbanks-child.html');
      }
    }
  });
  return vObj;
}


//----------------------------------------------------------------------------------------------------
//  setup my Books
//----------------------------------------------------------------------------------------------------
function fInitItemPriceRollCourseWare(
)
{
  var vObj = new cItemPriceRoll();
  vObj.fInit({
    'rows': 4,
    'ctrls': { 
      'prev': 'ePrevCourseWare', 
      'next': 'eNextCourseWare',
      'line': 'eLine',
      'row': 'eRowCourseWare',
      'more': 'eMore',
      'less': 'eLess',
      'obj': 'cItemPriceRollCourseWare'
    },
    'fields': {
      'Cover': 'eThumbCourseWare', 
      'Title': 'eTitleCourseWare',
      //'Publisher': 'ePublisherCourseWare',
      //'Author': 'eAuthorCourseWare',
      'Level': 'eLevelCourseWare'      
    },
    'fns' : {
      'detail': function(vItem) {
          cSys.gAppVars['item-id'] = vItem.Id;
  		  cSys.fGoto('my-coursewares-child.html');
      }
    }
  });
  return vObj;
}


//----------------------------------------------------------------------------------------------------
function fCurrChild(
)
{
  return fDropListData('eChilds');
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
  vItemPriceRollTestBank.fSetActive(1);
  vItemPriceRollTestBank.fRefresh();
}

//----------------------------------------------------------------------------------------------------
function fRefreshCourseWare(
  vThis
)
{
  vItemPriceRollCourseWare.fSetActive(1);
  vItemPriceRollCourseWare.fRefresh();
}

//----------------------------------------------------------------------------------------------------
function trim(s)
{
	var l=0; var r=s.length -1;
	while(l < s.length && s[l] == ' ')
	{	l++; }
	while(r > l && s[r] == ' ')
	{	r-=1;	}
	return s.substring(l, r+1);
}


//----------------------------------------------------------------------------------------------------
function fResetDropDownChilds(
  vTarget, 
  vList
)
{
  var vOpts = '<option data=\'-1\'>All</option>';

  for (var i=0; i<vList.length; i++)
  {
    var p = vList[i];
    vOpts += '<option data=\'' + p.data + '\'>' + p.text + '</option>';
  }
  
  vOpts += '<option data=\'0\'>None</option>';
  
  fGet('#' + vTarget.div).innerHTML = 
    '<select id=\'' + vTarget.id + '\'>' + vOpts + '</select>';  
}
