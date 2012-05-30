<?php
//----------------------------------------------------------------------------------------------------
//	1.Core/Sys.php
//----------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------
//	constants.
//----------------------------------------------------------------------------------------------------
define("Sys_kErrDuplicateEntry", 1062);

define("Sys_kErrUnauthorized", "Unauthorized");
define("Sys_kErrExpired", "Expired");
define("Sys_kErrInvalidUserIdOrPassword", "Invalid User ID or Password. Please try again.");
define("Sys_kErrAgentLogin", "This account is not Agent Account. <br>Please contact System Administrator.");
define("Sys_kErrAlreadyLogin", "User is already logged in.");
define("Sys_kErrInvalidPassword", "Invalid Password.<br>Please try again.");

define("Sys_kSeed", "seed");

//----------------------------------------------------------------------------------------------------
//	public variables.
//----------------------------------------------------------------------------------------------------
$Sys_gCookies = array();					//	(object) persist across pages and requests to servers

//----------------------------------------------------------------------------------------------------
//	private variables.
//----------------------------------------------------------------------------------------------------
$Sys_xDb = FALSE;							//	(object) database connection
$Sys_xTime = 0;								//	(int) time of current request
$Sys_xCheckSum = 0;							//	(int) checksum for current request

//----------------------------------------------------------------------------------------------------
//	output debug string.
//----------------------------------------------------------------------------------------------------
function fDbg(								//	(void)
	$s										//	(string)
)
{
	$vLogFileName = array(
		"C:\\Documents and Settings\\Administrator\\Application Data\\Macromedia\\Flash Player\\Logs\\flashlog.txt",
		"C:\\Users\\engleok\\AppData\\Roaming\\Macromedia\\Flash Player\\Logs\\flashlog.txt",
		"C:\\Users\\Eng Leok\\AppData\\Roaming\\Macromedia\\Flash Player\\Logs\\flashlog.txt",
		"/Library/WebServer/Documents/log/php.log"
	);

	for ($i = 0; $i < count($vLogFileName); $i++)
		if (file_exists($vLogFileName[$i]))
		{
			file_put_contents($vLogFileName[$i], "PHP: " . $s . "\r", FILE_APPEND);
			break;
		}
}

//----------------------------------------------------------------------------------------------------
//	run.
//	expect Page_fDo()
//----------------------------------------------------------------------------------------------------
function Sys_fRun(							//	(void)
	$vHost,									//	(string)
	$vUser,									//	(string)
	$vPassword,								//	(string)
	$vDatabase								//	(string)
)
{
	global $Sys_gCookies, $Sys_xDb, $Sys_xTime, $Sys_xCheckSum;

	$vNow = time();

	$vLastRequest = 0;
	if (isset($_POST["xSubmit"]))
	{
		$vQuery = unserialize($_POST["xSubmit"]);
fDbg("SUBMIT");
		$vQuery["Params"] = array();
		foreach($_POST as $vKey => $vValue)
			if ($vKey != "xSubmit")
				$vQuery["Params"][$vKey] = $vValue;
	}
	else if ($_SERVER["REQUEST_METHOD"] == "GET")
	{
		$vHeaders = getallheaders();
		if (strlen($vHeaders["If-Modified-Since"]) > 0)
			$vLastRequest = strtotime($vHeaders["If-Modified-Since"]);
		$vQuery = urldecode($_SERVER["QUERY_STRING"]);
fDbg("GET $vQuery");
		$vQuery = unserialize($vQuery);
		if (!is_array($vQuery))
			throw new Exception("invalid input", 0);
	}
	else
	{
		$vQuery = file_get_contents("php://input");
fDbg("POST $vQuery");
		$vQuery = unserialize($vQuery);
		if (!is_array($vQuery))
			throw new Exception("invalid input", 0);
	}

	$Sys_xTime = $vQuery["Time"];
	$Sys_xCheckSum = $vQuery["CheckSum"];
	$Sys_gCookies = $vQuery["Cookies"];

	$vHasSessionId = isset($Sys_gCookies["xIdSession"]);
	
	$Sys_xDb = mysqli_connect($vHost, $vUser, $vPassword);
	if (mysqli_connect_errno() != 0)
		throw new Exception("mysqli_connect() " . mysqli_connect_errno($Sys_xDb) . ", " . mysqli_connect_error($Sys_xDb), mysqli_connect_errno($Sys_xDb));
		
	mysqli_select_db($Sys_xDb, $vDatabase);
	if (mysqli_errno($Sys_xDb) != 0)
		throw new Exception("mysqli_select_db() " . mysqli_errno($Sys_xDb) . ", " . mysqli_error($Sys_xDb), mysqli_errno($Sys_xDb));

//sleep(1);
	try
	{
		$vError = null;
		$vData = Page_fDo($vQuery["Op"], $vQuery["Params"], $vLastRequest);
	}
	catch (Exception $e)
	{
		if ($e->getCode() != 0)
			throw $e;
		$vError = $e->getMessage();
		$vData = null;
	}
	
	mysqli_close($Sys_xDb);
	$Sys_xDb = FALSE;

	if (!$vHasSessionId && isset($Sys_gCookies["xIdSession"]))
		$Sys_gCookies["xDeltaTime"] = $vNow - $Sys_xTime;
	
	if (($vError == null) && ($vLastRequest != 0) && ($vData == null))
	{
		header("HTTP/1.1 304 Not Modified");
		fDbg("OUT: 304 Not Modified");
	}
	else
	{
		$vLastModified = date('r', time());
		header("Last-Modified: $vLastModified");
		header("Expires: $vLastModified");
		header("Cache-Conrol: must-revalidate");
		$vResponse = serialize(array(Cookies => $Sys_gCookies, Error => $vError, Data => $vData));
		file_put_contents("php://output", $vResponse);
fDbg("OUT $vResponse");
	}
}

