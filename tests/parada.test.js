import request from "supertest";
import mongoose from "mongoose";
import server from "../src/server.js";
import Parada from "../src/models/Parada.js";

describe("CRUD de Paradas", () => {
  // Antes de todo, conectamos a la base de datos de prueba
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Limpiar la colección después de cada prueba
  afterEach(async () => {
    await Parada.deleteMany({}); // Limpiar solo las paradas
  });

  // Cerrar la conexión después de las pruebas
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Debe crear una nueva parada", async () => {
    const nuevaParada = {
      nombre: "Parada Central",  
      tipo: "Estación",
      ubicacion: "Centro de la ciudad",
      rutas: [], // IDs de rutas existentes
      corredores: [], // IDs de corredores existentes
      estado: true,
    };

    const response = await request(server).post("/api/parada/registro").send(nuevaParada);


    expect(response.statusCode).toBe(201);
    expect(response.body.nuevaParada.nombre).toBe(nuevaParada.nombre);
  });

  it("Debe obtener la lista de paradas", async () => {
    const parada = new Parada({
      nombre: "Parada Norte",
      tipo: "Estación",
      ubicacion: "Zona norte",
      rutas: ["60c72b1f9d1f1e3d47d83f23"],
      corredores: ["60c72b1f9d1f1e3d47d83f25"],
      estado: true,
    });
    await parada.save();

    const response = await request(server).get("/api/paradas");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe(parada.nombre);
  });

  it("Debe obtener los detalles de una parada específica", async () => {
    const parada = new Parada({
      nombre: "Parada Este",
      tipo: "Estación",
      ubicacion: "Zona este",
      rutas: ["60c72b1f9d1f1e3d47d83f23"],
      corredores: ["60c72b1f9d1f1e3d47d83f25"],
      estado: true,
    });
    await parada.save();

    const response = await request(server).get(`/api/parada/${parada._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.nombre).toBe(parada.nombre);
  });

  it("Debe actualizar una parada existente", async () => {
    const parada = new Parada({
      nombre: "Parada Este",
      tipo: "Estación",
      ubicacion: "Zona este",
      rutas: ["60c72b1f9d1f1e3d47d83f23"],
      corredores: ["60c72b1f9d1f1e3d47d83f25"],
      estado: true,
    });
    await parada.save();

    const response = await request(server)
      .put(`/api/parada/${parada._id}`)
      .send({ nombre: "Parada Este Actualizada" });

    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Parada actualizada exitosamente.");
  });

  it("Debe eliminar una parada", async () => {
    const parada = new Parada({
      nombre: "Parada Oeste",
      tipo: "Estación",
      ubicacion: "Zona oeste",
      rutas: ["60c72b1f9d1f1e3d47d83f23"],
      corredores: ["60c72b1f9d1f1e3d47d83f25"],
      estado: true,
    });
    await parada.save();

    const response = await request(server).delete(`/api/parada/${parada._id}`);

    expect(response.statusCode).toBe(200);

    const paradaEliminada = await Parada.findById(parada._id);
    expect(paradaEliminada.estado).toBe(false);
  });
});
