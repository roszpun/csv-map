// https://docs.cypress.io/api/introduction/api.html
import 'cypress-file-upload';

const assignData = (cy) => {
  const yourFixturePath = 'data.csv';
  cy.get('input').attachFile(yourFixturePath);
  cy.get('select').eq(0).select('city');
  cy.get('select').eq(1).select('state');
  cy.get('select').eq(2).select('zip');
  cy.get('select').eq(3).select('address');
  cy.get('select').eq(4).select('category');
};

describe('Test upload and markers', () => {
  it('does not show button unless all columns mapped', () => {
    cy.visit('/');
    cy.get('button').should('have.length', 0);
  });

  it('Select correct mapping', () => {
    cy.visit('/');
    assignData(cy);
    cy.get('select').should(($p) => {
      expect($p).to.have.length(5);
      expect($p.eq(0)).to.have.value('city');
      expect($p.eq(1)).to.have.value('state');
      expect($p.eq(2)).to.have.value('zip');
      expect($p.eq(3)).to.have.value('address');
      expect($p.eq(4)).to.have.value('category');
    });
  });

  it('renders all markers', () => {
    cy.visit('/');
    assignData(cy);
    cy.get('button').click();
    cy.wait(1000);
    cy.get('.found-markers strong').should('contain', '12');
  });
});
