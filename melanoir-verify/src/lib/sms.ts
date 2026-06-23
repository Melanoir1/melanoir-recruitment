import { createHmac, randomBytes } from 'crypto'

const SOLAPI_URL = 'https://api.solapi.com/messages/v4/send-many/detail'

function buildAuthHeader(apiKey: string, apiSecret: string): string {
  const date = new Date().toISOString()
  const salt = randomBytes(16).toString('hex')
  const signature = createHmac('sha256', apiSecret).update(date + salt).digest('hex')
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`
}

export async function sendSms(phone: string, message: string, subject?: string) {
  const apiKey = process.env.SMS_API_KEY
  const apiSecret = process.env.SMS_API_SECRET
  const senderPhone = process.env.SMS_SENDER_PHONE

  const normalizedPhone = phone.replace(/-/g, '')

  if (!apiKey || !apiSecret || !senderPhone) {
    console.log(`[DEV] SMS to ${normalizedPhone}: ${message}`)
    return
  }

  try {
    const res = await fetch(SOLAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: buildAuthHeader(apiKey, apiSecret),
      },
      body: JSON.stringify({
        messages: [{
          to: normalizedPhone,
          from: senderPhone.replace(/-/g, ''),
          text: message,
          ...(subject ? { subject } : {}),
        }],
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`[SMS] send failed (${res.status}):`, body)
    }
  } catch (e) {
    console.error('[SMS] send error:', e)
  }
}
