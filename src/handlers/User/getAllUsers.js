const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getAllUsers = async () => {
  try {
    const params = {
      TableName: DynamoConfig.tableName,
      FilterExpression: "begins_with(PK, :userPrefix) AND begins_with(SK, :metaPrefix)",
      ExpressionAttributeValues: {
        ":userPrefix": "USER#",
        ":metaPrefix": "METADATA#"
      }
    };

    const result = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Usuarios obtenidos correctamente',
        data: result.Items
      }),
    };
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener usuarios' }),
    };
  }
};
