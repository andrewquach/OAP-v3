//----------------------------------------------------------------------------------------------------
//	2.Widgets/cLgInBox.js
//----------------------------------------------------------------------------------------------------

//alert("2.Widgets/cLgInBox.js");

//----------------------------------------------------------------------------------------------------
//	cTab namespace.
//----------------------------------------------------------------------------------------------------
var cLgInBox = {};

//----------------------------------------------------------------------------------------------------
//	create message box.
//----------------------------------------------------------------------------------------------------
cLgInBox.fCreate =
function()
{
	
	
	var vThis, s;
	
	s = '<a id="eClose" class="btnClose" title="Close">X</a>'
	s += '<div class="box border"><div class="inner"><h1>Login to Your Account</h1><div class="centeralign">';
	s += '<label>Username / Email</label><input id="eUserId" size="35" type="text" /><div class="ht10"></div>';
	s += '<label>Password&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><input id="ePassword" size="35" type="password" /><div class="ht10"></div>';
	s += '<div class="signError"><div id="signError" style="display:none">You have entered an invalid Username or Password.</div></div>'
	s += '<a id="eLogin2" class="button_link"><span>Login</span></a>';
	s += '<div class="forgot"><a id="eForget">Forget Username/Password?</a></div><div class="clear"></div>';
	s += '</div><div class="signUp"><a id="eRegister"><h3>Don\'t have an account? <span>Sign Up Today!</span></h3></a>';
	s += '</div></div></div>';

	vThis = document.createElement("div");
	vThis.className = "cLgInBox";
	vThis.innerHTML = s;
	
	return vThis;
}

//----------------------------------------------------------------------------------------------------
//	handle signal.
//	return true to bubble signal to parent, false (default) to stop.
//----------------------------------------------------------------------------------------------------
cLgInBox.fOnSignal =
function(									//	(boolean) false to stop
	vThis,									//	(element) element processing signal
	vTarget,								//	(element) original target for signal
	vSignal,								//	(string) signal received
	vData									//	(*) extra data along with signal
)
{
	var vSize;
	
	switch (vSignal)
	{
	case 'Start':
		if (cSys.gCookies["IdChild"]){
			cSys.fStartRequest(cPage.mThis, "GetParentDone", "Account/Account.php", "GetParent", {'childId':cSys.gCookies["IdChild"]}, "Get Parent…");
		}
		return false;
			
	case 'Suspend':
	case 'Resume':
		return false;

	case "resize":
		vSize = fGetSize(vThis);
		fSetPos(vThis, {x: (vData.x - vSize.x) / 2, y: (vData.y - vSize.y) / 2});
		return false;
	
	case 'keypress':
      if (vData == 13 && !cPage.mErrDlg)
      fInitiateLogin();
      return false;
		
	case "click":
		if (vTarget.id == "eLogin2")
		{
          	fInitiateLogin();
        }
        else if (vTarget.id == "eClose"){
        	cSys.fEndModal();
        	if (cSys.gAppVars['register']){
        		cSys.gAppVars['register'] = false;
        		cSys.fGoto("index.html");
        	}
       	}
        else if (vTarget.id == "eRegister")
        	cSys.fGoto("register.html");
        
        else if (vTarget.id == "eForget")
        	cSys.fGoto("forgot.html");
        	     	
		return false;	
	}
	
	return false;
}

  			
//----------------------------------------------------------------------------------------------------
function fInitiateLogin(
)
{
  if (gToken == null)
  {
    cSys.fStartRequest(cPage.mThis, "GetTokenDone", "Login/Login.php", "GetToken", {}, "Get token…");
    return false;
  }
  cSys.fDispatch(cPage.mThis, 'Login', false);
}
