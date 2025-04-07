const AWS = require('aws-sdk');
const DynamoConfig = require('../../config/dynamoConfig');
const logError = require('../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.deleteTasksByProject = async (event) => {
    try {
      const { projectId, taskId } = event.pathParameters;
  
      if (!projectId || !taskId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Se requieren projectId y taskId" }),
        };
      }
  
      const params = {
        TableName: DynamoConfig.tableName,
        Key: {
          PK: `PROJECT#${projectId}`,
          SK: `TASK#${taskId}`,
        },
      };
  
      await dynamodb.delete(params).promise();
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Tarea eliminada correctamente" }),
      };
  
    } catch (error) {
      return logError(error);
    }
  };
  