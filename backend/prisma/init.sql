USE fresh_delivery;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  icon VARCHAR(10) DEFAULT '',
  sort INT DEFAULT 0,
  status BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50) NOT NULL,
  avatar VARCHAR(255) DEFAULT '',
  idCard VARCHAR(50) DEFAULT '',
  status INT DEFAULT 0,
  totalOrders INT DEFAULT 0,
  completedOrders INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO categories (name, icon, sort, status) SELECT * FROM (
  SELECT '蔬菜' AS name, '🥬' AS icon, 1 AS sort, 1 AS status UNION ALL
  SELECT '水果', '🍎', 2, 1 UNION ALL
  SELECT '肉类', '🥩', 3, 1 UNION ALL
  SELECT '海鲜', '🦐', 4, 1 UNION ALL
  SELECT '乳品', '🥛', 5, 1 UNION ALL
  SELECT '蛋类', '🥚', 6, 1 UNION ALL
  SELECT '豆制品', '🧈', 7, 1 UNION ALL
  SELECT '粮油', '🌾', 8, 1
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM categories);

INSERT INTO delivery_staff (phone, password, name, avatar, idCard, status, totalOrders, completedOrders) SELECT * FROM (
  SELECT '13800138001' AS phone, '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq' AS password, '张三' AS name, '' AS avatar, '110101199001011234' AS idCard, 1 AS status, 0 AS totalOrders, 0 AS completedOrders UNION ALL
  SELECT '13800138002', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '李四', '', '110101199002022345', 1, 0, 0 UNION ALL
  SELECT '13800138003', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '王五', '', '110101199003033456', 1, 0, 0
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM delivery_staff);