//----------------------------------------------------------------------------------------------------
//	form condition.
//----------------------------------------------------------------------------------------------------
function Sys_fCondition(					// 	(*)
	$vParams,								//	(*)	parameters
	$vFieldList,							//	(array) list of fields to use
	$vOpList								//	(array) corresponding operation to use
)
{
	$vCond = array();
	for ($i = 0; $i < sizeof($vFieldList); $i++)
		if (isset($vParams[$vFieldList[$i]]))
			switch ($vOpList[$i])
			{
			case "LIKE":
				if (strlen($vParams[$vFieldList[$i]]) > 0)
					array_push($vCond, "({$vFieldList[$i]} LIKE '%{$vParams[$vFieldList[$i]]}%')");
				break;
			default:
				if (is_string($vParams[$vFieldList[$i]]))
					array_push($vCond, "({$vFieldList[$i]} {$vOpList[$i]} '{$vParams[$vFieldList[$i]]}')");
				else
					array_push($vCond, "({$vFieldList[$i]} {$vOpList[$i]} {$vParams[$vFieldList[$i]]})");
				break;
			}
	return $vCond;
}

//----------------------------------------------------------------------------------------------------
//	perform query and return resultset.
//----------------------------------------------------------------------------------------------------
function Sys_fQuery(						// 	(*)
	$vQuery									//	(string)
)
{
	global $Sys_xDb;

	$vResult = mysqli_query($Sys_xDb, $vQuery);
	if ((mysqli_errno($Sys_xDb) != Sys_kErrDuplicateEntry) && (mysqli_errno($Sys_xDb) != 0))
		throw new Exception("mysqli_query($vQuery) " . mysqli_errno($Sys_xDb) . " " . mysqli_error($Sys_xDb), mysqli_errno($Sys_xDb));
	return $vResult;
}

//----------------------------------------------------------------------------------------------------
//	get errno.
//----------------------------------------------------------------------------------------------------
function Sys_fGetErrNo(						// 	(int)
)
{
	global $Sys_xDb;

	return mysqli_errno($Sys_xDb);
}

//----------------------------------------------------------------------------------------------------
//	get last insert id.
//----------------------------------------------------------------------------------------------------
function Sys_fGetInsertId(					// 	(int)
)
{
	global $Sys_xDb;

	return mysqli_insert_id($Sys_xDb);
}

//----------------------------------------------------------------------------------------------------
//	get number of rows affected.
//----------------------------------------------------------------------------------------------------
function Sys_fGetAffectedRows(				// 	(int)
)
{
	global $Sys_xDb;

	return mysqli_affected_rows($Sys_xDb);
}

