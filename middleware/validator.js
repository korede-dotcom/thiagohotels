const {body, check, validationResult } = require('express-validator');

const validateUser = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),


  // check('role').isIn([1,2,3,4,5]).withMessage('Invalid role value')
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  
  // check('operationModel').not().isEmpty().withMessage('operationModel is required'),
}

];
const validatecreateUser = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('role_id').toInt().isIn([2,3,4,5,6]).withMessage('Invalid role value'),



  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  
  // check('operationModel').not().isEmpty().withMessage('operationModel is required'),
}
];
const validatecreateAnyUser = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('role_id').toInt().isIn([2,3,4,5,6,7,8,9]).withMessage('Invalid role value'),
  body('address').optional(),
  body('phonenumber').notEmpty().isLength(11).withMessage('phonenumber must be 11 digit'),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  
  // check('operationModel').not().isEmpty().withMessage('operationModel is required'),
}
];

const createEventConfigRules = [
  body('event_type').notEmpty().withMessage('Event type is required'),
  body('description').optional(),
  body('openning_time').notEmpty().withMessage('Opening time is required'),
  body('closing_time').notEmpty().withMessage('Closing time is required'),
  body('number_of_gusets').isInt({ min: 0 }).withMessage('Number of guests should be a positive integer'),
  body('price').notEmpty().withMessage('Price is required').isDecimal({ decimal_digits: '3' }).withMessage('Price should be a decimal with 3 digits'),
  body('branch_id')
  .notEmpty().withMessage('Branch ID is required.')
  .isInt({ min: 1 }).withMessage('Branch ID must be a positive integer.'),
body('service_id')
  .notEmpty().withMessage('Branch ID is required.')
  .isInt({ min: 1 }).withMessage('service_id must be a positive integer.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  
  // check('operationModel').not().isEmpty().withMessage('operationModel is required'),
}

];

const updateEventConfigRules = [
  body('event_type').optional(),
  body('description').optional(),
  body('openning_time').optional(),
  body('closing_time').optional(),
  body('number_of_gusets').optional().isInt({ min: 0 }).withMessage('Number of guests should be a positive integer'),
  body('price').optional().isDecimal({ decimal_digits: '3' }).withMessage('Price should be a decimal with 2 digits'),
  // body('price').optional().isDecimal({ decimal_digits: '2' }).withMessage('Price should be a decimal with 2 digits'),
  body('branch').optional(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const bookEvent = [
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
  body('email').notEmpty(),
  body('phone_number').notEmpty(),
  body('address').notEmpty().withMessage('address of guests should be a positive integer'),
  body('payment_mode').notEmpty().withMessage('Price should be a decimal with 2 digits'),
  // body('price').optional().isDecimal({ decimal_digits: '2' }).withMessage('Price should be a decimal with 2 digits'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];



const createGymConfigValidator = [
  body('exercise_type')
    .notEmpty().withMessage('Exercise type is required.')
    .isString().withMessage('Exercise type must be a string.'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string.'),
  body('openning_time')
    .optional()
    .isString().withMessage('Opening time must be a string.'),
  body('closing_time')
    .optional()
    .isString().withMessage('Closing time must be a string.'),
  body('number_of_guests')
    .optional()
    .isInt({ min: 0 }).withMessage('Number of guests must be a positive integer.'),
  body('has_class')
    .optional()
    .isBoolean().withMessage('Has class must be a boolean value.'),
  body('price')
    .notEmpty().withMessage('Price is required.')
    .isDecimal({ decimal_digits: '3' }).withMessage('Price must be a decimal value with two decimal places.'),
  body('branch')
    .notEmpty().withMessage('Branch ID is required.')
    .isInt({ min: 1 }).withMessage('Branch ID must be a positive integer.'),
  body('service_id')
    .notEmpty().withMessage('Branch ID is required.')
    .isInt({ min: 1 }).withMessage('service_id must be a positive integer.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    
    // check('operationModel').not().isEmpty().withMessage('operationModel is required'),
  }

];

const updateGymConfigValidator = [
  body('exercise_type')
  .notEmpty().withMessage('Exercise type is required.')
  .isString().withMessage('Exercise type must be a string.'),
  body('description')
  .optional()
  .isString().withMessage('Description must be a string.'),
  body('openning_time')
  .optional()
  .isString().withMessage('Opening time must be a string.'),
  body('closing_time')
  .optional()
  .isString().withMessage('Closing time must be a string.'),
  body('number_of_guests')
  .optional()
  .isInt({ min: 0 }).withMessage('Number of guests must be a positive integer.'),
  body('has_class')
  .optional()
  .isBoolean().withMessage('Has class must be a boolean value.'),
  body('price')
  .optional()
  .notEmpty().withMessage('Price is required.')
  .isDecimal({ decimal_digits: '3' }).withMessage('Price must be a decimal value with two decimal places.'),
  body('branch')
  .notEmpty().withMessage('Branch ID is required.')
  .isInt({ min: 1 }).withMessage('Branch ID must be a positive integer.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  
  // check('operationModel').not().isEmpty().withMessage('operationModel is required'),
}
  
];



const createHotelConfigValidator = [
  body('room_type').notEmpty().withMessage('Room type is required'),
  body('category_name').notEmpty().withMessage('Room name is required'),
  body('room_number').notEmpty().withMessage('Room name is required'),
  body('num_beds').notEmpty().withMessage('numb_beds is required'),
  body('has_wifi').notEmpty().withMessage('has_wifi is required'),
  body('has_ac').notEmpty().withMessage('has_wifi is required'),
  body('number_of_guests').notEmpty().withMessage('Number of guests must be at least 1'),
  body('service_id').notEmpty().withMessage("service_id is required"),
  body('price').isDecimal({ decimal_digits: '2' }).withMessage('Price must be a decimal number with 2 decimal places'),
  // body('branch')
  // .notEmpty().withMessage('branch is required.')
  // .isInt({ min: 1 }).withMessage('branch must be a positive integer.'),
// body('service_id')
//   .notEmpty().withMessage('service_idis required.')
//   .isInt({ min: 1 }).withMessage('service_id must be a positive integer.'),
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  
  // check('operationModel').not().isEmpty().withMessage('operationModel is required'),
}

];

const validateBranch = [
    body('name').not().isEmpty().withMessage('Name is required.'),
    body('address').not().isEmpty().withMessage('address is required.'),
    body('state').not().isEmpty().withMessage('state is required.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      next();
    },
  ];

const validateGenMessage = [
  body('general_message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      next();
    },
  ];


  const serviceValidator = [
    body('name').isIn(['eventhall', 'gym', 'shortlet']).withMessage('Invalid service name'),
  (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  ]


const todoListValidationRules = [
  body('title').optional().isString().trim().escape(),
  body('description').optional().isString().trim().escape(),
  body('created_by').optional().exists().isUUID(),
  body('assigned_to').exists().isUUID(),
  body('dueDate').optional().isISO8601(),
  body('completed').optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({ errors: errors.array() });
  }
];







module.exports = {validateUser,
  validatecreateUser,
  createEventConfigRules,
  updateEventConfigRules,
  createGymConfigValidator,
  updateGymConfigValidator,
  createHotelConfigValidator,
  validateBranch,
  validatecreateAnyUser,
  serviceValidator,
  validateGenMessage,
  todoListValidationRules,
  bookEvent
  
};

// module.exports = {validateUser,validateAgentManager,validateAgent};