const { Router } = require('express');
const { list, create, update, remove } = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = Router();

router.get('/', authMiddleware, list);
router.post('/', authMiddleware, create);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
