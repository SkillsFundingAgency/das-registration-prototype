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
/*
============================================================================
Versions
============================================================================
*/
router.use(/\/_versions\/version-([0-99]+)/, (req, res, next) => {
    require(`./views/_versions/version-${req.params[0]}/routes`)(req, res, next);
})

// Branching starts here

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

router.get('/recruitment/recruitment-layout-table', function (req, res) {
  let s = req.session.data['status-filter']
  let v = req.session.data['vacancies']
  let filteredVacancies = (s == 'All') ? v : _.filter(v, function(i) {return i.status === s});

  res.render('recruitment/recruitment-layout-table', {filteredVacancies})
})


/*
============================================================================
Permissions consolidated - option for UR
============================================================================
*/
router.post('/recruitment/permission-consolidated-radios', function (req, res) {

     let permissionToRecruit = req.session.data['permission-to-recruit']
     let permissionToAdd = req.session.data['permission-to-add']

     if(req.session.data['do-you-give-permission-to-recruit'] == 'Allow'){
		res.redirect('permission-consolidated-confirm-V2')
	} else if (req.session.data['do-you-give-permission-to-recruit'] == 'Allow, but I want to review job adverts before they’re advertised') {
          res.redirect('permission-consolidated-confirm-V3')
     } else {
		res.redirect('permission-consolidated-confirm-V1')
	}
})

router.post('/recruitment/permission-consolidated-confirm-V1', function (req, res) {

     let confirmChangesToPermission = req.session.data['confirm-permissions-change']

     if(req.session.data['confirm-permissions-change'] == 'Yes'){
          res.redirect('providers-changed')
	} else {
          res.redirect('providers')
	}

})

router.post('/recruitment/permission-consolidated-confirm-V2', function (req, res) {
     res.redirect('providers-changed')
})

/*
============================================================================
EMPLOYER ACCOUNT - SUBMIT/REJECT ADVERT
============================================================================
*/

router.post('/review-adverts/advert-edit-v2', (req, res) => {
	if(req.session.data['advert-option'] == 'submit-advert'){
		res.redirect('confirmation-approve-v2')
	} else {
		res.redirect('reject-journey/confirmation-reject')
	}
})


/*
============================================================================
EMPLOYER ACCOUNT - APPROVE ADVERT
============================================================================
*/
router.post('/review-adverts/success', function (req, res) {

  let approveadvert = req.session.data['approve-advert']

  if (approveadvert === 'true') {
    res.redirect('/review-adverts/success')
  }
  else if (approveadvert === 'false') {
    res.redirect('/review-adverts/advert-edit')
  }
})

/*
============================================================================
EMPLOYER ACCOUNT - APPROVE ADVERT V2
============================================================================
*/
router.post('/review-adverts/confirmation-approve-v2', (req, res) => {
	if(req.session.data['approve-advert-v2'] == 'true'){
		res.redirect('success-v2')
	} else {
		res.redirect('advert-edit-v2')
	}
})


/*
============================================================================
EMPLOYER ACCOUNT - REJECT ADVERT
============================================================================
*/

router.post('/review-adverts/reject-journey/success', function (req, res) {

  let rejectadvert = req.session.data['reject-advert']

  if (rejectadvert === 'true') {
    res.redirect('/review-adverts/reject-journey/success')
  }
  else if (rejectadvert === 'false') {
    res.redirect('/review-adverts/advert-edit')
  }
})

/*
============================================================================
TRAINING PROVIDER - EMPLOYER ORGANISATION
============================================================================
*/

router.post('/recruitment/provider-view/create', function (req, res) {

  let employerid = req.session.data['SelectedEmployerId']

  if (employerid === 'VB8W4N') {
    res.redirect('/recruitment/provider-view/create/organisation')
  }
  else {
    res.redirect('/recruitment/provider-view/create/choose-title')
  }
})


/*
============================================================================
EMPLOYER - TP PERMISSIONS
============================================================================
*/


