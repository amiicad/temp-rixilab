import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ==============================
# CONFIGURATION
# ==============================
excel_file = "data.xlsx"       # Your Excel file (must have Name, Email, InternID columns)
smtp_server = "smtp.gmail.com"
port = 587
sender_email = "rixilab7@gmail.com"
password = "myzpncilnkkozlee"   # 🔥 App Password (remove spaces)

# ==============================
# CONNECT TO SMTP SERVER
# ==============================
server = smtplib.SMTP(smtp_server, port)
server.starttls()
server.login(sender_email, password)

# ==============================
# READ EXCEL DATA
# ==============================
data = pd.read_excel(excel_file)

# ==============================
# SEND EMAILS
# ==============================
for index, row in data.iterrows():
    name = row["Name"]
    duration = row["Duration"]
    internship_domain = row["Domain"]
    email = row["Email"]

    subject = f"Internship Confirmation - Welcome to Rixi Lab!"

    # ✅ HTML Email Template
    body = f"""
    <html>
   <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">

  <!-- Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 10px;">

        <!-- Main Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ff6600" style="padding: 20px;">
              <h1 style="margin:0; font-size:20px; color:#000;">Internship Confirmation - Welcome to Rixi Lab!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color:#111827; font-size:15px; line-height:1.6;">
              <p>Dear <strong>{name}</strong>,</p>

              <p><strong>Congratulations!</strong> We are excited to inform you that your application for the internship at <strong>Rixi Lab</strong> has been successfully accepted. We welcome you aboard and look forward to working with you on this exciting journey of learning and innovation!</p>

              <h3 style="color:#111827; margin-top:20px; font-size:16px;">Internship Details:</h3>
              <ul style="padding-left:20px; margin:10px 0;">
                <li><strong>Start Date:</strong> 1st August 2025</li>
                <li><strong>Domain:</strong> {internship_domain}</li>
                <li><strong>Duration:</strong> {duration}</li>
              </ul>

              <h3 style="color:#111827; margin-top:20px; font-size:16px;">Next Steps:</h3>
              <p>To complete your onboarding and receive important updates, please join our official internship WhatsApp group:</p>

              <!-- Button -->
              <p style="text-align:center; margin:20px 0;">
                <a href="https://chat.whatsapp.com/FrydTZpIZPn905SXpyU5Dy?mode=ac_t" target="_blank" 
                   style="background-color:#22c55e; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                  Join WhatsApp Group
                </a>
              </p>

              <p style="font-size:14px; color:#555555; line-height:1.5;">
                <strong>Important:</strong> Please join the group using your registered mobile number (the same number you provided during registration). This will help us verify your identity and provide timely updates and resources during the internship.
              </p>

              <p>If you have any questions, feel free to contact us on WhatsApp.</p>

              <!-- ✅ Signature -->
              <p style="font-size: 14px; color: #333; margin-top: 30px; margin-bottom: 5px;">
                Warm Regards,<br>
                <b style="font-size:16px; font-weight:700; color:#2c3e50;">Rixi Lab</b><br>
                <i>"Rethink Innovate eXecute Inspire"</i>
              </p>

              <!-- ✅ Social Media -->
              <p style="text-align: center; margin-top: 15px;">
                <a href="https://www.instagram.com/rixilab.in" target="_blank" style="margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
                       alt="Instagram" width="26" style="vertical-align: middle;">
                </a>
                <a href="https://www.linkedin.com/company/rixilab" target="_blank" style="margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" 
                       alt="LinkedIn" width="26" style="vertical-align: middle;">
                </a>
                <a href="https://www.facebook.com/rixilab" target="_blank" style="margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" 
                       alt="Facebook" width="26" style="vertical-align: middle;">
                </a>
              </p>

              <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
                © 2025 Rixi Lab | <a href="https://rixilab.tech" style="color:#3498db; text-decoration:none;">www.rixilab.tech</a>
              </p>

            </td>
          </tr>

        </table>
        <!-- End Main Container -->

      </td>
    </tr>
  </table>
  <!-- End Wrapper -->

</body>
</html>
    """

    # Build Email
    msg = MIMEMultipart("alternative")
    msg["From"] = sender_email
    msg["To"] = email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    # Send
    server.sendmail(sender_email, email, msg.as_string())
    print(f"✅ Sent mail to {name} <{email}>")

# ==============================
# CLOSE SERVER
# ==============================
server.quit()



import sys
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ==============================
# CONFIGURATION
# ==============================
smtp_server = "smtp.gmail.com"
port = 587
sender_email = "rixilab7@gmail.com"
password = "myzpncilnkkozlee"   # 🔥 App Password

