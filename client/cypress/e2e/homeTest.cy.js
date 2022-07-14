describe('HomePage Test', () => {
  it('start game button', () => {
    cy.visit('/')

    cy.get('.user__textBox').type('Marisanna').should('have.value', 'Marisanna')
    cy.get('.password__textBox').type('password').should('have.value', 'password')


    cy.get('.login__btn').click()

    cy.get('.play-button').click()

    cy.url().should('eq', 'http://localhost:3000/WaitingRoom')
    cy.get('.loading').should('be.visible')
    cy.get('.waiting-text').should('be.visible')

  })


  it('view scoreboard button', () => {
    cy.visit('/')

    cy.get('.user__textBox').type('Alessio').should('have.value', 'Alessio')
    cy.get('.password__textBox').type('password').should('have.value', 'password')


    cy.get('.login__btn').click()

    cy.get('.second-button').click()

    cy.url().should('include', '/ScoreBoard')
    cy.get('#profile', { timeout: 3000}).should('be.visible')
  })

})