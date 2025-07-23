import logging
from sqlalchemy.orm import Session
from app import crud
from app.models import Stock
import smtplib
from email.mime.text import MIMEText
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")


def send_email(to_email: str, subject: str, message: str):
    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
        logging.info(f"[EMAIL SENT] To: {to_email}")
    except Exception as e:
        logging.error(f"[EMAIL ERROR] {e}")


TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_SMS_NUMBER = os.getenv("TWILIO_SMS_NUMBER")


client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_sms(to_number: str, message: str):
    try:
        client.messages.create(
            body=message,
            from_=TWILIO_SMS_NUMBER,
            to=to_number
        )
        logging.info(f"[SMS SENT] To: {to_number}")
    except Exception as e:
        logging.error(f"[SMS ERROR] {e}")

def trigger_alert(db: Session, stock: Stock):
    if stock.quantity > stock.threshold:
        return

    crud.save_alert_history(db, stock.casting_type, stock.threshold)

    config = crud.get_contact_config(db)
    if not config:
        logging.warning("[ALERT] No contact configuration set. Skipping alerts.")
        return

    alert_message = (
        f"⚠️ ALERT: Stock '{stock.casting_type}' is below threshold!\n"
        f"Current Quantity: {stock.quantity}\n"
        f"Threshold: {stock.threshold}\n"
        f"Please take action."
    )

    if config.email:
        send_email(config.email, f"Stock Alert: {stock.casting_type}", alert_message)

    if config.sms_number:
        send_sms(config.sms_number, alert_message)

    logging.info(f"[ALERT] Alert triggered and sent for stock: {stock.casting_type}")
