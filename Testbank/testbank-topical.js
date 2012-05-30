//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
cPage.mTopic = new cDataList;
cPage.vLevel = '';
cPage.vSubject= '';
cPage.vAssignee = '';
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
  
  if (cPage.mTopic.fIsReady())
    cPage.mTopic.fSignal({'signal': vSignal, 'target': vTarget});
	

  switch (vSignal)
  {
  	 case 'Init':
      //vBookSlider = fInitBookSlider();
      fInitTopic();
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
		fGet('#eExpired').innerHTML = fFmtDateMonthYear(new Date(vDate));
		cPage.vLevel = vData[0].LevelId;
		cPage.vSubject = vData[0].SubjectId;
		cPage.vAssignee = vData[0].AssigneeId;
		cSys.fStartRequest(cPage.mThis, 'ListTopicsRet', 'Testbank/Testbank.php', 'ListTopics', {'level':cPage.vLevel,'subject':cPage.vSubject}, 'Fetching...');
     	return false;
    
     case 'SwitchDlgRet':
       vChildId = fCurrChild();
  	   cSys.fStartRequest(vThis, 'SwitchChildRet', 'Testbank/Testbank.php', 
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

      
   	case 'ListChildrenRet':
      var vName = vData.Data.ParentName;
      var vChildren = vData.Data.Children;
      var vChilds = [];
      for (var i=0; i<1; i++){
      	vFullName = vName[i].FirstName+' '+vName[i].LastName;
      	var vParentName = fGet("#ParentName");
      	vParentName.innerHTML = vFullName +" 's Account"; 
      }
      
      return false;
	  
	  
	 case 'ListTopicsRet':
      var vData = vData.Data;
      var vTopics = vData.topics;
      var vFocus = vData.focus;
      // reflect last session's selections
      for (var i=0; i<vTopics.length; i++)
      {
        vTopics[i].On = 0;
        for (var j=0; j<vFocus.length; j++)
          if (vTopics[i].TopicId == vFocus[j].TopicId)
          {
            vTopics[i].On = 1;
            break;
          }
      }

      // add topics
      var vTag;
      for (var i=0; i<vTopics.length; i++)
      {
        vTag = fConcatKeys({'lvl': vTopics[i].LevelId, 'subj': vTopics[i].SubjectId});
        cPage.mTopic.fSetActive(vTag);
        cPage.mTopic.fAdd(vTopics[i]);
      }
      if (cPage.mTopic.fIsReady())
      {
        vTag = fConcatKeys({'lvl': cPage.vLevel, 'subj': cPage.vSubject});
        cPage.mTopic.fSetActive(vTag);
        cPage.mTopic.fRefresh();
      }
      return false;
      
    case 'Generate':
    	if (cPage.vAssignee == 0){
    		cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBoxError.fCreate('Topical Test','You have not assigned this testbank to any child! Please assign first before generate a test!', ['OK']));
	    	return false;
    	}
    		
     	var vTopics = [];
    	var vSel = cPage.mTopic.fCore().fSelected();
    	if (vSel.length == 0){
	    	cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBoxError.fCreate('Topical Test','You have not selected any topic!', ['OK']));
	    	return false;
	    }
	    if (vSel.length > fNumQtns()){
	    	cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBoxError.fCreate('Topical Test','The number of questions is less than the number of topics, please re-choose!', ['OK']));
	    	return false;
	    }
	    for (var i=0; i<vSel.length; i++)
	      vTopics.push(vSel[i].TopicId);
	    
	    cSys.fStartRequest(cPage.mThis, 'GenTestByTopicsRet', 'Testbank/Testbank.php',
	      'GenTestByTopics', { 'SubjectId': cPage.vSubject, 'LevelId': cPage.vLevel, 
	        'Topics': vTopics, 'AssigneeId' : cPage.vAssignee, 'NumQtns': fNumQtns()}, '');
	    return false;
	        
	case 'GenTestByTopicsRet':
	  vData = vData.Data;
      for (var i=0; i<vData.Qtns.length; i++)
      {
      	vData.Qtns[i].Path = "res/"+vData.Qtns[i].Path;
      }
      cPage.mTopic.fCore().fData(vData);
      return false;
    
    case 'SetTestRet':
    	cSys.fStartModal(cPage.mThis, 'SetTestDlgRet', cMsgBox.fCreate('Topical Test','You have successfully created a Topical Test!', ['Ok']));
    	return false;
    	
   	case 'SetResultRet':
    	cSys.fStartModal(cPage.mThis, 'SetResultDlgRet', cMsgBox.fCreate('Topical Test','You have successfully created a Topical Test!', ['Ok']));
    	return false;
    	
    case 'SetResultDlgRet':
    	cSys.fGoto("my-testbanks-child.html");
    	return false;
    	
    case 'SetTestDlgRet':
    	cSys.fGoto("my-testbanks.html");
    	return false;
   	
   	case 'AddFocusRet':
    case 'RemoveFocusRet':
    case 'SaveToResumeRet':
      var vData = vData.Data;
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
function fInitTopic(
)
{
  cPage.mTopic.fInit({
    'tbl': 'eListTopics',
    'core': new cTopics,
    'win': cPage.mThis,
    'this': this
  });
}

//----------------------------------------------------------------------------------------------------
//  get no. of qtns selected.
//----------------------------------------------------------------------------------------------------
function fNumQtns(
)
{
  return fDropListData('eNumQtns');
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
  cSys.fStartRequest(cPage.mThis, cPage.mQuery.string + 'Ret', 'Testbank/Testbank.php',
    cPage.mQuery.string, vQuery.data, vQuery.msg);
}

