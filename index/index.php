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
  //$vIdUser = $Sys_gCookies['IdUser'];

  switch ($vOp)
  {
    case 'ListBook':
      $vBooks = Sys_fFetchRows(Sys_fQuery('(SELECT DISTINCT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        Title, Publisher, Price, Cover, Author, Synopsis
          FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 GROUP BY BookId ORDER BY RAND() LIMIT 0,10) 
          
          UNION
          
          (SELECT DISTINCT Id, TestBankId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 GROUP BY TestBankId ORDER BY RAND())
          	
          UNION
          
          (SELECT DISTINCT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 GROUP BY cWId  ORDER BY RAND() LIMIT 0,10)
          	
          UNION
          
          (SELECT DISTINCT Id, BundleId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis
          	FROM tblBundle a, tblForSale b WHERE a.BundleId =  b.Id AND b.Type = 4 GROUP BY BundleId  ORDER BY RAND() LIMIT 0,10)'));
      
      $vBook = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        Title, Publisher, Price, Cover, Author, Synopsis
          FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 GROUP BY BookId ORDER BY BookId LIMIT 0,3'));
      $vTestbank = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT Id, TestBankId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 GROUP BY TestBankId ORDER BY TestBankId LIMIT 0,3'));
      $vCourseware = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 GROUP BY cWId  ORDER BY cWId LIMIT 0,3'));
      
      return array('books'=>$vBooks, 'book'=>$vBook, 'testbank'=>$vTestbank, 'courseware'=>$vCourseware);
  }
}


//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>

