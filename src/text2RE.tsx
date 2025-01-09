import React, { Fragment, ReactNode } from 'react';
interface SimpleDOMPropsIF {
  types: string;
  props: { [x: string]: string };
  children: (string | SimpleDOMPropsIF | null)[];
}

function loop(elem: Element | Node): string | SimpleDOMPropsIF | null {
  if (elem.nodeType === 3) {
    return elem.nodeValue;
  } else if (elem.nodeType === 1) {
    const elems = elem as Element;
    const props: SimpleDOMPropsIF['props'] = {};
    for (let i = 0; i < elems.attributes.length; i++) {
      const attr = elems.attributes.item(i);
      if (attr) {
        props[attr.nodeName] = attr.nodeValue || '';
      }
    }
    return {
      types: elems.tagName.toLowerCase(),
      props,
      children: elem.childNodes.length === 0 ? [] : (() => {
        const { childNodes } = elem;
        const childArr = [];
        for (let i = 0; i < childNodes.length; i++) {
          const child = childNodes.item(i);
          childArr.push(loop(child));
        }
        return childArr;
      })(),
    };
  }
  return null;
}

function parseHTMLText(text: string) {
  let parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const { childNodes } = doc.body;
  const childArr = [];
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes.item(i);
    childArr.push(loop(child));
  }
  return childArr;
}

function isSimpleDOMProps(props: SimpleDOMPropsIF | ReactNode): props is SimpleDOMPropsIF {
  return !!(props && (props as object).hasOwnProperty('types'));
}

function transformCode(code: (SimpleDOMPropsIF | ReactNode)[]) {
  return function Tag(Fn: React.FunctionComponent<any> | React.ComponentClass<any>, Props = {}, ): SimpleDOMPropsIF | ReactNode[] {
    return code.map((item, index) => {
      if (isSimpleDOMProps(item)) {
        return <Fn key={index} name={item.types} {...item.props} {...Props}>{transformCode(item.children)(Fn, Props)}</Fn>;
      }
      return item;
    });
  };
}

export default function text2RE(Fn: React.FunctionComponent<any> | React.ComponentClass<any>) {
  return function <P>(props: Readonly<{ children?: ReactNode } & P>) {
    const { children, ...others } = props;
    let code: (SimpleDOMPropsIF | string | null)[] = [];
    if (children) {
      React.Children.forEach(children, (child) => {
        if (typeof child === 'string') {
          code.push(...parseHTMLText(child));
        } else {
          code.push(child as string);
        }
      });
    }
    return <Fragment>
      {transformCode(code)(Fn, others)}
    </Fragment>;
  };
}
