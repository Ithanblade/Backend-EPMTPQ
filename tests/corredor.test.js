  import request from "supertest";
  import mongoose from "mongoose";
  import server from "../src/server.js";
  import Corredor from "../src/models/Corredor.js";

  describe("CRUD de Corredores", () => {
    // Antes de todo, conectamos a la base de datos de prueba
    beforeAll(async () => {
      await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    });

    // Limpiar la colección después de cada prueba
    afterEach(async () => {
      await Corredor.deleteMany({}); // Limpiar solo los corredores
    });

    // Cerrar la conexión después de las pruebas
    afterAll(async () => {
      await mongoose.connection.close();
    });

    it("Debe crear un nuevo corredor", async () => {
      const nuevoCorredor = {
        nombre: "Corredor A",  
        historia: "Historia del corredor",
        tarifa: { preferencial: 0.25, reducida: 0.15, normal: 0.30 },
        vehiculos: { MB0500: 10, biarticulados: 5, trolebus: 15 },
        "tipo de servicio": "Público",
        longitud: 12.5,
        "integracion alimentador": "Fisica",
        "integracion corredores": "Fisica y tarifa",
        inauguracion: "2020-01-01",
        "demanda diaria": "1000",
        paradas: [],
      };

      const response = await request(server).post("/api/corredor/registro").send(nuevoCorredor);

      expect(response.statusCode).toBe(201);
      expect(response.body.nuevoCorredor.nombre).toBe(nuevoCorredor.nombre);
    });

    it("Debe obtener la lista de corredores", async () => {
      const corredor = new Corredor({
        nombre: "Corredor Norte",
        historia: "Historia del corredor",
        tarifa: { preferencial: 0.25, reducida: 0.15, normal: 0.30 },
        vehiculos: { MB0500: 10, biarticulados: 5, trolebus: 15 },
        "tipo de servicio": "Público",
        longitud: 12.5,
        "integracion alimentador": "Fisica",
        "integracion corredores": "Fisica y tarifa",
        inauguracion: "2020-01-01",
        "demanda diaria": "1000",
        paradas: [],
      });
      await corredor.save();

      const response = await request(server).get("/api/corredores");

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].nombre).toBe(corredor.nombre);
    });

    it("Debe obtener los detalles de un corredor específico", async () => {
      const corredor = new Corredor({
        nombre: "Corredor Este",
        historia: "Historia del corredor",
        tarifa: { preferencial: 0.25, reducida: 0.15, normal: 0.30 },
        vehiculos: { MB0500: 10, biarticulados: 5, trolebus: 15 },
        "tipo de servicio": "Público",
        longitud: 12.5,
        "integracion alimentador": "Fisica",
        "integracion corredores": "Fisica y tarifa",
        inauguracion: "2020-01-01",
        "demanda diaria": "1000",
        paradas: [],
      });
      await corredor.save();

      const response = await request(server).get(`/api/corredor/${corredor._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.nombre).toBe(corredor.nombre);
    });

    it("Debe actualizar un corredor existente", async () => {
      const corredor = new Corredor({
          nombre: "Corredor Este",
          historia: "Historia del corredor",
          tarifa: { preferencial: 0.25, reducida: 0.15, normal: 0.30 },
          vehiculos: { MB0500: 10, biarticulados: 5, trolebus: 15 },
          "tipo de servicio": "Público",
          longitud: 12.5,
          "integracion alimentador": "Fisica",
          "integracion corredores": "Fisica y tarifa",
          inauguracion: "2020-01-01",
          "demanda diaria": "1000",
          paradas: [],
        });
      await corredor.save();

      const response = await request(server)
        .put(`/api/corredor/actualizar/${corredor._id}`)
        .send({ nombre: "Corredor Sur Actualizado" });

      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("Corredor actualizado exitosamente.");
    });

    it("Debe eliminar un corredor", async () => {
      const corredor = new Corredor({
          nombre: "Corredor Este",
          historia: "Historia del corredor",
          tarifa: { preferencial: 0.25, reducida: 0.15, normal: 0.30 },
          vehiculos: { MB0500: 10, biarticulados: 5, trolebus: 15 },
          "tipo de servicio": "Público",
          longitud: 12.5,
          "integracion alimentador": "Fisica",
          "integracion corredores": "Fisica y tarifa",
          inauguracion: "2020-01-01",
          "demanda diaria": "1000",
          paradas: [],
        });
      await corredor.save();

      const response = await request(server).delete(`/api/corredor/eliminar/${corredor._id}`);

      expect(response.statusCode).toBe(200);

      const corredorEliminado = await Corredor.findById(corredor._id);
      expect(corredorEliminado).toBeNull();
    });
  });