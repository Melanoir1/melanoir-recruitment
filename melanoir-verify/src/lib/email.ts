import nodemailer from 'nodemailer'

/**
 * Gmail SMTP 발송 헬퍼.
 * 환경변수 미설정 시(개발 환경) 콘솔에 출력만 하고 조용히 통과한다 — sms.ts와 동일한 패턴.
 *
 * 필요 환경변수:
 *   SMTP_USER          발송 Gmail 주소 (예: noreply@melanoir.co.kr 또는 본인 gmail)
 *   SMTP_APP_PASSWORD  Gmail 앱 비밀번호 16자리 (공백 없이)
 *   ALERT_EMAIL_TO     알림 수신 주소 (기본값: slee@melanoir.co.kr)
 *   ALERT_EMAIL_FROM   (선택) 표시용 발신 주소, 기본값은 SMTP_USER
 */

let cachedTransport: nodemailer.Transporter | null = null

function getTransport(user: string, pass: string): nodemailer.Transporter {
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    })
  }
  return cachedTransport
}

export async function sendEmail(opts: {
  to?: string
  subject: string
  text: string
  html?: string
}) {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_APP_PASSWORD
  const to = opts.to ?? process.env.ALERT_EMAIL_TO ?? 'slee@melanoir.co.kr'
  const from = process.env.ALERT_EMAIL_FROM ?? user

  if (!user || !pass) {
    console.log(`[DEV] Email to ${to} | ${opts.subject}\n${opts.text}`)
    return
  }

  try {
    await getTransport(user, pass).sendMail({
      from: `멜라누아 알림 <${from}>`,
      to,
      subject: opts.subject,
      text: opts.text,
      ...(opts.html ? { html: opts.html } : {}),
    })
  } catch (e) {
    // 알림 실패가 본 요청(신청 처리)을 깨지 않도록 삼킨다.
    console.error('[Email] send error:', e)
  }
}
