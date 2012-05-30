<?php
$vConn = mysqli_connect("localhost", "root", "root", "oap_old", 8889);
if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");


$vResult = mysqli_query($vConn, "select username, password, tblUser.firstname as ChildFirstName, tblUser.lastname as ChildLastName, gender, tbluser.email as ChildEmail, schoolid, levelid, signup, tblparent.firstname as FirstName, tblparent.Lastname as lastname, tblParent.email as ParentEmail, relationship, Address  from tbluser, tblparent where tbluser.id = tblparent.ChildId order by tbluser.id");

while ($row = mysqli_fetch_assoc($vResult))
{
	//var_dump($row);exit(0);
	
	mysqli_query("INSERT INTO tblUser 
			SET Username = '" . mysql_real_escape_string($vParams["UserId"]) . "', 
				Password = '" . mysql_real_escape_string($vParams["Password"]) . "',
				FirstName = '" . mysql_real_escape_string($vParams["StudentFirst"]) . "',
				LastName = '" . mysql_real_escape_string($vParams["StudentLast"]) . "',
				Gender = '" . $vParams["Gender"] . "',
				Email = '" . mysql_real_escape_string($vParams["StudentEmail"]) . "',
				SchoolId = " . $vParams["School"] . ",
				LevelId = " . $vParams["Level"] . ",
				NewsNPromo = " . $vParams["NewsNPromo"]);
		$vUserId = Sys_fGetInsertId();
		if ($vUserId == 0)
			return array("Success" => 0, "Err" => "Unknown error.");
}
?>