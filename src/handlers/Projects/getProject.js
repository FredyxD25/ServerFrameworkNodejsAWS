const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getProject = async (event) => {
  try {
    const { projectId } = event.pathParameters;

    if (!projectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el parámetro 'projectId'" }),
      };
    }

    const params = {
      TableName: DynamoConfig.tableName,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: `METADATA#${projectId}`
      }
    };

    const { Item } = await dynamodb.get(params).promise();

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Proyecto no encontrado' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(Item),
    };

  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
