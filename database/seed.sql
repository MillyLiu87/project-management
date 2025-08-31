-- Sample data for Personal Life Management System

-- Insert a sample user (password is hashed version of 'password123')
INSERT INTO users (username, email, password_hash) VALUES 
('Manxia', 'manxia@example.com', '$2b$10$rOzJKKHaKRANCyc4KT7dWuhkE8OKEyQl4HwpeFJb8pMdgE8VU3GQW');

-- Get the user ID (in real scenario, you'd know this from your app)
-- For seed data, we'll assume user_id = 1

-- Insert sample projects
INSERT INTO projects (user_id, title, description, priority, progress, category, status) VALUES
(1, '💰 Financial Independence', '目标：年净利润1000万，10套房产被动收入', 'high', 65, 'financial', 'in_progress'),
(1, '🚀 AI/Tech Career Growth', '成为顶级AI专家，加入量化/半导体公司', 'high', 75, 'career', 'in_progress'),
(1, '🏠 Dutch Property Investment', '首套房€300K-359K，目标2026年2月', 'high', 45, 'property', 'in_progress'),
(1, '💪 Health & Fitness Excellence', '健康饮食，规律运动，参加比基尼比赛', 'medium', 80, 'health', 'in_progress');

-- Insert sample ideas
INSERT INTO ideas (user_id, title, description, project_category, priority, category) VALUES
(1, 'AI产品开发自动化', '一个月发布一个AI产品，建立MVP测试流程', 'financial', 'high', 'automation'),
(1, '量化投资策略研究', '学习量化交易，为进入量化公司做准备', 'financial', 'high', 'investment');

-- Insert sample todos
INSERT INTO todos (user_id, title, description, project_category, completed, priority, due_date) VALUES
(1, '研究量化交易平台', '调研主流量化交易平台的功能和费用', 'financial', false, 'high', NULL),
(1, '完成简历更新', '添加最新的AI项目经验', 'career', true, 'medium', NULL),
(1, '预约看房', '联系房产经纪人安排看房时间', 'property', false, 'high', CURRENT_DATE + INTERVAL '7 days');