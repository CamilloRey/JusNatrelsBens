# 📧 SMTP Configuration Guide

Complete guide for configuring custom SMTP email service.

## Overview

By default, Supabase uses its built-in email service. For production, you may want custom SMTP for:
- Better deliverability
- Custom branding
- Email tracking
- Advanced features
- Cost savings

## Supported Email Providers

### 1. Gmail (Free)
- **Host:** smtp.gmail.com
- **Port:** 587 (TLS)
- **Best for:** Testing, small projects

### 2. SendGrid (Recommended)
- **Host:** smtp.sendgrid.net
- **Port:** 587 (TLS) or 465 (SSL)
- **Best for:** Production, high volume

### 3. AWS SES
- **Host:** email-smtp.{region}.amazonaws.com
- **Port:** 587 (TLS)
- **Best for:** AWS users, high volume

### 4. Mailgun
- **Host:** smtp.mailgun.org
- **Port:** 587 (TLS)
- **Best for:** Developers, good API

### 5. Brevo (formerly Sendinblue)
- **Host:** smtp-relay.brevo.com
- **Port:** 587 (TLS)
- **Best for:** Affordable, good support

### 6. Custom Server
- Any SMTP server you control
- Self-hosted solution

## Setup by Provider

### Gmail Setup (Testing)

1. **Enable 2FA on Gmail account**
   - Go to myaccount.google.com
   - Click "Security"
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to myaccount.google.com/apppasswords
   - Select Mail and Device
   - Generate password
   - Copy the 16-character password

3. **In Supabase:**
   - **Host:** smtp.gmail.com
   - **Port:** 587
   - **Username:** your-email@gmail.com
   - **Password:** (16-character app password)
   - **From Email:** your-email@gmail.com

4. **Test**
   - Send test email from Supabase

---

### SendGrid Setup (Production)

1. **Create SendGrid Account**
   - Go to sendgrid.com
   - Sign up (free tier available)
   - Verify email

2. **Create API Key**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Choose "Restricted Access"
   - Enable: Mail Send
   - Copy the key

3. **In Supabase:**
   - **Host:** smtp.sendgrid.net
   - **Port:** 587
   - **Username:** apikey
   - **Password:** (Your SendGrid API key)
   - **From Email:** noreply@yourdomain.com

4. **Setup Domain Authentication (Optional)**
   - Settings → Sender Authentication
   - Add domain
   - Add DNS records
   - Verify domain

5. **Test**
   - Use Supabase email test
   - Monitor in SendGrid dashboard

---

### AWS SES Setup (Enterprise)

1. **Create AWS Account**
   - Go to aws.amazon.com
   - Sign up

2. **Request Production Access**
   - Go to SES in AWS Console
   - Verify sender email/domain
   - Request production access

3. **Create SMTP Credentials**
   - Go to SES → SMTP Settings
   - Click "Create SMTP Credentials"
   - Choose IAM user name
   - Download credentials

4. **In Supabase:**
   - **Host:** email-smtp.{your-region}.amazonaws.com
   - **Port:** 587
   - **Username:** (From downloaded credentials)
   - **Password:** (From downloaded credentials)
   - **From Email:** verified-email@yourdomain.com

5. **Monitor**
   - Check SES dashboard for bounce/complaint rates
   - Keep under limits to avoid account restriction

---

### Mailgun Setup (Developer-Friendly)

1. **Create Mailgun Account**
   - Go to mailgun.com
   - Sign up
   - Add domain

2. **Get SMTP Credentials**
   - Domain Settings → SMTP Credentials
   - Create new credential

3. **In Supabase:**
   - **Host:** smtp.mailgun.org
   - **Port:** 587
   - **Username:** postmaster@your-domain.mailgun.org
   - **Password:** (Mailgun password)
   - **From Email:** noreply@your-domain.mailgun.org

4. **Test**
   - Send test email from Supabase
   - Check Mailgun dashboard

---

### Brevo Setup (Budget-Friendly)

1. **Create Brevo Account**
   - Go to brevo.com
   - Sign up free

2. **Get SMTP Info**
   - Senders & Contacts → Senders
   - Select default sender
   - Copy SMTP info from welcome email

3. **In Supabase:**
   - **Host:** smtp-relay.brevo.com
   - **Port:** 587
   - **Username:** your-email@yourdomain.com
   - **Password:** (SMTP password from Brevo)
   - **From Email:** noreply@yourdomain.com

4. **Test**
   - Send test email via Supabase
   - Monitor in Brevo dashboard

---

## Supabase Configuration Steps

### 1. Go to Authentication → Email

