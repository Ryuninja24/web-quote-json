/**
 * Created by gabello on 8/20/2015.
 */
angular.module('platform.directives', [])
  .directive('validDate', ValidDateFormatter())
  .directive('ucaseFirst', UcaseFirstChar())
  .directive('onlyDigits', DigitsOnly())
  .directive('buttonsRadio', ButtonsRadio());

