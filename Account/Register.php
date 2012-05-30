<?php
//----------------------------------------------------------------------------------------------------
require("../1.Core/Sys.php");
require("../config/config.php");

//----------------------------------------------------------------------------------------------------
//	errors.
//----------------------------------------------------------------------------------------------------
define("kLogin_ErrInvalidUserIdOrPassword", "InvalidUserIdOrPassword");

//----------------------------------------------------------------------------------------------------
function Page_fDo(							//	(*) data to return in response
	$vOp,									//	(string) operation
	$vParams,								//	(*) parameters
	$vLastRequest							//	(int) time of last request
)
{
	switch ($vOp)
	{
	case "FetchSch":
		return Sys_fFetchRows(Sys_fQuery("SELECT SchoolId, School
			FROM tblSchool"));

	case "Register":
		// check if username is already in use
		$vRows = Sys_fFetchRows(	Sys_fQuery("SELECT * FROM tblUser
			WHERE Username = '" . $vParams["UserId"] . "'"));
		if (count($vRows) != 0)
			return array("Success" => 0, "Err" => "Username is in use.");
			
		// check if username is already in use
		$vRows = Sys_fFetchRows(	Sys_fQuery("SELECT * FROM tblUser
			WHERE Email = '" . $vParams["ParentEmail"] . "'"));
		if (count($vRows) != 0)
			return array("Success" => 0, "Err" => "Email is in use.");
			
		$date = $vParams["ParentDoB"]; 
		$dob = date('Y-m-d', strtotime($date));
			
		// add user
		Sys_fQuery("INSERT INTO tblUser 
			SET Username = '" . mysql_real_escape_string($vParams["UserId"]) . "', 
				Password = '" . mysql_real_escape_string($vParams["Password"]) . "',
				FirstName = '" . mysql_real_escape_string($vParams["ParentFirst"]) . "',
				LastName = '" . mysql_real_escape_string($vParams["ParentLast"]) . "',
				Email = '" . mysql_real_escape_string($vParams["ParentEmail"]) . "',
				Gender  = '". mysql_real_escape_string($vParams["ParentGender"]). "',
				DateOfBirth = '" .$dob."',
				Address = '" . mysql_real_escape_string($vParams["Address"]) . "',
				Role = 1,
				NewsNPromo = " . $vParams["NewsNPromo"]);
		
		$vUserId = Sys_fGetInsertId();
		if ($vUserId == 0)
			return array("Success" => 0, "Err" => "Unknown error.");
      
		fSendConfirmMail($vParams["UserId"], mysql_real_escape_string($vParams["ParentEmail"]));
    	
		return array("Success"=>1);
	}
	
	return null;
 }


//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);


//----------------------------------------------------------------------------------------------------
function fSendConfirmMail(
	$vUsername,
	$vEmail
)
{
	$msg = "
		Hi,
		
		Thank you for visiting us at http://www.mcenrich.com.
		
		A new account has been created for you.
		Your username is " . $vUsername . "
		
		To login, please click:
		".LANDING_URL."

		From,
		The folks @ mcenrich.com";

	mail($vEmail, "Welcome to MCEnrich.com!", $msg, "From: info@mcenrich.com\r\n");
}

//----------------------------------------------------------------------------------------------------
?>