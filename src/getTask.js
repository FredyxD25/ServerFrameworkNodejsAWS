const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getTask = async () => {
  try {
    const params = {
      TableName: 'TablaPrueba',
    };

    const data = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };

  } catch (error) {
    console.error('Error al obtener tareas:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener las tareas' }),
    };
  }
};