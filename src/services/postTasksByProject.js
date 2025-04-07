const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const DynamoConfig = require('../../config/dynamoConfig');
const logError = require('../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postTasksByProject = async (event) => {
  try {
    const { projectId, titulo, descripcion, usuariosAsignados, fechalimite, prioridad , estado } = JSON.parse(event.body);

  if (!projectId || !titulo  || !descripcion || !estado || !prioridad || !fechalimite || !Array.isArray(usuariosAsignados)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Se requieren projectId, titulo, descripcion, usuariosAsignados (array), fechalimite, prioridad y estado",
      }),
    };
  }


    const taskId = uuidv4();
    const createdAt = new Date().toISOString();

    const params = {
      TableName: DynamoConfig.tableName,
      Item: {
        PK: `PROJECT#${projectId}`,
        SK: `TASK#${taskId}`, // versión única por usuario
        entityType: 'TASK_PROJECT_RELATION',
  
        titulo,
        descripcion,
        usuariosAsignados,
        fechalimite,
        estado,
        prioridad,
        createdAt,
  
        GSI1PK: `USER#${usuario}`,
        GSI1SK: `ESTADO#${estado}`,
      },
    };

    await dynamodb.put(params).promise();

    return {
      estadoCode: 201,
      body: JSON.stringify({
        message: 'Tarea creada correctamente',
        projectId,
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
