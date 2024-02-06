/// <reference types="Cypress" />
const username = Cypress.env('username')
const password = Cypress.env('password')
const environment = Cypress.env('ENV')
describe('JPet store app', ()=>{
    
    it('Login to app', ()=>{
    cy.log(environment)
    const url = Cypress.env(`${environment}`)
    cy.log(url)
      cy.visit(url)
      cy.contains('Sign In').click()
      cy.get('input[name="username"]').type(username)
      cy.get('input[name="password"]').clear()
      .type(password)
      cy.get('input[name="signon"]').click()

    })
})