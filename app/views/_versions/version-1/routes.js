const express = require('express')
const router = express.Router()
const _ = require('underscore')
/*
============================================================================
Redirect to old prototype
============================================================================
*/
let urls = [
"/service*",
"/settings*",
"/accounts*"
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

/*
============================================================================
Add a PAYE account branching
============================================================================
*/
router.post('/way-to-add-paye', function (req, res) {

  let wayToAddPaye = req.session.data['way-to-add-paye']

  if (wayToAddPaye === 'paye') {
    res.redirect('/registration/enter-paye-details')
  } else {
    res.redirect('/registration/gov-gateway-intro')
  }
})

/*
============================================================================
Add paye funding scheme branching
============================================================================
*/
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

/*
============================================================================
Agreement check branching
============================================================================
*/
router.post('/registration/agreement-check', function (req, res) {

  let agreementCheck = req.session.data['agreement-check']

  if (agreementCheck === 'yes') {
    res.redirect('/registration/agreement')
  } else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

/*
============================================================================
Agreement branching
============================================================================
*/
router.post('/registration/agreementSign', function (req, res) {

  let agreementSign = req.session.data['agreementSign']
  let providerLed = req.session.data['provider-led']

  if (agreementSign === 'yesSign' && providerLed === 'yes') {
    res.redirect('/provider-permissions/change-provider-permissions?createCohort=yes&reserveFunding=yes&addVacancy=yes&notifyCandidates=yes&createShortlist=no&orgName=Coventry College')
  }
  else if (agreementSign === 'yesSign') {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  }
  else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=no&reserved-funding=no&employer-type=non-levy')
  }
})

/*
============================================================================
Check permissions answers branching
============================================================================
*/
router.post('/provider-permissions/check-permissions-answers', function (req, res) {

  let providerLed = req.session.data['provider-led']

  if (providerLed === 'yes') {
    res.redirect('https://ma-employer-account.herokuapp.com/stable?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  }
  else {
    res.redirect('permissions-changed-confirmation')
  }
})

/*
============================================================================
Review vacancy branching
============================================================================
*/
router.post('/recruitment/vacancy-review', function (req, res) {

  let variableName = req.session.data['approve-reject-vacancy']

  if (variableName === 'approve-vacancy') {
    res.redirect('/recruitment/vacancy-approved')
  }
  else {
    res.redirect('/recruitment/vacancy-rejected')
  }
})

/*
============================================================================
Vacancy approved branching
============================================================================
*/
router.post('/recruitment/vacancy-approved', function (req, res) {

  let variableName = req.session.data['what-do-next']

  if (variableName === 'review-more-vacancies') {
    res.redirect('/recruitment/vacancies-for-approval')
  }
  else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  }
})

/*
============================================================================
Vacancy rejected branching
============================================================================
*/
router.post('/recruitment/vacancy-rejected', function (req, res) {

  let variableName = req.session.data['what-do-next']

  if (variableName === 'review-more-vacancies') {
    res.redirect('/recruitment/vacancies-for-approval')
  }
  else {
    res.redirect((req.session.data['referrer'] || 'https://ma-employer-account.herokuapp.com/stable')+'?add-paye-now=yes&sign-agreement-now=yes&reserved-funding=yes&employer-type=non-levy')
  }
})

/*
============================================================================
Permissions changed branching
============================================================================
*/
router.post('/provider-permissions/permissions-changed-confirmation', function (req, res) {

  let variableName = req.session.data['where-go-next']

  if (variableName === 'provider-homepage') {
    res.redirect('/provider-permissions/providers')
  }
  else {
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

/*
============================================================================
Set referrer for returning from homepage
============================================================================
*/
router.get('agreement', function (req, res) {
  res.render('/registration/agreement', {
          _referrer: req.query.referrer
        });
})

/*
============================================================================
Set referrer for linking from homepage
============================================================================
*/
router.get('recruitment', function (req, res) {
  res.render('/recruitment/recruitment', {
          _referrer: req.query.referrer
        });
})

/*
============================================================================
Filter vacancies
============================================================================
*/

router.get('/recruitment/recruitment-layout-options', function (req, res) {
  let s = req.session.data['status-filter']
  let v = req.session.data['vacancies']
  let filteredVacancies = (s == 'All') ? v : _.filter(v, function(i) {return i.status === s});

  res.render('recruitment/recruitment-layout-options', {filteredVacancies})
})

module.exports = router
