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
	case "FetchTransact":
		return Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT a.TransactId 
        FROM tblSale a WHERE a.BuyerId is NULL'));
        
    case 'Activate':
      $vQuery = Sys_fQuery('SELECT Id 
        FROM tblUser 
          WHERE Role = 1 AND
          Username = \'' . $vParams['CustUsername'] . '\'');
      $vUser = Sys_fFetchRows($vQuery);
      if (count($vUser) == 0)
        return array('success' => '0', 'msg' => 'Parent Account does not exist in our database.');
	  
	  $customerId = $vUser[0]['Id'];
	  
	  $vQuery = Sys_fQuery('SELECT Id 
        FROM tblUser 
          WHERE Username = \'' . $vParams['SalesRepUsername'] . '\'');
      $vUser = Sys_fFetchRows($vQuery);
      if (count($vUser) == 0)
        return array('success' => '0', 'msg' => 'Sales Rep does not exist in our database.');
	  
	  $salesRepId = $vUser[0]['Id'];
	  	
      // complete the transaction
      Sys_fQuery('UPDATE tblSale 
        SET BuyerId = ' . $customerId . ', 
          STATUS = 1, 
          Receipt = \'' . $vParams['Receipt'] . '\',
          ReceiptAmt = \'' . $vParams['ReceiptAmt'] . '\',
          ActivatorId = ' . $salesRepId . '
            WHERE TransactId = \'' . $vParams['TransactId'] . '\'');
      if (Sys_fGetAffectedRows() == 0)
        return array('success' => '0', 'msg' => 'Error in updating transaction.');
        
      // update usage permissions to reflect purchases
      $vRows = Sys_fFetchRows(Sys_fQuery('SELECT a.Type, a.LevelId, b.SubjectId, a.ItemId, a.ChildId, a.Subscription 
        FROM tblSale a, tblForSale b
          WHERE a.ItemId = b.Id AND TransactId = \'' . $vParams['TransactId'] . '\''));
      for ($i=0, $ct=count($vRows); $i<$ct; $i++)
      {
      		if ($vRows[$i]['Type'] == 4){
				$vRows1 = Sys_fFetchRows(Sys_fQuery('(SELECT BookId as ItemId, a.LevelId, a.SubjectId, 1 as Type
          FROM tblBook a, tblBundleItem b WHERE a.BookId =  b.ItemId AND b.BundleId = '.$vRows[$i]['ItemId'].' GROUP BY ItemId) 
          
          UNION
          
          (SELECT TestBankId as ItemId, a.LevelId, a.SubjectId, 2 as Type
          FROM tblTestBank a, tblBundleItem b WHERE a.TestBankId =  b.ItemId AND b.BundleId = '.$vRows[$i]['ItemId'].' GROUP BY ItemId) 
          	
          UNION
          
          (SELECT cWId as ItemId, a.LevelId, a.SubjectId, 3 as Type
          FROM tblCourseware a, tblBundleItem b WHERE a.cWId =  b.ItemId AND b.BundleId = '.$vRows[$i]['ItemId'].' GROUP BY ItemId)'));
			
				 for ($j=0, $ct1=count($vRows1); $j<$ct1; $j++)
     			 {
     			 	Sys_fQuery('INSERT INTO tblItemOwn ' .
        			'SET UserId = ' . $customerId . ', ' .
        			'ItemId = ' . $vRows1[$j]['ItemId'] . ', ' . 
        			'SubjectId = ' . $vRows1[$j]['SubjectId'] . ', ' . 
        			'LevelId = ' . $vRows1[$j]['LevelId'] . ', ' .
        			'Type = ' . $vRows1[$j]['Type'] . ', ' .
        			'AssigneeId = ' . $vRows[$i]['ChildId'] . ', ' .
        			'StartDate = NOW(),
        			EndDate = DATE(NOW()) + INTERVAL '. $vRows[$i]['Subscription'] .' MONTH + INTERVAL 1 DAY - INTERVAL 1 SECOND');
            		if (Sys_fGetAffectedRows() == 0)
        				return array('success' => '0', 'msg' => 'Error in activating contents.');
     			 }
			
			}
        	
        	
      			Sys_fQuery('INSERT INTO tblItemOwn ' .
        			'SET UserId = ' . $customerId . ', ' .
        			'ItemId = ' . $vRows[$i]['ItemId'] . ', ' . 
        			'SubjectId = ' . $vRows[$i]['SubjectId'] . ', ' . 
        			'LevelId = ' . $vRows[$i]['LevelId'] . ', ' .
        			'Type = ' . $vRows[$i]['Type'] . ', ' .
        			'AssigneeId = ' . $vRows[$i]['ChildId'] . ', ' .
        			'StartDate = NOW(),
        			EndDate = DATE(NOW()) + INTERVAL '. $vRows[$i]['Subscription'] .' MONTH + INTERVAL 1 DAY - INTERVAL 1 SECOND');
            	if (Sys_fGetAffectedRows() == 0)
        			return array('success' => '0', 'msg' => 'Error in activating contents.');
        	
      }
      return array('success' => '1');    
    

	case "Register":
		// check if username is already in use
		$vRows = Sys_fFetchRows(Sys_fQuery("SELECT * FROM tblUser
			WHERE Username = '" . $vParams["UserId"] . "'"));
		if (count($vRows) != 0)
			return array("Success" => 0, "Err" => "Username is in use.");
		// add user
		Sys_fQuery("INSERT INTO tblUser 
			SET Username = '" . mysql_real_escape_string($vParams["UserId"]) . "', 
				Password = '" . mysql_real_escape_string($vParams["Password"]) . "',
				FirstName = '" . mysql_real_escape_string($vParams["ParentFirst"]) . "',
				LastName = '" . mysql_real_escape_string($vParams["ParentLast"]) . "',
				Email = '" . mysql_real_escape_string($vParams["ParentEmail"]) . "',
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