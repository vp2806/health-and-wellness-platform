const startDateElements = document.getElementsByName("startDate");
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

Array.from(startDateElements).forEach((element) => {
  element.setAttribute("min", new Date().toJSON().slice(0, 10));
});
document
  .getElementById("endDate")
  .setAttribute("min", new Date().toJSON().slice(0, 10));

const handleMedicationType = (medicationAddType) => {
  if (medicationAddType.value === "0") {
    document.getElementById("oneTime").classList.toggle("d-none");
    document.getElementById("recurring").classList.toggle("d-none");
    document.getElementById("startDate").classList.remove("require");
    document.getElementById("time").classList.remove("require");
    document.getElementById("startDate2").classList.add("require");
    document.getElementById("endDate").classList.add("require");
    document.getElementById("time2").classList.add("require");
  }

  if (medicationAddType.value === "1") {
    document.getElementById("oneTime").classList.toggle("d-none");
    document.getElementById("recurring").classList.toggle("d-none");
    document.getElementById("startDate").classList.add("require");
    document.getElementById("time").classList.add("require");
    document.getElementById("startDate2").classList.remove("require");
    document.getElementById("endDate").classList.remove("require");
    document.getElementById("time2").classList.remove("require");
  }

  if (medicationAddType.value === "2") {
    document.getElementById("oneTime").classList.add("d-none");
    document.getElementById("dayComp").classList.add("d-none");
    document.getElementById("recurringComp").classList.remove("col-md-2");
    document.getElementById("recurringComp").classList.add("col-md-3");
    document.getElementById("time2Comp").classList.remove("col-md-2");
    document.getElementById("time2Comp").classList.add("col-md-3");
    document.getElementById("startDate2").classList.add("require");
    document.getElementById("endDate").classList.add("require");
    document.getElementById("time2").classList.add("require");
    document.getElementById("startDate").classList.remove("require");
    document.getElementById("time").classList.remove("require");
  }

  if (medicationAddType.value === "3") {
    document.getElementById("oneTime").classList.add("d-none");
    document.getElementById("dayComp").classList.remove("d-none");
    document.getElementById("recurringComp").classList.remove("col-md-3");
    document.getElementById("recurringComp").classList.add("col-md-2");
    document.getElementById("time2Comp").classList.remove("col-md-3");
    document.getElementById("time2Comp").classList.add("col-md-2");
    document.getElementById("startDate").classList.remove("require");
    document.getElementById("time").classList.remove("require");
  }
};

const checkMedicineValidation = () => {
  let error = "";
  let errorElements = document.getElementsByClassName("text-danger");
  const medicineForm = document.getElementById("addMedicine");

  if (errorElements.length > 0) {
    for (let i = errorElements.length; i > 0; i--) {
      errorElements[i - 1].remove();
    }
  }

  Array.from(medicineForm.elements).forEach((element) => {
    element.style.border = "";
  });

  Array.from(medicineForm.elements)
    .filter((element) => {
      return element.classList.contains("require");
    })
    .forEach((element) => {
      if (element.value.trim() === "") {
        document.getElementById(`${element.id}`).style.border = "1px solid red";
        error += " Fields are Complusory ";
      }

      if (element.name === "description" && element.value.trim().length > 255) {
        generateErrorElement(
          "Description must contains less than or equal to 255 characters",
          element.name
        );
        document.getElementById(`${element.id}`).style.border = "1px solid red";
      }

      if (element.name === "time" && !timeRegex.test(element.value)) {
        document.getElementById(`${element.id}`).style.border = "1px solid red";
        error += " Fields are Complusory ";
      }
    });

  if (error === "" && errorElements.length === 0) {
    return true;
  }
  return false;
};
