const AWS = require('aws-sdk');
const DynamoConfig = require('../config/dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getTasksProject = async (event) => {
  try {
    const { proyectoId } = event.pathParameters;

    if (!proyectoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El parámetro 'proyectoId' es obligatorio en la ruta." }),
      };
    }

    const params = {
      TableName: DynamoConfig.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `PROJECT#${proyectoId}`,
        ':sk': 'TASK#',
      },
    };

    const result = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ tareas: result.Items }),
    };

  } catch (error) {
    console.error('Error al consultar tareas:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};