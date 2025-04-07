const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const DynamoConfig = require('../../../config/dynamoConfig');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postUser = async (event) => {
  try {
    const { nombre, correo } = JSON.parse(event.body);

    if (!nombre || !correo) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Campos 'nombre' y 'correo' son obligatorios." }),
      };
    }

    const userId = uuidv4(); // ID único generado
    const createdAt = new Date().toISOString();

    const params = {
      TableName: DynamoConfig.tableName,
      Item: {
        PK: `USER#${userId}`,
        SK: `METADATA#${userId}`,
        userId,
        nombre,
        correo,
        createdAt
      },
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Usuario creado', userId }),
    };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
