//----------------------------------------------------------------------------------------------------
//  variables
//----------------------------------------------------------------------------------------------------
cPage.mThis = null;
var vBookSliderMath;  // textbooks gallery
var vBookSliderScience;  // textbooks gallery
var vBookSliderEnglish;  // textbooks gallery
var vBookSliderChinese;
var vBookSliderTestBank;
var vBookSlidercWEnglish;
var vBookSlidercWChinese;
var vBookSlidercWEduPro;

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
      vBookSliderMath = fInitBookSlider();
      vBookSliderEnglish = fInitBookSlider();
      vBookSliderScience = fInitBookSlider();
      vBookSliderChinese = fInitBookSlider();
      vBookSliderTestBank = fInitBookSlider();
      vBookSlidercWEnglish = fInitBookSlider();
      vBookSlidercWChinese = fInitBookSlider();
      vBookSlidercWEduPro = fInitBookSlider();
     return;
  		
  	 case 'Start2':
  	  	
  	  var vStore = fGet("#eNav_Store");
  	  vStore.className = 'current-menu-item';
  	  if (cSys.gAppVars['store-lvl'] != undefined)
  	  {
  	  	fChangeSelect('eLvls',cSys.gAppVars['store-lvl']);
  	  }
  	  else
  	  {
  	  	cSys.gAppVars['store-lvl'] = "0";
  	  }
  	  if (cSys.gAppVars['store-subj'] != undefined)
  	  {
  	  	fChangeSelect('eSubjs',cSys.gAppVars['store-subj']);
  	  }
  	  else
  	  {
  	  	cSys.gAppVars['store-subj'] = "0";
  	  }
  	  if (cSys.gAppVars['store-type'] != undefined)
  	  {
  	  	fChangeSelect('eTypes',cSys.gAppVars['store-type']);
  	  }
  	  else
  	  {
  	  	cSys.gAppVars['store-type'] = "0";
  	  }
  	  cSys.fStartRequest(vThis, 'ListBookSeparateRet', 'Store/Store.php', 'ListBookSeparate', {'level': cSys.gAppVars['store-lvl'],'subject': cSys.gAppVars['store-subj']}, 'Fetching...');
  	  
      return false;
    
     case 'Filter':
  	  var vLvl = fCurrLvl();
  	  var vSubj = fCurrSubj();
  	  var vType = fCurrType();
  	  cSys.gAppVars['store-lvl'] = vLvl;
  	  cSys.gAppVars['store-subj'] = vSubj;
  	  cSys.gAppVars['store-type'] = vType;
  	  if ((vLvl != "0") && (vSubj != "0") && (vType != "0"))
  	  	cSys.fGoto("store-product-list.html");
  	  else 
  	  	cSys.fGoto("store.html"); 
  	  return false;
  	  
  	 case 'ListBookSeparateRet':
  	  	
  	  	if (cSys.gAppVars['store-type'] == 1)
  	  	{
  	  		fShow3('eTestBankPanel',false);
  	  		fShow3('eCoursewarePanel',false);
  	  	}
  	  	else if (cSys.gAppVars['store-type'] == 2)
  	  	{
  	  		fShow3('eBookPanel',false);
  	  		fShow3('eCoursewarePanel',false);
  	  	}
  	  	else if (cSys.gAppVars['store-type'] == 3)
  	  	{
  	  		fShow3('eTestBankPanel',false);
  	  		fShow3('eBookPanel',false);
  	  	}
  	  	
  	  	if 	(cSys.gAppVars['store-type'] == 1 || cSys.gAppVars['store-type'] == 0)
  	  	{
			var vDataMath = vData.Data.bookMathematics;
			var vDataScience = vData.Data.bookScience;
			var vDataEnglish = vData.Data.bookEnglish; 
			var vDataChinese = vData.Data.bookChinese;
			
			if (vDataMath.length == 0 || (cSys.gAppVars['store-subj'] != 1 && cSys.gAppVars['store-subj'] != 0))
				fShow3('eBookMathematics',false);
			else
			{
				for (var i=0; i<vDataMath.length; i++)
				{
					if (vDataMath[i].Level == '34')
      					vDataMath[i].Level = 'Primary 3/4';
      				else if (vDataMath[i].Level == '56')
      					vDataMath[i].Level = 'Primary 5/6';
      				else if (vDataMath[i].Level == '12')
      					vDataMath[i].Level = 'Primary 1/2';
      				else
        				vDataMath[i].Level = 'Primary ' + vDataMath[i].LevelId;
        				
					var vKey = fConcatKeys({'SubjectId': vDataMath[i].SubjectId, 'LevelId': vDataMath[i].LevelId});
					vBookSliderMath.fSetActive(vKey);
					vBookSliderMath.fAdd(vDataMath[i]);
				}
				vBookSliderMath.fDisplayAll('#mycarouselmath');
				jQuery('#mycarouselmath').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}
			
			
			if (vDataScience.length == 0 || (cSys.gAppVars['store-subj'] != 2 && cSys.gAppVars['store-subj'] != 0))
				fShow3('eBookScience',false);
			else
			{
				for (var i=0; i<vDataScience.length; i++)
				{
					if (vDataScience[i].Level == '34')
      					vDataScience[i].Level = 'Primary 3/4';
      				else if (vDataScience[i].Level == '56')
      					vDataScience[i].Level = 'Primary 5/6';
      				else if (vDataScience[i].Level == '12')
      					vDataScience[i].Level = 'Primary 1/2';
      				else
        				vDataScience[i].Level = 'Primary ' + vDataScience[i].LevelId;
					
					var vKey = fConcatKeys({'SubjectId': vDataScience[i].SubjectId, 'LevelId': vDataScience[i].LevelId});
					vBookSliderScience.fSetActive(vKey);
					vBookSliderScience.fAdd(vDataScience[i]);
				}
				vBookSliderScience.fDisplayAll('#mycarouselscience');
				jQuery('#mycarouselscience').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}
			
			if (vDataEnglish.length == 0 || (cSys.gAppVars['store-subj'] != 3 && cSys.gAppVars['store-subj'] != 0))
				fShow3('eBookEnglish',false);
			else
			{
				for (var i=0; i<vDataEnglish.length; i++)
				{
					if (vDataEnglish[i].Level == '34')
      					vDataEnglish[i].Level = 'Primary 3/4';
      				else if (vDataEnglish[i].Level == '56')
      					vDataEnglish[i].Level = 'Primary 5/6';
      				else if (vDataEnglish[i].Level == '12')
      					vDataEnglish[i].Level = 'Primary 1/2';
      				else
        				vDataEnglish[i].Level = 'Primary ' + vDataEnglish[i].LevelId;
        				
					var vKey = fConcatKeys({'SubjectId': vDataEnglish[i].SubjectId, 'LevelId': vDataEnglish[i].LevelId});
					vBookSliderEnglish.fSetActive(vKey);
					vBookSliderEnglish.fAdd(vDataEnglish[i]);
				}
				vBookSliderEnglish.fDisplayAll('#mycarouselenglish');
				jQuery('#mycarouselenglish').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}
			
			if (vDataChinese.length == 0 || (cSys.gAppVars['store-subj'] != 4 && cSys.gAppVars['store-subj'] != 0))
				fShow3('eBookChinese',false);
			else
			{
				for (var i=0; i<vDataChinese.length; i++)
				{
					if (vDataChinese[i].Level == '34')
      					vDataChinese[i].Level = 'Primary 3/4';
      				else if (vDataChinese[i].Level == '56')
      					vDataChinese[i].Level = 'Primary 5/6';
      				else if (vDataChinese[i].Level == '12')
      					vDataChinese[i].Level = 'Primary 1/2';
      				else
        				vDataChinese[i].Level = 'Primary ' + vDataChinese[i].LevelId;
					
					
					var vKey = fConcatKeys({'SubjectId': vDataChinese[i].SubjectId, 'LevelId': vDataChinese[i].LevelId});
					vBookSliderChinese.fSetActive(vKey);
					vBookSliderChinese.fAdd(vDataChinese[i]);
				}
				vBookSliderChinese.fDisplayAll('#mycarouselchinese');
				jQuery('#mycarouselchinese').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}
		}
		
		if 	(cSys.gAppVars['store-type'] == 2 || cSys.gAppVars['store-type'] == 0)
  	  	{
			var vTestBank = vData.Data.testBank; 
			
			if (vTestBank.length > 0)
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
        				
					var vKey = fConcatKeys({'SubjectId': vTestBank[i].SubjectId, 'LevelId': vTestBank[i].LevelId});
					vBookSliderTestBank.fSetActive(vKey);
					vBookSliderTestBank.fAdd(vTestBank[i]);
				}
				vBookSliderTestBank.fDisplayAll('#mycarouseltestbank');
				jQuery('#mycarouseltestbank').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}
		}
		
		if 	(cSys.gAppVars['store-type'] == 3 || cSys.gAppVars['store-type'] == 0)
  	  	{
  	  		var vCoursewareEnglish = vData.Data.coursewareEnglish;
  	  		var vCoursewareChinese = vData.Data.coursewareChinese;
  	  		var vCoursewareEduPro = vData.Data.coursewareEduPro;
  	  		if (vCoursewareEnglish.length == 0 || (cSys.gAppVars['store-subj'] != 3 && cSys.gAppVars['store-subj'] != 0))
				fShow3('eCoursewareEnglish',false);
  	  		else
			{
				for (var i=0; i<vCoursewareEnglish.length; i++)
				{
					if (vCoursewareEnglish[i].Level == '34')
      					vCoursewareEnglish[i].Level = 'Primary 3/4';
      				else if (vCoursewareEnglish[i].Level == '56')
      					vCoursewareEnglish[i].Level = 'Primary 5/6';
      				else if (vCoursewareEnglish[i].Level == '12')
      					vCoursewareEnglish[i].Level = 'Primary 1/2';
      				else
        				vCoursewareEnglish[i].Level = 'Primary ' + vCoursewareEnglish[i].LevelId;
        				
					var vKey = fConcatKeys({'SubjectId': vCoursewareEnglish[i].SubjectId, 'LevelId': vCoursewareEnglish[i].LevelId});
					vBookSlidercWEnglish.fSetActive(vKey);
					vBookSlidercWEnglish.fAdd(vCoursewareEnglish[i]);
				}
				vBookSlidercWEnglish.fDisplayAll('#mycarouselcwenglish');
				jQuery('#mycarouselcwenglish').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}
			
			if (vCoursewareChinese.length == 0 || (cSys.gAppVars['store-subj'] != 4 && cSys.gAppVars['store-subj'] != 0)){
				fShow3('eCoursewareChinese',false);
			}
  	  		else
			{
				for (var i=0; i<vCoursewareChinese.length; i++)
				{
					if (vCoursewareChinese[i].Level == '34')
      					vCoursewareChinese[i].Level = 'Primary 3/4';
      				else if (vCoursewareChinese[i].Level == '56')
      					vCoursewareChinese[i].Level = 'Primary 5/6';
      				else if (vCoursewareChinese[i].Level == '12')
      					vCoursewareChinese[i].Level = 'Primary 1/2';
      				else
        				vCoursewareChinese[i].Level = 'Primary ' + vCoursewareChinese[i].LevelId;
        				
					var vKey = fConcatKeys({'SubjectId': vCoursewareChinese[i].SubjectId, 'LevelId': vCoursewareChinese[i].LevelId});
					vBookSlidercWChinese.fSetActive(vKey);
					vBookSlidercWChinese.fAdd(vCoursewareChinese[i]);
				}
				vBookSlidercWChinese.fDisplayAll('#mycarouselcwchinese');
				jQuery('#mycarouselcwchinese').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}
			
			if (vCoursewareEduPro.length == 0 || (cSys.gAppVars['store-subj'] != 4 && cSys.gAppVars['store-subj'] != 0)){
				fShow3('eCoursewareEduPro',false);
			}
  	  		else
			{	
				for (var i=0; i<vCoursewareEduPro.length; i++)
				{
					if (vCoursewareEduPro[i].Level == '34')
      					vCoursewareEduPro[i].Level = 'Primary 3/4';
      				else if (vCoursewareEduPro[i].Level == '56')
      					vCoursewareEduPro[i].Level = 'Primary 5/6';
      				else if (vCoursewareEduPro[i].Level == '12')
      					vCoursewareEduPro[i].Level = 'Primary 1/2';
      				else
        				vCoursewareEduPro[i].Level = 'Primary ' + vCoursewareEduPro[i].LevelId;
        				
					var vKey = fConcatKeys({'SubjectId': vCoursewareEduPro[i].SubjectId, 'LevelId': vCoursewareEduPro[i].LevelId});
					vBookSlidercWEduPro.fSetActive(vKey);
					vBookSlidercWEduPro.fAdd(vCoursewareEduPro[i]);
				}
				vBookSlidercWEduPro.fDisplayAll('#mycarouselcwedupro');
				jQuery('#mycarouselcwedupro').jcarousel({
					auto: 1,
					wrap: 'last',
					scroll: 1,
					initCallback: mycarousel_initCallback
				});
			}


  	  	}
      	
      	return;

  }
  vBookSliderMath.fSignal( {'signal': vSignal, 'target': vTarget} );
  vBookSliderScience.fSignal( {'signal': vSignal, 'target': vTarget} ); 
  vBookSliderEnglish.fSignal( {'signal': vSignal, 'target': vTarget} );
  vBookSliderTestBank.fSignal( {'signal': vSignal, 'target': vTarget} );
  vBookSlidercWEnglish.fSignal( {'signal': vSignal, 'target': vTarget} );
  vBookSlidercWChinese.fSignal( {'signal': vSignal, 'target': vTarget} );
  vBookSlidercWEduPro.fSignal( {'signal': vSignal, 'target': vTarget} );  
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
