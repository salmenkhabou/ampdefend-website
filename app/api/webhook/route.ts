export async function POST(request: Request) {
  try {
    const alertData = await request.json()

    const webhookUrl =
      process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook-test/ec07343d-c58e-4591-b0d5-abe742db1d1c"

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alerts: {
          [alertData.id]: {
            alert_type: alertData.alert_type,
            city: alertData.city,
            country: alertData.country,
            device_id: alertData.device_id,
            ip_blocked: alertData.ip_blocked,
            loc: alertData.loc,
            org: alertData.org,
            public_ip: alertData.public_ip,
            raw_message: alertData.raw_message,
            region: alertData.region,
            severity: alertData.severity,
            timestamp: alertData.timestamp,
            timezone: alertData.timezone,
            uploaded_at: alertData.uploaded_at,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`)
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Webhook API error:", error)
    return Response.json({ error: "Webhook failed" }, { status: 500 })
  }
}
