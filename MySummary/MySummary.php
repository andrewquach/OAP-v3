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
  
  //Sys_fResumeSession();
  $vIdUser = $Sys_gCookies['IdUser'];

  switch ($vOp)
  {
    case 'ListContent':
      $vName = Sys_fFetchRows(Sys_fQuery('SELECT FirstName, LastName, Email
          	FROM tblUser WHERE Id = '. $vIdUser));
      $vChildren = Sys_fFetchRows(Sys_fQuery('SELECT Id, FirstName, LastName, Email
          	FROM tblUser WHERE ParentId = '. $vIdUser));    		
      $vBook = Sys_fFetchRows(Sys_fQuery('select distinct ItemId as Id, Title, Author, Publisher, Cover, a.LevelId, LevelEncode as Level, a.SubjectId, FirstName, LastName, AssigneeId from tblItemOwn a,tblBook b,tblUser c where type = 1 AND a.ItemId = b.BookId AND a.AssigneeId = c.Id AND a.UserId = '. $vIdUser));
      $vTestBank = Sys_fFetchRows(Sys_fQuery('select distinct ItemId as Id, Title, Author, Publisher, Cover, a.LevelId, LevelEncode as Level, a.SubjectId, FirstName, LastName, AssigneeId from tblItemOwn a,tblTestBank b,tblUser c where type = 2 AND a.ItemId = b.TestBankId AND a.AssigneeId = c.Id AND a.UserId = '. $vIdUser));
      $vCourseWare = Sys_fFetchRows(Sys_fQuery('select distinct ItemId as Id, Title, Author, Publisher, Cover, a.LevelId, LevelEncode as Level, a.SubjectId, FirstName, LastName, AssigneeId from tblItemOwn a,tblCourseware b,tblUser c where type = 3 AND a.ItemId = b.cWId AND a.AssigneeId = c.Id AND a.UserId = '. $vIdUser));	
	  return array('ParentName'=>$vName, 'book'=>$vBook, 'testBank'=>$vTestBank, 'courseWare'=>$vCourseWare, 'Children'=>$vChildren); 	
  }
}


//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>
