-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 31, 2021 at 04:55 PM
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
-- Database: `tourguru`
--

-- --------------------------------------------------------

--
-- Table structure for table `flight_bookings`
--

DROP TABLE IF EXISTS `flight_bookings`;
CREATE TABLE IF NOT EXISTS `flight_bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: active\r\n0: cancelled',
  `total_cost` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_booked` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_flight_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `hotel_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: active\r\n0: cancelled',
  `number_of_beds` int(11) NOT NULL,
  `date_booked` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_cost` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hotelbook_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
CREATE TABLE IF NOT EXISTS `plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `flight_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hotel_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_plan_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `set_alarmed` tinyint(1) NOT NULL DEFAULT '0',
  `is_alarmed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_plandetail_plan` (`plan_id`)
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

-- --------------------------------------------------------

--
-- Table structure for table `visited_locations`
--

DROP TABLE IF EXISTS `visited_locations`;
CREATE TABLE IF NOT EXISTS `visited_locations` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `region` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `fk_visited_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  ADD CONSTRAINT `fk_hotelbook_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `fk_plan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `plan_details`
--
ALTER TABLE `plan_details`
  ADD CONSTRAINT `fk_plandetail_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

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
