const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// Add a PAYE account branching
router.post('/way-to-add-paye', function (req, res) {

  let wayToAddPaye = req.session.data['way-to-add-paye']

  if (wayToAddPaye === 'paye') {
    res.redirect('/enter-paye-details')
  } else {
    res.redirect('/gov-gateway-intro')
  }
})

// Get PAYE funding branching
router.post('/get-paye-funding', function (req, res) {

  let getPayeFunding = req.session.data['get-paye-funding']

  if (getPayeFunding === 'yes') {
    res.redirect('/ways-to-add-paye-scheme')
  } else {
    res.redirect('https://employer:account@ma-employer-account.herokuapp.com/stable?add-paye-now=no&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

// Agreement branching
router.post('/accept-agreement', function (req, res) {

  let acceptAgreement = req.session.data['accept-agreement']

  if (acceptAgreement === 'yes') {
    res.redirect('https://employer:account@ma-employer-account.herokuapp.com/stable?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  } else {
    res.redirect('https://employer:account@ma-employer-account.herokuapp.com/stable?add-paye-now=yes&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})


module.exports = router
