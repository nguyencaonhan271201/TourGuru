-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 09, 2022 at 05:52 PM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tourguru2`
--

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
CREATE TABLE IF NOT EXISTS `businesses` (
  `business_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ' https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&token=e9312c19-c34e-4a87-9a72-552532766cde',
  `business_type` int(11) NOT NULL,
  `biz_user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`business_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `businesses`
--

INSERT INTO `businesses` (`business_id`, `business_name`, `business_code`, `mail`, `password`, `image`, `business_type`, `biz_user_id`) VALUES
(1, 'Vietnam Airlines', 'VN', 'cpbo2022@gmail.com', '$2y$10$NQFWKtQdazQT3Ep6CpRiY.Z6R.pFiN9KkBYmjlnYy./iNgCS.LUVK', '../../../shared/assets/images/businesses/61f4e1b9dfc691.14810732.jpeg', 0, 'E6hwPQwxt4fsBi0gOj5xMfsd6x42'),
(3, 'The Reverie Saigon', '', 'nguyencaonhan002@gmail.com', '$2y$10$biDaTpkE1K.4TXtsaEkceunllAXtYaiD.UdZ2sFvgt5cCT5OA4b7.', '../../../shared/assets/images/businesses/6251b7264dce29.54194240.jpeg', 1, '6vN44qDTjnS3WgoioqIAPbNuioy2'),
(4, 'Singapore Airlines', 'SQ', 'doctor.nguyencaonhan@gmail.com', '$2y$10$OgXmu5e4CflurQHib0akWOVxv9eoh5IuGWVhaG22tu4aZrPPHEK/i', '../../../shared/assets/images/businesses/624eecab202c15.88694194.jpeg', 0, '6mq7SYs8q6ShHViT3lc4UDCwdGf2');

-- --------------------------------------------------------

--
-- Table structure for table `communication_details`
--

