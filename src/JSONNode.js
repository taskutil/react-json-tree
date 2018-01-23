import React from 'react';
import PropTypes from 'prop-types';
import objType from './objType';
import JSONObjectNode from './JSONObjectNode';
import JSONArrayNode from './JSONArrayNode';
import JSONIterableNode from './JSONIterableNode';
import JSONValueNode from './JSONValueNode';

function getDiffValue(rawValue) {
  let diffValue = {};

  let splitValue = rawValue.split('$');

  let colour = 'background-color: ';
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
      let split = diffValue.value.split('=>');
      diffValue.value = split[0];
      diffValue.changedValue = split[1];
    }
  } else {
    diffValue.value = '""';
  }

  return diffValue;
}

const JSONNode = ({
  getItemString,
  keyPath,
  labelRenderer,
  styling,
  value,
  valueRenderer,
  isCustomNode,
  ...rest
}) => {
  const nodeType = isCustomNode(value) ? 'Custom' : objType(value);

  const simpleNodeProps = {
    getItemString,
    key: keyPath[0],
    keyPath,
    labelRenderer,
    nodeType,
    styling,
    value,
    valueRenderer
  };

  const nestedNodeProps = {
    ...rest,
    ...simpleNodeProps,
    data: value,
    isCustomNode
  };

  const isDiffMode = !!rest.diffMode;
  let diffValues = {};
  if (isDiffMode && nodeType === 'String') {
    diffValues = getDiffValue(value);
  }

  switch (nodeType) {
    case 'Object':
    case 'Error':
    case 'WeakMap':
    case 'WeakSet':
      return <JSONObjectNode {...nestedNodeProps} />;
    case 'Array':
      return <JSONArrayNode {...nestedNodeProps} />;
    case 'Iterable':
    case 'Map':
    case 'Set':
      return <JSONIterableNode {...nestedNodeProps} />;
    case 'String':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          diffColour={diffValues.colour}
          valueGetter={raw => {
            if (!isDiffMode) {
              return `"${raw}"`;
            } else {
              if (diffValues.type === 'ValueChanged') {
                return (
                  <span>
                    {rest.diffLabelCreator(diffValues.type)}
                    <span>{`"${diffValues.value}" => "${
                      diffValues.changedValue
                    }"`}</span>
                  </span>
                );
              } else {
                return (
                  <span>
                    {rest.diffLabelCreator(diffValues.type)} {diffValues.value}
                  </span>
                );
              }
            }
          }}
        />
      );
    case 'Number':
      return <JSONValueNode {...simpleNodeProps} />;
    case 'Boolean':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => (raw ? 'true' : 'false')}
        />
      );
    case 'Date':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => raw.toISOString()}
        />
      );
    case 'Null':
      return <JSONValueNode {...simpleNodeProps} valueGetter={() => 'null'} />;
    case 'Undefined':
      return (
        <JSONValueNode {...simpleNodeProps} valueGetter={() => 'undefined'} />
      );
    case 'Function':
    case 'Symbol':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => raw.toString()}
        />
      );
    case 'Custom':
      return <JSONValueNode {...simpleNodeProps} />;
    default:
      return null;
  }
};

JSONNode.propTypes = {
  getItemString: PropTypes.func.isRequired,
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  labelRenderer: PropTypes.func.isRequired,
  styling: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueRenderer: PropTypes.func.isRequired,
  isCustomNode: PropTypes.func.isRequired
};

export default JSONNode;