/*
============================================================================
How the routes are broken down
1. Line 386 - Router.post highlights the location and name of the branch we want the prototype to use. In this case, our rule is found on the route of /298/employer/ and is called permissions

2. Line 388 - we set the variable that we need the rule to listen to and work with. In this case, 'recapprentices' is the variable used in the rule and 'do-you-give-permission-to-recruit' is the name of the component we need it to listen to 
***NOTE*** While the variable used in the JS below can be anything, the on page 'name ('do-you-give-permission-to-recruit') must be unique and doesn't need to be on the same page as the JS rule

3. Line 390 - we start our logic - If 'our variable' = 'allow' then do this (redirect to confirm-v2)

4. Line 395 - else if uses the same variable but if a different value is selected then go to the v1 url

5. Line 400 if neither of the rules above apply then go to v3

for the code on this page view -> /298/employer/permission-consolidated-radios
To run the page on your browser go to -> http://localhost:3000/298/employer/permission-consolidated-radios
============================================================================
*/
router.post(`/298/employer/permissions`, function (req, res) {
  
let recapprentices = req.session.data['do-you-give-permission-to-recruit'];

  if (
      recapprentices === 'Allow'
     ) {
      res.redirect(`/298/employer/permission-consolidated-confirm-v2`);
  }
    else if (
              recapprentices === 'Allow, but I want to review job adverts before they’re advertised'
     ) {
      res.redirect(`/298/employer/permission-consolidated-confirm-v1`);
  }
 else res.redirect(`/298/employer/permission-consolidated-confirm-v3`);
});




/* 389 starts */
router.post(`/389/v2/review-changes`, function (req, res) {
  
  let reviewChanges = req.session.data['confirm-stop-date'];
  
    if (
      reviewChanges === 'Yes, I agree with the suggested stop date'
       ) {
        res.redirect(`/389/v2/change-confirmed-stopped`);
    }
      else if (
        reviewChanges === 'No, this is not the correct stop date'
       ) {
        res.redirect(`/389/v2/change-confirmed-stopped-amended`);
    }
   else res.redirect(`/389/v2/change-confirmed-rejected`);
  });


  router.post(`/389/v4/stop-request`, function (req, res) {
  
    let reviewChanges = req.session.data['confirm-stop-date'];
    
      if (
        reviewChanges === 'Stop this apprenticeship'
         ) {
          res.redirect(`/389/v4/stopped-date`);
      }
        else if (
          reviewChanges === 'Reject the suggested stop date, this apprenticeship has not left our employment'
         ) {
          res.redirect(`/389/v4/rejection-reason`);
      }
     else res.redirect(`/389/v4/apprentice-details`);
    });

/* 389 ends */

/* 389 starts */
router.post(`/389/v3/review-changes`, function (req, res) {
  
  let reviewChanges = req.session.data['confirm-stop-date'];
  
    if (
      reviewChanges === 'Stop this apprenticeship'
       ) {
        res.redirect(`/389/v3/stop-date-confirmation`);
    }
      else if (
        reviewChanges === 'Reject the suggested stop date, this apprentice has not left our employment'
       ) {
        res.redirect(`/389/v3/rejection-reason`);
    }
   else res.redirect(`/389/v3/change-confirmed-rejected`);
  });


  router.post(`/389/v5/stop-request`, function (req, res) {
  
    let reviewChanges = req.session.data['confirm-stop-date'];
    
      if (
        reviewChanges === 'Stop this apprenticeship'
         ) {
          res.redirect(`/389/v5/stopped-date`);
      }
        else if (
          reviewChanges === 'Reject the suggested stop date, this apprenticeship has not left our employment'
         ) {
          res.redirect(`/389/v5/rejection-reason`);
      }
     else res.redirect(`/389/v5/apprentice-details`);
    });



/* 389 ends */




/* reservation pause - who is adding the apprentices */

router.post('/reservation-pause/employer/adding-apprentices', function (req, res) {

  let addapprentices = req.session.data['add-apprentice']

  if (addapprentices === 'employer') {
    res.redirect('/reservation-pause/employer/employer-add-apprentices-jan-choose-reservation')
  }
  else if (addapprentices === 'provider') {
    res.redirect('/reservation-pause/employer/employer-add-apprentices-jan-message-provider')
  }
})

/* END reservation pause - who is adding the apprentices */


module.exports = router
