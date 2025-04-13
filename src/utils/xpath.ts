/**
 * Evaluate XPath expression with simplified parameters
 * 
 * @param xml XML document
 * @param xpathExpression 
 * @param resultType https://developer.mozilla.org/en-US/docs/Web/API/XPathResult/resultType#Constants
 * @returns XPathResult
 */
export const getXPathResult = (
  xml: Document,
  xpathExpression: string,
  resultType: number
) => {
  return xml.evaluate(
    xpathExpression,
    xml,
    null,
    resultType,
    null
  );
};

/**
 * Get XPath string value
 * 
 * @param xml XMLDocument
 * @param xpathExpression  
 * @returns string XPathResult.stringValue
 * 
 * @tutorial
 * const text =
 *    '<?xml version="1.0" encoding="UTF-8"?>' +
 *    '<root>' +
 *      '<customer email="xpath@mozilla.org" />'
 *    '</root>';
 * const xml = new DOMParser().parseFromString(text, "text/xml");
 * const email = getXPathString(xml, '//customer/@email');
 */
export const getXPathString = (xml: XMLDocument, xpathExpression: string) => {
  return getXPathResult(
    xml,
    xpathExpression,
    XPathResult.STRING_TYPE
  ).stringValue;
};

/**
 * Get XPath number value
 * 
 * @param xml XMLDocument
 * @param xpathExpression  
 * @returns number XPathResult.numberValue
 * 
 * @tutorial
 * const text =
 *    '<?xml version="1.0" encoding="UTF-8"?>' +
 *    '<root>' +
 *      '<customer email="xpath@mozilla.org" />'
 *    '</root>';
 * const xml = new DOMParser().parseFromString(text, "text/xml");
 * const email = getXPathNumber(xml, 'count(//customer)');
 */
export const getXPathNumber = (xml: XMLDocument, xpathExpression: string) => {
  return getXPathResult(
    xml,
    xpathExpression,
    XPathResult.NUMBER_TYPE
  ).numberValue;
};

/**
 * Get XPath boolean value
 * 
 * @param xml
 * @param xpathExpression
 * @returns boolean XPathResult.booleanValue
 * 
 * @tutorial
 * const text =
 *    '<?xml version="1.0" encoding="UTF-8"?>' +
 *    '<root>' +
 *      '<response status="success"/>'
 *    '</root>';
 * const xml = new DOMParser().parseFromString(text, "text/xml");
 * const isSuccess = getXPathBoolen(xml, "//response/@status='success')");
 */
export const getXPathBoolean = (xml: Document, xpathExpression: string) => {
  return getXPathResult(
    xml,
    xpathExpression,
    XPathResult.BOOLEAN_TYPE
  ).booleanValue;
};



/**
 * Returns XPath string value getter function with only xpathExpression as parameter
 * 
 * @param xml 
 * @returns function (xpathExpression: string) => string
 * 
 * @tutorial
 * const text =
 *    '<?xml version="1.0" encoding="UTF-8"?>' +
 *    '<root>' +
 *      '<customer email="xpath@mozilla.org" />'
 *    '</root>';
 * const xml = new DOMParser().parseFromString(text, "text/xml");
 * const getXPathString = getXPathStringFrom(xml);
 * const email = getXPathString('//customer/@email');
 */
export const getXPathStringFrom = (xml: Document) => {
  return (xpathExpression: string) => {
    return getXPathString(xml, xpathExpression);
  };
};
  
/**
 * Returns XPath number value getter function with only xpathExpression as parameter
 * 
 * @param xml
 * @returns function (xpathExpression: string) => number
 * 
 * @tutorial
 * const text =
 *    '<?xml version="1.0" encoding="UTF-8"?>' +
 *    '<root>' +
 *      '<customer email="xpath@mozilla.org"/>'
 *    '</root>';
 * const xml = new DOMParser().parseFromString(text, "text/xml");
 * const getXPathNumber = getXPathNumberFrom(xml);
 * const email = getXPathNumber('count(//customer)');
 */
export const getXPathNumberFrom = (xml: Document) => {
  return (xpathExpression: string) => {
    return getXPathNumber(xml, xpathExpression);
  };
};


/**
 * Returns XPath boolean value getter function with only xpathExpression as parameter
 * 
 * @param xml 
 * @returns boolean XPathResult.booleanValue
 * 
 * @tutorial
 * const text =
 *    '<?xml version="1.0" encoding="UTF-8"?>' +
 *    '<root>' +
 *      '<response status="success"/>'
 *    '</root>';
 * const xml = new DOMParser().parseFromString(text, "text/xml");
 * const getXPathBoolen = getXPathBooleanFrom(xml);
 * const isSuccess = getXPathBoolen("//response/@status='success')");
 */
export const getXPathBooleanFrom = (xml: Document) => {
  return (xpathExpression: string) => {
    return getXPathBoolean(xml, xpathExpression);
  };
};

export const getXPathFrom = (xml: Document) => {
  return {
    getXPathString: getXPathStringFrom(xml),
    getXPathNumber: getXPathNumberFrom(xml),
    getXPathBoolean: getXPathBooleanFrom(xml)
  };
}