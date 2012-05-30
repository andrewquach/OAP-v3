<?php

$vBook = "PMA_QSetter";
$vFile = "/Applications/MAMP/htdocs/oap_staging/Temp/".$vBook."/6.csv";
$vSubjectId = 1;


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
	
	//var_dump($vRow);
	
	// Determine if the Topic exists in Database
	if (! isset($vTopic) || $vTopic != $vRow["Topic"])
	{
		$vTopic = $vRow["Topic"];
		
		$vResult = mysqli_query($vConn, "Select TopicId 
			From tblTopic Where Topic = '" . $vTopic . "'");
		if (mysqli_num_rows($vResult) == 0)
		{
			// Add a new Topic
			$vQuery = "Insert Into tblTopic
				Set SubjectId = " . $vSubjectId . ", 
					Topic = '" . $vTopic . "'";	
			mysqli_query($vConn, $vQuery);
			fCheckLastQuery($vConn, $vQuery);
			$vTopicId = mysqli_insert_id($vConn);
		}
		else
		{
			// Use existing TopicId
			$vData = mysqli_fetch_assoc($vResult);
			$vTopicId = $vData["TopicId"];
		}
	}
	
	$vType = fType($vRow["ResId"]);
	$vLevelId = $vRow["LevelId"];
	//echo $vRes;
	//exit(0);
	
	// Insert qtn into database
	$vQuery = "Insert Into tblQtn
		Set Path = '" . $vRow["Res"] . "',
			LevelId = " . $vLevelId . ", 
			SubjectId = " . $vSubjectId . ",
			DifficultyId = " . (isset($vRow["DifficultyId"]) ? $vRow["DifficultyId"] : 1) . ",
			TopicId = " . $vTopicId . ",
			Type = '" . $vType . "',
			Pool = 0";
	//echo $vQuery;
	//exit(0);
		
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);			
	$vQtnId = mysqli_insert_id($vConn);			
}

fclose($vFp);

//----------------------------------------------------------------------------------------------------
function fExplode(
	$vRow	
)
{
	global $vBook;
	$vArr = explode(",", trim($vRow));

	$vData = array("Book" => $vArr[0],
		"LevelId" => $vArr[1]{1},
		"Level" => $vArr[1],
		"Unit" => $vArr[2],
		"Sub" => $vArr[3],
		"Topic" => $vArr[4],
		"Paper" => str_replace("\"", "", $vArr[5]),
		"Res" => "../res/" . $vBook . "/" . $vArr[1] . "/" . $vArr[6] . ".swf",
		"ResId" => $vArr[6],
		"DifficultyId" => $vArr[7]
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
	return $vItems[count($vItems) - 2];
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

























