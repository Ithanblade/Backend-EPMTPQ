import request from "supertest";
import mongoose from "mongoose";
import server from "../src/server.js";
import Ruta from "../src/models/Ruta.js";

describe("CRUD de Rutas", () => {
  // Antes de todo, conectamos a la base de datos de prueba
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Limpiar la colección después de cada prueba
  afterEach(async () => {
    await Ruta.deleteMany({}); // Limpiar solo las rutas
  });

  // Cerrar la conexión después de las pruebas
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Debe crear una nueva ruta", async () => {
    const ruta = ({

        nombre: "C1",
        recorrido: "Terminal Quitumbe-Parada La Colón",
        horario: {
            "Lunes-Viernes": "05h00 a 18h30",
            Sabados: "06h05 a 18h00",
            Domingos: "06h00 a 17h00"
        },
        paradas: ["677d6c2183e491d731aed12a"],
        sentido: "Doble",
        corredor: "677d503183e491d731aed0f6" // Agregar el ID del corredor
    });

    const response = await request(server).post("/api/ruta/registro").send(ruta);


    expect(response.statusCode).toBe(201);
    expect(response.body.nuevaRuta.nombre).toBe(ruta.nombre); // Asegúrate de que el nombre coincida
});


  it("Debe obtener la lista de rutas", async () => {
    const ruta = new Ruta({
        nombre: "Ruta Oeste",
        recorrido: "Quitumbe - recreo",
        sentido: "Doble",
        corredor: "677d503183e491d731aed0f6",
        paradas: ["677d666783e491d731aed10c"],
        estado: true,
        horario: {
          "lunes-viernes": "06:00 - 20:00",
          sabado: "07:00 - 19:00",
          domingo: "08:00 - 18:00",
          },
      });
    await ruta.save();

    const response = await request(server).get("/api/rutas");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe(ruta.nombre);
  });

  it("Debe obtener los detalles de una ruta específica", async () => {
    const ruta = new Ruta({
        nombre: "Ruta Oeste",
        recorrido: "Quitumbe - recreo",
        sentido: "Doble",
        corredor: "677d503183e491d731aed0f6",
        paradas: ["677d666783e491d731aed10c","677d666783e491d731aed10d"],
        estado: true,
        horario: {
          "lunes-viernes": "06:00 - 20:00",
          sabado: "07:00 - 19:00",
          domingo: "08:00 - 18:00",
          },
      });
    await ruta.save();

    const response = await request(server).get(`/api/ruta/${ruta._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.nombre).toBe(ruta.nombre);
  });

  it("Debe actualizar una ruta existente", async () => {
    const ruta = new Ruta({
      nombre: "Ruta Oeste",
      recorrido: "Quitumbe - recreo",
      sentido: "Doble",
      corredor: "677d503183e491d731aed0f6",
      paradas: ["677d666783e491d731aed10c"],
      estado: true,
      horario: {
        "lunes-viernes": "06:00 - 20:00",
        sabado: "07:00 - 19:00",
        domingo: "08:00 - 18:00",
        },
    });
    await ruta.save();

    const response = await request(server)
      .put(`/api/ruta/actualizar/${ruta._id}`)
      .send({ nombre: "Ruta Oeste Actualizada" });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Ruta actualizada exitosamente.");
  });

  it("Debe eliminar una ruta", async () => {
    const ruta = new Ruta({
        nombre: "Ruta Oeste",
        recorrido: "Quitumbe - recreo",
        sentido: "Doble",
        corredor: "677d503183e491d731aed0f6",
        paradas: ["677d666783e491d731aed10c"],
        estado: true,
        horario: {
          "lunes-viernes": "06:00 - 20:00",
          sabado: "07:00 - 19:00",
          domingo: "08:00 - 18:00",
          },
      });
    await ruta.save();

    const response = await request(server).delete(`/api/ruta/eliminar/${ruta._id}`);

    expect(response.statusCode).toBe(200);

    const rutaEliminada = await Ruta.findById(ruta._id);
    expect(rutaEliminada.estado).toBe(false);
  });
});
