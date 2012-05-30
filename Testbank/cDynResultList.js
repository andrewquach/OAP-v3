//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cDynResultList()
{
  this.xQtns = {};  // 'test-id' => 'qtns'
  this.xQuery = {};   // query context
  this.xTestId = null;
  this.xTest = null;
  this.xRedo = false;
}

//----------------------------------------------------------------------------------------------------
//  format a row.
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fFormat =
function(
  vList
)
{
  for (var i=0; i<vList.length; i++)
  {
    // don't display score; test is in 'pause' mode
    if (vList[i].Paused == 1) 
    {
      vList[i].PauseImg = '<img src=\'images/pause.png\'/>';
      vList[i].Correct = vList[i].Total = vList[i].Percent = vList[i].Past = vList[i].Last = vList[i].First = vList[i].Attempt = vList[i].High = '';
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
    else {
      vList[i].Past = '';
      vList[i].Last = ''
    }
  }
}

//----------------------------------------------------------------------------------------------------
//  received data.
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fData =
function(
  vData
)
{
  this.xQtns[this.xQuery.testId] = vData; 
  this.fShowFlash(vData);
}

//----------------------------------------------------------------------------------------------------
//  forget about this record set.
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fForget =
function(
  vTestId
)
{
  delete this.xQtns[vTestId];
}

//----------------------------------------------------------------------------------------------------
//  determine if we should open the flash window for 'test' or 'view'.
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fFlashMode =
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
  
  if (cSys.gCookies["Role"] == 1)
  	return {'Mode': 'View', 'Raw': this.xTest.Raw};
  
  return {'Mode': 'ViewWithRetake', 'Raw': this.xTest.Raw};
}

//----------------------------------------------------------------------------------------------------
//  create and show flash window (with test paper in it).
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fShowFlash =
function(
  vData
)
{
  var vQue = this.fFlashMode();

  //console.log(vData);
  var vFlash = cFlash.fCreate({ 'Qtns': vData, 'Mode':vQue.Mode, 'Raw': vQue.Raw, 'Target': this});

  if (vFlash)
  {
    cSys.fStartModal(this.parent.fWin(), '', vFlash);
    fPosFlashWin(vFlash);
  }
}

//----------------------------------------------------------------------------------------------------
//  set active test paper.
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fSetActive =
function(
  vTestId
)
{
  this.xTestId = vTestId;
}

//----------------------------------------------------------------------------------------------------
//  get active test paper.
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fGetActive =
function(
)
{
  return this.xTestId;
}

//----------------------------------------------------------------------------------------------------
//  find test based on a test-id.
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fFindTest =
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

//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fFlashRet =
function(
  vObj
)
{
  var vQuery = null;
  var vTest = this.xTest;

  switch (vObj.type)
  {
    case 'Submit':

    case 'SaveToResume':
      vQuery = {
        'string': 'SetResult',
        'data': {
          'Qtns' : vObj.data,
          'Type': this.xTest.Type,
          'Start': fMysqlTimestamp(vObj.start),
          'End': fMysqlTimestamp(vObj.end),
          'Raw': vObj.raw
        }
      };

      if (this.xTest.TestId){
        vQuery.data.TestId = this.xTest.TestId;
        vQuery.data.LevelId = this.xTest.LevelId;
        vQuery.data.SubjectId = this.xTest.SubjectId;
      }
      vQuery.data.Paused = (vObj.type == 'SaveToResume') ? 1 : 0;
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

//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cDynResultList.prototype.fSignal =
function(
  vSignal
)
{
  if (vSignal.target.getAttribute('to') != 'cDynResultList')
    return;
    
  if (vSignal.signal == 'click')
  {
    this.xTestId = vSignal.target.getAttribute('data');
    var vRows = this.parent.fGetActiveRows();
    this.xTest = this.fFindTest(vRows, this.xTestId);

    var vData = this.xQtns[this.xTestId];
    /*
    if (vData)
    {
      this.fShowFlash(vData);
      return;
    }
    */

    var vQuery = {
     'string': 'FetchTestQtns', 
     'origin': this, 
     'data': {'TestId': this.xTestId}
    };
    this.xQuery.testId = this.xTestId;
    fCmd(vQuery);
  }
}





























