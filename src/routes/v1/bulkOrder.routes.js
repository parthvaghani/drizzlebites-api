const validate = require('../../middlewares/validate');
const validation = require('../../validations/bulkOrder.validation');
const router = require('express').Router();
const controller = require('../../controllers/bulkOrder.controller');

// Public endpoints: capture and manage bulk orders
router.post('/', validate(validation.createBulkOrder), controller.create);
router.get('/', validate(validation.getBulkOrders), controller.getAll);
router.get('/:id', validate(validation.getBulkOrderById), controller.getById);
router.put('/:id', validate(validation.updateBulkOrder), controller.updateById);
router.delete('/:id', validate(validation.deleteBulkOrder), controller.deleteById);

module.exports = router;
