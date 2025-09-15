export default {
  async ButtonLoginonClick() {
    try {
      const result = await QueryLogin.run({ force: true }); // 💥 force re-run the query

      console.log("Query result:", result);

      if (Array.isArray(result) && result.length > 0) {
        storeValue("user", result[0].username);
        navigateTo("Dashboard");
      } else {
        showAlert("Invalid username or password", "error");
      }
    } catch (error) {
      showAlert("Login failed: " + error.message, "error");
    }
  }
}
