//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cCartFinal()
{
  this.xRefs = [];
  this.xList = [];  // stores items in the cart
  this.xIdList = []; // stores item id  in the cart
  this.xTotal = 0;    // total amt
}

//----------------------------------------------------------------------------------------------------
//  init.
//----------------------------------------------------------------------------------------------------
cCartFinal.prototype.fInit =
function(
  vRefs
)
{
  this.xRefs = vRefs;
}

//----------------------------------------------------------------------------------------------------
//  add an item to the cart.
//----------------------------------------------------------------------------------------------------
cCartFinal.prototype.fAdd =
function(
  vItem
)
{
  // add to modal
  this.xList.push(vItem);
  this.xTotal += vItem.amt;
  this.xIdList.push(vItem.id);
  
  // add to view
  this.fRefresh();
}

//----------------------------------------------------------------------------------------------------
//  remove an item from the cart.
//----------------------------------------------------------------------------------------------------
cCartFinal.prototype.fRemove =
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
cCartFinal.prototype.fRefresh =
function(
)
{

  vHtml = '';
  
  for (var i=0; i<this.xList.length; i++)
  {
  	vHtml += '<div class="bookDetails">';
	vHtml += '<div class="col_1_12 col">';
	vHtml += '<div class="inner"><img id="eThumb0" src="'+ this.xList[i].cover +'" class="image_frame border"></div></div>';
	vHtml += '<a><div class="bookTitle"><div>'+this.xList[i].name+'</div><span><div>'+this.xList[i].Level+'</div></span></div>';
	vHtml += '<div class="col_1_5 col"><div class="inner"><ul class="bookInfo1">';
	vHtml += '<li><span>Publisher:</span><div>'+this.xList[i].Publisher+'</li>';
	if ((this.xList[i].Author) && (this.xList[i].Author != ""))
		vHtml += '<li><span>Author:</span><div>'+this.xList[i].Author+'</li>';
	vHtml += '</ul></div></div>';
	vHtml += '<div class="col_1_6 col"><div class="inner"><ul class="bookInfo1"><li><span>Price:</span>';
	
	if ((!this.xList[i].Promotion) || (this.xList[i].Promotion == ''))
		vSubscription = this.xList[i].Subscription + ' months';
	else
		vSubscription = '(' + this.xList[i].Subscription + ' + ' + this.xList[i].Promotion + ') months';
	vHtml += 'SGD' + this.xList[i].amt + '</li><li><span>Subscription:</span><div>'+vSubscription+'</div></li></ul></div></div></a>';
	vHtml += '<div class="col_1_7 col"><div class="inner"><a id=\'' + this.xList[i].id + '\' class="button_link juicy_orange" obj=\'cCartFinal\' cmd=\'del\' ><span>Remove</span></a></div></div>';
	vHtml+= '<div class="clear"></div></div><hr class="divider2"></hr>';

  }
  
  fGet('#' + this.xRefs.tbl).innerHTML = vHtml;
  fGet('#' + this.xRefs.total).innerHTML = 'SGD'+this.xTotal.toFixed(2);
}

//----------------------------------------------------------------------------------------------------
//  get all items in the cart.
//----------------------------------------------------------------------------------------------------
cCartFinal.prototype.fCartItems =
function(
)
{
  return this.xList;
}


cCartFinal.prototype.fClear =
function(
)
{
  this.xList = [];
  this.xIdList = [];
}


//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cCartFinal.prototype.fSignal =
function(
  vSignal
)
{
  var vElm = vSignal.target;
  var vCmd = vElm.getAttribute('cmd');

  if (vElm.getAttribute('obj') != 'cCartFinal')
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
  }
}