In Supabase Dashboard:
1. Navigate to **Authentication**
2. Click on **Email**
3. Select **Custom SMTP**

### 2. Enter SMTP Details

```
SMTP Host:    smtp.sendgrid.net
Port:         587 (TLS) or 465 (SSL)
Username:     apikey (or your username)
Password:     (Your API key or password)
From Name:    Les Jus Naturels Ben's
From Email:   noreply@yourdomain.com
```

### 3. Configure Email Templates

In **Email Templates:**
- Reset Password
- Confirm Email
- Magic Link

Example Reset Password Template:
```html
<h2>Réinitialiser votre mot de passe</h2>

<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>

<p>
  <a href="{{ .RecoveryURL }}" style="background-color: #0066ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Réinitialiser le mot de passe
  </a>
</p>

<p>Ce lien expire dans 24 heures.</p>
```

### 4. Test Email

1. Click **Test Email**
2. Enter test email address
3. Check inbox
4. Verify formatting

### 5. Monitor Delivery

- Check email bounce rates
- Monitor spam complaints
- Track delivery metrics
- Review logs regularly

---

## Best Practices

### ✅ Do's
- Use SPF, DKIM, DMARC records
- Setup domain verification
- Monitor bounce rates
- Use from address that matches domain
- Test before production
- Monitor delivery metrics
- Implement error logging
- Have backup SMTP provider

### ❌ Don'ts
- Don't hardcode passwords
- Don't skip domain verification
- Don't ignore bounce rates
- Don't use generic from addresses
- Don't test with production emails
- Don't ignore logs/monitoring
- Don't change SMTP without testing

---

## Domain Authentication

### SPF Record
Add to your DNS:
```
v=spf1 include:sendgrid.net ~all
```

### DKIM Record
1. Get DKIM record from email provider
2. Add to DNS with _domainkey
3. Verify in provider dashboard

### DMARC Record
```
v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com
```

---

## Email Deliverability

### Monitor Metrics
- Delivery rate (should be >98%)
- Bounce rate (should be <2%)
- Complaint rate (should be <0.1%)
- Open rate (monitoring only)

### Improve Deliverability
1. Use warm-up period
2. Authenticate domain
3. Keep list clean
4. Monitor bounce rates
5. Respond to complaints
6. Use clear unsubscribe

### Provider Dashboards
- **SendGrid:** sendgrid.com/dashboard
- **AWS SES:** aws.amazon.com/ses
- **Mailgun:** mailgun.com/dashboard
- **Brevo:** brevo.com/dashboard

---

## Troubleshooting

### Email Not Sending
1. Verify SMTP credentials
2. Check firewall/ports open
3. Review error logs
4. Test with Supabase test button
5. Check email for typos

### Low Delivery Rate
1. Authenticate domain (SPF/DKIM)
2. Check sender reputation
3. Monitor bounce rate
4. Review email content
5. Check for spam triggers

### Authentication Failed
1. Verify credentials are correct
2. Check password/API key not expired
3. Verify allowed IPs (if restricted)
4. Test credentials with provider
5. Create new credentials

### Template Not Working
1. Check variable names: {{ .RecoveryURL }}
2. Verify HTML is valid
3. Test with Supabase test
4. Check email arrives in spam
5. Review provider logs

---

## Cost Comparison

| Provider | Free Tier | Price |
|----------|-----------|-------|
| Supabase | 50/month | Included |
| Gmail | Unlimited* | Free |
| SendGrid | 100/day | $14.95/month |
| Mailgun | 1000/month | Free |
| Brevo | 300/day | Free |
| AWS SES | 62k/month | $0.10 per 1k |

*Gmail limited to personal accounts

---

## Production Checklist

- [ ] Domain authenticated (SPF, DKIM)
- [ ] Email templates configured
- [ ] SMTP credentials secure
- [ ] Test email working
- [ ] Bounce rate monitored
- [ ] Error logging enabled
- [ ] Backup provider configured
- [ ] Rate limiting setup
- [ ] Support contact email
- [ ] Monitoring alerts enabled

---

## References

- [Supabase SMTP Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SendGrid SMTP](https://docs.sendgrid.com/ui/account-and-settings/smtp)
- [AWS SES](https://docs.aws.amazon.com/ses/latest/dg/smtp.html)
- [Mailgun SMTP](https://documentation.mailgun.com/en/latest/user_manual.html#smtp-credentials)
- [Email Authentication](https://dmarcian.com/)

---

## Support

For SMTP issues:
1. Check provider documentation
2. Review error logs
3. Test with provider tools
4. Contact provider support
5. Check Supabase community
