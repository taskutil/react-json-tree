import React from 'react';
import PropTypes from 'prop-types';
import Style from 'style-it';

/**
 * Renders simple values (eg. strings, numbers, booleans, etc)
 */

const JSONValueNode = ({
  nodeType,
  styling,
  labelRenderer,
  keyPath,
  valueRenderer,
  value,
  valueGetter,
  diffColour
}) => (
  <Style>
    {`
        .tt {
          display: inline;
          position: relative;
        }

        .tt:hover:after{
            background: #333;
            background: rgba(0,0,0,.8);
            border-radius: 5px;
            bottom: 26px;
            color: #fff;
            content: attr(data-path);
            left: 20%;
            padding: 5px 15px;
            position: absolute;
            z-index: 98;
            min-width: 220px;
          text-align: center;
        }

        .jsonValue {
          ${diffColour};
        }
      `}
    <li className="jsonValue" {...styling('value', nodeType, keyPath)}>
      <label {...styling(['label', 'valueLabel'], nodeType, keyPath)}>
        {labelRenderer(keyPath, nodeType, false, false)}
      </label>
      <span
        data-path={keyPath.reverse().join(' -> ')}
        className="tt"
        {...styling('valueText', nodeType, keyPath)}
      >
        {valueRenderer(valueGetter(value), value, ...keyPath)}
      </span>
    </li>
  </Style>
);

JSONValueNode.propTypes = {
  nodeType: PropTypes.string.isRequired,
  styling: PropTypes.func.isRequired,
  labelRenderer: PropTypes.func.isRequired,
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  valueRenderer: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueGetter: PropTypes.func,
  diffColour: PropTypes.string
};

JSONValueNode.defaultProps = {
  valueGetter: value => value
};

export default JSONValueNode;
