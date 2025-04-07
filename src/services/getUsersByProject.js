const AWS = require('aws-sdk');
const DynamoConfig = require('../../config/dynamoConfig');
const logError = require('../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getUsersByProject = async (event) => {
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
      IndexName: 'GSI1', // asegúrate de que el nombre coincida con tu config
      KeyConditionExpression: 'GSI1PK = :projectId AND begins_with(GSI1SK, :prefix)',
      ExpressionAttributeValues: {
        ':projectId': `PROJECT#${projectId}`,
        ':prefix': 'USER#',
      },
    };

    const result = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        users: result.Items,
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
