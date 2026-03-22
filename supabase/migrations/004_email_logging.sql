-- ════════════════════════════════════════════════════════════════════════════
-- Migration: Email Logging & Monitoring
-- Description: Track email delivery, failures, and user activity
-- ════════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────────
-- TABLE: email_logs (email delivery tracking)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email Information
  email_address TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('reset_password', 'confirm_email', 'invite')),

  -- Event Tracking
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'failed', 'bounced', 'opened')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),

  -- Message & Error Details
  message TEXT NOT NULL,
  error_details TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can view email logs" ON email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- TABLE: error_logs (application error tracking)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Error Information
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,

  -- Context
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  endpoint TEXT,
  method TEXT,

  -- Severity
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')) DEFAULT 'error',

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  resolved BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT now(),
  resolved_at TIMESTAMP
);

-- Enable RLS on error_logs
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view error logs
CREATE POLICY "Admins can view error logs" ON error_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- TABLE: auth_audit_log (authentication event tracking)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User Information
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,

  -- Event Type
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signup', 'login', 'logout', 'password_reset', 'email_verified', 'mfa_enabled', 'mfa_disabled'
  )),

  -- Result
  success BOOLEAN NOT NULL,
  error_message TEXT,

  -- Context
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS on auth_audit_log
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own auth logs
CREATE POLICY "Users can view own auth logs" ON auth_audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all auth logs
CREATE POLICY "Admins can view all auth logs" ON auth_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email_address);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_event ON email_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_auth_audit_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_event ON auth_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created_at ON auth_audit_log(created_at DESC);

-- ────────────────────────────────────────────────────────────────────────────
-- VIEWS for reporting
-- ────────────────────────────────────────────────────────────────────────────

-- Email delivery summary
CREATE OR REPLACE VIEW email_delivery_summary AS
SELECT
  email_type,
  event_type,
  status,
  COUNT(*) as count,
  DATE(created_at) as date
FROM email_logs
GROUP BY email_type, event_type, status, DATE(created_at)
ORDER BY DATE(created_at) DESC, email_type;

-- Failed emails summary
CREATE OR REPLACE VIEW failed_emails_summary AS
SELECT
  email_address,
  email_type,
  COUNT(*) as failure_count,
  MAX(created_at) as last_failure,
  MAX(error_details) as last_error
FROM email_logs
WHERE status = 'error'
GROUP BY email_address, email_type
ORDER BY failure_count DESC;

-- Recent errors
CREATE OR REPLACE VIEW recent_errors AS
SELECT
  id,
  error_type,
  error_message,
  severity,
  user_id,
  created_at,
  resolved
FROM error_logs
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- ────────────────────────────────────────────────────────────────────────────
-- COMMENTS for documentation
-- ────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE email_logs IS 'Track email delivery, failures, and status for debugging';
COMMENT ON TABLE error_logs IS 'Application error tracking for monitoring and debugging';
COMMENT ON TABLE auth_audit_log IS 'Authentication event audit trail for security';

COMMENT ON COLUMN email_logs.event_type IS 'Email event: sent, delivered, failed, bounced, opened';
COMMENT ON COLUMN error_logs.severity IS 'Error severity: info, warning, error, critical';
COMMENT ON COLUMN auth_audit_log.event_type IS 'Auth event: signup, login, logout, password_reset, etc';
