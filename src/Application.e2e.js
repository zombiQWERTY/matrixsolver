describe('Application', () => {
  'use strict';

  beforeEach(() => {
    browser.get('/');
  });


  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Matrix calculator');
  });

  it('should have #app-container', () => {
    expect(element(by.css('#app-container')).isPresent()).toEqual(true);
  });

  it('should have application', () => {
    expect(element(by.css('.wrapper')).isPresent()).toEqual(true);
  });


});
