const AWS = require('aws-sdk');
const { v4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.crearTarea = async (event) => {
  try {
    // Parsear el body (que viene como string)
    const { title, description } = JSON.parse(event.body);
    const createdAt = new Date().toISOString();
    const id = v4();

    const params = {
      TableName: 'TablaPrueba',
      Item: {
        id,
        title,
        description,
        createdAt,
      },
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Tarea creada correctamente', id }),
    };

  } catch (error) {
    console.error('Error al crear tarea:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
