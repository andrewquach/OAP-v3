<?php
$vConn = mysqli_connect("localhost", "root", "root", "oap_staging", 8889);
if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$fp = fopen('items.csv', 'w');

$arr = array("Book Title", "Price");

fputcsv($fp, $arr);


$vResult = mysqli_query($vConn, "SELECT Title, Price FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 GROUP BY BookId ORDER BY BookId");

while ($row = mysqli_fetch_assoc($vResult))
{
	$title =  $row["Title"];
	$price = $row["Price"];
	$arr = array($title,$price);
	fputcsv($fp, $arr);
}


//----------------------------------------------------------------------------------------------------
function fGetUserName(
	$vUserId
)
{
	global $vConn;
	
	$vResult1 = mysqli_query($vConn, "Select Username From tblUser where Id = ".$vUserId);
	
	$row = mysqli_fetch_assoc($vResult1);
	
	$vUserName = $row["Username"];
		
	return $vUserName;
}

//----------------------------------------------------------------------------------------------------
function fGetItemList(
	$vTransactId
)
{
	global $vConn;
	
	$first = true;
	
	$vItemList = "";
	
	$vQuery = "Select tblForSale.Desc as Description From tblSale, tblForSale where TransactId = '".$vTransactId . "' and tblSale.ItemId = tblForSale.Id";
	
	//echo $vQuery;
	
	//exit(0);
	
	$vResult2 = mysqli_query($vConn, $vQuery);
	
	
	
	while ($row = mysqli_fetch_assoc($vResult2))
	{
		if ($first)
			$vItemList .= $row["Description"];
		else
			$vItemList .= "; ".$row["Description"];
			
		$first = false;
	}
		
	return $vItemList;
}

?>