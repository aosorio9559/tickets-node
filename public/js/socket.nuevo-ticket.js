const socket = io();
const label = $("#lblNuevoTicket");


socket.on("connect", () => {
  console.log("Conectado");
});

socket.on("disconnect", () => {
  console.log("Desconectado");
});

socket.on("estadoActual", (ticket) => {
  label.text(ticket.actual);
});

$("button").click(() => {
  socket.emit("siguienteTicket", null, (siguienteTicket) => {
    label.text(siguienteTicket);
  });
});
