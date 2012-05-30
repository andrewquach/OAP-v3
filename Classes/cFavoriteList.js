//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cFavoriteList()
{
  this.xQtns = {};  // 'qtn-id' => ''qtn'
  this.xQuery = {}; // query context
}

//----------------------------------------------------------------------------------------------------
//  format a row.
//----------------------------------------------------------------------------------------------------
cFavoriteList.prototype.fFormat =
function(
    vList
)
{
  for (var i=0; i<vList.length; i++)
  {
    vList[i].Tag =vList[i].Order;
    vList[i].LastAttempt = (vList[i].Correct == 0) ?
      '<img src=\'images/cross.png\' width=18 height=18/>' :
      '<img src=\'images/tick.png\' width=18 height=18/>';

    var vImg = (vList[i].Favorite == 1) ? 'images/like.png' : 'images/like_gray.png';

    vList[i].Star = '<img src=\'' + vImg + '\' data=\'' + vList[i].QtnId + '\' to=\'cFavoriteList\' \
      type=\'fav\' class=\'cClickable\'/>';

    vList[i].Category = vList[i].Type;
  }
}

//----------------------------------------------------------------------------------------------------
//  receive data.
//----------------------------------------------------------------------------------------------------
cFavoriteList.prototype.fData =
function(
  vData
)
{
  this.xQtns[this.xQuery.qtnId] = vData;
  this.fShowFlash(vData);
}

//----------------------------------------------------------------------------------------------------
//  create and show flash window (with test paper in it).
//----------------------------------------------------------------------------------------------------
cFavoriteList.prototype.fFindQtn =
function(
  vQtnId,
  vList
)
{
  for (var i=0; vList.length; i++)
    if (vList[i].QtnId == vQtnId)
      return vList[i];
  return null;
}

//----------------------------------------------------------------------------------------------------
//  create and show flash window (with test paper in it).
//----------------------------------------------------------------------------------------------------
cFavoriteList.prototype.fShowFlash =
function(
  vData
)
{
  //console.log(vData);
  var vFlash = cFlash.fCreate({ 'Qtns': vData, 'Mode':'View', 'Raw': vData[0].Raw, 'Target': this});
  if (vFlash)
  {
    cSys.fStartModal(this.parent.fWin(), 'ViewTestRet', vFlash);
    fPosFlashWin(vFlash);
  }
}

//----------------------------------------------------------------------------------------------------
//  flash window calls.
//----------------------------------------------------------------------------------------------------
cFavoriteList.prototype.fFlashRet =
function(
  vObj
)
{
  switch (vObj.type)
  {
    case 'Meta':
      var vQuery = {
        'string': 'UpdateFav',
        'data': { 'Qtns': vObj.data }
      };
      fCmd(vQuery);
      break;
  }  
}

//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cFavoriteList.prototype.fSignal =
function(
  vSignal
)
{
  if (vSignal.target.getAttribute('to') != 'cFavoriteList')
    return;

  if (vSignal.signal == 'click')
  {
    // favorite/unfavorite a qtn
    if (vSignal.target.getAttribute('type') == 'fav')
    {
      var vQtnId = vSignal.target.getAttribute('data');
      var vList = this.parent.fGetActiveRows();
      var vQtn = this.fFindQtn(vQtnId, vList);
      vQtn.Favorite = (vQtn.Favorite == 1) ? 0: 1;
      this.parent.fRefresh();
      var vQtns = [{'QtnId': vQtnId, 'Favorite': vQtn.Favorite}];
      var vQuery = {
        'string': 'UpdateFav',
        'data': {
          'Qtns': vQtns
        }
      };
      fCmd(vQuery);
      return;
    }

    // view a favorited qtn
    if (vSignal.target.getAttribute('type') == 'favQtn')
    {
      var vQtnId = vSignal.target.getAttribute('data');    
      if (this.xQtns[vQtnId])
      {
        // we have that qtn in memory, show it
        this.fShowFlash(this.xQtns[vQtnId]);
        return;
      }
      // qtn not in memory; fetch from database
      var vQuery = {
       'string': 'FetchFavQtn',   
       'origin': this, 
       'data': {'QtnId': vQtnId}
      };
      this.xQuery.qtnId = vQtnId;
      fCmd(vQuery);
    }
  }
}


