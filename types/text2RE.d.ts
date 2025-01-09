import React from 'react';
export default function text2RE(Fn: React.FunctionComponent<any> | React.ComponentClass<any>): <P>(props: Readonly<{
    children?: React.ReactNode;
} & P>) => JSX.Element;
