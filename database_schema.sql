-- =====================================================
-- Stabit Habit Tracking App - MySQL Database Schema
-- =====================================================
-- This schema supports a comprehensive habit tracking application
-- with user management, habit creation, progress tracking, 
-- analytics, milestones, and settings.

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

-- Users table - Core user information
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    theme ENUM('light', 'dark', 'system') DEFAULT 'system',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- OAuth providers for social login
CREATE TABLE oauth_providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    provider ENUM('google', 'github', 'facebook', 'twitter') NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provider_user (provider, provider_user_id),
    INDEX idx_user_provider (user_id, provider)
);

-- =====================================================
-- 2. USER PREFERENCES & SETTINGS
-- =====================================================

-- User profile settings
CREATE TABLE user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    personal_goals TEXT,
    preferred_time_units ENUM('minutes', 'hours') DEFAULT 'minutes',
    preferred_count_units ENUM('repetitions', 'sessions', 'times', 'items') DEFAULT 'repetitions',
    default_reminder_time TIME DEFAULT '09:00:00',
    default_tracking_type ENUM('duration', 'count', 'both') DEFAULT 'duration',
    default_goal_frequency ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily',
    auto_sync BOOLEAN DEFAULT TRUE,
    last_sync_time TIMESTAMP NULL,
    default_dashboard_view ENUM('overview', 'analytics', 'calendar', 'progress') DEFAULT 'overview',
    show_welcome_message BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id)
);

-- =====================================================
-- 3. HABITS & CATEGORIES
-- =====================================================

-- Habit categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color
    icon VARCHAR(10) DEFAULT '🎯',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_category_name (name)
);

-- Main habits table
CREATE TABLE habits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '🎯',
    recurrence_type ENUM('daily', 'weekly', 'monthly', 'custom') NOT NULL,
    custom_recurrence VARCHAR(100),
    time_of_day TIME,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    initial_value DECIMAL(10,2) DEFAULT 0,
    difficulty_rate DECIMAL(5,2) DEFAULT 1.0,
    auto_growth BOOLEAN DEFAULT FALSE,
    goal_value DECIMAL(10,2) DEFAULT 0,
    goal_metric VARCHAR(50) DEFAULT 'sessions',
    estimated_completion_date DATE NULL,
    status ENUM('active', 'inactive', 'completed', 'paused') DEFAULT 'active',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_user_habits (user_id, status),
    INDEX idx_category_habits (category_id),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 4. HABIT CUSTOM FIELDS
-- =====================================================

-- Custom fields for habits (e.g., "Pages Read", "Weather", etc.)
CREATE TABLE habit_custom_fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    habit_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    field_type ENUM('text', 'number', 'select', 'boolean') NOT NULL,
    options JSON, -- For select fields: ["Option1", "Option2"]
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    INDEX idx_habit_fields (habit_id, display_order)
);

-- =====================================================
-- 5. HABIT LOGS & COMPLETIONS
-- =====================================================

-- Daily habit completions/logs
CREATE TABLE habit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    habit_id INT NOT NULL,
    user_id INT NOT NULL,
    log_date DATE NOT NULL,
    completion_status ENUM('completed', 'partial', 'missed', 'skipped') NOT NULL,
    value DECIMAL(10,2) DEFAULT 0, -- The actual value achieved
    notes TEXT,
    completion_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_habit_date (habit_id, log_date),
    INDEX idx_user_date (user_id, log_date),
    INDEX idx_habit_date (habit_id, log_date)
);

-- Custom field values for each log entry
CREATE TABLE habit_log_custom_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_id INT NOT NULL,
    custom_field_id INT NOT NULL,
    value TEXT, -- Store as text, parse based on field type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (log_id) REFERENCES habit_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (custom_field_id) REFERENCES habit_custom_fields(id) ON DELETE CASCADE,
    UNIQUE KEY unique_log_field (log_id, custom_field_id)
);

-- =====================================================
-- 6. HABIT STREAKS & STATISTICS
-- =====================================================

-- Current streak information for each habit
CREATE TABLE habit_streaks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    habit_id INT NOT NULL,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_completion_date DATE NULL,
    streak_start_date DATE NULL,
    total_completions INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE KEY unique_habit_streak (habit_id)
);

-- =====================================================
-- 7. MILESTONES & REWARDS
-- =====================================================

-- Milestones for habits
CREATE TABLE milestones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    habit_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2) NOT NULL,
    target_metric VARCHAR(50) DEFAULT 'sessions',
    reward_name VARCHAR(255),
    reward_description TEXT,
    reward_icon VARCHAR(10) DEFAULT '🎉',
    status ENUM('locked', 'in_progress', 'achieved') DEFAULT 'locked',
    current_progress DECIMAL(10,2) DEFAULT 0,
    achieved_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    INDEX idx_habit_milestones (habit_id, status),
    INDEX idx_status (status)
);

-- =====================================================
-- 8. NOTIFICATIONS & REMINDERS
-- =====================================================

