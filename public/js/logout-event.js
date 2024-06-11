const socket = io();

socket.on(`logout-all-devices-${localStorage.getItem("id")}`, (data) => {
  console.log("called");
  location.reload();
  localStorage.clear();
});

socket.on(
  `logout-all-devices-except-current-${localStorage.getItem("id")}`,
  (data) => {
    location.reload();
  }
);
