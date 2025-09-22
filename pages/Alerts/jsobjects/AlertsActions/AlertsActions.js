export default {
  // Format helpers
  fmtTs(ts) {
    if (!ts) return "";
    return new Date(ts).toLocaleString();
  },
  badgeColor(status) {
    return status === "OPEN" ? "#ef4444" : "#f59e0b"; // red / amber
  },
  inBreachText(item) {
    if (item.MaxAtOpen != null && item.AdjustedAtOpen > item.MaxAtOpen) {
      return `HIGH ${item.AdjustedAtOpen}°C > ${item.MaxAtOpen}°C`;
    }
    if (item.MinAtOpen != null && item.AdjustedAtOpen < item.MinAtOpen) {
      return `LOW ${item.AdjustedAtOpen}°C < ${item.MinAtOpen}°C`;
    }
    return `${item.AdjustedAtOpen}°C`;
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
    // refresh comments for that alert
    await getComments.run({ alertId });
    showAlert("💬 Comment added", "success");
  },

  // Load comments for a given card (called when it's expanded/selected)
  async loadComments(alertId) {
    await getComments.run({ alertId });
  }
}
