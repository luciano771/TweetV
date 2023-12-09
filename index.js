import OpenAI from "openai";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import path from 'path'


dotenv.config()


const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  
const client = new OpenAI({ apiKey: process.env.KEY_OPENAI});
async function enviarPrompt(mensaje){

    const completion = await client.chat.completions.create({
        messages: [{ role: "system", content: mensaje }],
        model: "gpt-3.5-turbo",
        temperature: 0.9
    });

    return completion.choices[0].message.content;
    
}
 

 
 
app.post('/publicacion', async (req, res) => {
    const publicacionGET = req.body.mensaje;
    const mensaje = `Estoy a punto de compartir una publicación en mis redes sociales con el siguiente contenido: '${publicacionGET}'.
    Quiero mejorar el tono y la creatividad de esta publicación considerando la audiencia, principalmente de Argentina.
    Necesito 4 ejemplos únicos y creativos, cada uno con su propio estilo y emojis para conectar de manera efectiva con la audiencia.
    Podes usar hashtags, etiquedas y todos los recursos nesesarios para hacer que el contenido sea creativo
    Por favor, proporciona el texto en formato JSON como se muestra a continuación. Es crucial mantener la misma estructura del JSON, cambiando únicamente el contenido de las publicaciones:
    {
    "1": "publicación 1",
    "2": "publicación 2",
    ...
    }`;

    try {
        const respuesta = await enviarPrompt(mensaje);
        const respuestaObjeto = JSON.parse(respuesta);
        res.json(respuestaObjeto);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

const PORT = process.env.PORT

app.listen(PORT,()=>{console.log("Escuchando en puerto: "+PORT)})

export default app;