//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cTopics()
{
  this.xQtns = null;  // list of qtns generated based on selected topics
  this.xTopics = null;
}

//----------------------------------------------------------------------------------------------------
//  redraw table.
//----------------------------------------------------------------------------------------------------
cTopics.prototype.fFormat = 
function(
  vList
)
{
  for (var i=0; i<vList.length; i++)
  {
    var vImg = (vList[i].On == 1) ? 'images/star.png' : 'images/star_gray.png';
    vList[i].Pick = '<img data=\'' + vList[i].TopicId + '\' src=\'' + vImg + '\'' + 
      'class=\'cClickable\' width=18 height=18 to=\'cTopics\'/>'; 
  }
}

//----------------------------------------------------------------------------------------------------
//  received data.
//----------------------------------------------------------------------------------------------------
cTopics.prototype.fData =
function(
  vData
)
{
  this.xQtns = vData.Qtns;
  this.xTopics = vData.Topics; 
  if (cSys.gCookies['Role'] == 1)
  {
	  var vQuery = {
	    'string': 'SetTest',
	    'data': {
	      'Qtns': vData.Qtns,
	      'SubjectId': this.parent.fController().fCurrSubj(),
	      'LevelId': this.parent.fController().fCurrLvl(),
	      'AssigneeId': this.parent.fController().fCurrAssignee(),
	      'Type': 'Topical',
	      'Topics' : vData.Topics 
	    }
	  }
	  fCmd(vQuery);
  }
  else if (cSys.gCookies['Role'] == 2)
  	this.fShowFlash(vData.Qtns);
}

//----------------------------------------------------------------------------------------------------
//  create and show flash window (with test paper in it).
//----------------------------------------------------------------------------------------------------
cTopics.prototype.fShowFlash =
function(
  vData
)
{
  var vFlash = cFlash.fCreate({ 'Qtns': vData, 'Mode':'Test', 'Raw': '', 'Target': this});
  if (vFlash)
  {
    cSys.fStartModal(this.parent.fWin(), '', vFlash);
    fPosFlashWin(vFlash);
  }
}

//----------------------------------------------------------------------------------------------------
//  flash window calls.
//----------------------------------------------------------------------------------------------------
cTopics.prototype.fFlashRet =
function(
  vObj
)
{
  if (vObj.type != 'Submit' && vObj.type != 'SaveToResume')
    return;

  var vQuery = {
    'string': 'SetResult',
    'data': {
      'Qtns': vObj.data,
      'SubjectId': this.parent.fController().fCurrSubj(),
      'LevelId': this.parent.fController().fCurrLvl(),
      'AssigneeId': this.parent.fController().fCurrAssignee(),
      'Type': 'Topical',
      'Start': fMysqlTimestamp(vObj.start),
      'End': fMysqlTimestamp(vObj.end),
      'Raw': vObj.raw,
      'Topics' : this.xTopics 
    }
  }
  vQuery.data.Paused = (vObj.type == 'SaveToResume') ? 1 : 0;
  fCmd(vQuery);
}

//----------------------------------------------------------------------------------------------------
//  find topic.
//----------------------------------------------------------------------------------------------------
cTopics.prototype.fFindTopic = 
function(
  vId,
  vList
)
{
  for (var i=0; i<vList.length; i++)
    if (vList[i].TopicId == vId)
      return vList[i];
  return null;
}

//----------------------------------------------------------------------------------------------------
//  get selected topics.
//----------------------------------------------------------------------------------------------------
cTopics.prototype.fSelected =
function()
{
  var vSel = [];
  var vList = this.parent.fGetActiveRows();

  for (var i=0; i<vList.length; i++)
    if (vList[i].On == 1)
      vSel.push(vList[i]);
  return vSel;
}

//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cTopics.prototype.fSignal = function(
  vSignal
)
{
  if (vSignal.target.getAttribute('to') != 'cTopics')
    return;

  if (vSignal.signal == 'click')
  {
    var vTopicId = vSignal.target.getAttribute('data');    
    var vList = this.parent.fGetActiveRows();
    var vItem = this.fFindTopic(vTopicId, vList);

    if (vItem)
    {
      vItem.On = (vItem.On == 1) ? 0 : 1;
      this.parent.fRefresh();
      var vQuery = {
        'string': vItem.On ? 'AddFocus' : 'RemoveFocus',
        'data' : {
          'TopicId': vTopicId,
          'SubjectId': vItem.SubjectId
        }
      }; 
      fCmd(vQuery);
    }
  }
}








