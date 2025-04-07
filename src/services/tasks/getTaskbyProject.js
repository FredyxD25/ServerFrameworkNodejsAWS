const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const logError = require('../../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getTasksByProject = async (event) => {
  try {
    const projectId = event.pathParameters.projectId;

    if (!projectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Se requiere el projectId en los parámetros de la URL',
        }),
      };
    }

    const params = {
      TableName: DynamoConfig.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `PROJECT#${projectId}`,
        ':sk': 'TASK#',
      },
    };

    const result = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        tasks: result.Items,
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
