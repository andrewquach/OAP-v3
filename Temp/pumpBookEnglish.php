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

$vPrice = 6.12;
$vBook = "PEL_MPHEnglishGrammarTests";
$vPublisher = "Marshall Cavendish Education";
$vAuthor = "Loh Tee Yang";
$vBookNo = "6";
$vFile = "/Users/mcops/oap/Temp/".$vBook."/$vBookNo.csv";
$vSubjectId = 3;
$vLevelId = 6;

// connect to database
$vConn = mysqli_connect("localhost", "root", "root", "oap3", 8889);
if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$vRun = 0;
$vFp = fopen($vFile, "r");

for ($i=0; !feof($vFp); $i++)
{
	$vRow = fExplode(fgets($vFp));
	
	if ($i == 0)
		continue;
	
	//var_dump($vRow); exit(0);
		
	// Determine if it is a different book
	
	if ($i == 1)
	{
		// We are starting a new level (e.g. P1, P2)
		//$vLevelId = $vRow["LevelId"];
		
		// Insert a new book 
		$vQuery = "Insert Into tblBook
			SELECT Max(BookId) + 1,
				'" . $vRow["Book"] . "',
				'" . $vAuthor . "', 
				'" . $vPublisher . "',
				$vLevelId, 
				" . $vSubjectId . ", 
				'../res/" . $vBook . "/Cover/P$vBookNo.png', 
				" . $vPrice.",'','',1,$vLevelId
				FROM tblBook";
		//file_put_contents("/Library/WebServer/Documents/log/php.log", "query = " . $vQuery . "\r", FILE_APPEND);
		//echo $vQuery;
		mysqli_query($vConn, $vQuery);
		fCheckLastQuery($vConn, $vQuery);
		
		$vResult = mysqli_query($vConn, "SELECT Max(BookId) as MaxId FROM tblBook");
		$row = mysqli_fetch_assoc($vResult);
		$vBookId = $row["MaxId"];
				
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
	
	// Determine if this is a new Test
	if (! isset($vUnit) || $vUnit != $vRow["Unit"])
	{
		$vUnit = $vRow["Unit"];
		$vRun = 0;
		
		$vPaper = (mysql_real_escape_string($vRow["Paper"]) != '')?mysql_real_escape_string($vRow["Paper"]):$vRow["Paper"];
		
		// Adds a new Test
		$vQuery = "Insert Into tblTest
			Set BookId = " . $vBookId . ", 
				Title = '" . $vPaper . "',
				Unit = '" . $vRow["Unit"] . "',
				Type = 'Test', 
				SubjectId = " . $vSubjectId . ",
				LevelId = $vLevelId";
		//echo $vQuery; exit(0);		
		mysqli_query($vConn, $vQuery);
		fCheckLastQuery($vConn, $vQuery);
		$vTestId = mysqli_insert_id($vConn);
		echo "Test ".$vPaper." inserted! <br/>";
	}
	$vRun++;

	
	$vRes = "NG";
	
	//echo $vRes;
	//exit(0);
	
	// Insert qtn into database	
	$vQuery = "Insert Into tblQtn
		SELECT Max(QtnId) + 1,
		'" . $vRow["Res"] . "',
		$vLevelId, 
		" . $vSubjectId . ",
		" . (isset($vRow["DifficultyId"]) ? $vRow["DifficultyId"] : 1) . ",
		" . $vTopicId . ",
		'" . $vRes . "',
		1 FROM tblQtn";
	
	
	//echo $vQuery;
	//exit(0);
		
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);			
	//$vQtnId = mysqli_insert_id($vConn);
	
	echo "Question ".$vRow["Res"]." inserted! <br/>";
	
	$vResult = mysqli_query($vConn, "SELECT Max(QtnId) as MaxId FROM tblQtn");
	$row = mysqli_fetch_assoc($vResult);
	$vQtnId = $row["MaxId"];
	
	// Insert qtn-order of a test into database
	$vQuery = "Insert Into tblQtnGrp
		Set TestId = " . $vTestId . ",
			QtnId = " . $vQtnId . ",
			tblQtnGrp.Order = " . $vRun;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);		
}

fclose($vFp);

//----------------------------------------------------------------------------------------------------
function fExplode(
	$vRow	
)
{
	global $vBook,$vBookNo;
	//$vArr = explode(",", trim($vRow));
	$vArr = str_getcsv(trim($vRow));

	$vData = array("Book" => $vArr[0],
		"LevelId" => $vArr[1]{1},
		"Level" => $vArr[1],
		"Unit" => $vArr[2],
		"Sub" => $vArr[3],
		"Topic" => $vArr[4],
		"Paper" => str_replace("\"", "", $vArr[5]),
		"Res" => "../res/" . $vBook . "/P$vBookNo/" . $vArr[6] . ".swf",
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
	$vItemss = explode(".",$vItems[count($vItems) - 2]);
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

























