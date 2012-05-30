var vDbg = 1;

//----------------------------------------------------------------------------------------------------
//  get cookie.
//----------------------------------------------------------------------------------------------------
function fCookie(
  vCookie
)
{
  var vArr;
  var vVal = null;
  
    if(! document.cookie)
      return null;
      
  vArr = document.cookie.split((escape(vCookie) + '=')); 
  if (vArr.length > 2)
    return null;

  vArr = vArr[1].split(';');
  return unescape(vArr[0]);
}

//----------------------------------------------------------------------------------------------------
function fFmtImg(
  vProp
)
{
  var img;
  
  if (! vProp["src"])
    return null;
    
  img = "<img src=\"" + vProp["src"] + "\" ";
  if (vProp["id"])  img += "id=\"" + vProp["id"] + "\" ";
  if (vProp["class"]) img += "class=\"" + vProp["class"] + "\" ";
  if (vProp["data"])  img += "data=\"" + vProp["data"] + "\" ";
  if (vProp["width"])  img += "width=\"" + vProp["width"] + "\" ";
  if (vProp["height"])  img += "height=\"" + vProp["height"] + "\" ";
  img += " />";
  
  return img;
}

//----------------------------------------------------------------------------------------------------
function fToEmptyStrIfNull(
  vObj
)
{
  for (vKey in vObj)
    if (! vObj[vKey])
      vObj[vKey] = "";
}

//----------------------------------------------------------------------------------------------------
function fFmtTimestamp(
  vTimestamp
)
{
  if (! vTimestamp)
    return "";
  
  return fFmtDate(fDBTimestampToDate(vTimestamp));
}


//----------------------------------------------------------------------------------------------------
function fFmtDateMonthYear(
  vDate
)
{
  var m_names = new Array("January", "February", "March", 
"April", "May", "June", "July", "August", "September", 
"October", "November", "December");

var curr_date = vDate.getDate();
var curr_month = vDate.getMonth();
var curr_year = vDate.getFullYear();
return curr_date + " " + m_names[curr_month] + ", " + curr_year;
}


//----------------------------------------------------------------------------------------------------
function fFmtDate(
  vDate
)
{
  var vDate, vDD, vMM, vHr, vMin, vAmPm;
  
  if (! vDate)
    return "";
    
  vDD = vDate.getDate();
  /*
  if ((vDD + "").length < 2)
    vDD = "0" + vDD;
  */

  vMM = vDate.getMonth() + 1;
  /*
  if ((vMM + "").length < 2)
    vMM = "0" + vMM;
  */
    
  vHr = vDate.getHours();
  if (vHr == 12)
    vAmPm = "pm";
  else if (vHr > 12)
  {
    vHr -= 12;
    vAmPm = "pm";
  }
  else
    vAmPm = "am";
  
  vMin = vDate.getMinutes();
  /*
  if ((vMin + "").length < 2)
    vMin = "0" + vMin;
  */
  
  return vDD + '/' + vMM + '/' + vDate.getFullYear().toString().substr(2);
  //  ", " + vHr + ":" + vMin + vAmPm;
}

//----------------------------------------------------------------------------------------------------
//  function parses mysql datetime string and returns javascript Date object
//  input has to be in this format: 2007-06-05 15:26:02
//----------------------------------------------------------------------------------------------------
function fDBTimestampToDate(
  vTimestamp
) 
{
  var vReg, vParts;
    
    vReg = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
    vParts = vTimestamp.replace(vReg,"$1 $2 $3 $4 $5 $6").split(' ');
    return new Date(vParts[0], vParts[1]-1, vParts[2], vParts[3], vParts[4], vParts[5]);
  }

//----------------------------------------------------------------------------------------------------
function fLog(
  msg
)
{
  //if (vDbg)
    //console.log(msg);
}

