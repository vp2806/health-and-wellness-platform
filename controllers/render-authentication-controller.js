async function renderRegisterView(req, res) {
  try {
    return res.render("register");
  } catch (error) {
    console.error("Error rendering the register view");
  }
}

async function renderActivateAccountView(req, res) {
  try {
    return res.render("activate-account");
  } catch (error) {
    console.error("Error rendering the activate-account view");
  }
}

async function renderLoginView(req, res) {
  try {
    return res.render("login");
  } catch (error) {
    console.error("Error rendering the login view");
  }
}

async function renderDashboardView(req, res) {
  try {
    return res.render("dashboard");
  } catch (error) {
    console.error("Error rendering the login view");
  }
}
async function renderForgotPasswordView(req, res) {
  try {
    return res.render("forgot-password");
  } catch (error) {
    console.error("Error rendering the login view");
  }
}

module.exports = {
  renderRegisterView,
  renderActivateAccountView,
  renderLoginView,
  renderDashboardView,
  renderForgotPasswordView,
};
