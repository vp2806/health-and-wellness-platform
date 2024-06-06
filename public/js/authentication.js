let error = "";
let errorElements = document.getElementsByClassName("text-danger");
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const registerUser = async () => {
  const registerForm = document.getElementById("registerUser");
  const isValidData = checkRegisterValidation(registerForm);
  if (isValidData) {
    let response = await callApi("/register", registerForm, "post");
    if (response.response_type === "error") {
      return Swal.fire({
        icon: "error",
        title: response.message,
        text: "Something went wrong!",
      });
    }

    if (response.response_type) {
      registerForm.reset();
      return Swal.fire({
        title: "Good job!",
        text: "You have Registered Successfully!",
        icon: "success",
      });
    }
  }
};

const setPassword = async () => {
  const passwordForm = document.getElementById("setPassword");
  const isValidData = checkPasswordValidation(passwordForm);
  if (isValidData) {
    let response = await callApi(
      `/activate-account/${
        window.location.pathname.split("/activate-account/")[1]
      }`,
      passwordForm,
      "post"
    );

    if (response.response_type === "error") {
      return Swal.fire({
        title: response.message,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.assign("/register");
        }
      });
    }

    if (response.response_type) {
      return Swal.fire({
        title: "Good job!",
        text: "Password Set Successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.assign("/register");
        }
      });
    }
  }
};

const loginUser = async () => {
  const loginForm = document.getElementById("loginUser");
  const isValidData = checkLoginValidation(loginForm);
  if (isValidData) {
    let response = await callApi("/login", loginForm, "post");

    if (response.response_type === "error") {
      return Swal.fire({
        icon: "error",
        title: response.message,
        text: "Something went wrong!",
      });
    }

    if (response.response_type) {
      return Swal.fire({
        title: "Good job!",
        text: "Logged In Successfully!",
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
};

const verifyEmail = async () => {
  const email = document.getElementById("email");
  const isValidData = checkEmailValidation(email);
  if (isValidData) {
  }
};

const isLinkValid = async () => {
  let response = await callApi(
    `/activate-account/${
      window.location.pathname.split("/activate-account/")[1]
    }`,
    null,
    "post"
  );

  if (response.response_type === "error" && !response.data.errors) {
    return Swal.fire({
      title: response.message,
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ok!",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.assign("/register");
      }
    });
  }
};

const checkRegisterValidation = (registerForm) => {
  const alpahbetsRegex = /^[a-zA-Z]+$/;
  const dateRegex = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])/;
  const contactNumberRegex = /^\d{10}$/gm;

  if (errorElements.length > 0) {
    for (let i = errorElements.length; i > 0; i--) {
      errorElements[i - 1].remove();
    }
  }

  Array.from(registerForm.elements).forEach((element) => {
    element.style.border = "";
  });

  Array.from(registerForm.elements).forEach((element) => {
    if (element.value.trim() === "") {
      document.getElementById(`${element.id}`).style.border = "1px solid red";
      error += " Fields are Complusory ";
    }

    if (
      element.name === "firstName" &&
      element.value.trim() !== "" &&
      !alpahbetsRegex.test(element.value.trim()) &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement("Name must contains alphabets only", element.name);
    }

    if (
      element.name === "lastName" &&
      element.value.trim() !== "" &&
      !alpahbetsRegex.test(element.value.trim()) &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement("Name must contains alphabets only", element.name);
    }

    if (
      element.name === "email" &&
      element.value.trim() !== "" &&
      !emailRegex.test(element.value.trim()) &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement("Please enter a valid email", element.name);
    }

    if (
      element.name === "dob" &&
      element.value.trim() !== "" &&
      !dateRegex.test(element.value.trim()) &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement(
        "Please enter a valid Date [YYYY-MM-DD]",
        element.name
      );
    }

    if (
      element.name === "contactNumber" &&
      element.value.trim() !== "" &&
      !contactNumberRegex.test(element.value.trim()) &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement("Please enter a Contact Number", element.name);
    }
  });

  if (error === "" && errorElements.length === 0) {
    return true;
  }
  return false;
};

const checkPasswordValidation = (passwordForm) => {
  if (errorElements.length > 0) {
    for (let i = errorElements.length; i > 0; i--) {
      errorElements[i - 1].remove();
    }
  }

  Array.from(passwordForm.elements).forEach((element) => {
    element.style.border = "";
  });

  Array.from(passwordForm.elements).forEach((element) => {
    if (element.value.trim() === "") {
      document.getElementById(`${element.id}`).style.border = "1px solid red";
      error += " Fields are Complusory ";
    }

    if (
      element.name === "password" &&
      element.value.trim() !== "" &&
      element.value.trim().length < 8 &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement(
        "Password must contains at least 8 characters",
        element.name
      );
    }

    if (
      element.name === "confirmPassword" &&
      element.value.trim() !== "" &&
      element.value.trim() !== document.getElementById("password").value &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement("Confirm Password is not matched", element.name);
    }
  });

  if (error === "" && errorElements.length === 0) {
    return true;
  }
  return false;
};

const checkLoginValidation = (loginForm) => {
  if (errorElements.length > 0) {
    for (let i = errorElements.length; i > 0; i--) {
      errorElements[i - 1].remove();
    }
  }

  Array.from(loginForm.elements).forEach((element) => {
    element.style.border = "";
  });

  Array.from(loginForm.elements).forEach((element) => {
    if (element.value.trim() === "") {
      document.getElementById(`${element.id}`).style.border = "1px solid red";
      error += " Fields are Complusory ";
    }

    if (
      element.name === "email" &&
      element.value.trim() !== "" &&
      !emailRegex.test(element.value.trim()) &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement("Please enter a valid email", element.name);
    }

    if (
      element.name === "password" &&
      element.value.trim() !== "" &&
      element.value.trim().length < 8 &&
      document
        .getElementById(`${element.name}Comp`)

        .lastElementChild.classList.contains("text-danger") === false
    ) {
      generateErrorElement(
        "Password must contains at least 8 characters",
        element.name
      );
    }
  });

  if (error === "" && errorElements.length === 0) {
    return true;
  }
  return false;
};
const checkEmailValidation = (email) => {
  if (email.value.trim() === "") {
    document.getElementById(`${email.id}`).style.border = "1px solid red";
    error += " Fields are Complusory ";
  }

  if (
    email.name === "email" &&
    email.value.trim() !== "" &&
    !emailRegex.test(email.value.trim()) &&
    document
      .getElementById(`${email.name}Comp`)

      .lastElementChild.classList.contains("text-danger") === false
  ) {
    generateErrorElement("Please enter a valid email", email.name);
  }
};

const generateErrorElement = (text, elementName) => {
  let spanElement = document.createElement("span");
  let textNode = document.createTextNode(text);
  spanElement.appendChild(textNode);

  let inputElement = document.getElementById(`${elementName}Comp`);
  inputElement.appendChild(spanElement);
  spanElement.classList.add("text-danger");
};

const callApi = async (url, formElement, method) => {
  let data = new URLSearchParams();
  if (formElement) {
    Array.from(formElement.elements).forEach((element) => {
      data.set(element.name, element.value);
    });
  } else {
    data = {};
  }

  let response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  });
  return await response.json();
};
