<?php
//----------------------------------------------------------------------------------------------------
require("../1.Core/Sys.php");
require("../config/config.php");

//----------------------------------------------------------------------------------------------------
//	errors.
//----------------------------------------------------------------------------------------------------
define("kLogin_ErrInvalidUserIdOrPassword", "Invalid User ID or Password.<br>Please try again.");

//----------------------------------------------------------------------------------------------------
function Page_fDo(							//	(*) data to return in response
	$vOp,									//	(string) operation
	$vParams,								//	(*) parameters
	$vLastRequest							//	(int) time of last request
)
{
	global $Sys_gCookies;
	$vSeed = "123456789";

	switch ($vOp)
	{
	case "ResetPasswd":
		// check if username exists
		$vRows = Sys_fFetchRows(Sys_fQuery("SELECT Id, Username, Email
			FROM tblUser
				WHERE Username = '" . $vParams["Username"] . "' And Role != 2"));
		if (count($vRows) == 0)
			return array("Success"=>0, "Err"=>"Parent Username is not found.");
		$vUserId = $vRows[0]["Id"];
		$vUsername = $vRows[0]["Username"];
		$vEmail = $vRows[0]["Email"];
		$vPasswd = fRandPasswd(10);
		Sys_fQuery("UPDATE tblUser
			SET Password = '" . Sys_fHash($vSeed, $vPasswd) . "'
				WHERE Id = " . $vUserId);
		if (Sys_fGetAffectedRows() != 1)
			return array("Success"=>0, "Err"=>"Cannot update password.");
		fSendPasswd($vUsername, $vPasswd, $vEmail);
		return array("Success"=>1, "Email"=>$vEmail);
		
	case "RetrieveUserId":
		$vRows = Sys_fFetchRows(Sys_fQuery("SELECT Username
			FROM tblUser
				WHERE Email = '" . $vParams["Email"] . "'"));
		
		if (count($vRows) == 0)
			return array("Success"=>0, "Err"=>"Email is not registered in our database.");
		$vArr = array();
		for ($i=0; $i<count($vRows); $i++)
			array_push($vArr, $vRows[$i]["Username"]);
		fSendUserId($vArr, $vParams["Email"]);
		return array("Success"=>1);

	case "Login":
		return null;
	}

	return null;
 }

//----------------------------------------------------------------------------------------------------
function fRandPasswd(
	$vLen
)
{
	$vStr =  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
	if ($vLen == 0)
		return "";
	return substr($vStr, rand() % strlen($vStr), 1) . fRandPasswd($vLen - 1);
}

//----------------------------------------------------------------------------------------------------
function fSendPasswd(
	$vUsername,
	$vPasswd,
	$vEmail
)
{
	$msg = "
		Hi,
		
		Thank you for using http://www.mcenrich.com.
		
		As requested, your password has been reset.
		Your new password is " . $vPasswd . "
		
		You can login here:
		".LANDING_URL."
		
		From,
		The folks @ mcenrich.com";

	mail($vEmail, "Password Reset", 	$msg, "From: info@mcenrich.com\r\n");
}

//----------------------------------------------------------------------------------------------------
function fSendUserId(
	$vUsers,
	$vEmail
)
{
	$vStr = "";
	
	for ($i=0, $vLen=count($vUsers); $i<$vLen; $i++)
	{
		$vStr .= $vUsers[$i];
		if ($i + 1 < $vLen)
			$vStr .= " / ";
	}

	$msg = "
		Hi,
		
		Thank you for using http://www.mcenrich.com.
		
		As requested, we have retrieved your username.
		Your username is " . $vStr . "
		
		You can login here:
		".LANDING_URL."
		
		From,
		The folks @ mcenrich.com";

	mail($vEmail, "Retrieve User ID", $msg, "From: info@mcenrich.com\r\n");
}

//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>
