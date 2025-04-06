const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const DynamoConfig = require('./dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.updateTask = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { title, description } = body;

    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos: title o description' }),
      };
    }

    const createdAt = new Date().toISOString();
    const id = uuidv4();

    const params = {
      TableName: DynamoConfig.tableName,
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // útil para CORS si accedes desde frontend
      },
    };
  } catch (error) {
    console.error('Error al crear tarea:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};