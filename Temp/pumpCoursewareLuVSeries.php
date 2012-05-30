<?php

$vPrice = 10;
$vSeries = 'LuVEnglish';
$file = 'P3P4.csv';
$folder = 'P3P4';
$vPublisher = "MC Online in collaboration with MediaCorp";
$vAuthor = "";
$vFile = "/Users/mcops/oap/Temp/$vSeries/$file";

// connect to database
$vConn = mysqli_connect("localhost", "root", "root", "oap3", 8889);

if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$vRun = 0;
$vFp = fopen($vFile, "r");

$fp = fopen('items.csv', 'w');

$arr = array("Id", "Title", "Type", "res");

fputcsv($fp, $arr);

for ($i=0; !feof($vFp); $i++)
{
	$vRow = fExplode(fgets($vFp));
	//var_dump($vRow);
	//exit(0);
	if ($i == 0)
		continue;
	if ($vRow["cWId"] == "")
		break;
	$vQuery = "UPDATE tblCourseware
			   SET Title = '" . mysql_real_escape_string($vRow["Title"]) . "',
				   Synopsis = '" . mysql_real_escape_string($vRow["Synopsis"]) . "',
				   Overview = '" . mysql_real_escape_string($vRow["Overview"]) . "',
				   Author = '" . mysql_real_escape_string($vAuthor) . "',
				   Publisher = '" . mysql_real_escape_string($vPublisher) . "',
				   Preview = 'res/$vSeries/Preview/". mysql_real_escape_string($vRow["ResourceId"]) .".swf'
				WHERE cWId = ".$vRow["cWId"];
	//echo $vQuery;
	//exit(0);
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	if (!file_exists("../res/$vSeries/Preview/". mysql_real_escape_string($vRow["ResourceId"]) .".swf"))
		echo "Please check the path of 'res/$vSeries/Preview/". mysql_real_escape_string($vRow["ResourceId"]) .".swf'<br/>";
	
	//adding resource item
	$vArr = str_getcsv(trim($vRow["Adding"]));
	
	for ($i=0; $i<count($vArr); $i++)
	{
		if (trim($vArr[$i]) != ""){
			$vTitle = "";
			$vType = "";
			$vRes = "";
			if ($i==0){
				$vTitle = "Full Episode";
				$vType = "Video";	 
			}
			else{
				$vTitle = "Activity ".$i;
				$vType = "Activity";
			}	
			$vRes = "res/$vSeries/$folder/".$vArr[$i];
		
			$vQuery = "INSERT INTO tblCoursewareItem
				   SET cWId = ".$vRow["cWId"].",
				   	   Title = '$vTitle',
				   	   Type = '$vType',
				   	   res =  '$vRes'";
			mysqli_query($vConn, $vQuery);
			fCheckLastQuery($vConn, $vQuery);
			$vId = mysqli_insert_id($vConn);
		
			$arr = array($vId, $vTitle, $vType, $vArr[$i]);
			fputcsv($fp, $arr);
		}
	}
	//end adding resource item 
	//exit(0);
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
		"Overview" => $vArr[3],
		"ResourceId" => $vArr[4],
		"Adding" => $vArr[5]
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

























