<?php

// constants
/*
$vBook = "PMA_DiscoverMaths";
$vFile = "/DiscoverMaths.txt";
$vPublisher = "Marshall Cavendish Education";
$vSubjectId = 1;
*/
/*
$vBook = "PEL_GrammarPractice";
$vFile = "/PEL_Grammar.txt";
$vPublisher = "Marshall Cavendish Education";
$vSubjectId = 2;
*/
// $vDifficultyId = 1;
// $vPrice = 9.99;

$vBook = "QSetter";
$vFile = "/Users/andrewquach/oap/Temp/2.csv";
$vSubjectId = 1;
$vPool = 1;


// connect to database
$vConn = mysqli_connect("localhost", "root", "root", "oap", 8889);
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
		
	// Determine if it is a different book
	if (! isset($vLevelId) || $vLevelId != $vRow["LevelId"])
	{
		// We are starting a new level (e.g. P1, P2)
		$vLevelId = $vRow["LevelId"];
		
		if (! $vPool)
		{
			// Insert a new book for the new level
			// $vPublisher = "EPB";
			$vQuery = "Insert Into tblBook
				Set Title = '" . $vRow["Book"] . "', 
					Publisher = '" . $vPublisher . "', 
					LevelId = " . $vLevelId . ", 
					SubjectId = " . $vSubjectId . ", 
					Cover = '../res/" . $vBook . "/Cover/" . $vRow["Level"] . ".jpg', 
					Price = " . $vPrice;
			file_put_contents("/Library/WebServer/Documents/log/php.log", "query = " . $vQuery . "\r", FILE_APPEND);
			mysqli_query($vConn, $vQuery);
			fCheckLastQuery($vConn, $vQuery);		
			$vBookId = mysqli_insert_id($vConn);		
		}
		else
			$vBookId = "NULL";
	}

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
	
	if (! $vPool)
	{
		// Determine if this is a new Test
		if (! isset($vUnit) || $vUnit != $vRow["Unit"])
		{
			$vUnit = $vRow["Unit"];
			$vRun = 0;
		
			// Adds a new Test
			$vQuery = "Insert Into tblTest
				Set BookId = " . $vBookId . ", 
					Title = '" . mysql_real_escape_string($vRow["Paper"]) . "',
					Unit = '" . $vRow["Unit"] . "',
					Type = 'Test', 
					SubjectId = " . $vSubjectId . ",
					LevelId = " . $vLevelId;
			mysqli_query($vConn, $vQuery);
			fCheckLastQuery($vConn, $vQuery);
			$vTestId = mysqli_insert_id($vConn);
		}
		$vRun++;
	}
	
	$vRes = fType($vRow["Res"]);
	
	//echo $vRes;
	//exit(0);
	
	// Insert qtn into database
	$vQuery = "Insert Into tblQtn
		Set Path = '" . $vRow["Res"] . "',
			LevelId = " . $vLevelId . ", 
			SubjectId = " . $vSubjectId . ",
			DifficultyId = " . (isset($vRow["DifficultyId"]) ? $vRow["DifficultyId"] : 1) . ",
			TopicId = " . $vTopicId . ",
			Type = '" . $vRes . "',
			Pool = " . ($vPool?"0":"1");
		
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);			
	$vQtnId = mysqli_insert_id($vConn);
	
	if (! $vPool)
	{
		// Insert qtn-order of a test into database
		$vQuery = "Insert Into tblQtnGrp
			Set TestId = " . $vTestId . ",
				QtnId = " . $vQtnId . ",
				tblQtnGrp.Order = " . $vRun;
		mysqli_query($vConn, $vQuery);
		fCheckLastQuery($vConn, $vQuery);
	}				
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
		"Type" => $vArr[6],
		"Res" => "../res/" . $vBook . "/" . $vArr[1] . "/" . $vArr[7] . ".swf",
		"DifficultyId" => $vArr[8]
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

























