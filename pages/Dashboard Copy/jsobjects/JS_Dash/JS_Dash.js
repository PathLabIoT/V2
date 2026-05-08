export default {
  lab()  { return LabSelect.selectedOptionValue || ""; },
  dept() { return DeptSelect.selectedOptionValue || "ALL"; },
  showData() { return !!this.lab(); },

  refresh() {
    GetLatestPerSensor.run();     // <— add this
    GetLatestSimple.run();
    GetSeriesSimple.run();
    GetSeriesByFilter.run();
  }
}
