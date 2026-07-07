# 社区生鲜配送平台后端管理系统

## 技术栈

- **后端**: Node.js + Express + TypeScript
- **数据库**: MySQL 8.0
- **ORM**: Prisma
- **认证**: JWT
- **文件上传**: multer
- **容器化**: Docker + docker-compose

## 项目结构

```
backend/
├── src/
│   ├── controllers/     # 控制器
│   ├── routes/          # 路由
│   ├── middleware/      # 中间件
│   ├── services/        # 业务逻辑
│   ├── utils/           # 工具函数
│   ├── types/           # 类型定义
│   └── server.ts        # 入口文件
├── prisma/              # Prisma配置
├── uploads/             # 上传文件目录
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 启动方式

### Docker启动

```bash
docker-compose up -d
```

服务启动后：
- 后端服务: http://localhost:3000
- MySQL: localhost:3306 (用户名: fresh_user, 密码: fresh_password, 数据库: fresh_delivery)

### 本地开发

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

## API接口文档

### 基础响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 1. 认证接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |

**注册请求:**
```json
{
  "phone": "13800138000",
  "password": "123456",
  "nickname": "张三"
}
```

**登录请求:**
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

### 2. 用户接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/users/profile` | GET | 获取用户信息 |
| `/api/users/profile` | PUT | 更新用户信息 |
| `/api/users/avatar` | POST | 上传头像 |
| `/api/users/addresses` | POST | 添加地址 |
| `/api/users/addresses` | GET | 获取地址列表 |
| `/api/users/addresses/:id` | PUT | 更新地址 |
| `/api/users/addresses/:id` | DELETE | 删除地址 |
| `/api/users/points/logs` | GET | 获取积分记录 |

### 2.5 购物车接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/cart` | POST | 添加商品到购物车 |
| `/api/cart` | GET | 获取购物车列表 |
| `/api/cart/count` | GET | 获取购物车商品数量 |
| `/api/cart/:id` | PUT | 更新购物车商品数量 |
| `/api/cart/:id` | DELETE | 删除购物车商品 |
| `/api/cart` | DELETE | 清空购物车 |

**添加购物车请求:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**更新数量请求:**
```json
{
  "quantity": 3
}
```

### 3. 商品接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/products/categories` | POST | 创建分类 |
| `/api/products/categories` | GET | 获取分类列表 |
| `/api/products/categories/:id` | GET | 获取分类详情 |
| `/api/products/categories/:id` | PUT | 更新分类 |
| `/api/products/categories/:id` | DELETE | 删除分类 |
| `/api/products` | POST | 创建商品 |
| `/api/products` | GET | 获取商品列表 |
| `/api/products/:id` | GET | 获取商品详情 |
| `/api/products/:id` | PUT | 更新商品 |
| `/api/products/:id/image` | POST | 上传商品图片 |
| `/api/products/:id` | DELETE | 删除商品(下架) |
| `/api/products/stock/alert` | GET | 获取库存预警商品 |

**创建商品请求:**
```json
{
  "categoryId": 1,
  "name": "西红柿",
  "description": "新鲜西红柿",
  "originalPrice": 5.99,
  "salePrice": 4.99,
  "vipPrice": 4.49,
  "stock": 100,
  "minStock": 10,
  "unit": "斤"
}
```

### 4. 订单接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/orders` | POST | 创建订单 |
| `/api/orders` | GET | 获取订单列表 |
| `/api/orders/:id` | GET | 获取订单详情 |
| `/api/orders/no/:orderNo` | GET | 按订单号查询 |
| `/api/orders/pay` | POST | 支付订单 |
| `/api/orders/cancel/:orderNo` | POST | 取消订单 |
| `/api/orders/refund/:orderNo` | POST | 退款 |
| `/api/orders/deliver/:orderNo` | POST | 开始配送 |
| `/api/orders/complete/:orderNo` | POST | 完成订单 |
| `/api/orders/evaluations` | POST | 创建评价 |
| `/api/orders/evaluations` | GET | 获取评价列表 |

**创建订单请求（直接指定商品）:**
```json
{
  "addressId": 1,
  "items": [
    { "productId": 1, "quantity": 2 }
  ],
  "pointUsed": 100
}
```

**创建订单请求（从购物车结算）:**
```json
{
  "addressId": 1,
  "useCart": true,
  "pointUsed": 100
}
```

**支付请求:**
```json
{
  "orderNo": "DD20240101123456"
}
```

### 5. 配送接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/delivery/staff` | POST | 注册配送员 |
| `/api/delivery/staff` | GET | 获取配送员列表 |
| `/api/delivery/staff/:id` | GET | 获取配送员详情 |
| `/api/delivery/staff/:id` | PUT | 更新配送员 |
| `/api/delivery/staff/:id` | DELETE | 删除配送员 |
| `/api/delivery/assign/:orderId` | POST | 分配配送员 |
| `/api/delivery/traces/:orderId` | GET | 获取配送轨迹 |
| `/api/delivery/position/:orderId` | POST | 更新配送位置 |

### 6. 统计接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/stats/dashboard` | GET | 获取仪表盘数据 |
| `/api/stats/orders?type=week` | GET | 获取订单统计 |
| `/api/stats/users?type=week` | GET | 获取用户统计 |
| `/api/stats/products/sales?limit=10` | GET | 获取商品销量排行 |
| `/api/stats/delivery` | GET | 获取配送统计 |

## 订单状态流转

```
待支付 → 已支付 → 待配送 → 配送中 → 已完成
    ↓           ↓
  已取消      已退款
```

## 积分规则

- 下单支付后获得积分：支付金额 × 10
- 积分抵扣：100积分 = 1元
- VIP用户额外享受5%折扣

## 数据库表结构

- `users` - 用户表
- `user_addresses` - 用户地址表
- `categories` - 商品分类表
- `products` - 商品表
- `orders` - 订单表
- `order_items` - 订单明细表
- `delivery_staff` - 配送员表
- `delivery_traces` - 配送轨迹表
- `evaluations` - 评价表
- `point_logs` - 积分记录表