describe('Login Test', () => {
  it('Wrong password', () => {
    cy.visit('/')

    cy.get('.user__textBox').type('utente1').should('have.value', 'utente1')
    cy.get('.password__textBox').type('12345').should('have.value', '12345')

    cy.get('.login__btn').click();

    cy.get('.modal-dialog').should('be.visible');
    cy.get('.modal-body').should(($p) => {
      expect($p).to.contain('Wrong Username or Password')
    })

  })


  it('Wrong username', () => {
    cy.visit('/')

    cy.get('.user__textBox').type('utente0').should('have.value', 'utente0')
    cy.get('.password__textBox').type('password').should('have.value', 'password')

    cy.get('.login__btn').click();

    cy.get('.modal-dialog').should('be.visible');
    cy.get('.modal-body').should(($p) => {
      expect($p).to.contain('Wrong Username or Password')
    })
  })

  it('User is already logged', () => {
    cy.visit('/')

    cy.get('.user__textBox').type('player1').should('have.value', 'player1')
    cy.get('.password__textBox').type('password').should('have.value', 'password')

    cy.get('.login__btn').click();

    cy.get('.modal-dialog').should('be.visible');
    cy.get('.modal-body').should(($p) => {
      expect($p).to.contain('User already logged-in')
    })
    
  })

  it('Successful login', () => {
    cy.visit('/')

    cy.get('.user__textBox').type('player3').should('have.value', 'player3')
    cy.get('.password__textBox').type('password').should('have.value', 'password')

    cy.get('.login__btn').click();

    cy.url().should('include', '/HomePage');
    cy.get('.username').should('be.visible');
    cy.get('.first-button').should('be.visible');
    cy.get('.second-button').should('be.visible');
    cy.get('.logo').should('be.visible');

  })



})

