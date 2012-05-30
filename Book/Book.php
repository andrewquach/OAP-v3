<?php
//----------------------------------------------------------------------------------------------------
require('../1.Core/Sys.php');
require('../Common/Helper.php');
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
  $vIdUser = $Sys_gCookies['IdUser'];
  $vRole = $Sys_gCookies['Role'];
  
  switch ($vOp)
  {
  
  	case 'ListBookDetailParent':
        return Sys_fFetchRows(Sys_fQuery('SELECT b.LevelId, LevelEncode as Level,  b.SubjectId, Title, Cover, AssigneeId, Publisher, Author, Subscribed, YEAR(a.EndDate) as Year, MONTH(a.EndDate) as Month, DAY(a.EndDate) as Date
          	FROM tblItemOwn a, tblBook b WHERE a.Type = 1 AND a.ItemId = b.BookId AND a.ItemId = '.$vParams["ItemId"].' AND UserId = '. $vIdUser));
    
    case 'ListBookDetailChild':
        return Sys_fFetchRows(Sys_fQuery('SELECT b.LevelId, LevelEncode as Level, b.SubjectId, Title, Cover, AssigneeId, Publisher, Author, YEAR(a.EndDate) as Year, MONTH(a.EndDate) as Month, DAY(a.EndDate) as Date 
          	FROM tblItemOwn a, tblBook b WHERE a.Type = 1 AND a.ItemId = b.BookId AND a.ItemId = '.$vParams["ItemId"].' AND AssigneeId = '. $vIdUser));
          	
    case 'SwitchChild':
    	Sys_fQuery("DELETE FROM tblTestDone 
        	WHERE UserId = " . $vParams["ChildId"]."
            AND TestId IN (SELECT TestId from tblTest 
            WHERE BookId = " . $vParams["ItemId"].")");
    	
    	Sys_fQuery("UPDATE tblItemOwn
          SET AssigneeId = " . $vParams["ChildId"]."
            WHERE UserId = " . $vIdUser . "
              AND ItemId = " . $vParams["ItemId"]);
        
        
                  
        return array("Success" => 1);
        
    case 'SwitchSubscribe':
    	
    	Sys_fQuery("UPDATE tblItemOwn
          SET Subscribed =  1 - Subscribed
            WHERE UserId = " . $vIdUser . "
              AND ItemId = " . $vParams["ItemId"]);
        
        return;
    
    case 'ListSources':
      return Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT tblBook.BookId, tblBook.Title, 
        Done, Total, Publisher, tblBook.LevelId, SubjectId, Cover, Author
          FROM tblBook, tblBookOwn
            WHERE UserId= ' . $vIdUser . '
              AND tblBook.BookId = tblBookOwn.BookId
              AND tblBook.LevelId = tblBookOwn.LevelId	
                ORDER BY tblBook.LevelId'));
      
     case 'ListTests':
      // retrieve all tests that belongs to a particular assessment book
      $vTests = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT TestId, BookId, Title, 
        Unit, Type, SubjectId, LevelId
          FROM tblTest
            WHERE BookId = ' . $vParams['BookId'] . '
              AND Type = \'Test\' 
                ORDER BY Unit'));
	  
	  if ($vRole == 1)
	  {
      	// fetch results of those attempted ones                
      	$vDone = Sys_fFetchRows(  Sys_fQuery('SELECT b.TestId, BookId, 
        Correct, Total, Start, Raw, Paused, High, LastCorrect, First, Attempt 
          FROM tblTest b, tblTestDone c, tblItemOwn a
            WHERE b.TestId = c.TestId
              AND c.UserId = a.AssigneeId
              AND a.UserId = '.$vIdUser .'
              AND a.Type = 1
              AND BookId = a.ItemId       
              AND b.Type = \'Test\'
              AND BookId = ' . $vParams['BookId']));
	  }
	  
	  else if ($vRole == 2)
	  
	  {
	  	// fetch results of those attempted ones                
      	$vDone = Sys_fFetchRows(  Sys_fQuery('SELECT b.TestId, BookId, 
        Correct, Total, Start, Raw, Paused, High, LastCorrect, First, Attempt
          FROM tblTest b, tblTestDone c, tblItemOwn a
            WHERE b.TestId = c.TestId
              AND c.UserId = a.AssigneeId
              AND a.AssigneeId = '.$vIdUser .'
              AND a.Type = 1
              AND BookId = a.ItemId       
              AND b.Type = \'Test\'
              AND BookId = ' . $vParams['BookId'])); 
	  }	
      // combine the results      
      for ($i=0, $ict=count($vTests); $i<$ict; $i++)
      {
        $vTests[$i]['Raw'] = '';
        for ($j=0, $jct=count($vDone); $j<$jct; $j++)
          if ($vTests[$i]['TestId'] == $vDone[$j]['TestId'])
          {
            $vTests[$i]['Done'] = 1;
            $vTests[$i]['Correct'] = $vDone[$j]['Correct'];
            $vTests[$i]['Total'] = $vDone[$j]['Total'];
            $vTests[$i]['Date'] = $vDone[$j]['Start'];
            $vTests[$i]['Raw'] = $vDone[$j]['Raw'];
            $vTests[$i]['Paused'] = $vDone[$j]['Paused'];
            $vTests[$i]['High'] = $vDone[$j]['High'];
            $vTests[$i]['LastCorrect'] = $vDone[$j]['LastCorrect'];
            $vTests[$i]['First'] = $vDone[$j]['First'];
            $vTests[$i]['Attempt'] = $vDone[$j]['Attempt'];
            break;
          }
      }
      return $vTests;
      
    case 'ListFavorites':
      return Sys_fFetchRows(Sys_fQuery('SELECT c.Favorite, d.Order, c.QtnId, a.Title, a.Unit, c.Correct
          FROM tblTest a, tblTestDone b, tblQtnDone c, tblQtnGrp d
            WHERE UserId = ' . $vIdUser . ' 
              AND b.Id = c.Id 
              AND d.TestId = a.TestId
              AND d.QtnId = c.QtnId
              AND a.TestId = b.TestId
              AND c.Favorite = 1 
              AND a.Type = \'Test\'
              AND a.BookId = ' . $vParams['BookId'] . '
                ORDER BY a.Unit, c.QtnId'));

    case 'FetchTestQtns':
      $vRows = Sys_fFetchRows(Sys_fQuery('SELECT TestId
        FROM tblTestDone
          WHERE UserId = '  . $vIdUser . '
          	AND Paused = 0
            AND TestId = ' . $vParams['TestId']));
      //fLog($vRows);
      //fLog('count = ' . count($vRows));
      if (count($vRows) == 0)
        return fTestQtns($vParams['TestId']);
      else
        return fTestQtnsWithFavs($vParams['TestId'], $vIdUser);

    case 'FetchFavQtn':
      return Sys_fFetchRows(Sys_fQuery('SELECT a.QtnId, b.Favorite, a.Path, a.Type, c.Raw
        FROM tblQtn a, tblQtnDone b, tblTestDone c, tblTest d
          WHERE a.QtnId = ' . $vParams['QtnId'] . '
            AND UserId = ' . $vIdUser . '
            AND d.Type = \'Test\'
            AND c.TestId = d.TestId
            AND a.QtnId = b.QtnId
            AND b.Id = c.Id'));
      
    case 'SetResult':
      // tracks past result
      
      if ($vRole == 2)
      {
	      $vPast = array('High' => 'NULL', 'LastCorrect' => 'NULL', 'First' => 'NULL', 'Attempt' => 'NULL');
	
	      $vResults = $vParams["Results"];
	      if ($vParams["Type"] == "Test")
	      {
	        $vRow = Sys_fFetchRows(Sys_fQuery("SELECT Id, Correct, High, First, Attempt FROM tblTestDone
	          WHERE TestId = " . $vParams["TestId"] . "
	            AND UserId = " . $vIdUser));
	        if (count($vRow))
	        {
	          // past result
	          $vPast['High'] = $vRow[0]['High'] ? $vRow[0]['High'] : $vParams['Correct'];
	          $vPast['LastCorrect'] = $vRow[0]['Correct'];
	          if ($vParams['Correct'] > $vPast['High'])
	            $vPast['High'] = $vParams['Correct'];
	          $vPast['First'] = $vRow[0]['First'] ? $vRow[0]['First'] : $vParams['Correct'];
	          $vPast['Attempt'] = $vRow[0]['Attempt'] ? $vRow[0]['Attempt']+1 : 1;
	          //fLog($vPast);
	
	          // remove past results
	          Sys_fQuery("DELETE FROM tblTestDone
	            WHERE Id = " . $vRow[0]["Id"]);
	          Sys_fQuery("DELETE FROM tblQtnDone
	            WHERE Id = " . $vRow[0]["Id"]);
	        }
	        else
	        {
	        	$vPast['High'] = $vParams['Correct'];
	        	$vPast['LastCorrect'] =  $vParams['Correct'];
	        	$vPast['First'] =  $vParams['Correct'];
	        	$vPast['Attempt'] = 1;
	        }
	      }
	
	      //if (isset($vPast['High']))
	        //if ($vParams['Correct'] > $vPast['High'])
	          //$vHigh = $vParams['Correct'];
	
	      // insert new results
	      Sys_fQuery('INSERT INTO tblTestDone
	        SET TestId = ' . $vParams['TestId'] . ', ' .
	          ' UserId = ' . $vIdUser . ', ' .
	          ' Correct = ' . $vParams['Correct'] . ', ' .
	          ' Total = ' . $vParams['Total'] . ', ' .
	          ' Start = ' . $vParams['Start'] . ', ' .
	          ' End = ' . $vParams['End'] . ', ' .
	          ' Raw = \'' . $vParams['Raw'] . '\', ' .
	          ' High = ' . $vPast['High'] . ', ' . 
	          ' First = ' . $vPast['First'] . ', ' . 
	          ' Attempt = ' . $vPast['Attempt'] . ', ' . 
	          ' Paused = 0, ' .
	          ' LastCorrect = ' . $vPast['LastCorrect']);
	      $vLastInsert = Sys_fGetInsertId();
	      for ($i=0, $ct=count($vResults); $i<$ct; $i++)
	        Sys_fQuery("INSERT INTO tblQtnDone
	          SET Id = " . $vLastInsert . ", " .
	            " QtnId = " . $vResults[$i]["QtnId"] . ", " .
	            " Correct = " . $vResults[$i]["Correct"] . ", " .
	            " Favorite = " . $vResults[$i]["Favorite"]);
	      /*       
	      if ($vParams["Type"] == "Test" && $vParams["NewAttempt"]==1 && isset($vParams["BookId"]))
	        Sys_fQuery("UPDATE tblBookOwn
	          SET Done = Done + 1
	            WHERE UserId = " . $vIdUser . "
	              AND BookId = " . $vParams["BookId"]);*/
	      
	      $vRow = Sys_fFetchRows(Sys_fQuery("SELECT UserId, FirstName, LastName, Subscribed, Email FROM tblItemOwn a, tblUser b
	          WHERE a.UserId = b.Id AND ItemId = " . $vParams["BookId"] . " AND Type = 1 AND AssigneeId = ". $vIdUser));
	          
	     	
	      if ($vRow[0]["Subscribed"])
	      {	
	      
	      	$vParentEmail = $vRow[0]["Email"];
	      	
	      	$vParentName = $vRow[0]["FirstName"]." ".$vRow[0]["LastName"];
	      	
	      	$vRow = Sys_fFetchRows(Sys_fQuery("SELECT Title FROM tblBook
	          	WHERE BookId = " . $vParams["BookId"]));
	      
	      	$vBookTitle = $vRow[0]["Title"];
	      
	      	$vRow = Sys_fFetchRows(Sys_fQuery("SELECT Title FROM tblTest
	          	WHERE TestId = " . $vParams["TestId"]));
	          
	      	$vTestTitle = $vRow[0]["Title"];
	      	
	      	$vRow = Sys_fFetchRows(Sys_fQuery("SELECT Username FROM tblUser
	          	WHERE Id = $vIdUser"));
	          	
	        $vChildName = $vRow[0]["Username"];
	     
	   	  	fSendResultMailParent($vParentEmail, $vParentName, $vChildName, $vBookTitle, $vTestTitle, $vParams['Correct'], $vParams['Total'], $vPast['First'], $vPast['LastCorrect'], $vPast['High'], $vPast['Attempt']);
	   	  
	   	  }
	  }            
	              
      return array("TestId" => $vParams["TestId"]);

    case 'SaveToResume':
      if ($vRole == 2)
      {	
		  // find out if there is an existing record
		  $vRows = Sys_fFetchRows(Sys_fQuery('SELECT TestId 
		    FROM tblTestDone 
		      WHERE TestId = ' . $vParams['TestId'] . '
		        AND UserId = ' . $vIdUser));
		  // if record exists, update; else, insert.
		  if (count($vRows))
		  {
		    Sys_fQuery('UPDATE tblTestDone 
		      SET Paused = 1, 
		        Raw = \'' . $vParams['Raw'] . '\' ' . '
		          WHERE UserId = ' . $vIdUser . '
		            AND TestId = ' . $vParams['TestId']);
		  }
		  else
		  {
		    Sys_fQuery('INSERT INTO tblTestDone
		      Set TestId = ' . $vParams['TestId'] . ', 
		        Paused = 1,
		        Raw = \'' . $vParams['Raw'] . '\',
		        UserId = ' . $vIdUser);
		  }
	  }
      return;
          
    case 'UpdateFav':
      if ($vRole == 2)
      {	
	      $vQtns = $vParams["Qtns"];
	      for ($i=0, $ct=count($vQtns); $i<$ct; $i++)
	      {
	        Sys_fQuery('UPDATE tblQtnDone a, tblTestDone b
	          SET a.Favorite = ' . $vQtns[$i]['Favorite'] . ' 
	            WHERE a.QtnId = ' . $vQtns[$i]['QtnId'] . ' 
	            AND b.UserId = ' . $vIdUser);
	      }
	  }
      return;
  }
  return null;
}

//----------------------------------------------------------------------------------------------------
function fTestQtns(
  $vTestId
)
{ 
  return Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT a.QtnId, a.Path, a.Type, b.Order
    FROM tblQtn a, tblQtnGrp b
      WHERE a.QtnId =b.QtnId
        AND b.TestId = ' . $vTestId . '
          ORDER BY b.Order'));  
}

//----------------------------------------------------------------------------------------------------
function fTestQtnsWithFavs(
  $vTestId,
  $vIdUser
)
{
  return Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT a.QtnId, a.Path, a.Type, b.Order, c.Favorite
    FROM tblQtn a, tblQtnGrp b, tblQtnDone c, tblTestDone d
      WHERE a.QtnId =b.QtnId
        AND a.QtnId = c.QtnId
        AND b.TestId = d.TestId
        AND c.Id = d.Id
        AND d.TestId = ' . $vTestId . '
        AND d.UserId = ' . $vIdUser . '
          ORDER BY b.Order'));
}

//----------------------------------------------------------------------------------------------------
function fSendResultMailParent($vParentEmail,
$vParentName,
$vChildName,
$vBookTitle, 
$vTestTitle, 
$vCorrect, 
$vTotal, 
$vFirst, 
$vLast, 
$vHigh, 
$vAttempt
)
{
	$vPercent = round((($vCorrect * 100)/$vTotal))  .'%';
	$msg = "
		Dear $vParentName,
		
		Your child: \"$vChildName\" has just completed a unit \"$vTestTitle\" in the book \"$vBookTitle\". Here are the results:
		
		Score: $vCorrect
		Total: $vTotal
		Percentage: $vPercent
		First Score: $vFirst
		Last Score: $vLast
		High Score: $vHigh
		No. of Attempt: $vAttempt

		Best regards,
		Administration
		mcenrich.com";

	mail($vParentEmail, "Your Child has completed an assignment!", $msg, "From: info@mcenrich.com\r\n");
}


//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>



















