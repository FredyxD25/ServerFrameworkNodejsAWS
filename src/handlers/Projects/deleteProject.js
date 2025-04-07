const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.deleteProject = async (event) => {
  try {
    const { projectId } = event.pathParameters;

    if (!projectId ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El parámetro 'projectId' es obligatorio." }),
      };
    }

    const params = {
      TableName: DynamoConfig.tableName,
      Key: {
        PK: `PROJECT#${projectId}` ,
        SK: `METADATA#${projectId}`
      },
    };

    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Proyecto eliminado exitosamente.' }),
    };
    
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};