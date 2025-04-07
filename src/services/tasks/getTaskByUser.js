const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const logError = require('../../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getTasksByUser = async (event) => {
  try {
    const userId = event.pathParameters.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Se requiere el userId en los parámetros de la URL',
        }),
      };
    }

    const params = {
      TableName: DynamoConfig.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
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
