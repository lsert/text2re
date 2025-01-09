import React, { ReactNode } from 'react';
export default function text2RE(Fn: React.FunctionComponent<any> | React.ComponentClass<any>): <P>(props: Readonly<{
    children?: ReactNode;
} & P>) => React.JSX.Element;
