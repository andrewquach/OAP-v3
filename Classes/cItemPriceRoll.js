//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cItemPriceRoll()
{
  this.xRefs = null;
  // this.xList = [];
  this.xRecs = {};
  this.xCursor = 0;     // zero-based index of image currently shown left-most 
}

//----------------------------------------------------------------------------------------------------
//  bind elements to this object.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fInit =
function(
  vRefs
)
{
  this.xRefs = vRefs;
}

//----------------------------------------------------------------------------------------------------
//  add an item for sale.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fAdd =
function(
  vRec
)
{
  if (! this.xActive)
    return;
    
  if (! this.xRecs[this.xActive])
    this.xRecs[this.xActive] = [];
  this.xRecs[this.xActive].push(vRec);
}

//----------------------------------------------------------------------------------------------------
//  delete all items.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fDeleteAll =
function(
)
{
  // this.xList.splice(0, this.xList.length);
}

//----------------------------------------------------------------------------------------------------
//  display prev set of items.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fPrev =
function(
)
{
  if (this.xCursor - this.xRefs.rows < 0)
    return;
  this.xCursor -= this.xRefs.rows;
  this.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  display next set of items.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fNext =
function(
)
{
  var vList = this.xRecs[this.xActive];

  if (this.xCursor + this.xRefs.rows >= vList.length)
    return;
  this.xCursor += this.xRefs.rows;
  this.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  refresh roll.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fRefresh =
function(
)
{
  var fields = this.xRefs.fields;
  var ctrls = this.xRefs.ctrls;
  
  // fill up each placeholder
  var i = 0;
  var vList = this.xRecs[this.xActive];

  for (; i<this.xRefs.rows && this.xCursor + i < vList.length; i++)
  {
    var item = vList[this.xCursor + i];
    for (var key in item)
      if (fields[key])
      {
        var elm = fGet('#' + fields[key] + i);
        if (elm.tagName.toLowerCase() == 'img')
          elm.setAttribute('src', "res/"+item[key]);
        else if (key == 'Author'){
        	if ((item[key] == undefined) || (item[key] == ""))
      			fShow2("liAuthor"+i,false);
      		else{
      			fShow2("liAuthor"+i,true);
      			elm.innerHTML = item[key];
      		}
      	}
               
        else
          elm.innerHTML = (key == 'Price') ? 'SGD' + parseFloat(item[key]).toFixed(2) : item[key];
      }
    // fShow(fGet('#' + ctrls['line'] + i), true);
    fShow(fGet('#' + ctrls['row'] + i), true);
  }  

  // hide unused placeholders
  for (; i < this.xRefs.rows; i++)
  {
    // fShow(fGet('#' + ctrls['line'] + i), false);
    fShow(fGet('#' + ctrls['row'] + i), false);
  }

  // next/prev links
  this.fUpdateNavigationCSS(vList);
}

//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fUpdateNavigationCSS =
function(
  vList
)
{
  //fGet('#ePrev').setAttribute('class', (this.xCursor == 0) ? '' : 'cLink cCickable');
  //fGet('#ePrev').setAttribute('className', (this.xCursor == 0) ? '' : 'cLink cCickable');
  //fGet('#eNext').setAttribute('class', (this.xCursor == 0) ? '' : 'cLink cCickable');
  //fGet('#eNext').setAttribute('className', (this.xCursor == vList.length - 1) ? '' : 'cLink cCickable');
}

//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fSignal =
function(
  vSignal
)
{
  var ctrls = this.xRefs.ctrls;
  
  if (vSignal.target.getAttribute('obj') != ctrls['obj'])
    return;

  switch (vSignal.signal) 
  {
    case 'click':
      var ctrls = this.xRefs.ctrls;
      var cmd = vSignal.target.getAttribute('cmd');
      var Id = vSignal.target.id;
      if ((cmd == 'prev' || cmd == 'next') && (Id == ctrls['prev'] || Id == ctrls['next']))
        this.xfNavigation(vSignal.target);
      else if (cmd == 'toggle')
        this.xfToggle(vSignal.target);
      else if (cmd == 'invoke')
        this.xfCallable(vSignal.target);
      
      return false;
  }
}

//----------------------------------------------------------------------------------------------------
//  navigation to different window-view of items.  
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.xfNavigation =
function(
  vElm
)
{
  var ctrls = this.xRefs.ctrls;

  if (vElm.getAttribute('cmd') == "prev")
    this.fPrev();
  else if (vElm.getAttribute('cmd') == "next")
    this.fNext();
}

//----------------------------------------------------------------------------------------------------
//  toggle visibility.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.xfToggle =
function(
  vElm
)
{
  var vTargets = vElm.getAttribute('targets');
  var vArr = vTargets.split(';');
  
  // note: this way looks cumbersome, but is a x-browser solution.
  for (var i=0; i<vArr.length; i++)
  {
    var vTarget = fGet('#' + vArr[i]);
    if (vTarget.style.display == 'block')
    {
      vTarget.style.display = 'none';
      vElm.innerHTML = 'More...';
    }
    else
    {
      vTarget.style.display = 'block';
      vElm.innerHTML = 'Less...';
    }
  }
}

//----------------------------------------------------------------------------------------------------
//  switch to a different record set.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fSetActive =
function(
  vTag
)
{
  if (! this.xRecs[vTag])
    this.xRecs[vTag] = [];
  this.xActive = vTag;  
  this.xCursor = 0;
}

//----------------------------------------------------------------------------------------------------
//  get active tag (key to a certain set of records).
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.fGetActive =
function()
{
  return this.xActive;
}

//----------------------------------------------------------------------------------------------------
//  invoke callbacks.
//----------------------------------------------------------------------------------------------------
cItemPriceRoll.prototype.xfCallable =
function(
  vElm
)
{
  var row = vElm.getAttribute('row');
  var vList = this.xRecs[this.xActive];

  var item = vList[this.xCursor + +row];
  var fn = vElm.getAttribute('fn');
  
  for (var i=0; i<vList.length; i++)
    if (vList[i].Id == item.Id)
    {
      this.xRefs.fns[fn](vList[i]);
      return;
    }
  return null;
}















