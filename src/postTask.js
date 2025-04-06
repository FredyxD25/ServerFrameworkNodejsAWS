const AWS = require('aws-sdk');
const { v4 } = require('uuid');
const DynamoConfig = require('./dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postTask = async (event) => {
  try {
    
    const { nombre, usuarioAsignado, texto} = JSON.parse(event.body);
    const createdAt = new Date().toISOString();
    const id = v4();

    const params = {
      TableName: DynamoConfig.tableName,
      Item: {
        id: `PROYECTO#1`,                   // Partition Key
        sortKey: `TAREA#${id}`,             // Sort Key
        nombre,
        texto,
        usuarioAsignado,
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
