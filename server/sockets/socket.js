const { io } = require("../server");
const { TicketControl } = require("../classes/ticket-control");
const ticketControl = new TicketControl();

io.on("connection", (client) => {
  console.log("Usuario conectado");

  client.emit("enviarMensaje", {
    usuario: "Administrador",
    mensaje: "Bienvenido a esta aplicación",
  });

  client.on("disconnect", () => {
    console.log("Usuario desconectado");
  });

  // Escuchar el cliente
  client.on("enviarMensaje", (data, callback) => {
    console.log(data);

    client.broadcast.emit("enviarMensaje", data);

    // if (mensaje.usuario) {
    //     callback({
    //         resp: 'TODO SALIO BIEN!'
    //     });

    // } else {
    //     callback({
    //         resp: 'TODO SALIO MAL!!!!!!!!'
    //     });
    // }
  });

  client.on("siguienteTicket", (data, callback) => {
    const siguiente = ticketControl.crearSiguienteTicket();
    console.log(siguiente);
    callback(siguiente);
  });

  client.emit("estadoActual", {
    actual: ticketControl.getUltimoTicket(),
    ultimosCuatro: ticketControl.getUltimosCuatro(),
  });

  client.on("atenderTicket", (data, callback) => {
    if (!data.escritorio) {
      return callback({
        err: true,
        mensaje: "Escritorio es necesario",
      });
    }

    const atenderTicket = ticketControl.atenderTicket(data.escritorio);
    callback(atenderTicket);

    /* Notificar cambios en los últimos cuatro */
    client.broadcast.emit("ultimosCuatro", {
      ultimosCuatro: ticketControl.getUltimosCuatro(),
    });
  });
});
