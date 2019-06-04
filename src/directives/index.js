import ellipsis from './ellipsis';
import clickoutside from './clickoutside';

const directiveArr = [
  ellipsis,
  clickoutside
];

function directive (Vue, ...rest) {
  return Vue.directive(...rest);
}

const directivesObj = {
  install (Vue) {
    directiveArr.map((val) => directive(Vue, val.name, val.install));
  }
};
export default directivesObj;
