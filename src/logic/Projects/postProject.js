const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const ProjectItem = require('../../utils/ProjectItem');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postProject = async (event) => {
  try {
    const { nombre, descripcion, creadorId } = JSON.parse(event.body);

    if (!nombre || !creadorId || !descripcion) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Los campos 'nombre', 'creadorId' y descripcion son obligatorios." }),
      };
    }

    const item = ProjectItem({ nombre, descripcion, creadorId });
    
    const params = {
      TableName: DynamoConfig.tableName,
      Item: item,
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Proyecto creado exitosamente', projectId: item.projectId }),
    };

  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
