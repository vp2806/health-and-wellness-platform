async function renderAddMedicationView(req, res) {
  try {
    return res.render("add-medicine");
  } catch (error) {
    console.error("Error rendering the register view");
  }
}

module.exports = { renderAddMedicationView };
