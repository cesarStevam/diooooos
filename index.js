const express = require('express'); // importa express, el framework para manejar rutras HTTP facilmente 
const app = express();
const port = 3000;

// middleware para permitir JSON en las peticiones
app.use(express.json()); // Permite que la api entienda el cuerpo (body) de las peticiones en formato JSON

// datos simulados  (obviamente deberian estar en base de datos )

let usuarios =[{                   // simula una base de datos.En la vida real usarias
    id:1,                         //  MySQL,MongoDB o PostgresSQL
    nombre: "cesar",
    email:"cesar@2005.com"
},{
    id:2,
    nombre: "ana",
    email:"ana@2002.com"
}];

//--- RUTAS REST ---//

//obtener todos los usuarios 

app.get('/users', (req, res)=> {    // esto es la ruta para obtener topdos los usuarios 
    res.json(usuarios);
});

//obtener un usuario por id 
app.get('/users/:id', (req, res)=> { //ruta para buscar un usuario por id -> '/users/1'
    console.log(`el id solicitado es: ${req.params.id}`) // req.params es un objeto que contiene los parametros de la ruta]`);
    const id = parseInt(req.params.id);   // paerseInt convierte string a entero, osea lee el string y lo convierte a numero
    console.log(`este es el id: ${id}`)                         // y en dado caso que el string no sea un numero devuelve NaN (not a number), 
                                        // y si el string tiene una letra despues del numero solo toma el numero y omite lo demas
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return res.status(404).json({ mensaje: "usuario no encontrado" }); 
    res.json(usuario);
    console.log(usuario);
});

//NOTA: la parte de (/users/:id) cuando se va autilizar no se tiene que colocar 
//  http://localhost:3000/users/:1 los dos puntos (:) son para indicar que es un parametro dinamico
//  y se coloca asi -> http://localhost:3000/users/1

//crear un nuevo usuario
app.post('/users', (req, res) => {
// req es request (pedido) / res es response (respuesta) re es la respuesta al cliente osea lo que el 
// servidor le responde al cliente y envia de vuelta
// reperesenta todo lo que elcliente envia al servidor cuando hace una solicitud HTTP
/**
 * el objeto tiene toda la informacion que el cliente envio en su solicitud 
 * req.params : parametros de la URL (ruta dinamica) -> /users/:id /req.params.id
 * req.query : parametros de consulta (query string) -> /users?name=stevan / req.query.name
 * req.body : cuerpo de la solicitud (datos enviados en POST/PUT) -> { "nombre": "stevan", "email": "
 * req.headers: informacion de encabezados HTTP -> req.headers['content-type'] / token,tipo de contenido, autenticacion
 * req.method: el metodo HTTP utilizado -> GET, POST, PUT, DELETE
 * req.url: la url completa de la solicitud -> /users/1
 * req.ip: direccion ip del cliente 
 */
    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre,
        email: req.body.email
    };
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
})


//actulizar un usuario existente 
app.put('/users/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex (u => u.id === id); // findIndex devuelve el indice del primer 
                                                        // elemento que cumple con la condicion especificada
                                                  
    if (index == -1) return res.status (404).json({ mensaje: "usuario no encontrado" });  // res.status sirve para enviar un codigo de estado HTTP personalizado
    usuarios[index] = {id,...req.body}
    console.log(usuarios[index]);
    res.json(usuarios[index]);
})

//eliminar un usuario
app.delete('/users/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const existe = usuarios.some (u => u.id === id );// el metodo some() se usa para comprobar si al menos un elemento de un array 
                                                      //cumple con una condicion especifica, devuelve true o false
                                                  
    if (!existe) return res.status (404).json({ mensaje: "usuario no encontrado" });

    usuarios = usuarios.filter(u => u.id !== id);
    res.json({ mensaje: "usuario eliminado" });
})


//servidor 
app.listen(port, () => {
    console.log(`servidor conrriendo en http://localhost:${port}`)
});

//la creacion de una api rest con un crud simple esta echo 
//vamoooooooos lo logre hace, ahora a estudiar mas cosas 
//xd