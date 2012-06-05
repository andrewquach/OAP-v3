<?php
$vConn = mysqli_connect("localhost", "root", "root", "oap2", 8889);
if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$fp = fopen('sales2.csv', 'w');

$arr = array("Child First Name", "Child Last Name", "Child Gender", "Child Email", "Username", "Relationship", "Parent First Name", "Parent Last Name", "Parent Email", "Purchase Timestamp", "Sale Item Details", "Address");

fputcsv($fp, $arr);


$vResult = mysqli_query($vConn, "Select DISTINCT TransactId, BuyerId, Timestamp From tblSale where status = 1");

while ($row = mysqli_fetch_assoc($vResult))
{
	$transactid =  $row["TransactId"];
	$time = $row["Timestamp"];
	$saleItems = fGetItemList($transactid);
	$rowDetails = fGetAccountDetails($row["BuyerId"]);
	$childFirstName = $rowDetails["ChildFirstName"];
	$childLastName = $rowDetails["ChildLastName"];
	$childEmail = $rowDetails["ChildEmail"];
	$userName = $rowDetails["Username"];
	$gender = $rowDetails["Gender"];
	$relationship = $rowDetails["Relationship"];
	$parentFirstName = $rowDetails["ParentFirstName"];
	$parentLastName = $rowDetails["ParentLastName"];
	$parentEmail = $rowDetails["ParentEmail"];
	$address = $rowDetails["Address"];
	$arr = array($childFirstName,$childLastName,$gender,$childEmail,$userName,$relationship,$parentFirstName,$parentLastName,$parentEmail,$time,$saleItems,$address);
	fputcsv($fp, $arr);
}


//----------------------------------------------------------------------------------------------------
function fGetAccountDetails(
	$vUserId
)
{
	global $vConn;
	
	$vResult1 = mysqli_query($vConn, "Select a.FirstName as ChildFirstName, a.LastName as ChildLastName, a.Email as ChildEmail, a.Username, a.Gender, b.Relationship, b.FirstName as ParentFirstName, b.LastName as ParentLastName, b.Email as ParentEmail, b.Address From tblUser a,tblParent b where a.Id = ".$vUserId." and a.Id = b.ChildId");
	
	$row = mysqli_fetch_assoc($vResult1);
		
	return $row;
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