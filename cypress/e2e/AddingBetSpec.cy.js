describe('Bet creation Test', () => {

  // beforeEach(() => {
  //     let bet = {"id":1,"name":"CypressTest"}
  //     localStorage.setItem('bet', JSON.stringify(bet))
  // })

  it('Open Bet list page', () => {
    cy.on('uncaught:exception', () => {
      return false
    });
      cy.visit("list");
      // cy.get('#add-bet-button').should('be.visible');
      cy.get('#add-bet-button').click();
      
      cy.get('#bet-title').type('Test title');
      cy.get('#bet-option').type('Test option');

      cy.get('.ms-Modal .ms-Button--primary').click();
    })

})