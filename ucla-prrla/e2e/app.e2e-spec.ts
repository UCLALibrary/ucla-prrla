import { UclaPrrlaPage } from './app.po';

describe('ucla-prrla App', () => {
  let page: UclaPrrlaPage;

  beforeEach(() => {
    page = new UclaPrrlaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
