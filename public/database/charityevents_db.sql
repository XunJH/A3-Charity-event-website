SET FOREIGN_KEY_CHECKS = 0;   -- ✅ 临时关闭外键约束

CREATE DATABASE IF NOT EXISTS charityevents_db;
USE charityevents_db;

DROP TABLE IF EXISTS charity_events;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT INTO categories (name) VALUES
('教育支持'), ('社区援助'), ('培训发展');

CREATE TABLE charity_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  event_date DATE NOT NULL,
  location VARCHAR(150) NOT NULL,
  category_id INT,
  goal_amount DECIMAL(12,2),
  raised_amount DECIMAL(12,2),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO charity_events (title, event_date, location, category_id, goal_amount, raised_amount) VALUES
('山区儿童助学计划', '2025-11-10', '昆明市青少年宫', 1, 20000.00, 12500.00),
('捐书筑梦行动', '2025-10-25', '成都市图书馆', 1, 10000.00, 8500.00),
('爱心支教招募', '2025-12-01', '贵州省黔东南', 1, 8000.00, 3000.00),
('农村学校电脑捐赠', '2025-10-18', '南宁市志愿者中心', 2, 15000.00, 12000.00),
('希望小学文具募捐', '2025-10-28', '西安市儿童宫', 2, 12000.00, 6000.00),
('青少年英语公益培训', '2025-11-05', '上海市浦东新区', 3, 9000.00, 5400.00),
('乡村教师培训计划', '2025-12-10', '合肥市教育局', 3, 16000.00, 8200.00),
('贫困地区助学金发放', '2025-11-20', '重庆市社会服务中心', 2, 20000.00, 15500.00);

SET FOREIGN_KEY_CHECKS = 1;   -- ✅ 重新开启外键约束
