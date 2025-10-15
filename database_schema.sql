-- =====================================================
-- Stabit Habit Tracking App - PostgreSQL Database Schema
-- =====================================================
-- This schema supports a comprehensive habit tracking application
-- with user management, habit creation, progress tracking, 
-- analytics, milestones, and settings.
--
-- NOTE: This schema is designed to work with Supabase Authentication.
-- User authentication is handled by Supabase's auth.users table.
-- All user_id references in this schema point to auth.users.id (UUID).

-- =====================================================
-- 1. USER PROFILES (Supabase Auth Integration)
-- =====================================================

-- Create custom types for PostgreSQL
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'system');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE time_units_type AS ENUM ('minutes', 'hours');
CREATE TYPE count_units_type AS ENUM ('repetitions', 'sessions', 'times', 'items');
CREATE TYPE tracking_type AS ENUM ('duration', 'count', 'both');
CREATE TYPE goal_frequency_type AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE dashboard_view_type AS ENUM ('overview', 'analytics', 'calendar', 'progress');

-- User profiles table - Complete user information and preferences (uses auth.users.id as PK)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY,  -- References auth.users.id from Supabase (also serves as PK)
    avatar_url VARCHAR(500),  -- Allow NULL for missing avatar
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    theme theme_type DEFAULT 'system',
    age INTEGER,  -- Allow NULL for users who may not provide their age
    gender gender_type DEFAULT 'male',
    height DECIMAL(5, 2),  -- Store height in meters (e.g., 1.75), or change to INTEGER if in cm
    is_active BOOLEAN DEFAULT TRUE,
    
    -- User preferences and settings
    personal_goals TEXT, -- Allow NULL for missing personal goals
    preferred_time_units time_units_type DEFAULT 'minutes',
    preferred_count_units count_units_type DEFAULT 'repetitions',
    default_reminder_time TIME DEFAULT '09:00:00',
    default_tracking_type tracking_type DEFAULT 'duration',
    default_goal_frequency goal_frequency_type DEFAULT 'daily',
    auto_sync BOOLEAN DEFAULT TRUE,
    last_sync_time TIMESTAMP,
    default_dashboard_view dashboard_view_type DEFAULT 'overview',
    show_welcome_message BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_notifications BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_profiles_created_at ON user_profiles (created_at);
CREATE INDEX idx_user_profiles_is_active ON user_profiles (is_active);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();




-- =====================================================
-- 3. HABITS & CATEGORIES
-- =====================================================

-- Habit categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color
    icon VARCHAR(10) DEFAULT '🎯',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_category_name UNIQUE (name)
);

-- Create additional custom types for habits
CREATE TYPE recurrence_type AS ENUM ('daily', 'weekly', 'monthly', 'custom');
CREATE TYPE habit_status_type AS ENUM ('active', 'inactive', 'completed', 'paused');

-- Main habits table
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References auth.users.id from Supabase
    category_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '🎯',
    recurrence_type recurrence_type NOT NULL,
    custom_recurrence VARCHAR(100),
    time_of_day TIME,
    start_date DATE NOT NULL,
    end_date DATE,
    initial_value DECIMAL(10, 2) DEFAULT 0,
    difficulty_rate DECIMAL(5, 2) DEFAULT 1.0,
    auto_growth BOOLEAN DEFAULT FALSE,
    goal_value DECIMAL(10, 2) DEFAULT 0,
    goal_metric VARCHAR(50) DEFAULT 'sessions',
    estimated_completion_date DATE,
    status habit_status_type DEFAULT 'active',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Create indexes
CREATE INDEX idx_user_habits ON habits (user_id, status);
CREATE INDEX idx_category_habits ON habits (category_id);
CREATE INDEX idx_habits_created_at ON habits (created_at);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_habits_updated_at 
    BEFORE UPDATE ON habits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. HABIT CUSTOM FIELDS
-- =====================================================

-- Create custom type for field types
CREATE TYPE field_type AS ENUM ('text', 'number', 'select', 'boolean');

-- Custom fields for habits (e.g., "Pages Read", "Weather", etc.)
CREATE TABLE habit_custom_fields (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    field_type field_type NOT NULL,
    options JSONB, -- For select fields: ["Option1", "Option2"]
    is_required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
);

-- Create index
CREATE INDEX idx_habit_fields ON habit_custom_fields (habit_id, display_order);

-- =====================================================
-- 5. HABIT LOGS & COMPLETIONS
-- =====================================================

-- Create custom type for completion status
CREATE TYPE completion_status_type AS ENUM ('completed', 'partial', 'missed', 'skipped');

