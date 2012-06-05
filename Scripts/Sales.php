<?php
$vConn = mysqli_connect("localhost", "root", "root", "oap2", 8889);
if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$fp = fopen('sales.csv', 'w');

$arr = array("Transaction Number", "Salesperson Username", "Customer Username", "Activator Username", "Receipt Number", "Receipt Amount", "Purchase Timestamp", "Sale Item Details");

fputcsv($fp, $arr);


$vResult = mysqli_query($vConn, "Select DISTINCT TransactId, HelperId, BuyerId, Receipt, ReceiptAmt, Timestamp, ActivatorId From tblSale where status = 1");

while ($row = mysqli_fetch_assoc($vResult))
{
	$transactid =  $row["TransactId"];
	$salesPersonUserName =  fGetUserName($row["HelperId"]);
	$customerUserName =  fGetUserName($row["BuyerId"]);
	if ($row["ActivatorId"])
		$activatorUserName =  fGetUserName($row["ActivatorId"]);
	$receiptNumber = $row["Receipt"];
	$receiptAmount = $row["ReceiptAmt"];
	$time = $row["Timestamp"];
	$saleItems = fGetItemList($transactid);
	$arr = array($transactid,$salesPersonUserName,$customerUserName,$activatorUserName,$receiptNumber,$receiptAmount,$time,$saleItems);
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