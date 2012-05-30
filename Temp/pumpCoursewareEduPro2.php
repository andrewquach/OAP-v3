<?php

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

for ($i=1; $i<=60; $i++)
{
	if ($i < 10)
		$str = "0".$i;
	else
		$str = "".$i;
	$vQuery = "INSERT INTO tblItemOwn
			   SET UserId = 138,
			   	   ItemId = ".($i+190).",
				   LevelId = 3,
				   Type = 'Video & Activity',
				   res = 'res/EduPro/EduPro_".$str."_01_VB'";
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	$vQuery = "INSERT INTO tblCoursewareItem
			   SET cWId = ".($i+190).",
				   Title = 'Listening Comprehension',
				   Type = 'Video & Activity',
				   res = 'res/EduPro/EduPro_".$str."_02_LC'";
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	$vQuery = "INSERT INTO tblCoursewareItem
			   SET cWId = ".($i+190).",
				   Title = 'Language Skill Exercises',
				   Type = 'Video & Activity',
				   res = 'res/EduPro/EduPro_".$str."_03_LS'";
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

























