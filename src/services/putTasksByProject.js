const AWS = require('aws-sdk');
const DynamoConfig = require('../../config/dynamoConfig');
const logError = require('../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.putTasksByProject = async (event) => {
    try {
      const { projectId, taskId, titulo, descripcion, usuariosAsignados, fechalimite, prioridad , estado } = JSON.parse(event.body);
  
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
        UpdateExpression: `set titulo = :titulo, descripcion = :descripcion, usuariosAsignados = :usuarios, fechalimite = :fecha, prioridad = :prioridad, estado = :estado`,
        ExpressionAttributeValues: {
          ':titulo': titulo,
          ':descripcion': descripcion,
          ':usuarios': usuariosAsignados,
          ':fecha': fechalimite,
          ':prioridad': prioridad,
          ':estado': estado,
        },
        ReturnValues: "ALL_NEW",
      };
  
      const result = await dynamodb.update(params).promise();
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Tarea actualizada",
          data: result.Attributes,
        }),
      };
    } catch (error) {
      return logError(error);
    }
  };
  