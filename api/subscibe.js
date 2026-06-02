module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const payload = {
      email,
      listIds: [3],
      updateEnabled: true
    };

    if (firstName) {
      payload.attributes = { FIRSTNAME: firstName };
    }

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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'
      },
      body: JSON.stringify(payload)
    });

    if (brevoRes.ok || brevoRes.status === 204) {
      return res.status(200).json({ success: true });
    }

    const data = await brevoRes.json().catch(() => ({}));
    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true });
    }

    return res.status(500).json({ error: 'Failed to add contact' });

  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
