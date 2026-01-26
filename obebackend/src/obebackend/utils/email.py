"""Email sending utilities for OTP delivery."""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

from obebackend.config import settings

logger = logging.getLogger(__name__)


def send_otp_email(email: str, otp_code: str) -> bool:
    """
    Send OTP code via email.
    
    Args:
        email: Recipient email address
        otp_code: OTP code to send
        
    Returns:
        True if email sent successfully, False otherwise
    """
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        logger.warning("SMTP not configured, cannot send email")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM or settings.SMTP_USER
        msg['To'] = email
        msg['Subject'] = "OBE System - Your OTP Code"
        
        # Email body
        body = f"""
        Your OTP code for OBE System login is: {otp_code}
        
        This code will expire in 10 minutes.
        
        If you did not request this code, please ignore this email.
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"OTP email sent to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {e}")
        return False


def send_welcome_email(email: str, name: str) -> bool:
    """
    Send welcome email to new user.
    
    Args:
        email: Recipient email address
        name: User's name
        
    Returns:
        True if email sent successfully, False otherwise
    """
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        logger.warning("SMTP not configured, cannot send email")
        return False
    
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM or settings.SMTP_USER
        msg['To'] = email
        msg['Subject'] = "Welcome to OBE System"
        
        body = f"""
        Hello {name},
        
        Welcome to the Outcome-Based Education (OBE) Management System!
        
        Your account has been created successfully.
        
        You can now log in using your email address.
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Welcome email sent to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email to {email}: {e}")
        return False

