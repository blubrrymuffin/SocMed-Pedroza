-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2024 at 05:15 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `socialmedia`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `location` varchar(100) NOT NULL,
  `civilStatus` varchar(20) NOT NULL,
  `image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `name`, `username`, `password`, `birthdate`, `gender`, `location`, `civilStatus`, `image`) VALUES
(1, 'John Nico Edisan', 'nico', 'nico', '2024-04-03', 'Male', 'Bungtod, Bogo City, Cebu', 'Single', 'uploads/6625c1a2aa91f_huuuu.jpg'),
(2, 'Izzy Baliguat', 'izzy', 'izzy', '2024-04-17', 'Female', 'Tajao, Toledo City, Cebu', 'Single', 'uploads/662efda088961_kuyabai-baybayin-guide.png'),
(3, 'Avelline Jane Alegada', 'ave', 'ave', '2003-11-26', 'Female', 'Cabitoonan, Toledo City, Cebu', 'In a Relationship', 'uploads/662f03a7257d6_kuyabai-baybayin-guide.png'),
(4, 'Dhaniel Malinao', 'da', 'da', '2019-02-07', 'Male', 'Pelaez, Bogo, City Cebu', 'Single', 'uploads/6625c1331f37e_66252f99a948e_dhaniel.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `comment` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `friend_id`, `postId`, `comment`, `time`) VALUES
(29, 1, 1, 16, 'hello world', '2024-04-24 03:19:38'),
(30, 4, 1, 16, 'nico edisaasdgdszg', '2024-04-24 03:20:28'),
(32, 3, 1, 20, 'asa ni dapit?', '2024-04-29 01:46:15'),
(33, 1, 1, 20, 'sa lugar nga wala ka', '2024-04-29 01:47:40'),
(34, 3, 1, 20, 'nindot ah', '2024-04-29 02:00:18'),
(35, 4, 1, 24, 'hoyyy', '2024-04-29 02:17:49'),
(37, 4, 1, 24, 'hoy gi unsa mana nimo', '2024-05-22 03:03:54'),
(39, 1, 4, 19, 'hoyyyyy', '2024-05-22 03:10:24'),
(40, 4, 1, 24, 'vgbhjkl', '2024-05-22 03:12:10');

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` enum('Accepted','Rejected','','') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `status`, `created_at`) VALUES
(9, 4, 1, 'Accepted', '2024-04-29 01:38:17'),
(10, 3, 1, 'Accepted', '2024-04-29 01:44:14');

-- --------------------------------------------------------

--
-- Table structure for table `friend_request`
--

CREATE TABLE `friend_request` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `status` enum('Pending','Rejected','Accepted','') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likepost`
--

CREATE TABLE `likepost` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `notify` varchar(100) NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likepost`
--

INSERT INTO `likepost` (`id`, `user_id`, `friend_id`, `post_id`, `notify`, `created`) VALUES
(1, 1, 4, 24, 'like on your post', '2024-05-22 02:58:34'),
(2, 1, 4, 24, 'commented on your post', '2024-05-22 03:03:54'),
(3, 19, 1, 4, 'commented on your post', '2024-05-22 03:05:48'),
(4, 1, 4, 24, 'like on your post', '2024-05-22 03:09:15'),
(5, 4, 1, 19, 'commented on your post', '2024-05-22 03:10:24'),
(6, 1, 4, 24, 'commented on your post', '2024-05-22 03:12:10');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `caption` text NOT NULL,
  `imagePost` varchar(100) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `user_id`, `caption`, `imagePost`, `time`) VALUES
(19, 4, 'I am on top of the world!', 'postImage/TeamOS (44).jpg', '2024-04-29 01:31:42'),
(22, 2, 'GWAPO KAY SI LAWRENZ AYY', ' ', '2024-04-29 01:54:02'),
(24, 1, 'hello', 'postImage/John Nico Edisan.bmp', '2024-04-29 02:17:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_id` (`friend_id`),
  ADD KEY `postId` (`postId`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Indexes for table `friend_request`
--
ALTER TABLE `friend_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `likepost`
--
ALTER TABLE `likepost`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `friend_request`
--
ALTER TABLE `friend_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `likepost`
--
ALTER TABLE `likepost`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `friend_request`
--
ALTER TABLE `friend_request`
  ADD CONSTRAINT `friend_request_ibfk_1` FOREIGN KEY (`receiver_id`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `friend_request_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
