<?php
//----------------------------------------------------------------------------------------------------
require("../1.Core/Sys.php");
require("../Common/Helper.php");
require("../config/config.php");

//----------------------------------------------------------------------------------------------------
function Page_fDo(              //  (*) data to return in response
  $vOp,                 //  (string) operation
  $vParams,               //  (*) parameters
  $vLastRequest             //  (int) time of last request
)
{
  global $Sys_gCookies;

  //Sys_fResumeSession();
  $vIdUser = $Sys_gCookies["IdUser"];
          
  switch ($vOp)
  {
    case 'ListAccount':
      $me = Sys_fFetchRows(Sys_fQuery('SELECT FirstName, LastName, Email, LevelId, ProfilePic, Address
        FROM tblUser
          WHERE Id = ' . $vIdUser));
      $vChildren = Sys_fFetchRows(Sys_fQuery('SELECT Id, FirstName, LastName, Email
          	FROM tblUser WHERE ParentId = '. $vIdUser));
      return array('me' => $me[0],'Children'=>$vChildren);

    case 'UpdateName':
      Sys_fQuery('UPDATE tblUser
        SET FirstName = \'' . $vParams['FirstName'] . '\',
          LastName = \'' . $vParams['LastName'] . '\'
            WHERE Id = ' . $vIdUser);
      break;

    case 'UpdateEmail':
      Sys_fQuery('UPDATE tblUser
        SET Email = \'' . $vParams['Email'] . '\'
          WHERE Id = ' . $vIdUser);
      break;

    case 'UpdatePassword':
      Sys_fQuery('UPDATE tblUser
        SET Password = \'' . $vParams['Password'] . '\'
          WHERE Id = ' . $vIdUser);
      break;

    case 'UpdateAddress':
      Sys_fQuery('UPDATE tblUser
        SET Address = \'' . $vParams['Address'] . '\'
          WHERE Id = ' . $vIdUser);
      break;

    case 'FetchProfilePic':
      return Sys_fFetchRows(Sys_fQuery('SELECT ProfilePic
        FROM tblUser
          WHERE Id = ' . $vIdUser));
   	
   	case 'ListChildren':
      $vName = Sys_fFetchRows(Sys_fQuery('SELECT FirstName, LastName, Email
          	FROM tblUser WHERE Id = '. $vIdUser));
      $vChildren = Sys_fFetchRows(Sys_fQuery('SELECT Id, FirstName, LastName, Email
          	FROM tblUser WHERE ParentId = '. $vIdUser));
      
      for ($i=0; $i<count($vChildren); $i++){
      	$vAssignedItems =  Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT ItemId
          	FROM tblItemOwn WHERE AssigneeId = '. $vChildren[$i]["Id"]));
        $vChildren[$i]["NoItemOwn"] = count($vAssignedItems);
      }  		
	  return array('ParentName'=>$vName, 'Children'=>$vChildren);
	  
	case 'ListChildAccount':
      $vChild = Sys_fFetchRows(Sys_fQuery('SELECT FirstName, LastName, Username, Id
          	FROM tblUser WHERE Id = '. $vParams['childId']));	
	  return array('Child'=>$vChild);
	  
	case 'GetParent':
      $vParent = Sys_fFetchRows(Sys_fQuery('SELECT Username
          	FROM tblUser WHERE Id IN (SELECT ParentId FROM tblUser WHERE Id ='. $vParams['childId']. ')'));	
	  return array('Parent'=>$vParent);
  }
  
  return null;
}

//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>



















