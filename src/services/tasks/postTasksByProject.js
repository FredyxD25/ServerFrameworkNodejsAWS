const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const DynamoConfig = require('../../../config/dynamoConfig');
const logError = require('../../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postTasksByProject = async (event) => {
  try {
    const {
      projectId,
      titulo,
      descripcion,
      usuarios,
      fechalimite,
      prioridad,
      estado
    } = JSON.parse(event.body);

    if (
      !projectId ||
      !titulo ||
      !descripcion ||
      !estado ||
      !prioridad ||
      !fechalimite ||
      !Array.isArray(usuarios)
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Se requieren projectId, titulo, descripcion, usuarios (array), fechalimite, prioridad y estado",
        }),
      };
    }

    const taskId = uuidv4();
    const createdAt = new Date().toISOString();

    const params = {
      TableName: DynamoConfig.tableName,
      Item: {
        PK: `PROJECT#${projectId}`,
        SK: `TASK#${taskId}`,
        
        entityType: 'TASK_PROJECT_RELATION',
        titulo,
        descripcion,
        usuarios,
        fechalimite,
        estado,
        prioridad,
        createdAt,
      },
    };

    await dynamodb.put(params).promise();

    // Asignar la tarea a cada usuario
    

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Tarea creada correctamente',
        projectId,
        taskId,
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
