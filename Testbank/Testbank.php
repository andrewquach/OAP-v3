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
      
   	case 'ListTestbankDetailParent':
        return Sys_fFetchRows(Sys_fQuery('SELECT b.LevelId, LevelEncode as Level, b.SubjectId, Title, Cover, AssigneeId, Publisher, Author , Subscribed, YEAR(a.EndDate) as Year, MONTH(a.EndDate) as Month, DAY(a.EndDate) as Date
          	FROM tblItemOwn a, tblTestBank b WHERE a.Type = 2 AND a.ItemId = b.TestBankId AND a.ItemId = '.$vParams["ItemId"].' AND UserId = '. $vIdUser));
    
    case 'ListTestbankDetailChild':
        return Sys_fFetchRows(Sys_fQuery('SELECT b.LevelId, LevelEncode as Level, b.SubjectId, Title, Cover, AssigneeId, Publisher, Author, YEAR(a.EndDate) as Year, MONTH(a.EndDate) as Month, DAY(a.EndDate) as Date 
          	FROM tblItemOwn a, tblTestBank b WHERE a.Type = 2 AND a.ItemId = b.TestBankId AND a.ItemId = '.$vParams["ItemId"].' AND AssigneeId = '. $vIdUser));
   	
   	case 'SwitchChild':
    	Sys_fQuery("UPDATE tblItemOwn
          SET AssigneeId = " . $vParams["ChildId"]."
            WHERE UserId = " . $vIdUser . "
              AND ItemId = " . $vParams["ItemId"]);
      return array("Success" => 1);
      
      
    case "ListTopics":
      $vTopics = Sys_fFetchRows(Sys_fQuery('SELECT a.TopicId, b.Topic, a.LevelId, a.SubjectId
        FROM tblQtn a, tblTopic b
          WHERE a.TopicId = b.TopicId
            AND a.LevelId = '.$vParams["level"].'
            AND a.SubjectId = '.$vParams["subject"].'
            AND a.Pool = 0
              GROUP BY a.TopicId , a.LevelId
              ORDER BY b.Topic'));
      $vFocus = Sys_fFetchRows(Sys_fQuery('SELECT TopicId
        FROM tblFocus
          WHERE UserId = ' . $vIdUser));
      return array('topics'=>$vTopics, 'focus'=>$vFocus);
      
    case "AddFocus":
 	  Sys_fQuery("DELETE FROM tblFocus
        WHERE UserId = " . $vIdUser . "
          AND TopicId = " . $vParams["TopicId"]);	
      Sys_fQuery("INSERT INTO tblFocus
        SET UserId = " . $vIdUser . ",
          TopicId = " . $vParams["TopicId"]);
      return array("Success" => (Sys_fGetAffectedRows() != 0));

    case "RemoveFocus":
      Sys_fQuery("DELETE FROM tblFocus
        WHERE UserId = " . $vIdUser . "
          AND TopicId = " . $vParams["TopicId"]);
      return array("Success" => (Sys_fGetAffectedRows() != 0));
      
     case 'GenTestByTopics':
      $vQtnsPerTopic = $vParams['NumQtns'] / count($vParams['Topics']);
      $vQtnsPerTopic = round($vQtnsPerTopic) + 1;
      $vTopics = $vParams['Topics'];
      $vAll = array();
      for ($i=0; $i<count($vTopics); $i++)
      {
        $vQtns = fUsableTBQtns($vParams['SubjectId'], $vParams['LevelId'],
            $vTopics[$i], $vQtnsPerTopic, $vParams['AssigneeId']);
        $vAll[$vTopics[$i]] = $vQtns;
      }
      // construct topical test
      return fTopicalTest($vAll, $vParams['NumQtns'], $vTopics);
      
      
      case 'SetTest':
        $vTestId = fCreateTest($vIdUser, $vParams);        
        return array('Success'=>1);
      
        
      case 'SetResult':
      if ($vRole == 2)
	  {	  	
	      if (! isset($vParams['TestId']))
	      {
	        $vTestId = fCreateTest($vIdUser, $vParams);
	        fCreateScores($vIdUser, $vTestId, $vParams);
	        //return array("Step"=>1);
	      }
	      else if ($vParams['Paused'] == 1){
	        fSaveToResume($vIdUser, $vParams['TestId'], $vParams);
	        //return array("Step"=>2);
	      }
	      else{
	        fUpdateScores($vIdUser, $vParams['TestId'], $vParams);
	        //return array("Step"=>3);
	      }
	      
	      
	  }      
      return false;  
     
     
      case 'SwitchSubscribe':
    	
    	Sys_fQuery("UPDATE tblItemOwn
          SET Subscribed =  1 - Subscribed
            WHERE UserId = " . $vIdUser . "
              AND ItemId = " . $vParams["ItemId"]);
        
        return;
        
     case 'ListTBResults':
    /*
      return Sys_fFetchRows(Sys_fQuery('SELECT b.Title, a.TestId, a.Correct, a.Total, 
        a.Start, a.Raw, b.Type, b.SubjectId, b.LevelId, a.Paused, a.LastCorrect, a.High
          FROM tblTestDone a, tblTest b
            WHERE a.TestId = b.TestId
              AND b.Type <> \'Test\'
              AND a.UserId = ' .  $vParams['AssigneeId'] . '
                ORDER BY a.Start DESC'));
      */
      // retrieve all tests that belongs to a particular assessment book
      $vTests = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT a.TestId, Title, Type, SubjectId, LevelId, TestInfo
          FROM tblTest a, tblTestAssign b
            WHERE a.TestId = b.TestId
            AND b.UserId = ' . $vParams['AssigneeId'] . '
              AND Type <> \'Test\' 
                ORDER BY a.TestId'));
	 
      	// fetch results of those attempted ones                
      	$vDone = Sys_fFetchRows(  Sys_fQuery('SELECT b.TestId, BookId, 
        Correct, Total, Start, Raw, Paused, High, LastCorrect, First, Attempt
          FROM tblTest b, tblTestDone c, tblTestAssign a
            WHERE b.TestId = c.TestId
              And c.TestId = a.TestId
              AND c.UserId = a.UserId
              AND a.UserId = '.$vParams['AssigneeId'] .'
              AND b.Type <> \'Test\''));
	 
	  	
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
            $vTests[$i]['Start'] = $vDone[$j]['Start'];
            $vTests[$i]['First'] = $vDone[$j]['First'];
            $vTests[$i]['Attempt'] = $vDone[$j]['Attempt'];
            break;
          }
      }
      return $vTests;
                
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
        return fTestQtnsWithFavs($vParams['TestId'], $vParams['AssigneeId']);
      
  }
  return null;
}

//----------------------------------------------------------------------------------------------------
//  fetch qtns that has not been attempted by user before.
//----------------------------------------------------------------------------------------------------
function fUsableTBQtns(
  $vSubjectId,
  $vLevelId,
  $vTopicId,
  $vLimit,
  $vIdUser
)
{
  return Sys_fFetchRows(Sys_fQuery('SELECT a.QtnId, a.Path, a.TopicId
    FROM tblQtn a
      WHERE a.Pool = 0
       AND a.SubjectId = ' . $vSubjectId . ' 
        AND a.LevelId = ' . $vLevelId . '
        AND a.TopicId = ' . $vTopicId . '
        AND a.QtnId NOT IN (
          SELECT b.QtnId 
            FROM tblQtnDone b, tblTestDone c, tblTest d
              WHERE b.Id = c.Id
                AND d.Type <> \'Test\'
                AND c.TestId = d.TestId
                AND c.UserId = ' . $vIdUser . ') LIMIT ' . $vLimit));
}




//----------------------------------------------------------------------------------------------------
//  given a set of qtns, construct a test that has somewhat even number of qtns for
//  each specified topics.
//----------------------------------------------------------------------------------------------------
function fTopicalTest(
  $vSuggests,
  $vNumQtns,
  $vTopics
)
{
  $vQtns = array();

  for ($i=0, $last=-1, $vNumTopics=count($vTopics); $last != $i; )
  {
    $last = $i;
    for ($j=0; $j<$vNumTopics && $i<$vNumQtns; $j++)
    {
      $vList = &$vSuggests[$vTopics[$j]];
      if (count($vList))
      {
        $vItem = array_shift($vList);
        $vItem['Order'] = ++$i;
        array_push($vQtns, $vItem);
      }
    }
  }
  return array ('Qtns' => $vQtns, 'Topics' => $vTopics);
}

//----------------------------------------------------------------------------------------------------
//  save a newly created test (by mapping qtns to it).
//----------------------------------------------------------------------------------------------------
function fCreateTest(
  $vIdUser,
  $vParams
)
{
  // data setup
  if (! isset($vParams['RefTestId']))
    $vParams['RefTestId'] = '\'NULL\'';

  $vRows = Sys_fFetchRows(Sys_fQuery('SELECT COUNT(b.TestId) as Ct
    FROM tblTestAssign a, tblTest b
      WHERE Type = \'' . $vParams['Type'] . '\'' .'
        AND a.TestId = b.TestId
        AND b.LevelId = '.$vParams['LevelId'].'
        AND b.SubjectId = '.$vParams['SubjectId'].'
        AND UserId = ' . $vParams['AssigneeId']));
  $vTitle = $vParams['Type'] . ' Test ' . ($vRows[0]['Ct'] + 1);
	
  $vTestInfo = fMakeInfo($vParams['Topics'],count($vParams['Qtns']));
  
  // create a new test record
  Sys_fQuery('INSERT INTO tblTest
    SET SubjectId = ' . $vParams['SubjectId'] . ', ' .
      ' Title = \'' . $vTitle . '\', ' .
      ' LevelId = ' . $vParams['LevelId'] . ', ' .
      ' Type = \'' . $vParams['Type'] . '\', ' .
      ' RefTestId = ' . $vParams['RefTestId'].', '.
      ' TestInfo = \''.$vTestInfo.'\'');
  $vTestId = Sys_fGetInsertId();
  
  // create a new test assign record
  Sys_fQuery('INSERT INTO tblTestAssign
    SET UserId = ' . $vParams['AssigneeId'] . ', ' .
      ' CreatorId = ' . $vIdUser . ', ' .
      ' TestId = ' . $vTestId);

  // map individual qtns to the created test record
  $vQtns = $vParams['Qtns'];
  for ($i=0, $ct=count($vQtns); $i<$ct; $i++)
  {
    Sys_fQuery('INSERT INTO tblQtnGrp
      SET TestId = ' . $vTestId . ',
        QtnId = ' . $vQtns[$i]['QtnId'] . ', 
          tblQtnGrp.Order = ' . $vQtns[$i]['Order']);
  }
  return $vTestId;  
}

//----------------------------------------------------------------------------------------------------
//  track user's score for a test.
//----------------------------------------------------------------------------------------------------
function fCreateScores(
  $vIdUser,
  $vTestId,
  $vParams
)
{ 
  $vQtns = $vParams['Qtns'];
  
  // tracks overall score for the test
  $vCorrects = fCorrect($vQtns);
  Sys_fQuery('INSERT INTO tblTestDone
    SET TestId = ' . $vTestId . ', ' .
      ' UserId = ' . $vIdUser . ', ' .
      ' Correct = ' . $vCorrects . ', ' .
      ' Total = ' . count($vQtns) . ', ' .
      ' Start = ' . $vParams['Start'] . ', ' .
      ' End = ' . $vParams['End'] . ', ' .
      ' Paused = ' . $vParams['Paused'] . ', ' .
      ' High = ' . $vCorrects . ', ' .
      ' LastCorrect = ' . $vCorrects . ', ' .
      ' First = ' . $vCorrects . ', ' .
      ' Attempt = 1, ' .
      ' Raw = \'' . $vParams['Raw'] . '\'');
  $vLastInsert = Sys_fGetInsertId();

  // track individual score/favorite of qtns in the test
  for ($i=0, $ct=count($vQtns); $i<$ct; $i++)
    Sys_fQuery('INSERT INTO tblQtnDone
      SET Id = ' . $vLastInsert . ', ' .
        ' QtnId = ' . $vQtns[$i]['QtnId'] . ', ' .
        ' Correct = ' . $vQtns[$i]['Correct'] . ', ' .
        ' Favorite = ' . $vQtns[$i]['Favorite']);
        
        
  $vRow = Sys_fFetchRows(Sys_fQuery("SELECT UserId, FirstName, LastName, Subscribed, Email, ItemId FROM tblItemOwn a, tblUser b
	          WHERE a.UserId = b.Id AND a.SubjectId = ".$vParams['SubjectId']." AND a.LevelId = ".$vParams['LevelId']." AND Type = 2 AND AssigneeId = ". $vIdUser));
  	        
  $vSubscribed = $vRow[0]["Subscribed"];
          
  $vParentEmail = $vRow[0]["Email"];
	      	
  $vParentName = $vRow[0]["FirstName"]." ".$vRow[0]["LastName"];
	      	
  $vItemId = $vRow[0]["ItemId"];
	      	
  $vRow = Sys_fFetchRows(Sys_fQuery("SELECT Title FROM tblTestBank
	          	WHERE TestBankId = " . $vItemId));
	      
  $vTestBankTitle = $vRow[0]["Title"];
	      
  $vRow = Sys_fFetchRows(Sys_fQuery("SELECT Title FROM tblTest
	          	WHERE TestId = " . $vTestId));
 
  $vTestTitle = $vRow[0]["Title"];
	      	
  $vRow = Sys_fFetchRows(Sys_fQuery("SELECT Username FROM tblUser
	          	WHERE Id = $vIdUser"));
	          	
  $vChildName = $vRow[0]["Username"];
  
  $vTotal = count($vQtns);
   if ($vSubscribed)
   		fSendResultMailParent($vParentEmail, $vParentName, $vChildName, $vTestTitle, $vTestBankTitle, $vCorrects, $vTotal, $vCorrects, $vCorrects, $vCorrects, 1); 
}

//----------------------------------------------------------------------------------------------------
//  update scores.
//----------------------------------------------------------------------------------------------------
function fUpdateScores(
  $vIdUser,
  $vTestId,
  $vParams
)
{
  $vRows = Sys_fFetchRows(Sys_fQuery('SELECT Correct, High, Attempt, First
    FROM tblTestDone
      WHERE UserId = ' . $vIdUser . '
        AND TestId = ' . $vTestId));
        
  $vRow = Sys_fFetchRows(Sys_fQuery("SELECT UserId, FirstName, LastName, Subscribed, Email, ItemId FROM tblItemOwn a, tblUser b
	          WHERE a.UserId = b.Id AND a.SubjectId = ".$vParams['SubjectId']." AND a.LevelId = ".$vParams['LevelId']." AND Type = 2 AND AssigneeId = ". $vIdUser));
  	        
  $vSubscribed = $vRow[0]["Subscribed"];
          
  $vParentEmail = $vRow[0]["Email"];
	      	
  $vParentName = $vRow[0]["FirstName"]." ".$vRow[0]["LastName"];
	      	
  $vItemId = $vRow[0]["ItemId"];
	      	
  $vRow = Sys_fFetchRows(Sys_fQuery("SELECT Title FROM tblTestBank
	          	WHERE TestBankId = " . $vItemId));
	      
  $vTestBankTitle = $vRow[0]["Title"];
	      
  $vRow = Sys_fFetchRows(Sys_fQuery("SELECT Title FROM tblTest
	          	WHERE TestId = " . $vTestId));
 
  $vTestTitle = $vRow[0]["Title"];
	      	
  $vRow = Sys_fFetchRows(Sys_fQuery("SELECT Username FROM tblUser
	          	WHERE Id = $vIdUser"));
	          	
  $vChildName = $vRow[0]["Username"];       
        
        
  if (count($vRows) == 0)
  {
  $vQtns = $vParams['Qtns'];
  $vCorrects = fCorrect($vQtns);
  
    // insert new results
  Sys_fQuery('INSERT INTO tblTestDone
    SET TestId = ' . $vParams['TestId'] . ', ' .
      ' UserId = ' . $vIdUser . ', ' .
      ' Correct = ' . $vCorrects . ', ' .
      ' Total = ' . count($vQtns) . ', ' .
      ' Start = ' . $vParams['Start'] . ', ' .
      ' End = ' . $vParams['End'] . ', ' .
      ' Raw = \'' . $vParams['Raw'] . '\', ' .
      ' High = ' . $vCorrects . ', ' . 
      ' Paused = 0, ' .
      ' First = ' . $vCorrects . ', ' .
      ' Attempt = 1, ' .
      ' LastCorrect = ' . $vCorrects);
    
  
  $vLastInsert = Sys_fGetInsertId();
  
    // track individual score/favorite of qtns in the test
  for ($i=0, $ct=count($vQtns); $i<$ct; $i++)
    Sys_fQuery('INSERT INTO tblQtnDone
      SET Id = ' . $vLastInsert . ', ' .
        ' QtnId = ' . $vQtns[$i]['QtnId'] . ', ' .
        ' Correct = ' . $vQtns[$i]['Correct'] . ', ' .
        ' Favorite = ' . $vQtns[$i]['Favorite']);
        
     
      $vTotal = count($vQtns);
   	  if ($vSubscribed)
   			fSendResultMailParent($vParentEmail, $vParentName, $vChildName, $vTestTitle, $vTestBankTitle, $vCorrects, $vTotal, $vCorrects, $vCorrects, $vCorrects, 1); 
        
        
     return;
  }

  $vFormer = $vRows[0];
  $vQtns = $vParams['Qtns'];
  $vCorrects = fCorrect($vQtns);

  // determine highest score for this test
  $vHigh = $vFormer['High'] ? $vFormer['High'] : $vCorrects;
  if ($vHigh < $vCorrects)
    $vHigh = $vCorrects;
  $vAttempt = $vFormer['Attempt'] ? $vFormer['Attempt']+1 : 1;
  $vLastCorrect = $vFormer['Correct'] ? $vFormer['Correct'] : $vCorrects;
  $vFirstScore = $vFormer['First'] ? $vFormer['First'] : $vCorrects;
  // update scores as a whole
  Sys_fQuery('UPDATE tblTestDone
    SET Paused = 0, 
      Raw = \'' . $vParams['Raw'] . '\',
      Correct = ' . $vCorrects . ',
      Total = ' . count($vQtns) . ',
      Start = \'' . $vParams['Start'] . '\',
      End = \'' . $vParams['End'] . '\',
      LastCorrect = ' . $vLastCorrect . ',
      High = ' . $vHigh . ',
      First = ' . $vFirstScore . ',
      Attempt = ' . $vAttempt . '
      WHERE TestId = ' . $vTestId);
    
  // update scores for individual questions
  for ($i=0, $ct=count($vQtns); $i<$ct; $i++)
    Sys_fQuery('UPDATE tblQtnDone
      SET Correct = ' . $vQtns[$i]['Correct'] . '
        WHERE QtnId = ' . $vQtns[$i]['QtnId']);
        
   
   $vTotal = count($vQtns);
   	  if ($vSubscribed)
   			fSendResultMailParent($vParentEmail, $vParentName, $vChildName, $vTestTitle, $vTestBankTitle, $vCorrects, $vTotal, $vFirstScore, $vLastCorrect, $vHigh, $vAttempt);     
  
}

//----------------------------------------------------------------------------------------------------
//  track user's score for a test
//----------------------------------------------------------------------------------------------------
function fSaveToResume(
  $vIdUser,
  $vTestId,
  $vParams
)
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
		    
		    $vLastInsert = Sys_fGetInsertId();
		        
		    $vQtns = $vParams['Qtns'];
		    
		    // track individual score/favorite of qtns in the test
  			for ($i=0, $ct=count($vQtns); $i<$ct; $i++)
    			Sys_fQuery('INSERT INTO tblQtnDone
      				SET Id = ' . $vLastInsert . ', ' .
        			' QtnId = ' . $vQtns[$i]['QtnId'] . ', ' .
        			' Correct = ' . $vQtns[$i]['Correct'] . ', ' .
        			' Favorite = ' . $vQtns[$i]['Favorite']);
 
		   
		  }
}


//----------------------------------------------------------------------------------------------------
//  track user's score for a test
//----------------------------------------------------------------------------------------------------
function fMakeInfo(
  $vTopics,
  $vNumOfQtns
)
{
  $str = $vNumOfQtns . " questions<br/>"; 
  for ($i=0; $i<count($vTopics); $i++)
  {
  	$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Topic FROM tblTopic WHERE TopicId = '.$vTopics[$i]));
  	if ($i == 0)
  		$str .= $vRows[0]["Topic"];
  	else
  		$str .= ', ' . $vRows[0]["Topic"];
  } 	
  return $str;
}


//----------------------------------------------------------------------------------------------------
//  compute no. of correct attempts.
//----------------------------------------------------------------------------------------------------
function fCorrect(
  $vQtns
)
{
  $vOk = 0;
  for ($i=0, $ct=count($vQtns); $i<$ct; $i++)
    if ($vQtns[$i]['Correct'] == 1)
      $vOk++;
  return $vOk;
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
        AND c.Id = d.Id
        AND b.TestId = d.TestId 
        AND d.TestId = ' . $vTestId . '
        AND d.UserId = ' . $vIdUser . '
          ORDER BY b.Order'));
}


//----------------------------------------------------------------------------------------------------
function fSendResultMailParent($vParentEmail,
$vParentName,
$vChildName,
$vTestTitle,
$vTestBankTitle, 
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
		
		Your child: \"$vChildName\" has just completed a test: \"$vTestTitle\" in \"$vTestBankTitle\". Here are the results:
		
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



















