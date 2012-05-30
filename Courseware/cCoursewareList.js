//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cCoursewareList()
{
  this.xQtns = {};  // 'test-id' => 'qtns'
  this.xQuery = {};   // query context
  this.xTestId = null;
  this.xTest = null;  // current selected test
  this.xRedo = false;
}

//----------------------------------------------------------------------------------------------------
//  format a row.
//----------------------------------------------------------------------------------------------------
cCoursewareList.prototype.fFormat =
function(
  vList
)
{
  for (var i=0; i<vList.length; i++)
  {
  	if (! vList[i].LastAttempt)
  		vList[i].LastAttempt = '';
  /*
    // don't display score; test is in 'pause' mode
    if (vList[i].Paused == 1) 
    {
      vList[i].PauseImg = '<img src=\'images/pause.png\'/>';
      vList[i].Correct = vList[i].Total = vList[i].Percent = vList[i].Last = vList[i].First = vList[i].Attempt = '';
      continue;
    }

    // don't display score; not done yet
    if (! vList[i].Correct) 
    {
      vList[i].Correct = vList[i].Total = vList[i].Percent = '';
      vList[i].High = vList[i].Past = vList[i].PauseImg = vList[i].Last = vList[i].First = vList[i].Attempt = '';
      continue;
    }

    vList[i].PauseImg = '';
    if (! vList[i].High)
      vList[i].High = '';

    // display score as this test has been taken
    if (vList[i].Total > 0)
      vList[i].Percent = ((vList[i].Correct * 100)/vList[i].Total).toFixed(0) + '%';
    else
      vList[i].Correct = vList[i].Percent = '';
    
    // display difference between current and last score        
    if (vList[i].LastCorrect)
    {
      if (parseInt(vList[i].LastCorrect) == parseInt(vList[i].Correct))
        vList[i].Past = '(0)';
      else if (parseInt(vList[i].LastCorrect) > parseInt(vList[i].Correct))
      {
        vList[i].Past = '<img src=\'images/redDown.png\'/>' + ' (-' + 
          (vList[i].LastCorrect - vList[i].Correct) + ')';
      }
      else
      {
        vList[i].Past = '<img src=\'images/greenUp.png\'/>' + ' (+' +
          (vList[i].Correct - vList[i].LastCorrect) + ')';
      }
      vList[i].Last = vList[i].LastCorrect;
    }
    else{
      vList[i].Past = '';
      vList[i].Last = '';
    }
    */    
  }
}

//----------------------------------------------------------------------------------------------------
//  received data.
//----------------------------------------------------------------------------------------------------
cCoursewareList.prototype.fData =
function(
  vData
)
{
  //this.xQtns[this.xQuery.testId] = vData; 
  //this.fShowFlash(vData);
}

//----------------------------------------------------------------------------------------------------
//  forget about this record set.
//----------------------------------------------------------------------------------------------------
cCoursewareList.prototype.fForget =
function(
  vTestId
)
{
  delete this.xQtns[vTestId];
}

//----------------------------------------------------------------------------------------------------
//  create and show flash window (with test paper in it).
//----------------------------------------------------------------------------------------------------
/*
cTestList.prototype.fShowFlash =
function(
  vData
)
{
  var vQue = this.fFlashMode();
  var vFlash = cFlash.fCreate({ 'Qtns': vData, 'Mode':vQue.Mode, 'Raw': vQue.Raw, 'Target': this});

  if (vFlash)
  {
    cSys.fStartModal(this.parent.fWin(), '', vFlash);
    fPosFlashWin(vFlash);
  }
}

//----------------------------------------------------------------------------------------------------
//  determine if we should open the flash window for 'test' or 'view'.
//----------------------------------------------------------------------------------------------------
cTestList.prototype.fFlashMode =
function(
)
{
  if (this.xRedo)
  {
    this.xRedo = false;
    return {'Mode': 'TestWithResume', 'Raw': ''};
  }

  if (this.xTest.Paused == 1 || this.xTest.Correct == '')
    return {'Mode': 'TestWithResume', 'Raw': this.xTest.Raw};

  return {'Mode': 'ViewWithRetake', 'Raw': this.xTest.Raw};
}
*/
//----------------------------------------------------------------------------------------------------
//  set active test paper.
//----------------------------------------------------------------------------------------------------
cCoursewareList.prototype.fSetActive =
function(
  vTestId
)
{
  this.xTestId = vTestId;
}

