import angular             from 'angular';
import uiRouter            from 'angular-ui-router';
import uiRouterStateHelper from 'angular-ui-router.statehelper';

import Config              from './Config';
import Runners             from './Runners';
import MatrixView          from './modules/Matrix/views/layout.jade';

import Controllers         from './modules/Matrix/Controllers';


const appname = 'Starter';  /** App and root module name */
const deps    = [uiRouter, 'ui.router.stateHelper'];  /** All global dependencies */
const modules = [Controllers];  /** All app dependencies */

document.getElementById('app-container').innerHTML = MatrixView();  /** Store our app. (Getting html from jade) */
angular.module(appname, deps.concat(modules)).config(Config).run(Runners);  /** Declare root module */
angular.bootstrap(document, [appname]);  /** Bootstrap our application. Поехали! */

/** Export appname. Just in case. */
export default appname;