-- Daily habit completions/logs
CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL,
    user_id UUID NOT NULL,  -- References auth.users.id from Supabase
    log_date DATE NOT NULL,
    completion_status completion_status_type NOT NULL,
    value DECIMAL(10, 2) DEFAULT 0, -- The actual value achieved
    notes TEXT,
    completion_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
    CONSTRAINT unique_habit_date UNIQUE (habit_id, log_date)
);

-- Create indexes
CREATE INDEX idx_user_date ON habit_logs (user_id, log_date);
CREATE INDEX idx_habit_date ON habit_logs (habit_id, log_date);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_habit_logs_updated_at 
    BEFORE UPDATE ON habit_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Custom field values for each log entry
CREATE TABLE habit_log_custom_values (
    id SERIAL PRIMARY KEY,
    log_id INTEGER NOT NULL,
    custom_field_id INTEGER NOT NULL,
    value TEXT, -- Store as text, parse based on field type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES habit_logs (id) ON DELETE CASCADE,
    FOREIGN KEY (custom_field_id) REFERENCES habit_custom_fields (id) ON DELETE CASCADE,
    CONSTRAINT unique_log_field UNIQUE (log_id, custom_field_id)
);

-- =====================================================
-- 6. HABIT STREAKS & STATISTICS
-- =====================================================

