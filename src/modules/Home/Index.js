/*
 * Javascripts
 * ========================================================================== */

import angular        from 'angular';
import HomeController from './HomeCtrl';
import FormChange     from './FormChangeDirective';

/*
 * Stylesheets
 * ========================================================================== */

import './stylesheets/home.scss';
import './stylesheets/buttons.scss';
import './stylesheets/checkboxes.scss';

/* ========================================================================== */


export default angular.module('Matrix.Home', [
  FormChange
]).controller('HomeController', HomeController).name;
