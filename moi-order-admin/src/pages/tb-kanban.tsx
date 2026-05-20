import { Navigate } from 'react-router-dom';

// Legacy route — redirect to Company Registrations
export default function TBKanbanPage() {
  return <Navigate to="/tb/kanban/company-reg" replace />;
}
