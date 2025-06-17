import request from "supertest";
import mongoose from "mongoose";
import server from "../src/server.js";
import Ruta from "../src/models/Ruta.js";
import Parada from "../src/models/Parada.js";

const tokenQuemado =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNXMDBnZTNIdEREaEE2NiIsInJvbCI6InN1cGVyLWFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTAxODkwMzUsImV4cCI6MTc1MDE5MjYzNX0.gArMRN5eeC1iBPvuHbRd956mfBVUx9JATaT-ifjPT_o";

describe("Deshabilitar parada", () => {
  let ruta;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    ruta = new Ruta({
      nombre: "Ruta de prueba",
      corredor: new mongoose.Types.ObjectId(),
      descripcion: "Ruta asociada a la parada",
      sentido: "Ida",
      frecuencia_paso: "Cada 20 minutos",
      horario_operacion: "06:00 - 21:00",
      color_ruta: "#FF5733",
      estado_actual: true,
    });
    await ruta.save();
  });

  afterEach(async () => {
    await Parada.deleteMany({});
  });

  afterAll(async () => {
    await Ruta.deleteMany({});
    await mongoose.connection.close();
  });

  it("Debe deshabilitar una parada correctamente", async () => {
    const parada = new Parada({
      nombre: "Parada Ejemplo",
      descripcion: "Parada principale.",
      ubicacion_geografica: {
        latitud: -0.144344,
        longitud: -78.488782,
      },
      direccion_referencia: "Av. Amazonas y Av. de la Prensa, cerca del intercambiador",
      accesibilidad: true,
      servicios_disponibles: ["boletería", "baños", "wifi"],
      foto_url: "https://res.cloudinary.com/ejemplo/image/upload/v1710000000/parada-labrador.jpg",
      estado_actual: true,
      rutas: [ruta._id],
    });
    await parada.save();

    const response = await request(server)
      .put(`/api/parada/deshabilitar/${parada._id}`)
      .set("Authorization", `Bearer ${tokenQuemado}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Parada deshabilitada correctamente.");

    const paradaActualizada = await Parada.findById(parada._id);
    expect(paradaActualizada.estado_actual).toBe(false);
  });
});
