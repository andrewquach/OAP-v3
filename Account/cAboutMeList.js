//----------------------------------------------------------------------------------------------------
//  oo object.
//----------------------------------------------------------------------------------------------------
function cAboutMeList()
{
  this.xActive = null;
}

//----------------------------------------------------------------------------------------------------
//  redraw table.
//----------------------------------------------------------------------------------------------------
cAboutMeList.prototype.fFormat = 
function(
  vList   // array
)
{
  if (vList.length == 0)
    return;
  
  for (var i=0; i<vList.length; i++)
  {
    vList[i].Edit = '<a class=\'cLink cClickable\'' + ' id=\'e' + vList[i].Field + '\' to=\'cAboutMe\'/>Edit</a>';
    if (vList[i].Field == 'Level')
      vList[i].Info = 'P' + vList[i].Info;
  }
}

//----------------------------------------------------------------------------------------------------
//  receive signals from framework.
//----------------------------------------------------------------------------------------------------
cAboutMeList.prototype.fSignal =
function(
  vSignal
)
{
  if (vSignal.target.getAttribute('to') != 'cAboutMe')
    return;
    
  if (vSignal.signal == 'click')
  {
    switch (vSignal.target.id)
    {
      case 'eName':
        this.xActive = 'name';
        fHideAll();
        fShowNameTbl();
        break;

      case 'ePassword':
        this.xActive = 'password';
        fHideAll();
        fShowPasswordTbl();
        break;

      case 'eAddress':
        this.xActive = 'address';
        fHideAll();
        fShowAddressTbl();
        break;

      case 'eEmail':
        this.xActive = 'email';
        fHideAll();
        fShowEmailTbl();
        break;

      case 'eOk':
        switch (this.xActive)
        {
          case 'name':
            fOnNameChange();
            break;
          
          case 'password':
            fOnPasswordChange();
            break;

          case 'address':
            fOnAddressChange();
            break;

          case 'email':
            fOnEmailChange();
            break;
        }
        break;

      case 'eCancel':
        this.xActive = null;
        fHideAll();
        break;
    }
  }
}

//----------------------------------------------------------------------------------------------------
function fOnNameChange()
{
  var vFirstName = fGet('#eFirstNameBox').value;
  var vLastName = fGet('#eLastNameBox').value;
  if (fValidateName(vFirstName, vLastName))
    fCmd('UpdateName', {'FirstName': vFirstName, 'LastName': vLastName});
  fHideAll();
}

//----------------------------------------------------------------------------------------------------
function fOnPasswordChange()
{
  var vPassword = fGet('#ePasswordBox').value;
  var vConfirm = fGet('#eConfirmPasswordBox').value;
  if (fValidatePassword(vPassword, vConfirm))
    fCmd('UpdatePassword', {'Password': cSys.fHash(cSys.kSeed, vPassword)});
  fHideAll();
}

//----------------------------------------------------------------------------------------------------
function fOnAddressChange()
{
  var vAddress = fGet('#eAddressBox').value;
  fCmd('UpdateAddress', {'Address': vAddress});
  fHideAll();
}

//----------------------------------------------------------------------------------------------------
function fOnEmailChange()
{
  var vEmail = fGet('#eEmailBox').value;
  if (fValidEmail(vEmail))
    fCmd('UpdateEmail', {'Email': vEmail});
  fHideAll();
}

//----------------------------------------------------------------------------------------------------
function fIsEmpty(
  vList 
)
{
  for (var i=0; i<vList.length; i++)
    if (fTrim(vList[i]).length == 0)
      return true;
  return false;
}

//----------------------------------------------------------------------------------------------------
function fValidateName(
  vFirstName,
  vLastName
)
{
  return !fIsEmpty([vFirstName, vLastName]);
}

//----------------------------------------------------------------------------------------------------
function fValidatePassword(
  vPassword,
  vConfirmPassword
)
{
  if (fIsEmpty([vPassword, vConfirmPassword]))
    return false;
  return (vPassword == vConfirmPassword);
}

//----------------------------------------------------------------------------------------------------
function fValidateLevel(
  vLevel
)
{
  var n = parseInt(vLevel);
  if (n >= 1 && n <= 6)
    return true;
  return false;
}

//----------------------------------------------------------------------------------------------------
function fShowNameTbl(
)
{
  var vElm = fGet('#eBar');
  vElm.innerHTML = '<b>Update Name</b>';
  fShow(vElm, true);
  fShow(fGet('#nameTbl'), true);
 }

//----------------------------------------------------------------------------------------------------
function fShowEmailTbl(
)
{
  var vElm = fGet('#eBar');
  vElm.innerHTML = '<b>Update Email</b>';
  fShow(vElm, true);
  fShow(fGet('#emailTbl'), true);
}

//----------------------------------------------------------------------------------------------------
function fShowPasswordTbl(
)
{
  var vElm = fGet('#eBar');
  vElm.innerHTML = '<b>Update Password</b>';
  fShow(vElm, true);
  fShow(fGet('#passwordTbl'), true);
 }

//----------------------------------------------------------------------------------------------------
function fShowAddressTbl(
)
{
  var vElm = fGet('#eBar');
  vElm.innerHTML = '<b>Update Address</b>';
  fShow(vElm, true);
  fShow(fGet('#addressTbl'), true);
 }

//----------------------------------------------------------------------------------------------------
function fHideAll(
)
{
  fShow(fGet('#eBar'), false);
  fShow(fGet('#emailTbl'), false);
  fShow(fGet('#passwordTbl'), false);
  fShow(fGet('#nameTbl'), false);
  fShow(fGet('#addressTbl'), false); 
}



























