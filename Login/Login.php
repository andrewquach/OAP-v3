<?php
//----------------------------------------------------------------------------------------------------
//  Login.php
//----------------------------------------------------------------------------------------------------
require('../1.Core/Sys.php');
require("../config/config.php");


//----------------------------------------------------------------------------------------------------
function Page_fDo(              //  (*) data to return in response
  $vOp,                 //  (string) operation
  $vParams,               //  (*) parameters
  $vLastRequest             //  (int) time of last request
)
{
  global $Sys_gCookies;

  switch ($vOp)
  {
  case 'GetToken':
    return time();
  
  case 'Login':
    $vData = Sys_fFetchRows(Sys_fQuery('SELECT Id, Password, Role, Username FROM tblUser ' .
      'WHERE Username = \'' . $vParams['UserId'] . '\' OR Email = \''.$vParams['UserId'].'\''));
    if (count($vData) != 1)
      throw new Exception(Sys_kErrInvalidUserIdOrPassword);
    $vData = $vData[0];
    $vData['Role'] = $vData['Role'];

    // password
    $vPassword1 = $vData['Password'];
    $vPassword2 = Sys_fHash($vParams['Token'], $vPassword1);
    $vPassword3 = Sys_fHash($vParams['Time'], $vPassword2);
    if ($vParams['Password'] != $vPassword3)
      throw new Exception(Sys_kErrInvalidUserIdOrPassword);

    // start session
    Sys_fStartSession($vPassword2, $vData['Id'], $vData['Role'], $vParams['Force']);
    $Sys_gCookies['IdUser'] = (int) $vData['Id'];
    $Sys_gCookies['Role'] = (int) $vData['Role'];
    $Sys_gCookies['oap_uname'] = $vData['Username'];
	
	
	$vItemsOwn = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT ItemId FROM tblItemOwn WHERE UserId = '.$Sys_gCookies['IdUser'].' GROUP BY ItemId'));
	
    // determines profile of user
    /*
    $vBooks = Sys_fFetchRows(Sys_fQuery('SELECT BookId
      FROM tblBookOwn 
        WHERE UserId = ' . $vData['Id'] . '
          LIMIT 1'));
    $vTestBank = Sys_fFetchRows(Sys_fQuery('SELECT UserId
        FROM tblProfile
          WHERE StartDate <= NOW() 
            AND EndDate >= NOW()
            AND UserId = ' . $vData['Id'] . '
              LIMIT 1'));
              */
    return array('Role' => $vData['Role'],'itemsOwn' => $vItemsOwn);
  }

  return null;
 }

//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);


//----------------------------------------------------------------------------------------------------
?>
