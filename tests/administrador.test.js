import request from "supertest";
import mongoose from "mongoose";
import server from "../src/server.js";
import Administrador from "../src/models/Admin.js";

describe("CRUD de Administradores", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Administrador.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Debe registrar un nuevo administrador", async () => {
    const nuevoAdministrador = {
      nombre: "Admin",
      apellido: "Prueba",
      direccion: "Calle 123",
      telefono: "0987654321",
      email: "admin@test.com",
      password: "Admin123Quito"
    };

    const response = await request(server).post("/api/registro").send(nuevoAdministrador);

    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Revisa tu correo electrónico para confirmar tu cuenta");
  });

  it("Debe listar los administradores", async () => {
    const admin = new Administrador({
      nombre: "Admin",
      apellido: "Prueba",
      direccion: "Calle 123",
      telefono: "0987654321",
      email: "admin@test.com",
      password: "Admin123Quito"
    });
    await admin.save();

    const response = await request(server).get("/api/administradores");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].email).toBe(admin.email);
  });

  it("Debe obtener el detalle de un administrador", async () => {
    const admin = new Administrador({
      nombre: "Admin",
      apellido: "Prueba",
      direccion: "Calle 123",
      telefono: "0987654321",
      email: "admin@test.com",
      password: "Admin123Quito"
    });
    await admin.save();

    const response = await request(server).get(`/api/administrador/${admin._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(admin.email);
  });

  it("Debe actualizar un administrador", async () => {
    const admin = new Administrador({
      nombre: "Admin",
      apellido: "Prueba",
      direccion: "Calle 123",
      telefono: "0987654321",
      email: "admin@test.com",
      password: "Admin123Quito"
    });
    await admin.save();

    const response = await request(server)
      .put(`/api/administrador/${admin._id}`)
      .send({ nombre: "Admin Actualizado" });

    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Perfil actualizado correctamente");
  });

});

