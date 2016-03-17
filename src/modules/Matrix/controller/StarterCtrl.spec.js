import Matrix from '../Index';

describe('Controller: Matrix', () => {
  let $controller, controller;

  beforeEach(angular.mock.module(Matrix));

  beforeEach(angular.mock.inject((_$controller_) => {
    $controller = _$controller_;

    controller  = $controller('MatrixController', {  });
  }));

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
