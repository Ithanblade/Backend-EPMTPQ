import request from "supertest";
import mongoose from "mongoose";
import server from "../src/server.js";
import Administrador from "../src/models/Admin.js";

const tokenQuemado = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNXMDBnZTNIdEREaEE2NiIsInJvbCI6InN1cGVyLWFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTAxODYyMTksImV4cCI6MTc1MDE4OTgxOX0.5Op9wGWh80tl6M7jeYt-IUURnWRLT12U9_-9YESn-Ug";

describe("CRUD de Administradores (sin enviar password)", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
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

  const datosAdmin = {
    nombre: "Damian",
    apellido: "Rueda",
    direccion: "Ofelia",
    telefono: "0963012872",
    email: "ithanblade090002@gmail.com"
  };

  it("Debe registrar un nuevo administrador sin password", async () => {
    const response = await request(server)
      .post("/api/registro")
      .send(datosAdmin)
      .set("Authorization", `Bearer ${tokenQuemado}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Revisa tu correo electrónico para cambiar tu contraseña");
  });

  it("Debe listar los administradores", async () => {
    const admin = new Administrador(datosAdmin);
    admin.password = await admin.encrypPassword("temporal123");
    await admin.save();

    const response = await request(server)
      .get("/api/administradores")
      .set("Authorization", `Bearer ${tokenQuemado}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].email).toBe(datosAdmin.email);
  });

  it("Debe obtener el detalle de un administrador", async () => {
    const admin = new Administrador(datosAdmin);
    admin.password = await admin.encrypPassword("temporal123");
    await admin.save();

    const response = await request(server)
      .get(`/api/administrador/${admin._id}`)
      .set("Authorization", `Bearer ${tokenQuemado}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(datosAdmin.email);
  });

  it("Debe actualizar un administrador", async () => {
    const admin = new Administrador(datosAdmin);
    admin.password = await admin.encrypPassword("temporal123");
    await admin.save();

    const nuevosDatos = {
      ...datosAdmin,
      direccion: "Carapungo",
      telefono: "0999999999"
    };

    const response = await request(server)
      .put(`/api/administrador/${admin._id}`)
      .set("Authorization", `Bearer ${tokenQuemado}`)
      .send(nuevosDatos);

    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Administrador actualizado correctamente");
  });

  it("Debe deshabilitar un administrador", async () => {
    const admin = new Administrador(datosAdmin);
    admin.password = await admin.encrypPassword("temporal123");
    await admin.save();
    const response = await request(server)
      .put(`/api/administrador/deshabilitar/${admin._id}`)
      .set("Authorization", `Bearer ${tokenQuemado}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Administrador deshabilitado correctamente");
  });
});
