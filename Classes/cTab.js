//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cTab()
{
  this.xRefs = null;
  this.xActive = null;
}

//----------------------------------------------------------------------------------------------------
//  bind html elements into a group.
//----------------------------------------------------------------------------------------------------
cTab.prototype.fInit =
function(
  vRefs
)
{
  this.xRefs = vRefs;
  this.xActive = this.xRefs.items[0];
}

//----------------------------------------------------------------------------------------------------
//  set one as act`ve.  deactive the rest.  use element id.
//----------------------------------------------------------------------------------------------------
cTab.prototype.fSetActiveById =
function(
  vId
)
{
  var vItem = this.fFindById(vId);
  if (! vItem)
    return;
  
  this.xActive = vItem;
  this.fRefresh()
}

//----------------------------------------------------------------------------------------------------
//  set one as active.  deactive the rest.  uses tag.
//----------------------------------------------------------------------------------------------------
cTab.prototype.fSetActiveByTag =
function(
  vTag
)
{
  var vItem = this.fFindByTag(vTag)
  if (! vItem)
    return;
  
  this.xActive = vItem;
  this.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  refresh buttons.
//----------------------------------------------------------------------------------------------------
cTab.prototype.fRefresh =
function()
{
  var vList = this.xRefs.items;
  for (var i=0; i<vList.length; i++)
  {
    var vTab = fGet('#' + vList[i].id);
    var vWin = (vList[i].win) ? fGet('#' + vList[i].win) : null;
    if (vList[i].id == this.xActive.id)
    {
      vTab.setAttribute('class', this.xRefs.activeCSS); // for the rest
      vTab.setAttribute('className', this.xRefs.activeCSS); // for IE
      if (vWin)
        vWin.style.display = 'block';
    }
    else
    {
      vTab.setAttribute('class', this.xRefs.inactiveCSS); // for the rest
      vTab.setAttribute('className', this.xRefs.inactiveCSS); // for IE
      if (vWin)
        vWin.style.display = 'none';
    }
  }
}

//----------------------------------------------------------------------------------------------------
//  get info on the active button.
//----------------------------------------------------------------------------------------------------
cTab.prototype.fGetActive =
function(
)
{
  return this.xActive;
}

//----------------------------------------------------------------------------------------------------
//  show
//----------------------------------------------------------------------------------------------------
cTab.prototype.fShow =
function(
  vTag
)
{
  var vItem = this.fFindByTag(vTag);
  if (vItem)
  {
    fGet('#' + vItem.id).style.display = 'block';
    if (vItem.win)
      fGet('#' + vItem.win).style.display = 'block';
  }
}

//----------------------------------------------------------------------------------------------------
//  hide
//----------------------------------------------------------------------------------------------------
cTab.prototype.fHide =
function(
  vTag
)
{
  var vItem = this.fFindByTag(vTag);
  if (vItem)
  {
    fGet('#' + vItem.id).style.display = 'none';
    if (vItem.win)
      fGet('#' + vItem.win).style.display = 'none';
  }  
}

//----------------------------------------------------------------------------------------------------
//  find entry by 'id'
//----------------------------------------------------------------------------------------------------
cTab.prototype.fFindById =
function(
  vId
)
{
  var vList = this.xRefs.items;
  for (var i=0; i<vList.length; i++)
    if (vList[i].id == vId)
      return vList[i];
  return null;
}

//----------------------------------------------------------------------------------------------------
//  find entry by 'tag'
//----------------------------------------------------------------------------------------------------
cTab.prototype.fFindByTag =
function(
  vTag
)
{
  var vList = this.xRefs.items;
  for (var i=0; i<vList.length; i++)
    if (vList[i].tag == vTag)
      return vList[i];
  return null;
}


//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cTab.prototype.fSignal =
function(
  vSignal
)
{
  if (vSignal.target.getAttribute('to') != 'cTab')
    return;

  switch (vSignal.signal) 
  {
    case 'click':
      var vList = this.xRefs.items;
      for (var i=0; i<vList.length; i++)
        if (vSignal.target.id == vList[i].id)
        {
          this.fSetActiveById(vSignal.target.id);
          if (this.xRefs.notify)
            this.xRefs.notify(vSignal.target);
          return;
        }
      break;
  }
}







