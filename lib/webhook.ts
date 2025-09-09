interface AlertWebhookData {
  alerts: {
    [key: string]: {
      alert_type: string
      city: string
      country: string
      device_id: string
      ip_blocked: string
      loc: string
      org: string
      public_ip: string
      raw_message: string
      region: string
      severity: string
      timestamp: string
      timezone: string
      uploaded_at: string
    }
  }
}

export async function sendAlertToWebhook(alertId: string, alertData: any) {
  const apiUrl = "/api/webhook"

  const payload = {
    id: alertId,
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
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log(`[v0] Alert ${alertId} sent to webhook successfully`)
    } else {
      console.error(`[v0] Failed to send alert to webhook: ${response.status}`)
    }
  } catch (error) {
    console.error("[v0] Webhook error:", error)
  }
}