# ==============================
# READ JSON INPUT
# ==============================
try:
    data = sys.stdin.read()  # Node.js will send JSON here
    interns = json.loads(data)  # List of intern objects
except Exception as e:
    print(f"❌ Failed to parse input JSON: {e}")
    sys.exit(1)

# ==============================
# CONNECT TO SMTP SERVER
# ==============================
try:
    server = smtplib.SMTP(smtp_server, port)
    server.starttls()
    server.login(sender_email, password)
except Exception as e:
    print(f"❌ Failed to connect/login SMTP: {e}")
    sys.exit(1)

# ==============================
# SEND EMAILS
# ==============================
for intern in interns:
    try:
        name = intern.get("name")
        email = intern.get("email")
        internship_domain = intern.get("domain")
        duration = intern.get("duration")

        subject = f"Internship Confirmation - Welcome to Rixi Lab!"

        # ✅ KEEP YOUR ORIGINAL BODY EXACTLY
        body = f"""
            <html>
   <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">

  <!-- Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 10px;">

        <!-- Main Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ff6600" style="padding: 20px;">
              <h1 style="margin:0; font-size:20px; color:#000;">Internship Confirmation - Welcome to Rixi Lab!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color:#111827; font-size:15px; line-height:1.6;">
              <p>Dear <strong>{name}</strong>,</p>

              <p><strong>Congratulations!</strong> We are excited to inform you that your application for the internship at <strong>Rixi Lab</strong> has been successfully accepted. We welcome you aboard and look forward to working with you on this exciting journey of learning and innovation!</p>

              <h3 style="color:#111827; margin-top:20px; font-size:16px;">Internship Details:</h3>
              <ul style="padding-left:20px; margin:10px 0;">
                <li><strong>Start Date:</strong> 1st August 2025</li>
                <li><strong>Domain:</strong> {internship_domain}</li>
                <li><strong>Duration:</strong> {duration}</li>
              </ul>

              <h3 style="color:#111827; margin-top:20px; font-size:16px;">Next Steps:</h3>
              <p>To complete your onboarding and receive important updates, please join our official internship WhatsApp group:</p>

              <!-- Button -->
              <p style="text-align:center; margin:20px 0;">
                <a href="https://chat.whatsapp.com/FrydTZpIZPn905SXpyU5Dy?mode=ac_t" target="_blank" 
                   style="background-color:#22c55e; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                  Join WhatsApp Group
                </a>
              </p>

              <p style="font-size:14px; color:#555555; line-height:1.5;">
                <strong>Important:</strong> Please join the group using your registered mobile number (the same number you provided during registration). This will help us verify your identity and provide timely updates and resources during the internship.
              </p>

              <p>If you have any questions, feel free to contact us on WhatsApp.</p>

              <!-- ✅ Signature -->
              <p style="font-size: 14px; color: #333; margin-top: 30px; margin-bottom: 5px;">
                Warm Regards,<br>
                <b style="font-size:16px; font-weight:700; color:#2c3e50;">Rixi Lab</b><br>
                <i>"Rethink Innovate eXecute Inspire"</i>
              </p>

              <!-- ✅ Social Media -->
              <p style="text-align: center; margin-top: 15px;">
                <a href="https://www.instagram.com/rixilab.in" target="_blank" style="margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
                       alt="Instagram" width="26" style="vertical-align: middle;">
                </a>
                <a href="https://www.linkedin.com/company/rixilab" target="_blank" style="margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" 
                       alt="LinkedIn" width="26" style="vertical-align: middle;">
                </a>
                <a href="https://www.facebook.com/rixilab" target="_blank" style="margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" 
                       alt="Facebook" width="26" style="vertical-align: middle;">
                </a>
              </p>

              <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
                © 2025 Rixi Lab | <a href="https://rixilab.tech" style="color:#3498db; text-decoration:none;">www.rixilab.tech</a>
              </p>

            </td>
          </tr>

        </table>
        <!-- End Main Container -->

      </td>
    </tr>
  </table>
  <!-- End Wrapper -->

</body>
</html>
    """


        msg = MIMEMultipart("alternative")
        msg["From"] = sender_email
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        server.sendmail(sender_email, email, msg.as_string())
        print(f"✅ Sent mail to {name} <{email}>")

    except Exception as e:
        print(f"❌ Failed to send mail to {intern.get('email')}: {e}")

# ==============================
# CLOSE SERVER
# ==============================
server.quit()