//----------------------------------------------------------------------------------------------------
function fMysqlTimestamp(
  vDate
)
{ 
  var vYYYY, vMM, vDD, vHr, vMin, vSec;
  
  
  if (! vDate)
    return;

  vYYYY = vDate.getFullYear();
  vMM = vDate.getMonth() + 1;
  vDD = vDate.getDate();
  vHr = vDate.getHours();
  vMin = vDate.getMinutes();
  vSec = vDate.getSeconds();
  
  if ((vMM + "").length < 2)
    vMM = "0" + vMM;
  if ((vDD + "").length < 2)
    vDD = "0" + vDD;
  if ((vMin + "").length < 2)
    vMin = "0" + vMin;
  if ((vSec + "").length < 2)
    vSec = "0" + vSec;
    
  return vYYYY + vMM + vDD + vHr + vMin + vSec;
}

//----------------------------------------------------------------------------------------------------
function fEnable(
  vId, 
  vState
)
{
  var vElm, vPos;
  
  vElm = fGet("#" + vId);
  vPos = vElm.src.lastIndexOf("_Gray.jpg");

  if (vState && vPos != -1)
    vElm.src = vElm.src.substr(0, vPos) + ".jpg";

  if (!vState && vPos == -1)
  {
    vPos = vElm.src.lastIndexOf(".jpg");
    vElm.src = vElm.src.substr(0, vPos) + "_Gray.jpg";
  }
}

//----------------------------------------------------------------------------------------------------
function fSetActive(
  vElm, 
  vGrp
)
{
  var vElm2, vPos;

  for (i=0; i<vGrp.length; i++)
  {
    vElm2 = fGet("#" + vGrp[i]);
    if (vElm2.style.display == "none")  
      continue;
    if (vElm != vElm2)
    {
      vPos = vElm2.src.lastIndexOf("_Gray.jpg");
      if (vPos != -1) 
        continue;
      vPos = vElm2.src.lastIndexOf(".jpg");
      vElm2.src = vElm2.src.substr(0, vPos) + "_Gray.jpg";
    }
  }

  vPos = vElm.src.lastIndexOf("_Gray.jpg");
  if (vPos != -1) 
    vElm.src = vElm.src.substr(0, vPos) + ".jpg";
}

//----------------------------------------------------------------------------------------------------
function fGetActive(
  vGrp
)
{
  var vElm;

  for (i=0; i<vGrp.length; i++)
  {
    vElm = fGet("#" + vGrp[i]);
    if (vElm.src.lastIndexOf("_Gray.jpg") == -1)
      return vElm;
  }
  return null;
}

//----------------------------------------------------------------------------------------------------
function fFindElmByData(
  vGrp, 
  vData
)
{
  var vElm;

  for (i=0; i<vGrp.length; i++)
  {
    vElm = fGet("#" + vGrp[i]);
    if (vElm.getAttribute("data") == vData)
      return vElm;
  }
  return null;
}

//----------------------------------------------------------------------------------------------------
function fRefreshTable(
  vId, 
  vArray
)
{
  cTable.fDeleteAll(vId);
  for (i=0; i<vArray.length; i++)
    cTable.fAdd(vId, (i % 2 == 0) ? "cEven":"cOdd", -1, vArray[i]);
}

//----------------------------------------------------------------------------------------------------
//  Shallow clone of an array or object.
//----------------------------------------------------------------------------------------------------
function fCopy(
  vFrom, 
  vTo
)
{
  var vItem = {}, vKey;
  
  if (fIsArray(vFrom))
  {
    for (i=0; i<vFrom.length; i++)
    {
      vItem = {};
      for (vKey in vFrom[i])
        vItem[vKey] = vFrom[i][vKey];
      vTo.push(vItem);
    }
    return;
  } 
  
  if (fIsObject(vFrom))
    for (vKey in vFrom)
      vTo[vKey] = vFrom[vKey];
}
 
//----------------------------------------------------------------------------------------------------
function fFindInArray(
  vArr, 
  vId, 
  vFindThis
)
{
  var i;
  
  for (var i=0; i<vArr.length; i++)
    if (vArr[i][vId] == vFindThis)
      return vArr[i];

  return null;
}

//----------------------------------------------------------------------------------------------------
function fPropertyCt(
  vObject
)
{
  var vCt=0;
  
  if (! fIsObject(vObject))
    return 0;
  
  for (var vKey in vObject)
    vCt++;
  return vCt;
}

