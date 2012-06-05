<?php
$vConn = mysqli_connect("localhost", "root", "root", "oap3", 8889);
if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$fullPath = "/Users/andrewquach/oap/res/";

$vResult = mysqli_query($vConn, "Select Path,QtnId From tblQtn");

while ($row = mysqli_fetch_assoc($vResult))
{
	$path =  $row["Path"];
	$path =  $fullPath.$path;
	if(!file_exists($path))
	{
		echo $row["QtnId"].",".$row["Path"]."</br>";
	}
	
}
?>