//----------------------------------------------------------------------------------------------------
//  get active test paper.
//----------------------------------------------------------------------------------------------------
cCoursewareList.prototype.fGetActive =
function(
)
{
  return this.xTestId;
}

//----------------------------------------------------------------------------------------------------
//  find test based on a test-id.
//----------------------------------------------------------------------------------------------------
cCoursewareList.prototype.fFindTest =
function(
  vTests,
  vTestId
)
{
  for (var i=0; i<vTests.length; i++)
    if (vTests[i].TestId == vTestId)
      return vTests[i];
  return false;
}

/*
//----------------------------------------------------------------------------------------------------
//  compute the score of a completed test.
//----------------------------------------------------------------------------------------------------
cTestList.prototype.fCorrect =
function(
  vQtns
)
{
  var vCorrect = 0;

  for (var i=0; i<vQtns.length; i++)
    if (vQtns[i].Correct == 1)
      vCorrect++;
  return vCorrect;
}

//----------------------------------------------------------------------------------------------------
//  flash window calls.
//----------------------------------------------------------------------------------------------------
cTestList.prototype.fFlashRet =
function(
  vObj
)
{

  var vQuery = null;
  var vTest = this.xTest;

  switch (vObj.type)
  {
    case 'Submit':  
      vQuery = {
        'string': 'SetResult',
        'data': {
          'Results': vObj.data,
          'TestId': vTest.TestId,
          'Type': 'Test',
          'BookId': vTest.BookId,
          'NewAttempt': vTest.Correct ? 0 : 1,
          'Start': fMysqlTimestamp(vObj.start),
          'End': fMysqlTimestamp(vObj.end),
          'Raw': vObj.raw,
          'Correct': this.fCorrect(vObj.data),
          'Total': vObj.data.length
        }
      };
      break;

    case 'SaveToResume':
      vQuery = {
        'string': 'SaveToResume',
        'data': {
          'TestId': vTest.TestId,
          'Raw': vObj.raw
        }
      };
      break;

    case 'Redo':
      this.xRedo = true;
      this.fShowFlash(this.xQtns[this.xTestId]);
      break;

    case 'Meta':  
      vQuery = {
        'string': 'UpdateFav',
        'data': {
          'Qtns': vObj.data
        }
      };
      break;
  }

  if (vQuery)
    fCmd(vQuery);
}
*/
//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cCoursewareList.prototype.fSignal =
function(
  vSignal
)
{
  if (vSignal.target.getAttribute('to') != 'cTestList')
    return;
    
  if (vSignal.signal == 'click')
  {
  	if (cSys.gCookies['Role'] == 2)
    {
    	var vItemId = vSignal.target.getAttribute('data');
    	this.fUpdate(vItemId);
    }
    
    //this.fShowTest(vTestId);
  }
}

//----------------------------------------------------------------------------------------------------
//  update Courseware Attempt
//----------------------------------------------------------------------------------------------------

cCoursewareList.prototype.fUpdate =
function(
  vItemId
)
{
	this.xTestId = vItemId;
	var vQuery = {
   		'string': 'UpdateCoursewareAttempt', 
   		'origin': this, 
   		'data': {'ItemId': vItemId}
  	};
  	this.xQuery.testId = this.xTestId;
  	fCmd(vQuery);
}

//----------------------------------------------------------------------------------------------------
//  show test.
//----------------------------------------------------------------------------------------------------
/*
cCoursewareList.prototype.fShowTest =
function(
  vTestId
)
{
  var vRows = this.parent.fGetActiveRows();

  this.xTestId = vTestId;
  this.xTest = this.fFindTest(vRows, vTestId);

  var vData = this.xQtns[this.xTestId];
  /*
  if (vData)
  {
    this.fShowFlash(vData);
    return;
  }
  
  var vQuery = {
   'string': 'FetchTestQtns', 
   'origin': this, 
   'data': {'TestId': this.xTestId}
  };
  this.xQuery.testId = this.xTestId;
  fCmd(vQuery);
}
*/