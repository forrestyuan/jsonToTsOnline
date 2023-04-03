

/**
 * 将 JSON 数据转换为 TypeScript 类型定义
 * @param {Object} object - 要转换的 JSON 对象
 * @param {string} [name=JsonType] - 转换后的类型名称
 * @param {string} [namespace] - 转换后的命名空间
 * @returns {string} - 转换后的 TypeScript 类型定义字符串
 */
function jsonToTs(object, name = 'JsonType', namespace) {
  const getType = value => {
    let typeRes = ``;
    if (Array.isArray(value)) {
      value.forEach(item => {

        let subType = getType(item);
        if (typeRes.split('|').indexOf(subType) < 0) {
          typeRes += subType
          typeRes += "|"
        }
      })
      typeRes = typeRes.substring(0, typeRes.length - 1)
      return `(${typeRes})[]`;
    }
    if (typeof value === 'object' && value !== null) {
      const props = Object.entries(value)
        .map(([key, val]) => ` ${key}: ${getType(val)} `)
        .join(`; \r\n `);
      return `{ \r\n ${props}  \r\n }`;
    }
    return typeof value;
  };

  const type = getType(object);

  const declaration = `interface ${name} ${type}`;

  return namespace ? `namespace ${namespace} { \r\n ${declaration} \r\n}` : declaration;
}

