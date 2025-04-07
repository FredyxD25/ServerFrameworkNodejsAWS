const { v4: uuidv4 } = require('uuid');


function ProjectItem({ titulo, descripcion, creadorId ,fechalimite }) {
  const projectId = uuidv4();
  const createdAt = new Date().toISOString();

  return {
    PK: `PROJECT#${projectId}`,
    SK: `METADATA#${projectId}`,
    createdAt,

    titulo,
    descripcion,
    creadorId,
    fechalimite, 

    // Para consultas por usuario creador
    GSI1PK: `USER#${creadorId}`,
    GSI1SK: `PROYECTO#${projectId}`
  };
}

module.exports = ProjectItem;