<?php

$vPrice = 10;
$vSeries = 'EduPro';
$file = 'P5P6.csv';
$vPublisher = "MC Online in collaboration with MediaCorp";
$vAuthor = "";
$vFile = "/Users/mcops/oapstaging/oap3/Temp/$vSeries/$file";

// connect to database
$vConn = mysqli_connect("localhost", "root", "root", "oap_staging", 8889);

if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$vRun = 0;
$vFp = fopen($vFile, "r");

for ($i=0; !feof($vFp); $i++)
{
	$vRow = fExplode(fgets($vFp));
	
	if ($i == 0)
		continue;
	if ($vRow["cWId"] == "")
		break;
	$vQuery = "UPDATE tblCourseware
			   SET Title = '" . mysql_real_escape_string($vRow["Title"]) . "',
				   Synopsis = '" . mysql_real_escape_string($vRow["Synopsis"]) . "',
				   Author = '" . mysql_real_escape_string($vAuthor) . "',
				   Publisher = '" . mysql_real_escape_string($vPublisher) . "',
				   Preview = 'res/$vSeries/Preview/". mysql_real_escape_string($vRow["ResourceId"]) .".swf'
				WHERE cWId = ".$vRow["cWId"];
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	if (!file_exists("../res/$vSeries/Preview/". mysql_real_escape_string($vRow["ResourceId"]) .".swf"))
		echo "Please check the path of 'res/$vSeries/Preview/". mysql_real_escape_string($vRow["ResourceId"]) .".swf'<br/>";
}

fclose($vFp);

//----------------------------------------------------------------------------------------------------
function fExplode(
	$vRow	
)
{
	global $vBook;
	$vArr = str_getcsv(trim($vRow));

	$vData = array("cWId" => $vArr[0],
		"Title" => $vArr[1],
		"Synopsis" => $vArr[2],
		"ResourceId" => $vArr[3]
		);
	
	return $vData;
}

//----------------------------------------------------------------------------------------------------
function fQtnNo(
	$vStr
)
{
	$vItems = explode("_", $vStr);
	$vNo = $vItems[count($vItems) - 2];
	return intval($vNo);
}

//----------------------------------------------------------------------------------------------------
function fType(
	$vStr
)
{
	$vItems = explode("_", $vStr);
	$vItemss = explode(".",$vItems[count($vItems) - 1]);
	return $vItemss[0];
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

