DROP TABLE IF EXISTS `communication_details`;
CREATE TABLE IF NOT EXISTS `communication_details` (
  `comm_detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `comm_id` int(11) NOT NULL,
  `hotel_booking_id` int(11) DEFAULT NULL,
  `flight_booking_id` int(11) DEFAULT NULL,
  `restaurant_booking_id` int(11) DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comm_detail_id`),
  KEY `fk_comm_details_comm` (`comm_id`),
  KEY `fk_comm_details_flight` (`flight_booking_id`),
  KEY `fk_comm_details_hotel` (`hotel_booking_id`),
  KEY `fk_comm_details_restaurant` (`restaurant_booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flight_bookings`
--

DROP TABLE IF EXISTS `flight_bookings`;
CREATE TABLE IF NOT EXISTS `flight_bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '2: rejected\r\n1: approved\r\n0: pending',
  `total_cost` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_booked` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_flight_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flight_bookings`
--

INSERT INTO `flight_bookings` (`id`, `user_id`, `status`, `total_cost`, `date_booked`) VALUES
(2, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 2, '10153879.66 VND', '2022-03-30 00:19:10'),
(3, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 1, '82627231.83 VND', '2022-04-03 01:39:30');

-- --------------------------------------------------------

--
-- Table structure for table `flight_bookings_customers`
--

DROP TABLE IF EXISTS `flight_bookings_customers`;
CREATE TABLE IF NOT EXISTS `flight_bookings_customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `title` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passport` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_flightcust_bookings` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flight_bookings_customers`
--

INSERT INTO `flight_bookings_customers` (`id`, `booking_id`, `title`, `display_name`, `dob`, `passport`) VALUES
(3, 2, 'Mr', 'CAO NHAN NGUYEN', '2001-12-27', 'ABCD12345'),
(4, 3, 'Mr', 'CAO NHAN NGUYEN', '2001-12-27', 'ABCD12345');

-- --------------------------------------------------------

--
-- Table structure for table `flight_bookings_iterations`
--

DROP TABLE IF EXISTS `flight_bookings_iterations`;
CREATE TABLE IF NOT EXISTS `flight_bookings_iterations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `origin_code` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dest_code` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `origin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departure` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arrival` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aircraft` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `airline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flight_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_flightiter_bookings` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flight_bookings_iterations`
--

INSERT INTO `flight_bookings_iterations` (`id`, `booking_id`, `origin_code`, `dest_code`, `origin`, `destination`, `departure`, `arrival`, `date`, `class`, `aircraft`, `airline`, `flight_number`) VALUES
(3, 2, 'SGN', 'HAN', 'Tan Son Nhut Intl Airport', 'Noi-Bai Airport', '09:00', '11:10', '2022-04-17', 'ECONOMY', 'Boeing 787', 'Vietnam Airlines', 'VN244'),
(4, 2, 'HAN', 'SGN', 'Noi-Bai Airport', 'Tan Son Nhut Intl Airport', '09:00', '11:15', '2022-04-20', 'ECONOMY', 'Boeing 787', 'Vietnam Airlines', 'VN209'),
(5, 3, 'SIN', 'NRT', 'Changi Intl Airport', 'Narita Intl Airport', '06:35', '14:30', '2022-04-23', 'BUSINESS', 'Boeing 787-9', 'ANA All Nippon Airways', 'NH802'),
(6, 3, 'NRT', 'SIN', 'Narita Intl Airport', 'Changi Intl Airport', '19:00', '01:40', '2022-04-26', 'BUSINESS', 'Boeing 777-300ER', 'Singapore Airlines', 'SQ11');

-- --------------------------------------------------------

--
-- Table structure for table `guest_business_communications`
--

DROP TABLE IF EXISTS `guest_business_communications`;
CREATE TABLE IF NOT EXISTS `guest_business_communications` (
  `comm_id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `reply_of` int(11) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comm_id`),
  KEY `fk_guest_biz_biz` (`business_id`),
  KEY `fk_guest_biz_guest` (`user_id`),
  KEY `fk_reply` (`reply_of`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `guest_business_communications`
--

INSERT INTO `guest_business_communications` (`comm_id`, `business_id`, `user_id`, `content`, `reply_of`, `created`) VALUES
(1, 1, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 'I have a question', NULL, '2022-04-06 23:58:22'),
(3, 1, NULL, 'Reply you with this', 1, '2022-04-06 23:59:04'),
(7, 1, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 'Aloha 243', NULL, '2022-04-07 00:19:41'),
(8, 3, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 'Aloha 243', NULL, '2022-04-07 00:20:46'),
(9, 3, NULL, 'Aloha 243 Reply Hotel', 8, '2022-04-07 00:23:36'),
(10, 1, NULL, 'Aloha 243 Reply Flight', 7, '2022-04-07 00:24:25'),
(11, 1, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 'Can I ask why my bookings were rejected?', NULL, '2022-04-09 20:54:13'),
(12, 3, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 'I would like to ask if I can get an early check-in for my booking. Thank you so much', NULL, '2022-04-10 00:06:17'),
(13, 3, NULL, 'Yes sir, we are five stars hotel and you are always welcomed', 12, '2022-04-10 00:07:23');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
CREATE TABLE IF NOT EXISTS `hotels` (
  `hotel_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stars` double NOT NULL,
  PRIMARY KEY (`hotel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`hotel_id`, `name`, `image_url`, `address`, `stars`) VALUES
(8, 'Days Hotel by Wyndham Singapore at Zhongshan Park (SG Clean)', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/185343125.jpg?k=b43efd3162e6ab6a5f29e18114f6e3d8e7560201544ab39799a0996e10f19724&o=', '1 Jalan Rajah, Novena, Singapore, Singapore', 3),
(16, 'The Reverie Saigon', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/116897997.jpg?k=5c58ff711f0105a382dab9d44a41c1ceb69bbc096b6d33ae9ef2617cd56081e9&o=', '22-36 Nguyen Hue Boulevard, District 1, Ho Chi Minh City, Vietnam', 5);

-- --------------------------------------------------------

--
-- Table structure for table `hotel_bookings`
--

DROP TABLE IF EXISTS `hotel_bookings`;
CREATE TABLE IF NOT EXISTS `hotel_bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_start` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_end` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_of_nights` int(11) NOT NULL,
  `hotel_id` int(11) DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0' COMMENT '2: rejected\r\n1: approved\r\n0: pending',
  `date_booked` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_cost` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hotelbook_user` (`user_id`),
  KEY `fk_hotelbook_hotel` (`hotel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotel_bookings`
--

INSERT INTO `hotel_bookings` (`id`, `user_id`, `date_start`, `date_end`, `number_of_nights`, `hotel_id`, `approved`, `date_booked`, `total_cost`) VALUES
(20, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', '2022-04-13', '2022-04-16', 3, 8, 1, '2022-04-06 00:48:48', '25,526,873.10 VND'),
(26, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', '2022-04-13', '2022-04-16', 3, 16, 1, '2022-04-10 00:03:40', '38,061,045.00 VND');

-- --------------------------------------------------------

--
-- Table structure for table `hotel_booking_details`
--

DROP TABLE IF EXISTS `hotel_booking_details`;
CREATE TABLE IF NOT EXISTS `hotel_booking_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `room_name` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `room_image` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `number_of_room` int(11) NOT NULL,
  `single_cost` double NOT NULL,
  `currency` varchar(5) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_hotel_booking_detail_booking` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `hotel_booking_details`
--

INSERT INTO `hotel_booking_details` (`id`, `booking_id`, `room_name`, `room_image`, `number_of_room`, `single_cost`, `currency`, `date_created`) VALUES
(13, 20, 'Standard Twin Room - Free cancellation - Non-Smoking', 'https://cf.bstatic.com/xdata/images/hotel/max500/319991012.jpg?k=3bc603114710cd5f3bdf3279a71a2a570e990fd02f8a0bb951d1175802095133&o=', 2, 4956674.388059701, 'VND', '2022-02-09 00:48:48'),
(14, 20, 'Superior Queen Room - Free cancellation - Non-Smoking', 'https://cf.bstatic.com/xdata/images/hotel/max500/319991009.jpg?k=986bcb1fe812bf63a759b788bcf4866d80d867b04ac7629795d282f1607b372c&o=', 1, 5700175.546268657, 'VND', '2022-02-09 00:48:48'),
(15, 20, 'Twin Room - single occupancy - Free cancellation - Mobility Access/Non-Smoking', 'https://cf.bstatic.com/xdata/images/hotel/max500/321144326.jpg?k=7b6e03660e40363991282df0825c24a83620bc236bcf959cc93c2fcff0da5131&o=', 2, 4956674.388059701, 'VND', '2022-02-09 00:48:48'),
(32, 26, 'Deluxe Twin Room - Low rate – no money back', 'https://cf.bstatic.com/xdata/images/hotel/max500/44303202.jpg?k=02696dffddff84cbfeac40f9f3b05d169779874f23badf95d86b70a673b5fcf6&o=', 1, 15664113, 'VND', '2022-04-10 00:03:40'),
(33, 26, 'Panorama Deluxe Room - Low rate – no money back', 'https://cf.bstatic.com/xdata/images/hotel/max500/116898058.jpg?k=b0222d29a2a04ec5d55643f1dc67ced108be94e287e3af464fc69d50af222f0d&o=', 1, 22396932, 'VND', '2022-04-10 00:03:40');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
CREATE TABLE IF NOT EXISTS `plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: private\r\n1: public',
  `plan_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `flight_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hotel_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT NULL,
  `updated_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_plan_user` (`user_id`),
  KEY `fk_plan_updated_user` (`updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `user_id`, `mode`, `plan_title`, `description`, `flight_id`, `hotel_id`, `from_date`, `to_date`, `date_created`, `date_updated`, `updated_by`) VALUES
(16, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 0, 'abcdef', 'aloha 243', '', '', '', '', '2022-02-20 10:58:56', NULL, NULL),
(17, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 1, 'whole new plan', 'abcdef', '3', '20', '', '', '2022-02-24 01:45:38', NULL, NULL),
(18, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 0, 'test plan', '', '', '', '', '', '2022-04-05 00:47:27', NULL, NULL),
(26, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 0, 'my plan to somewhere', 'abcdef', '3', '20', '', '', '2022-04-05 16:44:04', NULL, NULL),
(27, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 1, 'Malaysia - 4 ngày 3 đêm', 'Gợi ý kế hoạch chuyến đi tự túc tham quan Malaysia (thủ đô Kuala Lumpur cùng các vùng lân cận) trong 4 ngày 3 đêm', '', '', '', '', '2022-04-06 11:43:57', NULL, NULL),
(31, 'i6hmpSURFQY5gwSVj7noq4isLUg1', 1, 'test plan', 'description', '', '', '', '', '2022-04-10 00:23:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plan_details`
--

DROP TABLE IF EXISTS `plan_details`;
CREATE TABLE IF NOT EXISTS `plan_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_id` int(11) NOT NULL,
  `destination_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destination_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detail` longtext COLLATE utf8mb4_unicode_ci,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destination_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `set_alarmed` tinyint(1) NOT NULL DEFAULT '0',
  `is_alarmed` tinyint(1) NOT NULL DEFAULT '0',
  `minute_alarm` int(11) DEFAULT NULL,
  `date_order` int(11) NOT NULL,
  `time_order` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_plandetail_plan` (`plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plan_details`
--

INSERT INTO `plan_details` (`id`, `plan_id`, `destination_id`, `destination_name`, `detail`, `date`, `start`, `destination_image`, `set_alarmed`, `is_alarmed`, `minute_alarm`, `date_order`, `time_order`) VALUES
(16, 17, '', '', 'wake up', NULL, '07:30', '', 1, 0, 15, 0, 0),
(17, 17, '', '', 'breakfast', NULL, '', '', 0, 0, 0, 0, 1),
(18, 17, '2439664', 'Universal Studios Singapore', 'this place is fun', NULL, '', 'https://media-cdn.tripadvisor.com/media/photo-o/0c/d2/e8/e6/20160903-103506-largejpg.jpg', 0, 0, 0, 0, 2),
(19, 17, '315466', 'Jurong Bird Park', 'birds', NULL, '09:30', 'https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/26/94/a4/flowers.jpg', 1, 0, 5, 1, 0),
(20, 18, '', '', 'abcdef', '2022-03-21', '00:59', '', 1, 0, 5, 0, 0),
(40, 26, '317904', 'Zoo and Botanical Gardens', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-o/0f/14/24/d9/petit-muret-de-presentation.jpg', 0, 0, 0, 0, 0),
(41, 26, '12084531', 'Ben Thanh Night Market', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-m/1280/14/f9/dc/66/ben-thanh-night-market.jpg', 0, 0, 0, 0, 1),
(42, 26, '317890', 'The Independence Palace', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-m/1280/19/36/1a/be/hinh-chinh-di-n-dinh.jpg', 0, 0, 0, 1, 0),
(43, 27, '', '', 'Flight from Vietnam to Kuala Lumpur', '', '', '', 0, 0, 0, 0, 0),
(44, 27, '21194311', 'KL Tower Malaysia', 'Visit KL Tower and observe Kuala Lumpur in 360 degree from a high location', '', '', 'https://media-cdn.tripadvisor.com/media/photo-o/22/69/18/7c/caption.jpg', 0, 0, 0, 0, 1),
(45, 27, '456578', 'Suria KLCC Mall', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-m/1280/19/67/0e/38/located-in-the-heart.jpg', 0, 0, 0, 0, 2),
(46, 27, '17393332', 'Petaling Street Market', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-o/17/79/13/1b/photo1jpg.jpg', 0, 0, 0, 0, 3),
(47, 27, '317521', 'Petronas Twin Towers', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-o/16/6a/ff/d8/kuala-lumpur-petronas.jpg', 0, 0, 0, 1, 0),
(48, 27, '', '', 'Travel by bus from Kuala Lumpur to Kuala Selangor to view fireflies at night', '', '', '', 0, 0, 0, 1, 1),
(49, 27, '3530549', 'Altingsburg Lighthouse', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-o/0c/02/9a/00/lighthouse.jpg', 0, 0, 0, 1, 2),
(50, 27, '', '', 'Travel by bus back to Kuala Lumpur', '', '', '', 0, 0, 0, 1, 3),
(51, 27, '', '', 'Travel to Malacca', '', '', '', 0, 0, 0, 2, 0),
(52, 27, '12471468', 'Malacca UNESCO ', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-o/1a/62/f8/1e/caption.jpg', 0, 0, 0, 2, 1),
(53, 27, '', '', 'Travel to Genting Highlands', '', '', '', 0, 0, 0, 2, 2),
(54, 27, '23297640', 'Genting SkyWorlds Theme Park', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-o/21/d9/ae/2e/above-the-clouds-beyond.jpg', 0, 0, 0, 2, 3),
(55, 27, '317520', 'Batu Caves', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-m/1280/14/30/bf/6f/caption.jpg', 0, 0, 0, 2, 4),
(56, 27, '', '', 'Stay at hotel in Malacca', '', '', '', 0, 0, 0, 2, 5),
(57, 27, '', '', 'Travel back to Kuala Lumpur', '', '', '', 0, 0, 0, 3, 0),
(58, 27, '7618624', 'KLIA Ekspres', '', '', '', 'https://media-cdn.tripadvisor.com/media/photo-o/07/9e/25/51/klia-ekspres.jpg', 0, 0, 0, 3, 1),
(59, 27, '', '', 'Fly back to Vietnam', '', '', '', 0, 0, 0, 3, 2),
(74, 31, '', '', 'wake up', '', '', '', 0, 0, 0, 0, 0),
(75, 31, '', '', 'get ready', '', '', '', 0, 0, 0, 0, 1),
(76, 31, '1130463', 'Ya Kun Kaya Toast', 'breakfast', '', '', 'https://media-cdn.tripadvisor.com/media/photo-s/02/26/2f/f6/toast-with-kaya-jam-and.jpg', 0, 0, 0, 0, 2),
(77, 31, '', '', 'wake me up', '', '', '', 0, 0, 0, 1, 0),
(78, 31, '', '', 'this will be for reminder', '2022-04-10', '00:26', '', 1, 0, 2, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `plan_editors`
--

DROP TABLE IF EXISTS `plan_editors`;
CREATE TABLE IF NOT EXISTS `plan_editors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_plan_editor_plan` (`plan_id`),
  KEY `fk_plan_editor_editor` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `plan_editors`
--

INSERT INTO `plan_editors` (`id`, `plan_id`, `user_id`) VALUES
(24, 16, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1'),
(26, 17, 'gxRWAj31d4hQFJrHmwqwI4GlEOZ2'),
(27, 17, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1'),
(28, 18, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1'),
(50, 26, 'gxRWAj31d4hQFJrHmwqwI4GlEOZ2'),
(51, 26, 'i6hmpSURFQY5gwSVj7noq4isLUg1'),
(52, 26, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1'),
(53, 27, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1'),
(60, 31, 'i6hmpSURFQY5gwSVj7noq4isLUg1'),
(61, 31, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1');

-- --------------------------------------------------------

--
-- Table structure for table `plan_locations`
--

DROP TABLE IF EXISTS `plan_locations`;
CREATE TABLE IF NOT EXISTS `plan_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_id` int(11) NOT NULL,
  `location_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_plan_locations_plan` (`plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plan_locations`
--

INSERT INTO `plan_locations` (`id`, `plan_id`, `location_name`, `location_id`, `location_image`) VALUES
(1, 16, 'Ho Chi Minh City', '293925', 'https://media-cdn.tripadvisor.com/media/photo-o/1b/33/f1/0b/caption.jpg'),
(2, 17, 'Singapore', '294265', 'https://media-cdn.tripadvisor.com/media/photo-o/1b/4b/60/00/caption.jpg'),
(3, 27, 'Malaysia', '293951', 'https://media-cdn.tripadvisor.com/media/photo-o/10/a4/4a/26/langkawi-from-above.jpg'),
(7, 31, 'Singapore', '294265', 'https://media-cdn.tripadvisor.com/media/photo-o/1b/4b/60/00/caption.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '../../shared/assets/images/posts/covers/default.jpg',
  `plan_id` int(11) DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `fk_posts_author` (`author`),
  KEY `fk_posts_category` (`category`),
  KEY `fk_posts_plan` (`plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `author`, `category`, `title`, `description`, `cover`, `plan_id`, `content`, `date_created`, `date_updated`) VALUES
(7, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 1, 'ĐI SINGAPORE CHƠI ĐÂU? Choáng ngợp khi lạc vào Gardens By The Bay', 'Singapore, quốc đảo nhỏ bé ở giữa lòng Đông Nam Á nổi tiếng với sự sạch sẽ, gọn gàng. Nói về thiên nhiên, nơi được mệnh danh là quốc đảo sư tử này không thể sánh bằng các nước trong khu vực. Singapore đôi khi cũng bị nhận xét là không có gì nhiều ngoài những công trình nhân tạo. Ấy thế mà len lỏi giữa những công trình nhân tạo ấy là vô số những cây xanh, từ ngoài trời cho đến trong nhà.', '../../shared/assets/images/posts/covers/623054b9bd5084.27828639.jpeg', NULL, '<p>Và trong hành trình trở lại tiếp tục khám phá Singapore lần này, Travip sẽ đi qua những mảng xanh tuyệt đẹp của quốc đảo sư tử, để các bạn thấy một Singapore tươi xanh như thế nào, đặc biệt là Gardens By The Bay nổi tiếng với không chỉ những thân cây nhân tạo siêu to khổng lồ mà còn là những kỷ lục khác về khu rừng nhiệt đới trong nhà.</p><p><strong>MUA VÉ VÀO GARDENS BY THE BAY:</strong></p><ul><li>Rất đơn giản. Các bạn có thể <a href=\"https://bit.ly/2BkAPRS\">mua vé vào Gardens By The Bay trước trên Klook tại đây</a>.</li><li>Sau đó, để nhận vé, đi tàu điện đến ga Bayfront, tìm đường đến bảo tàng Red Dot để đổi vé cứng, sau đó tiếp tục tìm đường đến trung tâm thương mại The Shoppes at Marina Bay Sands. Việc còn lại bạn cứ nhìn theo biển chỉ dẫn để đi về phía Gardens By The Bay.</li><li>Từ nay đến cuối năm 2019, nhập code TRAVIP6 để được giảm 6% (tối đa 100.000đ) khi mua dịch vụ trên Klook. Mỗi tài khoản dùng code 1 lần.</li></ul><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623054635165a4.12983634.jpeg\"></figure><p>Đã nhiều lần đi Singapore nhưng lần này Travip mới có duyên với Gardens By The Bay, khu vườn khổng lồ trải rộng 101 hectare bên vịnh Marina. Nổi bật giữa khu vườn là những siêu cây cao lớn và 2 nhà kính hình vòm với kiến trúc tương lai. Đó chính là Flower Dome và Cloud Forest, hai công trình được ghi vào sách kỷ lục Guiness là nhà kính lớn nhất thế giới.</p><p>Số liệu trong năm tài chính 2018 cho thấy Garden By The Bays đã đón tới hơn 12 triệu lượt khách tới tham quan. Như vậy, kể từ khi mở cửa, nó đã đón tới 59 triệu lượt khách. Chưa tham quan nhưng nhìn con số này đã đủ thấy sức hút của một công trình nhân tạo rồi.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/6230547596d463.08202641.jpeg\"></figure><p><strong>MUA VÉ VÀO GARDENS BY THE BAY:</strong></p><ul><li>Rất đơn giản. Các bạn có thể <a href=\"https://bit.ly/2BkAPRS\">mua vé vào Gardens By The Bay trước trên Klook tại đây</a>.</li><li>Sau đó, để nhận vé, đi tàu điện đến ga Bayfront, tìm đường đến bảo tàng Red Dot để đổi vé cứng, sau đó tiếp tục tìm đường đến trung tâm thương mại The Shoppes at Marina Bay Sands. Việc còn lại bạn cứ nhìn theo biển chỉ dẫn để đi về phía Gardens By The Bay.</li><li>Từ nay đến cuối năm 2019, nhập code TRAVIP6 để được giảm 6% (tối đa 100.000đ) khi mua dịch vụ trên Klook. Mỗi tài khoản dùng code 1 lần.</li></ul><figure class=\"image\"><img src=\"../../shared/assets/images/posts/62305485c42853.65506852.jpeg\"></figure>', '2022-03-30 15:56:25', '2022-03-30 15:56:25'),
(8, 'gxRWAj31d4hQFJrHmwqwI4GlEOZ2', 5, 'REVIEW: Khách sạn Novotel view biển tuyệt đẹp ở Nha Trang', 'Đến Nha Trang, giữa vô vàn khách sạn thì làm sao để lọc ra những khách sạn giá vừa tầm, có view đẹp, chất lượng tốt? Chuyến vừa rồi anh em nhóm Yêu Máy Bay đã có chuyến đi Nha Trang quay vlog và đã lựa chọn Novotel Nha Trang.', '../../shared/assets/images/posts/covers/623559e0a727b6.31434694.jpeg', NULL, '<p>Novotel thuộc hệ thống Accor. Mình đã dùng thẻ Accor Plus bao năm nay nên không lạ gì dịch vụ ở đây nữa. Nói chung nhiều ưu đãi, tích luỹ, đổi điểm này kia. Bây giờ thì Travip sẽ review từng tiêu chí một nhé:</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/6235577235e5e3.20416774.jpeg\"></figure><p><strong>Địa điểm:</strong></p><p>Novotel Nha Trang là một khách sạn 4 sao không quá bề thế so với các khách sạn khác trên đường Trần Phú. Nhưng cũng chính vì thế mà nó trông khá ấm cúng và yên tĩnh. Nó nằm tại vị trí tuyệt vời khi bên kia đường là công viên bờ biển, chếch 1 chút là quảng trường rộng lớn. Xung quanh khu vực khách sạn là các con phố nhộn nhịp hàng quán, mua sắm, trung tâm thương mại, cửa hàng tiện lợi. Tất cả đều ở trong khoảng cách có thể đi bộ được.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/6235578ac4af43.45220161.jpeg\"></figure><p><strong>Nhận phòng:</strong></p><p>Thủ tục nhận phòng nhanh chóng với thức uống chào mừng (welcome drink). Nhân viên khách sạn sẽ xách đồ lên phòng giúp bạn. Thủ tục nói chung nhanh, không có gì đáng phàn nàn.</p><p><strong>Phòng ở:</strong></p><p>Travip và Hoàng Hà (trong nhóm Yêu Máy Bay) đặt phòng&nbsp; tiêu chuẩn (Standard room) với 2 giường (twin bed room). Không gian phòng vừa phải, không quá lớn nhưng không có cảm giác chật hẹp. Điều đó nhờ vào ban công nhìn ra biển bên ngoài.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/6235579e67fb27.38949818.jpeg\"></figure><p>May mắn Travip được sắp ở phòng tầng cao, hướng nhìn một góc Vịnh Nha Trang với đường Trần Phú cong cong ôm lấy bờ vịnh. Buổi chiều ngồi đây cực kỳ mát và không bị nắng chiếu vào.</p><p>Quầy minibar đầy đủ các thức uống miễn phí cơ bản như nước suối, trà, cà phê. Trà có các loại trà ngon của Việt Nam và Sri Lanka. Tủ mát bên dưới có các thức uống tính phí, trong đó có nước suối Đảnh Thạnh của địa phương và nước suối cao cấp Evian.</p><p>Điểm nhấn của khu vực minibar là các món đồ lưu niệm dễ thương của Novotel Nha Trang như thú nhồi bông, vịt cao su hay kính vạn quá. Bạn có thể mua các món đồ này ngay từ phòng ngủ của mình với mức giá không đắt đỏ chú nào.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623557b74b3cf6.17984357.jpeg\"></figure><p>Không gian buồng tắm là nơi Travip cực kỳ hài lòng. Giữa buồng tắm và phòng ngủ có vách ngăn bằng kính trong suốt khiến không gian buồng tắm sáng sủa và rộng rãi hơn. Nếu bạn cần sự riêng tư khi đang tắm thì đã có tấm vách ngăn có thể di chuyển để che lại.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623557c8585674.98335326.jpeg\"></figure>', '2022-03-31 11:10:51', '2022-03-31 11:19:44'),
(9, 'i6hmpSURFQY5gwSVj7noq4isLUg1', 4, 'Trip Report: Emirates First Class B777-300/ER – The Latest Changes', 'I travelled to Portugal to visit AirNav Radarbox, to gain an insight on how flight tracking works. On my way back, I flew on an Emirates B777-300/ER from Lisbon to Dubai in First Class.', '../../shared/assets/images/posts/covers/623e94613d30e9.00366979.jpeg', NULL, '<h3>Emirates First Class Redemption Limitation</h3><p>This was an award ticket which was redeemed from my Japan Airlines Mileage Bank, the cost was 65,000 miles. This was probably going to be my last Emirates First Class award ticket from JAL, as Emirates is tightening the First Class redemption requirements from partners. From September, only Emirates Skywards and Qantas frequent flyers can continue to redeem on Emirates First Class.</p><p>For JAL Mileage bank members: Effective from September 1st 2021, new bookings for First Award Tickets with Emirates (EK) will not be accepted. First Class Award tickets that have been already booked, and with miles that have already been deducted, and ticketed by August 31st 2021 can still be used for travel on Emirates on/after September 1st 2021.</p><h3>TAP Premium Lounge Lisbon</h3><p>My journey started at Lisbon Airport. Emirates First and Business customers can use the TAP Premium Lounge. This modern lounge was quite good in my opinion, there were decent food and beverage options with a good set up for social distancing. The TAP lounge also offers a good view of the apron.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e931bab3612.89784367.jpeg\"><figcaption>TAP Premium Lounge Lisbon</figcaption></figure><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e933a2cba63.00372600.jpeg\"><figcaption>TAP Premium Lounge Lisbon</figcaption></figure><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e93455e5617.89951787.jpeg\"><figcaption>TAP Premium Lounge Lisbon</figcaption></figure><h3>Emirates B777-300/ER First Class</h3><p>Out of the 8 First Class Suites available on this flight, 6 were occupied. During COVID, these First Class suites have been in high demand; this is due to their extensive privacy and the ability to close the suite door.</p><p>The registration of my flight was A6-EGY, a B777-300/ER delivered in 2012. Flight time to Dubai was 7 hours, which makes Lisbon one of the longest European flights to Dubai; being that Portugal is located in the most western part of the European continent.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e93624d6225.75484870.jpeg\"></figure><p>On the ground the flight attendants offered only Business Class champagne. However after take-off Dom Perignon 2008 champagne was served, along with warm nuts and canapes.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e93767c0da1.78880014.jpeg\"></figure><p>We took off and flew over Southern Spain; we then flew across the Med towards Algeria, avoiding Libya airspace of course. Our journey then took us over Tunisia, Egypt and Saudi Arabia to our destination in Dubai.</p><p>Given this was a daylight flight, no pyjamas or amenity kits were offered. There were however individually packaged eyeshades and socks available.</p><p>The menu out of Lisbon is really great. I firmly believe that Emirates flights out of Europe have the best catering. The Lisbon flight catering reflects local Portuguese cuisine.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e939c73e0d0.66722742.jpeg\"><figcaption>Emirates First Class Caviar</figcaption></figure><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e93a0d5d738.31163477.jpeg\"><figcaption>2nd course was codfish \"bacalhau\" salad.</figcaption></figure><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e93b17bee37.76061813.jpeg\"><figcaption>Instead of meat, I opted for a mushroom risotto.</figcaption></figure><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e93b70785c5.07399433.jpeg\"><figcaption>Warm dessert - Chocolate cake pudding</figcaption></figure><p>The food was excellent in both taste and presentation.</p><p>On my flight, new headsets from Bowers &amp; Wilkins were provided. Theses headsets are considerably lighter than the previous Bose offerings.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e93e3ad0fa0.36076246.jpeg\"></figure><p>I dont know why, but I was HUNGRY again before landing! The flight attendant recommended trying out the Portuguese Mezze \"Petiscos\". It was actually a really large variety of snacks include dips, pickles, codfish, octopus, salad and fried prawns.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e93fb92c6f1.48082794.jpeg\"><figcaption>Portuguese Mezze \"Petiscos\"</figcaption></figure><p>Our flight landed just after midnight in Dubai, which is the typical arrival time for hub operations in Dubai. Once at the gate in Dubai, all the First Class passengers were expedited and escorted to the arrival formality area. This is a new service which has started during COVID.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e9415623ac5.44052389.jpeg\"></figure><h3>Summary</h3><p>Overall Emirates has maintained a high level of service in First Class. The catering was particularly excellent out of Lisbon. With the removal of First Class redemption ability from many mileage partners, flying on Emirates First Class using miles will become more difficult. The next best option may be using Skyward Miles for an upgrade to First Class.</p>', '2022-04-02 11:18:44', '2022-04-02 11:19:45'),
(10, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 3, 'Ăn cơm gà Hải Nam kiểu Singapore chuẩn vị ở Sài Gòn', 'Năm nay có duyên với Singapore hơi nhiều. Vài lần đi Singapore từ đầu năm đến giờ, tham gia workshop về Singapore và giờ thì bớt nhớ đồ ăn Singapore hơn khi có tiệm cơm gà Singapore ngay tại Sài Gòn.', '../../shared/assets/images/posts/covers/623e95f4738182.45098278.jpeg', NULL, '<p>Tiệm Cơm gà Singapore 99 ở địa chỉ 99 Võ Văn Tần, P.6, Quận 3, TP.HCM mới khai trương đây thôi nhưng Travip được giới thiệu tới ăn thử vì nghe nói có đầu bếp chuẩn Singapore qua nấu.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e9533942ed2.81878241.jpeg\"></figure><p>Và được nghe nữa là những món trong quán đều được lấy công thức từ một gia đình có thâm niên làm nhà hàng 30 năm ở Singapore.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e953c561620.01037305.jpeg\"></figure><p>Đầu tiên là món “signature” của quán giá 55.000đ. Món cơm gà Hải Nam kiểu Singapore. Nhiều bạn chắc không còn lạ gì với món cơm này. Riêng cơm tại quán thì mình có hỏi đầu bếp thì được biết cơm được nấu qua nhiều công đoạn bằng nước luộc gà, rồi gạo cũng được chọn loại sao cho hạt cơm khi nấu lên vẫn tơi ra nhưng không bị dính quá chặt vào nhau. Riêng gà thì không bị bở như gà công nghiệp, ăn mềm, dai vừa.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e954bb185f5.97395277.jpeg\"></figure><p>Nước sốt để rưới lên gà cũng là công thức riêng do đầu bếp chế.</p><p>Ngoài ra thì tương ớt ăn với cơm gà do đầu bếp tự làm và có nhiều độ cay khác nhau để bạn chấm với gà, rưới lên cơm ăn. Riêng Travip thì thích ăn theo kiểu chấm gà rồi ăn cơm riêng chứ không rưới lên cơm vì quả thực cơm rất ngon và đậm đà nên muốn ăn riêng để thưởng thức.</p><p>Cách ăn cơm thì cũng có cách riêng để thưởng thức. Ban đầu, hãy lấy một miếng cơm không và ăn để thưởng thức vị ngon của cơm rồi sau đó mới ăn cơm với gà hay nước chấm kèm theo.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e955f9ce964.12657138.jpeg\"></figure><p>Tiếp theo là cơm thịt xá xíu. Không giống với thịt xá xíu thường là ướp mật ong. Xá xíu ở đây ướp bằng mạch nha. Một thành phần rất Việt Nam. Cũng vì lẽ đó mà vị xá xíu ngon lạ. Bảo sao quán để hẳn trong thực đơn là món “signature” (món tạo điểm nhấn).</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e9573899e11.53141879.jpeg\"></figure><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e95781723a4.92571290.jpeg\"></figure><p>Xá xíu có thể ăn riêng hoặc ăn với cơm gà. Giá 55.000đ. Đĩa xá xíu đặc biệt loại nhỏ 109.000đ.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e958babfc85.35107381.jpeg\"></figure><p>Bạn cũng có thể thử món gà quay kampong, một trong những món được nói là bán chạy kể từ khi quán khai trương. Giá 55.000đ.</p><p>Rau muống xào tôm sốt samba thì sao? Ngon lạ à nghen! Không giống rau muống xào bên Việt Nam mình. Món rau muống xào tôm này có nước sốt đặc biệt có đủ các vị mặn, ngọt, cay cùng vị tôm đậm đà ăn với cơm trắng hay cơm gà đều ngon. Bạn có thể gọi ăn kèm với món cơm. Giá 89.000đ.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e95a76e47e2.55495210.jpeg\"></figure><p>Lần thứ hai đến ăn quán mình có gọi thử món cải bó xôi xốt 3 loại trứng: trứng thường, trứng muối, trứng bắc thảo. Cũng là món lạ miệng. Giá 89.000đ.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e95d8610667.89920896.jpeg\"></figure><p>Ngoài ra thức uống độc đáo có nước Green Detox và nước Red Velvet thành phần tươi ngon. Giá 45.000đ.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e95e6a50f08.61623792.jpeg\"></figure><p><strong>Cơm gà Singapore 99</strong><br>Địa chỉ: 99 Võ Văn Tần, P.6, Quận 3, TP.HCM</p>', '2022-04-02 11:26:28', '2022-04-02 11:26:28'),
(11, 'gxRWAj31d4hQFJrHmwqwI4GlEOZ2', 2, 'DU LỊCH MALAYSIA: Cẩm nang chơi Kuala Lumpur và vùng phụ cận', 'Đang vào mùa hạ, thành phố thì chật chội náo nức, khói bụi ngột ngạt. Thôi chi bằng đi Malaysia đổi gió, cũng đông đúc nhưng nhiều cây xanh, sạch sẽ, nhiều món ngon vật lạ, chi phí lại rẻ.\nTrong bài này, Travip gợi ý cho các bạn lịch trình ăn chơi chớp nhoáng Kuala Lumpur 3 ngày 2 đêm, 4 ngày 3 đêm và 5 ngày 4 đêm nếu bạn muốn kéo dài ra nhé! Malaysia chưa bao giờ hết chỗ chơi đâu ạ, mà sao ít người để ý quá. Uổng ghê!', '../../shared/assets/images/posts/covers/623e974499de79.97300837.jpeg', NULL, '<p><strong>Chọn đường bay:</strong></p><p>Hiện nay từ Việt Nam sang Kuala Lumpur có quá trời chuyến bay. Liệt kê ra thôi cũng mệt. Giá vé ư? Nhiều khi rẻ hơn bay trong nước nghen!</p><ul><li>Từ Hà Nội: Vietnam Airlines, Malaysia Airlines, Malindo Air, AirAsia</li><li>Từ TP. Hồ Chí Minh: Vietnam Airlines, Malaysia Airlines, Malindo Air, AirAsia, VietJet Air</li><li>Từ Đà Nẵng và Nha Trang: AirAsia</li></ul><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e96b911e971.36380786.jpeg\"></figure><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e96bce1a444.45723949.jpeg\"></figure><p><i>Bay bằng Malaysia Airlines là một gợi ý vì chất lượng “hịn”, giá cả hạng thương gia và phổ thông đều ổn, nhiều khi rất rẻ nữa.</i></p><p><i><strong>***Lưu ý đặc biệt khi nhập cảnh Malaysia:</strong></i></p><ul><li>Hộ chiếu của bạn phải còn hạn ít nhất 6 tháng khi nhập cảnh vào Malaysia</li><li>Hộ chiếu của bạn phải còn ít nhất <strong>MỘT TRANG TRỐNG</strong> khi nhập cảnh vào Malaysia để tránh nguy cơ bị từ chối nhập cảnh (mặc dù trên mạng nhiều trường hợp kể rằng không vấn đề gì, miễn còn chỗ đóng dấu nhưng quy định là vậy nên mình cứ đề phòng).</li><li>In sẵn vé máy bay, lịch trình (nếu có), đặt phòng khách sạn để lỡ nhân viên xuất nhập cảnh hỏi ngẫu nhiên.</li></ul><p><strong>Di chuyển từ sân bay về trung tâm Kuala Lumpur:</strong></p><p>Có nhiều cách để đi từ sân bay Kuala Lumpur về trung tâm thành phố. Bạn có thể chọn taxi, xe buýt nhưng kinh nghiệm của Travip là đi tàu điện tốc hành cho nhanh và thoải mái. Tại sao? Tại mua vé trên Klook xong dùng chính code Klook gửi xuống ga dí màn hình điện thoại vô máy quét là xong. Không cần ra quầy mua vé, không lằng nhằng. Đi ngay và luôn.</p><p>Từ nhà ga KLIA hoặc KLIA2, bạn có thể đi theo bảng chỉ dẫn để xuống ga tàu điện. Siêu dễ siêu nhanh nhé! Cứ nhìn theo biển KLIA Ekspres màu hồng hồng tím tím là được.</p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e96d7a84d05.96074205.jpeg\"></figure><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e96dab6b184.54127393.jpeg\"></figure><p><i>Travip thích đi tàu KLIA Ekspres. Lần nào qua cũng đi vì nhanh, tiện, ngồi thoải mái, thoáng đãng.</i></p><p><i><strong>Mua vé ở đâu?</strong></i> Các bạn có thể mua trên Klook với link dưới đây. Sau khi mua vé xong Klook sẽ gửi voucher có mã vạch cho bạn. Bạn cầm điện thoại có mã vạch dí vô máy quét tại cửa vô là xong, khỏi in ra, khỏi ra quầy đổi vé cứng! Thích thì in mã vạch ra giấy cầm dí cũng được.</p><ul><li><a href=\"https://affiliate.klook.com/jump/vi/activity/1461-klia-ekspres-airport-express-kuala-lumpur/?adid=20469&amp;af_wid=1374\">Vé tàu nhanh KLIA Ekspres</a><img src=\"http://affiliate.klook.com/pixel/20469\"></li></ul><p><strong>Đi lại ở Kuala Lumpur:</strong></p><p>Kuala Lumpur là thành phố đi lại khá thuận tiện với đủ loại phương tiện như xe buýt, tàu điện ngầm, tàu điện trên cao, monorail, v.v… Không thì gọi taxi và nhất là Grab thì dễ không còn gì để nói. Ngoài ra sử dụng xe buýt Hop On Hop Off cũng là cách đi lại và tham quan các điểm đến hot trong thành phố một cách dễ dàng, lại tiện lợi, đỡ phải tìm đường nhiều.</p><ul><li><a href=\"https://affiliate.klook.com/jump/vi/activity/8383-kl-hop-on-hop-off-kuala-lumpur/?adid=20476&amp;af_wid=1374\">Xe buýt Hop on Hop Off ở Kuala Lumpur</a><img src=\"http://affiliate.klook.com/pixel/20476\"> mua tại đây.</li></ul><p><i><strong>***Lưu ý:</strong></i> Google Maps vẫn là công cụ tìm đường hiệu quả khi đi du lịch.</p><p><strong>Mua SIM, thuê cục phát wifi như thế nào?</strong></p><p>Tất cả đều là 4G hết nhé, dù bạn mua SIM hay thuê cục phát wifi. Bạn có thể đặt trước trên Klook và nhận tại sân bay theo hướng dẫn trong e-mail khi đặt. Như mình hạ cánh xuống KLIA thì sau khi lấy hành lý ra ngoài thì đến quầy của TuneTalk ngay chỗ ra.</p><p><i><strong>Mua/thuê ở đâu?</strong></i></p><ul><li><a href=\"https://affiliate.klook.com/jump/vi/activity/1336-wifi-device-malaysia-kuala-lumpur/?adid=20470&amp;af_wid=1374\">Wifi 4G (nhận tại sân bay Kuala Lumpur)</a><img src=\"http://affiliate.klook.com/pixel/20470\"></li><li><a href=\"https://affiliate.klook.com/jump/vi/activity/1893-sim-card-kuala-lumpur/?adid=20471&amp;af_wid=1374\">SIM 4G (nhận tại sân bay Kuala Lumpur)</a><img src=\"http://affiliate.klook.com/pixel/20471\"></li></ul><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e97066b9f78.23281765.jpeg\"><figcaption><i>Quầy lấy SIM và cục phát wifi 4G đã đặt mua trước trên Klook ở đây nè. Ra khỏi chỗ lấy hành lý là thấy.</i></figcaption></figure>', '2022-04-03 11:32:04', '2022-04-03 22:04:36'),
(12, 'i6hmpSURFQY5gwSVj7noq4isLUg1', 6, 'Hướng dẫn cách tính toán chi phí cho chuyến đi', 'Tính toán chi phí cho chuyến đi là 1 công đoạn quan trọng trong việc lên kế hoạch đi chơo. Nhiều bạn vướng phải rào cản này đầu tiên. Các bạn sẽ thắc mắc đi 1 nơi nào đó với từng đó ngày hết bao nhiêu tiền hoặc mình có đủ tiền để đi không.', '../../shared/assets/images/posts/covers/623e97e18dca64.64463042.jpeg', NULL, '<p>Đây cũng là vấn đề mà Travip nhận được nhiều câu hỏi nhất và thú thật, không phải lúc nào Travip cũng trả lời được vì nhiều bạn hỏi rất chung chung, kiểu như đi Thái thì hết bao nhiêu tiền. Với câu hỏi đó, mình không thể nào trả lời được vì không biết bạn đi bao nhiêu ngày, ở kiểu gì, đi những đâu. Thôi thì trong bài này mình hệ thống lại cách tính toán chuyến đi nhé. Nhưng dù làm gì thì mình cũng khuyên các bạn nên tự thân vận động, tự mình mày mò làm rồi sẽ quen.</p><p>Thực ra việc tính toán chi phí không quá phức tạp đâu. Có mấy loại chi phí chính sau đây:</p><p><strong>1.Vé máy bay:</strong></p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e9784c9de25.51530237.jpeg\"></figure><p>Đây là điều đầu tiên bạn nghĩ đến. Để đi chơi thì cần vé máy bay (trừ 1 số nơi đi xe hoặc đi tàu). Bạn cần biết được bay đến đó và bay về thì hết bao nhiêu tiền.</p><p>Dò vé hết bao nhiêu tiền? Dễ thôi. Xem xem có bao nhiêu hãng bay tới nơi đó. Vào trang web từng hãng một dò vé xem hãng nào rẻ nhất hoặc giá hợp lý nhất với nhu cầu của bạn thì mua. Bạn không biết trang web của hãng hàng không đó ư? Hỏi anh Google là ra. Trang web của một số hãng thông dụng:</p><ul><li>Vietnam Airlines:&nbsp;www.vietnamairlines.com</li><li>Jetstar Pacific:&nbsp;www.jetstar.com</li><li>VietJet Air:&nbsp;vietjetair.com</li><li>AirAsia:&nbsp;www.airasia.com</li><li>Malaysia Airlines:&nbsp;malaysiaairlines.com</li><li>Thai Airways:&nbsp;www.thaiairways.com</li><li>Singapore Airlines:&nbsp;www.singaporeair.com</li></ul><p>Mấy hãng khác các bạn tự tra Google nha. Dễ lắm.</p><p>Còn lười ư? Cứ việc vào mấy trang dò vé tổng hợp như SkyScanner.com, <a href=\"http://travip.me/traveloka/\">Traveloka</a>.com này nọ để coi vé.</p><p>Trường hợp “xấu nhất” bạn không thể làm những bước này, hãy ra phòng vé hoặc 1 đại lý vé nào đó để họ tìm và bán vé cho bạn.</p><p><strong>2.Khách sạn/chỗ ở:</strong></p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e979bbc7b33.99090144.jpeg\"></figure><p>Di chuyển xong rồi thì tới chỗ ở. Bạn dự kiến ở nơi đó bao nhiêu ngày? Xác định cụ thể nhé vì nó ảnh hưởng tới việc đặt phòng khách sạn đó. Để kiếm khách sạn rẻ hoặc giá hợp lý với nhu cầu thì dễ lắm. Đừng hỏi tìm khách sạn rẻ ở đâu hay tìm khách sạn nào tốt. Đừng hỏi! Thiệt. Vô luôn mấy trang như Agoda.com, Booking.com hay Traveloka rồi nhập vào điểm đến, thời gian ở. Mấy trang đó sẽ liệt kê ra vô vàn các khách sạn để bạn chọn. Mỗi khách sạn đều có nhận xét của khách đã ở nên không lo chọn trúng khách sạn tệ.</p><p><strong>3.Các chi phí di chuyển khác:&nbsp;</strong></p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e97ab005631.77032180.jpeg\"></figure><p>Khi đến một nơi nào đó để du lịch, bạn có dự định đi đâu tiếp không? Đi tàu lửa, tàu cao tốc, tàu điện, xe hay bay nội địa chẳng hạn? Lên mạng tìm hiểu thông tin, liệt kê các chi phí này ra nhé. Thường thì xe buýt hay tàu đều có thông tin về giá cả cho từng chặng đi trên mạng. Đầy rẫy các bạn ạ. Thông tin la liệt. Hãy bóc lột anh Google nhiều vào.</p><p>Nếu đi lại trong thành phố mà “chẳng may” ở đó có Uber nữa thì bạn có thể dò trước chi phí chuyến đi ở địa chỉ:&nbsp;<a href=\"https://www.uber.com/vi-VN/cities/\">https://www.uber.com/vi-VN/cities/</a></p><p>Vô đây xong chọn 1 thành phố mà bạn sắp đến. Sau đó click vào “Nhận ước tính cước phí” là ra hết.</p><p><strong>4.Ăn uống:</strong></p><figure class=\"image\"><img src=\"../../shared/assets/images/posts/623e97b913cfc2.84764326.jpeg\"></figure><p>Đi, ở xong rồi. Hai khoản bự nhất đấy! Giờ qua đồ ăn nha. Nói thật thì đi các nơi không khó để kiếm đồ ăn rẻ đâu các bạn ạ. Người bản địa ăn sao mình cứ ăn như vậy. Giá cả ăn uống thì mình không thể liệt kê ra cho các bạn rồi vì mình không biết các bạn ăn sang hay ăn tiết kiệm, và nhất là các bạn ăn ở đâu vì mỗi nơi giá cả mỗi khác.</p><p>Mặt khác, chuyện ăn uống chi tiêu mỗi ngày còn phụ thuộc vào việc bạn có bao nhiêu tiền và bạn dự kiến chia ra mỗi ngày tiêu bao nhiêu. Đem theo đồ ăn từ nhà đi cũng là 1 ý hay nhưng mình khuyên đã đi du lịch thì nên tận hưởng món ăn địa phương. Đồ ăn hè phố thì chẳng đắt đến nỗi bạn không mua nổi đâu.</p><p>Thậm chí, bạn muốn ăn ở 1 nơi nào đó được người ta nhắc nhiều? Hãy lên TripAdvisor hoặc các fanpage của họ trên Facebook xem review là rõ giá cả với chất lượng liền.</p><p><strong>5.Khoản dự phòng:</strong></p><p>Đi, ăn, ở xong rồi. Còn mấy chi phí lặt vặt khác như mua đồ lưu niệm, mua quà thì bạn tự định liệu nhé. Tuy nhiên, làm gì thì làm, luôn phải có 1 khoản dự phòng trong người để phòng khi có bất trắc, bất ổn, thiên tai, địch họa tại nơi đang đến thì còn có tiền mà “cuốn gói” về nước. Cái này quan trọng. Khoản dự phòng này cũng không cố định, tùy theo khả năng của bạn nhưng theo mình thì ít nhất cũng phải có 100$ dằn túi nhé. Đừng dự kiến tiêu bao nhiêu chỉ mang bấy nhiêu. Lỡ có chuyện bất trắc là “bế tắc” luôn đó.</p><p>Ngoài ra, các loại thẻ thanh toán quốc tế (cả ghi nợ-debit và tín dụng-credit) đều quan trọng và nên mang theo người.</p><p>___</p><p>Hướng dẫn này chỉ là cơ bản. Trong quá trình tính toán chi phi bạn sẽ phải cân đo đong đếm nhiều và cứ làm hoài thì sẽ thành kỹ năng, các bạn nhé! </p>', '2022-04-04 11:34:41', '2022-04-04 11:34:41'),
(13, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 7, 'Malaysia - 4 ngày 3 đêm', 'Chia sẻ kế hoạch chuyến đi du lịch Malaysia trong 4 ngày 3 đêm', '../../shared/assets/images/posts/covers/623e9adcc76a35.55805309.jpeg', 27, '<p>Chia sẻ kế hoạch chuyến đi du lịch Malaysia trong 4 ngày 3 đêm, tham quan thủ đô Kuala Lumpur và các vùng lân cận.</p>', '2022-04-06 11:45:13', '2022-04-06 11:47:24'),
(14, 'i6hmpSURFQY5gwSVj7noq4isLUg1', 7, 'Go to Singapore with me', 'Go to Singapore with me', '../../shared/assets/images/posts/covers/default.jpg', 31, '<p>Go to Singapore with me</p>', '2022-04-10 00:26:31', '2022-04-10 00:26:31');

-- --------------------------------------------------------

--
-- Table structure for table `post_categories`
--

DROP TABLE IF EXISTS `post_categories`;
CREATE TABLE IF NOT EXISTS `post_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_categories`
--

INSERT INTO `post_categories` (`category_id`, `category_name`, `date_created`) VALUES
(1, 'Attractions', '2022-03-06 23:13:31'),
(2, 'Trip Review', '2022-03-06 23:13:31'),
(3, 'Food Review', '2022-03-06 23:13:45'),
(4, 'Flight Experience', '2022-03-06 23:13:45'),
(5, 'Hotel Experience', '2022-03-06 23:14:17'),
(6, 'Travel Tips', '2022-03-06 23:14:17'),
(7, 'Travel Plans', '2022-03-26 11:45:13');

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

DROP TABLE IF EXISTS `post_comments`;
CREATE TABLE IF NOT EXISTS `post_comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `child_of` int(11) DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `fk_comment_post` (`post_id`),
  KEY `fk_comment_author` (`author`),
  KEY `fk_comment_comment` (`child_of`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_comments`
--

INSERT INTO `post_comments` (`comment_id`, `post_id`, `author`, `content`, `date_created`, `child_of`) VALUES
(1, 11, 'i6hmpSURFQY5gwSVj7noq4isLUg1', 'edit a comment', '2022-04-10 00:30:33', NULL),
(2, 11, 'i6hmpSURFQY5gwSVj7noq4isLUg1', 'this is a reply', '2022-04-10 00:31:06', 1);

-- --------------------------------------------------------

--
-- Table structure for table `post_reactions`
--

DROP TABLE IF EXISTS `post_reactions`;
CREATE TABLE IF NOT EXISTS `post_reactions` (
  `reaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reaction_type` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reaction_id`),
  KEY `fk_reaction_post` (`post_id`),
  KEY `fk_reaction_author` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_reactions`
--

INSERT INTO `post_reactions` (`reaction_id`, `post_id`, `user_id`, `reaction_type`, `date_created`) VALUES
(7, 7, 'i6hmpSURFQY5gwSVj7noq4isLUg1', 7, '2022-03-17 01:17:01'),
(8, 7, 'gxRWAj31d4hQFJrHmwqwI4GlEOZ2', 3, '2022-03-17 01:22:34'),
(12, 7, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 1, '2022-03-17 16:02:30'),
(14, 8, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 3, '2022-03-19 11:19:54'),
(15, 13, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 4, '2022-03-26 15:05:41'),
(16, 12, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', 3, '2022-04-03 12:37:12'),
(18, 11, 'i6hmpSURFQY5gwSVj7noq4isLUg1', 3, '2022-04-10 00:29:34');

-- --------------------------------------------------------

--
-- Table structure for table `post_star_ratings`
--

DROP TABLE IF EXISTS `post_star_ratings`;
CREATE TABLE IF NOT EXISTS `post_star_ratings` (
  `rating_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rating_id`),
  KEY `fk_star_post` (`post_id`),
  KEY `fk_star_author` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `restaurant_bookings`
--

DROP TABLE IF EXISTS `restaurant_bookings`;
CREATE TABLE IF NOT EXISTS `restaurant_bookings` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `restaurant_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `restaurant_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_of_people` int(11) NOT NULL,
  `price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved` tinyint(1) NOT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `fk_res_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vote` float DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_review_user` (`author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` int(11) NOT NULL DEFAULT '1' COMMENT '0: admin\r\n1: user',
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&token=e9312c19-c34e-4a87-9a72-552532766cde',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `mail`, `password`, `date_created`, `role`, `display_name`, `image`) VALUES
('gxRWAj31d4hQFJrHmwqwI4GlEOZ2', 'nguyencaonhan001@gmail.com', '$2y$10$R6G/bNhauB7N2aZnRKdizePcHsr6fR7WqY590mKegH5svya8O1rmS', '2022-01-30 16:42:05', 0, 'Nguyễn Cao Nhân', '../../shared/assets/images/users/61f65dcb45ecd1.37335470.jpeg'),
('i6hmpSURFQY5gwSVj7noq4isLUg1', 'nguyencaonhan001@gmail.com', NULL, '2022-02-10 01:28:39', 1, 'Cao Nhân Nguyễn', '../../shared/assets/images/users/1.jpg'),
('wlUazc2mRyWBXBNCoZXNCx2GHdl1', 'ncnhan2001@gmail.com', '$2y$10$T9Vwy7Qt0tVG8Dbar4l8DeLdTL2vscRItkOy2WOICBdR5Nlu0oa7C', '2022-02-10 01:40:45', 1, 'Nhân Nguyễn', '../../shared/assets/images/users/2.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `visited_locations`
--

DROP TABLE IF EXISTS `visited_locations`;
CREATE TABLE IF NOT EXISTS `visited_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `region` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_visited_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `visited_locations`
--

INSERT INTO `visited_locations` (`id`, `user_id`, `location_id`, `location_title`, `longitude`, `latitude`, `region`, `date_created`) VALUES
(1, 'wlUazc2mRyWBXBNCoZXNCx2GHdl1', '311075', 'One Pillar Pagoda', 105.8336, 21.03376, 'Asia', '2022-03-22 15:34:38');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `communication_details`
--
ALTER TABLE `communication_details`
  ADD CONSTRAINT `fk_comm_details_comm` FOREIGN KEY (`comm_id`) REFERENCES `guest_business_communications` (`comm_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comm_details_flight` FOREIGN KEY (`flight_booking_id`) REFERENCES `flight_bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comm_details_hotel` FOREIGN KEY (`hotel_booking_id`) REFERENCES `hotel_bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comm_details_restaurant` FOREIGN KEY (`restaurant_booking_id`) REFERENCES `restaurant_bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Constraints for table `flight_bookings`
--
ALTER TABLE `flight_bookings`
  ADD CONSTRAINT `fk_flight_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `flight_bookings_customers`
--
ALTER TABLE `flight_bookings_customers`
  ADD CONSTRAINT `fk_flightcust_bookings` FOREIGN KEY (`booking_id`) REFERENCES `flight_bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `flight_bookings_iterations`
--
ALTER TABLE `flight_bookings_iterations`
  ADD CONSTRAINT `fk_flightiter_bookings` FOREIGN KEY (`booking_id`) REFERENCES `flight_bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `guest_business_communications`
--
ALTER TABLE `guest_business_communications`
  ADD CONSTRAINT `fk_guest_biz_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`business_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_guest_biz_guest` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reply` FOREIGN KEY (`reply_of`) REFERENCES `guest_business_communications` (`comm_id`) ON DELETE CASCADE;

--
-- Constraints for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  ADD CONSTRAINT `fk_hotelbook_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hotelbook_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `hotel_booking_details`
--
ALTER TABLE `hotel_booking_details`
  ADD CONSTRAINT `fk_hotel_booking_detail_booking` FOREIGN KEY (`booking_id`) REFERENCES `hotel_bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `fk_plan_updated_user` FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_plan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `plan_details`
--
ALTER TABLE `plan_details`
  ADD CONSTRAINT `fk_plandetail_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `plan_editors`
--
ALTER TABLE `plan_editors`
  ADD CONSTRAINT `fk_plan_editor_editor` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_plan_editor_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `plan_locations`
--
ALTER TABLE `plan_locations`
  ADD CONSTRAINT `fk_plan_locations_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_author` FOREIGN KEY (`author`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_posts_category` FOREIGN KEY (`category`) REFERENCES `post_categories` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_posts_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `fk_comment_author` FOREIGN KEY (`author`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comment_comment` FOREIGN KEY (`child_of`) REFERENCES `post_comments` (`comment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE;

--
-- Constraints for table `post_reactions`
--
ALTER TABLE `post_reactions`
  ADD CONSTRAINT `fk_reaction_author` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reaction_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE;

--
-- Constraints for table `post_star_ratings`
--
ALTER TABLE `post_star_ratings`
  ADD CONSTRAINT `fk_star_author` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_star_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE;

--
-- Constraints for table `restaurant_bookings`
--
ALTER TABLE `restaurant_bookings`
  ADD CONSTRAINT `fk_res_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`author`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `visited_locations`
--
ALTER TABLE `visited_locations`
  ADD CONSTRAINT `fk_visited_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
