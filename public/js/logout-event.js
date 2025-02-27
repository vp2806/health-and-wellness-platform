const socket = io();

socket.on(`logout-all-devices-${localStorage.getItem("email")}`, (data) => {
  location.reload();
  localStorage.clear();
});

socket.on(
  `logout-all-devices-except-current-${localStorage.getItem("email")}`,
  (data) => {
    location.reload();
  }
);
