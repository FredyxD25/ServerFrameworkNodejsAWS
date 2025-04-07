const AWS = require('aws-sdk');
const DynamoConfig = require('../../config/dynamoConfig');
const ProjectItem = require('../../utils/ProjectItem');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postProject = async (event) => {
  try {
    const { titulo, descripcion, creadorId , fechalimite } = JSON.parse(event.body);

    const item = ProjectItem({ titulo, descripcion, creadorId , fechalimite});

    if (!titulo || !creadorId || !descripcion || !fechalimite) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Los campos 'titulo', 'creadorId' , fechalimite y descripcion son obligatorios." }),
      };
    }
    
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
