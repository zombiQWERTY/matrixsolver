/*
 * Javascripts
 * ========================================================================== */

import angular          from 'angular';
import MatrixController from './controller/MatrixCtrl';

import PointerEvents    from './directives/PointerEvents/PointerEventsDirective';
import ThirdParties     from './directives/ThirdParties/ThirdPartiesDirective';

import TitleService     from './services/TitleService/TitleService';

/*
 * Stylesheets
 * ========================================================================== */

/* Base
 * ===================================== */

import './stylesheets/reset.scss';
import './stylesheets/fonts.scss';
import './stylesheets/globals.scss';

/* Layout
 * ===================================== */

import './stylesheets/layout.scss';

/* Matrix
 * ===================================== */

import './stylesheets/matrix/buttons.scss';
import './stylesheets/matrix/checkboxes.scss';
import './stylesheets/matrix/home.scss';

/* ========================================================================== */

/**
 * Define app module.
 * @param {String} moduleName.
 * @param {Array} dependencies.
 * @export Module name - name of root module
 */
export default angular.module('Matrix.App', [
  PointerEvents, ThirdParties, TitleService
]).controller('MatrixController', MatrixController).name;
