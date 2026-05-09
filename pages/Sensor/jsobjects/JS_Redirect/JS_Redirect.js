export default {
  async checkSensorSelected() {
    if (!appsmith.URL.queryParams.sensorId) {
      showAlert(
        "No sensor selected, You have been redirected to the Sensor Dashboard page for sensor selection.",
        "warning"
      );

      navigateTo("Sensor Dashboard");
      return;
    }

    await GetSelectedSensorLatest.run();
  }
}