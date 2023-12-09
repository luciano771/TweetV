import OpenAI from "openai";
import express from 'express';
import cors from 'cors';
 

const app = express();
app.use(cors());
app.use(express.json());

  
const client = new OpenAI({ apiKey: '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' });
async function enviarPrompt(mensaje){

    const completion = await client.chat.completions.create({
        messages: [{ role: "system", content: mensaje }],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
    
}
 

 
 
app.post('/publicacion', async (req, res) => {
    const publicacionGET = req.body.mensaje;
    const mensaje = `Quiero publicar contenido en Twitter, esta es mi publicacion: '${publicacionGET}'
    Quiero que mejores mi publicacion, tene en cuenta que la audiencia es de Argentina
    Necesito que todos los ejemplos sean distintos y creativos, siempre usando emoticones
    Dame 6 ejemplos dentro de un json en texto
    { 1:{publicacion}, 2:{publicacion},... }`;
    try {
        const respuesta = await enviarPrompt(mensaje);
        const respuestaObjeto = JSON.parse(respuesta);
        res.json(respuestaObjeto);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});
 
app.listen(3000,()=>{console.log("Listen on port 3000")})

export default app;