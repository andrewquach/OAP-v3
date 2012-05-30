<?php
//----------------------------------------------------------------------------------------------------
require('../1.Core/Sys.php');
require('../Common/Helper.php');
require("../config/config.php");

//----------------------------------------------------------------------------------------------------
function Page_fDo(							//	(*) data to return in response
	$vOp,									//	(string) operation
	$vParams,								//	(*) parameters
	$vLastRequest							//	(int) time of last request
)
{
  global $Sys_gCookies;
  
  Sys_fResumeSession();
  //$vIdUser = $Sys_gCookies['IdUser'];
  
  return null;
}


//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>

