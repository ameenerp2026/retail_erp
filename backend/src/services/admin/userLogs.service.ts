import prisma from '../../config/prisma.js'
interface CreateAuditLogInput {
  level?: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARNING'
  action: string
  module: string
  userId?: number | null
  userName?: string | null
  description?: string | null
  ipAddress?: string | null
}

export const createAuditLog = async (
  input: CreateAuditLogInput,
) => {
    let userName = input.userName ?? null;
    if (!userName && input.userId != null) {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { name: true, email: true },
    });

    userName = user?.name ?? user?.email ?? null;
  }

  return prisma.auditLog.create({
    data: {
      level: input.level ?? "INFO",
      action: input.action,
      module: input.module,
      userId: input.userId ?? null,
      userName,
      description: input.description ?? null,
      ipAddress: input.ipAddress ?? null,
    },
  })
}

export const getUserLogs = async (
  page = 1,
  limit = 20,
) => {
  const skip = (page - 1) * limit

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.auditLog.count(),
  ])

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}