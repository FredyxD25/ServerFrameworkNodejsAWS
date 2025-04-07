const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getAllProjects = async () => {
  try {
    const params = {
      TableName: DynamoConfig.tableName,
      FilterExpression: "begins_with(PK, :projectPrefix) AND begins_with(SK, :metaPrefix)",
      ExpressionAttributeValues: {
        ":projectPrefix": "PROJECT#",
        ":metaPrefix": "METADATA#"
      }
    };

    const result = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Proyectos obtenidos correctamente',
        data: result.Items
      }),
    };
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener proyectos' }),
    };
  }
};
