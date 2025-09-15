export default {
	Button1onClick () {
		  Register_User.run(() => {
    storeValue("user", Input1.text);
    navigateTo("LoginUser");
  }, (err) => {
    showAlert("Username already exists", "error");
  })
	}
}