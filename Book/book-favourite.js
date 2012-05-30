//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
cPage.mFavoriteList = new cDataList;
cPage.mQuery = null;
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
      //vBookSlider = fInitBookSlider();
      fInitFavoriteList();
     return;
  		
  	 case 'Start2':
  	  var vMySummary = fGet("#eNav_Summary");
  	  vMySummary.className = 'current-menu-item';
  	  
  	  var vMyAssignment = fGet("#eNav_Assignment");
  	  vMyAssignment.className = 'current-menu-item';
  	  
  	  cSys.fStartRequest(vThis, 'ListChildrenRet', 'Account/Account.php', 'ListChildren', {}, 'Fetching...');
  	  
  	  if (cSys.gCookies['Role'] == 1)
      		cSys.fStartRequest(vThis, 'ListBookDetailRet', 'Book/Book.php', 'ListBookDetailParent', {'ItemId': cSys.gAppVars['item-id']}, 'Fetching...');
      else if (cSys.gCookies['Role'] == 2)
      		cSys.fStartRequest(vThis, 'ListBookDetailRet', 'Book/Book.php', 'ListBookDetailChild', {'ItemId': cSys.gAppVars['item-id']}, 'Fetching...');
  	  
  	  cSys.fStartRequest(vThis, 'ListFavoritesRet', 'Book/Book.php',
          'ListFavorites', {'BookId': cSys.gAppVars['item-id']}, 'Fetching tests...');
      return false;
     
     
     case 'ListBookDetailRet':
     	vData = vData.Data;
     	fGet('#eCover').setAttribute('src', "res/"+vData[0].Cover);
     	fGet('#eTitle').innerHTML = vData[0].Title;
     	fGet('#ePublisher').innerHTML = vData[0].Publisher;
		fGet('#eAuthor').innerHTML = vData[0].Author;
		fGet('#eLevel').innerHTML = 'Primary ' + vData[0].LevelId;
		 if (cSys.gCookies['Role'] == 1)
			fChangeSelect('eChilds',vData[0].AssigneeId);
     	return false;
     
      
     case 'SwitchDlgRet':
       vChildId = fCurrChild();
  	   cSys.fStartRequest(vThis, 'SwitchChildRet', 'Book/Book.php', 
          'SwitchChild', {'ItemId': cSys.gAppVars['item-id'],'ChildId':vChildId}, 'Updating...');
  	  
  	  return false;
  	  
  	case 'SwitchChildRet':
  	   var vData = vData.Data;
      switch (vData.Success)
      {
        case 1:
          cSys.fGoto('my-summary.html');
          break;
      }  	  
  	  return false;
  	  
  	case 'Switch':
  	  cSys.fStartModal(cPage.mThis, 'SwitchDlgRet', cMsgBox.fCreate('All of the assessment data in this item will be deleted!', ['Ok']));  
  	  return false;
  	  
	case 'FetchTestQtnsRet':
    case 'FetchFavQtnRet':
      cPage.mQuery.origin.fData(vData.Data);
      return false;
  
  	  
  	case 'ListFavoritesRet': 
      vData = vData.Data;
      cPage.mFavoriteList.fSetActive(cSys.gAppVars['item-id']);
      for (var i=0; i<vData.length; i++)
        cPage.mFavoriteList.fAdd(vData[i]);
      cPage.mFavoriteList.fRefresh();
      return false;
    
    case 'UpdateFavRet':
      cPage.mFavoriteList.fForgetAll();
      cSys.fStartRequest(vThis, 'ListFavoritesRet', 'Book/Book.php',
          'ListFavorites', vBook, 'Fetching tests...');
      return false;
      
   	case 'ListChildrenRet':
      var vName = vData.Data.ParentName;
      var vChildren = vData.Data.Children;
      var vChilds = [];
	 if (cSys.gCookies['Role'] == 1){	
      	for (var i=0; i<vChildren.length; i++)
      	{
      		vFullName = vChildren[i].FirstName+" "+vChildren[i].LastName;
      		vChilds.push({'data': vChildren[i].Id, 'text': vFullName});
      	}
   		fResetDropDownChilds({'div': 'eChildsDiv', 'id': 'eChilds'}, vChilds);
   	}
      for (var i=0; i<1; i++){
      	vFullName = vName[i].FirstName+' '+vName[i].LastName;
      	var vParentName = fGet("#ParentName");
      	vParentName.innerHTML = vFullName +" 's Account"; 
      }
      
      return false;

  }
  cPage.mFavoriteList.fSignal({'signal': vSignal, 'target': vTarget}); 
  return fSuper(arguments);
}
)

//----------------------------------------------------------------------------------------------------
function fCurrChild(
)
{
  return fDropListData('eChilds');
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
function fInitFavoriteList(
)
{
  cPage.mFavoriteList.fInit({
    'tbl': 'eListData',
    'core': new cFavoriteList,
    'win': cPage.mThis,
    'this': this
  });
}

//----------------------------------------------------------------------------------------------------
function fResetDropDownChilds(
  vTarget, 
  vList
)
{
  var vOpts = '';
  vOpts += '<option data=\'0\'>None</option>';	
  for (var i=0; i<vList.length; i++)
  {
    var p = vList[i];
    vOpts += '<option data=\'' + p.data + '\'>' + p.text + '</option>';
  }  
  fGet('#' + vTarget.div).innerHTML = 
    '<select id=\'' + vTarget.id + '\'>' + vOpts + '</select>';  
}

//----------------------------------------------------------------------------------------------------
//  relay data retrieval requests from 'subordinate' classes.  the controller (this) will do the
//  data retrieval requests on everyone's behalf.
//----------------------------------------------------------------------------------------------------
function fCmd(
  vQuery
)
{
  cPage.mQuery = vQuery;
  cSys.fStartRequest(cPage.mThis, cPage.mQuery.string + 'Ret', 'Book/Book.php',
    cPage.mQuery.string, vQuery.data, vQuery.msg);
}
