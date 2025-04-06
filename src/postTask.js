// Importamos el SDK de AWS para interactuar con DynamoDB
const AWS = require('aws-sdk');

// Importamos una función auxiliar que construye el objeto de tarea (ver utils/buildTaskItem)
const buildTaskItem = require('./utils/buildTaskItem');

// Configuración que contiene el nombre de la tabla
const DynamoConfig = require('../config/dynamoConfig');

// Inicializamos el cliente de DynamoDB en modo Documento (usa JSON en lugar de tipos binarios)
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postTask = async (event) => {
  try {
    // Parseamos el cuerpo de la petición HTTP (viene como string)
    const body = JSON.parse(event.body);

    // Extraemos los campos necesarios del cuerpo
    const { title, description, usuarioAsignado, proyectoId, status = 'PENDING', dueDate } = body;

    // Validaciones de campos obligatorios
    if (!proyectoId || !title || !usuarioAsignado) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan campos obligatorios: 'proyectoId', 'title', 'usuarioAsignado'" }),
      };
    }

    // Validación de que el título no esté vacío
    if (title.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El título no puede estar vacío" }),
      };
    }

    // Validación de formato de fecha si se envía dueDate "YYYY-MM-DD"
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Fecha límite no válida" }),
      };
    }

    // Creamos el objeto de la tarea con todos los campos requeridos y clave compuesta (PK, SK)
    const item = buildTaskItem({ title, description, usuarioAsignado, proyectoId, status, dueDate });

    // Primer objeto de escritura: la tarea en la partición del proyecto
    const putMainTask = {
      Put: {
        TableName: DynamoConfig.tableName,
        Item: item,
      },
    };

    // Segundo objeto de escritura: relación entre usuario y tarea (para permitir consultas por usuario)
    const userTaskRelation = {
      Put: {
        TableName: DynamoConfig.tableName,
        Item: {
          PK: `USER#${usuarioAsignado}`,        // Llave primaria de la relación
          SK: `TASK#${item.taskId}`,            // Llave de orden (corresponde a la tarea)
          proyectoId,                           // Proyecto al que pertenece
          taskId: item.taskId,                  // ID de la tarea
          title,                                // Título de la tarea
          status,                               // Estado de la tarea
          dueDate,                              // Fecha límite
          GSI1PK: `USER#${usuarioAsignado}`,    // Clave secundaria para consultas por usuario
          GSI1SK: `STATUS#${status}`,           // Clave secundaria para consultar por estado
        },
      },
    };

    // Ejecutamos ambas operaciones de forma atómica usando TransactWrite
    await dynamodb.transactWrite({
      TransactItems: [putMainTask, userTaskRelation],
    }).promise();

    // Si todo salió bien, respondemos con éxito (HTTP 201)
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Tarea creada correctamente',
        task: item,  // Devolvemos la tarea creada
      }),
    };

  } catch (error) {
    // Si ocurre un error inesperado, lo mostramos en consola y respondemos con error 500
    console.error('Error al crear tarea:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
