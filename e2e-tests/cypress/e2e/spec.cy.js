describe("Main page", () => {
  it("Main page is visible", () => {
    cy.visit("/");
    cy.get("header span").should("contain.text", "Hi John Doe!");
    cy.get("h1").should("contain", "Bets");
  });

  it("Should navigate to profile page", () => {
    cy.visit("/");
    cy.get("img.avatar").click();
  });
});
