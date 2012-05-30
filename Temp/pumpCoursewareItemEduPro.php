<?php

$vPrice = 10;
$vSeries = 'EduPro';
$file = 'Item.csv';
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
	if ($vRow["Id"] == "")
		break;
	$vQuery = "UPDATE tblCoursewareItem
			   SET Title = '" . mysql_real_escape_string($vRow["Title"]) . "',
				   Type = '" . mysql_real_escape_string($vRow["Type"]) . "',
				   res = 'res/$vSeries/". mysql_real_escape_string($vRow["res"]) ."'
				WHERE Id = ".$vRow["Id"];
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	if (!file_exists("../res/$vSeries/". mysql_real_escape_string($vRow["res"])))
		echo "Please check the path of 'res/$vSeries/". mysql_real_escape_string($vRow["res"]) ."<br/>";
}

fclose($vFp);

//----------------------------------------------------------------------------------------------------
function fExplode(
	$vRow	
)
{
	$vArr = str_getcsv(trim($vRow));

	$vData = array("Id" => $vArr[0],
		"Title" => $vArr[1],
		"Type" => $vArr[2],
		"res" => $vArr[3]
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

























