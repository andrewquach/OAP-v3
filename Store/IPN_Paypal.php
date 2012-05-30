<?php

require("../config/config.php");

// access request variables
$custom = $_POST['custom'];
$parts = explode(';', $custom);

// exit if no paras (something is wrong)
if (count($parts) == 0)
{
	//fLog('no custom data; exiting.');
	return;
}

// open database
$conn = mysqli_connect(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

// update database to say this sale is completed
mysqli_query($conn, 'UPDATE tblSale SET BuyerId = ' . $parts[0] . ', STATUS = 1, ' .
      'Receipt  = \'' . $_POST['txn_id'] . '\', ' .
      'ReceiptAmt = ' . $_POST['mc_gross'] .
      'WHERE TransactId = \'' . $parts[1] . '\'');
      
// translate the sale items into actual usage permissions
$result = mysqli_query($conn, 'SELECT a.Id, a.Type, b.LevelId, SubjectId, ChildId, b.Subscription ' .
  'FROM tblForSale a, tblSale b ' .
  'WHERE TransactId = \'' . $parts[1] . '\' AND ' .
  'a.Id = b.ItemId');

while ($row = mysqli_fetch_assoc($result))
{
	if ($row['Type'] == 4){
		$result1 = mysqli_query($conn,'(SELECT BookId as ItemId, a.LevelId, a.SubjectId, 1 as Type
          FROM tblBook a, tblBundleItem b WHERE a.BookId =  b.ItemId AND b.BundleId = '.$row['Id'].' GROUP BY ItemId) 
          
          UNION
          
          (SELECT TestBankId as ItemId, a.LevelId, a.SubjectId, 2 as Type
          FROM tblTestBank a, tblBundleItem b WHERE a.TestBankId =  b.ItemId AND b.BundleId = '.$row['Id'].' GROUP BY ItemId) 
          	
          UNION
          
          (SELECT cWId as ItemId, a.LevelId, a.SubjectId, 3 as Type
          FROM tblCourseware a, tblBundleItem b WHERE a.cWId =  b.ItemId AND b.BundleId = '.$row['Id'].' GROUP BY ItemId)');
          
          while ($row1 = mysqli_fetch_assoc($result1))
          {
          	mysqli_query($conn, 'INSERT INTO tblItemOwn ' .
        		'SET UserId = ' . $parts[0] . ', ' .
        		'ItemId = ' . $row1['ItemId'] . ', ' . 
        		'SubjectId = ' . $row1['SubjectId'] . ', ' . 
        		'LevelId = ' . $row1['LevelId'] . ', ' .
        		'Type = ' . $row1['Type'] . ', ' .
        		'AssigneeId = ' . $row['ChildId'] . ', ' .
        		'StartDate = NOW(),
        		EndDate = DATE(NOW()) + INTERVAL '. $row['Subscription'] .' MONTH + INTERVAL 1 DAY - INTERVAL 1 SECOND');
          }
	}
	
		
      mysqli_query($conn, 'INSERT INTO tblItemOwn ' .
        'SET UserId = ' . $parts[0] . ', ' .
        'ItemId = ' . $row['Id'] . ', ' . 
        'SubjectId = ' . $row['SubjectId'] . ', ' . 
        'LevelId = ' . $row['LevelId'] . ', ' .
        'Type = ' . $row['Type'] . ', ' .
        'AssigneeId = ' . $row['ChildId'] . ', ' .
        'StartDate = NOW(),
        EndDate = DATE(NOW()) + INTERVAL '. $row['Subscription'] .' MONTH + INTERVAL 1 DAY - INTERVAL 1 SECOND');
    
}
mysqli_free_result($result);
mysqli_close($conn);



//----------------------------------------------------------------------------------------------------
function fLog(
  $vData
)
{

  file_put_contents(ERROR_LOG_PATH, 
    is_array($vData) ? print_r($vData, true) : $vData . "\r\n", FILE_APPEND);
}

?>