//----------------------------------------------------------------------------------------------------
function fCoalesceFav(
  vResult, 
  vMeta
)
{
  var i, j;
  
  for (var i=0; i<vResult.length; i++)
    for (var j=0; j<vMeta.length; j++)
    {
      if (vResult[i]["QtnId"] == vMeta[j]["QtnId"])
      {
        vResult[i]["Favorite"] = vMeta[j]["Favorite"];
        break;
      }
    }
  return vResult;
}

//----------------------------------------------------------------------------------------------------
function fDiffFav(
  vBefore, 
  vAfter
)
{
  var i, j, vDiff = [];
  
  for (i=0; i<vBefore.length; i++)
    for (j=0; j<vAfter.length; j++)
    {
      if (vBefore[i]["QtnId"] == vAfter[j]["QtnId"])
      {
        if (vBefore[i]["Favorite"] != vAfter[j]["Favorite"])
          vDiff.push(vAfter[j]);
        break;
      }
    }
  
  return vDiff;
}

//----------------------------------------------------------------------------------------------------
function fLevel(
  vLvl, 
  vGrp, 
  vProfile
)
{
  var i, vLvls, vTxt;


  if (vLvl)
    return vGrp[vLvl];
    
  vLvls = vProfile["LevelId"];
  for (i=0, vTxt=""; i<vLvls.length; i++)
  {
    vTxt += vGrp[vLvls[i]];
    if (i + 1 < vLvls.length)
      vTxt += ", ";
  }
  return vTxt;
}

//----------------------------------------------------------------------------------------------------
function fValidEmail(
  vEmail
)
{
   var vReg;
   
   vReg= /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   return vReg.test(vEmail);
}

//----------------------------------------------------------------------------------------------------
function fTrim(
  vStr
)
{
  return vStr.replace(/^\s+|\s+$/g,""); 
}

//----------------------------------------------------------------------------------------------------
//  get browser's view port.
//----------------------------------------------------------------------------------------------------
function fViewPort(
)
{
  var vSize = {};
  
  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  
  if (typeof window.innerWidth != 'undefined') {
      vSize.width = window.innerWidth,
      vSize.height = window.innerHeight
  } else if (typeof document.documentElement != 'undefined' && 
    typeof document.documentElement.clientWidth != 'undefined' && 
      document.documentElement.clientWidth != 0) {
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
     vSize.width = document.documentElement.clientWidth,
     vSize.height = document.documentElement.clientHeight
  } else {      
      // older versions of IE
     vSize.width = document.getElementsByTagName('body')[0].clientWidth,
     vSize.height = document.getElementsByTagName('body')[0].clientHeight
  }  
  return vSize;
}

//----------------------------------------------------------------------------------------------------
//  position the flash window to the center of the browser's view port.  if needed, adjust the
//  flash window to fit.
//----------------------------------------------------------------------------------------------------
function fPosFlashWin(
  vFlash
)
{
  var vSize = {};
  var vResize = false;

  vVPSize = fViewPort();
  vFlashSize = fGetSize(vFlash);
  
  /*
  if (vFlashSize.x > vVPSize.width) {
    vFlashSize.x = vVPSize.width - 10;
    vResize = true;
  }
  if (vFlashSize.y > vVPSize.height) {
    vFlashSize.y = vVPSize.height - 10;
    vResize = true;
  } 
  if (vResize) {
    fSetSize(vFlash, vFlashSize);
  }
  */
  
  fSetPos(vFlash, {'x': (vVPSize.width-vFlashSize.x)/2, 'y': (vVPSize.height-vFlashSize.y)/2});
}

//----------------------------------------------------------------------------------------------------
//  getting a cross-browser request object.
//----------------------------------------------------------------------------------------------------
function fGetXMLHttpRequest(
)
{
  var vHttp = null;
  
  if (vHttp = new XMLHttpRequest()) {
    ;
  } else if ((vHttp = new ActiveXObject("MSXML2.XMLHTTP.3.0"))) {
    ;
  } else if ((vHttp = new ActiveXObject("MSXML2.XMLHTTP"))) {
    ;
  } else if ((vHttp = new ActiveXObject("Microsoft.XMLHTTP"))) {
    ;
  }
  return vHttp;
}

