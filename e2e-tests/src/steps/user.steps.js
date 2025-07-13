import assert from "node:assert";
import { Given, Then } from "@cucumber/cucumber";

let username = null;

Given("I have a user with the name {string}", (name) => {
  // Write code here that turns the phrase above into concrete actions
  username = name;
});

Then("the user's name should be {string}", (name) => {
  assert.equal(username, name);
});
