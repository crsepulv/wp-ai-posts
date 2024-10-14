import express from "express";
import cors from 'cors';
import { extract } from "@extractus/article-extractor";

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(cors()); // Habilita CORS

// Ruta para extraer información de una URL
app.get("/extract/:url", async function (request, response) {
  const url = decodeURIComponent(request.params.url); // Decodifica la URL

  if (!url) {
    return response.status(400).json({ error: "URL is required" });
  }

  try {
    const result = await extract(url); // Llama a la función extract
    return response.json(result); // Devuelve el resultado en formato JSON
  } catch (error) {
    console.error("Error extracting article:", error);
    return response.status(500).json({ error: "Failed to extract article" });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
