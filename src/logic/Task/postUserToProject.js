const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const logError = require('../../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postUserToProject = async (event) => {
  try {
    const { userId, projectId, rol } = JSON.parse(event.body);

    if (!userId || !projectId || !rol) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Se requieren 'userId', 'projectId' y 'rol'" }),
      };
    }

    const relacion = {
      PK: `USER#${userId}`,
      SK: `PROJECT#${projectId}`,
      entityType: 'USER_PROJECT_RELATION',
      rol,
      fechaAsignacion: new Date().toISOString()
    };

    const params = {
      TableName: DynamoConfig.tableName,
      Item: relacion,
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)' // Evita duplicados
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: ' Usuario asignado al proyecto correctamente',
        data: relacion
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
