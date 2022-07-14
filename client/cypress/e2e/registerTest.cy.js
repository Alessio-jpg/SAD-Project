describe('Register Test', () => {
  it('register', () => {
    cy.visit('/Register')

    cy.get('.username__textBox').type('utente_reg').should('have.value', 'utente_reg')
    cy.get('.password__textBox').type('password').should('have.value', 'password')

    cy.get('.register__btn').click()

    cy.get('.modal-dialog').should('be.visible')
    cy.get('.modal-body').should(($p) => {
      expect($p).to.contain('Great Username')
    })

    cy.get('.login-reg').click()
    cy.url().should('include', '/');
  })
})