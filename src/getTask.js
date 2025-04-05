const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getTask = async (event) => {
  try {

    const params = {
      TableName: 'TablaPrueba'
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Tarea no encontrada' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };

  } catch (error) {
    console.error('Error al obtener tarea:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
