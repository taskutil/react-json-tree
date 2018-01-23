'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styleIt = require('style-it');

var _styleIt2 = _interopRequireDefault(_styleIt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Renders simple values (eg. strings, numbers, booleans, etc)
 */

var JSONValueNode = function JSONValueNode(_ref) {
  var nodeType = _ref.nodeType,
      styling = _ref.styling,
      labelRenderer = _ref.labelRenderer,
      keyPath = _ref.keyPath,
      valueRenderer = _ref.valueRenderer,
      value = _ref.value,
      valueGetter = _ref.valueGetter,
      diffColour = _ref.diffColour;
  return _react2['default'].createElement(
    _styleIt2['default'],
    null,
    '\n        .tt {\n          display: inline;\n          position: relative;\n        }\n\n        .tt:hover:after{\n            background: #333;\n            background: rgba(0,0,0,.8);\n            border-radius: 5px;\n            bottom: 26px;\n            color: #fff;\n            content: attr(data-path);\n            left: 20%;\n            padding: 5px 15px;\n            position: absolute;\n            z-index: 98;\n            min-width: 220px;\n          text-align: center;\n        }\n\n        .jsonValue {\n          ' + diffColour + ';\n        }\n      ',
    _react2['default'].createElement(
      'li',
      (0, _extends3['default'])({
        className: 'jsonValue'
      }, styling('value', nodeType, keyPath), {
        style: { paddingTop: '0.2em', paddingBottom: '0.2em' }
      }),
      _react2['default'].createElement(
        'label',
        styling(['label', 'valueLabel'], nodeType, keyPath),
        labelRenderer(keyPath, nodeType, false, false)
      ),
      _react2['default'].createElement(
        'span',
        (0, _extends3['default'])({
          'data-path': keyPath.reverse().join(' -> '),
          className: 'tt'
        }, styling('valueText', nodeType, keyPath)),
        valueRenderer.apply(undefined, [valueGetter(value), value].concat(keyPath))
      )
    )
  );
};

JSONValueNode.propTypes = {
  nodeType: _propTypes2['default'].string.isRequired,
  styling: _propTypes2['default'].func.isRequired,
  labelRenderer: _propTypes2['default'].func.isRequired,
  keyPath: _propTypes2['default'].arrayOf(_propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number])).isRequired,
  valueRenderer: _propTypes2['default'].func.isRequired,
  value: _propTypes2['default'].any,
  valueGetter: _propTypes2['default'].func,
  diffColour: _propTypes2['default'].string
};

JSONValueNode.defaultProps = {
  valueGetter: function valueGetter(value) {
    return value;
  }
};

exports['default'] = JSONValueNode;