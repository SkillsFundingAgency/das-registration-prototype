const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

// Add a PAYE account branching
router.post('/way-to-add-paye', function (req, res) {

  let wayToAddPaye = req.session.data['way-to-add-paye']

  if (wayToAddPaye === 'paye') {
    res.redirect('/enter-paye-details')
  } else {
    res.redirect('/gov-gateway-intro')
  }
})
