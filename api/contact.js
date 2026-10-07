function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  const { name, email, company = '', topic, message, website = '' } = req.body || {};
  if (website) return res.status(200).json({ ok: true });

  if (!name || !email || !topic || !message || message.length < 20) {
    return res.status(400).json({ ok: false, message: 'Completa los campos requeridos.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return res.status(503).json({
      ok: false,
      message: 'El canal de correo todavía no está configurado en el servidor.'
    });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[Axevora Contact] ${topic} — ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#111827">
            <h2>Nuevo contacto desde Axevora Labs</h2>
            <p><strong>Nombre:</strong> ${esc(name)}</p>
            <p><strong>Correo:</strong> ${esc(email)}</p>
            <p><strong>Empresa / proyecto:</strong> ${esc(company || 'No especificado')}</p>
            <p><strong>Motivo:</strong> ${esc(topic)}</p>
            <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0" />
            <p style="white-space:pre-wrap;line-height:1.6">${esc(message)}</p>
          </div>`
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(502).json({ ok: false, message: 'No fue posible enviar el mensaje. Intenta nuevamente.' });
    }

    return res.status(200).json({ ok: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ ok: false, message: 'Ocurrió un error al enviar el mensaje.' });
  }
};
