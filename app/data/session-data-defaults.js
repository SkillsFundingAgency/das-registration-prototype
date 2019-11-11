/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

const vacancies = require('./vacancies.json')

module.exports = {

  "employer-name": "Plumb Perfect Ltd",
  "recruitment-provider-scenario": "recruitment_no-provider.html",
  "recruitment-employer-scenario": "recruitment_employer-no-vacancy.html",
  "recruitment-option": "split",
  "recruitment-heading": "Recruitment",
  "provider-name": "Coventry College",
  "vacancies": vacancies
}
