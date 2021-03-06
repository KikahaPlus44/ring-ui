import angular from 'angular';
import 'dom4';

import {resolveRelativeURL} from '../global/url';
import {Color, Size} from '../icon/icon__constants';
import '../icon/icon.scss';

/**
 * @name Icon Ng
 * @category Legacy Angular Components
 * @description Provides an Angular wrapper for Icon.
 * @example
    <example name="Icon Ng">
      <file name="index.html">
        <div ng-app="TestApp" ng-strict-di ng-controller="testCtrl">
          <rg-icon glyph="{{icon}}" size="14"></rg-icon>
          <rg-icon glyph="{{icon}}"></rg-icon>
          <rg-icon glyph="{{icon}}" color="ORANGE"></rg-icon>
          <rg-icon glyph="{{icon}}" color="{{'BLUE'}}" loading="true"></rg-icon>
          <rg-icon glyph="{{icon}}" size="64"></rg-icon>
          <rg-icon glyph="{{error}}" height="80" width="100"></rg-icon>
        </div>
      </file>
    <file name="index.js" webpack="true">
      import angular from 'angular';
      import IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';
      import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';
      import {CheckmarkIcon, WarningIcon} from '@jetbrains/ring-ui/components/icon';

      angular.module('TestApp', [ButtonNG, IconNG]).controller('testCtrl', function($scope) {
        $scope.icon = CheckmarkIcon;
        $scope.error = WarningIcon;
      });
    </file>
  </example>
 */

const angularModule = angular.module('Ring.icon', []);
const CLASS_PREFIX = 'ring-icon_';
const LOADING_CLASS = `${CLASS_PREFIX}loading`;
const DEFAULT_SIZE = Size.Size32;

angularModule.directive('rgIcon', function rgIconDirective() {
  return {
    restrict: 'E',
    scope: {
      glyph: '@',
      loading: '=?',
      color: '@?',
      size: '@?',
      height: '@?',
      width: '@?'
    },
    template: require('./icon-ng.html'),
    link: function link(scope, iElement, iAttrs) {
      iAttrs.$addClass('ring-icon');

      scope.resolveGlyph = resolveRelativeURL;

      scope.$watch('loading', value => {
        if (value) {
          iAttrs.$addClass(LOADING_CLASS);
        } else {
          iAttrs.$removeClass(LOADING_CLASS);
        }
      });

      scope.$watch(
        () => scope.color && Color[scope.color] && CLASS_PREFIX + Color[scope.color],
        (colorClass, prevColorClass) => {
          if (colorClass) {
            iAttrs.$addClass(colorClass);

            // Remove previous class, but don't remove initial one
            if (prevColorClass && prevColorClass !== colorClass) {
              iAttrs.$removeClass(prevColorClass);
            }
          }
        }
      );

      scope.$watchGroup(['size', 'width', 'height'], ([size, width, height]) => {
        if (!width && !height) {
          const sizeString = `${size || DEFAULT_SIZE}px`;
          scope.style = {
            width: sizeString,
            height: sizeString
          };
          return;
        }

        scope.style = {};
        if (width) {
          scope.style.width = `${width}px`;
        }
        if (height) {
          scope.style.height = `${height}px`;
        }
      });
    }
  };
});

export default angularModule.name;
