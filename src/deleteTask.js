const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const DynamoConfig = require('../config/dynamoConfig');

module.exports.deleteTask = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: DynamoConfig.tableName,
      Key: { id },
    };

    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tarea eliminada correctamente', id }),
    };

  } catch (error) {
    console.error('Error al eliminar tarea:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
