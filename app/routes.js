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

// Add paye funding scheme branching
router.post('/add-paye-scheme', function (req, res) {

  let addPayeScheme = req.session.data['add-paye-scheme']

  if (addPayeScheme === 'yes-gov-gateway') {
    res.redirect('/gov-gateway-intro')
  }
  else if (addPayeScheme === 'yes-paye') {
    res.redirect('/enter-paye-details')
  }
  else {
    res.redirect('https://employer:account@ma-employer-account.herokuapp.com/stable?add-paye-now=no&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

// Agreement branching
router.post('/agreementSign', function (req, res) {

  let agreementSign = req.session.data['agreementSign']

  if (agreementSign === 'yesSign') {
    res.redirect('https://employer:account@ma-employer-account.herokuapp.com/stable?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  } else {
    res.redirect('https://employer:account@ma-employer-account.herokuapp.com/stable?add-paye-now=yes&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

// Agreement check branching
router.post('/agreement-check', function (req, res) {

  let agreementCheck = req.session.data['agreement-check']

  if (agreementCheck === 'yes') {
    res.redirect('agreement')
  } else {
    res.redirect('https://employer:account@ma-employer-account.herokuapp.com/stable?add-paye-now=yes&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

router.get('agreement', function (req, res) {
  res.render('agreement', {
          _referrer: req.query.referrer
        });
})

// router.post('/page-name', function (req, res) {
//
//   let variableName = req.session.data['name-on-input']
//
//   if (variableName === 'yes') {
//     res.redirect('page-to-go-to')
//   } else {
//     res.redirect('other-page-to-go-to')
//   }
// })

module.exports = router
