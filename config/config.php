<?php
ini_set("display_errors",false);
date_default_timezone_set("Asia/Singapore");  // http://www.php.net/manual/en/timezones.php

define("DB_HOST","localhost");
define("DB_NAME","oap3");
define("DB_PORT",3306);
define("DB_USERNAME","root");
define("DB_PASSWORD","root");

define("LANDING_URL","http://www.mcenrich.com");

define("ERROR_LOG_PATH","/Users/mcops/oap/Temp/err.log");

define("PAYPAL_URL","https://www.paypal.com/cgi-bin/webscr");
define("PAYPAL_SUCCESS_URL","http://www.mcenrich.com/");
define("PAYPAL_CANCEL_URL","http://www.mcenrich.com/");
define("PAYPAL_EMAIL_ACCOUNT","cherwahtan@mconline.sg");
define("PAYPAL_NOTIFICATION_URL","http://www.mcenrich.com/Buy/IPN_Paypal.php");
?>