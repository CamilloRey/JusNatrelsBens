-- Advanced Security Features
-- MFA, Audit Logs, Password Policy, Device Tracking

-- ════════════════════════════════════════════════════════════════════════════
-- MFA FACTORS (TOTP) - Managed by Supabase Auth
-- No custom table needed - Supabase handles this
-- ════════════════════════════════════════════════════════════════════════════

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('auth', 'order', 'error', 'security', 'performance')),
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Device Fingerprints Table
CREATE TABLE device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fingerprint_id TEXT NOT NULL,
  user_agent TEXT,
  language TEXT,
  timezone TEXT,
  screen_resolution TEXT,
  platform TEXT,
  cookies_enabled BOOLEAN,
  is_trusted BOOLEAN DEFAULT FALSE,
  last_used TIMESTAMP DEFAULT now(),
  first_seen TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- Password Change History Table
CREATE TABLE password_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Password Policy Table
CREATE TABLE password_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  last_changed TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  force_change BOOLEAN DEFAULT FALSE,
  attempts_failed INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Email Log Table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  template TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT now()
);

-- Security Events Table
CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'failed_login', 'password_change', 'mfa_enable', 'mfa_disable', 'device_added', 'suspicious_activity')),
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  risk_score INTEGER DEFAULT 0,
  action_taken TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Audit logs - Admins only
CREATE POLICY "Admins can read audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Device fingerprints - Users can read own
CREATE POLICY "Users can read own devices" ON device_fingerprints
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all devices" ON device_fingerprints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Password changes - Users can read own
CREATE POLICY "Users can read own password changes" ON password_changes
  FOR SELECT USING (auth.uid() = user_id);

-- Password policies - Users can read own
CREATE POLICY "Users can read own password policy" ON password_policies
  FOR SELECT USING (auth.uid() = user_id);

-- Email logs - Admins only
CREATE POLICY "Admins can read email logs" ON email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Security events - Admins only
CREATE POLICY "Admins can read security events" ON security_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ════════════════════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);

CREATE INDEX idx_device_fingerprints_user_id ON device_fingerprints(user_id);
CREATE INDEX idx_device_fingerprints_fingerprint_id ON device_fingerprints(fingerprint_id);
CREATE INDEX idx_device_fingerprints_last_used ON device_fingerprints(last_used);

CREATE INDEX idx_password_changes_user_id ON password_changes(user_id);
CREATE INDEX idx_password_changes_changed_at ON password_changes(changed_at);

CREATE INDEX idx_password_policies_user_id ON password_policies(user_id);
CREATE INDEX idx_password_policies_expires_at ON password_policies(expires_at);

CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);

-- ════════════════════════════════════════════════════════════════════════════
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS & SECURITY EVENTS
-- ════════════════════════════════════════════════════════════════════════════

CREATE TRIGGER update_password_policies_updated_at BEFORE UPDATE ON password_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-log password changes
CREATE OR REPLACE FUNCTION log_password_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO security_events (user_id, event_type, ip_address)
  VALUES (auth.uid(), 'password_change', NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This would require custom auth trigger from Supabase
-- For now, password changes are logged via application code

-- Auto-expire passwords
CREATE OR REPLACE FUNCTION update_password_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at := NOW() + INTERVAL '90 days';
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_password_changed BEFORE UPDATE ON password_policies
  FOR EACH ROW EXECUTE FUNCTION update_password_expiry();

-- ════════════════════════════════════════════════════════════════════════════
-- FUNCTIONS FOR SECURITY
-- ════════════════════════════════════════════════════════════════════════════

-- Check if user account is locked due to failed attempts
CREATE OR REPLACE FUNCTION is_account_locked(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  locked_until TIMESTAMP;
BEGIN
  SELECT password_policies.locked_until INTO locked_until
  FROM password_policies
  WHERE password_policies.user_id = $1;

  IF locked_until IS NULL THEN
    RETURN FALSE;
  END IF;

  IF locked_until > NOW() THEN
    RETURN TRUE;
  END IF;

  -- Unlock if lock period expired
  UPDATE password_policies
  SET locked_until = NULL, attempts_failed = 0
  WHERE password_policies.user_id = $1;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Check if password is expired
CREATE OR REPLACE FUNCTION is_password_expired(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  expires_at TIMESTAMP;
BEGIN
  SELECT password_policies.expires_at INTO expires_at
  FROM password_policies
  WHERE password_policies.user_id = $1;

  IF expires_at IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Get days until password expires
CREATE OR REPLACE FUNCTION days_until_password_expiry(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  expires_at TIMESTAMP;
BEGIN
  SELECT password_policies.expires_at INTO expires_at
  FROM password_policies
  WHERE password_policies.user_id = $1;

  IF expires_at IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN EXTRACT(DAY FROM (expires_at - NOW()))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Clean up old logs (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
  -- Keep audit logs for 90 days
  DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';

  -- Keep email logs for 30 days
  DELETE FROM email_logs WHERE sent_at < NOW() - INTERVAL '30 days';

  -- Keep security events for 180 days
  DELETE FROM security_events WHERE created_at < NOW() - INTERVAL '180 days';
END;
$$ LANGUAGE plpgsql;
