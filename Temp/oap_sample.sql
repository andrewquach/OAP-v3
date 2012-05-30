/*
 Navicat Premium Data Transfer

 Source Server         : OAP
 Source Server Type    : MySQL
 Source Server Version : 50144
 Source Host           : localhost
 Source Database       : oap_sample

 Target Server Type    : MySQL
 Target Server Version : 50144
 File Encoding         : utf-8

 Date: 05/16/2011 17:39:07 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `tblBook`
-- ----------------------------
DROP TABLE IF EXISTS `tblBook`;
CREATE TABLE `tblBook` (
  `BookId` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(64) DEFAULT NULL,
  `Publisher` varchar(64) DEFAULT NULL,
  `LevelId` tinyint(4) DEFAULT NULL,
  `SubjectId` int(11) NOT NULL,
  `Cover` varchar(128) DEFAULT NULL,
  `Price` double DEFAULT NULL,
  PRIMARY KEY (`BookId`)
) ENGINE=MyISAM AUTO_INCREMENT=9004 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblBook`
-- ----------------------------
BEGIN;
INSERT INTO `tblBook` VALUES ('1', 'Math Essentials', 'Marshall Cavendish', '1', '1', 'Math_Essentials.jpg', '10'), ('2', 'Visible Thinking In Mathematics', 'Marshall Cavendish', '1', '1', 'VisibleThinking_Math.jpg', '9'), ('3', 'Science PSLE Revision & Examination Papers (2nd Edition)', 'Marshall Cavendish', '1', '2', 'Science_PSLE.jpg', '8'), ('4', 'Success in Comprehension', 'Marshall Cavendish', '1', '3', 'Success_In_Comprehension.jpg', '7'), ('5', 'Discover Maths - Topical Practice', 'EPB Pan Pacific', '1', '1', 'Discover_Maths.jpg', '6'), ('6', 'My Pals Are Here!', 'Federal Publications', '1', '3', 'MyPalsAreHere_English.jpg', '5');
COMMIT;

-- ----------------------------
--  Table structure for `tblBookOwn`
-- ----------------------------
DROP TABLE IF EXISTS `tblBookOwn`;
CREATE TABLE `tblBookOwn` (
  `UserId` int(11) unsigned NOT NULL,
  `BookId` int(11) unsigned NOT NULL,
  `Done` int(11) NOT NULL,
  `Total` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblBookOwn`
-- ----------------------------
BEGIN;
INSERT INTO `tblBookOwn` VALUES ('1', '1', '3', '7'), ('1', '2', '2', '5'), ('1', '3', '0', '4'), ('1', '4', '0', '4'), ('1', '5', '0', '6'), ('1', '6', '0', '2');
COMMIT;

-- ----------------------------
--  Table structure for `tblFocus`
-- ----------------------------
DROP TABLE IF EXISTS `tblFocus`;
CREATE TABLE `tblFocus` (
  `FocusId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `TopicId` int(64) NOT NULL,
  `DifficultyId` int(11) NOT NULL,
  `SubjectId` int(11) NOT NULL,
  PRIMARY KEY (`FocusId`)
) ENGINE=MyISAM AUTO_INCREMENT=270 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblFocus`
-- ----------------------------
BEGIN;
INSERT INTO `tblFocus` VALUES ('269', '1', '1', '1', '1'), ('265', '1', '6', '1', '2'), ('260', '1', '5', '2', '1');
COMMIT;

-- ----------------------------
--  Table structure for `tblProfile`
-- ----------------------------
DROP TABLE IF EXISTS `tblProfile`;
CREATE TABLE `tblProfile` (
  `UserId` int(11) NOT NULL,
  `SubjectId` int(11) NOT NULL,
  `LevelId` int(11) NOT NULL,
  KEY `UserId` (`UserId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblProfile`
-- ----------------------------
BEGIN;
INSERT INTO `tblProfile` VALUES ('1', '1', '1'), ('1', '2', '1');
COMMIT;

-- ----------------------------
--  Table structure for `tblQtn`
-- ----------------------------
DROP TABLE IF EXISTS `tblQtn`;
CREATE TABLE `tblQtn` (
  `QtnId` int(11) NOT NULL AUTO_INCREMENT,
  `Path` varchar(64) NOT NULL,
  `LevelId` int(11) NOT NULL,
  `SubjectId` int(11) NOT NULL,
  `DifficultyId` int(11) NOT NULL,
  `TopicId` int(11) NOT NULL,
  `Type` varchar(8) NOT NULL,
  PRIMARY KEY (`QtnId`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblQtn`
-- ----------------------------
BEGIN;
INSERT INTO `tblQtn` VALUES ('1', '../res/DMTPra_P1_01A_0_MCQ_01_Qns.swf', '1', '1', '1', '1', 'MCQ'), ('2', '../res/DMTPra_P1_01A_0_MCQ_02_Qns.swf', '1', '1', '1', '1', 'MCQ'), ('3', '../res/DMTPra_P1_01A_0_MCQ_03_Qns.swf', '1', '1', '1', '1', 'MCQ'), ('4', '../res/DMTPra_P1_01A_0_MCQ_04_Qns.swf', '1', '1', '1', '2', 'MCQ'), ('5', '../res/DMTPra_P1_01A_0_MCQ_05_Qns.swf', '1', '1', '1', '2', 'MCQ'), ('6', '../res/DMTPra_P1_01A_0_MCQ_06_Qns.swf', '1', '2', '1', '6', 'MCQ'), ('7', '../res/DMTPra_P1_01A_0_MCQ_07_Qns.swf', '1', '1', '1', '3', 'MCQ'), ('8', '../res/DMTPra_P1_01A_0_MCQ_08_Qns.swf', '1', '2', '1', '7', 'MCQ'), ('9', '../res/DMTPra_P1_01A_0_MCQ_09_Qns.swf', '1', '1', '1', '4', 'MCQ'), ('10', '../res/DMTPra_P1_01A_0_MCQ_10_Qns.swf', '1', '1', '2', '4', 'MCQ'), ('11', '../res/DMTPra_P1_01A_0_MCQ_11_Qns.swf', '1', '1', '1', '5', 'MCQ'), ('12', '../res/DMTPra_P1_01A_0_MCQ_12_Qns.swf', '1', '1', '1', '5', 'MCQ'), ('13', '../res/DMTPra_P1_01A_0_MCQ_13_Qns.swf', '1', '1', '1', '5', 'MCQ'), ('14', '../res/DMTPra_P1_01A_0_MCQ_14_Qns.swf', '1', '2', '1', '7', 'MCQ'), ('15', '../res/DMTPra_P1_01A_0_MCQ_15_Qns.swf', '1', '1', '1', '1', 'MCQ');
COMMIT;

-- ----------------------------
--  Table structure for `tblQtnDone`
-- ----------------------------
DROP TABLE IF EXISTS `tblQtnDone`;
CREATE TABLE `tblQtnDone` (
  `Id` int(11) NOT NULL,
  `QtnId` int(11) NOT NULL,
  `Correct` tinyint(4) NOT NULL,
  `Favorite` tinytext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblQtnDone`
-- ----------------------------
BEGIN;
INSERT INTO `tblQtnDone` VALUES ('166', '3', '0', '1'), ('166', '2', '0', '0'), ('166', '1', '1', '1'), ('152', '15', '1', '0'), ('153', '4', '1', '0'), ('153', '5', '1', '1'), ('154', '11', '0', '0'), ('155', '12', '1', '0'), ('156', '12', '0', '0'), ('157', '13', '1', '0'), ('157', '11', '1', '0'), ('158', '13', '1', '0'), ('158', '11', '1', '0'), ('159', '13', '0', '0'), ('159', '11', '0', '0'), ('160', '13', '0', '0'), ('160', '11', '0', '0'), ('161', '13', '0', '0'), ('161', '11', '0', '0'), ('162', '11', '1', '0'), ('162', '12', '1', '0'), ('163', '11', '1', '0'), ('163', '12', '0', '0'), ('167', '6', '1', '0'), ('168', '8', '0', '0'), ('168', '9', '1', '0'), ('169', '1', '0', '0'), ('169', '2', '0', '0');
COMMIT;

-- ----------------------------
--  Table structure for `tblQtnGrp`
-- ----------------------------
DROP TABLE IF EXISTS `tblQtnGrp`;
CREATE TABLE `tblQtnGrp` (
  `TestId` int(11) unsigned NOT NULL,
  `QtnId` int(11) unsigned NOT NULL,
  `Order` int(11) unsigned NOT NULL,
  `Tag` varchar(8) DEFAULT NULL,
  `Header` varchar(64) DEFAULT NULL,
  KEY `TestId` (`TestId`),
  KEY `QtnId` (`QtnId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblQtnGrp`
-- ----------------------------
BEGIN;
INSERT INTO `tblQtnGrp` VALUES ('1', '1', '1', null, null), ('1', '2', '2', null, null), ('1', '3', '3', null, null), ('2', '4', '1', null, null), ('2', '5', '2', null, null), ('3', '6', '1', null, null), ('4', '7', '2', null, null), ('13', '8', '2', null, null), ('153', '5', '2', null, null), ('13', '14', '1', null, null), ('10', '15', '1', null, null), ('8', '8', '4', null, null), ('8', '9', '5', null, null), ('9', '1', '1', null, null), ('9', '2', '1', null, null), ('153', '2', '1', null, null), ('11', '11', '4', null, null), ('11', '10', '5', null, null), ('135', '4', '1', null, null), ('135', '5', '2', null, null), ('135', '7', '3', null, null), ('135', '11', '4', null, null), ('136', '4', '1', null, null), ('136', '5', '2', null, null), ('136', '7', '3', null, null), ('136', '12', '4', null, null), ('137', '5', '1', null, null), ('137', '7', '2', null, null), ('137', '13', '3', null, null), ('138', '5', '1', null, null), ('138', '7', '2', null, null), ('138', '13', '3', null, null), ('139', '5', '1', null, null), ('139', '7', '2', null, null), ('139', '13', '3', null, null), ('140', '5', '1', null, null), ('140', '7', '2', null, null), ('140', '11', '3', null, null), ('141', '5', '1', null, null), ('141', '7', '2', null, null), ('141', '11', '3', null, null), ('142', '5', '1', null, null), ('142', '7', '2', null, null), ('142', '11', '3', null, null), ('143', '5', '1', null, null), ('143', '7', '2', null, null), ('143', '12', '3', null, null), ('144', '5', '1', null, null), ('144', '7', '2', null, null), ('144', '13', '3', null, null), ('145', '5', '1', null, null), ('145', '7', '2', null, null), ('145', '11', '3', null, null), ('146', '5', '1', null, null), ('146', '7', '2', null, null), ('146', '11', '3', null, null), ('147', '5', '1', null, null), ('147', '7', '2', null, null), ('147', '11', '3', null, null), ('148', '5', '1', null, null), ('148', '7', '2', null, null), ('148', '11', '3', null, null), ('149', '5', '1', null, null), ('149', '7', '2', null, null), ('149', '11', '3', null, null), ('150', '5', '1', null, null), ('150', '4', '2', null, null), ('150', '11', '3', null, null), ('151', '4', '1', null, null), ('151', '12', '2', null, null), ('152', '15', '1', null, null), ('152', '2', '2', null, null), ('152', '5', '3', null, null), ('152', '11', '4', null, null), ('153', '12', '3', null, null), ('154', '2', '1', null, null), ('154', '5', '2', null, null), ('154', '13', '3', null, null), ('155', '15', '1', null, null), ('155', '2', '2', null, null), ('155', '3', '3', null, null), ('157', '2', '1', null, null), ('157', '3', '2', null, null), ('157', '15', '3', null, null), ('158', '15', '1', null, null), ('159', '11', '1', null, null), ('160', '12', '1', null, null), ('161', '12', '1', null, null), ('162', '13', '1', null, null), ('162', '11', '2', null, null), ('163', '13', '1', null, null), ('163', '11', '2', null, null), ('164', '13', '1', null, null), ('164', '11', '2', null, null), ('165', '13', '1', null, null), ('165', '11', '2', null, null), ('166', '13', '1', null, null), ('166', '11', '2', null, null), ('167', '11', '1', null, null), ('167', '12', '2', null, null), ('168', '11', '1', null, null), ('168', '12', '2', null, null), ('169', '11', '1', null, null), ('169', '12', '2', null, null);
COMMIT;

-- ----------------------------
--  Table structure for `tblSession`
-- ----------------------------
DROP TABLE IF EXISTS `tblSession`;
CREATE TABLE `tblSession` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `UpdateN` tinyint(4) DEFAULT '0',
  `SessionKey` varchar(32) DEFAULT NULL,
  `IdUser` int(11) unsigned NOT NULL,
  `Role` tinyint(11) DEFAULT '0',
  `DateAccess` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblSession`
-- ----------------------------
BEGIN;
INSERT INTO `tblSession` VALUES ('71', '1', '', '1', '1', null);
COMMIT;

-- ----------------------------
--  Table structure for `tblTest`
-- ----------------------------
DROP TABLE IF EXISTS `tblTest`;
CREATE TABLE `tblTest` (
  `TestId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `BookId` int(11) DEFAULT NULL,
  `Title` varchar(64) DEFAULT NULL,
  `Section` varchar(64) DEFAULT NULL,
  `Type` varchar(8) NOT NULL,
  `SubjectId` int(11) NOT NULL,
  `LevelId` int(11) NOT NULL,
  PRIMARY KEY (`TestId`)
) ENGINE=MyISAM AUTO_INCREMENT=170 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblTest`
-- ----------------------------
BEGIN;
INSERT INTO `tblTest` VALUES ('1', '1', 'Worksheet 1 - Counting', 'Unit 1', 'Test', '1', '1'), ('2', '1', 'Worksheet 2 - Place Value', 'Unit 1', 'Test', '1', '1'), ('3', '1', 'Worksheet 3 - Comparing, Order And Pattern', 'Unit 1', 'Test', '1', '1'), ('4', '1', 'Worksheet 1 - Meaning Of Sum', 'Unit 2', 'Test', '1', '1'), ('5', '1', 'Worksheet 2 - Simple Addition Within 10 000', 'Unit 2', 'Test', '1', '1'), ('6', '1', 'Worksheet 1 - Meaning Of Difference', 'Unit 3', 'Test', '1', '1'), ('7', '1', 'Worksheet 2 - Simple Subtraction Within 10 000', 'Unit 3', 'Test', '1', '1'), ('8', '2', 'Comparing Volume', 'Chapter 1', 'Test', '1', '1'), ('9', '2', 'Measuring In Litres', 'Chapter 1', 'Test', '1', '1'), ('10', '2', 'Finding The Volume', 'Chapter 1', 'Test', '1', '1'), ('11', '2', 'Identifying Patterns', 'Chapter 2', 'Test', '1', '1'), ('12', '2', 'Completing Patterns', 'Chatper 2', 'Test', '1', '1'), ('13', '3', 'Revision Paper 1', 'Section I', 'Test', '2', '1'), ('14', '3', 'Revision Paper 2', 'Section I', 'Test', '2', '1'), ('15', '3', 'Practice Examination Paper 1', 'Section II', 'Test', '2', '1'), ('16', '3', 'Practice Examination Paper 2', 'Section II', 'Test', '2', '1'), ('17', '6', 'Worksheet 1 - A World Of Books', 'Unit 1', 'Test', '3', '1'), ('18', '6', 'Worksheet 2 - Fascinating Oceans', 'Unit 2', 'Test', '3', '1'), ('20', '4', 'Narrative', 'Unit 1', 'Test', '3', '1'), ('21', '4', 'Information Report', 'Unit 2', 'Test', '3', '1'), ('22', '4', 'Recount', 'Unit 3', 'Test', '3', '1'), ('23', '4', 'Short Functional Text', 'Unit 4', 'Test', '3', '1'), ('24', '5', 'Numbers up to 100 000', 'Unit 1', 'Test', '1', '1'), ('25', '5', 'Multiplication and Division', 'Unit 2', 'Test', '1', '1'), ('26', '5', 'Factors and Multiples', 'Unit 3', 'Test', '1', '1'), ('27', '5', 'Mixed Numbers and Improper Fractions', 'Unit 4', 'Test', '1', '1'), ('28', '5', 'Addition, Subtraction and Multiplication of Fraction', 'Unit 5', 'Test', '1', '1'), ('29', '5', 'Angles', 'Unit 6', 'Test', '1', '1'), ('167', null, 'Quiz 1', '', 'Quiz', '1', '1'), ('168', null, 'Quiz 2', '', 'Quiz', '1', '1'), ('169', null, 'Quiz 2', '', 'Quiz', '1', '1');
COMMIT;

-- ----------------------------
--  Table structure for `tblTestDone`
-- ----------------------------
DROP TABLE IF EXISTS `tblTestDone`;
CREATE TABLE `tblTestDone` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `TestId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Correct` int(11) NOT NULL,
  `Total` int(11) NOT NULL,
  `Start` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `End` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Raw` varchar(8192) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=170 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblTestDone`
-- ----------------------------
BEGIN;
INSERT INTO `tblTestDone` VALUES ('166', '1', '1', '1', '3', '2011-05-16 16:20:19', '2011-05-16 16:20:40', 'eyJSYXciOlt7IlF0bklkIjoiMSIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSx0cnVlLGZhbHNlLGZhbHNlXX0seyJRdG5JZCI6IjIiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsZmFsc2UsdHJ1ZV19LHsiUXRuSWQiOiIzIiwieFVzZXJEYXRhTGlzdCI6W3RydWUsZmFsc2UsZmFsc2UsZmFsc2VdfV19'), ('152', '158', '1', '1', '1', '2011-05-13 21:29:21', '2011-05-13 21:29:31', 'eyJSYXciOlt7IlF0bklkIjoiMTUiLCJ4VXNlckRhdGFMaXN0IjpbdHJ1ZSxmYWxzZSxmYWxzZSxmYWxzZV19XX0='), ('153', '2', '1', '2', '2', '2011-05-13 21:29:47', '2011-05-13 21:29:56', 'eyJSYXciOlt7IlF0bklkIjoiNCIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSxmYWxzZSx0cnVlXX0seyJRdG5JZCI6IjUiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsdHJ1ZSxmYWxzZV19XX0='), ('154', '159', '1', '0', '1', '2011-05-13 21:43:52', '2011-05-13 21:43:57', 'eyJSYXciOlt7IlF0bklkIjoiMTEiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsdHJ1ZSxmYWxzZSxmYWxzZV19XX0='), ('155', '160', '1', '1', '1', '2011-05-13 21:44:28', '2011-05-13 21:44:33', 'eyJSYXciOlt7IlF0bklkIjoiMTIiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsdHJ1ZSxmYWxzZV19XX0='), ('156', '161', '1', '0', '1', '2011-05-13 21:44:46', '2011-05-13 21:44:50', 'eyJSYXciOlt7IlF0bklkIjoiMTIiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsZmFsc2UsdHJ1ZV19XX0='), ('157', '162', '1', '2', '2', '2011-05-16 10:09:29', '2011-05-16 10:09:44', 'eyJSYXciOlt7IlF0bklkIjoiMTMiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsZmFsc2UsdHJ1ZV19LHsiUXRuSWQiOiIxMSIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSx0cnVlLGZhbHNlXX1dfQ=='), ('158', '163', '1', '2', '2', '2011-05-16 10:11:20', '2011-05-16 10:11:26', 'eyJSYXciOlt7IlF0bklkIjoiMTMiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsZmFsc2UsdHJ1ZV19LHsiUXRuSWQiOiIxMSIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSx0cnVlLGZhbHNlXX1dfQ=='), ('159', '164', '1', '0', '2', '2011-05-16 10:15:27', '2011-05-16 10:15:49', 'eyJSYXciOlt7IlF0bklkIjoiMTMiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsdHJ1ZSxmYWxzZSxmYWxzZV19LHsiUXRuSWQiOiIxMSIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSx0cnVlLGZhbHNlXX1dfQ=='), ('160', '165', '1', '0', '2', '2011-05-16 10:16:35', '2011-05-16 10:16:40', 'eyJSYXciOlt7IlF0bklkIjoiMTMiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsdHJ1ZSxmYWxzZSxmYWxzZV19LHsiUXRuSWQiOiIxMSIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSx0cnVlLGZhbHNlXX1dfQ=='), ('161', '166', '1', '0', '2', '2011-05-16 10:16:44', '2011-05-16 10:17:24', 'eyJSYXciOlt7IlF0bklkIjoiMTMiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsdHJ1ZSxmYWxzZSxmYWxzZV19LHsiUXRuSWQiOiIxMSIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSx0cnVlLGZhbHNlXX1dfQ=='), ('162', '167', '1', '2', '2', '2011-05-16 10:38:38', '2011-05-16 10:38:50', 'eyJSYXciOlt7IlF0bklkIjoiMTEiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsdHJ1ZSxmYWxzZV19LHsiUXRuSWQiOiIxMiIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSx0cnVlLGZhbHNlXX1dfQ=='), ('163', '169', '1', '1', '2', '2011-05-16 10:48:00', '2011-05-16 10:48:10', 'eyJSYXciOlt7IlF0bklkIjoiMTEiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsdHJ1ZSxmYWxzZV19LHsiUXRuSWQiOiIxMiIsInhVc2VyRGF0YUxpc3QiOlt0cnVlLGZhbHNlLGZhbHNlLGZhbHNlXX1dfQ=='), ('167', '3', '1', '1', '1', '2011-05-16 16:27:08', '2011-05-16 16:27:15', 'eyJSYXciOlt7IlF0bklkIjoiNiIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSxmYWxzZSx0cnVlXX1dfQ=='), ('168', '8', '1', '1', '2', '2011-05-16 16:27:31', '2011-05-16 16:27:39', 'eyJSYXciOlt7IlF0bklkIjoiOCIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSx0cnVlLGZhbHNlXX0seyJRdG5JZCI6IjkiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsZmFsc2UsdHJ1ZV19XX0='), ('169', '9', '1', '0', '2', '2011-05-16 16:28:29', '2011-05-16 16:28:38', 'eyJSYXciOlt7IlF0bklkIjoiMSIsInhVc2VyRGF0YUxpc3QiOltmYWxzZSxmYWxzZSxmYWxzZSx0cnVlXX0seyJRdG5JZCI6IjIiLCJ4VXNlckRhdGFMaXN0IjpbZmFsc2UsZmFsc2UsZmFsc2UsdHJ1ZV19XX0=');
COMMIT;

-- ----------------------------
--  Table structure for `tblTopic`
-- ----------------------------
DROP TABLE IF EXISTS `tblTopic`;
CREATE TABLE `tblTopic` (
  `TopicId` int(11) NOT NULL AUTO_INCREMENT,
  `SubjectId` int(11) NOT NULL,
  `Topic` varchar(64) NOT NULL,
  PRIMARY KEY (`TopicId`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblTopic`
-- ----------------------------
BEGIN;
INSERT INTO `tblTopic` VALUES ('1', '1', 'Numbers'), ('2', '1', 'Subtraction'), ('3', '1', 'Addition'), ('4', '1', 'Multiplication'), ('5', '1', 'Division'), ('6', '2', 'Earth'), ('7', '2', 'Energy');
COMMIT;

-- ----------------------------
--  Table structure for `tblUser`
-- ----------------------------
DROP TABLE IF EXISTS `tblUser`;
CREATE TABLE `tblUser` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Username` varchar(32) NOT NULL,
  `Password` varchar(32) NOT NULL,
  `FullName` varchar(64) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `login_id` (`Username`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `tblUser`
-- ----------------------------
BEGIN;
INSERT INTO `tblUser` VALUES ('1', 'cherwah', 'cherwah', 'Tan Cher Wah');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
