//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cPaypal()
{
  this.xRefs = null;
  this.xList = [];
}

//----------------------------------------------------------------------------------------------------
//  init.
//----------------------------------------------------------------------------------------------------
cPaypal.prototype.fInit =
function(
  vRefs
)
{
  this.xRefs = vRefs;
}

//----------------------------------------------------------------------------------------------------
//  add item to cart.
//----------------------------------------------------------------------------------------------------
cPaypal.prototype.fAdd =
function(
  vItem
)
{
  for (var i=0; i<this.xList.length; i++)
    if (this.xList[i].id == vItem.id)
      return false;
      
  this.xList.push(vItem);
  return true;
}

//----------------------------------------------------------------------------------------------------
//  remove item from cart.
//----------------------------------------------------------------------------------------------------
cPaypal.prototype.fRemove =
function(
  vItem
)
{
  for (var i=0; i<this.xList.length; i++)
    if (this.xList[i].id == vItem.id)
      this.xList.splice(i, 1);
}

//----------------------------------------------------------------------------------------------------
//  submit a virtual form.
//----------------------------------------------------------------------------------------------------
cPaypal.prototype.fSubmit =
function(
)
{
  var vForm = document.createElement('form');
  vForm.setAttribute('method', 'post');
  vForm.setAttribute('action', this.xRefs.url);
  
  var vHash = this.xfMkHash();
  for (var vKey in vHash)
  {
    var field = document.createElement('input');
    field.setAttribute('name', vKey);
    field.setAttribute('value', vHash[vKey]);
    field.setAttribute('type', 'hidden');
    vForm.appendChild(field);
  }
  // adding to document body is required for Firefox and IE.
  document.body.appendChild(vForm);
  vForm.submit();
}

//----------------------------------------------------------------------------------------------------
//  construct virtual form.
//----------------------------------------------------------------------------------------------------
cPaypal.prototype.xfMkHash =
function(
)
{
  var vHash = {
    'cmd': '_cart',
    'upload': 1,
    'business': this.xRefs.email,
    'currency_code': 'SGD',
    'return': this.xRefs.successRet,
    'cancel_return': this.xRefs.cancelRet,
    'custom': this.xRefs.custom,
    'notify_url': this.xRefs.notifyUrl
  };
  
  for (var i=0; i<this.xList.length; i++)
  {
    vHash['item_number_' + (i+1)] = this.xList[i].id;
    vHash['item_name_' + (i+1)] = this.xList[i].name;
    vHash['amount_' + (i+1)] = this.xList[i].amt;
  }
  
  return vHash;
}

