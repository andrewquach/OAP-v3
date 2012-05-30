//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cBookSlider()
{
  this.xBooks = {};
  this.xSubject = null;
  this.xLevel = null;
  this.xActive = null;
}

//----------------------------------------------------------------------------------------------------
//  refresh slider.
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fDisplayAll =
function(
vId
)
{
  //var str = '<ul id="mycarousel" class="jcarousel-skin-tango">';
  var str = '';
  for (xActive in this.xBooks)
  {
     var vList = this.xBooks[xActive];
     
     for (i in vList)
     {
     	str += '<li><a to="cBookSlider" data="'+ vList[i].Id +'"><img src="res/'+ vList[i].Cover +'"/><br>'+ vList[i].Title +'<br><span>'+ vList[i].Level +'</span></a></li>'
     }
  }
  
  //str += "</ul>"
  
  var elm = fGet(vId);
  elm.innerHTML = str;
  /*
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
          elm.setAttribute('src', item[key]);
        else
          elm.innerHTML = (key == 'Price') ? 'SGD$ ' + parseFloat(item[key]).toFixed(2) : item[key];
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
  */
}


//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fSignal =
function(
  vSignal
)
{
  if (vSignal.target.getAttribute('to') != 'cBookSlider')
    return;
    
  if (vSignal.signal == 'click')
  {
    var vBookId = vSignal.target.getAttribute('data');
    this.fShowBook(vBookId);
  }
}

//----------------------------------------------------------------------------------------------------
//  show Book.
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fShowBook =
function(
  vBookId
)
{
  cSys.gAppVars['product-id'] = vBookId;
  if (vBookId < 100001)
  	cSys.fGoto('store-product-detail.html');
  else
  	cSys.fGoto('store-bundle-detail.html');
}


//----------------------------------------------------------------------------------------------------
//  add a book to slider
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fAdd =
function(
  vRec
)
{
  if (! this.xActive)
    return;
    
  if (! this.xBooks[this.xActive])
    this.xBooks[this.xActive] = [];
  this.xBooks[this.xActive].push(vRec);
}


//----------------------------------------------------------------------------------------------------
//  change the Level Filter
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fSetLevel =
function(
  vLevel
)
{
  this.xLevel = vLevel;
}

//----------------------------------------------------------------------------------------------------
//  get the Level Filter
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fGetLevel =
function()
{
  return this.xLevel;
}

//----------------------------------------------------------------------------------------------------
//  change the Subject Filter
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fSetSubject =
function(
  vSubject
)
{
  this.xSubject = vSubject;
}

//----------------------------------------------------------------------------------------------------
//  get the Subject Filter
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fGetSubject =
function()
{
  return this.xSubject;
}

//----------------------------------------------------------------------------------------------------
//  switch to a different record set.
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fSetActive =
function(
  vTag
)
{
  if (! this.xBooks[vTag])
    this.xBooks[vTag] = [];
  this.xActive = vTag;
}

//----------------------------------------------------------------------------------------------------
//  get active tag (key to a certain set of records).
//----------------------------------------------------------------------------------------------------
cBookSlider.prototype.fGetActive =
function()
{
  return this.xActive;
}