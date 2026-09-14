export const roles=Object.freeze(['student','trainer','college_coordinator','organiser','super_admin']);
export function operational(actor){return ['organiser','super_admin'].includes(actor.role)}
export function canReadStudent(actor,student){return operational(actor)||(actor.role==='student'&&actor.id===student.user_id)||(actor.role==='college_coordinator'&&Boolean(actor.institution_id)&&actor.institution_id===student.institution_id)}
export function canManageSession(actor,session){return operational(actor)||(actor.role==='trainer'&&actor.id===session.trainer_id)}
export function canConfirmAbsence(actor,student){return actor.role==='college_coordinator'&&Boolean(actor.institution_id)&&actor.institution_id===student.institution_id}
