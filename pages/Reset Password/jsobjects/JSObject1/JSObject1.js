export default {
  ResetPasswordButtononClick () {
    CheckSecurityAnswer.run()
      .then(data => {
        if (data.length > 0) {
          // Answer is correct, now update the password
          ResetPasswordWithSecurityAnswe.run()
            .then(() => {
              showAlert("Password reset successful!", "success");
              navigateTo("LoginPage");
            });
        } else {
          showAlert("Incorrect answer.", "error");
        }
      })
      .catch(error => {
        showAlert("Something went wrong: " + error.message, "error");
      });
  }
}
