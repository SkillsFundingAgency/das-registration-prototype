const express = require('express')
const router = express.Router()

// Redirect old prototype
let urls = [
"/service*",
"/settings*",
"/accounts*",
"/1-0*",
"/1-2*",
"/2-0*",
"/3-0*",
"/4-0*",
"/4.1*",
"/4-2*",
"/4-3*",
"/4-4*",
"/4-5*"
]

let oldUrl = 'https://das-registration-prototype-old.herokuapp.com'

router.get(urls, (req, res, next) => {
    let urlString = req.originalUrl
    res.redirect(oldUrl + urlString)(req, res, next);
})

router.get(/\/([0-9]+)-([0-9]+)/, (req, res, next) => {
    let urlString = req.originalUrl
    res.redirect(oldUrl + urlString)(req, res, next);
})

// Add your routes here - above the module.exports line

// Add a PAYE account branching
router.post('/way-to-add-paye', function (req, res) {

  let wayToAddPaye = req.session.data['way-to-add-paye']

  if (wayToAddPaye === 'paye') {
    res.redirect('/registration/enter-paye-details')
  } else {
    res.redirect('/registration/gov-gateway-intro')
  }
})

// Add paye funding scheme branching
router.post('/registration/add-paye-scheme', function (req, res) {

  let addPayeScheme = req.session.data['add-paye-scheme']

  if (addPayeScheme === 'yes-gov-gateway') {
    res.redirect('/registration/gov-gateway-intro')
  }
  else if (addPayeScheme === 'yes-paye') {
    res.redirect('/registration/enter-paye-details')
  }
  else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=no&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

// Agreement check branching
router.post('/registration/agreement-check', function (req, res) {

  let agreementCheck = req.session.data['agreement-check']

  if (agreementCheck === 'yes') {
    res.redirect('/registration/agreement')
  } else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

// Agreement branching
router.post('/registration/agreementSign', function (req, res) {

  let agreementSign = req.session.data['agreementSign']

  if (agreementSign === 'yesSign') {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  } else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

// Review vacancy branching
router.post('/recruitment/vacancy-review', function (req, res) {

  let variableName = req.session.data['approve-reject-vacancy']

  if (variableName === 'approve-vacancy') {
    res.redirect('/recruitment/vacancy-approved')
  } else {
    res.redirect('/recruitment/vacancy-rejected')
  }
})

// Vacancy approved branching
router.post('/recruitment/vacancy-approved', function (req, res) {

  let variableName = req.session.data['what-do-next']

  if (variableName === 'review-more-vacancies') {
    res.redirect('/recruitment/vacancies-for-approval')
  } else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  }
})

// Vacancy rejected branching
router.post('/recruitment/vacancy-rejected', function (req, res) {

  let variableName = req.session.data['what-do-next']

  if (variableName === 'review-more-vacancies') {
    res.redirect('/recruitment/vacancies-for-approval')
  } else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  }
})

//Permissions changed branching
router.post('/provider-permissions/permissions-changed-confirmation', function (req, res) {

  let variableName = req.session.data['where-go-next']

  if (variableName === 'provider-homepage') {
    res.redirect('/provider-permissions/providers')
  } else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  }
})

// router.post('/page-name', function (req, res) {
//
//   let variableName = req.session.data['name-of-input']
//
//   if (variableName === 'yes') {
//     res.redirect('page-to-go-to')
//   } else {
//     res.redirect('other-page-to-go-to')
//   }
// })

//set referrer for returning from homepage
router.get('agreement', function (req, res) {
  res.render('/registration/agreement', {
          _referrer: req.query.referrer
        });
})

//set referrer for linking from homepage
router.get('recruitment', function (req, res) {
  res.render('/recruitment/recruitment', {
          _referrer: req.query.referrer
        });
})

module.exports = router
