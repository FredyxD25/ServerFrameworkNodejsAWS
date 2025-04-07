const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const UserItem = require('../../utils/UserItem');
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

    const item = UserItem({ nombre, correo });

    const params = {
      TableName: DynamoConfig.tableName,
      Item: item,
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Usuario creado', userId: item.userId }),
    };    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
