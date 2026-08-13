import { Router } from 'express';

import { query } from '../db.js';
import { AppError } from '../lib/errors.js';
import { asyncRoute, requireUuid } from '../lib/validate.js';

const router = Router();

/** DELETE /api/sessions/:id — één sessie wissen (berichten gaan mee via CASCADE). */
router.delete(
  '/sessions/:id',
  asyncRoute(async (req, res) => {
    const id = requireUuid(req.params.id);

    const { rowCount } = await query('DELETE FROM sessions WHERE id = $1', [id]);

    if (rowCount === 0) {
      throw new AppError('NOT_FOUND', 'Deze sessie bestaat niet meer.', 404);
    }

    res.json({ deleted: 1 });
  })
);

/** DELETE /api/data — alles wissen. Geen herstel mogelijk. */
router.delete(
  '/data',
  asyncRoute(async (_req, res) => {
    const { rowCount } = await query('DELETE FROM sessions');
    res.json({ deleted: rowCount });
  })
);

export default router;
