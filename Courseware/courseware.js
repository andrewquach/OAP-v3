//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
cPage.mCoursewareList = new cDataList;
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

  switch (vSignal)
  {
  	 case 'Init':
      //vBookSlider = fInitBookSlider();
      fInitCoursewareList();
     return;
  		
  	 case 'Start2':
  	  var vMySummary = fGet("#eNav_Summary");
  	  vMySummary.className = 'current-menu-item';
  	  
  	  var vMyAssignment = fGet("#eNav_Assignment");
  	  vMyAssignment.className = 'current-menu-item';
  	    	  
      cSys.fStartRequest(vThis, 'ListChildrenRet', 'Account/Account.php', 'ListChildren', {}, 'Fetching...');
      if (cSys.gCookies['Role'] == 1)
      		cSys.fStartRequest(vThis, 'ListCoursewareDetailRet', 'Courseware/Courseware.php', 'ListCoursewareDetailParent', {'ItemId': cSys.gAppVars['item-id']}, 'Fetching...');
      else if (cSys.gCookies['Role'] == 2)
      		cSys.fStartRequest(vThis, 'ListCoursewareDetailRet', 'Courseware/Courseware.php', 'ListCoursewareDetailChild', {'ItemId': cSys.gAppVars['item-id']}, 'Fetching...');
      		
      cSys.fStartRequest(vThis, 'ListCoursewareItemsRet', 'Courseware/Courseware.php', 
          'ListCoursewareItems', {'cWId': cSys.gAppVars['item-id']}, 'Fetching tests...');
        
      return false;
    
     case 'ListCoursewareDetailRet':
     	vData = vData.Data;
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
		 if (cSys.gCookies['Role'] == 1){
			fChangeSelect('eChilds',vData[0].AssigneeId);
			vSubscribed = vData[0].Subscribed;
			if (vSubscribed == 1)
				fGet('#eSubscribe').innerHTML = "<span>Alert&nbsp;&nbsp;Me<img src=\"image/email_1.png\" /></span>";
			else 
				fGet('#eSubscribe').innerHTML = "<span>Alert&nbsp;&nbsp;Me<img src=\"image/email_0.png\" /></span>";	
		}
		
		$('.cTip').each(function()
   	  	{
      		$(this).qtip(
      		{
         		content: {
            		text: ' ',
					title: {
						text:$(this).attr('data'),
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
    	
	 case "ListCoursewareItemsRet":
      vData = vData.Data;
      cPage.mCoursewareList.fSetActive(cSys.gAppVars['item-id']);
      vDone = 0;
      for (var i=0; i<vData.length; i++){
        cPage.mCoursewareList.fAdd(vData[i]);
        if (vData[i]["LastAttempt"])
        	vDone++;
      }
      if (vData.length == 0)
      	vPercent = 0;
      else
      	vPercent = Math.round(vDone/(vData.length)*100);
      vElm = fGet("#eProgress");
      vElm.style.width = vPercent+"%";
      
      cPage.mCoursewareList.fRefresh();
      for (var i=0; i<vData.length; i++){
        $("#c"+vData[i].Id).fancybox({
        		'width'				: '100%',
				'height'			: '100%',
				'autoScale'			: true,
				'transitionIn'		: 'elastic',
				'transitionOut'		: 'elastic',
				'easingIn'      	: 'easeOutBack',
				'easingOut'     	: 'easeInBack',
				'type'				: 'iframe',
				'hideOnOverlayClick': false,
				'onComplete' : function() {
    				$('#fancybox-frame').load(function() { // wait for frame to load and then gets it's height
    					$('#fancybox-outer').width($(this).contents().find('body').height()*80/56);
      					$('#fancybox-content').width($(this).contents().find('body').height()*80/56-20);
      					parent.$.fancybox.center();
    				});
    			},
				'onClosed'	:	function() {
					if (cSys.gCookies['Role'] == 2)
    				{
    					cSys.fGoto('my-coursewares-child.html');
    				}
				}
			});
      }
      return false;	    
	
	 case 'UpdateCoursewareAttemptRet':
	 	//vData = vData.Data;
	 	//cSys.fGoto('my-coursewares-child.html');
	 	return false;
	 	    
     case 'SwitchDlgRet':
       if (vData == "OK"){
       	vChildId = fCurrChild();
  	   	cSys.fStartRequest(vThis, 'SwitchChildRet', 'Courseware/Courseware.php', 
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
  	  cSys.fStartModal(cPage.mThis, 'SwitchDlgRet', cMsgBox.fCreate('Courseware Assignment','All of the assessment data in this courseware will be deleted!', ['OK','Cancel']));
  	  
  	  return false;
	
	case 'SwitchSubscribe':
  	  cSys.fStartRequest(vThis, 'SwitchSubscribeRet', 'Book/Book.php', 
          'SwitchSubscribe', {'ItemId': cSys.gAppVars['item-id']}, 'Updating...');  
  	  return false;
  	 
  	case 'SwitchSubscribeRet':
  	  vSubscribed = 1 - vSubscribed; 
  	  if (vSubscribed == 1)
	 	  fGet('#eSubscribe').innerHTML = "<span>Alert&nbsp;&nbsp;Me<img src=\"image/email_1.png\" /></span>";
	  else 
		  fGet('#eSubscribe').innerHTML = "<span>Alert&nbsp;&nbsp;Me<img src=\"image/email_0.png\" /></span>";
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
  cPage.mCoursewareList.fSignal({'signal': vSignal, 'target': vTarget}); 
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
function fInitCoursewareList(
)
{
  cPage.mCoursewareList.fInit({
    'tbl': 'eListData',
    'core': new cCoursewareList,
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
  cSys.fStartRequest(cPage.mThis, cPage.mQuery.string + 'Ret', 'Courseware/Courseware.php',
    cPage.mQuery.string, vQuery.data, vQuery.msg);
}
