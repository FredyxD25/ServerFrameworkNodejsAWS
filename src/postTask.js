const AWS = require('aws-sdk');
const { v4 } = require('uuid');
const DynamoConfig = require('../config/dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postTask = async (event) => {
  try {
    // Parsear el body
    const { title, description, usuarioAsignado, proyectoId } = JSON.parse(event.body);

    if (!proyectoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El campo 'proyectoId' es obligatorio." }),
      };
    }

    const createdAt = new Date().toISOString();
    const taskId = v4(); // UUID único para la tarea

    const params = {
      TableName: DynamoConfig.tableName,
      Item: {
        id: `PROYECTO#${proyectoId}`,       // PK dinámica
        sortKey: `TAREA#${taskId}`,         // SK única por tarea
        nombre: title,
        descripcion: description,
        usuarioAsignado,
        createdAt,
      },
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Tarea creada correctamente',
        proyectoId,
        taskId,
      }),
    };

  } catch (error) {
    console.error('Error al crear tarea:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
