//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cCart()
{
  this.xRefs = [];
  this.xList = [];  // stores items in the cart
  this.xIdList = []; // stores item id  in the cart
  this.xTotal = 0;    // total amt
}

//----------------------------------------------------------------------------------------------------
//  init.
//----------------------------------------------------------------------------------------------------
cCart.prototype.fInit =
function(
  vRefs
)
{
  this.xRefs = vRefs;
}

//----------------------------------------------------------------------------------------------------
//  add an item to the cart.
//----------------------------------------------------------------------------------------------------
cCart.prototype.fAdd =
function(
  vItem
)
{
  // add to modal
  this.xList.push(vItem);
  this.xIdList.push(vItem.id);
  this.xTotal += vItem.amt;
  
  // add to view
  this.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  remove an item from the cart.
//----------------------------------------------------------------------------------------------------
cCart.prototype.fRemove =
function(
  vId
)
{
  // remove from modal
  for (var i=0; i<this.xList.length; i++){
    if (this.xList[i].id == vId)
    {
      this.xTotal -= this.xList[i].amt;
      this.xList.splice(i, 1);
    }
    if (this.xIdList[i] == vId)
    {
      this.xIdList.splice(i, 1);
    }
   }
  // remove from view
  this.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  refresh table.
//----------------------------------------------------------------------------------------------------
cCart.prototype.fRefresh =
function(
)
{
  cTableCart.fDeleteAll('#' + this.xRefs.tbl);
  for (var i=0; i<this.xList.length; i++)
  {
    this.xList[i].run = (+i + 1) + '.';
    this.xList[i].price = this.xList[i].amt.toFixed(2);
    this.xList[i].img = '<img id=\'' + this.xList[i].id + '\' src=\'images/cross_grey_dim.png\' width=20 height=20 class=\'cClickable\' obj=\'cCart\' cmd=\'del\'/>';
    cTableCart.fAdd('#' + this.xRefs.tbl, (i % 2 == 0) ? 'cEven' : 'cOdd', -1, this.xList[i]);
  }
  fGet('#' + this.xRefs.total).innerHTML = 'SGD'+this.xTotal.toFixed(2);
}

//----------------------------------------------------------------------------------------------------
//  get all items in the cart.
//----------------------------------------------------------------------------------------------------
cCart.prototype.fCartItems =
function(
)
{
  return this.xList;
}

//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cCart.prototype.fSignal =
function(
  vSignal
)
{
  var vElm = vSignal.target;
  var vCmd = vElm.getAttribute('cmd');

  if (vElm.getAttribute('obj') != 'cCart')
    return;

  switch (vSignal.signal) 
  {
    case 'click':
      if (vCmd == 'del')
        this.xRefs[vCmd](vElm.id); 
        
       /*   
      else if (vCmd == 'invoke')
      	if (this.xTotal > 0)
      	{
        	this.xRefs[vElm.getAttribute('fn')]();
        }
        else
        {
        	cSys.fStartModal(cPage.mThis, 'Cancel', cMsgBox.fCreate('The cart is empty', ['Ok']));
        }
        */
      break;
      
    case 'mouseover':
      if (vCmd == 'del')
        vElm.setAttribute('src', 'images/cross_grey.png');
      break;
      
    case 'mouseout':
      if (vCmd == 'del')
        vElm.setAttribute('src', 'images/cross_grey_dim.png');
      break;
  }
}



