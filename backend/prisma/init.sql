USE fresh_delivery;

INSERT INTO categories (name, icon, sort, status) VALUES
('蔬菜', '🥬', 1, 1),
('水果', '🍎', 2, 1),
('肉类', '🥩', 3, 1),
('海鲜', '🦐', 4, 1),
('乳品', '🥛', 5, 1),
('蛋类', '🥚', 6, 1),
('豆制品', '🧈', 7, 1),
('粮油', '🌾', 8, 1);

INSERT INTO delivery_staff (phone, password, name, avatar, idCard, status, totalOrders, completedOrders) VALUES
('13800138001', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '张三', '', '110101199001011234', 1, 0, 0),
('13800138002', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '李四', '', '110101199002022345', 1, 0, 0),
('13800138003', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '王五', '', '110101199003033456', 1, 0, 0);