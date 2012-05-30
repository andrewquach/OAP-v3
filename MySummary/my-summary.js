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
  	  	
  	  var vMySummary = fGet("#eNav_Summary");
  	  vMySummary.className = 'current-menu-item';
  	  cSys.fStartRequest(vThis, 'ListContentRet', 'MySummary/MySummary.php', 'ListContent', {}, 'Fetching...');
      return false;
      
     case 'ListContentRet':
      var vName = vData.Data.ParentName;
      var vChildren = vData.Data.Children;
      var vBook = vData.Data.book;
      var vTestBank = vData.Data.testBank;
      var vCourseWare = vData.Data.courseWare;
      var vChilds = [];
      if (vChildren.length == 0)
      {
      	vChildrenPart = fGet("#eChildren");
      	vChildrenPart.innerHTML = "You have not added any child account";
      }
      else
      {
      	vChildrenPart = fGet("#eChildren");
      	for (var i=0; i<vChildren.length; i++)
      	{
      		vFullName = vChildren[i].FirstName+" "+vChildren[i].LastName;
      		vChildrenPart.innerHTML += "<li><span>Child "+(i+1)+":</span><div>"+vFullName+"</div></li>";
      		vChilds.push({'data': vChildren[i].Id, 'text': vFullName});
      	}
      }
  	  
  	  fResetDropDownChilds({'div': 'eChildsDiv', 'id': 'eChilds'}, vChilds);
  	  
  	  if (cSys.gAppVars['summary-child'] != undefined)
  	  {
  	  	fChangeSelect('eChilds',cSys.gAppVars['summary-child']);
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
	        var vKey = vBook[i].AssigneeId;
	        vItemPriceRollBook.fSetActive(vKey);
	        vItemPriceRollBook.fAdd(vBook[i]);
	        vItemPriceRollBook.fSetActive('-1');
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
	        var vKey = vTestBank[i].AssigneeId;
	        vItemPriceRollTestBank.fSetActive(vKey);
	        vItemPriceRollTestBank.fAdd(vTestBank[i]);
	        vItemPriceRollTestBank.fSetActive('-1');
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
	        var vKey = vCourseWare[i].AssigneeId;
	        vItemPriceRollCourseWare.fSetActive(vKey);
	        vItemPriceRollCourseWare.fAdd(vCourseWare[i]);
	        vItemPriceRollCourseWare.fSetActive('-1');
	        vItemPriceRollCourseWare.fAdd(vCourseWare[i]);
	      }
	      fRefreshCourseWare(vThis);
	  }
      return false;
	  
      
     case 'Filter':
  	  var vChild = fCurrChild();
  	  cSys.gAppVars['summary-child'] = vChild;
  	  fRefresh(vThis);
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
      'Level': 'eLevelBook',
      'ChildName' : 'eChildBook'      
    },
    'fns' : {
      'detail': function(vItem) {
          cSys.gAppVars['item-id'] = vItem.Id;
  		  cSys.fGoto('my-books.html');
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
      'Level': 'eLevelTestBank',
      'ChildName' : 'eChildTestBank'      
    },
    'fns' : {
      'detail': function(vItem) {
          cSys.gAppVars['item-id'] = vItem.Id;
  		  cSys.fGoto('my-testbanks.html');
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
      'Level': 'eLevelCourseWare',
      'ChildName' : 'eChildCourseWare'      
    },
    'fns' : {
      'detail': function(vItem) {
          cSys.gAppVars['item-id'] = vItem.Id;
  		  cSys.fGoto('my-coursewares.html');
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
function fRefresh(
  vThis
)
{
  fRefreshBook(vThis);
  fRefreshTestBank(vThis);
  fRefreshCourseWare(vThis);
}

//----------------------------------------------------------------------------------------------------
function fRefreshBook(
  vThis
)
{
  	
  vItemPriceRollBook.fSetActive(fCurrChild());
  vItemPriceRollBook.fRefresh();
}

//----------------------------------------------------------------------------------------------------
function fRefreshTestBank(
  vThis
)
{
  
  vItemPriceRollTestBank.fSetActive(fCurrChild());
  vItemPriceRollTestBank.fRefresh();
}

//----------------------------------------------------------------------------------------------------
function fRefreshCourseWare(
  vThis
)
{
  
  vItemPriceRollCourseWare.fSetActive(fCurrChild());
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
