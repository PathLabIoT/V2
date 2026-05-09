export default {
  lab() {
    return typeof LabSelect !== "undefined"
      ? (LabSelect.selectedOptionValue || "")
      : "";
  },

  dept() {
    return typeof DeptSelect !== "undefined"
      ? (DeptSelect.selectedOptionValue || "ALL")
      : "ALL";
  },

  sensorId() {
    return appsmith.URL.queryParams.sensorId || "";
  },

  showData() {
    return !!this.lab() || !!this.sensorId();
  },

  refresh() {
    if (typeof GetLatestPerSensor !== "undefined") {
      GetLatestPerSensor.run();
    }

    if (typeof GetLatestSimple !== "undefined") {
      GetLatestSimple.run();
    }

    if (typeof GetSeriesSimple !== "undefined") {
      GetSeriesSimple.run();
    }

    if (typeof GetSeriesByFilter !== "undefined" && this.lab()) {
      GetSeriesByFilter.run();
    }

    if (typeof GetSelectedSensorLatest !== "undefined" && this.sensorId()) {
      GetSelectedSensorLatest.run();
    }
  }
}