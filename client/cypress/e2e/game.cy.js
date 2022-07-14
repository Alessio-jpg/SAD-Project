import {io} from "socket.io-client"

describe('HomePage Test', () => {
  it('start game button', () => {
    cy.visit('/')

    cy.get('.user__textBox').type('giocatore4').should('have.value', 'giocatore4')
    cy.get('.password__textBox').type('password').should('have.value', 'password')


    cy.get('.login__btn').click()

    cy.get('.play-button').click()

    cy.wait(3000)

    cy.url().should('eq', 'http://localhost:3000/WaitingRoom')
    cy.get('.loading').should('be.visible')
    cy.get('.waiting-text').should('be.visible')


    const JWT1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImdzM2daTUlaTWN2aW5LbWFjaHRkIiwidXNlcm5hbWUiOiJnaW9jYXRvcmUxIiwiaWF0IjoxNjU3ODE0MjQxLCJleHAiOjE2NTc4MTQyNzF9.srpU52qCZDUBYxN_rC_flYOBcUX3LE5eIVSXIJd1QSE";
    var socket = io("localhost:5000", {
      query: "token=" + JWT1 
    })

    const JWT2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRNNFZNVWJkZWJZNXFzdTE4UE11IiwidXNlcm5hbWUiOiJnaW9jYXRvcmUyIiwiaWF0IjoxNjU3ODE0OTk4LCJleHAiOjE2NTc4MTUwMjh9.GkIclQ2y6wz_iOiT1hKr7z4ojQzTN1-g-vKWeDcBYbI";
    socket.emit("join-queue");

    var socket = io("localhost:5000", {
      query: "token=" + JWT2 
    })

    socket.emit("join-queue");

    const JWT3 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFENGNDT2ZHUFFwV0NEUHRMM3VSIiwidXNlcm5hbWUiOiJnaW9jYXRvcmUzIiwiaWF0IjoxNjU3ODE1MDU3LCJleHAiOjE2NTc4MTUwODd9.3TjVF8R8FVHwMWNl5P27NsXsRvGXKTsnKKdd1zRVFXg";
    var socket = io("localhost:5000", {
      query: "token=" + JWT3 
    })

    socket.emit("join-queue");

    cy.wait(15000);
    
    cy.get('.drowing-container')
    .trigger('mouseover', {which: 1})
    .trigger('mousedown', {which: 1})
    .trigger('mousemove', {clientX: 100, clientY: 100})
    .trigger('mouseup', {which: 1})

    cy.wait(30000);
  })
})