import { setWorldConstructor, World as CucumberWorld } from '@cucumber/cucumber';
import { APIRequestContext, Browser, BrowserContext, Page } from '@playwright/test';

export class BaseWorld extends CucumberWorld {

  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  request?: APIRequestContext;
}

setWorldConstructor(BaseWorld);