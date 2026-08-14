// controllers/admin/finance/subLedger.controller.ts
import { Request, Response } from 'express'
import { subLedgerService } from '../../../services/admin/finance/SubLedger.service.js'

export const getSubLedgersHandler = async (req: Request, res: Response) => {
  try {
    const data = await subLedgerService.getSubLedgers()
    return res.status(200).json({ success: true, data })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

function validateBody(body: any) {
  if (!body.subLedgerName?.trim()) {
    return { field: 'subLedgerName', message: 'Sub Ledger Name is required' }
  }
  if (!body.ledgerId) {
    return { field: 'ledgerId', message: 'Linked Ledger is required' }
  }
  if (!body.type) {
    return { field: 'type', message: 'Type is required' }
  }
  return null
}

export const createSubLedgerHandler = async (req: Request, res: Response) => {
  const validationError = validateBody(req.body)
  if (validationError) {
    return res.status(422).json({ errors: { [validationError.field]: [validationError.message] } })
  }

  try {
    const userId = (req as any).user?.id
    const data = await subLedgerService.createSubLedger(req.body, userId)
    return res.status(201).json({ success: true, message: 'Sub Ledger created successfully', data })
  } catch (err: any) {
    if (err.code === 'INVALID_LEDGER') {
      return res.status(422).json({ errors: { ledgerId: [err.message] } })
    }
    if (err.code === 'INVALID_TYPE') {
      return res.status(422).json({ errors: { type: [err.message] } })
    }
    if (err.code === 'P2002') {
      return res.status(409).json({
        errors: { subLedgerName: ['This name already exists under the selected ledger'] },
      })
    }
    if (err.code === 'P2003') {
      return res.status(422).json({ error: 'One of the selected references does not exist' })
    }
    console.error(err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

export const updateSubLedgerHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid sub ledger id' })
  }

  const validationError = validateBody(req.body)
  if (validationError) {
    return res.status(422).json({ errors: { [validationError.field]: [validationError.message] } })
  }

  try {
    const userId = (req as any).user?.id
    const data = await subLedgerService.updateSubLedger(id, req.body, userId)
    return res.status(200).json({ success: true, message: 'Sub Ledger updated successfully', data })
  } catch (err: any) {
    if (err.code === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Sub Ledger not found' })
    }
    if (err.code === 'INVALID_LEDGER') {
      return res.status(422).json({ errors: { ledgerId: [err.message] } })
    }
    if (err.code === 'INVALID_TYPE') {
      return res.status(422).json({ errors: { type: [err.message] } })
    }
    if (err.code === 'P2002') {
      return res.status(409).json({
        errors: { subLedgerName: ['This name already exists under the selected ledger'] },
      })
    }
    console.error(err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

export const deleteSubLedgerHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid sub ledger id' })
  }

  try {
    const userId = (req as any).user?.id
    await subLedgerService.deleteSubLedger(id, userId)
    return res.status(200).json({ success: true, message: 'Sub Ledger deleted successfully' })
  } catch (err: any) {
    if (err.code === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Sub Ledger not found' })
    }
    console.error(err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}