//----------------------------------------------------------------------------------------------------
//	fetch rows as an associative array.
//----------------------------------------------------------------------------------------------------
function Sys_fFetchRows(					// 	(*)
	$vResult								//	(*) result set
)
{
	for ($vRows = array(); $vRow = mysqli_fetch_assoc($vResult); )
		array_push($vRows, $vRow);
	mysqli_free_result($vResult);
	return $vRows;
}

//----------------------------------------------------------------------------------------------------
//	fetch rows as a recordset.
//----------------------------------------------------------------------------------------------------
function Sys_fFetchRecordset(				// 	(*)
	$vResult								//	(*) result set
)
{
	for ($vFields = array(); $vField = mysqli_fetch_field($vResult); )
		array_push($vFields, $vField->name);
	for ($vRows = array(); $vRow = mysqli_fetch_row($vResult); )
		array_push($vRows, $vRow);
	mysqli_free_result($vResult);
	return array(Fields => $vFields, Rows => $vRows);
}

//----------------------------------------------------------------------------------------------------
//	start session.
//----------------------------------------------------------------------------------------------------
function Sys_fStartSession(					//	(void)
	$vPassword,								//	(string)
	$vIdUser,								//	(int)
	$vRole,									//	(int)
	$vForce									//	(boolean)
)
{
	global $Sys_gCookies;

	if ($vForce)
		Sys_fQuery("DELETE FROM tblSession WHERE (IdUser = $vIdUser)");

	Sys_fQuery("INSERT INTO tblSession
		SET Password = '$vPassword', IdUser = $vIdUser, Role = $vRole, DateAccess = NULL");
	if (Sys_fGetErrNo() == Sys_kErrDuplicateEntry)
		throw new Exception(Sys_kErrAlreadyLogin);

	$Sys_gCookies["xIdSession"] = Sys_fGetInsertId();
}

//----------------------------------------------------------------------------------------------------
//	end session.
//----------------------------------------------------------------------------------------------------
function Sys_fEndSession(					//	(void)
)
{
	global $Sys_gCookies;

	Sys_fQuery("DELETE FROM tblSession WHERE (Id = '{$Sys_gCookies["xIdSession"]}')");
	
	$Sys_gCookies = array();
}

//----------------------------------------------------------------------------------------------------
//	resume session.
//----------------------------------------------------------------------------------------------------
function Sys_fResumeSession(				//	(void)
)
{
	global $Sys_gCookies, $Sys_xTime, $Sys_xCheckSum;

	if (!isset($Sys_gCookies["xIdSession"]))
		//throw new Exception(Sys_kErrUnauthorized);
		return;
	$vData = Sys_fFetchRows(Sys_fQuery("SELECT Password from tblSession
		WHERE (Id = {$Sys_gCookies["xIdSession"]}) AND (IdUser = {$Sys_gCookies["IdUser"]})
		AND (Role = {$Sys_gCookies["Role"]})"));
	if (count($vData) != 1)
		throw new Exception(Sys_kErrExpired);
	$vData = $vData[0];

	if ($Sys_xCheckSum != Sys_fHash($Sys_xTime, $vData["Password"]))
		throw new Exception(Sys_kErrUnauthorized);
		
	Sys_fQuery("UPDATE tblSession
		SET DateAccess = NULL, UpdateN = 1 - UpdateN
		WHERE (Id = '{$Sys_gCookies["xIdSession"]}')");
	if (Sys_fGetAffectedRows() != 1)
		throw new Exception(Sys_kErrExpired);
}

//----------------------------------------------------------------------------------------------------
//	compute forward hash.
//----------------------------------------------------------------------------------------------------
function Sys_fHash(							//	(string)
	$vSeed,									//	(int) seed for hash function
	$vData									//	(string) data to hash
)
{
	return hash("sha256", $vSeed . "," . $vData);
}

//----------------------------------------------------------------------------------------------------
//	decrypt data.
//----------------------------------------------------------------------------------------------------
function Sys_fDecrypt(						//	(string)
	$vSeed,									//	(int) seed for decrypt function
	$vData									//	(string) data to decrypt
)
{
	return xxtea_decrypt($vData, $vSeed);
}

//----------------------------------------------------------------------------------------------------
?>
