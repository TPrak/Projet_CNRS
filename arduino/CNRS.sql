/*
Navicat MySQL Data Transfer

Source Server         : cnrs
Source Server Version : 50173
Source Host           : mysql.imerir.com:3306
Source Database       : CNRS

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2015-03-20 12:31:51
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for capteurs
-- ----------------------------
DROP TABLE IF EXISTS capteurs;
CREATE TABLE capteurs (
  id_capteur INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nom varchar(255) DEFAULT NULL,
  val_min float DEFAULT NULL,
  val_max float DEFAULT NULL,
  reference varchar(255) DEFAULT NULL,
  unite varchar(255) DEFAULT NULL
);

-- ----------------------------
-- Table structure for donnees
-- ----------------------------
DROP TABLE IF EXISTS donnees;
CREATE TABLE donnees (
  id_donnee INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  id_capteur int(11) DEFAULT NULL,
  val float DEFAULT NULL,
  date_time datetime NOT NULL,
  flag boolean DEFAULT NULL
);
