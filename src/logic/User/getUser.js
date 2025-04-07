const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getUser = async (event) => {
  try {
    const { userId } = event.pathParameters;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Se requiere el parámetro 'userId'." }),
      };
    }

    const params = {
      TableName: DynamoConfig.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `METADATA#${userId}`,
      },
    };

    const { Item } = await dynamodb.get(params).promise();

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Usuario no encontrado." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(Item),
    };

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
