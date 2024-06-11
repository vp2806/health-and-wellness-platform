const startDateElements = document.getElementsByName("startDate");
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

Array.from(startDateElements).forEach((element) => {
  element.setAttribute("min", new Date().toISOString().slice(0, 10));
});

if (document.getElementById("endDate")) {
  document
    .getElementById("endDate")
    .setAttribute("min", new Date().toISOString().slice(0, 10));
}

const handleMedicationType = (medicationAddType) => {
  if (medicationAddType.value === "0") {
    document.getElementById("oneTime").classList.toggle("d-none");
    document.getElementById("recurring").classList.toggle("d-none");
    document.getElementById("startDate").classList.remove("require");
    document.getElementById("time").classList.remove("require");
    document.getElementById("startDate2").classList.add("require");
    document.getElementById("endDate").classList.add("require");
    document.getElementById("time2").classList.add("require");
    document.getElementById("recurringType").classList.add("require");
    document.getElementById("medicationAddType").classList.remove("require");
    document.getElementById("day").classList.remove("require");
  }

  if (medicationAddType.value === "1") {
    document.getElementById("oneTime").classList.toggle("d-none");
    document.getElementById("recurring").classList.toggle("d-none");
    document.getElementById("startDate").classList.add("require");
    document.getElementById("time").classList.add("require");
    document.getElementById("startDate2").classList.remove("require");
    document.getElementById("endDate").classList.remove("require");
    document.getElementById("time2").classList.remove("require");
    document.getElementById("recurringType").classList.remove("require");
    document.getElementById("medicationAddType").classList.add("require");
    document.getElementById("day").classList.remove("require");
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
    document.getElementById("recurringType").classList.add("require");
    document.getElementById("medicationAddType").classList.remove("require");
    document.getElementById("day").classList.remove("require");
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
    document.getElementById("recurringType").classList.add("require");
    document.getElementById("medicationAddType").classList.remove("require");
    document.getElementById("day").classList.add("require");
  }
};

const checkMedicineValidation = (medicineForm) => {
  let error = "";
  let errorElements = document.getElementsByClassName("text-danger");

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
      }

      if (
        (element.name === "startDate" || element.name === "endDate") &&
        !(new Date(element.value) >= new Date(new Date().toJSON().slice(0, 10)))
      ) {
        document.getElementById(`${element.id}`).style.border = "1px solid red";
        error += " Fields are Complusory ";
      }

      if (element.name === "time" && !timeRegex.test(element.value)) {
        document.getElementById(`${element.id}`).style.border = "1px solid red";
        error += " Fields are Complusory ";
      }

      if (
        element.name === "time" &&
        !(
          element.value.split(":")[1] === "00" ||
          element.value.split(":")[1] === "30"
        )
      ) {
        document.getElementById(`${element.id}`).style.border = "1px solid red";
        error += " Fields are Complusory ";
      }
    });

  if (error === "" && errorElements.length === 0) {
    return true;
  }
  return false;
};

const addMedicine = async (event) => {
  if (!event || event.key === "Enter") {
    const medicineForm = document.getElementById("addMedicine");
    const isValidData = checkMedicineValidation(medicineForm);
    if (isValidData) {
      let data = new URLSearchParams();
      Array.from(medicineForm.elements)
        .filter((element) => {
          return element.classList.contains("require");
        })
        .forEach((element) => {
          data.set(element.name, element.value);
        });

      let response = await fetch("/add-medication", {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      });

      response = await response.json();

      if (response.response_type === "error") {
        return Swal.fire({
          icon: "error",
          title: response.message,
          text: "Something went wrong!",
        });
      }

      if (response.response_type) {
        medicineForm.reset();

        return Swal.fire({
          title: "Good job!",
          text: "Medicine added Successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.assign("/dashboard");
          }
        });
      }
    }
  }
};

const getAllMedicines = async () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let response = await fetch("/get-medications", {
    method: "get",
  });
  response = await response.json();

  if (response.data.length > 0) {
    const table = document.getElementById("myMedicine");
    let tableHeader = `<thead class="table-dark"><tr>`;
    let tableBody = `<tbody>`;
    for (const key in response.data[0]) {
      if (key === "Time") {
        tableHeader += `<th>${key} [24 Hour Format]</th>`;
      } else {
        tableHeader += `<th>${key}</th>`;
      }
    }
    tableHeader += "<th>Time</th></tr></thead>";

    response.data.forEach((medicine) => {
      tableBody += "<tr>";
      for (const key in medicine) {
        if (key === "Day" && medicine[key]) {
          tableBody += `<td>${days[medicine[key]]}</td>`;
        } else if (
          (key === "Start Date" || key === "End Date") &&
          medicine[key]
        ) {
          tableBody += `<td>${medicine[key].split(" ")[0]}</td>`;
        } else if (medicine[key]) {
          tableBody += `<td>${medicine[key]}</td>`;
        } else {
          tableBody += "<td>-</td>";
        }
      }
      tableBody += `<td>${medicine["Start Date"].split(" ").pop()}</td></tr>`;
    });

    tableBody += "</tbody>";
    table.innerHTML = tableHeader + tableBody;
  } else {
    const messageElement =
      "<div class='text-dark text-center fs-3'>No Medication Found</div>";
    document.getElementById("main").innerHTML += messageElement;
  }
};
