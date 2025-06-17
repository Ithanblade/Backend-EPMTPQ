import request from "supertest";
import mongoose from "mongoose";
import server from "../src/server.js";
import Ruta from "../src/models/Ruta.js";
import Corredor from "../src/models/Corredor.js";

const tokenQuemado =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNXMDBnZTNIdEREaEE2NiIsInJvbCI6InN1cGVyLWFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTAxODkwMzUsImV4cCI6MTc1MDE5MjYzNX0.gArMRN5eeC1iBPvuHbRd956mfBVUx9JATaT-ifjPT_o";

describe("Pruebas de actualización de rutas", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Ruta.deleteMany({});
    await Corredor.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Debe actualizar una ruta correctamente", async () => {
    const corredor = new Corredor({
      nombre: "Corredor Test",
      descripcion: "Corredor de prueba para test unitarios",
      color_identificativo: "Azul Oscuro",
      fecha_inauguracion: new Date("2020-01-01"),
      longitud_recorrido: "10 km",
      horario_operacion: "06:00 - 22:00",
      frecuencia_servicio: "Cada 10 minutos",
      rango_tarifas: "$0.25 - $0.75",
      lugares_interes: ["Estación Central", "Museo", "Parque Metropolitano"],
      tipo_vehiculos_utilizados: ["Trolebús"],
      foto_url: "https://example.com/corredor.jpg",
      ultima_actualizacion: new Date(),
    });
    await corredor.save();

    const ruta = new Ruta({
      nombre: "Ruta Inicial",
      corredor: corredor._id,
      descripcion: "Descripcion inicial",
      sentido: "Ida",
      frecuencia_paso: "Cada 15 min",
      horario_operacion: "06:00-22:00",
      color_ruta: "#000000",
      estado_actual: true,
    });
    await ruta.save();

    const nuevosDatos = {
      nombre: "Ruta Actualizada",
      corredor: corredor._id.toString(),
      descripcion: "Ruta actualizada de prueba",
      sentido: "Ida y vuelta",
      frecuencia_paso: "Cada 10 minutos",
      horario_operacion: "05:00 - 23:00",
      color_ruta: "#4CAF50",
    };

    const response = await request(server)
      .put(`/api/ruta/actualizar/${ruta._id}`)
      .set("Authorization", `Bearer ${tokenQuemado}`)
      .send(nuevosDatos);

    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Ruta actualizada exitosamente.");
    expect(response.body.ruta.nombre).toBe(nuevosDatos.nombre);
    expect(response.body.ruta.descripcion).toBe(nuevosDatos.descripcion);
    expect(response.body.ruta.sentido).toBe(nuevosDatos.sentido);
  });
});