//----------------------------------------------------------------------------------------------------
function fShow(
  vElm, 
  vFlag
)
{
  if (vFlag)
    vElm.style.display = 'block';
  else
    vElm.style.display = 'none'
}

//----------------------------------------------------------------------------------------------------
//  show/hide block.
//----------------------------------------------------------------------------------------------------
function fShow3(
  vId, 
  vFlag
)
{
  vElm = fGet('#' + vId);
  if (vFlag)
    vElm.style.display = 'block';
  else
    vElm.style.display = 'none';
}

//----------------------------------------------------------------------------------------------------
//  show/hide inline.
//----------------------------------------------------------------------------------------------------
function fShow2(
  vId, 
  vFlag
)
{
  vElm = fGet('#' + vId);
  if (vFlag)
    vElm.style.display = 'inline';
  else
    vElm.style.display = 'none';
}

//----------------------------------------------------------------------------------------------------
//  show/hide true.
//----------------------------------------------------------------------------------------------------
function fShow1(
  vId, 
  vFlag
)
{
  vElm = fGet('#' + vId);
  if (vFlag)
    vElm.style.display = 'inline-block';
  else
    vElm.style.display = 'none';
}

//----------------------------------------------------------------------------------------------------
function fMatchPrefix(
  vToMatch, 
  vMatchWith
)
{
  return (vToMatch.substr(0, vMatchWith.length) == vMatchWith);
}

//----------------------------------------------------------------------------------------------------
function fNumFromString(
  vStr
)
{
  var match = vStr.match(/(\d+)/);
  return match[1];
}

//----------------------------------------------------------------------------------------------------
//  refresh drop list with new data.
//----------------------------------------------------------------------------------------------------
function fResetDropList(
  vTarget, 
  vList
)
{
  var vOpts = '';

  for (var i=0; i<vList.length; i++)
  {
    var p = vList[i];
    vOpts += '<option data=\'' + p.data + '\'>' + p.text + '</option>';
  }

  fGet('#' + vTarget.div).innerHTML = 
    '<select onchange=\'fOnDropListChg(this)\' id=\'' + vTarget.id + '\'>' + vOpts + '</select>';  
}

//----------------------------------------------------------------------------------------------------
//  get 'data' attribute from drop-list.
//----------------------------------------------------------------------------------------------------
function fDropListData(
  vId
)
{ 
  var vElm = fGet('#' + vId);
  var vOpt = vElm.options[vElm.selectedIndex]; 
  return vOpt.getAttribute('data');
}

//----------------------------------------------------------------------------------------------------
//  generate a concatenated key given an object.
//----------------------------------------------------------------------------------------------------
function fConcatKeys(
  vObj
)
{
  var vKey = '';

  for (var key in vObj)
    vKey += vObj[key];
  return vKey;
} 

//----------------------------------------------------------------------------------------------------
//  given a list of objects, returns an array of distinct specified key.
//----------------------------------------------------------------------------------------------------
function fDistinctList(
  vList, 
  vField
)
{
  var vHash = {};
  var vArr = [];
  
  for (var i=0; i<vList.length; i++)
    vHash[vList[i][vField]] = 1;

  for (var vKey in vHash)
    vArr.push(vKey);
  return vArr;
}

//----------------------------------------------------------------------------------------------------
function fSubmitVirtualForm(
  vHash
)
{
  var vForm = document.createElement('form');
  vForm.setAttribute('method', 'post');
  vForm.setAttribute('action', vHash.url);
  
  for (var vKey in vHash)
  {
    var vField = document.createElement('input');
    vField.setAttribute('name', vKey);
    vField.setAttribute('value', vHash[vKey]);
    vField.setAttribute('type', 'hidden');
    vForm.appendChild(vField);
  }
  // adding to document body is required for Firefox and IE.
  document.body.appendChild(vForm);
  vForm.submit();
}





















