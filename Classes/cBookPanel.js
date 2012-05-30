//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cBookPanel()
{
  this.xActive = null;
  this.xRecs = {};
}

//----------------------------------------------------------------------------------------------------
//  init.
//----------------------------------------------------------------------------------------------------
cBookPanel.prototype.fInit =
function(
  vRefs
)
{
  this.refs = vRefs;
}

//----------------------------------------------------------------------------------------------------
//  add book.
//----------------------------------------------------------------------------------------------------
cBookPanel.prototype.fAdd =
function(
  vRec
)
{
  if (! this.xActive)
    return;

  if (! this.xRecs[this.xActive])
    this.xRecs[this.xActive] = {'cursor': 0, 'books': []};
  this.xRecs[this.xActive].books.push(vRec);
}

//----------------------------------------------------------------------------------------------------
//  next book.  if at the end, disable 'next' button.
//----------------------------------------------------------------------------------------------------
cBookPanel.prototype.fNext =
function()
{
  var vCursor = this.xRecs[this.xActive].cursor;
  if (vCursor + 1 >= this.xRecs[this.xActive].books.length)
    return;
  this.xRecs[this.xActive].cursor++;

  this.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  prev book.  if at the beginning, disable 'prev' button.
//----------------------------------------------------------------------------------------------------
cBookPanel.prototype.fPrev =
function()
{
  var vCursor = this.xRecs[this.xActive].cursor;
  if (vCursor - 1 < 0)
    return;
  this.xRecs[this.xActive].cursor--;
  
  this.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  prev book.
//----------------------------------------------------------------------------------------------------
cBookPanel.prototype.fRefresh =
function()
{ 
  var vBook = this.fGetCurr();
  var vFields = this.refs.fields;
  var vCtrls = this.refs.ctrls;
  
  // fill up assessment book fields
  if (vFields.Cover)
    fGet('#' + vFields.Cover).setAttribute('src', vBook.Cover);
  if (vFields.Title)
    fGet('#' + vFields.Title).innerHTML = vBook.Title;
  if (vFields.Publisher)
    fGet('#' + vFields.Publisher).innerHTML = vBook.Publisher;
  if (vFields.LevelId)
    fGet('#' + vFields.LevelId).innerHTML = vBook.Level;
  if (vFields.Author && vBook.Author != "")
    fGet('#' + vFields.Author).innerHTML = vBook.Author;
  else
  	fShow2(vFields.AuthorLi,false);
  if (vFields.Synopsis)
    fGet('#' + vFields.Synopsis).innerHTML = vBook.Synopsis;	

  if (vBook.Id>100 && vBook.Id<=9000){
      fShow1(vCtrls.sampleIt.id,false);
      fShow1(vCtrls.previewCW.id,true);
      elm = fGet("#"+vCtrls.previewCW.id);
      elm.setAttribute("href", vBook.Preview);
  }
  else{
      fShow1(vCtrls.sampleIt.id,true);
      fShow1(vCtrls.previewCW.id,false);
  }

  $("#"+vCtrls.previewCW.id).fancybox({
				'width'				: 800,
				'height'			: 600,
				'autoScale'			: false,
				'transitionIn'		: 'elastic',
				'transitionOut'		: 'elastic',
				'easingIn'      	: 'easeOutBack',
				'easingOut'     	: 'easeInBack'
 });
  
	
  // navigation info (i.e. 2/3)
  var vCursor = this.xRecs[this.xActive].cursor;
  if (vFields.Cursor)
  {
    fGet('#' + vFields.Cursor).innerHTML =
      (+vCursor + 1) + '/' + this.xRecs[this.xActive].books.length;
  }

  // navigation buttons
  
  if (vCtrls.next && vCtrls.prev)
  {
    var vNext = fGet('#' + vCtrls.next.id);
    var vPrev = fGet('#' + vCtrls.prev.id)
    // if (vClass.cursor + 1 == vClass.books.length)
    if (vCursor + 1 == this.xRecs[this.xActive].books.length)
      vNext.setAttribute('src', vCtrls.next.off);
    else
      vNext.setAttribute('src', vCtrls.next.on)
    // if (vClass.cursor == 0)
    if (vCursor == 0)
      vPrev.setAttribute('src', vCtrls.prev.off);
    else
      vPrev.setAttribute('src', vCtrls.prev.on);
  }

  // percentage info
  if (vCtrls.percentBar)
  {
    var vPercent = ((vBook.Done * 100) / vBook.Total).toFixed(0);
    fGet('#' + vCtrls.percentBar.id).setAttribute('width',  vPercent + '%');    
  }
}

//----------------------------------------------------------------------------------------------------
cBookPanel.prototype.fSetActive =
function(
  vTag
)
{
  if (! this.xRecs[vTag])
    this.xRecs[vTag] = {'cursor': 0, 'books': []};
  this.xActive = vTag;
}

//----------------------------------------------------------------------------------------------------
cBookPanel.prototype.fGetCurr =
function(
)
{
  if (! this.xActive)
    return null;

  var vRecs = this.xRecs[this.xActive];
  return vRecs.books[vRecs.cursor];
}

//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cBookPanel.prototype.fSignal =
function(
  vSignal
)
{
  if (vSignal.target.getAttribute('obj') != 'cBookPanel')
    return;

  switch (vSignal.signal) 
  {
    case 'click':
      var vCtrls = this.refs.ctrls;
      if (vSignal.target.id == vCtrls.prev.id)
      {
        this.fPrev();
        this.refs.notify(vSignal.target);
      }
      else if (vSignal.target.id == vCtrls.next.id)
      {
        this.fNext();
        this.refs.notify(vSignal.target);
      }
      break;

    case 'mouseover':
      break;

    case 'mouseout':
      break;
  }      
}






































