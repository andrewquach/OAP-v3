<?php
$vConn = mysqli_connect("localhost", "root", "root", "oap3", 8889);
if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$fp = fopen('sales3.csv', 'w');

$arr = array("Transaction Number", "Receipt Number", "Parent User Name", "Parent Email", "Product Item", "Product Type", "Product Series", "Item Price", "Receipt Amount", "Date of Purchase", "Expiry Date");

fputcsv($fp, $arr);


$vResult = mysqli_query($vConn, "Select TransactId, Receipt, BuyerId, ItemId, ReceiptAmt, DATE(Timestamp) as DateOfPurchase from tblSale where status = 1 ORDER by DateOfPurchase, TransactId, ItemId");

while ($row = mysqli_fetch_assoc($vResult))
{
	$transactid =  $row["TransactId"];
	$receipt = $row["Receipt"];
	$receiptAmt = $row["ReceiptAmt"];
	$dateOfPurchase = fFormatDate($row["DateOfPurchase"]);
	$itemDetails = fGetItemDetails($row["ItemId"],$row["BuyerId"]);
	$accountDetails = fGetAccountDetails($row["BuyerId"]);
	$parentUserName = $accountDetails["username"];
	$parentEmail = $accountDetails["email"];
	$item = $itemDetails["Title"];
	$price = $itemDetails["Price"];
	$type = $itemDetails["Type"];
	if ($type == "Courseware")
	{
		if ($itemDetails["SeriesId"] == 3)
			$series = "戏说华文";
		else if ($itemDetails["SeriesId"] == 2)
			$series = "乐学华文";
		else if ($itemDetails["SeriesId"] == 2)
			$series = "LuVEnglish";
	}
	else if ($type == "Bundle")
	{
		$series = "戏说华文";
		$type = "Courseware";
	}
	else
		$series = "";
	$expirydate = fFormatDate($itemDetails["Expiry"]);
	$arr = array($transactid,$receipt,$parentUserName,$parentEmail,$item,$type,$series,$price,$receiptAmt,$dateOfPurchase,$expirydate);
	fputcsv($fp, $arr);
}


//----------------------------------------------------------------------------------------------------
function fGetAccountDetails(
	$vUserId
)
{
	global $vConn;
	
	$vResult1 = mysqli_query($vConn, "Select username, email From tblUser where Id = ".$vUserId);
	
	$row = mysqli_fetch_assoc($vResult1);
		
	return $row;
}

//----------------------------------------------------------------------------------------------------
function fGetItemDetails(
	$vItemId,$vUserId
)
{
	global $vConn;
	
	if ($vItemId <= 100){
		$vQuery = "Select DISTINCT b.Title, DATE(a.EndDate) as Expiry, Price, 'TestBank' as Type From tblItemOwn a, tblTestBank b where b.TestBankId = $vItemId AND a.ItemId = $vItemId AND a.UserId = $vUserId";
		$vResult2 = mysqli_query($vConn, $vQuery);
		$row = mysqli_fetch_assoc($vResult2);
		return $row;
	}
	
	else if ($vItemId > 100 && $vItemId <= 9000){
		$vQuery = "Select DISTINCT b.Title, DATE(a.EndDate) as Expiry, Price, 'Courseware' as Type, SeriesId  From tblItemOwn a, tblCourseware b where b.cWId = $vItemId AND a.ItemId = $vItemId AND a.UserId = $vUserId";
		$vResult2 = mysqli_query($vConn, $vQuery);
		$row = mysqli_fetch_assoc($vResult2);
		return $row;
	}
	else if ($vItemId > 9000 && $vItemId <= 100000){
		$vQuery = "Select DISTINCT b.Title, DATE(a.EndDate) as Expiry, Price, 'Book' as Type From tblItemOwn a, tblBook b where b.BookId = $vItemId AND a.ItemId = $vItemId AND a.UserId = $vUserId";
		$vResult2 = mysqli_query($vConn, $vQuery);
		$row = mysqli_fetch_assoc($vResult2);
		return $row;
	}
	
	else{
		$vQuery = "Select DISTINCT b.Title, DATE(a.EndDate) as Expiry, Price, 'Bundle' as Type From tblItemOwn a, tblBundle b where b.BundleId = $vItemId AND a.ItemId = $vItemId AND a.UserId = $vUserId";
		$vResult2 = mysqli_query($vConn, $vQuery);
		$row = mysqli_fetch_assoc($vResult2);
		return $row;
	}  
	
	
}

//----------------------------------------------------------------------------------------------------
function fFormatDate(
	$vDateString
)
{
	$date = new DateTime($vDateString);
	return $date->format('M d, Y');
}


?>