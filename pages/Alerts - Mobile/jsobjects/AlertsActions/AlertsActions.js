export default {
  // Format helpers
fmtTs(ts) {
  if (!ts) return "";

  const localTs = String(ts).replace("Z", "");

  return moment(localTs).format("DD/MM/YYYY, h:mm:ss A");
},

  badgeColor(status) {
    return status === "OPEN" ? "#ef4444" : "#f59e0b"; // red / amber
  },

  inBreachText(item) {
    const adjusted = Number(item.AdjustedAtOpen);
    const max = Number(item.MaxAtOpen);
    const min = Number(item.MinAtOpen);

    if (item.MaxAtOpen != null && adjusted > max) {
      return `HIGH ${adjusted.toFixed(1)}°C > ${max.toFixed(1)}°C`;
    }

    if (item.MinAtOpen != null && adjusted < min) {
      return `LOW ${adjusted.toFixed(1)}°C < ${min.toFixed(1)}°C`;
    }

    return `${adjusted.toFixed(1)}°C`;
  },

  // Actions
  async ack(alertId) {
    await ACK_API.run({ alertId });
    await getOpenAlerts.run();
    showAlert("✅ Alert acknowledged", "success");
  },

  async snooze(sensorId, minutes) {
    const seconds = Math.max(60, minutes * 60);
    await SNOOZE_API.run({ sensorId, seconds });
    await getOpenAlerts.run();
    showAlert(`😴 Snoozed ${sensorId} for ${minutes}m`, "info");
  },

  async addComment(alertId, text) {
    if (!text || !text.trim()) {
      showAlert("Type a comment first.", "warning");
      return;
    }

    await COMMENT_API.run({ alertId, text });
    await getComments.run({ alertId });
    showAlert("💬 Comment added", "success");
  },

  // Load comments for a given card
  async loadComments(alertId) {
    await getComments.run({ alertId });
  }
}