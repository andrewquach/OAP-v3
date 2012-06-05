<?php
ini_set("display_errors",false);
date_default_timezone_set("Asia/Singapore");  // http://www.php.net/manual/en/timezones.php

define("DB_HOST","localhost");
define("DB_NAME","oap3");
define("DB_PORT",8889);
define("DB_USERNAME","root");
define("DB_PASSWORD","root");

define("LANDING_URL","http://www.oap.com");

define("ERROR_LOG_PATH","/Users/andrewquach/oap/Temp/err.log");

define("PAYPAL_URL","https://www.sandbox.paypal.com/cgi-bin/webscr");
define("PAYPAL_SUCCESS_URL","http://staging.mcenrich.com/oap3/");
define("PAYPAL_CANCEL_URL","http://staging.mcenrich.com/oap3/");
define("PAYPAL_EMAIL_ACCOUNT","seller_1308037741_biz@gmail.com");
define("PAYPAL_NOTIFICATION_URL","http://staging.mcenrich.com/oap3/Store/IPN_Paypal.php");
?>