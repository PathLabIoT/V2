export default {
  // ---------- helpers ----------
  dueIsDateOnly: true,

  hwId() {
    const v = TreeSelect1.selectedOptionValue || "";
    const m = v.match(/^hw:(\d+)$/);
    return m ? Number(m[1]) : null;
  },

  hasValidAsset() {
    return this.hwId() !== null;
  },

  parseNumber(raw) {
    if (raw == null) return NaN;
    const s = String(raw).replace(/[^\-0-9.+eE]/g, "");
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  },

  currentTemp() {
    const qv = GetLatestSensorData.data?.[0]?.Value;
    if (typeof qv === "number") return qv;
    const n = this.parseNumber(CurrentProbeInput.text || CurrentProbeInput.defaultText);
    return n;
  },

  referenceTemp() {
    return this.parseNumber(ReferenceReadingInput.text);
  },

  // ---------- orchestration ----------
  async onAssetChange() {
    if (!this.hasValidAsset()) {
      showAlert("Pick a specific asset (leaf item).", "warning");
      return;
    }
    await HardwareById.run();
    await GetLatestSensorData.run();

    if (!GetLatestSensorData.data?.[0]) {
      showAlert("No SensorData found for this hardware & lab.", "warning");
    }
    this.updateNextCalibration();
  },

  async refresh() {
    if (!this.hasValidAsset()) {
      showAlert("Pick a specific asset (leaf item) first.", "warning");
      return;
    }
    await HardwareById.run();
    await GetLatestSensorData.run();

    if (!GetLatestSensorData.data?.[0]) {
      showAlert("No SensorData found for this hardware & lab.", "warning");
    } else {
      showAlert("Latest reading refreshed.", "success");
    }
    this.updateNextCalibration();
  },

  // ---------- calculate action ----------
  calculate() {
    const cur = this.currentTemp();
    if (!Number.isFinite(cur)) {
      showAlert("Current Probe Temp not found", "error");
      return;
    }
    const ref = this.referenceTemp();
    if (!Number.isFinite(ref)) {
      showAlert("Enter a numeric Reference Reading", "warning");
      return;
    }

    const correction = ref - cur;              // offset to add to probe to match reference
    const pass = correction >= -1 && correction <= 1;

    CorrectionInput.setValue(correction.toFixed(2));
    PassFailInput.setValue(pass ? "PASS" : "FAIL");

    // Persist correction so Apply doesn't rely on a disabled input
    storeValue("cal_corr", correction);
  },

  // ---------- radio → next calibration ----------
  updateNextCalibration() {
    const raw = CalibrationRadio.selectedOptionValue;
    const months = parseInt(String(raw ?? "").match(/\d+/)?.[0], 10);
    if (!Number.isFinite(months) || months <= 0) {
      storeValue("nextCal", "");
      return;
    }
    const next = moment().add(months, "months").format("YYYY-MM-DD HH:mm");
    storeValue("nextCal", next); // NextCalibrationInput binds to {{ appsmith.store.nextCal || "" }}
  },

  // ---------- values for Apply ----------
  correctionValue() {
    // Prefer stored value written by calculate(); fallback to widget
    const fromStore = appsmith.store.cal_corr;
    if (typeof fromStore === "number" && Number.isFinite(fromStore)) return fromStore;
    return this.parseNumber(CorrectionInput.text);
  },

  nextCalText() {
    return appsmith.store.nextCal || NextCalibrationInput.text || "";
  },

  nextCalSQL() {
    const t = this.nextCalText();
    if (!t) return "NULL";

    const m = moment(t, ["YYYY-MM-DD HH:mm", moment.ISO_8601], true);
    if (!m.isValid()) return "NULL";

    // If Due is DATE, store YYYY-MM-DD; otherwise store full timestamp
    return this.dueIsDateOnly
      ? `'${m.format("YYYY-MM-DD")}'`
      : `'${m.format("YYYY-MM-DD HH:mm:ss")}'`;
  },

  async apply() {
    if (!this.hasValidAsset()) {
      showAlert("Select an asset before applying.", "warning");
      return;
    }
    const corr = this.correctionValue();
    if (!Number.isFinite(corr)) {
      showAlert("Correction Factor is empty or invalid.", "warning");
      return;
    }
    if (!this.nextCalText()) {
      showAlert("Next Calibration date is empty.", "warning");
      return;
    }

    await ApplyCalibration.run(
      async () => {
        showAlert("Calibration applied ✅", "success");
        await HardwareById.run();
        await GetLatestSensorData.run();
      },
      () => showAlert("Failed to apply calibration.", "error")
    );
  },

  // ---------- reset form (blank everything) ----------
  resetForm() {
    ReferenceReadingInput.setValue("");
    CorrectionInput.setValue("");
    PassFailInput.setValue("");
    CurrentProbeInput.setValue("");
    NextCalibrationInput.setValue("");

    resetWidget("CalibrationRadio", false);
    resetWidget("TreeSelect1", false);

    storeValue("nextCal", "");
    storeValue("cal_corr", undefined);
    if (HardwareById.clear) HardwareById.clear();
    if (GetLatestSensorData.clear) GetLatestSensorData.clear();

    showAlert("Form reset", "info");
  }
};
