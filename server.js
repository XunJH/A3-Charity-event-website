const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件配置 - 允许管理端和客户端跨域
app.use(cors({
  origin: [
    'http://24517241.it.scu.edu.au',  // 客户端域名
    'http://24517241.it.scu.edu.au/admin'  // 管理端域名
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 数据库连接配置
const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'jxun10_1293897103',
  password: process.env.DB_PASSWORD || 'Xjh1293897103',
  database: process.env.DB_NAME || 'jxun10_charityevents_db',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  connectTimeout: 10000  
});

// 数据库连接处理
db.connect(err => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
    process.exit(1);
  }
  console.log('已连接到MySQL数据库 (连接ID: %d)', db.threadId);
});

// 接口路径前缀（客户端和管理端共用）
const apiPrefix = '/root/api';

// 1. 获取所有活动列表
app.get(`${apiPrefix}/events`, (req, res, next) => {
  const sql = `
    SELECT e.*, c.name AS category_name 
    FROM charity_events e 
    LEFT JOIN categories c ON e.category_id = c.id 
    ORDER BY e.event_date ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// 2. 搜索活动
app.get(`${apiPrefix}/events/search`, (req, res, next) => {
  const { date, location, category_id } = req.query;
  let sql = `
    SELECT e.*, c.name AS category_name 
    FROM charity_events e 
    LEFT JOIN categories c ON e.category_id = c.id 
    WHERE 1=1
  `;
  const params = [];
  
  if (date) { 
    sql += ' AND event_date = ?'; 
    params.push(date); 
  }
  if (location) { 
    sql += ' AND location LIKE ?'; 
    params.push(`%${location}%`); 
  }
  if (category_id) { 
    sql += ' AND category_id = ?'; 
    params.push(category_id); 
  }
  
  sql += ' ORDER BY e.event_date ASC';
  
  db.query(sql, params, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// 3. 获取单个活动详情
app.get(`${apiPrefix}/events/:id`, (req, res, next) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: '无效的活动ID' });
  }

  const sql = `
    SELECT e.*, c.name AS category_name 
    FROM charity_events e 
    LEFT JOIN categories c ON e.category_id = c.id 
    WHERE e.id = ?
  `;
  
  db.query(sql, [eventId], (err, results) => {
    if (err) return next(err);
    res.json(results[0] || null);
  });
});

// 4. 获取所有活动分类
app.get(`${apiPrefix}/categories`, (req, res, next) => {
  db.query('SELECT * FROM categories ORDER BY id', (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// 5. 提交活动报名
app.post(`${apiPrefix}/registrations`, (req, res, next) => {
  const { event_id, user_name, email, phone, tickets } = req.body;

  if (!event_id || !user_name || !email || !phone) {
    return res.status(400).json({ error: '请填写完整报名信息（姓名、邮箱、电话为必填项）' });
  }

  if (typeof event_id !== 'number') {
    return res.status(400).json({ error: '活动ID必须为数字' });
  }
  if (tickets && (typeof tickets !== 'number' || tickets < 1)) {
    return res.status(400).json({ error: '购票数量必须为大于0的数字' });
  }

  const sql = `
    INSERT INTO registrations 
      (event_id, user_name, email, phone, tickets) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(
    sql,
    [event_id, user_name, email, phone, tickets || 1],
    (err, result) => {
      if (err) return next(err);
      res.status(201).json({
        id: result.insertId,
        event_id,
        user_name,
        email,
        phone,
        tickets: tickets || 1,
        registration_date: new Date().toISOString()
      });
    }
  );
});

// 6. 获取某个活动的报名列表
app.get(`${apiPrefix}/events/:eventId/registrations`, (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: '无效的活动ID' });
  }

  const sql = 'SELECT * FROM registrations WHERE event_id = ? ORDER BY registration_date DESC';
  db.query(sql, [eventId], (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// 1. 管理端获取所有活动（用于列表展示）
app.get(`${apiPrefix}/admin/events`, (req, res, next) => {
  const sql = `
    SELECT e.*, c.name AS category_name 
    FROM charity_events e 
    LEFT JOIN categories c ON e.category_id = c.id 
    ORDER BY e.event_date ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// 2. 管理端创建新活动
app.post(`${apiPrefix}/admin/events`, (req, res, next) => {
  const { title, description, event_date, location, category_id, organizer } = req.body;

  // 校验必填字段
  if (!title || !event_date || !location || !category_id) {
    return res.status(400).json({ error: '活动标题、日期、地点、分类为必填项' });
  }

  const sql = `
    INSERT INTO charity_events 
      (title, description, event_date, location, category_id, organizer) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [title, description || '', event_date, location, category_id, organizer || ''],
    (err, result) => {
      if (err) return next(err);
      res.status(201).json({
        id: result.insertId,
        title,
        message: '活动创建成功'
      });
    }
  );
});

// 3. 管理端编辑活动
app.put(`${apiPrefix}/admin/events/:id`, (req, res, next) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: '无效的活动ID' });
  }

  const { title, description, event_date, location, category_id, organizer } = req.body;
  const sql = `
    UPDATE charity_events 
    SET title = ?, description = ?, event_date = ?, location = ?, category_id = ?, organizer = ? 
    WHERE id = ?
  `;
  db.query(
    sql,
    [title, description || '', event_date, location, category_id, organizer || '', eventId],
    (err, result) => {
      if (err) return next(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: '活动不存在' });
      }
      res.json({ message: '活动更新成功' });
    }
  );
});

// 4. 管理端删除活动
app.delete(`${apiPrefix}/admin/events/:id`, (req, res, next) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: '无效的活动ID' });
  }

  const sql = 'DELETE FROM charity_events WHERE id = ?';
  db.query(sql, [eventId], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '活动不存在' });
    }
    res.json({ message: '活动删除成功' });
  });
});

// 5. 管理端获取所有报名数据（全量数据，用于后台统计）
app.get(`${apiPrefix}/admin/registrations`, (req, res, next) => {
  const sql = `
    SELECT r.*, e.title AS event_title 
    FROM registrations r 
    LEFT JOIN charity_events e ON r.event_id = e.id 
    ORDER BY r.registration_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
});

// 统一错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(500).json({ error: '服务器内部错误，请稍后再试' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器已启动，运行在 http://24517241.it.scu.edu.au:${PORT}${apiPrefix}`);
});