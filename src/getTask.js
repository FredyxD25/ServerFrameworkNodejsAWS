const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const DynamoConfig = require('../config/dynamoConfig');

module.exports.getTask = async () => {
  try {
    const params = {
      TableName: DynamoConfig.tableName,
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