-- Notification settings for habits
CREATE TABLE habit_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    habit_id INT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    reminder_times JSON, -- Array of time strings: ["09:00", "18:00"]
    smart_reminders JSON, -- {"missed_yesterday": true, "streak_continuation": false}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE KEY unique_habit_notifications (habit_id)
);

-- Notification history/log
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    habit_id INT NULL,
    type ENUM('reminder', 'streak_break', 'milestone_achieved', 'encouragement', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE SET NULL,
    INDEX idx_user_notifications (user_id, is_read),
    INDEX idx_sent_at (sent_at)
);

-- =====================================================
-- 9. ANALYTICS & STATISTICS
-- =====================================================

-- Daily statistics for analytics
CREATE TABLE daily_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    stat_date DATE NOT NULL,
    total_habits INT DEFAULT 0,
    completed_habits INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    total_sessions INT DEFAULT 0,
    total_duration DECIMAL(10,2) DEFAULT 0.00, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, stat_date),
    INDEX idx_user_date (user_id, stat_date)
);

-- Weekly statistics
CREATE TABLE weekly_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    week_start_date DATE NOT NULL,
    total_habits INT DEFAULT 0,
    completed_habits INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    total_sessions INT DEFAULT 0,
    total_duration DECIMAL(10,2) DEFAULT 0.00,
    longest_streak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_week (user_id, week_start_date),
    INDEX idx_user_week (user_id, week_start_date)
);

-- Monthly statistics
CREATE TABLE monthly_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    month_year VARCHAR(7) NOT NULL, -- Format: "2024-01"
    total_habits INT DEFAULT 0,
    completed_habits INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    total_sessions INT DEFAULT 0,
    total_duration DECIMAL(10,2) DEFAULT 0.00,
    longest_streak INT DEFAULT 0,
    new_habits_created INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_month (user_id, month_year),
    INDEX idx_user_month (user_id, month_year)
);

-- =====================================================
-- 10. ACHIEVEMENTS & BADGES
-- =====================================================

-- Achievement definitions
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '🏆',
    category ENUM('streak', 'completion', 'consistency', 'milestone', 'special') NOT NULL,
    criteria JSON NOT NULL, -- {"type": "streak", "value": 30, "habit_type": "any"}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements
CREATE TABLE user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    habit_id INT NULL, -- NULL for general achievements
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id, habit_id),
    INDEX idx_user_achievements (user_id, unlocked_at)
);

-- =====================================================
-- 11. DATA EXPORT/IMPORT
-- =====================================================

-- Export history
CREATE TABLE data_exports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    export_type ENUM('csv', 'json', 'pdf') NOT NULL,
    file_path VARCHAR(500),
    file_size INT,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_exports (user_id, created_at)
);

-- =====================================================
-- 12. SYSTEM & AUDIT
-- =====================================================

-- System settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit log for important actions
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_audit (user_id, created_at),
    INDEX idx_action (action, created_at)
);

-- =====================================================
-- 13. INITIAL DATA & INDEXES
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, description, color, icon) VALUES
('Health', 'Physical and mental health related habits', '#10B981', '💚'),
('Learning', 'Educational and skill development habits', '#3B82F6', '📚'),
('Productivity', 'Work and efficiency related habits', '#8B5CF6', '⚡'),
('Fitness', 'Exercise and physical activity habits', '#F59E0B', '🏃'),
('Mindfulness', 'Meditation and mental wellness habits', '#EC4899', '🧘'),
('Reflection', 'Journaling and self-reflection habits', '#6366F1', '📝'),
('Social', 'Relationship and social interaction habits', '#EF4444', '👥'),
('Creative', 'Artistic and creative expression habits', '#F97316', '🎨');

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, criteria) VALUES
('Early Bird', 'Complete morning routine 10 days in a row', '🌅', 'streak', '{"type": "streak", "value": 10, "time_period": "morning"}'),
('Consistency King', 'Maintain a 30-day streak on any habit', '👑', 'streak', '{"type": "streak", "value": 30}'),
('Habit Master', 'Complete 100 total habit sessions', '🎯', 'completion', '{"type": "total_sessions", "value": 100}'),
('Weekend Warrior', 'Perfect weekend completion rate', '⚔️', 'consistency', '{"type": "weekend_completion", "value": 100}'),
('First Steps', 'Create your first habit', '👶', 'milestone', '{"type": "habits_created", "value": 1}'),
('Century Club', 'Complete 100 days of any habit', '💯', 'streak', '{"type": "streak", "value": 100}'),
('Multi-tasker', 'Maintain 5 active habits simultaneously', '🎪', 'consistency', '{"type": "active_habits", "value": 5}'),
('Comeback Kid', 'Restart a habit after a 7+ day break', '🔄', 'special', '{"type": "restart_after_break", "value": 7}');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('app_version', '1.0.0', 'Current application version'),
('maintenance_mode', 'false', 'Enable maintenance mode'),
('max_habits_per_user', '50', 'Maximum habits a user can create'),
('max_custom_fields_per_habit', '10', 'Maximum custom fields per habit'),
('data_retention_days', '365', 'Days to retain user data'),
('backup_frequency_hours', '24', 'Hours between automatic backups');

