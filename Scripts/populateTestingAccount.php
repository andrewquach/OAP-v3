<?php
require('../1.Core/Sys.php');
require('../Common/Helper.php');
require("../config/config.php");

//$vPrice = 10;
//$vPublisher = "MC Online in collaboration with MediaCorp";
//$vAuthor = "";
//$vFile = "/Users/mcops/oapstaging/oap3/Temp/LuVChinese/P4.csv";

// connect to database
$vConn = mysqli_connect("localhost", "root", "root", "oap3", 8889);

if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

//$vRun = 0;
//$vFp = fopen($vFile, "r");
$vResult = mysqli_query($vConn, 'select * from tblItemOwn where userid = 33 and startdate >= \'2012-05-24\'');

while ($rows = mysqli_fetch_assoc($vResult))
{
	$vQuery = "INSERT INTO tblItemOwn
			   SET UserId = 19,
			   	   ItemId = ".$rows['ItemId'].",
				   LevelId = ".$rows['LevelId'].",
				   SubjectId = ".$rows['SubjectId'].",
				   Type = ".$rows['Type'].",
				   StartDate = '".$rows['StartDate']."',
				   EndDate = '".$rows['EndDate']."',
				   AssigneeId = ".$rows['AssigneeId'].",
				   Subscribed = ".$rows['Subscribed'];
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	$vQuery = "INSERT INTO tblItemOwn
			   SET UserId = 20,
			   	   ItemId = ".$rows['ItemId'].",
				   LevelId = ".$rows['LevelId'].",
				   SubjectId = ".$rows['SubjectId'].",
				   Type = ".$rows['Type'].",
				   StartDate = '".$rows['StartDate']."',
				   EndDate = '".$rows['EndDate']."',
				   AssigneeId = ".$rows['AssigneeId'].",
				   Subscribed = ".$rows['Subscribed'];
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	$vQuery = "INSERT INTO tblItemOwn
			   SET UserId = 34,
			   	   ItemId = ".$rows['ItemId'].",
				   LevelId = ".$rows['LevelId'].",
				   SubjectId = ".$rows['SubjectId'].",
				   Type = ".$rows['Type'].",
				   StartDate = '".$rows['StartDate']."',
				   EndDate = '".$rows['EndDate']."',
				   AssigneeId = ".$rows['AssigneeId'].",
				   Subscribed = ".$rows['Subscribed'];
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
}

//----------------------------------------------------------------------------------------------------
function fCheckLastQuery(
	$vConn,
	$vQuery
)
{
	if (mysqli_errno($vConn) != 0)
		throw new Exception("mysql_err: " . mysqli_error($vConn) . ", query = " . $vQuery);
}


?>

























