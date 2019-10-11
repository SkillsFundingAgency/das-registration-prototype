const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router


// Branching
router.post('/way-to-add-paye', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  let wayToAddPaye = req.session.data['way-to-add-paye']

  if (wayToAddPaye === 'paye') {
    res.redirect('/enter-paye-details')
  } else {
    res.redirect('/gov-gateway-intro')
  }
})
