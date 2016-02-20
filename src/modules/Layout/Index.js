/*
 * Javascripts
 * ========================================================================== */

import angular          from 'angular';
import flexibility      from './vendor/flexibility';
import LayoutController from './LayoutCtrl';
import PointerEvents    from './PointerEventsDirective';

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

/* ========================================================================== */


export default angular.module('Matrix.Layout', [
  PointerEvents
]).controller('LayoutController', LayoutController).name;
