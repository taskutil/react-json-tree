'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _objType = require('./objType');

var _objType2 = _interopRequireDefault(_objType);

var _JSONObjectNode = require('./JSONObjectNode');

var _JSONObjectNode2 = _interopRequireDefault(_JSONObjectNode);

var _JSONArrayNode = require('./JSONArrayNode');

var _JSONArrayNode2 = _interopRequireDefault(_JSONArrayNode);

var _JSONIterableNode = require('./JSONIterableNode');

var _JSONIterableNode2 = _interopRequireDefault(_JSONIterableNode);

var _JSONValueNode = require('./JSONValueNode');

var _JSONValueNode2 = _interopRequireDefault(_JSONValueNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDiffValue(rawValue) {
  var diffValue = {};

  var splitValue = rawValue.split('$');

  var colour = 'background-color: ';
  switch (splitValue[0]) {
    case 'Unique':
      colour += 'rgba(255, 0, 0, 0.4)';
      diffValue.type = 'Unique';
      break;
    case 'Missing':
      colour += 'rgba(0, 255, 0, 0.4)';
      diffValue.type = 'Missing';
      break;
    case 'ValueChanged':
      colour += 'rgba(255, 255, 0, 0.4)';
      diffValue.type = 'ValueChanged';
      break;
    default:
      colour += 'transparent';
      diffValue.type = 'Unknown';
      break;
  }
  diffValue.colour = colour;

  if (splitValue[1]) {
    diffValue.value = decodeURIComponent(splitValue[1]);
    if (diffValue.value.indexOf('=>') !== -1) {
      var split = diffValue.value.split('=>');
      diffValue.value = split[0];
      diffValue.changedValue = split[1];
    }
  } else {
    diffValue.value = '""';
  }

  return diffValue;
}

var JSONNode = function JSONNode(_ref) {
  var getItemString = _ref.getItemString,
      keyPath = _ref.keyPath,
      labelRenderer = _ref.labelRenderer,
      styling = _ref.styling,
      value = _ref.value,
      valueRenderer = _ref.valueRenderer,
      isCustomNode = _ref.isCustomNode,
      rest = (0, _objectWithoutProperties3['default'])(_ref, ['getItemString', 'keyPath', 'labelRenderer', 'styling', 'value', 'valueRenderer', 'isCustomNode']);

  var nodeType = isCustomNode(value) ? 'Custom' : (0, _objType2['default'])(value);

  var simpleNodeProps = {
    getItemString: getItemString,
    key: keyPath[0],
    keyPath: keyPath,
    labelRenderer: labelRenderer,
    nodeType: nodeType,
    styling: styling,
    value: value,
    valueRenderer: valueRenderer
  };

  var nestedNodeProps = (0, _extends3['default'])({}, rest, simpleNodeProps, {
    data: value,
    isCustomNode: isCustomNode
  });

  var isDiffMode = !!rest.diffMode;
  var diffValues = {};
  if (isDiffMode && nodeType === 'String') {
    diffValues = getDiffValue(value);
    console.info(diffValues);
  }

  switch (nodeType) {
    case 'Object':
    case 'Error':
    case 'WeakMap':
    case 'WeakSet':
      return _react2['default'].createElement(_JSONObjectNode2['default'], nestedNodeProps);
    case 'Array':
      return _react2['default'].createElement(_JSONArrayNode2['default'], nestedNodeProps);
    case 'Iterable':
    case 'Map':
    case 'Set':
      return _react2['default'].createElement(_JSONIterableNode2['default'], nestedNodeProps);
    case 'String':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, {
        diffColour: diffValues.colour,
        valueGetter: function valueGetter(raw) {
          if (!isDiffMode) {
            return '"' + raw + '"';
          } else {
            if (diffValues.type === 'ValueChanged') {
              return _react2['default'].createElement(
                'span',
                null,
                rest.diffLabelCreator(diffValues.type),
                _react2['default'].createElement(
                  'span',
                  null,
                  '"' + diffValues.value + '" => "' + diffValues.changedValue + '"'
                )
              );
            } else {
              return _react2['default'].createElement(
                'span',
                null,
                rest.diffLabelCreator(diffValues.type),
                ' ',
                diffValues.value
              );
            }
          }
        }
      }));
    case 'Number':
      return _react2['default'].createElement(_JSONValueNode2['default'], simpleNodeProps);
    case 'Boolean':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, {
        valueGetter: function valueGetter(raw) {
          return raw ? 'true' : 'false';
        }
      }));
    case 'Date':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, {
        valueGetter: function valueGetter(raw) {
          return raw.toISOString();
        }
      }));
    case 'Null':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueGetter: function valueGetter() {
          return 'null';
        } }));
    case 'Undefined':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, { valueGetter: function valueGetter() {
          return 'undefined';
        } }));
    case 'Function':
    case 'Symbol':
      return _react2['default'].createElement(_JSONValueNode2['default'], (0, _extends3['default'])({}, simpleNodeProps, {
        valueGetter: function valueGetter(raw) {
          return raw.toString();
        }
      }));
    case 'Custom':
      return _react2['default'].createElement(_JSONValueNode2['default'], simpleNodeProps);
    default:
      return null;
  }
};

JSONNode.propTypes = {
  getItemString: _propTypes2['default'].func.isRequired,
  keyPath: _propTypes2['default'].arrayOf(_propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number])).isRequired,
  labelRenderer: _propTypes2['default'].func.isRequired,
  styling: _propTypes2['default'].func.isRequired,
  value: _propTypes2['default'].any,
  valueRenderer: _propTypes2['default'].func.isRequired,
  isCustomNode: _propTypes2['default'].func.isRequired
};

exports['default'] = JSONNode;