-- Current streak information for each habit
CREATE TABLE habit_streaks (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completion_date DATE,
    streak_start_date DATE,
    total_completions INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    completion_rate DECIMAL(5, 2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
    CONSTRAINT unique_habit_streak UNIQUE (habit_id)
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_habit_streaks_updated_at 
    BEFORE UPDATE ON habit_streaks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. MILESTONES & REWARDS
-- =====================================================

-- Create custom type for milestone status
CREATE TYPE milestone_status_type AS ENUM ('locked', 'in_progress', 'achieved');

-- Milestones for habits
CREATE TABLE milestones ( -- you can name it rewards, UI is not sync with this table
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10, 2) NOT NULL,
    target_metric VARCHAR(50) DEFAULT 'sessions',
    reward_name VARCHAR(255),
    reward_description TEXT,
    reward_icon VARCHAR(10) DEFAULT '🎉',
    status milestone_status_type DEFAULT 'locked',
    current_progress DECIMAL(10, 2) DEFAULT 0,
    achieved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_habit_milestones ON milestones (habit_id, status);
CREATE INDEX idx_milestones_status ON milestones (status);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_milestones_updated_at 
    BEFORE UPDATE ON milestones 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. NOTIFICATIONS & REMINDERS
-- =====================================================

-- Notification settings for habits
CREATE TABLE habit_notifications (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    reminder_times JSONB, -- Array of time strings: ["09:00", "18:00"]
    smart_reminders JSONB, -- {"missed_yesterday": true, "streak_continuation": false}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
    CONSTRAINT unique_habit_notifications UNIQUE (habit_id)
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_habit_notifications_updated_at 
    BEFORE UPDATE ON habit_notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create custom type for notification types
CREATE TYPE notification_type AS ENUM ('reminder', 'streak_break', 'milestone_achieved', 'encouragement', 'system');

-- Notification history/log
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References auth.users.id from Supabase
    habit_id INTEGER,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_user_notifications ON notifications (user_id, is_read);
CREATE INDEX idx_notifications_sent_at ON notifications (sent_at);

-- =====================================================
-- 9. ANALYTICS & STATISTICS
-- =====================================================

-- Daily statistics for analytics
CREATE TABLE daily_statistics (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References auth.users.id from Supabase
    stat_date DATE NOT NULL,
    total_habits INTEGER DEFAULT 0,
    completed_habits INTEGER DEFAULT 0,
    completion_rate DECIMAL(5, 2) DEFAULT 0.00,
    total_sessions INTEGER DEFAULT 0,
    total_duration DECIMAL(10, 2) DEFAULT 0.00, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_date UNIQUE (user_id, stat_date)
);

-- Create index
CREATE INDEX idx_daily_stats_user_date ON daily_statistics (user_id, stat_date);

-- Weekly statistics
CREATE TABLE weekly_statistics (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References auth.users.id from Supabase
    week_start_date DATE NOT NULL,
    total_habits INTEGER DEFAULT 0,
    completed_habits INTEGER DEFAULT 0,
    completion_rate DECIMAL(5, 2) DEFAULT 0.00,
    total_sessions INTEGER DEFAULT 0,
    total_duration DECIMAL(10, 2) DEFAULT 0.00,
    longest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_week UNIQUE (user_id, week_start_date)
);

-- Create index
CREATE INDEX idx_weekly_stats_user_week ON weekly_statistics (user_id, week_start_date);

-- Monthly statistics
CREATE TABLE monthly_statistics (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References auth.users.id from Supabase
    month_year VARCHAR(7) NOT NULL, -- Format: "2024-01"
    total_habits INTEGER DEFAULT 0,
    completed_habits INTEGER DEFAULT 0,
    completion_rate DECIMAL(5, 2) DEFAULT 0.00,
    total_sessions INTEGER DEFAULT 0,
    total_duration DECIMAL(10, 2) DEFAULT 0.00,
    longest_streak INTEGER DEFAULT 0,
    new_habits_created INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_month UNIQUE (user_id, month_year)
);

-- Create index
CREATE INDEX idx_monthly_stats_user_month ON monthly_statistics (user_id, month_year);

-- =====================================================
-- 10. ACHIEVEMENTS & BADGES
-- =====================================================

-- Create custom type for achievement categories
CREATE TYPE achievement_category_type AS ENUM ('streak', 'completion', 'consistency', 'milestone', 'special');

-- Achievement definitions
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '🏆',
    category achievement_category_type NOT NULL,
    criteria JSONB NOT NULL, -- {"type": "streak", "value": 30, "habit_type": "any"}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References auth.users.id from Supabase
    achievement_id INTEGER NOT NULL,
    habit_id INTEGER, -- NULL for general achievements
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (achievement_id) REFERENCES achievements (id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE SET NULL,
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id, habit_id)
);

-- Create index
CREATE INDEX idx_user_achievements ON user_achievements (user_id, unlocked_at);

-- =====================================================
-- 11. DATA EXPORT/IMPORT
-- =====================================================

-- Create custom types for export
CREATE TYPE export_type AS ENUM ('csv', 'json', 'pdf');
CREATE TYPE export_status_type AS ENUM ('pending', 'completed', 'failed');

-- Export history
CREATE TABLE data_exports (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References auth.users.id from Supabase
    export_type export_type NOT NULL,
    file_path VARCHAR(500),
    file_size INTEGER,
    status export_status_type DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create index
CREATE INDEX idx_user_exports ON data_exports (user_id, created_at);

-- =====================================================
-- 12. SYSTEM & AUDIT
-- =====================================================

-- System settings
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Audit log for important actions
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID,  -- References auth.users.id from Supabase
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_audit ON audit_logs (user_id, created_at);
CREATE INDEX idx_audit_action ON audit_logs (action, created_at);

-- =====================================================
-- 13. INITIAL DATA & INDEXES
-- =====================================================

-- Insert default categories
INSERT INTO
    categories (
        name,
        description,
        color,
        icon
    )
VALUES (
        'Health',
        'Physical and mental health related habits',
        '#10B981',
        '💚'
    ),
    (
        'Learning',
        'Educational and skill development habits',
        '#3B82F6',
        '📚'
    ),
    (
        'Productivity',
        'Work and efficiency related habits',
        '#8B5CF6',
        '⚡'
    ),
    (
        'Fitness',
        'Exercise and physical activity habits',
        '#F59E0B',
        '🏃'
    ),
    (
        'Mindfulness',
        'Meditation and mental wellness habits',
        '#EC4899',
        '🧘'
    ),
    (
        'Reflection',
        'Journaling and self-reflection habits',
        '#6366F1',
        '📝'
    ),
    (
        'Social',
        'Relationship and social interaction habits',
        '#EF4444',
        '👥'
    ),
    (
        'Creative',
        'Artistic and creative expression habits',
        '#F97316',
        '🎨'
    );

-- Insert default achievements
INSERT INTO
    achievements (
        name,
        description,
        icon,
        category,
        criteria
    )
VALUES (
        'Early Bird',
        'Complete morning routine 10 days in a row',
        '🌅',
        'streak',
        '{"type": "streak", "value": 10, "time_period": "morning"}'
    ),
    (
        'Consistency King',
        'Maintain a 30-day streak on any habit',
        '👑',
        'streak',
        '{"type": "streak", "value": 30}'
    ),
    (
        'Habit Master',
        'Complete 100 total habit sessions',
        '🎯',
        'completion',
        '{"type": "total_sessions", "value": 100}'
    ),
    (
        'Weekend Warrior',
        'Perfect weekend completion rate',
        '⚔️',
        'consistency',
        '{"type": "weekend_completion", "value": 100}'
    ),
    (
        'First Steps',
        'Create your first habit',
        '👶',
        'milestone',
        '{"type": "habits_created", "value": 1}'
    ),
    (
        'Century Club',
        'Complete 100 days of any habit',
        '💯',
        'streak',
        '{"type": "streak", "value": 100}'
    ),
    (
        'Multi-tasker',
        'Maintain 5 active habits simultaneously',
        '🎪',
        'consistency',
        '{"type": "active_habits", "value": 5}'
    ),
    (
        'Comeback Kid',
        'Restart a habit after a 7+ day break',
        '🔄',
        'special',
        '{"type": "restart_after_break", "value": 7}'
    );

-- Insert default system settings
INSERT INTO
    system_settings (
        setting_key,
        setting_value,
        description
    )
VALUES (
        'app_version',
        '1.0.0',
        'Current application version'
    ),
    (
        'maintenance_mode',
        'false',
        'Enable maintenance mode'
    ),
    (
        'max_habits_per_user',
        '50',
        'Maximum habits a user can create'
    ),
    (
        'max_custom_fields_per_habit',
        '10',
        'Maximum custom fields per habit'
    ),
    (
        'data_retention_days',
        '365',
        'Days to retain user data'
    ),
    (
        'backup_frequency_hours',
        '24',
        'Hours between automatic backups'
    );

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
FROM
    habits h
    JOIN categories c ON h.category_id = c.id
    LEFT JOIN habit_streaks hs ON h.id = hs.habit_id
WHERE
    h.is_archived = FALSE;

-- View for user dashboard statistics
CREATE VIEW user_dashboard_stats AS
SELECT
    up.user_id,
    COUNT(DISTINCT h.id) as total_habits,
    COUNT(
        DISTINCT CASE
            WHEN h.status = 'active' THEN h.id
        END
    ) as active_habits,
    COUNT(
        DISTINCT CASE
            WHEN hl.completion_status = 'completed'
            AND hl.log_date = CURRENT_DATE THEN hl.habit_id
        END
    ) as completed_today,
    AVG(hs.completion_rate) as avg_completion_rate,
    MAX(hs.longest_streak) as best_streak
FROM
    user_profiles up
    LEFT JOIN habits h ON up.user_id = h.user_id
    AND h.is_archived = FALSE
    LEFT JOIN habit_streaks hs ON h.id = hs.habit_id
    LEFT JOIN habit_logs hl ON h.id = hl.habit_id
GROUP BY
    up.user_id;

-- =====================================================
-- 15. STORED PROCEDURES (PostgreSQL Functions)
-- =====================================================

-- Function to update habit streak when a log is created/updated
CREATE OR REPLACE FUNCTION update_habit_streak(p_habit_id INTEGER)
RETURNS VOID AS $$
DECLARE
    v_current_streak INTEGER := 0;
    v_longest_streak INTEGER := 0;
    v_last_date DATE;
    v_check_date DATE;
    v_total_completions INTEGER := 0;
    v_total_sessions INTEGER := 0;
    v_completion_rate DECIMAL(5,2) := 0.00;
BEGIN
    -- Get current streak data
    SELECT current_streak, longest_streak, last_completion_date, total_completions, total_sessions
    INTO v_current_streak, v_longest_streak, v_last_date, v_total_completions, v_total_sessions
    FROM habit_streaks 
    WHERE habit_id = p_habit_id;
    
    -- Calculate new streak
    v_check_date := CURRENT_DATE;
    v_current_streak := 0;
    
    -- Count consecutive completed days backwards from today
    WHILE EXISTS (
        SELECT 1 FROM habit_logs 
        WHERE habit_id = p_habit_id 
        AND log_date = v_check_date 
        AND completion_status IN ('completed', 'partial')
    ) LOOP
        v_current_streak := v_current_streak + 1;
        v_check_date := v_check_date - INTERVAL '1 day';
    END LOOP;
    
    -- Update longest streak if current is higher
    IF v_current_streak > v_longest_streak THEN
        v_longest_streak := v_current_streak;
    END IF;
    
    -- Calculate completion rate (last 30 days)
    SELECT 
        COUNT(CASE WHEN completion_status IN ('completed', 'partial') THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)
    INTO v_completion_rate
    FROM habit_logs 
    WHERE habit_id = p_habit_id 
    AND log_date >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Update or insert streak record
    INSERT INTO habit_streaks (habit_id, current_streak, longest_streak, last_completion_date, total_completions, total_sessions, completion_rate)
    VALUES (p_habit_id, v_current_streak, v_longest_streak, v_last_date, v_total_completions, v_total_sessions, v_completion_rate)
    ON CONFLICT (habit_id) DO UPDATE SET
        current_streak = EXCLUDED.current_streak,
        longest_streak = EXCLUDED.longest_streak,
        last_completion_date = EXCLUDED.last_completion_date,
        total_completions = EXCLUDED.total_completions,
        total_sessions = EXCLUDED.total_sessions,
        completion_rate = EXCLUDED.completion_rate,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 16. TRIGGERS
-- =====================================================

-- Trigger to update streak when habit log is inserted
CREATE OR REPLACE FUNCTION trigger_update_habit_streak()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_habit_streak(NEW.habit_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_habit_log_insert
    AFTER INSERT ON habit_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_habit_streak();

CREATE TRIGGER after_habit_log_update
    AFTER UPDATE ON habit_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_habit_streak();

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