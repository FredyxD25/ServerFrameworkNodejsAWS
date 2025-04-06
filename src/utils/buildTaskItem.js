const { v4 } = require('uuid');

function buildTaskItem({ title, description, usuarioAsignado, proyectoId, status = 'PENDING', dueDate }) {
  const taskId = v4();
  const createdAt = new Date().toISOString();

  return {
    PK: `PROJECT#${proyectoId}`,
    SK: `TASK#${taskId}`,

    taskId,
    proyectoId,
    title,
    description,
    usuarioAsignado,
    status,
    dueDate,
    createdAt,

    GSI1PK: `USER#${usuarioAsignado}`,
    GSI1SK: `STATUS#${status}`,
  };
}

module.exports = buildTaskItem;