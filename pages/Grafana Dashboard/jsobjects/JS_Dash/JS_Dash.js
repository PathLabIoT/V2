export default {
  lab()  { return LabSelect.selectedOptionValue || ""; },
  dept() { return DeptSelect.selectedOptionValue || "ALL"; },
  showData() { return !!this.lab(); },

  refresh() {
    GetLatestSimple.run();     // add this line
		    GetSeriesSimple.run();     // right charts
    GetSeriesByFilter.run();   // keep this if you're doing charts later
  }
}
