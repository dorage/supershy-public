import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const sendOTP = async (options: { to: string; otp: string }) => {
  const body = new URLSearchParams();
  body.append('userkey', '754f4c994484');
  body.append('passkey', '9dc5115a22047fe7f2f685d4');
  body.append('to', options.to);
  body.append('brand', 'Supershy');
  body.append('otp', options.otp);

  try {
    const res = await fetch('https://console.zenziva.net/waofficial/api/sendWAOfficial/', {
      method: 'POST',
      body: body,
    });
  } catch (err) {
    console.log(err);
  }

  return true;
};

// Send SMS
const sendSMSTo = async (options: { to: string; msg: string; img?: string }) => {
  const body = new URLSearchParams();
  body.append('userkey', '754f4c994484');
  body.append('passkey', '9dc5115a22047fe7f2f685d4');
  body.append('to', options.to);
  body.append('message', options.msg);

  try {
    const res = await fetch('https://console.zenziva.net/wareguler/api/sendWA/', {
      method: 'POST',
      body: body,
    });
  } catch (err) {
    console.log(err);
  }

  return true;
};

const ZenzivaHelper = { sendOTP, sendSMSTo };

export default ZenzivaHelper;
