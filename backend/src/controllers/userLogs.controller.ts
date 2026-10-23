import type { Request, Response } from 'express'
import * as userLogsService from '../services/admin/userLogs.service.js'

export const getUserLogsHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 10)

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        message: 'Invalid pagination parameters',
      })
    }

    const result = await userLogsService.getUserLogs(page, limit)

    return res.status(200).json({
      message: 'User logs fetched successfully',
      data: result.logs,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Get user logs error:', error)

    return res.status(500).json({
      message: 'Failed to fetch user logs',
    })
  }
}