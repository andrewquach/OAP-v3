<?php
//----------------------------------------------------------------------------------------------------
//	Logout.php
//----------------------------------------------------------------------------------------------------
require("../1.Core/Sys.php");
require("../config/config.php");

//----------------------------------------------------------------------------------------------------
function Page_fDo(							//	(*) data to return in response
	$vOp,									//	(string) if null, no operation
	$vParams,								//	(*) parameters
	$vLastRequest							//	(int) time of last request
)
{
	global $Sys_gCookies;

	Sys_fResumeSession();

	switch ($vOp)
	{
	case "Logout":
		Sys_fEndSession();
		return null;
	}
	
	return null;
 }

//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>
