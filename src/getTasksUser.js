// getTasksByUser.js
const AWS = require('aws-sdk');
const DynamoConfig = require('../config/dynamoConfig');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getTasksUser = async (event) => {
  try {
    const { userId, status } = event.pathParameters;

    const params = {
      TableName: DynamoConfig.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk',
      ExpressionAttributeValues: {
        ':gsi1pk': `USER#${userId}`,
        ':gsi1sk': `STATUS#${status}`,
      },
    };

    const result = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        tareas: result.Items,
        count: result.Count,
      }),
    };
  } catch (error) {
    console.error('Error al consultar tareas por usuario y estado:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
