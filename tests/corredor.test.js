import request from "supertest";
import mongoose from "mongoose";
import server from "../src/server.js";
import Corredor from "../src/models/Corredor.js";

const tokenQuemado = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNXMDBnZTNIdEREaEE2NiIsInJvbCI6InN1cGVyLWFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTAxODYyMTksImV4cCI6MTc1MDE4OTgxOX0.5Op9wGWh80tl6M7jeYt-IUURnWRLT12U9_-9YESn-Ug";

describe("CRUD de Corredores", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Corredor.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Debe listar corredores con datos completos", async () => {
    const corredorCompleto = {
      nombre: "CCN 17",
      descripcion: "Corredor ecológico con transporte eficiente",
      color_identificativo: "Verde Oscuro",
      fecha_inauguracion: new Date("2020-05-15T00:00:00.000Z"),
      longitud_recorrido: "15 km",
      horario_operacion: "06:00 - 22:00",
      frecuencia_servicio: "Cada 10 minutos",
      rango_tarifas: "$0.25 - $1.00",
      lugares_interes: [
        "Parque Central",
        "Estación Terminal",
        "Museo de la Ciudad"
      ],
      tipo_vehiculos_utilizados: [
        "Trolebús",
        "Bus eléctrico"
      ],
      foto_url: "https://example.com/imagen-corredor.jpg",
      ultima_actualizacion: new Date("2025-05-01T12:00:00.000Z")
    };

    await Corredor.create(corredorCompleto);

    const response = await request(server)
      .get("/api/corredores")
      .set("Authorization", `Bearer ${tokenQuemado}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);


    const corredor = response.body[0];
    expect(corredor).toHaveProperty("nombre", corredorCompleto.nombre);
    expect(corredor).toHaveProperty("descripcion", corredorCompleto.descripcion);
    expect(corredor).toHaveProperty("color_identificativo", corredorCompleto.color_identificativo);
    expect(new Date(corredor.fecha_inauguracion)).toEqual(corredorCompleto.fecha_inauguracion);
    expect(corredor.lugares_interes).toEqual(expect.arrayContaining(corredorCompleto.lugares_interes));
    expect(corredor.tipo_vehiculos_utilizados).toEqual(expect.arrayContaining(corredorCompleto.tipo_vehiculos_utilizados));
  });
});
