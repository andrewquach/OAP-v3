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
    case 'SwitchChild':
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
      
   	case 'ListCoursewareDetailParent':
        return Sys_fFetchRows(Sys_fQuery('SELECT b.LevelId, LevelEncode as Level, b.SubjectId, Title, Cover, AssigneeId, Publisher, Author, Subscribed, YEAR(a.EndDate) as Year, MONTH(a.EndDate) as Month, DAY(a.EndDate) as Date 
          	FROM tblItemOwn a, tblCourseware b WHERE a.Type = 3 AND a.ItemId = b.cWId AND a.ItemId = '.$vParams["ItemId"].' AND UserId = '. $vIdUser));
    
    case 'ListCoursewareDetailChild':
        return Sys_fFetchRows(Sys_fQuery('SELECT b.LevelId, LevelEncode as Level, b.SubjectId, Title, Cover, AssigneeId, Publisher, Author, Subscribed, YEAR(a.EndDate) as Year, MONTH(a.EndDate) as Month, DAY(a.EndDate) as Date 
          	FROM tblItemOwn a, tblCourseware b WHERE a.Type = 3 AND a.ItemId = b.cWId AND a.ItemId = '.$vParams["ItemId"].' AND AssigneeId = '. $vIdUser));
          	      
    
    case 'ListCoursewareItems':
      // retrieve all items that belongs to a particular courseware
      $vItems = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT Id, cWId, Title, Type, res
          FROM tblCoursewareItem
            WHERE cWId = ' . $vParams['cWId'] . ' 
                ORDER BY Id'));
	  
	  if ($vRole == 1)
	  {
      	// fetch results of those attempted ones                
      	$vDone = Sys_fFetchRows(  Sys_fQuery('SELECT b.Id, cWId, LastAttempt 
          FROM tblCoursewareItem b, tblCoursewareDone c, tblItemOwn a
            WHERE b.Id = c.cWItemId
              AND c.UserId = a.AssigneeId
              AND a.UserId = '.$vIdUser .'
              AND a.Type = 3
              AND cWId = a.ItemId
              AND cWId = ' . $vParams['cWId']));
	  }
	  
	  else if ($vRole == 2)
	  
	  {
	  	// fetch results of those attempted ones                
      	$vDone = Sys_fFetchRows(  Sys_fQuery('SELECT b.Id, cWId, LastAttempt 
          FROM tblCoursewareItem b, tblCoursewareDone c, tblItemOwn a
            WHERE b.Id = c.cWItemId
              AND c.UserId = a.AssigneeId
              AND a.AssigneeId = '.$vIdUser .'
              AND a.Type = 3
              AND cWId = a.ItemId
              AND cWId = ' . $vParams['cWId'])); 
	  }	
      // combine the results      
      for ($i=0, $ict=count($vItems); $i<$ict; $i++)
      {
      	$vItems[$i]['Unit'] = $i + 1;
        for ($j=0, $jct=count($vDone); $j<$jct; $j++)
          if ($vItems[$i]['Id'] == $vDone[$j]['Id'])
          {
            $vItems[$i]['LastAttempt'] = $vDone[$j]['LastAttempt'];
            break;
          }
      }
      return $vItems;
    
    
    case 'UpdateCoursewareAttempt':
    	// remove past results
    	//return array("Query"=>);
	    Sys_fQuery("DELETE FROM tblCoursewareDone
	        WHERE UserId = $vIdUser and cWItemId = " . $vParams["ItemId"]);
	    Sys_fQuery("INSERT INTO tblCoursewareDone
	        SET UserId = ". $vIdUser . ",
	        	cWItemId = " . $vParams["ItemId"]. ", 
	        	LastAttempt = NOW()");
	    
	    $vRow = Sys_fFetchRows(Sys_fQuery("SELECT Title, cWId FROM tblCoursewareItem
	          	WHERE Id = " . $vParams["ItemId"]));
	      
  		$vItemTitle = $vRow[0]["Title"];
	    
	    $vId = $vRow[0]["cWId"];
	    
	    
	    $vRow = Sys_fFetchRows(Sys_fQuery("SELECT UserId, FirstName, LastName, Subscribed, Email, ItemId FROM tblItemOwn a, tblUser b
	          WHERE a.UserId = b.Id AND a.ItemId = $vId AND Type = 3 AND AssigneeId = ". $vIdUser));
	    
	    $vSubscribed = $vRow[0]["Subscribed"];
	    
	    $vParentEmail = $vRow[0]["Email"];
	      	
  		$vParentName = $vRow[0]["FirstName"]." ".$vRow[0]["LastName"];
  		
  		$vRow = Sys_fFetchRows(Sys_fQuery("SELECT Title FROM tblCourseware
	          	WHERE cWId = " . $vId));
	      
  		$vCoursewareTitle = $vRow[0]["Title"];
  		
  		$vRow = Sys_fFetchRows(Sys_fQuery("SELECT Username FROM tblUser
	          	WHERE Id = $vIdUser"));
	          	
  		$vChildName = $vRow[0]["Username"];
  		
  		if ($vSubscribed)
	    	fSendResultMailParent($vParentEmail, $vParentName, $vChildName, $vCoursewareTitle, $vItemTitle);
	    
    	return array("Success"=>1);
    
    /*
    case 'LastAttemptParent':
    	return Sys_fFetchRows(Sys_fQuery('SELECT LastAttempt
          	FROM tblItemOwn WHERE Type = 3 AND UserId = '. $vIdUser));
    
    case 'LastAttemptChild':
    	return Sys_fFetchRows(Sys_fQuery('SELECT LastAttempt
          	FROM tblItemOwn WHERE Type = 3 AND AssigneeId = '. $vIdUser));
          	
    case 'UpdateLastAttempt':
    	Sys_fQuery("Update tblItemOwn SET LastAttempt = NOW() WHERE Type = 3 AND AssigneeId = ". $vIdUser);
    	return array("Success"=>1);
    */
  }
  return null;
}

//----------------------------------------------------------------------------------------------------
function fSendResultMailParent($vParentEmail, 
$vParentName, 
$vChildName, 
$vCoursewareTitle, 
$vItemTitle
)
{
	$vLatestAttemt = date("d/m/y : H:i:s", time());
	$msg = "
		Dear $vParentName,
		
		Your child: \"$vChildName\" has attempted a courseware at $vLatestAttemt. The detail is below:
		
		Courseware: $vCoursewareTitle
		Part: $vItemTitle

		Best regards,
		Administration
		mcenrich.com";

	mail($vParentEmail, "Your Child has attempted a courseware!", $msg, "From: info@mcenrich.com\r\n");
}


//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>



















