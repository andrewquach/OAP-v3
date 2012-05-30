<?php
require("../config/config.php");

//----------------------------------------------------------------------------------------------------
//  fetch qtns that belong to a particular test.
//----------------------------------------------------------------------------------------------------
function fFetchTestQtns(
  $vParams
)
{
  $vRows = Sys_fFetchRows(Sys_fQuery("SELECT DISTINCT tblQtn.QtnId, Path, Type, DifficultyId, TopicId, tblQtnGrp.Order
    FROM tblQtn, tblQtnGrp
      WHERE tblQtn.QtnId = tblQtnGrp.QtnId
        AND TestId = " . $vParams["TestId"]));
  
  if (isset($vParams["Meta"]) && $vParams["Meta"])
  {
    $vMetas = Sys_fFetchRows(Sys_fQuery("SELECT QtnId, Favorite
      FROM tblTestDone, tblQtnDone
          WHERE tblTestDone.Id = tblQtnDone.Id
          AND TestId = " . $vParams["TestId"]));
    for ($i=0, $ict=count($vRows); $i<$ict; $i++)
      for ($j=0, $jct=count($vMetas); $j<$jct; $j++)
        if ($vRows[$i]["QtnId"] == $vMetas[$j]["QtnId"])
        {
          $vRows[$i]["Favorite"] = $vMetas[$j]["Favorite"];
          break;
        }
  }
  return $vRows;
}

//----------------------------------------------------------------------------------------------------
//  fetch qtns to dynamically compose a test.
//----------------------------------------------------------------------------------------------------
function fFetchRandomQtns(
  $vIdUser,
  $vParams
)
{
  $vLevels = "";
  for ($i=0, $ct=count($vParams["LevelId"]); $i<$ct; $i++)
  {
    $vLevels .= " LevelId = " . $vParams["LevelId"][$i];
    if ($i + 1 < $ct)
      $vLevels .= " OR ";
  }
  // get fresh qtns (not attempted by the user yet)
  $vQtns = Sys_fFetchRows(Sys_fQuery("SELECT DISTINCT tblQtn.QtnId, Path, Type, DifficultyId, TopicId, 1 as New
    FROM tblQtn
      WHERE SubjectId = " . $vParams["SubjectId"] . "
        AND (" . $vLevels . ")
        AND tblQtn.QtnId NOT IN
          (SELECT DISTINCT tblQtn.QtnId
            FROM tblTestDone, tblQtnDone, tblQtn
              WHERE tblQtn.QtnId = tblQtnDone.QtnId
                AND tblTestDone.Id = tblQtnDone.Id
                AND UserId = " . $vIdUser . "
                AND SubjectId = " . $vParams["SubjectId"] . "
                AND (" . $vLevels . ")) 
                  LIMIT " . $vParams["Limit"]));
    
  // get qtns that were last attempted incorrectly
  $vWrongs = Sys_fFetchRows(Sys_fQuery("SELECT DISTINCT tblQtn.QtnId, Path, Type, DifficultyId, TopicId, 0 as New
    FROM tblQtn, tblQtnDone, tblTestDone
      WHERE UserId = " . $vIdUser . "
        AND SubjectId = " . $vParams["SubjectId"] . "
        AND (" . $vLevels . ")
        AND tblQtnDone.Correct = 0
        AND tblQtn.QtnId = tblQtnDone.QtnId
        AND tblTestDone.Id = tblQtnDone.Id
          LIMIT " . $vParams["Limit"]));
  for ($i=0, $ct=count($vWrongs); $i<$ct; $i++)
    array_push($vQtns, $vWrongs[$i]);
  return $vQtns;    
}

//----------------------------------------------------------------------------------------------------
//  For deleting newly created dynamic test or quiz; where users abort
//  without submitting to the database.  We need this because dynamic tests
//  and quizzes are always created in the database first, before disking out
//  to users.
//----------------------------------------------------------------------------------------------------
function fDeleteTest(
  $vParams
)
{
  Sys_fQuery("DELETE FROM tblTest
    WHERE TestId = " . $vParams["TestId"]);
  return null;
}

//----------------------------------------------------------------------------------------------------
function fUpdateFav(
  $vIdUser,
  $vParams
)
{
  $vQtns = $vParams["Qtns"];
  
  for ($i=0, $ct=count($vQtns); $i<$ct; $i++)
    Sys_fQuery("UPDATE tblQtnDone, tblTestDone
      SET Favorite = " . $vQtns[$i]["Favorite"] . "
        WHERE tblQtnDone.Id = tblTestDone.Id
          AND QtnId = " . $vQtns[$i]["QtnId"] . "
          AND UserId = " . $vIdUser);
  return null;
}

//----------------------------------------------------------------------------------------------------
function fFetchFavoriteQtn(
  $vIdUser,
  $vParams
)
{
  return Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT tblQtn.QtnId, Path, Type, Raw
    FROM tblQtn, tblQtnDone, tblTestDone
      WHERE tblQtn.QtnId = ' . $vParams['QtnId'] . '
        AND UserId = ' . $vIdUser . '
        AND tblQtn.QtnId = tblQtnDone.QtnId
        AND tblQtnDone.Id = tblTestDone.Id'));
}

//----------------------------------------------------------------------------------------------------
function fListMySubjs(
  $vIdUser
)
{
  return Sys_fFetchRows(Sys_fQuery("SELECT SubjectId, LevelId
    FROM tblProfile
      WHERE UserId = " . $vIdUser . "
        ORDER BY SubjectId, LevelId"));
}

//----------------------------------------------------------------------------------------------------
function fLog(
  $vData
)
{
  file_put_contents(ERROR_LOG_PATH,is_array($vData) ? print_r($vData, true) : $vData . "\r\n", FILE_APPEND);
}


  
?>