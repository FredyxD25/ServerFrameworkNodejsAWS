const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.deleteTask = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: 'TablaPrueba',
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
