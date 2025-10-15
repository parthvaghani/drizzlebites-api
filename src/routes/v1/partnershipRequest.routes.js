const validate = require('../../middlewares/validate');
const validation = require('../../validations/partnershipRequest.validation');
const router = require('express').Router();
const controller = require('../../controllers/partnershipRequest.controller');

// Public endpoints: capture and list partnership requests
router.post('/', validate(validation.createPartnershipRequest), controller.create);
router.get('/', validate(validation.getPartnershipRequests), controller.getAll);
router.get('/:id', validate(validation.getPartnershipRequestById), controller.getById);
router.delete('/:id', validate(validation.deletePartnershipRequest), controller.deleteById);

module.exports = router;