-- =====================================================
-- 14. VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for habit summary with statistics
CREATE VIEW habit_summary AS
SELECT 
    h.id,
    h.user_id,
    h.name,
    h.icon,
    h.status,
    c.name as category_name,
    c.color as category_color,
    hs.current_streak,
    hs.longest_streak,
    hs.total_completions,
    hs.completion_rate,
    h.created_at
FROM habits h
JOIN categories c ON h.category_id = c.id
LEFT JOIN habit_streaks hs ON h.id = hs.habit_id
WHERE h.is_archived = FALSE;

-- View for user dashboard statistics
CREATE VIEW user_dashboard_stats AS
SELECT 
    u.id as user_id,
    COUNT(DISTINCT h.id) as total_habits,
    COUNT(DISTINCT CASE WHEN h.status = 'active' THEN h.id END) as active_habits,
    COUNT(DISTINCT CASE WHEN hl.completion_status = 'completed' AND hl.log_date = CURDATE() THEN hl.habit_id END) as completed_today,
    AVG(hs.completion_rate) as avg_completion_rate,
    MAX(hs.longest_streak) as best_streak
FROM users u
LEFT JOIN habits h ON u.id = h.user_id AND h.is_archived = FALSE
LEFT JOIN habit_streaks hs ON h.id = hs.habit_id
LEFT JOIN habit_logs hl ON h.id = hl.habit_id
GROUP BY u.id;

-- =====================================================
-- 15. STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to update habit streak when a log is created/updated
CREATE PROCEDURE UpdateHabitStreak(IN habit_id INT)
BEGIN
    DECLARE current_streak INT DEFAULT 0;
    DECLARE longest_streak INT DEFAULT 0;
    DECLARE last_date DATE;
    DECLARE check_date DATE;
    DECLARE total_completions INT DEFAULT 0;
    DECLARE total_sessions INT DEFAULT 0;
    DECLARE completion_rate DECIMAL(5,2) DEFAULT 0.00;
    
    -- Get current streak data
    SELECT current_streak, longest_streak, last_completion_date, total_completions, total_sessions
    INTO current_streak, longest_streak, last_date, total_completions, total_sessions
    FROM habit_streaks 
    WHERE habit_id = habit_id;
    
    -- Calculate new streak
    SET check_date = CURDATE();
    SET current_streak = 0;
    
    -- Count consecutive completed days backwards from today
    WHILE EXISTS (
        SELECT 1 FROM habit_logs 
        WHERE habit_id = habit_id 
        AND log_date = check_date 
        AND completion_status IN ('completed', 'partial')
    ) DO
        SET current_streak = current_streak + 1;
        SET check_date = DATE_SUB(check_date, INTERVAL 1 DAY);
    END WHILE;
    
    -- Update longest streak if current is higher
    IF current_streak > longest_streak THEN
        SET longest_streak = current_streak;
    END IF;
    
    -- Calculate completion rate (last 30 days)
    SELECT 
        COUNT(CASE WHEN completion_status IN ('completed', 'partial') THEN 1 END) * 100.0 / COUNT(*)
    INTO completion_rate
    FROM habit_logs 
    WHERE habit_id = habit_id 
    AND log_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);
    
    -- Update or insert streak record
    INSERT INTO habit_streaks (habit_id, current_streak, longest_streak, last_completion_date, total_completions, total_sessions, completion_rate)
    VALUES (habit_id, current_streak, longest_streak, last_date, total_completions, total_sessions, completion_rate)
    ON DUPLICATE KEY UPDATE
        current_streak = VALUES(current_streak),
        longest_streak = VALUES(longest_streak),
        last_completion_date = VALUES(last_completion_date),
        total_completions = VALUES(total_completions),
        total_sessions = VALUES(total_sessions),
        completion_rate = VALUES(completion_rate),
        updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- =====================================================
-- 16. TRIGGERS
-- =====================================================

-- Trigger to update streak when habit log is inserted/updated
DELIMITER //

CREATE TRIGGER after_habit_log_insert
AFTER INSERT ON habit_logs
FOR EACH ROW
BEGIN
    CALL UpdateHabitStreak(NEW.habit_id);
END //

CREATE TRIGGER after_habit_log_update
AFTER UPDATE ON habit_logs
FOR EACH ROW
BEGIN
    CALL UpdateHabitStreak(NEW.habit_id);
END //

DELIMITER ;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- This schema provides a comprehensive foundation for the Stabit habit tracking application
-- Key features supported:
-- 1. User management with OAuth support
-- 2. Flexible habit creation with custom fields
-- 3. Progress tracking and streak calculation
-- 4. Milestones and rewards system
-- 5. Analytics and statistics
-- 6. Notifications and reminders
-- 7. Achievement system
-- 8. Data export/import capabilities
-- 9. Audit logging and system settings
-- 10. Optimized views and stored procedures for common operations
