const { getUser } = require("../repositories/authentication-repository");

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
async function renderProfileView(req, res) {
  try {
    const user = await getUser({
      where: {
        id: req.user.id,
      },
    });

    const data = {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      dob: user.dob,
      contactNumber: user.contact_number,
    };

    return res.render("profile", { data });
  } catch (error) {
    console.error("Error rendering the profile view");
  }
}

module.exports = {
  renderRegisterView,
  renderActivateAccountView,
  renderLoginView,
  renderDashboardView,
  renderForgotPasswordView,
  renderProfileView,
};
