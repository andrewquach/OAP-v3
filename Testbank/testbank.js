//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
cPage.mResult = new cDataList;
cPage.vLevel = '';
cPage.vSubject= '';
cPage.vAssignee = '';

var vSubscribed;
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
  
  if (cPage.mResult.fIsReady())
    cPage.mResult.fSignal({'signal': vSignal, 'target': vTarget})

  switch (vSignal)
  {
  	 case 'Init':
      //vBookSlider = fInitBookSlider();
      fInitResultTab();
     return;
  		
  	 case 'Start2':
  	  var vMySummary = fGet("#eNav_Summary");
  	  vMySummary.className = 'current-menu-item';
  	  
  	  var vMyAssignment = fGet("#eNav_Assignment");
  	  vMyAssignment.className = 'current-menu-item';
  	    	  
      cSys.fStartRequest(vThis, 'ListChildrenRet', 'Account/Account.php', 'ListChildren', {}, 'Fetching...');
      if (cSys.gCookies['Role'] == 1)
      		cSys.fStartRequest(vThis, 'ListTestbankDetailRet', 'Testbank/Testbank.php', 'ListTestbankDetailParent', {'ItemId': cSys.gAppVars['item-id']}, 'Fetching...');
      else if (cSys.gCookies['Role'] == 2)
      		cSys.fStartRequest(vThis, 'ListTestbankDetailRet', 'Testbank/Testbank.php', 'ListTestbankDetailChild', {'ItemId': cSys.gAppVars['item-id']}, 'Fetching...');	
      return false;		
      		
      
    
     case 'ListTestbankDetailRet':
     	var vData = vData.Data;
     	fGet('#eCover').setAttribute('src', "res/"+vData[0].Cover);
     	fGet('#eTitle').innerHTML = vData[0].Title;
     	fGet('#ePublisher').innerHTML = vData[0].Publisher;
     	
		if (vData[0].Level == '34')
      		vData[0].Level = 'Primary 3/4';
      	else if ( vData[0].Level == '56')
      		vData[0].Level = 'Primary 5/6';
      	else if (vData[0].Level == '12')
      		vData[0].Level = 'Primary 1/2';
      	else
        	vData[0].Level = 'Primary ' + vData[0].LevelId;
		
		
		fGet('#eLevel').innerHTML = vData[0].Level;
		
		
		vDate = new Date(vData[0].Year,vData[0].Month,vData[0].Date);
		fGet('#eExpired').innerHTML = fFmtDateMonthYear(vDate);
		 if (cSys.gCookies['Role'] == 1)
			fChangeSelect('eChilds',vData[0].AssigneeId);
		cPage.vLevel = vData[0].LevelId;
		cPage.vSubject = vData[0].SubjectId;
		cPage.vAssignee = vData[0].AssigneeId;
		cSys.fStartRequest(cPage.mThis, 'ListTBResultsRet', 'Testbank/Testbank.php', 'ListTBResults', {'ItemId': cSys.gAppVars['item-id'], 'AssigneeId':cPage.vAssignee}, 'Fetching past attempts...');
		if (cSys.gCookies['Role'] == 1){
			vSubscribed = vData[0].Subscribed;
			if (vSubscribed == 1)
				fGet('#eSubscribe').innerHTML = "<span>Alert&nbsp;&nbsp;Me<img src=\"image/email_1.png\" /></span>";
			else 
				fGet('#eSubscribe').innerHTML = "<span>Alert&nbsp;&nbsp;Me<img src=\"image/email_0.png\" /></span>";
     	}
     	return false;
    
     case 'ListTBResultsRet':
      var vTag;
      var vData = vData.Data;
      vDone = 0;
      var vInfo = new Array();
      cPage.mResult.fForgetAll();
      for (var i=0; i<vData.length; i++)
      {
        vTag = fConcatKeys({'lvl': vData[i].LevelId, 'subj': vData[i].SubjectId});
        cPage.mResult.fSetActive(vTag);
        cPage.mResult.fAdd(vData[i]);
        vInfo[vData[i]["TestId"]] = vData[i]["TestInfo"];
        vInfo["alert"] = "Toggle to subscribe/unsubscribe email notifications when your child complete/create a test.";
        if (vData[i]["Attempt"])
        	vDone++;
      }
      if (cPage.mResult.fIsReady())
      {
        vTag = fConcatKeys({'lvl': fCurrLvl(), 'subj': fCurrSubj()});
        cPage.mResult.fSetActive(vTag);
        cPage.mResult.fRefresh();
      }
      if (vData.length == 0)
       	vPercent = 0;
      else
      	vPercent = Math.round(vDone/(vData.length)*100);
      vElm = fGet("#eProgress");
      vElm.style.width = vPercent+"%";
      
      $('.cTip').each(function()
   	  {
      	$(this).qtip(
      	{
         	content: {
            	text: ' ',
				title: {
					text:vInfo[$(this).attr('data')],
					button: true
				}
            },
   			position: {
     			my: 'bottom left', 
      			at: 'top right'
   	    	},
   	    	show: {
				event: 'click',
				solo: true
			},
			hide: false,
   	    	style: {
				classes: 'ui-tooltip-shadow ui-tooltip-youtube'
			}
      	})
   	  });
   	  
      return false;
     	
	 	    
    case 'SwitchSubscribe':
  	  cSys.fStartRequest(vThis, 'SwitchSubscribeRet', 'Testbank/Testbank.php', 
          'SwitchSubscribe', {'ItemId': cSys.gAppVars['item-id']}, 'Updating...');  
  	  return false;
  	 
  	case 'SwitchSubscribeRet':
  	  vSubscribed = 1 - vSubscribed; 
  	  if (vSubscribed == 1)
	 	  fGet('#eSubscribe').innerHTML = "<span>Alert&nbsp;&nbsp;Me<img src=\"image/email_1.png\" /></span>";
	  else 
		  fGet('#eSubscribe').innerHTML = "<span>Alert&nbsp;&nbsp;Me<img src=\"image/email_0.png\" /></span>";
	  return false;
    
    
     case 'SwitchDlgRet':
       if (vData == 'OK'){
       	vChildId = fCurrChild();
  	   	cSys.fStartRequest(vThis, 'SwitchChildRet', 'Testbank/Testbank.php', 
          'SwitchChild', {'ItemId': cSys.gAppVars['item-id'],'ChildId':vChildId}, 'Updating...');
  	   }
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
  	  cSys.fStartModal(cPage.mThis, 'SwitchDlgRet', cMsgBox.fCreate('Testbank Assign','All of the tests and assessment data in this testbank will be deleted!', ['OK','Cancel']));
  	  
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
      
    case 'FetchTestQtnsRet':
      vData = vData.Data;
      for (var i=0; i<vData.length; i++)
      {
      	vData[i].Path = "res/"+vData[i].Path;
      }
      cPage.mQuery.origin.fData(vData);
      return false; 
    
    case 'SetResultRet':
      var vData = vData.Data;
      cPage.mResult.fForgetAll();
      cSys.fStartRequest(cPage.mThis, 'ListTBResultsRet', 'Testbank/Testbank.php', 'ListTBResults', {'ItemId': cSys.gAppVars['item-id'], 'AssigneeId':cPage.vAssignee}, 'Fetching past attempts...');
      return false;  

  }
   
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
function fInitResultTab(
)
{
  cPage.mResult.fInit({
    'tbl': 'eResultList',
    'core': new cDynResultList,
    'win': cPage.mThis,
    'this': this
  });
}

//----------------------------------------------------------------------------------------------------
//  get current level.
//----------------------------------------------------------------------------------------------------
function fCurrLvl(
)
{
  return cPage.vLevel;
}

//----------------------------------------------------------------------------------------------------
//  returns current subject.
//----------------------------------------------------------------------------------------------------
function fCurrSubj(
)
{
  return cPage.vSubject;
}

//----------------------------------------------------------------------------------------------------
//  returns current subject.
//----------------------------------------------------------------------------------------------------
function fCurrAssignee(
)
{
  return cPage.vAssignee;
}

//----------------------------------------------------------------------------------------------------
//  service network requests from cores.
//----------------------------------------------------------------------------------------------------
function fCmd(
  vQuery
)
{
  cPage.mQuery = vQuery;
  vQuery.data["AssigneeId"] = cPage.vAssignee;
  cSys.fStartRequest(cPage.mThis, cPage.mQuery.string + 'Ret', 'Testbank/Testbank.php',
    cPage.mQuery.string, vQuery.data, vQuery.msg);
}

