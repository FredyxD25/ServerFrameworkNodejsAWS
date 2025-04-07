const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.deleteUser = async (event) => {
  try {
    const { userId } = event.pathParameters;

    if (!userId ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El parámetro 'userId' es obligatorio." }),
      };
    }

    const params = {
      TableName: DynamoConfig.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `METADATA#${userId}`,
      },
    };

    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Usuario eliminado exitosamente.' }),
    };
    
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};