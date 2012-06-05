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

	$vQuery = "UPDATE tblBundle SET Title = '戏说华文 Bundle A' WHERE BundleId = 100001";
	
	
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	$vQuery = "UPDATE tblBundle SET Title = '戏说华文 Bundle B' WHERE BundleId = 100002";
	
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	$vQuery = "UPDATE tblBundle SET Title = '戏说华文 Bundle C' WHERE BundleId = 100003";
	
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);
	
	$vOverview = "《戏说华文》是一套融合新传媒特制短片与华文教学活动的华语教学资源。这套资源涵盖三个级别，即低年纪小一、小二，中年纪小三、小四与高年纪小五、小六。每个级别分别提供二十部主题明确的短片，而每部短片各有三项教学活动，以提升孩子的华文听说能力。短片内容诙谐生动、教学活动多元丰富，让孩子轻松愉快地学习华文华语！<br/> Developed in collaboration with MediaCorp, 《戏说华文》is a series of Chinese education resources integrating specially-produced videos and enjoyable learning activities. It comprises of three levels of resources: Elementary covers content for Primary 1 and 2, Intermediate caters to Primary 3 and 4, while Advanced level activities are for students in Primary 5 and 6. Each of the 20 short themed episodes in each level is accompanied by three activities that are designed to enhance children’s Mandarin speaking and listening skills. The lively videos with witty dialogue, coupled with the rich and diverse activities, allow children to learn Chinese in a fun and relaxed way.";
	
	$vQuery = "UPDATE tblBundle SET Overview = '$vOverview'";
	
	//echo $vQuery;
	mysqli_query($vConn, $vQuery);
	fCheckLastQuery($vConn, $vQuery);


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

























