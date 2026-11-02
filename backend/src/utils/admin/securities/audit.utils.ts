import { createAuditLog } from '../../../services/admin/userLogs.service.js'
import { AuthRequest } from '../../../middleware/auth.middleware.js'

export const audit = async (
  req: AuthRequest,
  module: string,
  action: string,
  description: string,
  level: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' = 'SUCCESS',
) => {
  try {
    await createAuditLog({
      level, action, module, description,
      userId: req.user?.id ?? null,
      userName: req.user?.email ?? null,
      ipAddress: req.ip,
    })
  } catch (e) {
    console.error('Audit failed', e) 
  }
}