<?php
try{
	$to = "andrewquach@mconline.sg";
	$subject = "Test mail";
	$message = "Hello! This is a simple email message.";
	$from = "info@mconline.sg";
	$headers = "From:" . $from;
	mail($to,$subject,$message,$headers);
	echo "Mail Sent.";
}
catch (Exception $e)
{
	echo $e->getMessage();
}
?>