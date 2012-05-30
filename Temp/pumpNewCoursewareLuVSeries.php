<?php
require('../1.Core/Sys.php');
require('../Common/Helper.php');
require("../config/config.php");

//$vPrice = 10;
//$vPublisher = "MC Online in collaboration with MediaCorp";
//$vAuthor = "";
//$vFile = "/Users/mcops/oapstaging/oap3/Temp/LuVChinese/P4.csv";

// connect to database
$vConn = mysqli_connect("localhost", "root", "root", "oap_staging", 8889);

if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

//$vRun = 0;
//$vFp = fopen($vFile, "r");

for ($i=27; $i<=51; $i++)
{
	$vId = 290 + $i;
	$vTitle = "Ep ".$i;
	if ($i<10)
		$vCover = "../res/LuVChinese/Cover/P6/0".$i.".jpg";
	else
		$vCover = "../res/LuVChinese/Cover/P6/".$i.".jpg";
		
	$vQuery = "INSERT INTO tblCourseware
			   SET cWId = $vId,
			   	   Title = '".$vTitle."',
				   LevelId = 6,
				   SubjectId = 3,
				   Cover = '$vCover',
				   Price = 3,
				   Featured = 1,
				   SeriesId = 2";
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

























