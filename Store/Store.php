<?php
//----------------------------------------------------------------------------------------------------
require('../1.Core/Sys.php');
require('../Common/Helper.php');
require("../config/config.php");

//----------------------------------------------------------------------------------------------------
function Page_fDo(							//	(*) data to return in response
	$vOp,									//	(string) operation
	$vParams,								//	(*) parameters
	$vLastRequest							//	(int) time of last request
)
{
  global $Sys_gCookies;
  
  //Sys_fResumeSession();
  $vIdUser = $Sys_gCookies['IdUser'];
  $vChildId = $Sys_gCookies['IdChild'];
  if ($vChildId ==  null)
  	$vChildId =  0;
  if ($vIdUser ==  null)
  	$vIdUser =  0;
  	
  switch ($vOp)
  {
    case 'InitBuy':
      $vList = $vParams['Cart'];
      $vTransactId = fAddDash(uniqid(), 4);
      //var_dump($vList);exit(0);	
      // record a pending transaction.        
      // actual fulfillment will be handled by IPN_Paypal.php (online purchase) 
      // OR WalkIn.php (offline purchases at Times bookstores).
      $vIds = '';
      for ($i=0, $ct=count($vList); $i<$ct; $i++){
        $vSubscription = $vList[$i]['Subscription'] + $vList[$i]['Promotion'];
        Sys_fQuery('INSERT INTO tblSale SET HelperId = ' . $vIdUser . 
          ', ItemId = ' . $vList[$i]['id'] . ', TransactId = \'' . $vTransactId . '\', ' .
            ' Type = ' . $vList[$i]['type']. ', LevelId = '. $vList[$i]['levelid']. ', ChildId = '. $vChildId. ', Subscription = '. $vSubscription);
            
            }
      return array('transactId'=>$vTransactId, 'PaypalUrl'=>PAYPAL_URL, 'PaypalSuccessUrl'=>PAYPAL_SUCCESS_URL, 'PaypalCancelUrl'=>PAYPAL_CANCEL_URL, 'PaypalEmailAccount'=>PAYPAL_EMAIL_ACCOUNT, 'PaypalNotificationUrl'=>PAYPAL_NOTIFICATION_URL);

    case 'ListBook':
      $vBooks = Sys_fFetchRows(Sys_fQuery('(SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 ORDER BY BookId) 
          
          UNION
          
          (SELECT Id, TestBankId, a.LevelId,  b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 ORDER BY TestBankId)
          	
          UNION
          
          (SELECT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3  ORDER BY cWId)
          	
          UNION
          
          (SELECT Id, BundleId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBundle a, tblForSale b WHERE a.BundleId =  b.Id AND b.Type = 4  ORDER BY BundleId)'));
          	
      $vItemsOwn = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT ItemId FROM tblItemOwn WHERE UserId = '.$vIdUser.' GROUP BY ItemId'));
          	
      return array('books'=>$vBooks,'itemsOwn'=>$vItemsOwn);
      
    case 'ListBookSeparate':
      if ($vParams['level'] == 0)
      {	
      	$vBookMathematics = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND a.SubjectId = 1 GROUP BY BookId ORDER BY BookId'));
          
     	$vBookScience = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND a.SubjectId = 2 GROUP BY BookId  ORDER BY BookId'));
          
      	$vBookEnglish = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND a.SubjectId = 3 GROUP BY BookId  ORDER BY BookId')); 
          	
        $vBookChinese = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND a.SubjectId = 4 GROUP BY BookId  ORDER BY BookId'));   
      }
      else
      {
      	$vBookMathematics = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND a.SubjectId = 1 AND a.LevelId = '.$vParams['level'].' ORDER BY BookId '));
          
     	$vBookScience = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND a.SubjectId = 2 AND a.LevelId = '.$vParams['level'].' ORDER BY BookId '));
          
      	$vBookEnglish = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND a.SubjectId = 3 AND a.LevelId = '.$vParams['level'].' ORDER BY BookId '));
        
        $vBookChinese = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND a.SubjectId = 4 AND a.LevelId = '.$vParams['level'].' ORDER BY BookId '));
      
      }
      if ($vParams['subject'] == 0 && $vParams['level'] == 0)
      {
      	$vTestBank = Sys_fFetchRows(Sys_fQuery('SELECT Id, TestBankId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 GROUP BY TestBankId  ORDER BY TestBankId'));
      }
      else if ($vParams['level'] == 0)
      {
      	$vTestBank = Sys_fFetchRows(Sys_fQuery('SELECT Id, TestBankId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Author, Publisher, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 And a.SubjectId = '.$vParams['subject'].' GROUP BY TestBankId  ORDER BY TestBankId'));
      }
      else if ($vParams['subject'] == 0)
      {
      	$vTestBank = Sys_fFetchRows(Sys_fQuery('SELECT Id, TestBankId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Author, Publisher, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 And a.LevelId = '.$vParams['level'].' GROUP BY TestBankId  ORDER BY TestBankId'));
      }
      else
      {
      	$vTestBank = Sys_fFetchRows(Sys_fQuery('SELECT Id, TestBankId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 AND a.LevelId = '.$vParams['level'].' AND a.SubjectId = '.$vParams['subject'].' GROUP BY TestBankId  ORDER BY TestBankId'));
      }
      
      if ($vParams['level'] == 0){
      	$vCoursewareEnglish =  Sys_fFetchRows(Sys_fQuery('SELECT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND a.SeriesId = 1 GROUP BY cWId  ORDER BY cWId'));
        
        $vCoursewareChinese =  Sys_fFetchRows(Sys_fQuery('SELECT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND a.SeriesId = 2  GROUP BY cWId  ORDER BY cWId'));
        
        $vCoursewareEduPro =  Sys_fFetchRows(Sys_fQuery('(SELECT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND a.SeriesId = 3 GROUP BY cWId  ORDER BY cWId)
          	UNION 
          	(SELECT Id, BundleId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBundle a, tblForSale b WHERE a.BundleId =  b.Id AND b.Type = 4 GROUP BY BundleId  ORDER BY BundleId)')); 	
      }    	
      else
      {
      	$vCoursewareEnglish =  Sys_fFetchRows(Sys_fQuery('SELECT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND a.SeriesId = 1 AND a.LevelId = '.$vParams['level'].' GROUP BY cWId  ORDER BY cWId'));
          	
        $vCoursewareChinese =  Sys_fFetchRows(Sys_fQuery('SELECT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND a.SeriesId = 2 AND a.LevelId = '.$vParams['level'].' GROUP BY cWId  ORDER BY cWId')); 
        $vCoursewareEduPro =  Sys_fFetchRows(Sys_fQuery('(SELECT Id, cWId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND a.SeriesId = 3 AND a.LevelId = '.$vParams['level'].' GROUP BY cWId  ORDER BY cWId) UNION
          	(SELECT Id, BundleId, a.LevelId, b.LevelId as Level, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBundle a, tblForSale b WHERE a.BundleId =  b.Id AND b.Type = 4 AND a.LevelId = '.$vParams['level'].' GROUP BY BundleId  ORDER BY BundleId)'));
      }
      return array('bookMathematics'=>$vBookMathematics, 'bookScience'=>$vBookScience, 'bookEnglish'=>$vBookEnglish, 'bookChinese'=>$vBookChinese, 'testBank'=>$vTestBank, 'coursewareEnglish'=>$vCoursewareEnglish, 'coursewareChinese'=>$vCoursewareChinese, 'coursewareEduPro'=>$vCoursewareEduPro);  
      
    case 'ListOneBook':
      if ($vParams['BookId']>0 && $vParams['BookId']<=100){
      	$vBooks = Sys_fFetchRows(Sys_fQuery('SELECT Id, TestBankId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 AND TestBankId = '.$vParams['BookId'].' ORDER BY TestBankId '));
        $vRelateds = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT Id, TestBankId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.LevelId as Level
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 AND TestBankId != '.$vParams['BookId'].' GROUP BY TestBankId  ORDER BY TestBankId'));
      }    	
      else if ($vParams['BookId']>100 && $vParams['BookId']<=9000){
      	$vBooks = Sys_fFetchRows(Sys_fQuery('SELECT Id, cWId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, Overview, Preview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND cWId = '.$vParams['BookId'].' ORDER BY cWId '));
        $vLevelId = $vBooks[0]['LevelId'];
        $vSubjectId = $vBooks[0]['SubjectId'];
        $vRelateds =  Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT Id, cWId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, b.LevelId as Level
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND a.SubjectId = '.$vSubjectId.' AND a.LevelId = '.$vLevelId.' AND cWId != '.$vParams['BookId'].' GROUP BY cWId  ORDER BY cWId'));
      }
      else if ($vParams['BookId']>9000 && $vParams['BookId']<=100000){		
      	$vBooks = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND BookId = '.$vParams['BookId'].' ORDER BY BookId '));
        $vLevelId = $vBooks[0]['LevelId'];
        $vSubjectId = $vBooks[0]['SubjectId'];
        $vRelateds = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT Id, BookId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.LevelId as Level
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND (a.SubjectId = '.$vSubjectId.' OR a.LevelId = '.$vLevelId.') AND BookId != '.$vParams['BookId'].' GROUP BY BookId ORDER BY BookId '));
      }
      else{
      	$vBooks = Sys_fFetchRows(Sys_fQuery('SELECT Id, BundleId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBundle a, tblForSale b WHERE a.BundleId =  b.Id AND b.Type = 4 AND BundleId = '.$vParams['BookId'].' ORDER BY BundleId '));
        $vLevelId = $vBooks[0]['LevelId'];
        $vSubjectId = $vBooks[0]['SubjectId'];
        $vRelateds = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT Id, BundleId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, b.LevelId as Level
          	FROM tblBundle a, tblForSale b WHERE a.BundleId =  b.Id AND b.Type = 4 AND (a.SubjectId = '.$vSubjectId.' OR a.LevelId = '.$vLevelId.') AND BundleId != '.$vParams['BookId'].' GROUP BY BundleId ORDER BY BundleId '));
        
        $vBundleItems = Sys_fFetchRows(Sys_fQuery('(SELECT BookId as Id, a.LevelId, b.LevelId as Level, a.SubjectId,  
        Title, Publisher, Cover, Author, Synopsis, \'\' as Preview
          FROM tblBook a, tblBundleItem b WHERE a.BookId =  b.ItemId AND b.BundleId = '.$vParams['BookId'].' GROUP BY Id ORDER BY Id ) 
          
          UNION
          
          (SELECT TestBankId as Id, a.LevelId, b.LevelId as Level, a.SubjectId, Title, Publisher, Cover, Author, Synopsis, \'\' as Preview
          FROM tblTestBank a, tblBundleItem b WHERE a.TestBankId =  b.ItemId AND b.BundleId = '.$vParams['BookId'].' GROUP BY Id ORDER BY Id ) 
          	
          UNION
          
          (SELECT cWId as Id, a.LevelId, b.LevelId as Level, a.SubjectId, Title, Publisher, Cover, Author, Synopsis, Preview
          FROM tblCourseware a, tblBundleItem b WHERE a.cWId =  b.ItemId AND b.BundleId = '.$vParams['BookId'].' GROUP BY Id ORDER BY Id )'));        	
        
      }
      
      $vCartItems = array();
      
      for ($i=0; $i<count($vParams['CartItemIds']); $i++)
      {
      	if ($vParams['CartItemIds'][$i] >0 && $vParams['CartItemIds'][$i] <= 100){
      		$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Id, TestBankId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 AND TestBankId = '.$vParams['CartItemIds'][$i].' ORDER BY TestBankId '));
          	if (count($vRows)>0)
          		$vCartItems[] = $vRows[0];
      	}
      	else if ($vParams['CartItemIds'][$i]>100 && $vParams['CartItemIds'][$i]<=9000){
      		$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Id, cWId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, Overview, Preview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND cWId = '.$vParams['CartItemIds'][$i].' ORDER BY cWId '));
          	if (count($vRows)>0)
          		$vCartItems[] = $vRows[0];
      	}
      	else if ($vParams['CartItemIds'][$i]>9000 && $vParams['CartItemIds'][$i]<=100000){
      		$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND BookId = '.$vParams['CartItemIds'][$i].' ORDER BY BookId '));
          	if (count($vRows)>0)
          		$vCartItems[] = $vRows[0];
      	}
      	else{
      		$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Id, BundleId, a.LevelId, a.SubjectId, 
        		Title, Publisher, Price, Cover, Author, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          		FROM tblBundle a, tblForSale b WHERE a.BundleId =  b.Id AND b.Type = 4 AND BundleId = '.$vParams['CartItemIds'][$i].' ORDER BY BundleId '));
      		if (count($vRows)>0)
          		$vCartItems[] = $vRows[0];
         }
      }
      
      $vItemsOwn = Sys_fFetchRows(Sys_fQuery('SELECT DISTINCT ItemId FROM tblItemOwn WHERE UserId = '.$vIdUser.' GROUP BY ItemId'));
      
      return array('books'=>$vBooks,'relateds'=>$vRelateds,'bundleItems'=>$vBundleItems,'cartItems'=>$vCartItems,'itemsOwn'=>$vItemsOwn);
    
   case 'ListCartItems': 
      $vCartItems = array();
      
      for ($i=0; $i<count($vParams['CartItemIds']); $i++)
      {
      	if ($vParams['CartItemIds'][$i] >0 && $vParams['CartItemIds'][$i] <= 100){
      		$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Id, TestBankId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Author, Price, Cover, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblTestBank a, tblForSale b WHERE a.TestBankId =  b.Id AND b.Type = 2 AND TestBankId = '.$vParams['CartItemIds'][$i].' ORDER BY TestBankId '));
          	if (count($vRows)>0)
          		$vCartItems[] = $vRows[0];
      	}
      	else if ($vParams['CartItemIds'][$i]>100 && $vParams['CartItemIds'][$i]<=9000){
      		$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Id, cWId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, Overview, Preview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblCourseware a, tblForSale b WHERE a.cWId =  b.Id AND b.Type = 3 AND cWId = '.$vParams['CartItemIds'][$i].' ORDER BY cWId '));
          	if (count($vRows)>0)
          		$vCartItems[] = $vRows[0];
      	}
      	else if ($vParams['CartItemIds'][$i]>9000 && $vParams['CartItemIds'][$i]<=100000){
      		$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Id, BookId, a.LevelId, a.SubjectId, 
        	Title, Publisher, Price, Cover, Author, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          	FROM tblBook a, tblForSale b WHERE a.BookId =  b.Id AND b.Type = 1 AND BookId = '.$vParams['CartItemIds'][$i].' ORDER BY BookId '));
          	if (count($vRows)>0)
          		$vCartItems[] = $vRows[0];
      	}
      	else{
      		$vRows = Sys_fFetchRows(Sys_fQuery('SELECT Id, BundleId, a.LevelId, a.SubjectId, 
        		Title, Publisher, Price, Cover, Author, Synopsis, Overview, b.LevelId as Level, b.SubscriptionLength, b.SubscriptionPromotion
          		FROM tblBundle a, tblForSale b WHERE a.BundleId =  b.Id AND b.Type = 4 AND BundleId = '.$vParams['CartItemIds'][$i].' ORDER BY BundleId '));
      		if (count($vRows)>0)
          		$vCartItems[] = $vRows[0];
         }
      }
      
      return array('cartItems'=>$vCartItems);
      
   case 'FetchSampleQtns':
    if ($vParams['BookId']>0 && $vParams['BookId']<=100){
    	$vQuestions = Sys_fFetchRows(Sys_fQuery('SELECT b.QtnId, b.Path, b.Type
        FROM tblTestBank a, tblQtn b
          WHERE b.Pool = 0
            AND a.LevelId = b.LevelId
            AND a.SubjectId = b.SubjectId
            AND a.TestBankId = '.$vParams['BookId'].'
              GROUP BY b.QtnId
              ORDER BY RAND()
                LIMIT 8'));
        return $vQuestions;
    }
    else if ($vParams['BookId']>9000){  
	   
      $vQuestions = Sys_fFetchRows(Sys_fQuery('(SELECT d.QtnId, COUNT(c.Correct), d.Path, d.Type
        FROM tblTest a, tblQtnGrp b, tblQtnDone c, tblQtn d
          WHERE a.BookId = '. $vParams['BookId'] .'
            AND a.TestId = b.TestId
            AND b.QtnId = c.QtnId
            AND c.QtnId = d.QtnId
            AND a.SubjectId=  d.SubjectId
            AND a.LevelId = d.LevelId
            AND c.Correct = 0
              GROUP BY d.QtnId
              ORDER BY COUNT(c.Correct) DESC
                LIMIT 4)
UNION
(SELECT d.QtnId, COUNT(c.Favorite), d.Path, d.Type
        FROM tblTest a, tblQtnGrp b, tblQtnDone c, tblQtn d
          WHERE a.BookId = '. $vParams['BookId'] .'
            AND a.TestId = b.TestId
            AND b.QtnId = c.QtnId
            AND c.QtnId = d.QtnId
            AND a.SubjectId=  d.SubjectId
            AND a.LevelId = d.LevelId
            AND c.Favorite = 1
              GROUP BY d.QtnId
              ORDER BY COUNT(c.Favorite)
                LIMIT 4)
 ORDER BY QtnID'));
 		
 		if (count($vQuestion) < 8)
 		{
 			$l = 8 - count($vQuestion);
 			$vOtherQuestions = Sys_fFetchRows(Sys_fQuery('SELECT d.QtnId, d.Path, d.Type
        FROM tblTest a, tblQtnGrp b, tblQtn d
          WHERE a.BookId = '. $vParams['BookId'] .'
            AND a.TestId = b.TestId
            AND b.QtnId = d.QtnId
            AND a.SubjectId=  d.SubjectId
            AND a.LevelId = d.LevelId
              GROUP BY d.QtnId
              ORDER BY RAND()
                LIMIT '. $l));
                
             $vQuestions = array_merge((array)$vQuestions, (array)$vOtherQuestions);
 		}
 		
 		return $vQuestions;
 	}
  }
}

//----------------------------------------------------------------------------------------------------
function fAddDash(
  $vStr,
  $vChunkLen
)
{
  $vResult = '';
  for ($i=0, $ct=strlen($vStr); $i<$ct; )
  {
    $vResult .= substr($vStr, $i, $vChunkLen);
    $i += $vChunkLen;
    if ($i < $ct)
      $vResult .= '-';
  }
  return $vResult;
}

//----------------------------------------------------------------------------------------------------
Sys_fRun(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_PORT);

//----------------------------------------------------------------------------------------------------
?>

