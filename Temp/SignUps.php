<?php
$vConn = mysqli_connect("localhost", "root", "root", "oap2", 8889);
if (mysqli_connect_errno() != 0)
	throw new Exception("mysqli_connect() ");

$fp = fopen('signups.csv', 'w');

$arr = array("UserName", "Student First Name", "Student Last Name", "Parent First Name", "Parent Last Name", "Student Email", "Parent Email", "School", "Level", "SignUp Time");

fputcsv($fp, $arr);


$vResult = mysqli_query($vConn, "Select tblUser.Username as Username, tblUser.FirstName as StudentFirstName, tblUser.LastName as StudentLastName, tblParent.FirstName as ParentFirstName, tblParent.LastName as ParentLastName, tblUser.Email as StudentEmail, tblParent.Email as ParentEmail, tblSchool.School as School, tblUser.LevelId  as Level, tblUser.SignUp as SignUpTime From tblUser,tblParent,tblSchool Where tblUser.Id = tblParent.ChildId and tblSchool.SchoolId = tblUser.SchoolId and ((tblUser.Id > 87 and tblUser.Id < 98) or tblUser.Id > 850) Order by tblUser.Signup");

while ($row = mysqli_fetch_assoc($vResult))
{
	$username =  $row["Username"];
	$studentFirstName =  $row["StudentFirstName"];
	$studentLastName =  $row["StudentLastName"];
	$parentFirstName =  $row["ParentFirstName"];
	$parentLastName =  $row["ParentLastName"];
	$studentEmail =  $row["StudentEmail"];
	$parentEmail =  $row["ParentEmail"];
	$school = $row["School"];
	$level = $row["Level"];
	$signUpTime = $row["SignUpTime"];
	$arr = array($username,$studentFirstName,$studentLastName,$parentFirstName,$parentLastName,$studentEmail,$parentEmail,$school,$level,$signUpTime);
	fputcsv($fp, $arr);
}
?>